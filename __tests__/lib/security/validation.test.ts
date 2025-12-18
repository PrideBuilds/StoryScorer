import {
  sanitizeString,
  sanitizeHTML,
  validateStoryInput,
  isValidUUID,
  isValidEmail,
} from "@/lib/security/validation";

describe("Validation Utilities", () => {
  describe("sanitizeString", () => {
    it("should remove angle brackets", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe(
        "scriptalert('xss')/script"
      );
    });

    it("should trim whitespace", () => {
      expect(sanitizeString("  hello world  ")).toBe("hello world");
    });

    it("should limit length to 10000 characters", () => {
      const longString = "a".repeat(15000);
      expect(sanitizeString(longString).length).toBe(10000);
    });

    it("should handle empty strings", () => {
      expect(sanitizeString("")).toBe("");
    });

    it("should handle non-string input", () => {
      expect(sanitizeString(null as any)).toBe("");
      expect(sanitizeString(123 as any)).toBe("");
    });
  });

  describe("sanitizeHTML", () => {
    it("should remove script tags", () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeHTML(input)).toBe("Hello");
    });

    it("should remove event handlers", () => {
      const input = '<div onclick="alert(1)">Click me</div>';
      expect(sanitizeHTML(input)).not.toContain("onclick");
    });

    it("should handle empty strings", () => {
      expect(sanitizeHTML("")).toBe("");
    });
  });

  describe("validateStoryInput", () => {
    it("should validate correct input", () => {
      const input = {
        title: "Test Story",
        storyText: "As a user, I want to test",
        acceptanceCriteria: "Given... When... Then...",
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe("Test Story");
    });

    it("should reject missing title", () => {
      const input = {
        storyText: "As a user, I want to test",
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject missing story text", () => {
      const input = {
        title: "Test Story",
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(false);
    });

    it("should reject title that is too long", () => {
      const input = {
        title: "a".repeat(201),
        storyText: "As a user, I want to test",
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(false);
    });

    it("should reject story text that is too long", () => {
      const input = {
        title: "Test Story",
        storyText: "a".repeat(5001),
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(false);
    });

    it("should sanitize input", () => {
      const input = {
        title: "<script>alert('xss')</script>Test",
        storyText: "As a user, I want to test",
      };

      const result = validateStoryInput(input);
      expect(result.valid).toBe(true);
      expect(result.data?.title).not.toContain("<script>");
    });
  });

  describe("isValidUUID", () => {
    it("should validate correct UUID", () => {
      expect(
        isValidUUID("123e4567-e89b-12d3-a456-426614174000")
      ).toBe(true);
    });

    it("should reject invalid UUID", () => {
      expect(isValidUUID("not-a-uuid")).toBe(false);
      expect(isValidUUID("123")).toBe(false);
      expect(isValidUUID("")).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("test.user@example.co.uk")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });
});
