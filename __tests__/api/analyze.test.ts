/**
 * Integration tests for /api/analyze route
 * Note: These tests require mocking Supabase and AI API calls
 */

import { POST } from "@/app/api/analyze/route";
import { NextRequest } from "next/server";
import {
  createMockRequest,
  createMockFetchResponse,
} from "../helpers/testHelpers";

// Mock dependencies
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: { user: { id: "test-user-id", email: "test@example.com" } },
        error: null,
      })),
    },
  })),
}));

jest.mock("@/lib/security/rateLimit", () => ({
  checkRateLimit: jest.fn(() => ({
    allowed: true,
    remaining: 19,
    resetTime: Date.now() + 3600000,
  })),
  RATE_LIMITS: {
    analyze: { maxRequests: 20, windowMs: 3600000 },
  },
}));

jest.mock("@/lib/security/validation", () => ({
  validateStoryInput: jest.fn((input) => ({
    valid: true,
    data: {
      title: input.title || "Test Story",
      storyText: input.storyText,
      acceptanceCriteria: input.acceptanceCriteria,
    },
  })),
}));

// Mock AI API calls
global.fetch = jest.fn();

describe("/api/analyze", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    const { createClient } = require("@/lib/supabase/server");
    createClient.mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({
          data: { user: null },
          error: { message: "Not authenticated" },
        })),
      },
    });

    const request = createMockRequest({
      storyText: "As a user, I want to test",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 if story text is missing", async () => {
    const request = createMockRequest({});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it("should return 429 if rate limit exceeded", async () => {
    const { checkRateLimit } = require("@/lib/security/rateLimit");
    checkRateLimit.mockReturnValueOnce({
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + 3600000,
      retryAfter: 3600,
    });

    const request = createMockRequest({
      storyText: "As a user, I want to test",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe("Rate limit exceeded");
  });
});
