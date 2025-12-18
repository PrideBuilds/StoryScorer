{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;\f1\fnil\fcharset0 HelveticaNeue;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red155\green163\blue178;\red0\green0\blue0;
}
{\*\expandedcolortbl;;\cssrgb\c0\c1\c1;\cssrgb\c67166\c69917\c74931;\cssrgb\c0\c0\c0\c84706;
}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Set up Stripe configuration and webhook handling:\
- Install Stripe SDK: npm install stripe\
- Create /lib/stripe/client.ts with Stripe initialization\
- Create /app/api/webhooks/stripe/route.ts for webhook endpoint\
- Implement webhook signature verification\
- Handle these webhook events:\
  * checkout.session.completed\
  * customer.subscription.created\
  * customer.subscription.updated\
  * customer.subscription.deleted\
  * invoice.payment_succeeded\
  * invoice.payment_failed\
- Update subscription status in database for each event\
- Add logging for all webhook events\
- Test with Stripe CLI locally\
\pard\pardeftab720\qc\partightenfactor0

\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Create pricing plans in Stripe and in your database:\
- Set up three pricing tiers in Stripe dashboard:\
  * Free: $0/month (limited features)\
  * Pro: $49/month (full features)\
  * Enterprise: $99/month (unlimited + priority support)\
- Create /lib/config/pricing.ts with plan configurations\
- Define feature limits for each tier:\
  * Free: 10 analyses per month\
  * Pro: 100 analyses per month\
  * Enterprise: Unlimited\
- Create a pricing comparison table component\
- Store plan metadata in your config file\
\pard\pardeftab720\qc\partightenfactor0

\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Build the pricing page:\
- Create /app/(marketing)/pricing/page.tsx\
- Design three pricing tier cards side-by-side\
- List features included in each tier\
- Add checkmarks for included features, X for excluded\
- Highlight the recommended plan (Pro)\
- Create "Get Started" / "Upgrade" buttons\
- Add toggle for monthly vs annual billing (optional)\
- Show savings for annual plans if applicable\
- Make responsive (stack on mobile)\
- Add FAQ section below pricing cards\
\pard\pardeftab720\qc\partightenfactor0

\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Implement checkout flow:\
- Create /app/api/checkout/route.ts API endpoint\
- Accept price_id and user email as parameters\
- Create Stripe Checkout Session\
- Set success_url and cancel_url\
- Include user metadata in session\
- Return checkout URL to frontend\
- Create button click handler to call checkout endpoint\
- Redirect user to Stripe Checkout\
- Handle checkout cancellation gracefully\
\pard\pardeftab720\qc\partightenfactor0

\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Build subscription management/billing portal:\
- Create /app/(dashboard)/billing/page.tsx\
- Display current subscription details:\
  * Plan name and price\
  * Billing period (next payment date)\
  * Payment method (last 4 digits)\
  * Usage in current period\
- Create "Manage Subscription" button\
- Implement Stripe Customer Portal integration\
- Create /app/api/create-portal-session/route.ts\
- Generate portal session URL\
- Redirect to Stripe portal for:\
  * Updating payment method\
  * Viewing invoices\
  * Canceling subscription\
  * Upgrading/downgrading plans
\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\qc\partightenfactor0
\cf2 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Implement usage-based access control:\
- Create /lib/hooks/useSubscription.ts\
- Fetch user's current subscription and plan\
- Create /lib/utils/checkUsageLimit.ts helper\
- Check current usage against plan limits\
- Return boolean for feature access\
- Create middleware or component wrapper to restrict features\
- Show upgrade prompt when limit reached\
- Track usage count in database on each feature use\
- Reset usage count at start of billing period\
- Display usage meter in dashboard\
}