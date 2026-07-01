<div align="center">
<img width="1200" height="475" alt="ClockWork Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ClockWork

**ClockWork** is an AI-powered productivity companion that turns passive schedule reminders into active execution. It combines a refined editorial UI with a responsive task pipeline, AI prioritization, focus mode, timetable import, analytics, and personalized momentum coaching.

## What ClockWork Does

- Converts daily tasks into prioritized action plans.
- Uses Google Gemini-backed AI to recommend schedules and urgency ranks.
- Builds a fluent day-flow with time-blocked focus, administration, and rest.
- Tracks streaks, live analytics, and schedule consistency.
- Supports CSV/Excel timetable import for fast calendar onboarding.
- Includes an immersive Deep Focus mode with breathing guidance and audio cues.

## Core Workflows

1. Sign in / create a workspace profile.
2. Seed tasks and capture notes in the Active Workspace.
3. Use AI Prioritize to rank and order the daily pipeline.
4. Auto-schedule tasks into hour-by-hour time blocks.
5. Review analytics and streaks to maintain momentum.
6. Import timetables or spreadsheets when needed.

## System Flow

```text
                    +-------------------------+
                    |   User Onboarding &     |
                    |   Workspace Profile     |
                    +-----------+-------------+
                                |
          +---------------------+---------------------+
          |                                           |
+----------------------+                   +----------------------+
|   Active Workspace   |                   |  AI / Gemini Engine  |
| - Task Pipeline      |                   | - Prioritize Tasks   |
| - Live Clock / Timer |                   | - Summarize Day      |
| - Progress & Streaks |                   | - Schedule Blocks    |
| - Sticky Notes       |                   | - Metrics Analysis   |
+----------+-----------+                   +----------+-----------+
           |                                          |
           |  Syncs state / updates                  |
           +------------------------------------------+
                                |
                    +-------------------------+
                    |   Productivity Analytics|
                    |   & Timetable Importer  |
                    +-------------------------+
```

## Architectural Diagram

```text
     ┌─────────────────────────────────────────────────────┐
     │                     Frontend                        │
     │               React + Vite + Tailwind               │
     └───────────┬───────────────────────────▲──────────────┘
                 │ 1. Sends tasks, notes, settings │
                 │    and workspace state         │
                 ▼                                │
     ┌─────────────────────────────────────────────────────┐
     │                     Backend                          │
     │                   Express.js server                  │
     └───────────┬───────────────────────────▲──────────────┘
                 │ 2. Builds structured prompts         │
                 │    and proxies AI requests          │
                 ▼                                │
     ┌─────────────────────────────────────────────────────┐
     │                   Google Gemini API                  │
     │                 gemini-3.5-flash model               │
     └─────────────────────────────────────────────────────┘
```

## Key Features

- **Persona-aware onboarding**: Support for Student, Work, and Personal roles with metadata-driven workspace profiles.
- **Intelligent task prioritization**: AI-driven urgency ranking, effort estimates, and clean coaching comments.
- **Hour-by-hour scheduling**: Auto-blocks tasks into Focus, Admin, and Break slots.
- **Deep Focus mode**: Full-screen breath guidance, timer, and distraction-free environment.
- **Synced LRC lyric player**: Motivation through music-aligned lyric display.
- **Recharts analytics**: 7/14/30-day progress visualizations and productivity trends.
- **Spreadsheet importer**: Drag-and-drop CSV/XLSX timetable uploads.
- **Gamified streaks**: Duolingo-style daily completion streak tracker.
- **Browser-native alerts**: Notifications and zen chime audio reminders for deadlines.

## Technical Stack

- Frontend: React 19, TypeScript 5, Vite, Tailwind CSS
- Backend: Express.js
- AI: Google Gemini via `@google/genai`
- Charts: Recharts
- Styling: Framer Motion, Lucide React icons

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   `npm run dev`

## Documentation & Manifesto

- Full developer documentation: `docs.md`
- Product vision and design manifesto: `PROJECT_MANIFESTO.md`

## Notes

ClockWork is designed to close the gap between reminders and real completion with active scheduling, AI-driven prioritization, and a focus-first user experience. Use the flow above to understand how tasks move from capture to execution.
