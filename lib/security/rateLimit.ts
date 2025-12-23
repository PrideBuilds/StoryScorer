/**
 * Rate limiting utility
 * In production, use Redis or a proper rate limiting service like Upstash
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const stored = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    // 1% chance to clean up
    const keysToDelete: string[] = [];
    rateLimitStore.forEach((v, k) => {
      if (now > v.resetTime) {
        keysToDelete.push(k);
      }
    });
    keysToDelete.forEach((k) => rateLimitStore.delete(k));
  }

  if (!stored || now > stored.resetTime) {
    // Create new or reset expired limit
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (stored.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((stored.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: stored.resetTime,
      retryAfter,
    };
  }

  // Increment count
  stored.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - stored.count,
    resetTime: stored.resetTime,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP (in case of proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (cfConnectingIP) {
    return cfConnectingIP.split(",")[0].trim();
  }

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP.split(",")[0].trim();
  }

  return "unknown";
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  analyze: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  checkout: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  stories: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;
