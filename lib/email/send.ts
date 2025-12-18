"use server";

import { render } from "@react-email/render";
import { getResendClient, getFromEmail } from "./client";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { SubscriptionConfirmation } from "@/emails/SubscriptionConfirmation";
import { UsageLimitWarning } from "@/emails/UsageLimitWarning";
import { PaymentFailed } from "@/emails/PaymentFailed";
import type {
  WelcomeEmailData,
  PasswordResetEmailData,
  SubscriptionEmailData,
  UsageWarningEmailData,
  PaymentFailedEmailData,
} from "./types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Retry logic for email sending
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

/**
 * Log email send attempt
 */
function logEmailSend(
  type: string,
  to: string,
  success: boolean,
  error?: string
) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Email ${type} to ${to}: ${
    success ? "SUCCESS" : "FAILED"
  }${error ? ` - ${error}` : ""}`;

  if (success) {
    console.log(logMessage);
  } else {
    console.error(logMessage);
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const html = await render(
      WelcomeEmail({
        userName: data.userName,
        loginUrl: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
          : "https://storyscorer.com/login",
      })
    );

    await retryOperation(async () => {
      return await resend.emails.send({
        from: fromEmail,
        to: data.userEmail,
        subject: "Welcome to StoryScorer! 🎉",
        html,
      });
    });

    logEmailSend("Welcome", data.userEmail, true);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logEmailSend("Welcome", data.userEmail, false, errorMessage);
    console.error("Failed to send welcome email:", error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  data: PasswordResetEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const html = await render(
      PasswordResetEmail({
        resetLink: data.resetLink,
        expiresIn: data.expiresIn || "1 hour",
      })
    );

    await retryOperation(async () => {
      return await resend.emails.send({
        from: fromEmail,
        to: data.userEmail,
        subject: "Reset Your StoryScorer Password",
        html,
      });
    });

    logEmailSend("Password Reset", data.userEmail, true);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logEmailSend("Password Reset", data.userEmail, false, errorMessage);
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionEmail(
  data: SubscriptionEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const html = await render(
      SubscriptionConfirmation({
        planName: data.planName,
        amount: data.amount,
        billingPeriod: data.billingPeriod || "month",
        dashboardUrl: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
          : "https://storyscorer.com/dashboard",
      })
    );

    await retryOperation(async () => {
      return await resend.emails.send({
        from: fromEmail,
        to: data.userEmail,
        subject: `Welcome to ${data.planName}!`,
        html,
      });
    });

    logEmailSend("Subscription", data.userEmail, true);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logEmailSend("Subscription", data.userEmail, false, errorMessage);
    console.error("Failed to send subscription email:", error);
    return false;
  }
}

/**
 * Send usage limit warning email
 */
export async function sendUsageWarningEmail(
  data: UsageWarningEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const html = await render(
      UsageLimitWarning({
        usage: data.usage,
        limit: data.limit,
        percentage: data.percentage,
        featureName: data.featureName || "story analyses",
        upgradeUrl: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
          : "https://storyscorer.com/pricing",
      })
    );

    const subject =
      data.percentage >= 100
        ? "⚠️ You've Reached Your Usage Limit"
        : `Usage Limit Warning: ${data.percentage}% Used`;

    await retryOperation(async () => {
      return await resend.emails.send({
        from: fromEmail,
        to: data.userEmail,
        subject,
        html,
      });
    });

    logEmailSend("Usage Warning", data.userEmail, true);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logEmailSend("Usage Warning", data.userEmail, false, errorMessage);
    console.error("Failed to send usage warning email:", error);
    return false;
  }
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  data: PaymentFailedEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const html = await render(
      PaymentFailed({
        amount: data.amount,
        lastPaymentDate: data.lastPaymentDate,
        retryDate: data.retryDate,
        billingUrl: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
          : "https://storyscorer.com/dashboard/billing",
        supportLink: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/support`
          : "https://storyscorer.com/support",
      })
    );

    await retryOperation(async () => {
      return await resend.emails.send({
        from: fromEmail,
        to: data.userEmail,
        subject: "Action Required: Payment Failed",
        html,
      });
    });

    logEmailSend("Payment Failed", data.userEmail, true);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logEmailSend("Payment Failed", data.userEmail, false, errorMessage);
    console.error("Failed to send payment failed email:", error);
    return false;
  }
}
