import { createClient } from "@/lib/supabase/server";

export async function getUserStats() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    // Get total stories count
    const { count: totalStories } = await supabase
      .from("user_stories")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get current month stories count
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const { count: currentMonthStories } = await supabase
      .from("user_stories")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    // Get subscription info
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    // Type assertion to fix TypeScript inference issue
    const typedSubscription = subscription as {
      plan_type: "free" | "pro" | "enterprise";
      status: string;
      current_period_end: string;
    } | null;

    // Calculate days remaining in billing period
    let daysRemaining: number | null = null;
    if (typedSubscription?.current_period_end) {
      const endDate = new Date(typedSubscription.current_period_end);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      totalStories: totalStories || 0,
      currentMonthStories: currentMonthStories || 0,
      planType: typedSubscription?.plan_type || "free",
      daysRemaining: daysRemaining,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRecentStories(limit: number = 5) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("user_stories")
      .select("id, title, score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { error: error.message };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error fetching recent stories:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
