# Deployment Guide for StoryScorer

This guide covers the requirements and steps for deploying StoryScorer to production environments like Vercel or Netlify.

## Environment Variables

The following environment variables are **REQUIRED** for the application to function correctly. Faiure to set these will result in runtime errors.

### Supabase (Database & Auth)

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep this secret!).

### AI Providers (At least one required)

- `OPENAI_API_KEY`: API key for OpenAI (GPT-4o).
- `ANTHROPIC_API_KEY`: API key for Anthropic (Claude 3.5 Sonnet).

### Stripe (Payments)

- `STRIPE_SECRET_KEY`: Stripe secret key (sk\_...).
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (pk\_...).
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhooks (whsec\_...).

### Email (Resend)

- `RESEND_API_KEY`: API key from Resend.
- `RESEND_FROM_EMAIL`: (Optional) Sender email address (default: noreply@storyscorer.com).
- `NEXT_PUBLIC_APP_EMAIL`: (Optional) Support email address.

### Application Settings

- `NEXT_PUBLIC_APP_URL`: The absolute URL of your deployed application (e.g., `https://storyscorer.vercel.app`).
  - **Important**: This is used for generating authentication callbacks and email links.

---

## Known Limitations & Caveats

### Rate Limiting on Serverless

> [!WARNING]
> The current rate limiting implementation (`lib/security/rateLimit.ts`) uses **in-memory storage**.
> On serverless platforms (Vercel, Netlify), this memory is **not shared** between requests and is ephemeral.

**Impact**: Users may be able to bypass rate limits if requests hit different serverless function instances.
**Recommendation**: For strict production rate limiting, migrate to a Redis-based solution (e.g., Upstash).

### Image Optimization (Netlify)

If deploying to Netlify, `next.config.mjs` is already configured with `unoptimized: true` to avoid issues with Netlify's image handling if you are not using their specialized plugin.

---

## Build Commands

- **Build**: `npm run build`
- **Start**: `npm run start`

## Verification

After deployment:

1. **Test Authentication**: Sign up and Log in to verify Supabase connection.
2. **Test AI Analysis**: Submit a story to verify OpenAI/Anthropic keys.
3. **Test Stripe**: Go to pricing and attempt a checkout (in test mode).
