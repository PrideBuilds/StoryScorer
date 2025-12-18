{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww21060\viewh16660\viewkind0
\deftab720
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardeftab720\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Create a new Next.js 14 project with TypeScript, Tailwind CSS, and App Router. Configure the project with the following specifications:\
- Use TypeScript with strict mode enabled\
- Install and configure Tailwind CSS with the default configuration\
- Set up ESLint and Prettier for code formatting\
- Create a proper .gitignore file that excludes node_modules, .env files, and .next directory\
- Initialize a Git repository and create an initial commit\
- Create a README.md with project description and setup instructions\
- Set up folder structure following Next.js 14 App Router conventions with /app, /components, /lib, /types directories\
\
Install and configure all core dependencies needed for the application:\
- Install Supabase client library (@supabase/supabase-js, @supabase/auth-helpers-nextjs)\
- Install shadcn/ui CLI and initialize it in the project\
- Install Zod for schema validation\
- Install React Hook Form for form handling\
- Install date-fns for date manipulation\
- Install lucide-react for icons\
- Create a package.json script for running development server\
- Verify all installations work correctly\
\
Set up environment variables and configuration files:\
- Create .env.local file with placeholders for all required environment variables\
- Add NEXT_PUBLIC_SUPABASE_URL placeholder\
- Add NEXT_PUBLIC_SUPABASE_ANON_KEY placeholder\
- Add SUPABASE_SERVICE_ROLE_KEY placeholder (for server-side operations)\
- Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY placeholders\
- Add OPENAI_API_KEY or ANTHROPIC_API_KEY placeholder\
- Create .env.example file with the same structure but no actual values\
- Document each environment variable's purpose in comments\
\
Create a Supabase client configuration:\
- Create /lib/supabase/client.ts for client-side Supabase operations\
- Create /lib/supabase/server.ts for server-side Supabase operations using cookies\
- Implement proper TypeScript types for Supabase client\
- Add error handling for missing environment variables\
- Create helper functions for common Supabase operations\
- Export clients for use throughout the application}