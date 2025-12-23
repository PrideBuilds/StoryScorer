# Stripe Webhook Setup Guide

## For Local Development

### Step 1: Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### Step 2: Login to Stripe CLI

```bash
stripe login
```

### Step 3: Forward Webhooks to Local Server

In a **separate terminal** (keep your dev server running), run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook signing secret that looks like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Add Webhook Secret to .env.local

Copy the webhook secret and add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Restart Your Dev Server

After adding the webhook secret, restart your Next.js dev server.

### Step 6: Test the Webhook

1. Make a test purchase
2. The Stripe CLI terminal will show the webhook events being forwarded
3. Your server logs should show the webhook being processed

## For Production

### Step 1: Deploy Your Application

Make sure your app is deployed and accessible at a public URL (e.g., `https://storyscorer.com`).

### Step 2: Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://storyscorer.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"

### Step 3: Get Webhook Signing Secret

1. Click on your newly created webhook endpoint
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 4: Add to Production Environment Variables

Add the webhook secret to your production environment variables:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Test Webhook

1. Use Stripe's "Send test webhook" feature in the dashboard
2. Or make a test purchase and verify the webhook is received

## Troubleshooting

### Webhook Not Received

- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify the webhook URL is accessible (for production)
- Check server logs for errors
- Use Stripe Dashboard → Webhooks → View logs to see delivery attempts

### "Webhook signature verification failed"

- Make sure you're using the correct webhook secret
- The secret must match the endpoint (test vs live mode)
- Restart your server after updating the secret

### Subscription Not Updating

- Check server logs for webhook processing errors
- Verify the webhook is actually being received (check Stripe Dashboard logs)
- Ensure `createAdminClient()` is working correctly (check Supabase service role key)
