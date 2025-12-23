# Quick Test Checklist - StoryScorer

## 30-Minute Smoke Test

Use this for a quick validation before deployment. Full testing guide: `COMPREHENSIVE_APP_TESTING.md`

---

## ⚡ Critical Path (15 minutes)

### Authentication

- [ ] Sign up → Verify email → Login → ✅ Works
- [ ] Login → Logout → ✅ Works
- [ ] Forgot password → Reset → ✅ Works

### Core Features

- [ ] Analyze a story → ✅ Results display
- [ ] View story from history → ✅ Analysis loads
- [ ] Delete a story → ✅ Removed from list

### Payments (if applicable)

- [ ] View pricing page → ✅ Plans display
- [ ] Start checkout (test mode) → ✅ Stripe loads

---

## 🔍 Quick Validation (15 minutes)

### Pages Load

- [ ] Home page → ✅ Loads
- [ ] Pricing page → ✅ Loads
- [ ] Blog page → ✅ Loads
- [ ] Dashboard → ✅ Loads (when logged in)
- [ ] History → ✅ Loads (when logged in)
- [ ] Settings → ✅ Loads (when logged in)

### Navigation

- [ ] All nav links work → ✅
- [ ] Mobile menu works → ✅
- [ ] Footer links work → ✅

### Errors

- [ ] Console has no errors → ✅
- [ ] Network tab shows no failed requests → ✅

### Responsive

- [ ] Mobile view looks good → ✅
- [ ] Desktop view looks good → ✅

---

## ✅ If all checked, you're ready for Phase 14!

**Issues found?** Document them in `COMPREHENSIVE_APP_TESTING.md`
