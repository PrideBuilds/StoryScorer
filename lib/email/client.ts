import { Resend } from "resend";

/**
 * Initialize Resend client for sending emails
 *
 * To set up:
 * 1. Create a Resend account at https://resend.com
 * 2. Get your API key from the dashboard
 * 3. Add RESEND_API_KEY to your .env.local file
 * 4. Verify your domain in the Resend dashboard
 */
let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Please add it to your environment variables."
    );
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

/**
 * Get the from email address
 * Defaults to noreply@yourdomain.com or uses RESEND_FROM_EMAIL env variable
 */
export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    process.env.NEXT_PUBLIC_APP_EMAIL ||
    "noreply@storyscorer.com"
  );
}
