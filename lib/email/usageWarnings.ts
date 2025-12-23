import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/utils/checkUsageLimit";
import { sendUsageWarningEmail } from "./send";

/**
 * In-memory cache to track when warnings were last sent
 * Key: `${userId}_${threshold}`, Value: timestamp
 * This prevents sending multiple warnings for the same threshold within a short period
 */
const warningCache = new Map<string, number>();
const WARNING_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

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
      // Round to nearest 10% threshold (80%, 90%, 100%)
      const warningThreshold = Math.floor(usageResult.percentage / 10) * 10;
      const warningKey = `${user.id}_${warningThreshold}`;

      // Check if we've already sent a warning for this threshold recently
      const lastWarningTime = warningCache.get(warningKey);
      const now = Date.now();

      if (lastWarningTime && now - lastWarningTime < WARNING_COOLDOWN_MS) {
        // Warning already sent within cooldown period, skip
        console.log(
          `Skipping usage warning for user ${user.id} at ${warningThreshold}% - already sent within 24h`
        );
        return;
      }

      // Send the warning email
      await sendUsageWarningEmail({
        userEmail: user.email || "",
        usage: usageResult.current,
        limit: usageResult.limit,
        percentage: usageResult.percentage,
        featureName: "story analyses",
      });

      // Update cache to prevent duplicate warnings
      warningCache.set(warningKey, now);

      // Clean up old entries from cache (older than cooldown period)
      Array.from(warningCache.entries()).forEach(([key, timestamp]) => {
        if (now - timestamp > WARNING_COOLDOWN_MS) {
          warningCache.delete(key);
        }
      });
    }
  } catch (error) {
    console.error("Error checking usage warning:", error);
    // Don't throw - this is a background task
  }
}
