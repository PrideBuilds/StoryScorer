/**
 * Test helpers and utilities
 */

import type { UserStory } from "@/types/database";
import type { INVESTAnalysisResult } from "@/types/database";

/**
 * Create mock user story for testing
 */
export function createMockStory(overrides?: Partial<UserStory>): UserStory {
  return {
    id: "123e4567-e89b-12d3-a456-426614174000",
    user_id: "user-123",
    title: "Test Story",
    story_text: "As a user, I want to test so that I can verify functionality.",
    acceptance_criteria: "Given... When... Then...",
    tags: ["test", "example"],
    score: 75,
    analysis_result: createMockAnalysisResult(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock INVEST analysis result
 */
export function createMockAnalysisResult(
  overrides?: Partial<INVESTAnalysisResult>
): INVESTAnalysisResult {
  return {
    independent: { score: 80, feedback: "Good independence" },
    negotiable: { score: 75, feedback: "Somewhat negotiable" },
    valuable: { score: 85, feedback: "High value" },
    estimable: { score: 70, feedback: "Can be estimated" },
    small: { score: 65, feedback: "Could be smaller" },
    testable: { score: 90, feedback: "Well testable" },
    overall_score: 75,
    recommendations: ["Add more details", "Break into smaller stories"],
    ...overrides,
  };
}

/**
 * Create mock fetch response
 */
export function createMockFetchResponse(
  data: any,
  status: number = 200
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response;
}

/**
 * Mock Next.js request
 */
export function createMockRequest(
  body?: any,
  headers?: Record<string, string>
): Request {
  return new Request("http://localhost:3000/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

