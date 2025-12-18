{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;\f1\fnil\fcharset0 HelveticaNeue;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red155\green163\blue178;\red0\green0\blue0;
}
{\*\expandedcolortbl;;\cssrgb\c0\c1\c1;\cssrgb\c67166\c69917\c74931;\cssrgb\c0\c0\c0\c84706;
}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Implement security headers:\

- Configure security headers in next.config.js or middleware:\
  - Content-Security-Policy\
  - X-Frame-Options: DENY\
  - X-Content-Type-Options: nosniff\
  - Referrer-Policy: strict-origin-when-cross-origin\
  - Permissions-Policy\
- Test headers with securityheaders.com\
- Ensure HTTPS redirect is enforced\
- Add HSTS header for production\
  \pard\pardeftab720\qc\partightenfactor0

\f1\fs22 \cf2 \strokec4 \shad0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Add rate limiting:\

- Install rate limiting library (upstash/ratelimit or similar)\
- Implement rate limiting on API routes:\
  - /api/analyze - 20 requests per hour per user\
  - /api/auth/\* - 5 requests per 15 minutes per IP\
  - /api/checkout - 3 requests per hour per user\
- Return appropriate 429 errors when exceeded\
- Add user-friendly error messages\
- Log rate limit violations\
- Consider IP-based limiting for public endpoints
  \f1\fs22 \cf2 \strokec4 \shad0 \
  \pard\pardeftab720\qc\partightenfactor0
  \cf2 \strokec4 \
  \pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Secure API routes and server actions:\

- Verify user authentication on all protected routes\
- Validate all input data with Zod schemas\
- Sanitize user inputs to prevent XSS\
- Use parameterized queries to prevent SQL injection\
- Check authorization (user owns the resource)\
- Add CSRF protection to forms\
- Implement proper error handling without exposing sensitive data\
- Log security events
  \f1\fs22 \cf2 \strokec4 \shad0 \
  \pard\pardeftab720\qc\partightenfactor0
  \cf2 \strokec4 \
  \pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \strokec3 \shad\shadx0\shady-20\shadr0\shado0 \shadc0 Review and test Row Level Security policies:\

- Verify RLS is enabled on all tables\
- Test that users can only access their own data\
- Test that users cannot modify others' data\
- Verify service role bypasses RLS when needed\
- Check for any policy gaps\
- Add policies for new tables immediately\
- Document all RLS policies\
  }
