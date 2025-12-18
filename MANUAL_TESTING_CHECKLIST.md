# Manual Testing Checklist

Use this checklist to manually test all features of StoryScorer before release.

## Authentication Flow

### Sign Up

- [ ] Navigate to signup page
- [ ] Fill in all required fields (email, password, full name)
- [ ] Submit form with valid data
- [ ] Verify email verification message is shown
- [ ] Check email inbox for verification email
- [ ] Click verification link in email
- [ ] Verify redirect to dashboard after verification
- [ ] Test with invalid email format (should show error)
- [ ] Test with weak password (should show error)
- [ ] Test with missing fields (should show validation errors)

### Login

- [ ] Navigate to login page
- [ ] Enter correct credentials
- [ ] Verify successful login and redirect to dashboard
- [ ] Enter incorrect password (should show error)
- [ ] Enter non-existent email (should show error)
- [ ] Test "Remember me" functionality (if implemented)
- [ ] Verify session persists after page refresh

### Password Reset

- [ ] Navigate to forgot password page
- [ ] Enter registered email address
- [ ] Verify email sent message appears
- [ ] Check email inbox for reset link
- [ ] Click reset link in email
- [ ] Verify redirect to reset password page
- [ ] Enter new password
- [ ] Verify password is updated
- [ ] Test login with new password
- [ ] Test with expired reset link (should show error)
- [ ] Test with invalid reset link (should show error)

### Logout

- [ ] Click logout button
- [ ] Verify session is cleared
- [ ] Verify redirect to login page
- [ ] Verify protected routes are inaccessible after logout

## Core Feature - Story Analysis

### Story Input

- [ ] Navigate to analyzer page
- [ ] Enter story title
- [ ] Enter user story text
- [ ] Enter acceptance criteria (optional)
- [ ] Add tags (up to 10)
- [ ] Verify character counters work correctly
- [ ] Test with maximum length inputs
- [ ] Test with special characters
- [ ] Test with empty required fields (should show validation)

### Analysis

- [ ] Submit story for analysis
- [ ] Verify loading state is shown
- [ ] Verify analysis results are displayed
- [ ] Check all INVEST criteria scores are shown
- [ ] Verify overall score is displayed
- [ ] Check recommendations are shown
- [ ] Test copy to clipboard functionality
- [ ] Test export to Markdown functionality
- [ ] Verify story is auto-saved to history
- [ ] Test with very long story text
- [ ] Test with minimal story text
- [ ] Test error handling (invalid API key, network error)

### Story History

- [ ] Navigate to history page
- [ ] Verify all saved stories are displayed
- [ ] Test search functionality
- [ ] Test sorting (by date, score, title)
- [ ] Test filtering
- [ ] Test pagination (if more than 20 stories)
- [ ] Click "View" on a story
- [ ] Verify story loads in analyzer with data pre-filled
- [ ] Test delete functionality
- [ ] Test bulk delete (if implemented)
- [ ] Verify empty state when no stories exist

## Subscription and Billing

### Pricing Page

- [ ] Navigate to pricing page
- [ ] Verify all plan tiers are displayed
- [ ] Verify pricing is correct
- [ ] Test monthly/annual toggle (if implemented)
- [ ] Click "Get Started" on each plan
- [ ] Verify redirect to checkout

### Checkout Flow

- [ ] Start checkout process
- [ ] Verify Stripe checkout page loads
- [ ] Enter test card details
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Verify subscription is created in database
- [ ] Verify plan type is updated in dashboard
- [ ] Test with invalid card (should show error)
- [ ] Test canceling checkout (should redirect back)

### Billing Management

- [ ] Navigate to billing page
- [ ] Verify current plan is displayed
- [ ] Verify usage meter is shown
- [ ] Click "Manage Subscription"
- [ ] Verify Stripe Customer Portal loads
- [ ] Test updating payment method
- [ ] Test canceling subscription
- [ ] Verify subscription status updates in app

## User Dashboard

### Dashboard Home

- [ ] Navigate to dashboard
- [ ] Verify welcome message is shown
- [ ] Verify stats cards display correct data
- [ ] Verify recent activity feed works
- [ ] Test quick action buttons
- [ ] Verify data refreshes correctly

### Settings

- [ ] Navigate to settings page
- [ ] Test profile update
- [ ] Test password change
- [ ] Test account deletion
- [ ] Verify confirmation dialogs work
- [ ] Test form validation on all tabs

## Navigation and Layout

### Desktop Navigation

- [ ] Verify all navigation links work
- [ ] Test active state highlighting
- [ ] Verify logo links to dashboard
- [ ] Test user menu dropdown
- [ ] Verify logout works from user menu

### Mobile Navigation

- [ ] Test hamburger menu on mobile
- [ ] Verify all links work in mobile menu
- [ ] Test menu closes after navigation
- [ ] Verify responsive design on various screen sizes

## Landing Page

### Hero Section

- [ ] Verify headline is displayed
- [ ] Test "Get Started" button
- [ ] Test "See How It Works" button (smooth scroll)
- [ ] Verify social proof numbers are shown

### Features Section

- [ ] Verify all feature cards are displayed
- [ ] Test smooth scroll to features section
- [ ] Verify feature icons and descriptions

### How It Works

- [ ] Verify all steps are displayed
- [ ] Test "Try It Free" button

### Testimonials

- [ ] Verify testimonials are displayed
- [ ] Test carousel/scroll (if implemented)

### Final CTA

- [ ] Verify CTA section is displayed
- [ ] Test "Start Free Trial" button
- [ ] Verify trust signals are shown

### Footer

- [ ] Verify all footer links work
- [ ] Test social media links (open in new tab)
- [ ] Verify copyright notice is current year

## Cross-Browser Testing

### Chrome

- [ ] Test all major features
- [ ] Verify no console errors
- [ ] Check responsive design

### Firefox

- [ ] Test all major features
- [ ] Verify no console errors
- [ ] Check responsive design

### Safari

- [ ] Test all major features
- [ ] Verify no console errors
- [ ] Check responsive design
- [ ] Test on iOS Safari

### Edge

- [ ] Test all major features
- [ ] Verify no console errors

## Mobile Testing

### iOS (Safari)

- [ ] Test on iPhone (various sizes)
- [ ] Test on iPad
- [ ] Verify touch interactions work
- [ ] Check mobile navigation
- [ ] Test form inputs

### Android (Chrome)

- [ ] Test on various Android devices
- [ ] Verify touch interactions work
- [ ] Check mobile navigation
- [ ] Test form inputs

## Accessibility Testing

### Screen Reader

- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA (Windows)
- [ ] Verify all interactive elements are announced
- [ ] Verify form labels are read correctly
- [ ] Test keyboard navigation

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test form submission with keyboard
- [ ] Verify skip links work (if implemented)

### Color Contrast

- [ ] Verify text meets WCAG AA standards
- [ ] Test with color blindness simulators
- [ ] Verify error states are clear

## Performance Testing

### Network Conditions

- [ ] Test with slow 3G connection
- [ ] Test with fast 4G connection
- [ ] Verify loading states are shown
- [ ] Test offline behavior (if implemented)

### Lighthouse Audit

- [ ] Run Lighthouse on landing page
- [ ] Run Lighthouse on dashboard
- [ ] Verify Performance score > 90
- [ ] Verify Accessibility score > 90
- [ ] Verify Best Practices score > 90
- [ ] Verify SEO score > 90

## Error Handling

### Network Errors

- [ ] Disable network and test API calls
- [ ] Verify error messages are user-friendly
- [ ] Test retry functionality (if implemented)

### Invalid Input

- [ ] Test with XSS attempts in forms
- [ ] Test with SQL injection attempts
- [ ] Test with extremely long inputs
- [ ] Verify all inputs are sanitized

### API Errors

- [ ] Test with invalid API keys
- [ ] Test with rate limit exceeded
- [ ] Test with server errors (500)
- [ ] Verify error messages don't expose sensitive data

## Security Testing

### Authentication

- [ ] Test accessing protected routes without auth
- [ ] Verify redirect to login
- [ ] Test with expired session
- [ ] Verify session refresh works

### Authorization

- [ ] Test accessing other users' stories
- [ ] Verify 404/403 errors
- [ ] Test modifying other users' data
- [ ] Verify RLS policies are enforced

### Rate Limiting

- [ ] Test exceeding rate limits
- [ ] Verify appropriate error messages
- [ ] Verify retry-after headers

## Edge Cases

### Empty States

- [ ] Test with no stories in history
- [ ] Test with no recent activity
- [ ] Verify empty state messages are helpful

### Large Data Sets

- [ ] Test with 100+ stories in history
- [ ] Verify pagination works
- [ ] Test search with many results

### Special Characters

- [ ] Test with unicode characters
- [ ] Test with emojis in story text
- [ ] Test with special characters in tags

## Integration Testing

### Stripe Integration

- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test webhook processing
- [ ] Verify subscription updates correctly

### Supabase Integration

- [ ] Test database operations
- [ ] Verify RLS policies work
- [ ] Test real-time updates (if implemented)

### AI Integration

- [ ] Test with OpenAI
- [ ] Test with Anthropic (if configured)
- [ ] Test fallback behavior
- [ ] Verify error handling

## Documentation

- [ ] Verify README is up to date
- [ ] Check all documentation links work
- [ ] Verify setup instructions are accurate

## Notes

Document any issues found during testing:

1. ## **Critical Issues:** (Must fix before launch)

2. ## **High Priority Issues:** (Should fix soon)

3. ## **Medium Priority Issues:** (Nice to have)

4. ## **Low Priority Issues:** (Future improvements)

## Test Results

- **Date Tested:**
- **Tester Name:**
- **Browser/Device:**
- **Overall Status:** [ ] Pass [ ] Fail [ ] Needs Work
