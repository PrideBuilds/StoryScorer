import { storyInputSchema } from "@/lib/validations/story";

describe("Story Input Validation", () => {
  it("should validate correct story input", () => {
    const input = {
      title: "User Login Story",
      storyText: "As a user, I want to login so I can access the system.",
      acceptanceCriteria: "Given I am on the login page...",
      tags: ["authentication", "login"],
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject missing title", () => {
    const input = {
      storyText: "As a user, I want to login",
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject missing story text", () => {
    const input = {
      title: "User Login Story",
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject title that is too long", () => {
    const input = {
      title: "a".repeat(201),
      storyText: "As a user, I want to login",
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject story text that is too long", () => {
    const input = {
      title: "User Login Story",
      storyText: "a".repeat(5001),
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept optional acceptance criteria", () => {
    const input = {
      title: "User Login Story",
      storyText: "As a user, I want to login",
      acceptanceCriteria: "Given... When... Then...",
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should accept optional tags", () => {
    const input = {
      title: "User Login Story",
      storyText: "As a user, I want to login",
      tags: ["auth", "login"],
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should limit tags to 10", () => {
    const input = {
      title: "User Login Story",
      storyText: "As a user, I want to login",
      tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
    };

    const result = storyInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
