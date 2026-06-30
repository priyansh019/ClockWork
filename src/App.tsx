import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Sparkles,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Calendar as CalendarIcon,
  Flame,
  Zap,
  StickyNote as StickyIcon,
  HelpCircle,
  Mic,
  X,
  ArrowRight,
  PlusCircle,
  Volume2 as VoiceIcon,
  Sun,
  Moon,
  Send,
  Search,
  BookOpen,
  Coffee,
  Check,
  Award,
  AlertTriangle,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  priorityNum: string;
  completed: boolean;
  estimatedTime: string;
  aiComment: string;
}

interface Sticky {
  id: string;
  content: string;
  color: string;
  rotation: string;
  category: string;
}

interface ScheduleSlot {
  time: string;
  taskTitle: string;
  type: 'focus' | 'admin' | 'break';
  completed: boolean;
}

interface AlertItem {
  type: string;
  text: string;
}

interface ChatMessage {
  sender: 'user' | 'mind';
  text: string;
  time: string;
}

export default function App() {
  // --- CORE SYSTEM STATES (WITH DARK MODE & PALETTES) ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cw_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cw_tasks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'Finalize Q2 Growth Strategy',
        deadline: '17:00',
        priority: 'high',
        priorityNum: '01',
        completed: false,
        estimatedTime: '2 hours',
        aiComment: 'Autonomous planning has reserved 10:00 - 12:00 for deep work.',
      },
      {
        id: '2',
        title: 'Execute Automated Bill Pay',
        deadline: '14:00',
        priority: 'high',
        priorityNum: '02',
        completed: false,
        estimatedTime: '15 mins',
        aiComment: 'Pending your final confirmation for $1,240.50 transaction.',
      },
      {
        id: '3',
        title: 'Review Portfolio Performance',
        deadline: '18:00',
        priority: 'medium',
        priorityNum: '03',
        completed: false,
        estimatedTime: '45 mins',
        aiComment: 'AI identified 3 key metrics requiring manual oversight.',
      }
    ];
  });

  const [stickyNotes, setStickyNotes] = useState<Sticky[]>(() => {
    const saved = localStorage.getItem('cw_sticky');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', content: 'Call mom re: weekend dinner', color: '#FFF9C4', rotation: '-1deg', category: 'personal' },
      { id: '2', content: 'Update production credentials', color: '#E1F5FE', rotation: '1deg', category: 'work' },
      { id: '3', content: 'Buy organic coffee beans', color: '#F1F8E9', rotation: '2deg', category: 'errand' },
      { id: '4', content: 'Refactor auth state machine', color: '#FFF3E0', rotation: '-2deg', category: 'work' }
    ];
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('cw_streak');
    return saved ? parseInt(saved, 10) : 14;
  });

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    const saved = localStorage.getItem('cw_schedule');
    if (saved) return JSON.parse(saved);
    return [
      { time: '09:00 - 10:00', taskTitle: 'Review Deadlines & High Priorities', type: 'focus', completed: false },
      { time: '10:00 - 12:00', taskTitle: 'Finalize Q2 Growth Strategy', type: 'focus', completed: false },
      { time: '12:00 - 13:00', taskTitle: 'Sync & Quick Communications', type: 'admin', completed: false },
      { time: '13:00 - 14:00', taskTitle: 'Recharge & Midday Break', type: 'break', completed: true },
      { time: '14:00 - 14:15', taskTitle: 'Execute Automated Bill Pay', type: 'admin', completed: false },
      { time: '14:15 - 15:30', taskTitle: 'Review Portfolio Performance', type: 'focus', completed: false },
    ];
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('cw_alerts');
    if (saved) return JSON.parse(saved);
    return [
      { type: 'Urgent Alert', text: 'Utility bill due in 4 hours. AI has drafted the payment schedule.' },
      { type: 'Meeting Prep', text: 'Client interview at 2:00 PM. Research summary synchronized to dashboard.' },
      { type: 'Health Sync', text: 'Long work block detected. Recommended: 5min break now.' }
    ];
  });

  const [dailyEthos, setDailyEthos] = useState(() => {
    const saved = localStorage.getItem('cw_ethos');
    if (saved) return JSON.parse(saved);
    return {
      ethos: "The discipline of planning saves you from the tyranny of the urgent. Focus on the next meaningful action, not the noise of the deadline.",
      author: "ClockWork Ethos"
    };
  });

  // --- "MIND" AI CHAT ASSISTANT STATE ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cw_chat');
    if (saved) return JSON.parse(saved);
    return [
      {
        sender: 'mind',
        text: "Hello, I am Mind. Tell me what you are looking for, ask me to summarize your priorities, or request a proactive scheduling audit.",
        time: '09:00'
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // --- FORM CONTROLS ---
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('17:00');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  const [newStickyText, setNewStickyText] = useState('');
  const [newStickyColor, setNewStickyColor] = useState('#FFF9C4');
  const [newStickyCategory, setNewStickyCategory] = useState('work');

  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [voiceReply, setVoiceReply] = useState('Ready to advise. Ask for proactive schedule audits.');
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isGeneratingEthos, setIsGeneratingEthos] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  // Web Speech Recognition
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- SYNC STATE TO STORAGE ---
  useEffect(() => {
    localStorage.setItem('cw_dark_mode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('cw_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('cw_sticky', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  useEffect(() => {
    localStorage.setItem('cw_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('cw_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('cw_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('cw_ethos', JSON.stringify(dailyEthos));
  }, [dailyEthos]);

  useEffect(() => {
    localStorage.setItem('cw_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const addLog = (message: string) => {
    setApiLogs((prev) => [message, ...prev.slice(0, 4)]);
  };

  // --- SPEECH SERVICES ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        addLog('Mic capturing voice command...');
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setVoiceInput(text);
        addLog(`Voice detected: "${text}"`);
        handleVoiceSubmit(text);
      };

      rec.onerror = (e: any) => {
        console.error('Mic capture error', e);
        setIsRecording(false);
        addLog(`Mic capture error: ${e.error}`);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [tasks]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        const fallbackText = prompt("Mic recognition API unavailable. Type your voice action manually:", "Schedule pitch strategy review at 14:00");
        if (fallbackText) {
          setVoiceInput(fallbackText);
          handleVoiceSubmit(fallbackText);
        }
      }
    }
  };

  const speakAdvice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // --- CORE TASK OPERATORS ---
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      deadline: newTaskDeadline,
      priority: newTaskPriority,
      priorityNum: '0' + (tasks.length + 1),
      completed: false,
      estimatedTime: '45 mins',
      aiComment: 'Awaiting dynamic AI priority sweep.'
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    setNewTaskTitle('');
    addLog(`Commitment "${newTask.title}" registered.`);
    triggerAlertsUpdate(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    const reordered = updated.map((t, idx) => ({
      ...t,
      priorityNum: `0${idx + 1}`
    }));
    setTasks(reordered);
    addLog('Task archived.');
    triggerAlertsUpdate(reordered);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          setStreak(prev => prev + 1);
          addLog(`Perfect! Momentum streak boosted to ${streak + 1}.`);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const handleAddSticky = (e: FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;

    const rotations = ['-1.5deg', '1deg', '2.5deg', '-2.5deg', '1.5deg', '-1deg'];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const newSticky: Sticky = {
      id: Date.now().toString(),
      content: newStickyText.trim(),
      color: newStickyColor,
      rotation: randomRotation,
      category: newStickyCategory
    };

    setStickyNotes([newSticky, ...stickyNotes]);
    setNewStickyText('');
    addLog(`Captured lightning thought: "${newSticky.content.substring(0, 20)}..."`);
  };

  const handleDeleteSticky = (id: string) => {
    setStickyNotes(stickyNotes.filter(s => s.id !== id));
    addLog('Sticky note cleared.');
  };

  // --- "MIND" COMPANION CHAT CONTROLLER ---
  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    addLog('Querying companion brain "Mind"...');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: chatMessages,
          tasks,
          stickyNotes,
          schedule,
          streak
        })
      });
      const data = await response.json();
      const mindMessage: ChatMessage = {
        sender: 'mind',
        text: data.reply || "I am processing your schedules to keep you productive.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, mindMessage]);
      addLog('Mind responded.');
    } catch (err) {
      console.error(err);
      addLog('Companion chat network issue.');
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'mind',
          text: "I encountered a workspace connection issue, but let's stay focused. Your active commitments are always safely cached locally.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- BACKGROUND AI PROCEDURES ---
  const handlePrioritizeAI = async () => {
    if (tasks.length === 0) {
      addLog('Add tasks to activate AI prioritization.');
      return;
    }
    setIsPrioritizing(true);
    addLog('Requesting Gemini order optimization...');
    try {
      const response = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        addLog('Gemini prioritized assignments by critical timeline.');
      }
    } catch (err) {
      console.error(err);
      addLog('Gemini prioritization communication failure.');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleAutonomousSchedule = async () => {
    setIsScheduling(true);
    addLog('Autonomous scheduling system active...');
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      if (data.slots && Array.isArray(data.slots)) {
        setSchedule(data.slots);
        addLog('Daily schedule blocks optimized.');
      }
    } catch (err) {
      console.error(err);
      addLog('Autonomous schedule failure.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleGenerateEthos = async (theme: string) => {
    setIsGeneratingEthos(true);
    addLog(`AI Ethos drafting for theme: [${theme}]...`);
    try {
      const response = await fetch('/api/ai/ethos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      });
      const data = await response.json();
      if (data.ethos) {
        setDailyEthos({ ethos: data.ethos, author: data.author || 'Daily Ethos' });
        addLog('New Daily Ethos loaded successfully.');
      }
    } catch (err) {
      console.error(err);
      addLog('Ethos connection timeout.');
    } finally {
      setIsGeneratingEthos(false);
    }
  };

  const triggerAlertsUpdate = async (currentTasks: Task[]) => {
    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: currentTasks })
      });
      const data = await response.json();
      if (data.alerts && Array.isArray(data.alerts)) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error('Failed to load contextual alerts:', err);
    }
  };

  const handleVoiceSubmit = async (textToProcess: string) => {
    const input = textToProcess || voiceInput;
    if (!input.trim()) return;

    setVoiceLoading(true);
    addLog('ClockWork Voice Core compiling advice...');
    try {
      const response = await fetch('/api/ai/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputMessage: input, tasks })
      });
      const data = await response.json();
      setVoiceReply(data.reply);
      speakAdvice(data.reply);
      addLog('Voice Advice synthesized.');

      if (data.action && data.action.type === 'add_task') {
        const newTask: Task = {
          id: Date.now().toString(),
          title: data.action.title,
          deadline: data.action.deadline || '17:00',
          priority: 'high',
          priorityNum: '0' + (tasks.length + 1),
          completed: false,
          estimatedTime: '45 mins',
          aiComment: 'Autonomous addition via audio instruction.'
        };
        setTasks((prev) => [...prev, newTask]);
        addLog(`Voice Action: Created task "${data.action.title}"`);
      }
    } catch (err) {
      console.error(err);
      addLog('Voice strategist failed to connect.');
    } finally {
      setVoiceLoading(false);
      setVoiceInput('');
    }
  };

  const handleLoadSampleData = () => {
    const samples: Task[] = [
      {
        id: 'sample-1',
        title: 'Review Midterm Chemistry Syllabus',
        deadline: '10:00 AM',
        priority: 'high',
        priorityNum: '01',
        completed: false,
        estimatedTime: '45 mins',
        aiComment: 'Critical study milestone. Do not defer.'
      },
      {
        id: 'sample-2',
        title: 'Submit Biometric API Proposal',
        deadline: '15:30',
        priority: 'high',
        priorityNum: '02',
        completed: false,
        estimatedTime: '1.5 hours',
        aiComment: 'AI reserved deep block directly before client sync.'
      },
      {
        id: 'sample-3',
        title: 'Confirm Office Broadband Payment',
        deadline: '16:45',
        priority: 'low',
        priorityNum: '03',
        completed: false,
        estimatedTime: '15 mins',
        aiComment: 'Prevent service cutoff. Recommend direct bank wire.'
      }
    ];
    setTasks(samples);
    triggerAlertsUpdate(samples);
    addLog('Procrastination samples successfully loaded.');
  };

  const clearWorkspace = () => {
    if (confirm('Are you sure you want to clear your local workspace cache?')) {
      setTasks([]);
      setStickyNotes([]);
      setStreak(0);
      setSchedule([]);
      setChatMessages([
        {
          sender: 'mind',
          text: "Workspace flushed. Tell me what you need to build next or configure.",
          time: '12:00'
        }
      ]);
      addLog('Workspace cleared.');
    }
  };

  const getSystemDateString = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${
      darkMode ? 'bg-[#121212] text-[#FDFCFB]' : 'bg-[#FDFCFB] text-[#1A1A1A]'
    }`}>
      {/* HEADER SECTION - CLASSIC EDITORIAL DESIGN */}
      <header className={`border-b px-6 py-5 md:px-12 md:py-6 flex flex-col md:flex-row justify-between items-baseline gap-4 transition-colors ${
        darkMode ? 'border-[#FDFCFB]/20' : 'border-[#1A1A1A]'
      }`}>
        <div className="flex flex-wrap items-baseline gap-4">
          <h1 id="app-logo" className="font-serif italic font-black text-4xl md:text-5xl tracking-tighter">
            ClockWork
          </h1>
          <span className={`text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 border rounded ${
            darkMode ? 'border-[#FDFCFB]/20 bg-neutral-800' : 'border-[#1A1A1A] bg-[#F1F0ED]'
          }`}>
            Proactive AI Companion
          </span>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="text-xs uppercase tracking-widest font-mono text-right flex flex-wrap gap-x-4 gap-y-1 justify-end items-center">
            <span>{getSystemDateString()}</span>
            <span className="text-[#D95D39] font-bold">/ AI ACTIVE</span>
          </div>

          {/* THEME SWITCHER */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 border rounded-full transition-all ${
              darkMode ? 'border-[#FDFCFB]/20 text-yellow-400 hover:bg-neutral-800' : 'border-[#1A1A1A] text-slate-800 hover:bg-[#F2F0ED]'
            }`}
            title={darkMode ? "Switch to Light Cream Edition" : "Switch to Charcoal Dark Mode"}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* CORE GRID LAYOUT: Three Columns (Directives, Action Core, "Mind" AI Chat & Momentum) */}
      <main className={`flex-1 grid grid-cols-1 lg:grid-cols-[330px_1fr_340px] gap-px transition-colors ${
        darkMode ? 'bg-neutral-800' : 'bg-[#1A1A1A]'
      }`}>
        
        {/* COLUMN 1: DIRECTIVES & AUDIO COMPANION (LEFT) */}
        <section id="sidebar-left" className={`p-6 flex flex-col gap-6 justify-between transition-colors ${
          darkMode ? 'bg-neutral-900' : 'bg-[#FDFCFB]'
        }`}>
          <div>
            <div className={`flex justify-between items-center mb-5 pb-2 border-b ${
              darkMode ? 'border-neutral-800' : 'border-[#E5E5E5]'
            }`}>
              <h2 className="text-xs uppercase tracking-widest font-bold opacity-60">
                Directives & Alerts
              </h2>
              <span className={`text-[9px] px-2 py-0.5 uppercase font-mono border ${
                darkMode ? 'bg-neutral-800 text-[#FDFCFB]/70 border-neutral-700' : 'bg-[#1A1A1A] text-white'
              }`}>
                Context Feed
              </span>
            </div>

            {/* Notification Pills */}
            <div className="space-y-3 mb-6">
              {alerts.length === 0 ? (
                <div className={`p-4 border text-xs font-mono text-center ${
                  darkMode ? 'border-neutral-800 bg-neutral-800/30' : 'border-[#E5E5E5] bg-[#F9F8F6]'
                }`}>
                  Alert status normal. High-priority deadlines synchronized.
                </div>
              ) : (
                alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`border p-4 rounded-none hover:shadow-sm transition-all duration-200 ${
                      darkMode ? 'border-[#FDFCFB]/10 bg-[#1E1E1E]' : 'border-[#1A1A1A] bg-[#F2F0ED]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#D95D39] uppercase tracking-wider">
                      <AlertCircle size={12} />
                      <span>{alert.type}</span>
                    </div>
                    <p className="text-xs leading-relaxed font-mono">
                      {alert.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* AUDIO COMPANION STRATEGIST */}
            <div className={`border p-4 rounded-none ${
              darkMode ? 'border-[#FDFCFB]/10 bg-[#1C1C1C]' : 'border-[#1A1A1A] bg-[#F9F8F6]'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Mic size={12} className={isRecording ? 'text-red-500 animate-pulse' : 'text-[#D95D39]'} />
                  Spoken Strategist
                </span>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="text-[9px] uppercase font-mono text-[#D95D39] hover:underline"
                    title="Stop speaking"
                  >
                    STOP SOUND [X]
                  </button>
                )}
              </div>

              <div className={`p-3 border text-xs font-mono min-h-[75px] max-h-[140px] overflow-y-auto mb-3 leading-relaxed italic ${
                darkMode ? 'bg-[#2C2C2C] border-neutral-700 text-[#FDFCFB]/80' : 'bg-white border-[#E5E5E5] text-gray-700'
              }`}>
                {voiceLoading ? 'Synthesizing voice response...' : `"${voiceReply}"`}
              </div>

              {/* Speech Controls */}
              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`flex-1 py-2 px-3 text-xs font-mono flex items-center justify-center gap-2 border uppercase transition-all duration-150 ${
                    isRecording
                      ? 'bg-red-600 text-white border-red-700 font-bold'
                      : darkMode
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-[#FDFCFB]/10'
                      : 'bg-white hover:bg-gray-100 border-[#1A1A1A]'
                  }`}
                >
                  <Mic size={14} className={isRecording ? 'animate-pulse' : ''} />
                  {isRecording ? 'Listening...' : 'Voice Query'}
                </button>
                
                <button
                  onClick={() => handleVoiceSubmit('Recommend a schedule focus break strategy.')}
                  className={`px-3 py-2 border text-xs font-mono uppercase transition-colors ${
                    darkMode ? 'bg-neutral-800 hover:bg-neutral-700 border-[#FDFCFB]/10' : 'bg-white hover:bg-gray-100 border-[#1A1A1A]'
                  }`}
                  title="Generate dynamic strategy"
                >
                  Tip
                </button>
              </div>
            </div>
          </div>

          {/* DAILY ETHOS - MINIMAL PARAGRAPH WITH DAILY ROTATION */}
          <div className={`border-t-2 pt-5 mt-auto ${
            darkMode ? 'border-neutral-800' : 'border-[#1A1A1A]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Daily Ethos
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleGenerateEthos('deep focus')}
                  disabled={isGeneratingEthos}
                  className={`text-[9px] px-1.5 py-0.5 border rounded font-mono transition-colors ${
                    darkMode ? 'border-neutral-800 hover:bg-neutral-800 text-[#FDFCFB]/70' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Focus
                </button>
                <button
                  onClick={() => handleGenerateEthos('anti-procrastination rules')}
                  disabled={isGeneratingEthos}
                  className={`text-[9px] px-1.5 py-0.5 border rounded font-mono transition-colors ${
                    darkMode ? 'border-neutral-800 hover:bg-neutral-800 text-[#FDFCFB]/70' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Hacks
                </button>
              </div>
            </div>
            
            <div className="relative min-h-[90px] flex flex-col justify-between">
              {isGeneratingEthos ? (
                <div className="text-xs italic text-gray-400 font-mono py-2 animate-pulse">
                  Drafting philosophical mental model...
                </div>
              ) : (
                <>
                  <p className="font-serif italic text-base leading-relaxed">
                    "{dailyEthos.ethos}"
                  </p>
                  <p className="text-right text-[10px] uppercase tracking-wider font-bold opacity-60 mt-2 font-mono">
                    — {dailyEthos.author}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* COLUMN 2: THE TODAY HIGH PRIORITY PANEL & SCHEDULE (CENTER) */}
        <section id="center-core" className={`p-6 md:p-8 flex flex-col gap-6 order-1 lg:order-2 transition-colors ${
          darkMode ? 'bg-neutral-950' : 'bg-[#FDFCFB]'
        }`}>
          {/* HEADER CONTROLS */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            darkMode ? 'border-neutral-800' : 'border-[#1A1A1A]'
          }`}>
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1 font-mono">
                Active Planner Core
              </h2>
              <p className={`text-xs font-serif italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Schedule tasks and secure consistency before the timeline is missed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleLoadSampleData}
                className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-colors ${
                  darkMode ? 'border-neutral-800 bg-[#1E1E1E] hover:bg-neutral-800' : 'border-[#1A1A1A] bg-[#F2F0ED] hover:bg-gray-200'
                }`}
              >
                Sample Data
              </button>
              <button
                onClick={handlePrioritizeAI}
                disabled={isPrioritizing || tasks.length === 0}
                className={`px-3.5 py-1.5 border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors ${
                  darkMode ? 'border-[#FDFCFB]/20 bg-[#FDFCFB] text-black hover:bg-white' : 'border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-black'
                }`}
              >
                <Sparkles size={12} className={isPrioritizing ? 'animate-spin' : ''} />
                {isPrioritizing ? 'Sorting...' : 'AI Prioritize'}
              </button>
              <button
                onClick={handleAutonomousSchedule}
                disabled={isScheduling || tasks.length === 0}
                className="px-3.5 py-1.5 border border-[#D95D39] bg-[#D95D39] text-white hover:bg-[#c44e2e] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <CalendarIcon size={12} className={isScheduling ? 'animate-bounce' : ''} />
                {isScheduling ? 'Mapping...' : 'Auto-Schedule'}
              </button>
            </div>
          </div>

          {/* TASK INTAKE SHELF */}
          <form onSubmit={handleAddTask} className={`border p-4 ${
            darkMode ? 'border-neutral-800 bg-[#141414]' : 'border-[#1A1A1A] bg-[#F2F0ED]'
          }`}>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-3 font-mono flex items-center gap-1.5 text-[#D95D39]">
              <PlusCircle size={12} />
              Register Commitment
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <input
                  type="text"
                  placeholder="e.g., Chemistry Syllabus, Server credentials setup"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className={`w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D95D39] ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-[#FDFCFB]' : 'bg-white border-[#1A1A1A] text-[#1A1A1A]'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="17:00"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className={`w-full border px-3 py-2 text-sm text-center font-mono focus:outline-none focus:ring-1 focus:ring-[#D95D39] ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-[#FDFCFB]' : 'bg-white border-[#1A1A1A] text-[#1A1A1A]'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className={`w-full border px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D95D39] ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-[#FDFCFB]' : 'bg-white border-[#1A1A1A] text-[#1A1A1A]'
                  }`}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#D95D39] text-white py-2 px-3 hover:bg-[#c44e2e] font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>
            </div>
          </form>

          {/* ACTIVE HIGH PRIORITIES */}
          <div>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xs uppercase tracking-widest font-bold opacity-60 font-mono">
                High-Urgency Pipeline ({tasks.filter(t => !t.completed).length} pending)
              </h2>
              {tasks.length > 0 && (
                <button
                  onClick={() => setTasks([])}
                  className="text-[9px] font-mono hover:underline uppercase text-red-500"
                >
                  Archive All [X]
                </button>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className={`border border-dashed p-8 text-center text-xs font-mono ${
                darkMode ? 'border-neutral-800 text-gray-500 bg-[#141414]/30' : 'border-[#1A1A1A] text-gray-500 bg-[#F9F8F6]'
              }`}>
                Commitment roster empty. Type above or select "Sample Data" to synchronize.
              </div>
            ) : (
              <div className={`divide-y border-t border-b ${
                darkMode ? 'divide-neutral-800 border-neutral-800' : 'divide-[#E5E5E5] border-[#1A1A1A]'
              }`}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 ${
                      task.completed ? 'opacity-35' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Priority Rank Indicator */}
                      <span className={`font-serif italic text-3xl md:text-4xl leading-none min-w-[40px] ${
                        darkMode ? 'text-neutral-700' : 'text-[#1A1A1A]/30'
                      }`}>
                        {task.priorityNum || '—'}
                      </span>

                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`mt-1 transition-colors ${
                          darkMode ? 'text-[#FDFCFB] hover:text-[#D95D39]' : 'text-[#1A1A1A] hover:text-[#D95D39]'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 size={19} className="text-green-500" />
                        ) : (
                          <Circle size={19} />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className={`text-base font-bold ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 uppercase bg-[#D95D39] text-white">
                            Due {task.deadline}
                          </span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 uppercase border ${
                            task.priority === 'high' 
                              ? 'border-red-500 text-red-500 bg-red-500/10' 
                              : task.priority === 'medium'
                              ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                              : 'border-neutral-500 text-neutral-400 bg-neutral-500/10'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {/* AI Comment */}
                        <p className={`text-xs font-mono leading-relaxed italic flex items-center gap-1.5 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Sparkles size={11} className="text-amber-500 shrink-0" />
                          <span>{task.aiComment}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <span className={`text-xs font-mono border px-2.5 py-1 ${
                        darkMode ? 'border-neutral-800 bg-neutral-900 text-gray-400' : 'border-gray-200 bg-[#F9F8F6] text-gray-500'
                      }`}>
                        {task.estimatedTime || '30m'}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DYNAMIC TIME BLOCK SCHEDULE */}
          <div className={`border p-5 ${
            darkMode ? 'border-neutral-800 bg-[#161616]' : 'border-[#1A1A1A] bg-[#F9F8F6]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-2 border-b border-dashed border-neutral-500/30 gap-2">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest flex items-center gap-2">
                <CalendarIcon size={14} className="text-[#D95D39]" />
                Optimized Day-Flow Planner
              </h3>
              <span className="text-[9px] uppercase font-mono opacity-60">
                Hourly Time Blocking
              </span>
            </div>

            {schedule.length === 0 ? (
              <div className="text-center py-6 text-xs font-mono text-gray-500 italic">
                Schedule empty. Select "Auto-Schedule" above to organize commitments.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schedule.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      const updated = [...schedule];
                      updated[index].completed = !updated[index].completed;
                      setSchedule(updated);
                      addLog(`Toggled block schedule slot: "${slot.taskTitle}"`);
                    }}
                    className={`border p-3 flex justify-between items-center cursor-pointer transition-all hover:scale-[1.01] select-none ${
                      slot.completed 
                        ? 'opacity-40 line-through' 
                        : ''
                    } ${
                      darkMode 
                        ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800' 
                        : 'bg-[#FDFCFB] border-[#1A1A1A] hover:bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-bold flex items-center gap-1">
                        <CornerDownRight size={10} />
                        {slot.time}
                      </span>
                      <div className="text-xs font-bold leading-tight font-serif">
                        {slot.taskTitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        slot.type === 'focus' 
                          ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                          : slot.type === 'admin'
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : 'bg-green-100 text-green-900 border border-green-200'
                      }`}>
                        {slot.type}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        darkMode ? 'border-neutral-600' : 'border-[#1A1A1A]'
                      } ${slot.completed ? 'bg-[#D95D39]' : 'bg-transparent'}`}>
                        {slot.completed && <Check size={8} className="text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 3: MOMENTUM, STICKY NOTES & "MIND" COMPANION CHAT PANEL (RIGHT) */}
        <section id="sidebar-right" className={`p-6 flex flex-col gap-6 justify-between transition-colors ${
          darkMode ? 'bg-neutral-900' : 'bg-[#FDFCFB]'
        }`}>
          <div className="space-y-6">
            
            {/* STREAK & CONSISTENCY */}
            <div className={`border p-5 text-center relative ${
              darkMode ? 'border-neutral-800 bg-[#1c1c1c]' : 'border-[#1A1A1A] bg-[#F2F0ED]'
            }`}>
              <div className="absolute top-2 right-2 text-[#D95D39] animate-pulse">
                <Flame size={18} fill="currentColor" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest font-bold opacity-60">
                Commitment Momentum
              </div>
              <div className="font-sans font-black text-6xl my-1 tracking-tight text-[#D95D39]">
                {streak}
              </div>
              <div className="text-xs uppercase font-mono tracking-widest font-bold">
                Days Consistent
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => { setStreak(s => Math.max(0, s - 1)); addLog('Streak lowered.'); }}
                  className={`px-2 py-0.5 border text-[9px] font-mono transition-colors ${
                    darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-[#1A1A1A] hover:bg-white'
                  }`}
                >
                  -1 Day
                </button>
                <button
                  onClick={() => { setStreak(s => s + 1); addLog('Streak manually boosted.'); }}
                  className={`px-2 py-0.5 border text-[9px] font-mono transition-colors ${
                    darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-[#1A1A1A] hover:bg-white'
                  }`}
                >
                  +1 Day
                </button>
              </div>
            </div>

            {/* "MIND" COMPANION COGNITIVE HUB */}
            <div className={`border p-4 flex flex-col ${
              darkMode ? 'border-neutral-800 bg-[#121212]' : 'border-[#1A1A1A] bg-[#F2F0ED]'
            }`}>
              <div className="flex justify-between items-center mb-3 pb-1 border-b border-dashed border-neutral-500/20">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D95D39] flex items-center gap-1.5">
                  <Sparkles size={11} className="animate-spin" />
                  Brain: Mind
                </span>
                <span className="text-[8px] font-mono text-gray-500 uppercase">
                  Contextual reasoning
                </span>
              </div>

              {/* Chat messages */}
              <div className={`p-3 border text-xs font-mono h-[160px] overflow-y-auto mb-3 space-y-2 leading-relaxed rounded ${
                darkMode ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-white border-gray-300'
              }`}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2 rounded-none max-w-[85%] ${
                      msg.sender === 'user' 
                        ? 'bg-[#D95D39] text-white text-right' 
                        : darkMode 
                        ? 'bg-neutral-800 text-[#FDFCFB]' 
                        : 'bg-[#F2F0ED] text-black'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[8px] text-gray-500 uppercase mt-0.5 tracking-tighter">{msg.sender === 'user' ? 'You' : 'Mind'} • {msg.time}</span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-[9px] italic text-gray-400 font-mono animate-pulse">
                    Mind is reading priorities & searching archives...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Find 'Slide Deck' or Summarize..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#D95D39] ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-3 bg-[#D95D39] hover:bg-[#c44e2e] text-white text-xs font-mono uppercase flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send size={12} />
                </button>
              </form>

              {/* Quick Prompt Suggesters */}
              <div className="flex gap-1.5 flex-wrap mt-2.5">
                <button
                  type="button"
                  onClick={() => setChatInput('summarize my priorities')}
                  className={`text-[8px] font-mono px-2 py-0.5 border rounded-sm ${
                    darkMode ? 'border-neutral-800 hover:bg-neutral-800' : 'border-gray-200 hover:bg-white'
                  }`}
                >
                  Summarize All
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput('find billing details')}
                  className={`text-[8px] font-mono px-2 py-0.5 border rounded-sm ${
                    darkMode ? 'border-neutral-800 hover:bg-neutral-800' : 'border-gray-200 hover:bg-white'
                  }`}
                >
                  Find: Billing
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput('are there gaps in my schedule?')}
                  className={`text-[8px] font-mono px-2 py-0.5 border rounded-sm ${
                    darkMode ? 'border-neutral-800 hover:bg-neutral-800' : 'border-gray-200 hover:bg-white'
                  }`}
                >
                  Schedule Check
                </button>
              </div>
            </div>

            {/* QUICK POST-IT GRID (CREATIVE STICKIES) */}
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-400/25">
                <h2 className="text-xs uppercase tracking-widest font-bold opacity-60 font-mono">
                  Quick Captures
                </h2>
                <span className="text-[9px] text-[#D95D39] font-mono font-bold uppercase tracking-widest">
                  Noteboard
                </span>
              </div>

              {/* Post-it Creator */}
              <form onSubmit={handleAddSticky} className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Capture quick lightning note..."
                  value={newStickyText}
                  onChange={(e) => setNewStickyText(e.target.value)}
                  className={`w-full border px-2.5 py-1.5 text-xs focus:outline-none ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-[#1A1A1A]'
                  }`}
                />
                
                <div className="flex gap-2 items-center justify-between">
                  {/* Expanded palette selector */}
                  <div className="flex gap-1">
                    {[
                      { hex: '#FFF9C4', label: 'Yellow' },
                      { hex: '#E1F5FE', label: 'Blue' },
                      { hex: '#F1F8E9', label: 'Green' },
                      { hex: '#FFF3E0', label: 'Orange' },
                      { hex: '#F8BBD0', label: 'Pink' },
                      { hex: '#E1BEE7', label: 'Lavender' }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setNewStickyColor(col.hex)}
                        className={`w-4 h-4 rounded-full border transition-transform ${
                          newStickyColor === col.hex ? 'scale-125 border-neutral-800' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      />
                    ))}
                  </div>

                  <select
                    value={newStickyCategory}
                    onChange={(e) => setNewStickyCategory(e.target.value)}
                    className={`text-[10px] font-mono border p-1 focus:outline-none ${
                      darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Life</option>
                    <option value="study">Study</option>
                    <option value="errand">Quick</option>
                  </select>

                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-mono uppercase border border-neutral-500/20"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Note board list */}
              <div className="grid grid-cols-2 gap-3 min-h-[140px]">
                {stickyNotes.length === 0 ? (
                  <div className="col-span-2 border border-dashed border-gray-400/30 p-6 text-center text-[10px] font-mono text-gray-500 italic">
                    Noteboard empty. Quick capture thoughts here.
                  </div>
                ) : (
                  stickyNotes.map((note) => (
                    <div
                      key={note.id}
                      className="sticky-note group p-3 flex flex-col justify-between shadow transition-transform hover:scale-[1.03] text-left overflow-hidden select-none border border-black/5"
                      style={{
                        backgroundColor: note.color,
                        transform: `rotate(${note.rotation})`,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        {/* Icon based on category */}
                        <span className="text-[8px] font-mono uppercase bg-black/5 px-1 py-0.5 text-black/60 tracking-wide font-bold">
                          {note.category === 'work' ? '💼 WORK' : note.category === 'personal' ? '❤️ LIFE' : note.category === 'study' ? '📚 STUDY' : '⚡ QUICK'}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteSticky(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-700 hover:text-red-900 font-bold p-0.5"
                          title="Remove"
                        >
                          <X size={11} />
                        </button>
                      </div>

                      <p className="text-xs text-gray-800 leading-snug break-words font-sans mt-2.5 mb-1">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* LOWER DIAGNOSTICS & SYSTEM MANIFESTO */}
          <div className={`mt-auto pt-4 border-t space-y-4 ${
            darkMode ? 'border-neutral-800' : 'border-[#E5E5E5]'
          }`}>
            {/* LEDGER FEED */}
            <div className={`border border-dashed p-2.5 rounded font-mono text-[9px] ${
              darkMode ? 'border-neutral-800 bg-[#161616] text-[#FDFCFB]/80' : 'border-[#1A1A1A]/30 bg-[#F2F0ED] text-[#2C2C2C]'
            }`}>
              <div className="text-[8px] uppercase font-bold opacity-50 mb-1 tracking-wider">
                Event Ledger
              </div>
              <div className="space-y-0.5">
                {apiLogs.length === 0 ? (
                  <div className="italic text-gray-400">Idle. Awaiting interaction.</div>
                ) : (
                  apiLogs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      ● {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* MANIFESTO AND FLUSH UTILITY */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setManifestoOpen(true)}
                  className="font-mono font-bold text-xs underline cursor-help flex items-center gap-1.5"
                >
                  PROJECT_MANIFESTO.MD
                  <HelpCircle size={13} className="text-[#D95D39]" />
                </button>
                <button
                  onClick={clearWorkspace}
                  className="text-[9px] font-mono text-red-500 hover:underline uppercase"
                  title="Flush Local Cache"
                >
                  Flush Workspace [X]
                </button>
              </div>

              <div className="text-[10px] font-mono leading-relaxed text-gray-500">
                <strong>Model:</strong> gemini-3.5-flash (Node SDK)<br />
                <strong>Architecture:</strong> Full-stack Express + Vite Proxy
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MANIFESTO / SPECIFICATION OVERLAY DRAWER */}
      {manifestoOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex justify-end animate-fade-in">
          <div className="w-full max-w-xl bg-[#FDFCFB] text-black border-l border-neutral-900 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-900">
                <h2 className="font-serif italic font-bold text-2xl">
                  ClockWork Manifesto Specification
                </h2>
                <button
                  onClick={() => setManifestoOpen(false)}
                  className="border border-[#1A1A1A] p-1.5 bg-[#F2F0ED] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="prose prose-sm font-mono text-xs space-y-6 text-gray-800">
                <div>
                  <h3 className="font-bold uppercase text-[#D95D39] mb-1">
                    Problem Statement Selected
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    <strong>The Last-Minute Life Saver:</strong> Students and professionals suffer from high cognitive fatigue caused by complex calendars and passive visual alarms. Traditional static alerts are trivial to dismiss, providing zero aid in helping users actualize schedule slots.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold uppercase text-[#D95D39] mb-1">
                    Solution & AI Architecture
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    ClockWork replaces standard calendars with a fully reactive AI dashboard. Built with an Express server proxying the official Google GenAI model, the application allows **"Mind"** (our localized cognitive core) to analyze workspace states. "Mind" searches, asks, identifies schedule gaps, prioritizes deliverables, drafts hour-by-hour schedules, and provides audio advice seamlessly.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold uppercase text-[#D95D39] mb-1">
                    Key Integrated Modules
                  </h3>
                  <ul className="list-disc pl-4 space-y-2 text-gray-700">
                    <li><strong>Proactive AI Prioritization</strong>: Sorts commitment list by realistic threat matrix.</li>
                    <li><strong>Autonomous Planning Blocks</strong>: Generates deep work hours and breaks.</li>
                    <li><strong>Cognitive Chatbot "Mind"</strong>: Real-time search, summarization, and query execution.</li>
                    <li><strong>Creative Sticky Captures</strong>: Palette-coded post-it board for immediate ideas.</li>
                    <li><strong>Editorial Dark & Light Modes</strong>: Dual eye-safe editorial interfaces designed for high readability.</li>
                    <li><strong>Streak & Consistency tracking</strong>: Multi-day consistency widget keeping motivation high.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold uppercase text-[#D95D39] mb-1">
                    Google Technologies Utilized
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    • <strong>Google Gemini API (gemini-3.5-flash)</strong> via official @google/genai SDK.<br />
                    • <strong>Google Cloud Run</strong> full-stack node execution platform.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setManifestoOpen(false)}
              className="mt-8 w-full py-3 bg-[#1A1A1A] text-white font-mono uppercase text-xs hover:bg-black transition-colors border border-black/20"
            >
              Return to Active Companion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
