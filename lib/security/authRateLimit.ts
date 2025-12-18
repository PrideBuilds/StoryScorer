/**
 * Rate limiting for authentication endpoints
 * Uses IP-based limiting to prevent brute force attacks
 */

import { checkRateLimit, getClientIP, RATE_LIMITS } from "./rateLimit";
import { NextRequest, NextResponse } from "next/server";

/**
 * Check rate limit for authentication endpoints
 * Returns NextResponse with 429 status if rate limited, null if allowed
 */
export function checkAuthRateLimit(
  request: NextRequest
): NextResponse | null {
  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(`auth:ip:${ip}`, RATE_LIMITS.auth);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Too many authentication attempts. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
          "X-RateLimit-Limit": String(RATE_LIMITS.auth.maxRequests),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  }

  return null;
}

