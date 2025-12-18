# Comprehensive Application Testing Guide

## StoryScorer - End-to-End Testing Checklist

This guide covers all features and functionality of the StoryScorer application. Use this before deploying to production.

---

## 🎯 Pre-Testing Setup

### Environment Check

- [ ] Development server is running (`npm run dev`)
- [ ] Database is connected (Supabase)
- [ ] Environment variables are set:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`)
- [ ] `RESEND_API_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Email service (Resend) is configured
- [ ] Payment service (Stripe) is configured
- [ ] Browser DevTools are open (Console & Network tabs)

### Test Accounts

- [ ] Create a test account for full testing
- [ ] Have a second test account ready (for edge cases)
- [ ] Note: Use test email addresses you can access

---

## 1️⃣ AUTHENTICATION FLOW

### 1.1 Sign Up

**Location:** `/signup`

- [ ] Navigate to signup page
- [ ] Fill in all required fields:
- [ ] Email (valid format)
- [ ] Password (meets requirements: 8+ chars, uppercase, lowercase, number)
- [ ] Full name
- [ ] Submit form with valid data
- [ ] **Expected:** Success message and redirect to email verification page
- [ ] Check email inbox for verification email
- [ ] **Expected:** Welcome email received (if implemented)
- [ ] Click verification link in email
- [ ] **Expected:** Redirects to dashboard after verification

**Error Cases:**

- [ ] Test with invalid email format → Shows validation error
- [ ] Test with weak password → Shows password requirements
- [ ] Test with missing fields → Shows field-specific errors
- [ ] Test with duplicate email → Shows "Email already exists" error
- [ ] Test with very long inputs → Handles gracefully

**Pass Criteria:** ✅ User can create account, verify email, and access dashboard

---

### 1.2 Login

**Location:** `/login`

- [ ] Navigate to login page
- [ ] Enter correct credentials
- [ ] **Expected:** Successful login and redirect to dashboard
- [ ] Enter incorrect password → Shows error message
- [ ] Enter non-existent email → Shows error message
- [ ] Test with empty fields → Shows validation errors
- [ ] Refresh page after login → Session persists
- [ ] Close browser and reopen → Session persists (if "Remember me" implemented)

**Protected Route Test:**

- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] **Expected:** Redirects to login page
- [ ] Login
- [ ] **Expected:** Redirects to originally requested page

**Pass Criteria:** ✅ Login works, errors are clear, session persists

---

### 1.3 Password Reset

**Location:** `/forgot-password` → `/reset-password`

- [ ] Navigate to forgot password page
- [ ] Enter registered email address
- [ ] **Expected:** "Check your email" message appears
- [ ] Check email inbox for reset link
- [ ] **Expected:** Password reset email received
- [ ] Click reset link in email
- [ ] **Expected:** Redirects to reset password page
- [ ] Enter new password (meets requirements)
- [ ] Confirm new password
- [ ] Submit form
- [ ] **Expected:** Password updated successfully
- [ ] Try to login with old password → Should fail
- [ ] Login with new password → Should succeed

**Error Cases:**

- [ ] Test with non-existent email → Shows appropriate message
- [ ] Test with expired reset link → Shows error
- [ ] Test with invalid reset link → Shows error
- [ ] Test with weak password → Shows validation error

**Pass Criteria:** ✅ Password reset flow works end-to-end

---

### 1.4 Logout

**Location:** Any authenticated page (usually in navigation)

- [ ] While logged in, click logout button
- [ ] **Expected:** Session cleared, redirects to home/login page
- [ ] Try to access `/dashboard` → Redirects to login
- [ ] Try to access `/analyzer` → Redirects to login
- [ ] Try to access `/history` → Redirects to login

**Pass Criteria:** ✅ Logout clears session and protects routes

---

## 2️⃣ CORE FEATURES

### 2.1 Story Analysis

**Location:** `/analyzer`

#### Input Form

- [ ] Navigate to analyzer page (while logged in)
- [ ] Enter story title → Character counter works (if implemented)
- [ ] Enter user story text → Character counter shows (max 5000 chars)
- [ ] Enter acceptance criteria (optional) → Character counter shows (max 2000 chars)
- [ ] Add tags:
- [ ] Add tag by pressing Enter
- [ ] Add tag by clicking "Add" button
- [ ] Add multiple tags (up to 10)
- [ ] Try to add 11th tag → Should be disabled
- [ ] Remove tag by clicking X
- [ ] Test with maximum length inputs → Handles correctly
- [ ] Test with special characters → Handles correctly
- [ ] Test with empty required fields → Shows validation errors
- [ ] Click "Clear" button → Form resets

#### Analysis Execution

- [ ] Submit story for analysis
- [ ] **Expected:** Loading state appears (spinner, "Analyzing..." text)
- [ ] **Expected:** Analysis completes (within reasonable time)
- [ ] **Expected:** Results display correctly:
- [ ] Overall score is shown prominently
- [ ] Individual INVEST criteria scores displayed:
  - [ ] Independent
  - [ ] Negotiable
  - [ ] Valuable
  - [ ] Estimable
  - [ ] Small
  - [ ] Testable
- [ ] Feedback for each criterion is shown
- [ ] Recommendations are displayed
- [ ] **Expected:** Story is auto-saved to database
- [ ] **Expected:** Usage is tracked

**Error Cases:**

- [ ] Test with API failure → Shows error message
- [ ] Test when usage limit exceeded → Shows upgrade message
- [ ] Test with network interruption → Handles gracefully

**Pass Criteria:** ✅ Analysis works, results display correctly, errors handled

---

### 2.2 Story History

**Location:** `/history`

#### Viewing Stories

- [ ] Navigate to history page
- [ ] **Expected:** List of saved stories displays
- [ ] **Expected:** Each story shows:
- [ ] Title
- [ ] Score
- [ ] Date created
- [ ] Tags (if any)
- [ ] Click "View" button on a story
- [ ] **Expected:** Redirects to `/analyzer?story={id}` and shows analysis
- [ ] **Expected:** Analysis results load correctly (not the form)
- [ ] Click browser back button
- [ ] **Expected:** Returns to history page

#### Search & Filter

- [ ] Use search box to find a story
- [ ] **Expected:** Results filter in real-time
- [ ] Search by title → Works
- [ ] Search by tags → Works
- [ ] Clear search → Shows all stories

#### Sorting (if implemented)

- [ ] Sort by date (newest first) → Works
- [ ] Sort by date (oldest first) → Works
- [ ] Sort by score (highest first) → Works
- [ ] Sort by score (lowest first) → Works
- [ ] Sort by title (A-Z) → Works

#### Pagination (if implemented)

- [ ] If more than 20 stories, pagination appears
- [ ] Click next page → Loads next set
- [ ] Click previous page → Works
- [ ] Click page number → Works

#### Delete Story

- [ ] Click delete button on a story
- [ ] **Expected:** Confirmation dialog appears (if implemented)
- [ ] Confirm deletion
- [ ] **Expected:** Story removed from list
- [ ] **Expected:** Story removed from database

#### Empty State

- [ ] Delete all stories (or use new account)
- [ ] **Expected:** Empty state message displays
- [ ] **Expected:** "Create your first story" CTA appears

**Pass Criteria:** ✅ History page displays stories, search/filter works, delete works

---

### 2.3 Dashboard

**Location:** `/dashboard`

- [ ] Navigate to dashboard
- [ ] **Expected:** Stats display correctly:
- [ ] Total stories analyzed
- [ ] Average score
- [ ] Stories this month
- [ ] Usage statistics
- [ ] **Expected:** Recent activity shows:
- [ ] Recent stories
- [ ] Recent analyses
- [ ] **Expected:** Quick actions work:
- [ ] "Analyze Story" button → Links to analyzer
- [ ] "View History" button → Links to history
- [ ] **Expected:** Navigation links work correctly
- [ ] Refresh page → Stats update correctly

**Pass Criteria:** ✅ Dashboard displays correct data and links work

---

## 3️⃣ MARKETING PAGES

### 3.1 Home/Landing Page

**Location:** `/` or `/marketing`

- [ ] Navigate to home page (while logged out)
- [ ] **Expected:** Hero section displays:
- [ ] Compelling headline
- [ ] Clear value proposition
- [ ] CTA button ("Get Started" or "Sign Up")
- [ ] **Expected:** Features section displays
- [ ] **Expected:** Testimonials/social proof (if implemented)
- [ ] **Expected:** Footer displays correctly
- [ ] Click "Get Started" → Redirects to signup
- [ ] Click "Login" → Redirects to login
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test all navigation links

**Pass Criteria:** ✅ Landing page displays correctly, CTAs work

---

### 3.2 Pricing Page

**Location:** `/pricing`

- [ ] Navigate to pricing page
- [ ] **Expected:** All plans display:
- [ ] Free plan
- [ ] Pro plan
- [ ] Enterprise plan (if applicable)
- [ ] **Expected:** Each plan shows:
- [ ] Price
- [ ] Features list
- [ ] Usage limits
- [ ] "Get Started" or "Upgrade" button
- [ ] Click "Get Started" on a plan
- [ ] **Expected:** Redirects to signup/checkout (depending on plan)
- [ ] Test while logged in → Shows upgrade options
- [ ] Test while logged out → Shows signup flow

**Pass Criteria:** ✅ Pricing page displays correctly, buttons work

---

### 3.3 Blog

**Location:** `/blog`

#### Blog Listing

- [ ] Navigate to blog page
- [ ] **Expected:** List of blog posts displays
- [ ] **Expected:** Each post shows:
- [ ] Title
- [ ] Excerpt
- [ ] Date
- [ ] Author (if implemented)
- [ ] Featured image (if implemented)
- [ ] Reading time (if implemented)
- [ ] Use search box → Filters posts
- [ ] Click on a blog post → Opens post detail

#### Blog Post Detail

**Location:** `/blog/[slug]`

- [ ] Click on a blog post
- [ ] **Expected:** Full post content displays
- [ ] **Expected:** Markdown renders correctly:
- [ ] Headings
- [ ] Lists
- [ ] Code blocks
- [ ] Links
- [ ] Images
- [ ] **Expected:** Metadata displays:
- [ ] Title
- [ ] Date
- [ ] Author
- [ ] Tags
- [ ] **Expected:** Related posts section (if implemented)
- [ ] **Expected:** Social share buttons (if implemented)
- [ ] Click "Back to Blog" → Returns to blog listing
- [ ] Test breadcrumb navigation → Works

**Pass Criteria:** ✅ Blog listing and posts display correctly

---

### 3.4 About Page

**Location:** `/about`

- [ ] Navigate to about page
- [ ] **Expected:** Content displays correctly
- [ ] **Expected:** All sections render properly
- [ ] Test responsive design

**Pass Criteria:** ✅ About page displays correctly

---

### 3.5 Privacy & Terms

**Location:** `/privacy` and `/terms`

- [ ] Navigate to privacy page
- [ ] **Expected:** Privacy policy content displays
- [ ] Navigate to terms page
- [ ] **Expected:** Terms of service content displays
- [ ] Test links within pages → Work correctly

**Pass Criteria:** ✅ Legal pages display correctly

---

## 4️⃣ SUBSCRIPTION & BILLING

### 4.1 Checkout Flow

**Location:** `/pricing` → Checkout

- [ ] Navigate to pricing page (while logged in)
- [ ] Click "Upgrade" on a paid plan
- [ ] **Expected:** Redirects to Stripe checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Enter test details:
- [ ] Expiry: Any future date
- [ ] CVC: Any 3 digits
- [ ] ZIP: Any 5 digits
- [ ] Complete checkout
- [ ] **Expected:** Redirects to success page or dashboard
- [ ] **Expected:** Subscription confirmation email received

**Pass Criteria:** ✅ Checkout flow works with test card

---

### 4.2 Billing Page

**Location:** `/billing`

- [ ] Navigate to billing page (while logged in)
- [ ] **Expected:** Current plan displays
- [ ] **Expected:** Usage statistics show:
- [ ] Current usage
- [ ] Usage limit
- [ ] Reset date
- [ ] **Expected:** Payment method displays (if subscribed)
- [ ] Click "Manage Subscription" or "Update Payment"
- [ ] **Expected:** Opens Stripe customer portal
- [ ] Test canceling subscription (if needed for testing)
- [ ] Test updating payment method

**Pass Criteria:** ✅ Billing page displays correctly, portal access works

---

### 4.3 Usage Limits

- [ ] Use free plan account
- [ ] Analyze stories until limit is reached
- [ ] **Expected:** Warning message appears when approaching limit
- [ ] **Expected:** Error message when limit exceeded
- [ ] **Expected:** Upgrade prompt appears
- [ ] Upgrade to paid plan
- [ ] **Expected:** Can analyze more stories
- [ ] **Expected:** Usage resets correctly

**Pass Criteria:** ✅ Usage limits enforced correctly

---

## 5️⃣ EMAIL NOTIFICATIONS

### 5.1 Welcome Email

- [ ] Sign up for new account
- [ ] **Expected:** Welcome email received
- [ ] **Expected:** Email renders correctly:
- [ ] Proper formatting
- [ ] Links work
- [ ] Images load (if any)

**Pass Criteria:** ✅ Welcome email sent and renders correctly

---

### 5.2 Password Reset Email

- [ ] Request password reset
- [ ] **Expected:** Password reset email received
- [ ] **Expected:** Reset link works
- [ ] **Expected:** Email renders correctly

**Pass Criteria:** ✅ Password reset email works

---

### 5.3 Subscription Emails

- [ ] Complete subscription checkout
- [ ] **Expected:** Subscription confirmation email received
- [ ] **Expected:** Email includes subscription details

**Pass Criteria:** ✅ Subscription emails sent correctly

---

### 5.4 Usage Warning Email

- [ ] Approach usage limit (80%+)
- [ ] **Expected:** Usage warning email received (if implemented)
- [ ] **Expected:** Email shows current usage and limit

**Pass Criteria:** ✅ Usage warning emails sent (if implemented)

---

## 6️⃣ SETTINGS

**Location:** `/settings`

- [ ] Navigate to settings page
- [ ] **Expected:** Profile settings display:
- [ ] Name
- [ ] Email
- [ ] Password change option
- [ ] Update name → Saves correctly
- [ ] Update email → Saves correctly (may require verification)
- [ ] Change password → Works correctly
- [ ] **Expected:** Account preferences (if implemented)
- [ ] **Expected:** Notification preferences (if implemented)
- [ ] Test logout from settings page → Works

**Pass Criteria:** ✅ Settings page works, updates save correctly

---

## 7️⃣ ERROR HANDLING & EDGE CASES

### 7.1 Network Errors

- [ ] Disconnect internet
- [ ] Try to analyze a story
- [ ] **Expected:** Error message appears
- [ ] **Expected:** User can retry

### 7.2 Invalid Data

- [ ] Try to access `/analyzer?story=invalid-id`
- [ ] **Expected:** Error message or graceful fallback
- [ ] Try to delete non-existent story
- [ ] **Expected:** Handles gracefully

### 7.3 Authentication Edge Cases

- [ ] Try to access protected route while logged out
- [ ] **Expected:** Redirects to login
- [ ] Login, then let session expire
- [ ] **Expected:** Redirects to login when accessing protected route

### 7.4 Browser Compatibility

- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] **Expected:** All features work in all browsers

### 7.5 Mobile Responsiveness

- [ ] Test on mobile device (or browser dev tools)
- [ ] **Expected:** All pages are responsive
- [ ] **Expected:** Navigation works on mobile
- [ ] **Expected:** Forms are usable on mobile

**Pass Criteria:** ✅ Errors handled gracefully, app works across browsers/devices

---

## 8️⃣ PERFORMANCE & OPTIMIZATION

### 8.1 Page Load Times

- [ ] Check initial page load → Should be < 3 seconds
- [ ] Check navigation between pages → Should be < 1 second
- [ ] Check analysis completion → Should be < 10 seconds

### 8.2 API Response Times

- [ ] Open Network tab
- [ ] Navigate through app
- [ ] **Expected:** API calls complete quickly
- [ ] **Expected:** No unnecessary duplicate calls

### 8.3 Memory Leaks

- [ ] Navigate between pages 20+ times
- [ ] **Expected:** No memory warnings in console
- [ ] **Expected:** Performance doesn't degrade

**Pass Criteria:** ✅ App performs well, no memory leaks

---

## 9️⃣ SECURITY CHECKS

### 9.1 Authentication

- [ ] Try to access API routes directly without auth
- [ ] **Expected:** Returns 401 Unauthorized
- [ ] Try to access another user's stories
- [ ] **Expected:** Cannot access (403 or empty results)

### 9.2 Input Validation

- [ ] Try SQL injection in form fields
- [ ] **Expected:** Handled safely
- [ ] Try XSS in form fields
- [ ] **Expected:** Sanitized correctly

### 9.3 Environment Variables

- [ ] Verify sensitive keys are not exposed in client code
- [ ] **Expected:** No API keys in browser console

**Pass Criteria:** ✅ Security measures in place

---

## 🔟 INTEGRATION TESTS

### 10.1 Stripe Webhooks

- [ ] Complete test subscription
- [ ] **Expected:** Webhook received and processed
- [ ] **Expected:** Subscription status updated in database
- [ ] **Expected:** User access updated

### 10.2 Email Service

- [ ] Trigger all email types
- [ ] **Expected:** All emails sent successfully
- [ ] **Expected:** Emails render correctly

### 10.3 Database

- [ ] Create, read, update, delete operations
- [ ] **Expected:** All CRUD operations work
- [ ] **Expected:** Data persists correctly

**Pass Criteria:** ✅ All integrations work correctly

---

## 📊 FINAL CHECKLIST

Before considering the app production-ready:

- [ ] All authentication flows work
- [ ] Core features (analysis, history) work
- [ ] Marketing pages display correctly
- [ ] Subscription/billing works
- [ ] Email notifications work
- [ ] Settings work
- [ ] Error handling is robust
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Mobile responsive
- [ ] Works in all major browsers
- [ ] No console errors
- [ ] No memory leaks
- [ ] All integrations working

---

## 🐛 BUG REPORTING TEMPLATE

If you find issues, document them with:

1. **Page/Feature:** Where the issue occurred
2. **Steps to Reproduce:** Exact steps to trigger the issue
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happened
5. **Screenshots:** If applicable
6. **Browser/Device:** Chrome on Mac, etc.
7. **Console Errors:** Any errors in browser console

---

## ✅ SIGN-OFF

**Tester Name:** ********\_********

**Date:** ********\_********

**Overall Status:**

- [ ] ✅ Ready for Production
- [ ] ⚠️ Minor Issues (List below)
- [ ] ❌ Major Issues (List below)

**Issues Found:**

1.
2.
3.

**Notes:**

---

---

---

---

**Happy Testing! 🚀**
