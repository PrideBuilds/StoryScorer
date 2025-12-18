# Security Hardening Documentation

This document outlines the security measures implemented in StoryScorer.

## 1. Security Headers

### Implemented Headers

All responses include the following security headers:

- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts browser features (camera, microphone, geolocation)
- **Content-Security-Policy (CSP)** - Restricts resource loading to prevent XSS
- **Strict-Transport-Security (HSTS)** - Enforces HTTPS in production

### CSP Configuration

The Content Security Policy allows:
- Scripts from `self`, Stripe, and necessary inline scripts
- Styles from `self` and inline styles
- Images from `self`, data URIs, and HTTPS sources
- Connections to Supabase, OpenAI, Anthropic, and Stripe APIs
- Frames from Stripe for payment processing

## 2. Rate Limiting

### Rate Limit Configurations

| Endpoint | Limit | Window | Type |
|----------|-------|--------|------|
| `/api/analyze` | 20 requests | 1 hour | Per user |
| `/api/auth/*` | 5 requests | 15 minutes | Per IP |
| `/api/checkout` | 3 requests | 1 hour | Per user |
| `/api/stories` | 100 requests | 1 minute | Per user |

### Implementation

- Rate limiting is implemented using an in-memory store
- **Production Recommendation**: Use Redis or Upstash for distributed rate limiting
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (when rate limited)

### Rate Limit Responses

When rate limited, API routes return:
- Status code: `429 Too Many Requests`
- Error message with retry time
- `Retry-After` header indicating seconds to wait

## 3. Input Validation and Sanitization

### Validation Utilities

All user inputs are validated using:
- **Zod schemas** for type-safe validation
- **Custom sanitization** functions to prevent XSS
- **Length limits** on all text inputs
- **Format validation** for UUIDs, emails, etc.

### Sanitization

- String inputs are sanitized to remove potentially dangerous characters
- HTML content is sanitized to remove script tags and event handlers
- Input length is limited to prevent DoS attacks

### Validated Endpoints

- `/api/analyze` - Story text and acceptance criteria
- `/api/stories` - Story creation and updates
- `/api/checkout` - Plan and price IDs
- All form submissions

## 4. Authentication and Authorization

### Authentication Checks

All protected API routes verify:
1. User is authenticated (valid session)
2. User ID matches resource ownership (for user-specific data)
3. Request contains valid authentication tokens

### Protected Routes

- `/api/analyze` - Requires authentication
- `/api/stories` - Requires authentication
- `/api/checkout` - Requires authentication
- `/api/stories/[id]` - Requires authentication + ownership

### Authorization

- Users can only access their own stories
- RLS (Row Level Security) policies enforce data isolation at the database level
- Service role key is only used for admin operations (webhooks)

## 5. SQL Injection Prevention

### Supabase Protection

- All database queries use Supabase's parameterized queries
- No raw SQL is constructed from user input
- RLS policies provide additional protection layer

### Best Practices

- Always use Supabase client methods (`.select()`, `.insert()`, `.update()`)
- Never concatenate user input into SQL strings
- Use `.eq()`, `.filter()`, and other query builders

## 6. Row Level Security (RLS)

### RLS Policies

All tables have RLS enabled with policies:

1. **profiles** - Users can read/update their own profile
2. **subscriptions** - Users can read their own subscription
3. **user_stories** - Users can CRUD their own stories
4. **usage_tracking** - Users can read their own usage
5. **story_history** - Users can read history of their own stories

### Testing RLS

To verify RLS is working:
1. Test that users cannot access other users' data
2. Verify service role can bypass RLS when needed (webhooks)
3. Check that unauthenticated users cannot access protected data

## 7. Error Handling

### Security-Conscious Error Messages

- Generic error messages for users (no sensitive data exposure)
- Detailed errors logged server-side only
- No stack traces exposed to clients
- No database schema information in errors

### Error Response Format

```json
{
  "error": "User-friendly error message",
  "message": "Additional context (if safe)"
}
```

## 8. Environment Variables

### Security Best Practices

- All secrets stored in `.env.local` (not committed to git)
- `.env.example` provided without actual values
- Service role keys never exposed to client-side
- API keys validated before use

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only service role key
- `STRIPE_SECRET_KEY` - Server-only Stripe secret
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - Server-only AI API key

## 9. CSRF Protection

### Next.js Built-in Protection

- Next.js App Router provides CSRF protection for Server Actions
- SameSite cookies prevent CSRF attacks
- Form submissions use Server Actions (not exposed endpoints)

## 10. Production Recommendations

### Additional Security Measures

1. **Use Redis for Rate Limiting**
   - Replace in-memory rate limiting with Redis
   - Enables distributed rate limiting across multiple servers

2. **Enable Supabase Audit Logs**
   - Monitor database access patterns
   - Detect suspicious activity

3. **Implement Request Logging**
   - Log all API requests with user ID and IP
   - Monitor for unusual patterns

4. **Regular Security Audits**
   - Review dependencies for vulnerabilities
   - Run `npm audit` regularly
   - Keep dependencies updated

5. **WAF (Web Application Firewall)**
   - Use Cloudflare or similar for DDoS protection
   - Additional layer of security

6. **Security Monitoring**
   - Set up alerts for failed authentication attempts
   - Monitor rate limit violations
   - Track unusual API usage patterns

## 11. Security Testing

### Recommended Tests

1. **Authentication Tests**
   - Verify protected routes require authentication
   - Test unauthorized access attempts
   - Verify session expiration

2. **Authorization Tests**
   - Users cannot access other users' data
   - Users cannot modify other users' resources
   - RLS policies are enforced

3. **Input Validation Tests**
   - XSS attempts are blocked
   - SQL injection attempts fail
   - Invalid inputs are rejected

4. **Rate Limiting Tests**
   - Rate limits are enforced
   - Appropriate error messages returned
   - Headers are set correctly

## 12. Incident Response

### If a Security Issue is Discovered

1. Immediately assess the severity
2. If critical, temporarily disable affected features
3. Fix the issue and deploy
4. Review logs for any exploitation
5. Notify affected users if data was compromised
6. Document the incident and resolution

## 13. Compliance

### Data Protection

- User data is encrypted at rest (Supabase)
- Data in transit uses TLS/HTTPS
- GDPR-compliant data handling (see Privacy Policy)
- User data deletion on account deletion

### Security Standards

- Follows OWASP Top 10 security best practices
- Implements defense in depth
- Regular security reviews recommended

