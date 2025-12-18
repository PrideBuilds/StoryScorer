# E2E Testing Setup (Optional)

This document outlines how to set up end-to-end testing with Playwright.

## Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

## Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Example E2E Tests

### Authentication Flow

```typescript
import { test, expect } from "@playwright/test";

test("user can sign up and login", async ({ page }) => {
  await page.goto("/signup");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "Test1234!");
  await page.fill('[name="fullName"]', "Test User");
  await page.click('button[type="submit"]');

  // Should redirect to verify email page
  await expect(page).toHaveURL(/verify-email/);
});
```

### Story Analysis Flow

```typescript
test("user can analyze a story", async ({ page }) => {
  // Login first
  await page.goto("/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "Test1234!");
  await page.click('button[type="submit"]');

  // Navigate to analyzer
  await page.goto("/analyzer");
  await page.fill('[name="storyText"]', "As a user, I want to test");
  await page.click('button[type="submit"]');

  // Wait for analysis results
  await expect(page.locator(".analysis-results")).toBeVisible();
});
```

## Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in UI mode
npx playwright test --ui

# Run specific test
npx playwright test signup.spec.ts

# Generate test code
npx playwright codegen http://localhost:3000
```

## Note

E2E testing is optional and can be set up later. The current test suite focuses on unit and integration tests which are faster and easier to maintain.
