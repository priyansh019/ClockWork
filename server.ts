import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to safely get the Gemini API Key
function getGeminiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  return key;
}

// Lazy initializer for GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGeminiAI() {
  const key = getGeminiKey();
  if (!key) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Log requests in dev mode
  app.use((req, res, next) => {
    console.log(`[ClockWork Server] ${req.method} ${req.url}`);
    next();
  });

  // API 1: Prioritize Tasks
  app.post('/api/ai/prioritize', async (req, res) => {
    try {
      const { tasks } = req.body;
      if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.json({ tasks: [] });
      }

      const ai = getGeminiAI();
      if (!ai) {
        console.warn('GEMINI_API_KEY missing. Using smart fallback for task prioritization.');
        // Smart mock prioritization
        const mockPrioritized = tasks.map((task, index) => ({
          ...task,
          priorityNum: `0${index + 1}`,
          estimatedTime: task.estimatedTime || '30 mins',
          aiComment: `AI Plan: Reserved morning block for "${task.title}". Recommended focus area.`,
        }));
        return res.json({ tasks: mockPrioritized, isFallback: true });
      }

      const prompt = `You are ClockWork's Lead AI Planner. Prioritize the following tasks for a student/professional to avoid missing deadlines.
Tasks:
${JSON.stringify(tasks, null, 2)}

Return a JSON array of these exact tasks, re-ordered by urgency and importance, with these properties added or updated:
- priorityNum: A string like "01", "02", "03" indicating the priority order.
- estimatedTime: An estimated completion time string (e.g., "45 mins", "1.5 hours") if not already realistic.
- aiComment: A concise, highly practical 1-sentence autonomous suggestion on how to complete it or when (e.g., "AI reserved the 10:00 - 11:00 deep work block for this.").

CRITICAL: Return ONLY valid JSON. Do not write any markdown code fences (like \`\`\`json) or conversational preamble. Return only the array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const responseText = response.text || '[]';
      // Strip out markdown code block characters if Gemini returns them
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const prioritizedTasks = JSON.parse(cleanedText);
        res.json({ tasks: prioritizedTasks, isFallback: false });
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON output:', cleanedText);
        // Fallback parse
        res.status(500).json({ error: 'Failed to process AI output format.' });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/prioritize:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // API 2: Autonomous Daily Schedule Planner
  app.post('/api/ai/schedule', async (req, res) => {
    try {
      const { tasks, startHour } = req.body;
      const hour = startHour || 9; // Default 9 AM

      const ai = getGeminiAI();
      if (!ai) {
        console.warn('GEMINI_API_KEY missing. Using smart mock schedule.');
        // Generate high-fidelity mock schedule
        const defaultSlots = [
          { time: '09:00 - 10:00', taskTitle: 'Review Deadlines & High Priorities', type: 'focus', completed: false },
          { time: '10:00 - 12:00', taskTitle: tasks[0]?.title || 'Deep Work Session', type: 'focus', completed: false },
          { time: '12:00 - 13:00', taskTitle: 'Sync & Quick Communications', type: 'admin', completed: false },
          { time: '13:00 - 14:00', taskTitle: 'Recharge & Midday Break', type: 'break', completed: false },
          { time: '14:00 - 16:00', taskTitle: tasks[1]?.title || 'Administrative Tasks & Follow-ups', type: 'admin', completed: false },
          { time: '16:00 - 17:00', taskTitle: 'Day Review & Outbox Sweep', type: 'focus', completed: false },
        ];
        return res.json({ slots: defaultSlots, isFallback: true });
      }

      const prompt = `You are ClockWork's Autonomous Scheduler. Generate an optimized hour-by-hour day schedule starting from ${hour}:00. 
Fit these tasks realistically into the schedule, adding custom breaks, administrative blocks, and sync meetings as needed:
Tasks:
${JSON.stringify(tasks, null, 2)}

Return a JSON array of schedule slots. Each object in the array must have:
- time: A string like "09:00 - 10:00" or "14:30 - 15:30".
- taskTitle: The name of the task or activity (e.g. "Deep Work: Finalize Q2 Strategy" or "Lunch Break").
- type: One of "focus", "admin", "break".
- completed: false

Keep the schedule highly professional and optimized for flow (e.g., deep work early, admin in afternoon, short breaks after long blocks).
Return ONLY the JSON array. Do not wrap in markdown or add explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const responseText = response.text || '[]';
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const slots = JSON.parse(cleanedText);
        res.json({ slots, isFallback: false });
      } catch (err) {
        console.error('Error parsing scheduler output:', cleanedText);
        res.status(500).json({ error: 'Failed to parse AI schedule.' });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/schedule:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // API 3: Daily Ethos Generator
  app.post('/api/ai/ethos', async (req, res) => {
    try {
      const { theme } = req.body;
      const selectedTheme = theme || 'general productivity';

      const ai = getGeminiAI();
      if (!ai) {
        return res.json({
          ethos: `"The discipline of planning saves you from the tyranny of the urgent. Focus on the next meaningful action, not the noise of the deadline."`,
          author: 'ClockWork Ethos',
          isFallback: true
        });
      }

      const prompt = `Generate an inspiring daily ethos (quote or philosophical guidance) for a high-performing professional or student.
Theme requested: ${selectedTheme}

Return a JSON object with:
- ethos: The motivational quote or rule of thumb (keep it to 1-2 impactful sentences, sophisticated, and editorial).
- author: The source or attribution (e.g., "Marcus Aurelius", "Peter Drucker", or an elegant concept like "The Law of Focused Effort").

Return ONLY valid JSON. No markdown code blocks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const responseText = response.text || '{}';
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const result = JSON.parse(cleanedText);
        res.json({ ...result, isFallback: false });
      } catch (err) {
        console.error('Error parsing ethos:', cleanedText);
        res.json({
          ethos: `"Action is the foundational key to all success. The best way to predict the future is to create it."`,
          author: 'Creative Momentum',
          isFallback: true
        });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/ethos:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // API 4: Context-Aware Reminders (Autonomous Alerts)
  app.post('/api/ai/suggest', async (req, res) => {
    try {
      const { tasks } = req.body;

      const ai = getGeminiAI();
      if (!ai) {
        const defaultAlerts = [
          { type: 'Urgent Alert', text: 'Task deadlines are approaching. Consolidate schedule blocks now.' },
          { type: 'Momentum Prep', text: 'You have a great streak going. Complete 1 high priority task to lock it in.' },
          { type: 'Health Sync', text: 'A long continuous work block detected. We recommend a 5-minute movement break.' }
        ];
        return res.json({ alerts: defaultAlerts, isFallback: true });
      }

      const prompt = `You are ClockWork's Smart Notification Engine. Look at these current tasks and deadlines:
${JSON.stringify(tasks, null, 2)}

Generate 3 context-aware, highly personalized reminders/alerts.
One must be an "Urgent Alert" or "Critical Check" addressing the closest deadline or most urgent task.
One should be a "Meeting Prep", "Focus Boost", or "Momentum Hint".
One should be a "Health Sync" or "Cognitive Recharge" indicating breaks or ergonomics.

Return a JSON array of 3 objects, each having:
- type: The category (e.g. "Urgent Alert", "Focus Boost", "Health Sync").
- text: A short, elegant, high-impact instruction (10-15 words max).

Return ONLY the JSON array. Do not wrap in markdown or add explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const responseText = response.text || '[]';
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const alerts = JSON.parse(cleanedText);
        res.json({ alerts, isFallback: false });
      } catch (err) {
        console.error('Error parsing suggestions:', cleanedText);
        res.status(500).json({ error: 'Failed to generate alert suggestions.' });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/suggest:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // API 5: Voice Assistant Strategy Advice
  app.post('/api/ai/voice-chat', async (req, res) => {
    try {
      const { inputMessage, tasks } = req.body;

      const ai = getGeminiAI();
      if (!ai) {
        const lower = (inputMessage || '').toLowerCase();
        let reply = "ClockWork localized voice core standing by.";
        let action: any = null;

        if (lower.startsWith('add task ') || lower.startsWith('create task ') || lower.startsWith('register ')) {
          const title = inputMessage.replace(/^(add task|create task|register)\s+/i, '').trim();
          reply = `Task "${title}" registered successfully in your commitment roster. Let's complete it.`;
          action = { type: 'add_task', title };
        } else if (lower.startsWith('complete task ') || lower.startsWith('finish task ') || lower.startsWith('done ')) {
          const title = inputMessage.replace(/^(complete task|finish task|done)\s+/i, '').trim();
          reply = `Marking task matching "${title}" as completed. Excellent effort!`;
          action = { type: 'complete_task', title };
        } else if (lower.includes('start timer') || lower.includes('begin session') || lower.includes('initiate focus')) {
          reply = "Focus timer initiated. Let's enter deep study mode.";
          action = { type: 'start_timer' };
        } else if (lower.includes('stop timer') || lower.includes('pause timer') || lower.includes('pause focus')) {
          reply = "Focus timer paused. Take a moment to breathe.";
          action = { type: 'stop_timer' };
        } else if (lower.includes('toggle theme') || lower.includes('switch theme') || lower.includes('change theme') || lower.includes('dark mode')) {
          reply = "Toggling interface display preset.";
          action = { type: 'toggle_theme' };
        } else if (lower.includes('add block') || lower.includes('schedule slot') || lower.includes('add slot')) {
          const clean = lower.replace(/^(add block|schedule slot|add slot)\s+/i, '');
          const match = clean.match(/(\d+:\d+\s*-\s*\d+:\d+)\s+(.+)/);
          if (match) {
            reply = `Added new time block from ${match[1]} for ${match[2]} in your Day-Flow planner.`;
            action = { type: 'add_slot', time: match[1], title: match[2] };
          } else {
            reply = `Added new block in your Day-Flow planner.`;
            action = { type: 'add_slot', time: '10:00 - 11:00', title: clean };
          }
        } else if (lower.includes('add sticky') || lower.includes('create sticky') || lower.includes('quick capture')) {
          const noteText = inputMessage.replace(/^(add sticky|create sticky|quick capture)\s+/i, '').trim();
          reply = `Sticky note captured: "${noteText}"`;
          action = { type: 'add_sticky', content: noteText };
        } else if (lower.includes('clear stickies') || lower.includes('delete notes')) {
          reply = "Clearing all quick captures from your whiteboard.";
          action = { type: 'clear_stickies' };
        } else if (lower.includes('play music') || lower.includes('start music') || lower.includes('play ambient')) {
          reply = "Playing focus ambient soundscapes.";
          action = { type: 'play_music' };
        } else if (lower.includes('stop music') || lower.includes('pause music') || lower.includes('mute music')) {
          reply = "Ambient soundscapes paused.";
          action = { type: 'stop_music' };
        } else {
          reply = `ClockWork Spoken Strategist compiled advice: Your voice query "${inputMessage}" was received. To execute dynamic voice-directed layout manipulations, consider adding 'add task', 'complete task', 'start timer', or 'toggle theme' to your voice command!`;
        }

        return res.json({ reply, action, isFallback: true });
      }

      const prompt = `You are ClockWork's Voice Strategy Companion. A user says or records this voice note:
"${inputMessage}"

Current tasks in progress:
${JSON.stringify(tasks, null, 2)}

Provide a concise, direct, helpful audio-friendly response (2-3 sentences max).
Focus on immediate, actionable advice to defeat procrastination.
Also, if the user is asking to add a task, schedule something, or finish a task, return an action directive:
- action: An object like { type: "add_task", title: "Task title", deadline: "..." } or { type: "complete_task", title: "..." } or null if just giving advice.
You can also return actions of type:
- { type: "start_timer" }
- { type: "stop_timer" }
- { type: "toggle_theme" }
- { type: "add_slot", time: "10:00 - 11:00", title: "Review tasks", slotType: "focus" } // slotType can be "focus", "admin", or "break"
- { type: "add_sticky", content: "..." }
- { type: "clear_stickies" }
- { type: "play_music" }
- { type: "stop_music" }

Return a JSON object:
{
  "reply": "Your brief spoken reply goes here.",
  "action": { "type": "add_task", "title": "example" } // or null
}

Return ONLY the JSON. No markdown wrappers.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const responseText = response.text || '{}';
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const result = JSON.parse(cleanedText);
        res.json({ ...result, isFallback: false });
      } catch (err) {
        console.error('Error parsing voice advice:', cleanedText);
        res.json({
          reply: "I am ready to assist you. Focus on completing your highest priority item to stay ahead of your schedule.",
          action: null,
          isFallback: true
        });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/voice-chat:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // API 6: "Mind" Context-Aware Companion Chat, Search, Summarize, and Find
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, tasks, stickyNotes, schedule, streak } = req.body;

      const ai = getGeminiAI();
      if (!ai) {
        const lower = (message || '').toLowerCase();
        let reply = "";
        if (lower.includes('summarize') || lower.includes('summary')) {
          reply = `Here is your current status: You have ${tasks ? tasks.length : 0} total tasks (${tasks ? tasks.filter((t: any) => !t.completed).length : 0} pending), ${stickyNotes ? stickyNotes.length : 0} quick captures, and a consistency momentum of ${streak || 0} days. Your top priority is "${tasks && tasks[0] ? tasks[0].title : 'None currently'}".`;
        } else if (lower.includes('find') || lower.includes('search')) {
          const matchTasks = (tasks || []).filter((t: any) => lower.includes(t.title.toLowerCase()));
          const matchStickies = (stickyNotes || []).filter((s: any) => lower.includes(s.content.toLowerCase()));
          if (matchTasks.length > 0 || matchStickies.length > 0) {
            reply = `I found matching items: ${[...matchTasks.map((t: any) => `Task: "${t.title}"`), ...matchStickies.map((s: any) => `Note: "${s.content}"`)].join(', ')}.`;
          } else {
            reply = "I searched through your tasks and quick captures but couldn't find an exact match for that keyword. Try another term or add it to your daily list!";
          }
        } else {
          // General QA fallback with smart rule-based matching!
          if (lower.includes('photosynthesis')) {
            reply = "Photosynthesis is the beautiful biological process by which green plants, algae, and some bacteria synthesize nutrients from carbon dioxide and water using sunlight. It primarily occurs within chloroplasts, releasing vital oxygen as an essential byproduct. *For an interactive deeper dive, configure your Gemini API Key in the Secrets panel!*";
          } else if (lower.includes('react') || lower.includes('vue') || lower.includes('framework')) {
            reply = "Modern web frameworks like React leverage a component-driven, declarative architecture. React manages state and optimizes UI rendering using a virtual DOM, ensuring fast, interactive client-side applications. *For personalized web development tutorials, configure your Gemini API Key in the Secrets panel!*";
          } else if (lower.includes('joke') || lower.includes('humor')) {
            reply = "Why do programmers wear glasses? Because they can't C#! *To unlock infinitely more humor and creative writing, configure your Gemini API Key in the Secrets panel!*";
          } else if (lower.includes('procrastination') || lower.includes('focus') || lower.includes('productivity')) {
            reply = "Productivity thrives on momentum, not motivation. Start by working on your top priority task for just five minutes (the '5-minute rule'). Breaking down large objectives into atomic micro-commitments completely bypasses executive dysfunction. Let's conquer your list together!";
          } else if (lower.includes('hello') || lower.includes('hi ') || lower.includes('greetings')) {
            reply = "Greetings! I am 'Mind', your supportive, context-aware companion. Ask me to find files, analyze your schedules, or feel free to ask general questions concerning philosophy, history, coding, or science!";
          } else if (lower.includes('help')) {
            reply = "I am ready to help! You can ask me to 'summarize' your current priorities, 'find' an active task or sticky note, or ask any general-knowledge questions about science, math, or coding. To activate my fully dynamic generative brain, bind your Gemini API Key in the Secrets panel!";
          } else {
            reply = `I am 'Mind', your proactive workspace companion. You asked a general question: "${message}". 
Here is a high-level cognitive response: When studying or working on "${message.replace(/[?.]/g, '')}", it is always best to organize your workflow into clear, manageable time blocks, clear your mental cache using sticky notes, and tackle high-priority commitments first. 

*To unlock my full conversational intelligence powered by Google Gemini so I can answer any academic, professional, technical, or creative question dynamically, please configure your Gemini API Key in the Secrets panel on the left!*`;
          }
        }
        return res.json({ reply, isFallback: true });
      }

      const conversationHistory = (history || [])
        .map((h: any) => `${h.sender === 'user' ? 'User' : 'Mind'}: ${h.text}`)
        .join('\n');

      const systemPrompt = `You are "Mind", the highly intelligent, context-aware AI productivity companion of ClockWork.
The user can find, ask, search, and request summaries of anything in their workspace. They can also ask you ANY general questions, academic queries, coding problems, professional/business advice, philosophy, or general knowledge.

You have full capability and are encouraged to answer general queries comprehensively and intelligently, while keeping your elegant, supportive ClockWork companion persona.

Here is the current ClockWork Live State (for optional context if they refer to their work):
- Consistency Streak: ${streak || 0} days
- High Priority Tasks: ${JSON.stringify(tasks || [], null, 2)}
- Daily Schedule Blocks: ${JSON.stringify(schedule || [], null, 2)}
- Quick Capture Stickies: ${JSON.stringify(stickyNotes || [], null, 2)}

Recent Conversation History:
${conversationHistory}

User's Query: "${message}"

Your task is to:
1. Provide a highly precise, helpful, and motivating response.
2. If the user asks a general question, answer it completely, thoroughly, and insightfully.
3. If the user asks to "summarize" their schedule/workspace, give them a beautiful, scannable overview of their status and momentum.
4. If they ask to "find" or "search" for something in their workspace, scour the provided tasks, schedule, and stickies, and point out matches specifically.
5. Keep the tone sophisticated, supportive, clear, and action-oriented (consistent with ClockWork's Editorial aesthetic). 
6. Return your response directly as clean text or markdown. Keep your answer elegant and directly focused on their request.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: systemPrompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      res.json({ reply: response.text || "Mind is online.", isFallback: false });
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[ClockWork Server] Full-stack engine active at http://0.0.0.0:${port}`);
  });
}

startServer();
