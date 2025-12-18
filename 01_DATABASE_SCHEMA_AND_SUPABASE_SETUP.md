{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardeftab720\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Design and create the users and profiles database schema in Supabase:\
- Create a 'profiles' table that extends Supabase auth.users with additional fields:\
  * id (uuid, primary key, references auth.users)\
  * full_name (text)\
  * company (text, nullable)\
  * job_title (text, nullable)\
  * created_at (timestamp with time zone)\
  * updated_at (timestamp with time zone)\
- Set up a trigger to automatically create a profile when a user signs up\
- Enable Row Level Security (RLS) on profiles table\
- Create RLS policy: users can read their own profile\
- Create RLS policy: users can update their own profile\
- Test the schema with sample data\
\
Create subscriptions and usage tracking database schema:\
- Create 'subscriptions' table with fields:\
  * id (uuid, primary key)\
  * user_id (uuid, references profiles.id)\
  * stripe_customer_id (text, unique)\
  * stripe_subscription_id (text, unique, nullable)\
  * plan_type (text: 'free', 'pro', 'enterprise')\
  * status (text: 'active', 'canceled', 'past_due')\
  * current_period_start (timestamp)\
  * current_period_end (timestamp)\
  * created_at (timestamp)\
  * updated_at (timestamp)\
- Create 'usage_tracking' table:\
  * id (uuid, primary key)\
  * user_id (uuid, references profiles.id)\
  * feature_used (text)\
  * usage_count (integer)\
  * period_start (timestamp)\
  * period_end (timestamp)\
  * created_at (timestamp)\
- Set up RLS policies for both tables\
- Create indexes on user_id and stripe_customer_id for performance\
\
Create the core feature database schema (adjust based on your chosen feature - this example uses User Story Scorer):\
- Create 'user_stories' table:\
  * id (uuid, primary key)\
  * user_id (uuid, references profiles.id)\
  * title (text)\
  * story_text (text)\
  * acceptance_criteria (text, nullable)\
  * score (integer, nullable)\
  * analysis_result (jsonb, nullable)\
  * tags (text array, nullable)\
  * created_at (timestamp)\
  * updated_at (timestamp)\
- Create 'story_history' table for tracking changes:\
  * id (uuid, primary key)\
  * story_id (uuid, references user_stories.id)\
  * version (integer)\
  * story_text (text)\
  * score (integer)\
  * created_at (timestamp)\
- Set up RLS policies: users can only access their own stories\
- Create indexes on user_id and created_at\
- Add full-text search index on story_text if needed\
\
}