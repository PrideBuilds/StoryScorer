import { createClient } from "@/lib/supabase/server";
import { getPlanLimit } from "@/lib/config/pricing";

export interface UsageCheckResult {
  allowed: boolean;
  current: number;
  limit: number | "unlimited";
  remaining: number | "unlimited";
  percentage: number;
}

/**
 * Check if user has reached their usage limit for the current period
 */
export async function checkUsageLimit(): Promise<UsageCheckResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      allowed: false,
      current: 0,
      limit: 10,
      remaining: 0,
      percentage: 100,
    };
  }

  // Get user's subscription
  const { data: subscriptionResult } = await supabase
    .from("subscriptions")
    .select("plan_type, current_period_start")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Type assertion for the subscription data
  const subscription = subscriptionResult as {
    plan_type?: string;
    current_period_start?: string;
  } | null;

  const planType = (subscription?.plan_type || "free") as
    | "free"
    | "pro"
    | "enterprise";

  const limit = getPlanLimit(planType);

  if (limit === "unlimited") {
    return {
      allowed: true,
      current: 0,
      limit: "unlimited",
      remaining: "unlimited",
      percentage: 0,
    };
  }

  // Get period start date
  const periodStart = subscription?.current_period_start
    ? new Date(subscription.current_period_start)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Count usage for current period
  const { count } = await supabase
    .from("user_stories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", periodStart.toISOString());

  const current = count || 0;
  const remaining = Math.max(limit - current, 0);
  const percentage = (current / limit) * 100;
  const allowed = current < limit;

  return {
    allowed,
    current,
    limit,
    remaining,
    percentage,
  };
}

/**
 * Track usage when a feature is used
 */
export async function trackUsage(featureName: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  // Get current period
  const { data: subscriptionResult } = await supabase
    .from("subscriptions")
    .select("current_period_start")
    .eq("user_id", user.id)
    .single();

  // Type assertion for the subscription data
  const subscription = subscriptionResult as {
    current_period_start?: string;
  } | null;

  const periodStart = subscription?.current_period_start
    ? new Date(subscription.current_period_start)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Check if usage tracking entry exists for this period
  const { data: existingResult } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", user.id)
    .eq("feature_used", featureName)
    .gte("period_start", periodStart.toISOString())
    .lte("period_end", periodEnd.toISOString())
    .single();

  // Type assertion for the existing data
  const existing = existingResult as {
    id: string;
    usage_count: number;
  } | null;

  if (existing) {
    // Update existing entry - use any cast for Supabase client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any;
    const { error } = await supabaseAny
      .from("usage_tracking")
      .update({
        usage_count: existing.usage_count + 1,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Create new entry - use any cast for Supabase client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any;
    const { error } = await supabaseAny.from("usage_tracking").insert({
      user_id: user.id,
      feature_used: featureName,
      usage_count: 1,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    });

    if (error) {
      return { error: error.message };
    }
  }

  return { success: true };
}
