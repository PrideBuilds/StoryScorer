import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/security/rateLimit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    jest.clearAllMocks();
  });

  describe("checkRateLimit", () => {
    it("should allow first request", () => {
      const result = checkRateLimit("test-key", RATE_LIMITS.analyze);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMITS.analyze.maxRequests - 1);
    });

    it("should track multiple requests", () => {
      const key = "test-key-2";
      const limit = { maxRequests: 3, windowMs: 60000 };

      // First request
      const result1 = checkRateLimit(key, limit);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(2);

      // Second request
      const result2 = checkRateLimit(key, limit);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(1);

      // Third request
      const result3 = checkRateLimit(key, limit);
      expect(result3.allowed).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it("should block after limit exceeded", () => {
      const key = "test-key-3";
      const limit = { maxRequests: 2, windowMs: 60000 };

      // Make requests up to limit
      checkRateLimit(key, limit);
      checkRateLimit(key, limit);

      // This should be blocked
      const result = checkRateLimit(key, limit);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
    });

    it("should reset after window expires", () => {
      const key = "test-key-4";
      const limit = { maxRequests: 1, windowMs: 100 }; // Very short window

      // First request
      checkRateLimit(key, limit);

      // Wait for window to expire
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = checkRateLimit(key, limit);
          expect(result.allowed).toBe(true);
          resolve(undefined);
        }, 150);
      });
    });
  });

  describe("getClientIP", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://example.com", {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1",
        },
      } as any);

      expect(getClientIP(request)).toBe("192.168.1.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = new Request("http://example.com", {
        headers: {
          "x-real-ip": "192.168.1.1",
        },
      } as any);

      expect(getClientIP(request)).toBe("192.168.1.1");
    });

    it("should prioritize cf-connecting-ip", () => {
      const request = new Request("http://example.com", {
        headers: {
          "cf-connecting-ip": "1.2.3.4",
          "x-forwarded-for": "192.168.1.1",
        },
      } as any);

      expect(getClientIP(request)).toBe("1.2.3.4");
    });

    it("should return 'unknown' if no IP headers", () => {
      const request = new Request("http://example.com", {
        headers: {},
      } as any);

      expect(getClientIP(request)).toBe("unknown");
    });
  });
});
