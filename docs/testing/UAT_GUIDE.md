# User Acceptance Testing (UAT) Guide

This guide is for beta testers to help test StoryScorer before launch.

## Getting Started

1. **Create an Account**
   - Visit the signup page
   - Use a real email address (you'll need to verify it)
   - Choose a strong password

2. **Verify Your Email**
   - Check your inbox for the verification email
   - Click the verification link
   - You'll be redirected to the dashboard

## Testing Scenarios

### Scenario 1: First-Time User Journey

**Goal**: Test the complete onboarding experience

1. Sign up for a new account
2. Verify your email
3. Explore the dashboard
4. Analyze your first user story
5. Review the analysis results
6. Save the story to history

**What to Look For:**

- Is the process clear and intuitive?
- Are there any confusing steps?
- Do error messages help you understand what went wrong?

### Scenario 2: Story Analysis

**Goal**: Test the core analysis feature

1. Go to the Analyzer page
2. Enter a user story (try different formats):
   - Well-written story
   - Story missing acceptance criteria
   - Very short story
   - Very long story
3. Add tags to your story
4. Analyze the story
5. Review the INVEST scores
6. Check the recommendations

**What to Look For:**

- Are the scores accurate?
- Are the recommendations helpful?
- Is the analysis fast enough?
- Can you understand the results?

### Scenario 3: Story Management

**Goal**: Test story history and management

1. Create multiple stories
2. Go to History page
3. Search for a story
4. Sort stories by different criteria
5. View a story's details
6. Delete a story

**What to Look For:**

- Can you find your stories easily?
- Is the search working correctly?
- Is the sorting helpful?
- Can you view past analyses?

### Scenario 4: Subscription Flow

**Goal**: Test the subscription purchase process

1. Go to Pricing page
2. Review the plans
3. Click "Get Started" on a plan
4. Complete the checkout (use test card: 4242 4242 4242 4242)
5. Verify subscription appears in Billing page
6. Check usage limits are updated

**What to Look For:**

- Is the pricing clear?
- Does checkout work smoothly?
- Is the subscription reflected correctly?
- Are usage limits enforced?

### Scenario 5: Settings & Profile

**Goal**: Test account management

1. Go to Settings page
2. Update your profile information
3. Change your password
4. Review account deletion option (don't actually delete)

**What to Look For:**

- Can you update your information?
- Are changes saved correctly?
- Is password change secure?

## Edge Cases to Test

### Input Validation

- Try submitting empty forms
- Enter very long text
- Use special characters
- Enter invalid email formats

### Error Scenarios

- Try to access protected pages without logging in
- Try to analyze without being logged in
- Try to access other users' stories (should fail)
- Test with slow internet connection

### Browser Testing

- Test in Chrome
- Test in Firefox
- Test in Safari
- Test on mobile device

## Feedback Form

Please provide feedback on:

1. **Usability**
   - What was confusing?
   - What was easy to use?
   - What features are missing?

2. **Design**
   - Is the interface attractive?
   - Is it easy to navigate?
   - Are colors and fonts readable?

3. **Performance**
   - Is the app fast enough?
   - Are there any laggy areas?
   - Does it work on your device?

4. **Bugs**
   - Describe any bugs you found
   - Include steps to reproduce
   - Include screenshots if possible

5. **Suggestions**
   - What would make this better?
   - What features would you add?
   - What would you change?

## Bug Reporting

When reporting bugs, please include:

1. **Description**: What happened?
2. **Steps to Reproduce**: How can we recreate it?
3. **Expected Behavior**: What should have happened?
4. **Actual Behavior**: What actually happened?
5. **Browser/Device**: What browser and device?
6. **Screenshots**: If applicable

## Test Accounts

For testing subscriptions, use Stripe test cards:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)

## Timeline

- **Week 1**: Initial testing and feedback
- **Week 2**: Bug fixes and improvements
- **Week 3**: Second round of testing
- **Week 4**: Final polish and launch prep

## Contact

If you have questions or need help:

- Email: hello@storyscorer.com
- Create an issue in the feedback form
- Reach out directly to the team

Thank you for helping make StoryScorer better!
