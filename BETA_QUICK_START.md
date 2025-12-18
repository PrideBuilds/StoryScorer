# Beta Deployment Quick Start

## 🚀 Fast Track to Beta (15 minutes)

### Step 1: Deploy to Vercel (5 min)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "Add New Project"**
3. **Import your GitHub repository** (or connect GitLab/Bitbucket)
4. **Configure:**
   - Framework: Next.js (auto-detected)
   - **Root Directory: `storyscorer`** ⚠️ **CRITICAL:** If your Next.js app is in a `storyscorer` subdirectory, you MUST set this!
   - Build Command: `npm run build` (default)
5. **Click "Deploy"** (don't add env vars yet)

**⚠️ IMPORTANT - If you get "Module not found" errors:**
- Go to **Project Settings → General → Root Directory**
- Set it to `storyscorer` (the folder containing your `package.json`)
- Save and redeploy
- See `VERCEL_DEPLOYMENT_FIX.md` for detailed troubleshooting

### Step 2: Add Environment Variables (5 min)

After first deployment, go to **Project Settings → Environment Variables** and add:

```bash
# Copy from your .env.local file:

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (MUST be test mode keys - sk_test_ and pk_test_)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Site URL (update after first deploy)
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app

# Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_EMAIL=noreply@yourdomain.com

# Beta Mode
NEXT_PUBLIC_APP_ENV=beta
```

**Important:** 
- ✅ Use Stripe **TEST MODE** keys (starts with `sk_test_` and `pk_test_`)
- ✅ Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL after deployment

### Step 3: Redeploy (2 min)

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

### Step 4: Set Up Stripe Webhook (3 min)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter: `https://your-project-name.vercel.app/api/webhooks/stripe`
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Copy the **webhook secret** (starts with `whsec_`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`
7. **Redeploy** again

### Step 5: Test (2 min)

1. Visit your beta URL: `https://your-project-name.vercel.app`
2. ✅ See beta banner at top
3. ✅ Sign up with test email
4. ✅ Try payment with test card: `4242 4242 4242 4242`
5. ✅ Verify everything works

## 🎉 Done!

Your beta is live! Share the URL with testers.

## 📝 Test Card Info

For Stripe test payments:
- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

## 🔄 Updating Beta

1. Push changes to Git
2. Vercel auto-deploys (if connected to Git)
3. Or manually redeploy from Vercel dashboard

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Vercel
- Verify all env vars are set
- Check for TypeScript errors

**Stripe not working?**
- Verify test mode keys (`sk_test_...`)
- Check webhook URL is correct
- Verify webhook secret matches

**Can't access site?**
- Check deployment status in Vercel
- Verify domain is correct
- Check browser console for errors

## 📚 Full Guide

See `BETA_DEPLOYMENT_GUIDE.md` for detailed instructions, custom domains, access restrictions, and more.

