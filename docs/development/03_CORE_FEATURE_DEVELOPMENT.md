{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww13580\viewh16900\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Create the main feature input page UI:\

- Create /app/(dashboard)/analyzer/page.tsx (adjust name for your feature)\
- Build a clean input interface with:\
  - Large textarea for user story input\
  - Optional field for acceptance criteria\
  - Tags/categories input (multi-select)\
  - Submit/analyze button with loading state\
- Add character counter for text inputs\
- Include helpful placeholder text and examples\
- Add "Clear" button to reset form\
- Make the interface intuitive and visually appealing\
- Ensure responsive design for mobile\
  \
  Build the analysis results display component:\
- Create /components/feature/AnalysisResults.tsx\
- Design a card-based layout to show:\
  - Overall score (large, prominent display)\
  - Individual criteria scores with visual indicators (progress bars/badges)\
  - Specific improvement suggestions\
  - Highlighted issues in the original text\
- Add ability to expand/collapse detailed feedback\
- Include copy-to-clipboard functionality for suggestions\
- Add export button (PDF/markdown)\
- Style with good visual hierarchy\
  \
  Implement the AI analysis backend logic:\
- Create /app/api/analyze/route.ts API route\
- Set up OpenAI or Anthropic API client\
- Create a detailed system prompt for analyzing user stories against INVEST criteria:\
  - Independent\
  - Negotiable \
  - Valuable\
  - Estimable\
  - Small\
  - Testable\
- Parse user story input and acceptance criteria\
- Make API call with appropriate parameters\
- Parse AI response into structured format\
- Calculate overall score from individual criteria\
- Return JSON response with scores and suggestions\
- Add error handling for API failures\
- Implement rate limiting to prevent abuse\
  \
  Create database operations for saving analysis results:\
- Create /lib/db/stories.ts with CRUD functions\
- Implement createStory() to save new analysis\
- Implement getStories() to fetch user's stories with pagination\
- Implement getStoryById() for single story retrieval\
- Implement updateStory() for editing saved stories\
- Implement deleteStory() for removing stories\
- Add proper TypeScript types for all functions\
- Include error handling and validation\
- Ensure all queries respect RLS policies\
  \
  Build the feature history/saved items page:\
- Create /app/(dashboard)/history/page.tsx\
- Fetch all saved analyses for current user\
- Display in a table or card grid with:\
  - Story title\
  - Score badge\
  - Date created\
  - Quick actions (view, delete)\
- Add search/filter functionality\
- Implement pagination (10-20 items per page)\
- Add sorting options (date, score, title)\
- Create click handler to view full analysis\
- Add bulk delete option with checkboxes\
  \
  Implement the full analysis workflow:\
- Connect input form to API endpoint\
- Show loading state during analysis\
- Handle API errors gracefully\
- Display results immediately after analysis\
- Auto-save analysis to database\
- Add to user's history\
- Show success notification\
- Provide option to analyze another story\
- Track usage count for billing limits}
