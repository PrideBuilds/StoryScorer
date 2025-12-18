{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardeftab720\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Create the main dashboard layout structure:\
- Create /app/(dashboard)/layout.tsx for authenticated pages\
- Build a responsive sidebar navigation component\
- Create a header component with user profile dropdown\
- Add mobile-responsive hamburger menu\
- Implement proper semantic HTML structure\
- Create navigation items: Dashboard, [Feature Name], History, Settings\
- Add active state styling for current page\
- Make layout sticky/fixed where appropriate\
\
Build the dashboard home page:\
- Create /app/(dashboard)/dashboard/page.tsx\
- Design a welcome section with user's name\
- Create stats cards showing:\
  * Total items analyzed\
  * Current month usage\
  * Plan type\
  * Days remaining in billing period\
- Add quick action buttons for main features\
- Create a recent activity feed component\
- Fetch and display user's recent items\
- Make the page responsive for all screen sizes\
\
Create the user profile/settings page:\
- Create /app/(dashboard)/settings/page.tsx\
- Build tabbed interface for different settings sections\
- Create "Profile" tab with form to update:\
  * Full name\
  * Email (read-only, show how to change)\
  * Company\
  * Job title\
- Create "Account" tab with:\
  * Change password form\
  * Delete account option (with confirmation)\
- Create "Preferences" tab for user preferences\
- Implement server actions to update profile data\
- Add success/error toast notifications\
- Validate all form inputs\
\
Implement user profile data fetching and state management:\
- Create /lib/hooks/useUser.ts custom hook\
- Fetch current user from Supabase auth\
- Fetch user profile data from profiles table\
- Handle loading and error states\
- Cache user data appropriately\
- Create context provider if needed for global user state\
- Export reusable functions for getting user data}