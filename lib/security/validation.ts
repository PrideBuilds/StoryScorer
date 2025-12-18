/**
 * Input validation and sanitization utilities
 */

import { z } from "zod";

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
    .slice(0, 10000); // Max length
}

/**
 * Sanitize HTML content (basic)
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove script tags and event handlers
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .trim();
}

/**
 * Validate and sanitize story input
 */
export function validateStoryInput(input: unknown): {
  valid: boolean;
  data?: {
    title: string;
    storyText: string;
    acceptanceCriteria?: string;
  };
  error?: string;
} {
  const schema = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters")
      .transform((val) => sanitizeString(val)),
    storyText: z
      .string()
      .min(1, "Story text is required")
      .max(5000, "Story text must be less than 5000 characters")
      .transform((val) => sanitizeString(val)),
    acceptanceCriteria: z
      .string()
      .max(2000, "Acceptance criteria must be less than 2000 characters")
      .optional()
      .transform((val) => (val ? sanitizeString(val) : undefined)),
  });

  try {
    const data = schema.parse(input);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      return {
        valid: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { valid: false, error: "Invalid input" };
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

