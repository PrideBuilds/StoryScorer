# Email Notification System

This directory contains the email notification system for StoryScorer.

## Setup

### 1. Install Dependencies

```bash
npm install resend @react-email/components @react-email/render
```

### 2. Configure Resend

1. Create a Resend account at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```
4. Verify your domain in the Resend dashboard

### 3. Environment Variables

Required:

- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Email address to send from (optional, defaults to noreply@storyscorer.com)

Optional:

- `NEXT_PUBLIC_APP_URL` - Base URL for links in emails (defaults to https://storyscorer.com)

## Email Templates

All email templates are in `/emails` directory:

- `WelcomeEmail.tsx` - Sent after user signup
- `PasswordResetEmail.tsx` - For password resets (currently using Supabase default)
- `SubscriptionConfirmation.tsx` - Sent after successful subscription
- `UsageLimitWarning.tsx` - Sent when usage reaches 80% of limit
- `PaymentFailed.tsx` - Sent when payment fails

## Email Functions

All email sending functions are in `/lib/email/send.ts`:

- `sendWelcomeEmail()` - Welcome new users
- `sendPasswordResetEmail()` - Password reset (not currently used, Supabase handles this)
- `sendSubscriptionEmail()` - Subscription confirmation
- `sendUsageWarningEmail()` - Usage limit warnings
- `sendPaymentFailedEmail()` - Payment failure notifications

## Integration Points

### Signup Flow

- Welcome email is sent automatically after successful signup in `app/actions/auth.ts`

### Subscription Flow

- Subscription confirmation email is sent in `app/api/webhooks/stripe/route.ts` when `checkout.session.completed` event is received

### Payment Failed

- Payment failed email is sent in `app/api/webhooks/stripe/route.ts` when `invoice.payment_failed` event is received

### Usage Warnings

- Usage warning emails should be checked periodically (e.g., via cron job)
- Use `checkAndSendUsageWarning()` from `lib/email/usageWarnings.ts`
- Set up a scheduled task to call this function daily or after usage tracking

## Testing

To test email templates locally, you can use React Email's preview feature:

```bash
npx react-email dev
```

This will start a preview server where you can see all email templates.

## Production Notes

- All email sends include retry logic (3 retries with 1 second delay)
- All email sends are logged for debugging
- Email failures don't block user flows (they're caught and logged)
- Consider setting up email preferences in user settings to allow opt-out
