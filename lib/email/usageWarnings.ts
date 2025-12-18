import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/utils/checkUsageLimit";
import { sendUsageWarningEmail } from "./send";

/**
 * Check usage and send warning email if at or above 80% of limit
 * This should be called periodically or after usage tracking
 */
export async function checkAndSendUsageWarning(): Promise<void> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return;
    }

    const usageResult = await checkUsageLimit();

    // Only send warning if usage is at or above 80% and not unlimited
    if (
      usageResult.limit !== "unlimited" &&
      usageResult.percentage >= 80 &&
      usageResult.current > 0
    ) {
      // Check if we've already sent a warning for this usage level
      // (to avoid spamming users)
      const warningThreshold = Math.floor(usageResult.percentage / 10) * 10; // Round to nearest 10%
      const _warningKey = `usage_warning_${warningThreshold}`;

      // Check user metadata for last warning sent
      const { data: _profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // For now, we'll send the warning (in production, you'd track this in a separate table)
      // to avoid sending multiple warnings for the same threshold

      await sendUsageWarningEmail({
        userEmail: user.email || "",
        usage: usageResult.current,
        limit: usageResult.limit,
        percentage: usageResult.percentage,
        featureName: "story analyses",
      });
    }
  } catch (error) {
    console.error("Error checking usage warning:", error);
    // Don't throw - this is a background task
  }
}
