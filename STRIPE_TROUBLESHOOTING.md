# Stripe Checkout Troubleshooting

If you're seeing "Failed to create checkout session" error, check the following:

## 1. Verify Environment Variables

Make sure these are set in your `.env.local` file:

```bash
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key (starts with sk_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key (starts with pk_)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Your site URL
```

**Important:** 
- Use `sk_test_...` for development (test mode)
- Use `sk_live_...` for production (live mode)
- Make sure you're using the correct keys for your environment

## 2. Verify Price IDs

Check that your Price IDs in `/lib/config/pricing.ts` match your Stripe dashboard:

1. Go to Stripe Dashboard → Products
2. Click on each product (Pro, Enterprise)
3. Copy the Price ID (starts with `price_...`)
4. Update `stripePriceId.monthly` and `stripePriceId.annual` in the pricing config

## 3. Check Stripe API Key Format

Your Stripe secret key should:
- Start with `sk_test_` (test mode) or `sk_live_` (live mode)
- Be the full key, not truncated
- Have no extra spaces or quotes

## 4. Check Server Logs

Check your terminal/console where `npm run dev` is running for detailed error messages. Look for:
- "Stripe API error:" messages
- "Error creating Stripe customer:" messages
- Any authentication errors

## 5. Verify Stripe Account Status

- Make sure your Stripe account is active
- Check that you haven't hit any API rate limits
- Verify your account has the necessary permissions

## 6. Test Stripe Connection

You can test if Stripe is working by checking the server logs when clicking "Get Started". The error message should include more details about what failed.

## Common Error Messages

### "Stripe is not configured"
- **Solution:** Add `STRIPE_SECRET_KEY` to `.env.local`

### "Invalid API Key provided"
- **Solution:** Check that your Stripe secret key is correct and complete

### "No such price: 'price_...'"
- **Solution:** Verify the Price ID exists in your Stripe dashboard and matches the config

### "Failed to create customer"
- **Solution:** Check Stripe account status and API key permissions

## Quick Test

To verify your Stripe setup is working, you can check the browser console (F12) and server logs when clicking "Get Started". The error message will show the specific Stripe error.

