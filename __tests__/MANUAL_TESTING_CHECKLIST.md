# Manual Testing Checklist

Use this checklist to manually test all features before release.

## Authentication Flow

### Sign Up

- [ ] Can create account with valid email and password
- [ ] Password requirements are enforced (min 8 chars, uppercase, lowercase, number)
- [ ] Error shown for duplicate email
- [ ] Verification email is sent
- [ ] Can verify email via link
- [ ] Redirects to dashboard after verification

### Login

- [ ] Can login with correct credentials
- [ ] Error shown for incorrect password
- [ ] Error shown for non-existent email
- [ ] "Remember me" functionality works (if implemented)
- [ ] Redirects to dashboard after login
- [ ] Redirects to intended page after login (if redirected from protected route)

### Password Reset

- [ ] Can request password reset
- [ ] Reset email is received
- [ ] Can reset password via link
- [ ] Can login with new password
- [ ] Old password no longer works

### Logout

- [ ] Can logout successfully
- [ ] Redirects to home page after logout
- [ ] Cannot access protected routes after logout

## Core Features

### Story Analysis

- [ ] Can input story title
- [ ] Can input user story text
- [ ] Can input acceptance criteria (optional)
- [ ] Can add tags (up to 10)
- [ ] Character counters work correctly
- [ ] Can analyze story
- [ ] Analysis results display correctly
- [ ] Can copy analysis results
- [ ] Can export analysis to Markdown
- [ ] Story is auto-saved after analysis
- [ ] Error shown if usage limit exceeded
- [ ] Error shown if API fails

### Story History

- [ ] Can view list of saved stories
- [ ] Can search stories
- [ ] Can sort stories (by date, score, title)
- [ ] Can filter stories
- [ ] Pagination works correctly
- [ ] Can view story details
- [ ] Can delete story
- [ ] Can bulk delete stories (if implemented)
- [ ] Empty state shows when no stories

### Dashboard

- [ ] Stats display correctly
- [ ] Recent activity shows
- [ ] Quick actions work
- [ ] Navigation links work

## Subscription & Billing

### Pricing Page

- [ ] All plans display correctly
- [ ] Monthly/Annual toggle works
- [ ] "Get Started" buttons work
- [ ] Redirects to checkout

### Checkout Flow

- [ ] Can select plan
- [ ] Redirects to Stripe checkout
- [ ] Can complete payment
- [ ] Redirects back after payment
- [ ] Subscription updates in database

### Billing Page

- [ ] Current plan displays correctly
- [ ] Usage meter shows current usage
- [ ] "Manage Subscription" button works
- [ ] Redirects to Stripe Customer Portal

### Subscription Management

- [ ] Can view subscription details
- [ ] Can cancel subscription
- [ ] Can update payment method
- [ ] Can view billing history

## Settings

### Profile Settings

- [ ] Can update full name
- [ ] Can update company
- [ ] Can update job title
- [ ] Changes save successfully
- [ ] Success message shown

### Account Settings

- [ ] Can change password
- [ ] Password validation works
- [ ] Can delete account
- [ ] Account deletion confirmation works
- [ ] Data is deleted after account deletion

## Navigation & UI

### Navigation

- [ ] All navigation links work
- [ ] Active route is highlighted
- [ ] Mobile menu works
- [ ] Logo links to home/dashboard

### Responsive Design

- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Text is readable on all sizes
- [ ] Buttons are tappable on mobile
- [ ] Forms are usable on mobile

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Error Handling

### Network Errors

- [ ] Handles network failures gracefully
- [ ] Shows user-friendly error messages
- [ ] Retry options available where appropriate

### Validation Errors

- [ ] Form validation errors display correctly
- [ ] Field-level error messages shown
- [ ] Cannot submit invalid forms

### API Errors

- [ ] 401 errors redirect to login
- [ ] 403 errors show appropriate message
- [ ] 404 errors show not found message
- [ ] 429 errors show rate limit message
- [ ] 500 errors show generic error (no stack trace)

## Accessibility

### Keyboard Navigation

- [ ] Can navigate with Tab key
- [ ] Focus indicators visible
- [ ] Can submit forms with Enter
- [ ] Can close modals with Escape

### Screen Reader

- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] Buttons have accessible names
- [ ] ARIA labels where needed
- [ ] Page structure is logical

### Color Contrast

- [ ] Text meets WCAG AA contrast ratios
- [ ] Error states are clear
- [ ] Focus states are visible

## Performance

### Loading States

- [ ] Loading spinners show during async operations
- [ ] Skeleton screens show during data loading
- [ ] No layout shift during loading

### Network Performance

- [ ] Works on slow 3G connection
- [ ] Large forms don't freeze browser
- [ ] Images load progressively

## Edge Cases

### Empty States

- [ ] Empty state shown when no stories
- [ ] Empty state shown when no search results
- [ ] Empty state shown when no recent activity

### Long Content

- [ ] Long story titles handled
- [ ] Long story text handled
- [ ] Many tags handled
- [ ] Many stories in history handled

### Special Characters

- [ ] Handles special characters in input
- [ ] Handles emojis in input
- [ ] Handles unicode characters

## Security

### Authentication

- [ ] Cannot access protected routes without auth
- [ ] Session expires after inactivity
- [ ] Logout clears session

### Data Access

- [ ] Cannot access other users' stories
- [ ] Cannot modify other users' data
- [ ] RLS policies enforced

### Input Validation

- [ ] XSS attempts blocked
- [ ] SQL injection attempts fail
- [ ] Invalid inputs rejected

## Integration Tests

### Stripe Integration

- [ ] Webhook receives events
- [ ] Subscription updates after payment
- [ ] Customer portal works

### Supabase Integration

- [ ] Authentication works
- [ ] Database queries work
- [ ] RLS policies enforced
- [ ] Real-time updates work (if implemented)

### AI Integration

- [ ] OpenAI analysis works
- [ ] Anthropic analysis works
- [ ] Fallback works if one fails
- [ ] Error handling works

## Post-Testing

- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] No console warnings
- [ ] Documentation updated
