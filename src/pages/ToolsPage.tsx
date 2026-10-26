import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  Wind,
  BookOpen,
  Lightbulb,
  Compass,
  CalendarCheck,
  Sparkles,
  Trash2,
  Download,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';
import {
  BREATHING_PHASES,
  getInitialBreathingState,
  advanceBreathingTick,
  JournalEntryRecord,
  DailyCheckInRecord,
  validateJournalEntry,
  exportToOpenMHealthSchema,
  formatAppointmentSummaryText,
  CrisisRegionCode,
} from '../lib/wellbeingLogic';

interface ToolsPageProps {
  region: CrisisRegionCode;
  onNavigate: (path: string) => void;
}

const STORAGE_CONSENT_KEY = 'rm_local_storage_consent_v1';
const STORAGE_JOURNAL_KEY = 'rm_journal_entries_v1';
const STORAGE_CHECKIN_KEY = 'rm_daily_checkins_v1';

export default function ToolsPage({ region, onNavigate }: ToolsPageProps) {
  const [activeTab, setActiveTab] = useState<
    'breathing' | 'journal' | 'checkin' | 'ai-prep' | 'affirmations' | 'grounding'
  >('breathing');

  // 1. Working 4-7-8 Breathing Timer State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingState, setBreathingState] = useState(() => getInitialBreathingState(4));

  useEffect(() => {
    if (!isBreathingActive) return;
    const timer = window.setInterval(() => {
      setBreathingState((prev) => {
        const next = advanceBreathingTick(prev);
        if (next.isComplete) {
          setIsBreathingActive(false);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isBreathingActive]);

  const currentPhase = BREATHING_PHASES[breathingState.phaseIndex];

  // 2. Local Privacy Consent & Persistent Thought Journal State
  const [hasConsent, setHasConsent] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntryRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_JOURNAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [thoughtInput, setThoughtInput] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [responseAction, setResponseAction] = useState('');
  const [nextStepPlan, setNextStepPlan] = useState('');
  const [journalMessage, setJournalMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // 3. Daily Mood & Stress Check-In State (Open mHealth compatible)
  const [checkIns, setCheckIns] = useState<DailyCheckInRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CHECKIN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [moodScore, setMoodScore] = useState<number>(3);
  const [stressScore, setStressScore] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [checkInNotes, setCheckInNotes] = useState('');
  const [checkInSavedMsg, setCheckInSavedMsg] = useState<string | null>(null);

  // 4. Interactive Grounding Checklist State
  const [completedGroundingSteps, setCompletedGroundingSteps] = useState<Record<string, boolean>>({});

  // 5. Appointment Preparation & Scoped Responsible AI Assistant State
  const [aiTask, setAiTask] = useState<
    'simplify_concept' | 'prepare_doctor_questions' | 'reflection_prompt' | 'support_navigation'
  >('prepare_doctor_questions');
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    response: string;
    guardTriggered: string | null;
    source: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleToggleConsent = (checked: boolean) => {
    setHasConsent(checked);
    try {
      localStorage.setItem(STORAGE_CONSENT_KEY, String(checked));
    } catch {
      // ignore storage errors
    }
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setJournalMessage(null);

    const validation = validateJournalEntry({
      thought: thoughtInput,
      anxietyLevel,
      responseAction,
      nextStepPlan,
    });

    if (!validation.valid) {
      setJournalMessage({ type: 'error', text: validation.error || 'Invalid entry.' });
      return;
    }

    const newEntry: JournalEntryRecord = {
      id: `jrnl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      thought: thoughtInput.trim(),
      anxietyLevel,
      responseAction: responseAction.trim() || 'Observed without acting',
      nextStepPlan: nextStepPlan.trim() || 'Allow uncertainty to pass',
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    if (hasConsent) {
      try {
        localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(updated));
      } catch {
        // ignore quota errors
      }
    }

    setThoughtInput('');
    setAnxietyLevel(5);
    setResponseAction('');
    setNextStepPlan('');
    setJournalMessage({
      type: 'success',
      text: hasConsent
        ? 'Entry saved privately in your browser (localStorage). Never sent to any external server.'
        : 'Entry added for this session only (enable local storage consent above if you want entries kept after closing the tab).',
    });
  };

  const handleDeleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((item) => item.id !== id);
    setJournalEntries(updated);
    try {
      localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const record: DailyCheckInRecord = {
      id: `chk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      moodScore,
      stressScore,
      sleepHours,
      notes: checkInNotes.trim(),
    };
    const updated = [record, ...checkIns];
    setCheckIns(updated);
    if (hasConsent) {
      try {
        localStorage.setItem(STORAGE_CHECKIN_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    setCheckInNotes('');
    setCheckInSavedMsg(
      hasConsent
        ? 'Daily check-in saved to your device.'
        : 'Check-in recorded for this current tab session.'
    );
  };

  const handleExportOpenMHealth = () => {
    const payload = exportToOpenMHealthSchema(checkIns, journalEntries);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `restless-mind-openmhealth-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAllLocalData = () => {
    setJournalEntries([]);
    setCheckIns([]);
    setHasConsent(false);
    try {
      localStorage.removeItem(STORAGE_JOURNAL_KEY);
      localStorage.removeItem(STORAGE_CHECKIN_KEY);
      localStorage.removeItem(STORAGE_CONSENT_KEY);
    } catch {
      // ignore
    }
    setJournalMessage({
      type: 'success',
      text: 'All local journal entries, check-ins, and consent preferences have been permanently deleted from this browser.',
    });
  };

  const handleRunAiGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiError(null);
    setAiResult(null);

    if (aiInput.trim().length < 4) {
      setAiError('Please enter at least a short phrase or question (4+ characters).');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: aiTask,
          userInput: aiInput,
          region,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAiError(data.error || 'Unable to process request right now.');
      } else {
        setAiResult({
          response: data.response,
          guardTriggered: data.guardTriggered || null,
          source: data.source || 'curated_template_fallback',
        });
      }
    } catch {
      setAiError('Network error while contacting server-side guide.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadAppointmentSummary = () => {
    const summaryText = formatAppointmentSummaryText({
      checkIns,
      journals: journalEntries,
      userNotes: aiInput,
      aiQuestions: aiResult?.response || '',
    });
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `restless-mind-appointment-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tools = [
    { id: 'breathing', label: '4-7-8 Breathing', icon: Wind },
    { id: 'journal', label: 'Thought Journal', icon: BookOpen },
    { id: 'checkin', label: 'Daily Check-In', icon: CalendarCheck },
    { id: 'ai-prep', label: 'Appointment & AI Guide', icon: Sparkles },
    { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Compass },
    { id: 'affirmations', label: 'Affirmations', icon: Heart },
  ] as const;

  const affirmations = [
    'I am not my thoughts; thoughts are passing mental events.',
    'This wave of discomfort will peak and subside on its own.',
    'I can practice living with "maybe, maybe not" instead of demanding 100% certainty.',
    'Resisting a compulsion is an investment in my long-term freedom.',
    'My worth is defined by my values and actions, not by intrusive thoughts.',
    'Recovery is not the absence of thoughts—it is changing how I respond to them.',
    'I deserve compassionate, evidence-based support.',
    'Small, imperfect steps forward still count as progress.',
  ];

  const groundingExercises = [
    {
      name: '5-4-3-2-1 Sensory Anchor Exercise',
      steps: [
        'Name 5 things you can see around you right now',
        'Notice 4 textures you can physically touch or feel',
        'Listen for 3 distinct sounds in the room or outside',
        'Identify 2 scents in the air or on your sleeve/cup',
        'Notice 1 taste in your mouth or take a sip of water',
      ],
    },
    {
      name: 'Physical Gravity & ERP Pause Technique',
      steps: [
        'Press both feet firmly into the floor and notice the solid surface',
        'Drop your shoulders away from your ears and unclench your jaw',
        'Notice the urge to check or ruminate without acting on it for 60 seconds',
        'Touch an object with a cool or textured surface',
        'Take 3 slow breaths without trying to force thoughts away',
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="heading-lg mb-3">Daily Wellness &amp; Self-Reflection Tools</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Interactive, privacy-conscious tools to calm your nervous system, observe thoughts without compulsions, and prepare for professional care.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportOpenMHealth}
              className="button-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
            >
              <Download size={15} aria-hidden="true" />
              Export Data (Open mHealth JSON)
            </button>
            <button
              type="button"
              onClick={handleClearAllLocalData}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-destructive/40 text-destructive hover:bg-destructive/10 smooth-transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={15} aria-hidden="true" />
              Delete Local Data
            </button>
          </div>
        </div>
      </section>

      {/* Main Tools Workspace */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Accessible Tablist */}
          <div
            role="tablist"
            aria-label="Daily Wellness Tools"
            className="flex flex-wrap gap-2 mb-8"
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm smooth-transition whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-foreground hover:bg-accent/50 border border-border'
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {tool.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Working 4-7-8 Breathing Exercise */}
          {activeTab === 'breathing' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
                  <div>
                    <h2 className="heading-md">4-7-8 Paced Breathing Technique</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Slows heart rate and activates your parasympathetic nervous system during acute anxiety spikes.
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-semibold text-primary shrink-0">
                    Cycle {Math.min(breathingState.completedCycles + 1, breathingState.totalTargetCycles)} of{' '}
                    {breathingState.totalTargetCycles} · 19s rhythm
                  </span>
                </div>

                {/* Live Animated Breathing Circle */}
                <div className="flex justify-center my-10">
                  <div
                    data-testid="breathing-circle"
                    className={`relative w-56 h-56 md:w-64 md:h-64 rounded-full gradient-blue-soft flex flex-col items-center justify-center text-white shadow-md smooth-transition ${
                      isBreathingActive && currentPhase.id === 'inhale'
                        ? 'scale-105'
                        : isBreathingActive && currentPhase.id === 'exhale'
                        ? 'scale-95'
                        : 'scale-100'
                    }`}
                  >
                    <p className="text-xl font-bold tracking-tight mb-1">
                      {breathingState.isComplete
                        ? 'Session Complete!'
                        : isBreathingActive
                        ? currentPhase.label
                        : 'Ready to Begin'}
                    </p>
                    <p
                      data-testid="breathing-countdown"
                      className="text-5xl font-mono tabular-nums font-extrabold my-1"
                    >
                      {breathingState.isComplete
                        ? '✓'
                        : isBreathingActive
                        ? `${breathingState.secondsRemaining}s`
                        : '4-7-8'}
                    </p>
                    <p className="text-xs text-white/90 px-6 text-center mt-1">
                      {breathingState.isComplete
                        ? 'Completed 4 full 4-7-8 cycles.'
                        : isBreathingActive
                        ? currentPhase.instruction
                        : 'Press Start to begin the 19-second guided cycle.'}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      if (breathingState.isComplete) {
                        setBreathingState(getInitialBreathingState(4));
                        setIsBreathingActive(true);
                      } else {
                        setIsBreathingActive(!isBreathingActive);
                      }
                    }}
                    className="button-primary inline-flex items-center gap-2"
                  >
                    {isBreathingActive ? <Pause size={18} /> : <Play size={18} />}
                    {isBreathingActive
                      ? 'Pause Timer'
                      : breathingState.isComplete
                      ? 'Restart 4 Cycles'
                      : 'Start Breathing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBreathingActive(false);
                      setBreathingState(getInitialBreathingState(4));
                    }}
                    className="button-secondary inline-flex items-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-secondary border border-border rounded-xl p-6">
                  <h3 className="font-bold text-sm text-foreground mb-3">How the 4-7-8 Rhythm Works:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">1.</span>
                      <span>Inhale quietly through your nose for <strong>4 seconds</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">2.</span>
                      <span>Hold your breath gently for <strong>7 seconds</strong> (skip or shorten if dizzy).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">3.</span>
                      <span>Exhale slowly through your mouth for <strong>8 seconds</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">4.</span>
                      <span>Repeat for 4 cycles. Remember: in OCD recovery, use breathing to support your body while allowing thoughts to pass—not as a ritual to force thoughts away.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Working Private Thought Journal */}
          {activeTab === 'journal' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <h2 className="heading-md mb-2">Private ERP Thought &amp; Response Journal</h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Write down intrusive thoughts or worries without judgment. Practicing observing your response helps you spot compulsions and build healthier habits.
                  </p>

                  {/* Explicit Consent Banner */}
                  <div className="bg-secondary border border-border rounded-xl p-4 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasConsent}
                        onChange={(e) => handleToggleConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-border"
                      />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Informed Consent for Device Storage:</strong> Save my journal entries and check-ins in this browser&apos;s local storage so they stay available when I return. My journal entries are never transmitted to any server.
                      </span>
                    </label>
                  </div>

                  {journalMessage && (
                    <div
                      role="status"
                      className={`p-4 rounded-xl mb-6 text-sm border ${
                        journalMessage.type === 'error'
                          ? 'bg-destructive/10 border-destructive/40 text-destructive'
                          : 'bg-secondary border-primary/40 text-foreground'
                      }`}
                    >
                      {journalMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveJournal} className="space-y-5">
                    <div>
                      <label
                        htmlFor="journal-thought"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        1. What thought, doubt, or feeling appeared?
                      </label>
                      <textarea
                        id="journal-thought"
                        value={thoughtInput}
                        onChange={(e) => setThoughtInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="e.g., Intrusive doubt about whether I locked the front door properly..."
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="journal-anxiety-range"
                          className="text-sm font-semibold text-foreground"
                        >
                          2. Distress / Anxiety Level (SUDS 1–10)
                        </label>
                        <span className="font-mono tabular-nums text-sm font-bold text-primary">
                          {anxietyLevel} / 10
                        </span>
                      </div>
                      <input
                        id="journal-anxiety-range"
                        type="range"
                        min={1}
                        max={10}
                        value={anxietyLevel}
                        onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground font-mono tabular-nums mt-1">
                        <span>1 (Mild)</span>
                        <span>5 (Moderate)</span>
                        <span>10 (Extreme)</span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="journal-response"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        3. What did you do in response? (Did you check, avoid, or pause?)
                      </label>
                      <textarea
                        id="journal-response"
                        value={responseAction}
                        onChange={(e) => setResponseAction(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                        placeholder="e.g., Checked the lock twice, then paused before checking a third time."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="journal-next-step"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        4. What gentle ERP or self-care response would you like to try next time?
                      </label>
                      <textarea
                        id="journal-next-step"
                        value={nextStepPlan}
                        onChange={(e) => setNextStepPlan(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                        placeholder="e.g., Wait 5 minutes before checking and say 'Maybe it's locked, maybe I can tolerate uncertainty.'"
                      />
                    </div>

                    <button type="submit" className="button-primary">
                      Save Journal Entry
                    </button>
                  </form>
                </div>

                {/* Saved Entries List */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-base">
                      Your Saved Reflections ({journalEntries.length})
                    </h3>
                  </div>

                  {journalEntries.length === 0 ? (
                    <div className="bg-secondary border border-border rounded-xl p-6 text-center">
                      <BookOpen size={28} className="text-primary mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground mb-1">No entries saved yet</p>
                      <p className="text-xs text-muted-foreground">
                        Fill out the reflection form to log your first thought observation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {journalEntries.map((item) => (
                        <div
                          key={item.id}
                          className="bg-secondary border border-border rounded-xl p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span className="font-mono tabular-nums">
                              {new Date(item.createdAt).toLocaleDateString()} · Distress: {item.anxietyLevel}/10
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteJournalEntry(item.id)}
                              className="text-destructive hover:underline text-xs font-medium"
                              aria-label={`Delete journal entry from ${new Date(item.createdAt).toLocaleDateString()}`}
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{item.thought}</p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Response:</strong> {item.responseAction}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Next Time Plan:</strong> {item.nextStepPlan}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Daily Mood, Stress & Sleep Check-In (Open mHealth schema) */}
          {activeTab === 'checkin' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6">
                  <h2 className="heading-md mb-2">Optional Daily Wellbeing Check-In</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Track how mood, stress, and sleep interact over time. Structured using the Open mHealth (Apache-2.0) self-report standard.
                  </p>

                  {checkInSavedMsg && (
                    <div
                      role="status"
                      className="bg-secondary border border-primary/40 rounded-xl p-3 text-xs text-foreground mb-4"
                    >
                      {checkInSavedMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveCheckIn} className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-mood">Overall Mood Today (1 = Very Low, 5 = Calm/Grounded)</label>
                        <span className="font-mono tabular-nums text-primary">{moodScore} / 5</span>
                      </div>
                      <input
                        id="checkin-mood"
                        type="range"
                        min={1}
                        max={5}
                        value={moodScore}
                        onChange={(e) => setMoodScore(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-stress">Stress &amp; Overwhelm Level (1 = Calm, 5 = High Overwhelm)</label>
                        <span className="font-mono tabular-nums text-primary">{stressScore} / 5</span>
                      </div>
                      <input
                        id="checkin-stress"
                        type="range"
                        min={1}
                        max={5}
                        value={stressScore}
                        onChange={(e) => setStressScore(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-sleep">Approximate Sleep Last Night (Hours)</label>
                        <span className="font-mono tabular-nums text-primary">{sleepHours} hrs</span>
                      </div>
                      <input
                        id="checkin-sleep"
                        type="range"
                        min={2}
                        max={12}
                        step={0.5}
                        value={sleepHours}
                        onChange={(e) => setSleepHours(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkin-notes" className="block text-sm font-semibold text-foreground mb-1">
                        Context Note (Optional — e.g., work deadline, skipped caffeine, hormonal cycle)
                      </label>
                      <input
                        id="checkin-notes"
                        type="text"
                        value={checkInNotes}
                        onChange={(e) => setCheckInNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm"
                        placeholder="Brief note for your own reference..."
                      />
                    </div>

                    <button type="submit" className="button-primary">
                      Log Daily Check-In
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                  <h3 className="font-bold text-foreground mb-4">
                    Recent Check-In Log ({checkIns.length})
                  </h3>
                  {checkIns.length === 0 ? (
                    <div className="bg-secondary border border-border rounded-xl p-6 text-center">
                      <CalendarCheck size={28} className="text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground mb-1">No check-ins logged yet</p>
                      <p className="text-xs text-muted-foreground">
                        Logging your mood, stress, and sleep helps you notice patterns to share with your doctor or counselor.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[420px] overflow-y-auto">
                      {checkIns.map((ci) => (
                        <div key={ci.id} className="bg-secondary border border-border rounded-xl p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums text-muted-foreground mb-1">
                            <span>{new Date(ci.createdAt).toLocaleString()}</span>
                            <span>
                              Mood: {ci.moodScore}/5 · Stress: {ci.stressScore}/5 · Sleep: {ci.sleepHours}h
                            </span>
                          </div>
                          {ci.notes && <p className="text-sm text-foreground">{ci.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Appointment Preparation & Responsible AI Guide */}
          {activeTab === 'ai-prep' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start gap-3 mb-4">
                  <ClipboardList size={26} className="text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="heading-md">Appointment Preparation &amp; Educational AI Guide</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prepare structured questions for a mental health professional or ask for plain-language explanations of OCD/anxiety concepts.
                    </p>
                  </div>
                </div>

                {/* Responsible AI Safeguard Notice */}
                <div className="bg-secondary border border-border rounded-xl p-4 mb-6 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    Responsible AI &amp; OCD Clinical Safeguards Active:
                  </p>
                  <p>
                    · This tool is <strong>non-diagnostic</strong> and cannot prescribe treatment or replace a clinician.
                  </p>
                  <p>
                    · <strong>OCD Anti-Reassurance Boundary:</strong> To protect your recovery, this guide will never answer compulsive certainty-checking questions (e.g., &ldquo;Promise me 100% nothing bad will happen&rdquo;).
                  </p>
                </div>

                <form onSubmit={handleRunAiGuide} className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="ai-task-select" className="block text-sm font-semibold text-foreground mb-2">
                      1. Choose how you want help today:
                    </label>
                    <select
                      id="ai-task-select"
                      value={aiTask}
                      onChange={(e) => setAiTask(e.target.value as typeof aiTask)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm font-medium"
                    >
                      <option value="prepare_doctor_questions">
                        Prepare questions for my first Psychologist / Psychiatrist / Doctor appointment
                      </option>
                      <option value="simplify_concept">
                        Explain a mental-wellbeing or ERP therapy concept in simple language
                      </option>
                      <option value="reflection_prompt">
                        Give me a non-diagnostic reflection prompt for an anxious moment
                      </option>
                      <option value="support_navigation">
                        Help me navigate which Restless Mind tools or helplines fit my situation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ai-user-input" className="block text-sm font-semibold text-foreground mb-1.5">
                      2. Describe the topic or what you want to discuss with a professional:
                    </label>
                    <textarea
                      id="ai-user-input"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      rows={3}
                      maxLength={600}
                      placeholder="e.g., I have repetitive doubts about mistakes at work and trouble sleeping, and I want to know what to ask a therapist..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="button-primary text-sm inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      <Sparkles size={16} />
                      {aiLoading ? 'Generating Guidance...' : 'Generate Structured Guidance'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiInput(
                          'Can you promise me 100% sure that nothing bad will happen if I do not check the lock again?'
                        )
                      }
                      className="button-secondary text-xs py-2 px-3"
                    >
                      Test OCD Anti-Reassurance Guard
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadAppointmentSummary}
                      className="button-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                    >
                      <Download size={14} aria-hidden="true" />
                      Download Appointment Prep Sheet (.txt)
                    </button>
                  </div>
                </form>

                {aiError && (
                  <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-xl p-4 text-sm mb-4">
                    {aiError}
                  </div>
                )}

                {aiResult && (
                  <div
                    data-testid="ai-guide-output"
                    className="bg-secondary border border-border rounded-2xl p-6 space-y-3"
                  >
                    {aiResult.guardTriggered && (
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-card px-3 py-1 rounded-lg border border-border">
                        <AlertTriangle size={14} />
                        {aiResult.guardTriggered === 'ocd_anti_reassurance'
                          ? 'OCD ERP Safeguard: Stepping Out of the Reassurance Loop'
                          : 'Immediate Human Crisis Escalation Priority'}
                      </div>
                    )}
                    <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                      {aiResult.response}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Grounding Exercises */}
          {activeTab === 'grounding' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="heading-md mb-2">Interactive Grounding Exercises</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  When your mind races into future catastrophes, grounding brings your attention back to the physical room you are in right now. Check off each step as you complete it:
                </p>
                <div className="space-y-6">
                  {groundingExercises.map((exercise, idx) => (
                    <div key={idx} className="border border-border rounded-xl p-6 bg-secondary/40">
                      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                        <Compass size={20} className="text-primary" />
                        {exercise.name}
                      </h3>
                      <div className="space-y-2.5">
                        {exercise.steps.map((step, stepIdx) => {
                          const key = `${idx}-${stepIdx}`;
                          const checked = Boolean(completedGroundingSteps[key]);
                          return (
                            <label
                              key={key}
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  setCompletedGroundingSteps({
                                    ...completedGroundingSteps,
                                    [key]: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded border-border"
                              />
                              <span
                                className={`text-sm ${
                                  checked ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}
                              >
                                {step}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Affirmations */}
          {activeTab === 'affirmations' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="heading-md mb-3">Evidence-Informed Self-Compassion Statements</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Unlike forced positivity, ERP-aligned statements help you accept uncertainty and treat yourself kindly when intrusive thoughts show up.
                </p>
                <div className="grid gap-3">
                  {affirmations.map((affirmation, index) => (
                    <div
                      key={index}
                      className="bg-secondary border border-border rounded-xl p-5 flex items-start gap-3"
                    >
                      <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-base text-foreground leading-relaxed">{affirmation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 bg-secondary border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex items-start gap-4">
            <Lightbulb size={26} className="text-primary shrink-0 mt-1" />
            <div>
              <h3 className="text-base font-bold text-foreground mb-2">Tips for Using Daily Tools Safely</h3>
              <ul className="space-y-1.5 text-muted-foreground text-sm">
                <li>· Practice breathing and grounding gently—avoid turning relaxation exercises into a rigid ritual to &ldquo;cancel out&rdquo; bad thoughts.</li>
                <li>· All journal entries and check-ins stay private in your browser and can be exported or deleted anytime.</li>
                <li>
                  · Looking for a therapist or public clinic?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/resources')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Visit the Verified Help Directory →
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
