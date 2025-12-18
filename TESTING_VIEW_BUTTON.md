# Testing Guide: View Button Functionality

## Overview

This guide helps you verify that the "View" button on the `/history` page correctly loads and displays story analysis results.

## Prerequisites

1. You have at least one story with analysis results in your database
2. You are logged in to the application
3. The development server is running (`npm run dev`)

## Test Scenarios

### ✅ Test 1: Basic View Button Functionality

**Steps:**

1. Navigate to `/history` page
2. Find a story that has an analysis result (score should be visible)
3. Click the "View" button
4. **Expected Result:**
   - URL changes to `/analyzer?story={story-id}`
   - Loading spinner appears briefly
   - Story analysis results are displayed (not the form)
   - Analysis shows all INVEST criteria scores
   - "Analyze Another Story" button is visible

**Pass Criteria:** Story analysis loads and displays correctly

---

### ✅ Test 2: Direct URL Access

**Steps:**

1. Copy a story ID from the history page
2. Open a new browser tab
3. Navigate directly to `http://localhost:3000/analyzer?story={story-id}`
4. **Expected Result:**
   - Story analysis loads immediately
   - No form is shown
   - Analysis results are displayed

**Pass Criteria:** Direct URL access works correctly

---

### ✅ Test 3: Browser Back/Forward Navigation

**Steps:**

1. Navigate to `/history`
2. Click "View" on a story
3. Wait for analysis to load
4. Click browser "Back" button
5. Click browser "Forward" button
6. **Expected Result:**
   - Analysis loads correctly after forward navigation
   - No duplicate API calls (check Network tab)
   - No errors in console

**Pass Criteria:** Browser navigation works correctly

---

### ✅ Test 4: Multiple Story Views

**Steps:**

1. Navigate to `/history`
2. Click "View" on Story A
3. Wait for analysis to load
4. Click browser "Back" button
5. Click "View" on Story B (different story)
6. **Expected Result:**
   - Story B's analysis loads correctly
   - Story A's data is not shown
   - URL updates to Story B's ID

**Pass Criteria:** Switching between stories works correctly

---

### ✅ Test 5: Page Refresh

**Steps:**

1. Navigate to `/analyzer?story={story-id}` (with a valid story ID)
2. Wait for analysis to load
3. Press `F5` or `Cmd+R` to refresh the page
4. **Expected Result:**
   - Page refreshes
   - Story analysis loads again
   - No form is shown
   - Analysis results match the story ID in URL

**Pass Criteria:** Page refresh maintains correct state

---

### ✅ Test 6: Story Without Analysis Result

**Steps:**

1. Navigate to `/history`
2. Find or create a story that doesn't have an `analysis_result`
3. Click "View" button
4. **Expected Result:**
   - Story data loads (title, story text, acceptance criteria)
   - Form is pre-filled with story data
   - No analysis results shown
   - User can analyze the story

**Pass Criteria:** Stories without analysis show form correctly

---

### ✅ Test 7: Invalid Story ID

**Steps:**

1. Navigate to `/analyzer?story=invalid-id-12345`
2. **Expected Result:**
   - Error message appears: "Story not found" or "Failed to load story"
   - Form is shown (allowing new analysis)
   - No crash or infinite loading

**Pass Criteria:** Invalid IDs handled gracefully

---

### ✅ Test 8: Logout/Login Flow

**Steps:**

1. Navigate to `/history`
2. Click "View" on a story
3. Wait for analysis to load
4. Log out
5. Log back in
6. Navigate to `/history`
7. Click "View" on the same story
8. **Expected Result:**
   - Story analysis loads correctly after login
   - No redirect to login page
   - Analysis displays properly

**Pass Criteria:** Authentication state doesn't break functionality

---

### ✅ Test 9: Network Tab Verification

**Steps:**

1. Open browser DevTools → Network tab
2. Navigate to `/history`
3. Click "View" on a story
4. **Expected Result:**
   - Only ONE request to `/api/stories/{id}` is made
   - Request includes credentials (cookies)
   - Response status is 200
   - Response contains `analysis_result` field

**Pass Criteria:** No duplicate API calls, proper authentication

---

### ✅ Test 10: Console Error Check

**Steps:**

1. Open browser DevTools → Console tab
2. Navigate to `/history`
3. Click "View" on a story
4. Navigate between stories multiple times
5. Use browser back/forward buttons
6. **Expected Result:**
   - No errors in console
   - No warnings about missing dependencies
   - No React warnings

**Pass Criteria:** No console errors or warnings

---

### ✅ Test 11: "Analyze Another Story" Button

**Steps:**

1. View a story analysis
2. Click "Analyze Another Story" button
3. **Expected Result:**
   - URL changes to `/analyzer` (no story parameter)
   - Form is shown (empty)
   - Analysis results are cleared
   - Ready for new analysis

**Pass Criteria:** Clear functionality works correctly

---

### ✅ Test 12: Concurrent Navigation Prevention

**Steps:**

1. Navigate to `/history`
2. Rapidly click "View" on the same story multiple times (5-10 clicks)
3. **Expected Result:**
   - Only ONE API call is made (check Network tab)
   - Story loads once
   - No duplicate loading states
   - No errors

**Pass Criteria:** Rapid clicks don't cause duplicate loads

---

## Performance Checks

### ✅ Load Time

- Story analysis should load within 1-2 seconds on a good connection
- Loading spinner should appear immediately when clicking "View"

### ✅ Memory Leaks

- Navigate between stories 10+ times
- Check browser memory usage (should not continuously increase)
- No console warnings about memory leaks

---

## Browser Compatibility

Test on:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

---

## Common Issues to Watch For

### ❌ Issue: Redirects to login page

**Cause:** Authentication cookies not being sent
**Fix:** Ensure `credentials: 'include'` is in fetch requests

### ❌ Issue: Shows form instead of analysis

**Cause:** `storyId` not being read from URL correctly
**Fix:** Check `getStoryIdFromUrl()` function

### ❌ Issue: Duplicate API calls

**Cause:** `useEffect` dependencies triggering multiple times
**Fix:** Check ref-based loading prevention logic

### ❌ Issue: Analysis doesn't load after logout/login

**Cause:** State not resetting properly
**Fix:** Verify `useEffect` cleanup and state reset

---

## Quick Test Script

Run this quick test sequence:

1. ✅ View button works
2. ✅ Direct URL works
3. ✅ Browser back/forward works
4. ✅ Page refresh works
5. ✅ Logout/login works
6. ✅ No duplicate API calls
7. ✅ No console errors

If all pass, the feature is production-ready! 🎉
