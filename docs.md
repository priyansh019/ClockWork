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
ClockWork resolves time-management anxiety by transforming passive checking into an active, conversational AI environment. Adhering to the **Editorial Aesthetic** (inspired by minimalist typographic design, spacious grids, and sophisticated warm/charcoal palettes), the application centers around an intuitive triple-column layout:

*   **Left Column (Directives & Advice)**: Adaptive alerts, voice advice triggers, and daily philosophical mental models.
*   **Center Column (Action Core)**: Dynamic priority rankings, task intake managers, and realistic hour-by-hour scheduling blocks.
*   **Right Column (Cognitive Workspace & Momentum)**: The **"Mind"** conversational assistant, consistency streak display, and category-coded sticky notes.

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
1. **Intake & Sync**: The user performs actions (completes tasks, writes stickies, asks questions). All states are instantly synchronized to client-side `localStorage` to ensure zero data loss on session reload.
2. **State Bundling**: When the user requests a priority sweep, schedule generation, or queries the **"Mind"** assistant, the client-side packages the entire active workspace (all current tasks, note lists, streak values, and schedule blocks) into a unified JSON context.
3. **AI Resolution**: The backend receives the context and crafts a sophisticated, custom-crafted prompt for the `gemini-3.5-flash` model, ensuring formatting is strict and matches the ClockWork Editorial tone.
4. **Instant Update**: The client receives structured JSON or markdown, instantly updating the task lists, comments, schedules, and chat history.

---

## 4. Key Features & How AI Helps

### A. Proactive Prioritization
*   **How it works**: When tasks are added, they are listed in the database. Clicking **"AI Prioritize"** passes the task metadata to Gemini.
*   **How AI helps**: Instead of sorting alphabetically or by entry time, Gemini evaluates realistic deadline proximities, calculates completion times, ranks the tasks, and appends a motivating, actionable coaching comment (e.g., *"Autonomous planning has reserved 10:00 - 12:00 for deep work"*).

### B. Autonomous Hour-by-Hour Time Blocking
*   **How it works**: Clicking **"Auto-Schedule"** analyzes your active high-priority pipeline.
*   **How AI helps**: Gemini dynamically crafts an optimized hourly timeline, categorizing slots as **Focus** (demanding deep cognitive focus), **Admin** (quick responses, emails, bill payments), or **Break** (mandatory rest to restore mental reserves), ensuring you don't burn out.

### C. Context-Aware Companion chatbot "Mind"
*   **How it works**: Users can chat with "Mind", our integrated cognitive companion.
*   **How AI helps**: Traditional bots are completely blind to what's on your screen. "Mind" has complete context. If you type *"summarize my day"*, "Mind" looks at your tasks, schedule, and stickies, and gives you a beautiful, bulleted progress briefing. If you type *"find chemistry"*, "Mind" searches all workspace archives and extracts references.

### D. Audio Strategist Loop (Voice-to-Voice)
*   **How it works**: Users click "Voice Query" to speak ideas or procrastination issues.
*   **How AI helps**: The system records the voice, runs speech recognition, queries Gemini for brief spoken strategies, reads the advice back to you using Speech Synthesis, and executes actions (e.g., automatically registers a task if you said *"add buy coffee beans to my list"*).

### E. Quick Capture Creative Noteboard
*   **How it works**: Users post lightning thoughts on sticky notes.
*   **How AI helps**: These quick captures are immediately visible to "Mind". You can type ideas or fragments, and later ask "Mind" to expand on or organize your scattered notes.

---

## 5. Technologies Used

### Frontend & Styling
*   **React 19**: Responsive layout, robust reactive states, and synchronized local hook triggers.
*   **TypeScript 5**: Complete type-safety for tasks, notes, schedule slots, and message schemas.
*   **Tailwind CSS v4**: Beautiful editorial-style typography pairing ("Inter" and elegant classic serifs), custom padding spacing, and seamless cream/matte-charcoal transitions.
*   **Motion**: Fluid rendering, fade effects, and interactive overlay transitions.

### Backend Infrastructure
*   **Express.js**: Low-latency REST endpoints proxying AI request traffic.
*   **tsx**: Fast dev-server execution with instant TypeScript parsing.
*   **esbuild**: Production bundler compiling the server into a standalone, secure `dist/server.cjs` file.

### Google Technologies
*   **Google Gemini API (`gemini-3.5-flash`)**: Used for all language comprehension, scheduling, search synthesis, and strategy recommendations. Fully integrated using the modern, high-performance `@google/genai` TypeScript SDK.
*   **Google Cloud Run**: Reliable container platform that hosts the application, routing external port 3000 requests.
