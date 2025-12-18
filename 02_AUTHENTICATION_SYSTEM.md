{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red155\green163\blue178;}
{\*\expandedcolortbl;;\cssrgb\c0\c1\c1;\cssrgb\c67166\c69917\c74931;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\shad\shadx0\shady-20\shadr0\shado0 \shadc0 Create the authentication layout and styling components:\

- Create /app/(auth)/layout.tsx for authentication pages\
- Design a centered card layout for auth forms\
- Add your product logo/branding\
- Create a reusable AuthCard component in /components/auth/\
- Style the layout to be responsive and visually appealing\
- Add background gradient or image\
- Ensure the layout works on mobile and desktop\
  \
  Build the sign-up page and functionality:\
- Create /app/(auth)/signup/page.tsx\
- Create a sign-up form with email, password, and full name fields\
- Use React Hook Form for form handling\
- Add Zod schema validation for email format and password strength\
- Implement client-side validation with helpful error messages\
- Create server action for sign-up in /app/actions/auth.ts\
- Use Supabase auth.signUp() method\
- Add error handling for duplicate emails\
- Redirect to email confirmation page after successful signup\
- Add link to login page for existing users\
  \
  Build the login page and functionality:\
- Create /app/(auth)/login/page.tsx\
- Create login form with email and password fields\
- Use React Hook Form with Zod validation\
- Implement "Remember me" checkbox (optional)\
- Create server action for login\
- Use Supabase auth.signInWithPassword() method\
- Handle authentication errors gracefully\
- Redirect to dashboard after successful login\
- Add "Forgot password?" link\
- Add link to sign-up page for new users\
  \
  Implement password reset functionality:\
- Create /app/(auth)/forgot-password/page.tsx\
- Build form to request password reset email\
- Create server action to send reset email via Supabase\
- Create /app/(auth)/reset-password/page.tsx\
- Build form to set new password\
- Verify reset token from URL parameters\
- Update password using Supabase auth\
- Add success/error messaging\
- Redirect to login after successful reset\
  \
  Create logout functionality and session management:\
- Create a logout server action in /app/actions/auth.ts\
- Implement Supabase auth.signOut() method\
- Create a logout button component\
- Add the logout button to the dashboard header/navigation\
- Clear any client-side state on logout\
- Redirect to login page after logout\
- Implement middleware to protect authenticated routes\
- Create /middleware.ts to check auth status and redirect unauthenticated users\
  \
  Build email verification flow:\
- Create /app/(auth)/verify-email/page.tsx\
- Display message asking users to check their email\
- Handle email verification callback\
- Create /app/auth/callback/route.ts API route\
- Exchange code for session in the callback\
- Redirect to dashboard after verification\
- Add resend verification email functionality\
- Handle expired verification links}
