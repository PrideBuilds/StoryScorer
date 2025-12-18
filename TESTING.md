# Testing Documentation

This document outlines the testing strategy and setup for StoryScorer.

## Testing Framework

### Jest Configuration

- **Framework**: Jest with React Testing Library
- **Configuration**: `jest.config.js`
- **Setup**: `jest.setup.js` (includes jest-dom matchers and Next.js mocks)

### Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Test Structure

```
__tests__/
├── api/              # API route integration tests
├── components/       # Component unit tests
├── lib/              # Utility function tests
│   ├── security/    # Security utility tests
│   └── validations/ # Validation schema tests
└── helpers/          # Test helpers and fixtures
```

## Test Coverage Goals

- **Critical Paths**: 70%+ coverage
- **Utility Functions**: 80%+ coverage
- **Security Functions**: 90%+ coverage
- **Components**: 60%+ coverage

## Writing Tests

### Unit Tests

Test individual functions and utilities in isolation:

```typescript
import { sanitizeString } from "@/lib/security/validation";

describe("sanitizeString", () => {
  it("should remove angle brackets", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
  });
});
```

### Component Tests

Test React components with React Testing Library:

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeDefined();
  });
});
```

### Integration Tests

Test API routes and server actions:

```typescript
import { POST } from "@/app/api/analyze/route";

describe("/api/analyze", () => {
  it("should return 401 if not authenticated", async () => {
    const request = createMockRequest({ storyText: "Test" });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
```

## Test Helpers

### Mock Data Factories

Use test helpers to create consistent mock data:

```typescript
import { createMockStory, createMockAnalysisResult } from "@/__tests__/helpers/testHelpers";

const story = createMockStory({ title: "Custom Title" });
const analysis = createMockAnalysisResult({ overall_score: 90 });
```

### Mock Requests

Create mock Next.js requests for API testing:

```typescript
import { createMockRequest } from "@/__tests__/helpers/testHelpers";

const request = createMockRequest({ storyText: "Test story" });
```

## Manual Testing

See `__tests__/MANUAL_TESTING_CHECKLIST.md` for a comprehensive manual testing checklist covering:

- Authentication flows
- Core features
- Subscription & billing
- Settings
- Navigation & UI
- Error handling
- Accessibility
- Performance
- Edge cases
- Security

## E2E Testing (Future)

For end-to-end testing, consider setting up Playwright:

```bash
npm install --save-dev @playwright/test
```

Example E2E test:

```typescript
import { test, expect } from '@playwright/test';

test('user can analyze a story', async ({ page }) => {
  await page.goto('/analyzer');
  await page.fill('[name="storyText"]', 'As a user, I want to test');
  await page.click('button[type="submit"]');
  await expect(page.locator('.analysis-results')).toBeVisible();
});
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run specific test file
npm test validation.test.ts

# Run tests matching pattern
npm test -- validation
```

### CI/CD

Tests should run automatically in CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:ci
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how
   - Test user-facing behavior

2. **Keep Tests Simple**
   - One assertion per test when possible
   - Clear test names that describe what's being tested

3. **Use Mocks Sparingly**
   - Mock external dependencies (APIs, databases)
   - Don't mock everything

4. **Test Edge Cases**
   - Empty inputs
   - Invalid inputs
   - Boundary conditions
   - Error scenarios

5. **Maintain Test Data**
   - Use factories for consistent test data
   - Keep test data realistic

6. **Clean Up**
   - Reset mocks between tests
   - Clean up test data after tests

## Coverage Reports

After running `npm run test:coverage`, view the coverage report:

- HTML report: `coverage/lcov-report/index.html`
- Terminal output shows summary

## Continuous Improvement

- Review test coverage regularly
- Add tests for bugs found in production
- Refactor tests as code evolves
- Keep tests fast and maintainable
