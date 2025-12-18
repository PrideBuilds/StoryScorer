/**
 * Test utilities and helpers for testing
 */

import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

// Custom render function that includes providers
export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, {
    ...options,
  });
};

// Re-export everything from testing library
export * from "@testing-library/react";

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

/**
 * Mock story data for testing
 */
export const mockStory = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  user_id: mockUser.id,
  title: "Test Story",
  story_text: "As a user, I want to test so that I can verify functionality.",
  acceptance_criteria:
    "Given I am testing, When I run tests, Then they should pass.",
  tags: ["testing", "qa"],
  score: 85,
  analysis_result: {
    independent: { score: 90, feedback: "Good" },
    negotiable: { score: 85, feedback: "Good" },
    valuable: { score: 80, feedback: "Good" },
    estimable: { score: 85, feedback: "Good" },
    small: { score: 90, feedback: "Good" },
    testable: { score: 80, feedback: "Good" },
    overall_score: 85,
    recommendations: ["Add more detail"],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock subscription data for testing
 */
export const mockSubscription = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  user_id: mockUser.id,
  stripe_customer_id: "cus_test123",
  stripe_subscription_id: "sub_test123",
  plan_type: "pro" as const,
  status: "active" as const,
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Wait for async operations
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Create mock fetch response
 */
export function createMockResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  } as Response;
}
