# Project Manifesto: ClockWork

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLOCKWORK                                 │
│                     The Last-Minute Life Saver                         │
└────────────────────────────────────────────────────────────────────────┘
```

## Problem Statement Selected
**The Last-Minute Life Saver:** Students, professionals, and entrepreneurs frequently miss deadlines, assignments, meetings, bill payments, interviews, and important commitments. Existing productivity tools often rely on passive reminders that are easy to ignore and do little to help users actually complete their tasks.

---

## Solution Overview & Design Philosophy
**ClockWork** is an AI-powered, proactive productivity companion that transcends passive calendar alerts to drive active commitment fulfillment. Designed around a rigorous **Editorial Aesthetic**, ClockWork marries sophisticated visual minimalism (dual-mode soft cream & matte charcoal palettes) with a powerful server-side cognitive engine. 

At the center of this environment stands **"Mind"**—the intelligent companion chatbot that has absolute context-awareness over the user's workspace. "Mind" can find items, answer complex scheduling questions, summarize commitments, and recommend immediate momentum boosters.

### Visual Architecture Flowchart
```
                       ┌──────────────────────────────┐
                       │      Editorial UI Header     │
                       │  (Dual-Palette / Date Sync)  │
                       └──────────────┬───────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│   DIRECTIVES    │          │  ACTION CENTER  │          │   MIND BOT &    │
│  & VOICE CORE   │          │     PANEL       │          │   NOTEBOARD     │
│                 │          │                 │          │                 │
│ • Alerts Feed   │          │ • Task Intake   │          │ • Chat: Mind    │
│ • Spoken Advice │          │ • Priority Rank │          │ • Streak Counter│
│ • Daily Ethos   │          │ • Time Block    │          │ • Post-It Grid  │
│                 │          │   Scheduler     │          │                 │
└─────────────────┘          └─────────────────┘          └─────────────────┘
```

---

## Technical Approach & Architecture
ClockWork is designed as a secure, high-performance, full-stack application (Express.js backend + React frontend) to shield API keys and deliver low-latency responses.

### Workspace State & AI Loop Diagram
```
  ┌─────────────────────────────────────────────────────────────┐
  │                         FRONTEND                            │
  │                      (React + Vite)                         │
  └──────────────┬───────────────────────────────▲──────────────┘
                 │                               │
                 │ 1. Context Sync               │ 4. Structured Render
                 │ (Tasks, notes, schedule,      │ (Prioritized tasks,
                 │  streak, user prompts)        │  TTS advice, chat replies)
                 ▼                               │
  ┌──────────────────────────────────────────────┴──────────────┐
  │                         BACKEND                             │
  │                     (Express Server)                        │
  └──────────────┬───────────────────────────────▲──────────────┘
                 │                               │
                 │ 2. Structured System Prompt   │ 3. Clean JSON / Text
                 │ (Editorial Tone Controls)     │ (Task metadata,
                 │                               │  philosophical summaries)
                 ▼                               │
  ┌──────────────────────────────────────────────┴──────────────┐
  │                     GOOGLE GEMINI API                       │
  │                     (gemini-3.5-flash)              │
  └─────────────────────────────────────────────────────────────┘
```

---

## Key Features

1. **Intelligent Task Prioritization**:
   The user feeds tasks into ClockWork. Upon triggering "AI Prioritize", the Google Gemini model performs a realistic urgency sweep, computes estimated completion durations, ranks each item, and returns clean metadata to prevent decision paralysis.

2. **Autonomous Day-Flow Planning**:
   Instead of static checklists, ClockWork maps tasks into specific, optimized hour blocks (Focus blocks, Administration catch-ups, and mandatory recharge Breaks) to ensure active time management.

3. **Cognitive Companion "Mind"**:
   A dedicated chat section powered by **"Mind"**. Unlike typical generic chatbots, "Mind" has instant visibility of all current sticky notes, streak data, tasks, and scheduling slots. Users can query "Mind" to *find* specific files/ideas, *summarize* their overall day, or *identify scheduling gaps*.

4. **Speech-to-Speech Strategizing**:
   Integrates Web Speech Recognition with custom Synthesis (TTS) to provide an audio feedback loop. Users can speak procrastination blocks, and ClockWork answers with concise spoken advice and automatically performs schedule actions (e.g., adding tasks on voice command).

5. **Aesthetic Post-It Grid (Quick Captures)**:
   A visual pinboard of creative thoughts with custom randomized rotation margins, category classifications (💼 Work, ❤️ Life, 📚 Study, ⚡ Quick), and color-coded editorial palettes.

6. **Consistency Streaks**:
   A highly visual gamified component that tracks and displays days of consecutive commitment fulfillment.

7. **Editorial Theming (Cream / Dark Mode)**:
   Toggle between a beautifully warm, book-like cream canvas (`#FDFCFB`) and an immersive matte charcoal night layout (`#121212`) prioritizing typography, spacious contrast, and eye safety during late-night study sessions.

---

## Technologies Used
- **Frontend Framework**: React 19 (TypeScript 5)
- **Styling Core**: Tailwind CSS v4 (incorporating high-contrast custom palettes, custom fonts, and crisp borders)
- **Component Styling**: Framer Motion for elegant visual entrances and tactile hover states
- **Icon Library**: Lucide React for modern, minimal outline glyphs
- **Backend Application Server**: Express.js
- **Developer Engine**: Vite v6 & tsx compiler

---

## Google Technologies Utilized
- **Google Gemini API** (`gemini-3.5-flash` model via `@google/genai` Node SDK):
  The ultimate cognitive core driving our smart prioritization, text summarizations, scheduling blocks, daily ethos philosophy, and conversational advice.
- **Google Cloud Run**:
  The production server platform, providing instant cold starts, elastic scaling, and containerized safety.
