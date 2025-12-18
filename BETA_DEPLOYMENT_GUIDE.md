# Beta/Staging Deployment Guide

This guide will help you deploy StoryScorer to a beta/staging environment that you can share with prospective users without going fully to production.

## Overview

**Beta Environment Benefits:**
- ✅ Shareable URL (e.g., `beta.storyscorer.com` or `storyscorer-beta.vercel.app`)
- ✅ Stripe Test Mode (no real charges)
- ✅ Separate from production data
- ✅ Easy to update and iterate
- ✅ Can add access restrictions if needed

## Step 1: Deploy to Vercel (Recommended)

### 1.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up (free tier is perfect for beta)
2. Connect your GitHub account (recommended) or use GitLab/Bitbucket

### 1.2 Import Your Project
1. Click "Add New Project" in Vercel dashboard
2. Import your StoryScorer repository
3. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `storyscorer` (if your repo has nested structure)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### 1.3 Configure Environment Variables

Add these environment variables in Vercel dashboard (Project Settings → Environment Variables):

#### Required Variables:

```bash
# Supabase (use a separate staging project or same project with different keys)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (USE TEST MODE KEYS - starts with sk_test_ and pk_test_)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (for test mode webhooks)

# Site URL (your beta URL)
NEXT_PUBLIC_SITE_URL=https://your-beta-url.vercel.app

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=StoryScorer Beta
NEXT_PUBLIC_APP_ENV=beta
```

#### Important Notes:
- **Stripe:** Use TEST MODE keys (starts with `sk_test_` and `pk_test_`)
- **Supabase:** Consider creating a separate project for beta, or use the same project but be aware data will be shared
- **Site URL:** Update this to your actual beta URL after first deployment

### 1.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Your beta site will be live at: `your-project-name.vercel.app`

### 1.5 Set Up Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your domain: `beta.storyscorer.com` (or whatever you prefer)
3. Follow DNS instructions to point your domain to Vercel
4. SSL certificate is automatically provisioned

## Step 2: Configure Stripe for Beta

### 2.1 Use Stripe Test Mode
- Your Stripe keys should already be test mode (`sk_test_...` and `pk_test_...`)
- Test mode allows you to:
  - Use test credit cards (4242 4242 4242 4242)
  - Test subscriptions without real charges
  - See all transactions in Stripe Dashboard → Test Mode

### 2.2 Set Up Test Mode Webhook
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your beta webhook URL: `https://your-beta-url.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 2.3 Test Payment Flow
Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

## Step 3: Set Up Supabase for Beta

### Option A: Use Same Project (Simpler)
- Use your existing Supabase project
- **Pros:** No setup needed, same database
- **Cons:** Beta and production share data (may want to separate)

### Option B: Create Separate Beta Project (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project: "StoryScorer Beta"
3. Run your database migrations:
   ```sql
   -- Copy all your schema from production
   -- Run all CREATE TABLE, CREATE POLICY, etc. statements
   ```
4. Update Vercel environment variables with new project keys
5. **Pros:** Complete data separation
6. **Cons:** Need to maintain two databases

## Step 4: Add Beta Mode Indicators (Optional)

Add visual indicators that this is a beta version:

### 4.1 Create Beta Banner Component

Create `components/ui/BetaBanner.tsx`:

```tsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function BetaBanner() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "beta") {
    return null;
  }

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <Info className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <strong>Beta Version:</strong> This is a beta environment. 
        All payments are in test mode and no real charges will occur.
      </AlertDescription>
    </Alert>
  );
}
```

### 4.2 Add to Layout

Add to `app/layout.tsx`:

```tsx
import { BetaBanner } from "@/components/ui/BetaBanner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BetaBanner />
        {children}
      </body>
    </html>
  );
}
```

## Step 5: Add Access Restrictions (Optional)

### Option A: Password Protection (Vercel Pro)
- Requires Vercel Pro plan ($20/month)
- Built-in password protection in Vercel dashboard
- Easiest option

### Option B: Invite-Only Access
Create middleware to check for beta access:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BETA_ACCESS_EMAILS = [
  "user1@example.com",
  "user2@example.com",
  // Add beta tester emails
];

export async function middleware(request: NextRequest) {
  // Only apply to beta environment
  if (process.env.NEXT_PUBLIC_APP_ENV !== "beta") {
    return NextResponse.next();
  }

  // Allow public pages
  if (request.nextUrl.pathname.startsWith("/api") || 
      request.nextUrl.pathname.startsWith("/auth") ||
      request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // Check if user is authenticated and has beta access
  // This requires checking Supabase session
  // Implementation depends on your auth setup

  return NextResponse.next();
}
```

### Option C: Simple Access Code
Add a simple access code check on landing page:

```tsx
// app/page.tsx - Add access code check
const BETA_ACCESS_CODE = "STORYSCORER2024"; // Change this

// Check for access code in URL or form
```

## Step 6: Testing Checklist

Before sharing with users, test:

- [ ] Sign up flow works
- [ ] Login/logout works
- [ ] Story analysis works
- [ ] Payment flow works (with test card)
- [ ] Subscription upgrade works
- [ ] Emails are sending
- [ ] Webhooks are working (check Stripe dashboard)
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] Beta banner shows (if added)

## Step 7: Share Beta URL

Once deployed and tested:

1. **Share the URL:** `https://your-beta-url.vercel.app`
2. **Provide Test Instructions:**
   - Use test card: `4242 4242 4242 4242`
   - Any future date for expiry
   - Any 3-digit CVC
   - Any ZIP code
3. **Set Expectations:**
   - This is a beta version
   - Payments are in test mode
   - Data may be reset
   - Report bugs to [your email]

## Step 8: Monitor Beta Usage

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor page views, performance, errors

### Stripe Dashboard
- Monitor test mode transactions
- Check webhook delivery status
- Review subscription activity

### Supabase Dashboard
- Monitor database usage
- Check authentication logs
- Review error logs

## Step 9: Update and Iterate

### Deploy Updates
1. Push changes to your Git repository
2. Vercel automatically deploys (if connected to Git)
3. Or manually deploy from Vercel dashboard

### Environment Variables
- Update in Vercel dashboard → Settings → Environment Variables
- Redeploy after changes

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check for TypeScript errors locally first

### Stripe Not Working
- Verify test mode keys are set
- Check webhook endpoint is correct
- Verify webhook secret matches

### Database Issues
- Verify Supabase keys are correct
- Check database connection in Supabase dashboard
- Review RLS policies are set correctly

## Next Steps: Moving to Production

When ready for production:

1. **Create Production Stripe Account:**
   - Get live mode keys (`sk_live_...` and `pk_live_...`)
   - Set up production webhooks
   - Create production products/prices

2. **Set Up Production Supabase:**
   - Create production project
   - Run migrations
   - Set up backups

3. **Deploy to Production:**
   - Create new Vercel project or use same with production environment
   - Set production environment variables
   - Use custom domain

4. **Update Environment:**
   - Change `NEXT_PUBLIC_APP_ENV=production`
   - Remove beta banner (or make it conditional)

## Quick Start Commands

```bash
# 1. Install Vercel CLI (optional, for local testing)
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project (if using CLI)
vercel link

# 4. Deploy
vercel --prod  # or deploy from dashboard
```

## Support

For issues:
- Check Vercel deployment logs
- Review Stripe webhook logs
- Check Supabase logs
- Review browser console for errors

