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
                       │  (Dual-Palette / Profile)    │
                       └──────────────┬───────────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       ▼                             ▼
              ┌─────────────────┐           ┌─────────────────┐
              │   SIGN IN/UP    │           │  TAB SEGMENTS   │
              │  (Secure Portal)│           │ (UI Simplicity) │
              └────────┬────────┘           └────────┬────────┘
                       │                             │
         ┌─────────────┴─────────────────────────────┼────────────────────────────┐
         ▼                                           ▼                            ▼
┌─────────────────┐                        ┌──────────────────┐         ┌───────────────────┐
│ 🏠 WORKSPACE    │                        │ 📊 ANALYTICS     │         │ 📅 TIMETABLE      │
│                 │                        │                  │         │    IMPORTER       │
│ • Notification  │                        │ • Recharts 7-Day │         │                   │
│   Alerts        │                        │   Visual Progress│         │ • Excel / CSV Drag│
│ • Task Pipeline │                        │ • Total Completed│         │   & Drop Upload   │
│ • Hour Day Flow │                        │   Stats          │         │ • Manual Time     │
│   Time Blocking │                        │ • Focus Rate %   │         │   Slot Injection  │
│ • "Mind" AI Bot │                        │ • Performance    │         │ • Auto Sync into  │
│ • Streak Widget │                        │   AI Sweep       │         │   Daily Planner   │
└─────────────────┘                        └──────────────────┘         └───────────────────┘
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

1. **User Sign In / Sign Up Portal & Dynamic Profiles**:
   An elegant editorial access gate that requests email, full name, unique available username, secure standard criteria password, and focus category (**Student**, **Personal**, or **Work**). Students register their **School/College** (e.g. Stanford) and Work users register their **Company** (e.g. Google Cloud). Once validated, the workspace seeds category-specific premium task pipelines and day schedules automatically.

2. **Intelligent Task Prioritization**:
   The user feeds tasks into ClockWork. Upon triggering "AI Prioritize", the Google Gemini model performs a realistic urgency sweep, computes estimated completion durations, ranks each item, and returns clean metadata to prevent decision paralysis.

3. **Autonomous Day-Flow Planning**:
   Instead of static checklists, ClockWork maps tasks into specific, optimized hour blocks (Focus blocks, Administration catch-ups, and mandatory recharge Breaks) to ensure active time management.

4. **Productivity Analytics & Multi-Type Progress Charts**:
   An interactive visual dashboard utilizing Recharts. Compares completed vs. pending tasks. Features dynamic range filters (7-Day Curve, 14-Day Baseline, and 30-Day Monthly Summary) and chart types (Area Flow, Line Graph, and Composition Pie). Includes an integrated localized **Metrics Analyzer Chat** to query "Mind" directly on productivity data.

5. **Excel/CSV Timetable Synchronizer**:
   Supports dragging and dropping plain CSV or spreadsheet tables. ClockWork extracts schedule columns, displays a visual verification list, and synchronizes items directly into both the daily tasks pipeline and the day-flow planner.

6. **Duolingo-style Streak & Weekly Calendar Tracker**:
   Displays consecutive active days. Features a horizontal 7-day weekly grid representing Duolingo-like goal tracking. Completing at least one daily task ignites a glowing fire emoji (🔥) on the weekly calendar.

7. **Cognitive Companion "Mind"**:
   A dedicated chat section powered by **"Mind"**. Unlike typical generic chatbots, "Mind" has instant visibility of all current sticky notes, streak data, tasks, and scheduling slots. Users can query "Mind" to *find* specific files/ideas, *summarize* their overall day, or *identify scheduling gaps*.

8. **Speech-to-Speech Strategizing**:
   Integrates Web Speech Recognition with custom Synthesis (TTS) to provide an audio feedback loop. Users can speak procrastination blocks, and ClockWork answers with concise spoken advice and automatically performs schedule actions.

9. **Browser-Native Alert & Audio Zen Chime System**:
   A dedicated local background thread scans deadlines every 15 seconds. If a high-priority deadline is approaching in exactly 15 minutes, ClockWork synthesizes a melodic audio **Zen Chime** using Web Audio oscillators and triggers an **HTML5 Native Browser Notification** with a direct, clickable action to instantly mark the task complete.

10. **Aesthetic Post-It Grid (Quick Captures)**:
    A visual pinboard of creative thoughts with custom randomized rotation margins, category classifications (💼 Work, ❤️ Life, 📚 Study, ⚡ Quick), and color-coded editorial palettes.

11. **Bespoke Theme Customizer (4 Responsive Modes)**:
    Toggle between four premium typographic preset themes under settings:
    - **Editorial Cream (Light Mode)**: Gentle off-white paper layout.
    - **Forest Sage (Light Mode)**: Clean organic green layout.
    - **Matte Charcoal (Dark Mode)**: Modern charcoal gray layout.
    - **Deep Midnight Navy (Dark Mode)**: Immersive slate navy layout.

---

## Technologies Used
- **Frontend Framework**: React 19 (TypeScript 5)
- **Data Visualization**: Recharts Core
- **Styling Core**: Tailwind CSS v4 (incorporating high-contrast custom palettes, custom fonts, and crisp borders)
- **Component Styling**: Framer Motion for elegant visual entrances and tactile hover states
- **Icon Library**: Lucide React for modern, minimal outline glyphs
- **Backend Application Server**: Express.js
- **Developer Engine**: Vite v6 & tsx compiler
- **Production Bundler**: esbuild

---

## Google Technologies Utilized
- **Google Gemini API** (`gemini-3.5-flash` model via `@google/genai` Node SDK):
  The ultimate cognitive core driving our smart prioritization, text summarizations, scheduling blocks, daily ethos philosophy, and conversational advice.
- **Google Cloud Run**:
  The production server platform, providing instant cold starts, elastic scaling, and containerized safety.

---

## ⚡ Recent Workspace Enhancements & Updates

1. **Interactive Visual Progress Bars**:
   - Each task in the **Commits** (High-Urgency Pipeline) displays a dynamic progress bar beneath its title.
   - **Time-Elapsed Auto Mode**: Automatically computes completion progress based on minutes elapsed since task creation and the task's custom estimated duration.
   - **Manual Tracker Mode**: Allows manual adjustment in increments of 10% using interactive `-` and `+` triggers.
   - **Auto Sync Toggle**: Restores time-elapsed automatic tracking at any point with a simple click.

2. **Refined Day-Flow Planner & Directive Alerts Management**:
   - Dynamic capabilities to **Edit** existing times and task descriptions inside the Day-Flow planner.
   - Custom forms to **Add** brand new slots or delete deprecated intervals.
   - Fully interactive management for **Directive Alerts**, including additions and live detail editing.

3. **Premium "Commits" Pipeline**:
   - The primary high-urgency channel has been rebranded to **Commits** in alignment with professional software development workflows.
   - Remaining times are calculated dynamically against the current system date and clock.

4. **Apple Music Lyric Soundscape Engine**:
   - Enhanced Apple Music scrolling lyrics with customized background gradients.
   - Supports synthesized soundscape virtual time advancement to synchronize live scrolling lyrics beautifully even in offline/synth audio loops.

5. **Mind AI General Knowledge Domain**:
   - Expanded the **"Mind" AI Companion** to respond to general inquiries and educational prompts alongside workspace context-aware assistance.
   - Implemented resilient offline/local semantic heuristic matchers to provide rich structured guides even when the API key is not configured.

6. **Voice Query & Microphone Upgrades**:
   - Expanded voice command processing for instant sticky note additions, music playback/termination, and automated task scheduling.
   - Full microphone status toggling and responsive state feedback.

7. **Secure Confirm Logout**:
   - Standard-compliant confirm dialog trigger for sign-outs to prevent accidental workspace abandonment.
