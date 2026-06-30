# ClockWork Documentation Manual

This document serves as the comprehensive guide for **ClockWork**—the proactive, AI-powered productivity companion designed to turn passive schedule alerts into action-oriented momentum.

---

## 1. Problem Statement Selected

### The Last-Minute Life Saver
Students, busy professionals, and entrepreneurs face constant friction with traditional time-tracking software. Standard calendar applications, alarm widgets, and simple reminder lists suffer from three main fatal flaws:

1. **Passive Notifications**: Static text notifications are incredibly easy to swipe away or ignore. They do nothing to help the user mentally prepare for the commitment or initiate work.
2. **Cognitive Fatigue**: Managing, prioritizing, and scheduling 10+ distinct daily tasks creates an overwhelming cognitive load, leading directly to procrastination and missed deadlines.
3. **Disconnected Context**: Sticky thoughts, quick ideas, long-term tasks, and active daily schedules live in completely separate tools, meaning the user lacks a unified overview.

ClockWork is engineered specifically to eliminate these points of friction.

---

## 2. Solution Overview
ClockWork resolves time-management anxiety by transforming passive checking into an active, conversational AI environment. Adhering to the **Editorial Aesthetic** (inspired by minimalist typographic design, spacious grids, and sophisticated warm/charcoal palettes), the application organizes features into three dedicated tabs for simplicity and focus:

*   **Active Workspace (Home)**: Displays the daily task pipeline, dynamic hour-by-hour time blocks, a gamified momentum streak tracker with a Duolingo-style weekly calendar, and the context-aware companion **"Mind"** chatbot.
*   **Productivity Analytics**: Features an interactive 7-day visual progress chart built with Recharts comparing completed versus pending tasks, paired with active key-rate metrics.
*   **Timetable & Importer**: Contains a drag-and-drop file uploader for Excel/CSV schedules alongside manual slot entries, allowing users to synchronize external academic or professional schedules directly into the planner.

---

## 3. Workflow & Architecture Diagram

Below is the structured data flow showing how the React frontend, Express.js proxy server, and Google Gemini API coordinate to prioritize tasks and deliver context-aware answers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           1. CLIENT / BROWSER                           │
│   (React App, Local Workspace, Web Speech API, Local Storage Cache)      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ HTTP POST /api/ai/* (JSON state)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        2. BACKEND PROXY SERVER                          │
│   (Express.js running on Google Cloud Run, Securing Api Credentials)    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ Structured Prompts & System Rules
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         3. COGNITIVE ENGINE                             │
│       (Google Gemini API: gemini-3.5-flash via @google/genai SDK)       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detailed AI Interaction Loop
1. **Onboarding & Category Seeding**: Upon accessing the portal, users sign in and select their role (Student, Work, or Personal). The workspace dynamically triggers custom task pipelines suited to their profile.
2. **Intake & Sync**: The user performs actions (completes tasks, writes stickies, uploads spreadsheets). All states are instantly synchronized to client-side `localStorage` to ensure zero data loss on session reload.
3. **State Bundling**: When the user requests a priority sweep, schedule generation, or queries the **"Mind"** assistant, the client-side packages the entire active workspace into a unified JSON context.
4. **AI Resolution**: The backend receives the context and crafts a sophisticated, custom-crafted prompt for the `gemini-3.5-flash` model, ensuring formatting is strict and matches the ClockWork Editorial tone.
5. **Instant Update**: The client receives structured JSON or markdown, instantly updating the task lists, comments, schedules, and chat history.

---

## 4. Key Features & How AI Helps

### A. Categorized Onboarding Portal & Profiles
*   **How it works**: Users register or sign in using their email, name, unique available username, secure password, and workspace category (Student, Personal, Work). Students register their School/College (e.g. Stanford) and Work users register their Company (e.g. Google).
*   **How AI helps**: Seeding relevant category-specific daily tasks gives users immediate focus and momentum. The chatbot "Mind" speaks in terms of their role, referencing assignments or corporate sprints based on their dynamic metadata.

### B. Recharts Productivity Analytics & Multi-Type Charts
*   **How it works**: Located under "Productivity Analytics". Visualizes tasks completed vs. pending with custom range filters (7-day, 14-day, 30-day summaries) and chart styles (Area, Line, Pie charts). Includes an integrated **Metrics Analyzer Chat** companion panel.
*   **How AI helps**: Today's metrics update reactively as users check off assignments. The localized metrics chat assistant "Mind" reads completion ratios, consistency streak parameters, and focus rates to offer immediate, actionable feedback on procrastination risks and focus ratios.

### C. Spreadsheet Timetable Importer
*   **How it works**: Users drag and drop an Excel sheet or text CSV timetable.
*   **How AI helps**: The system parses columns (or runs high-fidelity visual cell extractions for spreadsheet structures) and populates both the high-urgency pipeline and daily blocks instantly, saving hours of manual setup.

### D. Duolingo Week Streak Calendar
*   **How it works**: Tracks active consecutive days. Includes a horizontal week progress indicator.
*   **How AI helps**: Checking off tasks satisfies the daily goal, lighting up a glowing fire emoji (🔥) on the weekly tracker, creating a positive dopamine feedback loop.

### E. Proactive Prioritization
*   **How it works**: Users click **"AI Prioritize"** to pass tasks to Gemini.
*   **How AI helps**: Gemini evaluates deadline proximities, calculates completion times, ranks the tasks, and appends an actionable coaching comment (e.g., *"Autonomous planning has reserved 10:00 - 12:00 for deep work"*).

### F. Hour-by-Hour Time Blocking
*   **How it works**: Clicking **"Auto-Schedule"** maps active tasks.
*   **How AI helps**: Gemini dynamically crafts an optimized timeline, categorizing slots as **Focus** (demanding deep cognitive focus), **Admin** (quick responses, emails), or **Break** (mandatory rest), ensuring mental stamina is preserved.

### G. Context-Aware Companion "Mind"
*   **How it works**: Users chat with "Mind", our integrated cognitive companion.
*   **How AI helps**: Traditional bots are completely blind to what's on your screen. "Mind" has complete context. If you type *"summarize my day"*, "Mind" looks at your tasks, schedule, and stickies, and gives you a beautiful, bulleted progress briefing.

### H. Browser-Native Alert & Audio Zen Chime System
*   **How it works**: Uses a non-blocking background thread that checks task deadlines every 15 seconds. It triggers precisely 15 minutes before any high-priority deadline.
*   **How AI helps**: When a high-priority deadline is approaching, ClockWork fires an HTML5 Native Notification directly on the user's desktop with a one-click complete button and synthesizes an elegant, eye-opening audio melody using Web Audio oscillator configurations. This prevents important milestones from being silently forgotten in browser tabs.

---

## 5. Technologies Used

### Frontend & Styling
*   **React 19**: Responsive layout, robust reactive states, and synchronized local hook triggers.
*   **Recharts**: Custom vector areas with gradient color codes charting weekly performance.
*   **TypeScript 5**: Complete type-safety for tasks, notes, schedule slots, and profile models.
*   **Tailwind CSS v4**: Beautiful editorial-style typography pairing ("Inter" and elegant classic serifs), custom padding spacing, and seamless cream/matte-charcoal transitions.
*   **Motion**: Fluid rendering, fade effects, and interactive overlay transitions.

### Backend Infrastructure
*   **Express.js**: Low-latency REST endpoints proxying AI request traffic.
*   **tsx**: Fast dev-server execution with instant TypeScript parsing.
*   **esbuild**: Production bundler compiling the server into a standalone, secure `dist/server.cjs` file.

### Google Technologies
*   **Google Gemini API (`gemini-3.5-flash`)**: Used for all language comprehension, scheduling, search synthesis, and strategy recommendations. Fully integrated using the modern, high-performance `@google/genai` TypeScript SDK.
*   **Google Cloud Run**: Reliable container platform that hosts the application, routing external port 3000 requests.
