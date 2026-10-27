import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  RefreshCw,
  User,
  Bot,
  Volume2,
  VolumeX,
  Edit3,
  Search,
  ChevronRight,
  ChevronLeft,
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
  computePersonalWellbeingInsights,
  CrisisRegionCode,
} from '../lib/wellbeingLogic';
import {
  playGentlePhaseChime,
  speakGuidedInstruction,
  stopGuidedSpeech,
  AmbientPreset,
  setAmbientSoundscape,
  stopAmbientSoundscape,
} from '../lib/soundscapes';
import EditorialPageHeader from '../components/EditorialPageHeader';

export type ToolTabId =
  | 'breathing'
  | 'journal'
  | 'checkin'
  | 'ai-prep'
  | 'grounding'
  | 'affirmations';

const VALID_TOOL_TABS: ToolTabId[] = [
  'breathing',
  'journal',
  'checkin',
  'ai-prep',
  'grounding',
  'affirmations',
];

interface ToolsPageProps {
  region: CrisisRegionCode;
  onNavigate: (path: string) => void;
  initialTab?: string;
}

const STORAGE_CONSENT_KEY = 'rm_local_storage_consent_v1';
const STORAGE_JOURNAL_KEY = 'rm_journal_entries_v1';
const STORAGE_CHECKIN_KEY = 'rm_daily_checkins_v1';

interface AiConversationTurn {
  id: string;
  taskLabel: string;
  userPrompt: string;
  aiResponse: string;
  guardTriggered: string | null;
  source: string;
  timestamp: string;
}

const SUGGESTED_AI_PROMPTS: Record<
  'prepare_doctor_questions' | 'simplify_concept' | 'reflection_prompt' | 'support_navigation',
  string[]
> = {
  prepare_doctor_questions: [
    'I experience repetitive checking doubts before leaving home and want questions for my first therapy visit.',
    'How do I ask a psychiatrist or psychologist whether ERP therapy fits my intrusive thoughts?',
    'I have high stress, short sleep, and PCOS symptoms—what should I ask my doctor?',
  ],
  simplify_concept: [
    'Explain Exposure and Response Prevention (ERP) and habituation in simple everyday terms.',
    'Why does seeking reassurance make OCD intrusive thoughts return stronger?',
    'What is the difference between an unwanted intrusive thought and compulsive rumination?',
  ],
  reflection_prompt: [
    'Give me a gentle ERP-informed reflection prompt when I feel an urgent need to re-check a task.',
    'Help me practice sitting with uncertainty without arguing with an intrusive doubt.',
  ],
  support_navigation: [
    'Which Restless Mind tools and verified Indian helplines should I start with when feeling overwhelmed?',
    'How can I use the Thought Journal and Daily Check-In together before a clinic appointment?',
  ],
};

const APPOINTMENT_CONCERN_TAGS = [
  'Repetitive checking (locks, appliances, messages)',
  'Unwanted intrusive thoughts or mental images',
  'Seeking reassurance from family or online',
  'Difficulty tolerating uncertainty ("what-if" loops)',
  'Sleep disruption or racing thoughts at night',
  'Burnout, academic/work stress, or PCOS/hormonal overlap',
];

const INTERACTIVE_GROUNDING_STEPS = [
  {
    count: 5,
    sense: 'Sight · 5 Things You Can See',
    prompt: 'Look around the room slowly. Notice 5 distinct objects, colors, or light reflections.',
    placeholder: 'e.g., Wooden desk edge, blue mug, sunlight on the curtain...',
  },
  {
    count: 4,
    sense: 'Touch · 4 Textures You Can Feel',
    prompt: 'Notice 4 physical sensations: your feet on the floor, fabric on your sleeve, or a cool surface.',
    placeholder: 'e.g., Cool tabletop, cotton sleeve, solid floor under my heels...',
  },
  {
    count: 3,
    sense: 'Hearing · 3 Sounds in the Environment',
    prompt: 'Listen quietly for 3 ambient sounds near or far without judging them.',
    placeholder: 'e.g., Ceiling fan hum, distant traffic, my own steady breathing...',
  },
  {
    count: 2,
    sense: 'Smell · 2 Scents in the Air',
    prompt: 'Notice 2 subtle scents in the room, or recall a calming scent like rain or tea.',
    placeholder: 'e.g., Fresh air from the window, soap on my hands...',
  },
  {
    count: 1,
    sense: 'Taste & Gravity · 1 Grounded Anchor',
    prompt: 'Notice 1 taste in your mouth (or take a sip of water) and let your shoulders drop.',
    placeholder: 'e.g., Sip of cool water, jaw unclenched...',
  },
];

const ERP_REFRAME_SCENARIOS = [
  {
    id: 'lock_doubt',
    stickyThought: '"What if I didn’t lock the door properly and something terrible happens?"',
    compulsiveTrap: 'Walking back 4 times to jiggle the handle or mentally replaying locking it.',
    compassionateErpScript:
      'I locked the door once. It is uncomfortable to feel this doubt, and I am practicing allowing "maybe, maybe not" while continuing my day.',
    whyItWorks:
      'Leaves the uncertainty hook unanswered so your brain learns the alarm was a false signal.',
  },
  {
    id: 'intrusive_character',
    stickyThought: '"Why did that disturbing thought pop into my head? Does it mean I am a bad person?"',
    compulsiveTrap: 'Mentally arguing with the thought for an hour or confessing to seek reassurance.',
    compassionateErpScript:
      'An intrusive thought is just random neural noise, not an intention. I do not need to prove my character to an automatic thought.',
    whyItWorks:
      'Reduces secondary guilt and stops feeding attention into ego-dystonic thoughts.',
  },
  {
    id: 'mistake_perfection',
    stickyThought: '"What if I made a subtle mistake in that message or assignment?"',
    compulsiveTrap: 'Re-reading the sent message 12 times looking for 100% certainty.',
    compassionateErpScript:
      'Human beings are allowed to be imperfect. Choosing not to re-read this right now is an investment in my peace of mind.',
    whyItWorks:
      'Interrupts compulsive checking and builds tolerance for everyday imperfection.',
  },
];

export default function ToolsPage({ region, onNavigate, initialTab }: ToolsPageProps) {
  const [activeTab, setActiveTab] = useState<ToolTabId>(() =>
    initialTab && VALID_TOOL_TABS.includes(initialTab as ToolTabId)
      ? (initialTab as ToolTabId)
      : 'breathing'
  );

  useEffect(() => {
    if (initialTab && VALID_TOOL_TABS.includes(initialTab as ToolTabId)) {
      setActiveTab(initialTab as ToolTabId);
    }
  }, [initialTab]);

  // 1. Working 4-7-8 Breathing Timer State + Opt-in Audio/Voice/Ambient Controls
  const [targetCycles, setTargetCycles] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingState, setBreathingState] = useState(() => getInitialBreathingState(4));
  const [audioChimeEnabled, setAudioChimeEnabled] = useState<boolean>(false);
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState<boolean>(false);
  const [ambientPreset, setAmbientPreset] = useState<AmbientPreset>('off');
  const [selectedConcernTags, setSelectedConcernTags] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      stopAmbientSoundscape();
      stopGuidedSpeech();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'breathing' && ambientPreset !== 'off') {
      stopAmbientSoundscape();
      setAmbientPreset('off');
    }
  }, [activeTab, ambientPreset]);

  useEffect(() => {
    if (!isBreathingActive) return;
    const timer = window.setInterval(() => {
      setBreathingState((prev) => {
        const next = advanceBreathingTick(prev);
        // Trigger optional audio/voice cues strictly on phase transitions when opted in
        if (next.isComplete && !prev.isComplete) {
          setIsBreathingActive(false);
          if (audioChimeEnabled) playGentlePhaseChime('complete');
          if (voiceGuideEnabled) {
            speakGuidedInstruction('Breathing session complete. Notice how your body feels.');
          }
        } else if (next.phaseIndex !== prev.phaseIndex) {
          const nextPhase = BREATHING_PHASES[next.phaseIndex];
          if (audioChimeEnabled) playGentlePhaseChime(nextPhase.id);
          if (voiceGuideEnabled) speakGuidedInstruction(nextPhase.instruction);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isBreathingActive, audioChimeEnabled, voiceGuideEnabled]);

  const currentPhase = BREATHING_PHASES[breathingState.phaseIndex];

  const handleSelectTargetCycles = (cycles: number) => {
    setTargetCycles(cycles);
    setIsBreathingActive(false);
    stopGuidedSpeech();
    setBreathingState(getInitialBreathingState(cycles));
  };

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
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [journalSearch, setJournalSearch] = useState('');
  const [journalMessage, setJournalMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

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

  // 4. Interactive Grounding State (Guided Walkthrough + Checklist)
  const [groundingMode, setGroundingMode] = useState<'guided' | 'checklist'>('guided');
  const [activeGroundingStepIdx, setActiveGroundingStepIdx] = useState<number>(0);
  const [groundingNotes, setGroundingNotes] = useState<Record<number, string>>({});
  const [completedGroundingSteps, setCompletedGroundingSteps] = useState<Record<string, boolean>>(
    {}
  );

  // 5. Self-Compassion & ERP Uncertainty Studio State
  const [selectedReframeId, setSelectedReframeId] = useState<string>('lock_doubt');
  const [savedFavoriteStatements, setSavedFavoriteStatements] = useState<Record<number, boolean>>(
    {}
  );

  // 6. Appointment Preparation & Scoped Responsible AI Assistant State
  const [aiTask, setAiTask] = useState<
    'simplify_concept' | 'prepare_doctor_questions' | 'reflection_prompt' | 'support_navigation'
  >('prepare_doctor_questions');
  const [aiInput, setAiInput] = useState('');
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    response: string;
    guardTriggered: string | null;
    source: string;
  } | null>(null);
  const [aiHistory, setAiHistory] = useState<AiConversationTurn[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [groundingAnimationPaused, setGroundingAnimationPaused] = useState(false);

  // Read pre-selected clinician questions handed off from /treatment Appointment Checklist
  useEffect(() => {
    try {
      const prefilled = sessionStorage.getItem('rm_treatment_selected_questions_v1');
      if (prefilled && prefilled.trim().length > 0) {
        setAiTask('prepare_doctor_questions');
        setAiInput(prefilled.slice(0, 600));
        sessionStorage.removeItem('rm_treatment_selected_questions_v1');
      }
    } catch {
      // ignore sessionStorage errors
    }
  }, [activeTab]);

  const personalInsights = useMemo(
    () => computePersonalWellbeingInsights(checkIns, journalEntries),
    [checkIns, journalEntries]
  );

  const filteredJournals = useMemo(() => {
    const q = journalSearch.trim().toLowerCase();
    if (!q) return journalEntries;
    return journalEntries.filter(
      (item) =>
        item.thought.toLowerCase().includes(q) ||
        item.responseAction.toLowerCase().includes(q) ||
        item.nextStepPlan.toLowerCase().includes(q)
    );
  }, [journalEntries, journalSearch]);

  const taskLabels: Record<typeof aiTask, string> = {
    prepare_doctor_questions: 'Prepare Questions for a Professional Appointment',
    simplify_concept: 'Plain-Language Concept Explanation',
    reflection_prompt: 'Non-Diagnostic Reflection Prompt',
    support_navigation: 'Platform & Helpline Navigation',
  };

  const handleToggleConsent = (checked: boolean) => {
    setHasConsent(checked);
    try {
      localStorage.setItem(STORAGE_CONSENT_KEY, String(checked));
      if (checked) {
        localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(journalEntries));
        localStorage.setItem(STORAGE_CHECKIN_KEY, JSON.stringify(checkIns));
      }
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

    let updated: JournalEntryRecord[];
    if (editingJournalId) {
      updated = journalEntries.map((item) =>
        item.id === editingJournalId
          ? {
              ...item,
              thought: thoughtInput.trim(),
              anxietyLevel,
              responseAction: responseAction.trim() || 'Observed without acting',
              nextStepPlan: nextStepPlan.trim() || 'Allow uncertainty to pass',
            }
          : item
      );
      setEditingJournalId(null);
    } else {
      const newEntry: JournalEntryRecord = {
        id: `jrnl-${Date.now()}`,
        createdAt: new Date().toISOString(),
        thought: thoughtInput.trim(),
        anxietyLevel,
        responseAction: responseAction.trim() || 'Observed without acting',
        nextStepPlan: nextStepPlan.trim() || 'Allow uncertainty to pass',
      };
      updated = [newEntry, ...journalEntries];
    }

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
      text: editingJournalId
        ? 'Journal reflection updated.'
        : hasConsent
        ? 'Reflection saved privately in your browser (localStorage). Never transmitted to any external server.'
        : 'Reflection added for this session only (enable local storage consent above if you want entries kept after closing the tab).',
    });
  };

  const handleStartEditJournal = (entry: JournalEntryRecord) => {
    setEditingJournalId(entry.id);
    setThoughtInput(entry.thought);
    setAnxietyLevel(entry.anxietyLevel);
    setResponseAction(entry.responseAction);
    setNextStepPlan(entry.nextStepPlan);
    setJournalMessage(null);
  };

  const handleDeleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((item) => item.id !== id);
    setJournalEntries(updated);
    if (editingJournalId === id) {
      setEditingJournalId(null);
      setThoughtInput('');
      setResponseAction('');
      setNextStepPlan('');
    }
    try {
      localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSendJournalToAiPrep = (entry: JournalEntryRecord) => {
    setAiTask('prepare_doctor_questions');
    setAiInput(
      `I logged an intrusive thought pattern (${entry.anxietyLevel}/10 distress): "${entry.thought}". My response was "${entry.responseAction}". What questions should I ask a therapist about this?`
    );
    setActiveTab('ai-prep');
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

  const handleDeleteCheckIn = (id: string) => {
    const updated = checkIns.filter((item) => item.id !== id);
    setCheckIns(updated);
    try {
      localStorage.setItem(STORAGE_CHECKIN_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
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
    setEditingJournalId(null);
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

  const executeAiGuideRequest = async (promptText: string) => {
    setAiError(null);
    const cleanPrompt = promptText.trim();
    if (cleanPrompt.length < 4) {
      setAiError('Please enter at least a short phrase or question (4+ characters).');
      return;
    }

    setLastSubmittedPrompt(cleanPrompt);
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: aiTask,
          userInput: cleanPrompt,
          region,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAiError(data.error || 'Unable to process request right now.');
      } else {
        const resultObj = {
          response: data.response,
          guardTriggered: data.guardTriggered || null,
          source: data.source || 'curated_template_fallback',
        };
        setAiResult(resultObj);
        setAiHistory((prev) => [
          {
            id: `turn-${Date.now()}`,
            taskLabel: taskLabels[aiTask],
            userPrompt: cleanPrompt,
            aiResponse: resultObj.response,
            guardTriggered: resultObj.guardTriggered,
            source: resultObj.source,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      }
    } catch {
      setAiError(
        'Network error while contacting the server-side wellbeing guide. Please check your connection and retry.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunAiGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeAiGuideRequest(aiInput);
  };

  const handleRetryAiGuide = async () => {
    await executeAiGuideRequest(lastSubmittedPrompt || aiInput);
  };

  const handleToggleConcernTag = (tagLabel: string) => {
    setSelectedConcernTags((prev) => {
      const exists = prev.includes(tagLabel);
      const next = exists ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel];
      if (!exists && !aiInput.includes(tagLabel)) {
        const prefix = aiInput.trim() ? `${aiInput.trim()} — ` : 'Context to discuss: ';
        setAiInput(`${prefix}${tagLabel}`.slice(0, 600));
      }
      return next;
    });
  };

  const handleDownloadAppointmentSummary = () => {
    const contextHeader =
      selectedConcernTags.length > 0
        ? `Selected Discussion Contexts: ${selectedConcernTags.join('; ')}\n`
        : '';
    const summaryText = formatAppointmentSummaryText({
      checkIns,
      journals: journalEntries,
      userNotes: `${contextHeader}${aiInput || lastSubmittedPrompt}`.trim(),
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
    {
      id: 'breathing',
      label: '4-7-8 Breathing',
      summary: '19s respiratory pacing',
      icon: Wind,
    },
    {
      id: 'journal',
      label: 'Thought Journal',
      summary: 'Private ERP reflection log',
      icon: BookOpen,
    },
    {
      id: 'checkin',
      label: 'Daily Check-In',
      summary: 'Mood, stress & sleep log',
      icon: CalendarCheck,
    },
    {
      id: 'ai-prep',
      label: 'AI & Doctor Prep',
      summary: 'Clinician prep & ERP guide',
      icon: Sparkles,
    },
    {
      id: 'grounding',
      label: 'Sensory Grounding',
      summary: '5-4-3-2-1 walkthrough',
      icon: Compass,
    },
    {
      id: 'affirmations',
      label: 'Self-Compassion',
      summary: 'ERP uncertainty studio',
      icon: Heart,
    },
  ] as const;

  const affirmations = [
    {
      statement: 'I am not my thoughts; thoughts are passing mental events.',
      context: 'Separates unwanted intrusive thoughts from personal identity or moral character.',
    },
    {
      statement: 'This wave of discomfort will peak and subside on its own without a ritual.',
      context: 'Supports habituation and inhibitory learning during Exposure and Response Prevention.',
    },
    {
      statement: 'I can practice living with "maybe, maybe not" instead of demanding 100% certainty.',
      context: 'Counters the compulsive demand for absolute reassurance.',
    },
    {
      statement: 'Choosing not to check or ruminate right now is an investment in my long-term freedom.',
      context: 'Reminds you why pausing a compulsion matters even when urges feel loud.',
    },
    {
      statement: 'My worth is defined by my values and actions, not by automatic intrusive doubts.',
      context: 'Helps reduce secondary guilt and self-judgment.',
    },
    {
      statement: 'Recovery is not the absence of thoughts—it is changing how I respond to them.',
      context: 'Sets realistic, compassionate expectations for progress.',
    },
  ];

  const groundingExercises = [
    {
      name: '5-4-3-2-1 Sensory Anchor Exercise',
      description: 'Use your five senses to gently return attention to the room around you.',
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
      description: 'Anchor your body when you notice a sudden urge to check, wash, or mentally review.',
      steps: [
        'Press both feet firmly into the floor and notice the solid surface',
        'Drop your shoulders away from your ears and unclench your jaw',
        'Notice the urge to check or ruminate without acting on it for 60 seconds',
        'Touch an object with a cool or textured surface',
        'Take 3 slow breaths without trying to force thoughts away',
      ],
    },
  ];

  const moodLabels: Record<number, string> = {
    1: 'Very Low / Heavy',
    2: 'Low / Drained',
    3: 'Neutral / Steady',
    4: 'Calm / Balanced',
    5: 'Grounded / Rested',
  };

  const stressLabels: Record<number, string> = {
    1: 'Calm / Low Tension',
    2: 'Mildly Uneasy',
    3: 'Moderate Stress',
    4: 'High Tension / Loud Thoughts',
    5: 'Acute Overwhelm',
  };

  const activeReframe =
    ERP_REFRAME_SCENARIOS.find((s) => s.id === selectedReframeId) || ERP_REFRAME_SCENARIOS[0];
  const currentGuidedStep =
    INTERACTIVE_GROUNDING_STEPS[activeGroundingStepIdx] || INTERACTIVE_GROUNDING_STEPS[0];

  // Progress fraction for concentric SVG ring in 4-7-8 breathing
  const phaseProgressFraction = isBreathingActive
    ? (currentPhase.durationSeconds - breathingState.secondsRemaining) /
      currentPhase.durationSeconds
    : breathingState.isComplete
    ? 1
    : 0;
  const ringCircumference = 2 * Math.PI * 122;
  const ringDashOffset = ringCircumference * (1 - Math.max(0, Math.min(1, phaseProgressFraction)));

  return (
    <div>
      {/* Hero & Data Ownership Controls */}
      <EditorialPageHeader
        eyebrow="Self-Guided · No Streaks or Guilt · Local-First Privacy"
        title="Daily Wellness & Self-Reflection Tools"
        description="Distraction-free exercises to settle your nervous system, observe intrusive thoughts without compulsions, and prepare structured notes for professional care."
        variant="constellation"
        actions={
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportOpenMHealth}
              className="button-secondary text-xs py-2.5 px-3.5 inline-flex items-center gap-1.5"
            >
              <Download size={15} aria-hidden="true" />
              Export Data (Open mHealth JSON)
            </button>
            <button
              type="button"
              onClick={handleClearAllLocalData}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-destructive/35 text-destructive hover:bg-destructive/10 smooth-transition inline-flex items-center gap-1.5 cursor-pointer bg-card/80"
            >
              <Trash2 size={15} aria-hidden="true" />
              Delete Local Data
            </button>
          </div>
        }
      />

      {/* Main Tools Workspace */}
      <section className="py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Local Storage Consent Strip */}
          <div className="bg-secondary/80 border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={19} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Device Storage Preference:</strong>{' '}
                {hasConsent
                  ? 'Local browser storage is enabled. Your journal reflections and check-ins are kept on this device between visits.'
                  : 'Session-only mode is active. Enable device storage if you want your reflections and check-ins saved in this browser.'}
              </div>
            </div>
            <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer shrink-0 bg-card px-3.5 py-2 rounded-xl border border-border">
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => handleToggleConsent(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span>Save on This Device (localStorage)</span>
            </label>
          </div>

          {/* Genuine Personal Pattern Insights Banner (Strictly Rendered When Real User Data Exists) */}
          {personalInsights.hasUserData && (
            <div
              data-testid="personal-wellbeing-insights"
              className="bg-card border border-primary/35 rounded-2xl p-5 mb-8 shadow-xs animate-slide-in-up"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <Sparkles size={14} aria-hidden="true" />
                      Your On-Device Wellbeing Summary (Self-Reported · Non-Diagnostic)
                    </p>
                    <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md bg-secondary border border-border text-muted-foreground">
                      {personalInsights.periodLabel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {personalInsights.observationSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                  <div className="bg-secondary/70 border border-border rounded-xl px-3.5 py-2 text-center">
                    <p className="text-[11px] text-muted-foreground">Avg Mood</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-foreground">
                      {personalInsights.avgMood !== null ? `${personalInsights.avgMood}/5` : '—'}
                    </p>
                  </div>
                  <div className="bg-secondary/70 border border-border rounded-xl px-3.5 py-2 text-center">
                    <p className="text-[11px] text-muted-foreground">Avg Stress</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-foreground">
                      {personalInsights.avgStress !== null ? `${personalInsights.avgStress}/5` : '—'}
                    </p>
                  </div>
                  <div className="bg-secondary/70 border border-border rounded-xl px-3.5 py-2 text-center">
                    <p className="text-[11px] text-muted-foreground">Avg Sleep</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-foreground">
                      {personalInsights.avgSleep !== null ? `${personalInsights.avgSleep}h` : '—'}
                    </p>
                  </div>
                  <div className="bg-secondary/70 border border-border rounded-xl px-3.5 py-2 text-center">
                    <p className="text-[11px] text-muted-foreground">ERP Reflections</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-primary">
                      {personalInsights.totalJournals}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Distinct 6-Tool Card Selector Grid (Accessible Tablist) */}
          <div
            role="tablist"
            aria-label="Daily Wellness Tools"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
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
                  className={`text-left p-3.5 rounded-2xl border smooth-transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Icon
                      size={18}
                      className={isSelected ? 'text-primary-foreground' : 'text-primary'}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm whitespace-nowrap truncate">
                      {tool.label}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-primary-foreground/85' : 'text-muted-foreground'
                      }`}
                    >
                      {tool.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Working 4-7-8 Breathing Exercise with Opt-In Audio & Cycle Target Controls */}
          {activeTab === 'breathing' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
                  <div>
                    <h2 className="heading-md">4-7-8 Paced Breathing Technique</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Slows heart rate and supports parasympathetic settling during moments of acute tension.
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-semibold text-primary shrink-0">
                    Cycle {Math.min(breathingState.completedCycles + 1, breathingState.totalTargetCycles)} of{' '}
                    {breathingState.totalTargetCycles} · 19s rhythm
                  </span>
                </div>

                {/* Customization Bar: Cycle Target & Opt-In Audio / Voice Controls */}
                <div className="bg-secondary/60 border border-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-foreground mr-1">
                      Session Length:
                    </span>
                    {[2, 4, 6].map((cycles) => (
                      <button
                        key={cycles}
                        type="button"
                        onClick={() => handleSelectTargetCycles(cycles)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
                          targetCycles === cycles
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-foreground border border-border hover:border-primary/40'
                        }`}
                      >
                        {cycles} Cycles ({cycles * 19}s)
                      </button>
                    ))}
                  </div>

                  {/* Opt-In Sound & Voice Guidance Toggles (Never Autoplay) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      aria-pressed={audioChimeEnabled}
                      onClick={() => {
                        const next = !audioChimeEnabled;
                        setAudioChimeEnabled(next);
                        if (next) playGentlePhaseChime('inhale');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border smooth-transition ${
                        audioChimeEnabled
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {audioChimeEnabled ? (
                        <Volume2 size={14} aria-hidden="true" />
                      ) : (
                        <VolumeX size={14} aria-hidden="true" />
                      )}
                      {audioChimeEnabled ? 'Soft Chime: On' : 'Soft Chime: Muted'}
                    </button>

                    <button
                      type="button"
                      aria-pressed={voiceGuideEnabled}
                      onClick={() => {
                        const next = !voiceGuideEnabled;
                        setVoiceGuideEnabled(next);
                        if (next) {
                          speakGuidedInstruction(
                            'Voice guidance enabled. Press Start Breathing when ready.'
                          );
                        } else {
                          stopGuidedSpeech();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border smooth-transition ${
                        voiceGuideEnabled
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {voiceGuideEnabled ? (
                        <Volume2 size={14} aria-hidden="true" />
                      ) : (
                        <VolumeX size={14} aria-hidden="true" />
                      )}
                      {voiceGuideEnabled ? 'Voice Cue: On' : 'Voice Cue: Off'}
                    </button>
                  </div>
                </div>

                {/* Opt-In Ambient Soundscape Selector (Synthesized Web Audio, Never Autoplays) */}
                <div
                  className="bg-card border border-border rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  role="group"
                  aria-label="Optional background ambient soundscape"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Volume2 size={15} className="text-primary shrink-0" aria-hidden="true" />
                    <span>
                      <strong className="text-foreground">Optional Ambient Soundscape:</strong>{' '}
                      Gentle synthesized background audio (strictly off by default)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(
                      [
                        { id: 'off', label: 'Ambient: Off' },
                        { id: 'warm_pad', label: 'Warm Harmonic Pad' },
                        { id: 'gentle_rain', label: 'Gentle Rain' },
                      ] as { id: AmbientPreset; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={ambientPreset === opt.id}
                        onClick={() => {
                          setAmbientPreset(opt.id);
                          setAmbientSoundscape(opt.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border smooth-transition ${
                          ambientPreset === opt.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary/60 text-foreground border-border hover:border-primary/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phase Indicator Strip */}
                <div className="grid grid-cols-3 gap-3 mb-8" aria-label="Breathing phase sequence">
                  {BREATHING_PHASES.map((phase, idx) => {
                    const isCurrent = isBreathingActive && breathingState.phaseIndex === idx;
                    return (
                      <div
                        key={phase.id}
                        className={`rounded-xl p-3 border text-center smooth-transition ${
                          isCurrent
                            ? 'bg-secondary border-primary text-foreground font-semibold ring-1 ring-primary'
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        <p className="text-xs font-bold text-foreground">{phase.label}</p>
                        <p className="text-[11px] font-mono tabular-nums text-primary mt-0.5">
                          {phase.durationSeconds} seconds
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Calm Animated Breathing Visual + Concentric SVG Progress Ring */}
                <div className="flex justify-center my-8">
                  <div className="relative flex items-center justify-center w-68 h-68 md:w-76 md:h-76">
                    {/* Concentric SVG Progress Ring */}
                    <svg
                      viewBox="0 0 264 264"
                      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="132"
                        cy="132"
                        r="122"
                        fill="none"
                        stroke="currentColor"
                        className="text-secondary"
                        strokeWidth="6"
                      />
                      <circle
                        cx="132"
                        cy="132"
                        r="122"
                        fill="none"
                        stroke="#2A6F68"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringDashOffset}
                      />
                    </svg>

                    <div
                      data-testid="breathing-circle"
                      role="timer"
                      aria-live="polite"
                      aria-label={`Breathing timer: ${
                        breathingState.isComplete
                          ? 'Session complete'
                          : isBreathingActive
                          ? `${currentPhase.label}, ${breathingState.secondsRemaining} seconds remaining`
                          : 'Ready to begin 4-7-8 breathing'
                      }`}
                      className={`relative w-52 h-52 md:w-60 md:h-60 rounded-full gradient-blue-soft flex flex-col items-center justify-center text-white shadow-md smooth-transition ${
                        isBreathingActive && currentPhase.id === 'inhale'
                          ? 'scale-105'
                          : isBreathingActive && currentPhase.id === 'exhale'
                          ? 'scale-95'
                          : 'scale-100'
                      }`}
                    >
                      <p className="text-lg font-bold tracking-tight mb-1">
                        {breathingState.isComplete
                          ? 'Session Complete'
                          : isBreathingActive
                          ? currentPhase.label
                          : 'Ready to Begin'}
                      </p>
                      <p
                        data-testid="breathing-countdown"
                        className="text-4xl md:text-5xl font-mono tabular-nums font-extrabold my-1"
                      >
                        {breathingState.isComplete
                          ? 'Done'
                          : isBreathingActive
                          ? `${breathingState.secondsRemaining}s`
                          : '4-7-8'}
                      </p>
                      <p className="text-xs text-white/95 px-6 text-center mt-1 leading-snug">
                        {breathingState.isComplete
                          ? `Completed ${breathingState.totalTargetCycles} full 4-7-8 cycles.`
                          : isBreathingActive
                          ? currentPhase.instruction
                          : 'Press Start to begin the 19-second guided cycle.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3.5 mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      if (breathingState.isComplete) {
                        setBreathingState(getInitialBreathingState(targetCycles));
                        setIsBreathingActive(true);
                        if (audioChimeEnabled) playGentlePhaseChime('inhale');
                        if (voiceGuideEnabled) {
                          speakGuidedInstruction(BREATHING_PHASES[0].instruction);
                        }
                      } else {
                        const nextActive = !isBreathingActive;
                        setIsBreathingActive(nextActive);
                        if (nextActive) {
                          if (audioChimeEnabled) playGentlePhaseChime(currentPhase.id);
                          if (voiceGuideEnabled) speakGuidedInstruction(currentPhase.instruction);
                        } else {
                          stopGuidedSpeech();
                        }
                      }
                    }}
                    className="button-primary inline-flex items-center gap-2 text-sm"
                  >
                    {isBreathingActive ? (
                      <Pause size={17} aria-hidden="true" />
                    ) : (
                      <Play size={17} aria-hidden="true" />
                    )}
                    {isBreathingActive
                      ? 'Pause Timer'
                      : breathingState.isComplete
                      ? `Restart ${targetCycles} Cycles`
                      : 'Start Breathing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBreathingActive(false);
                      stopGuidedSpeech();
                      setAmbientPreset('off');
                      stopAmbientSoundscape();
                      setBreathingState(getInitialBreathingState(targetCycles));
                    }}
                    className="button-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <RotateCcw size={17} aria-hidden="true" />
                    Reset
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-secondary border border-border rounded-2xl p-5 md:p-6">
                  <h3 className="font-bold text-sm text-foreground mb-3">
                    How to Practice 4-7-8 Breathing Gently
                  </h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">1.</span>
                      <span>
                        Inhale quietly through your nose for <strong>4 seconds</strong>.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">2.</span>
                      <span>
                        Hold your breath gently for <strong>7 seconds</strong> (shorten if you feel lightheaded).
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">3.</span>
                      <span>
                        Exhale slowly through your mouth for <strong>8 seconds</strong>.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono tabular-nums font-bold text-primary">4.</span>
                      <span>
                        <strong>ERP Note:</strong> Use paced breathing to support your body while allowing intrusive thoughts to pass naturally—avoid using breathing as a compulsion to neutralize thoughts.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Persistent Local-First Thought & ERP Reflection Journal (Save, Edit, Search, Delete) */}
          {activeTab === 'journal' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="heading-md">
                      {editingJournalId
                        ? 'Edit Thought & ERP Reflection'
                        : 'Thought & Compulsion Reflection Journal'}
                    </h2>
                    {editingJournalId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingJournalId(null);
                          setThoughtInput('');
                          setAnxietyLevel(5);
                          setResponseAction('');
                          setNextStepPlan('');
                        }}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    In Exposure and Response Prevention (ERP), the goal is to observe an intrusive thought and pause before performing a ritual—not to debate the thought or prove it false.
                  </p>

                  {journalMessage && (
                    <div
                      role="status"
                      className={`p-3.5 rounded-xl mb-5 text-xs font-medium border ${
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
                        1. What intrusive thought, doubt, or trigger showed up?
                      </label>
                      <textarea
                        id="journal-thought"
                        value={thoughtInput}
                        onChange={(e) => setThoughtInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground text-sm"
                        rows={3}
                        placeholder="e.g., Doubt about whether I locked the front door or made a mistake in an email..."
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="journal-distress"
                          className="text-sm font-semibold text-foreground"
                        >
                          2. Distress / Urge Intensity (1–10)
                        </label>
                        <span className="font-mono tabular-nums text-xs font-bold text-primary">
                          {anxietyLevel} / 10
                        </span>
                      </div>
                      <input
                        id="journal-distress"
                        type="range"
                        min={1}
                        max={10}
                        value={anxietyLevel}
                        onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1 · Mild notice</span>
                        <span>5 · Moderate urge</span>
                        <span>10 · Strong urge to check</span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="journal-response"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        3. How did you respond? (Did you check, ruminate, or pause?)
                      </label>
                      <textarea
                        id="journal-response"
                        value={responseAction}
                        onChange={(e) => setResponseAction(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground text-sm"
                        rows={2}
                        placeholder="e.g., Waited 2 minutes before checking, or noticed the urge without asking for reassurance..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="journal-next-step"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        4. Gentle ERP Experiment for Next Time
                      </label>
                      <textarea
                        id="journal-next-step"
                        value={nextStepPlan}
                        onChange={(e) => setNextStepPlan(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground text-sm"
                        rows={2}
                        placeholder="e.g., Delay checking by 5 minutes and practice saying 'Maybe, maybe not.'"
                      />
                    </div>

                    <button type="submit" className="button-primary text-sm">
                      {editingJournalId ? 'Update Journal Entry' : 'Save Journal Entry'}
                    </button>
                  </form>
                </div>

                {/* Saved Entries List with Search, Edit, Delete, and Send to AI Prep */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-foreground text-base">
                      Saved Reflections ({journalEntries.length})
                    </h3>
                  </div>

                  {journalEntries.length > 0 && (
                    <div className="relative mb-4">
                      <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={journalSearch}
                        onChange={(e) => setJournalSearch(e.target.value)}
                        placeholder="Filter saved reflections..."
                        aria-label="Filter saved journal reflections"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs"
                      />
                    </div>
                  )}

                  {filteredJournals.length === 0 ? (
                    <div className="bg-secondary border border-border rounded-2xl p-6 text-center">
                      <BookOpen size={26} className="text-primary mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {journalEntries.length === 0
                          ? 'No entries saved yet'
                          : 'No entries match your search'}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Log a thought observation on the left to build a private record for your own reflection or clinician visit.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                      {filteredJournals.map((item) => (
                        <div
                          key={item.id}
                          className="bg-secondary border border-border rounded-xl p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span className="font-mono tabular-nums">
                              {new Date(item.createdAt).toLocaleDateString()} · Distress:{' '}
                              {item.anxietyLevel}/10
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleStartEditJournal(item)}
                                className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} aria-hidden="true" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteJournalEntry(item.id)}
                                className="text-destructive hover:underline text-xs font-semibold cursor-pointer"
                                aria-label={`Delete journal entry from ${new Date(
                                  item.createdAt
                                ).toLocaleDateString()}`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{item.thought}</p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Response:</strong>{' '}
                            {item.responseAction}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Next Time Plan:</strong>{' '}
                            {item.nextStepPlan}
                          </p>
                          <div className="pt-2 border-t border-border/70 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSendJournalToAiPrep(item)}
                              className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles size={12} aria-hidden="true" />
                              Prepare Clinician Questions from This Entry →
                            </button>
                          </div>
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
                  <h2 className="heading-md mb-2">Daily Mood, Stress &amp; Sleep Check-In</h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Notice how sleep quality, stress load, and mood interact over time without pressure or streaks. Structured using the Open mHealth self-report schema.
                  </p>

                  {checkInSavedMsg && (
                    <div
                      role="status"
                      className="bg-secondary border border-primary/40 rounded-xl p-3.5 text-xs font-medium text-foreground mb-5"
                    >
                      {checkInSavedMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveCheckIn} className="space-y-5">
                    <div className="bg-secondary/60 border border-border rounded-xl p-4">
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-mood">Overall Mood Today</label>
                        <span className="font-mono tabular-nums text-primary">
                          {moodScore}/5 · {moodLabels[moodScore]}
                        </span>
                      </div>
                      <input
                        id="checkin-mood"
                        type="range"
                        min={1}
                        max={5}
                        value={moodScore}
                        onChange={(e) => setMoodScore(Number(e.target.value))}
                        className="w-full accent-primary mt-2"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1 (Very Low)</span>
                        <span>3 (Steady)</span>
                        <span>5 (Grounded)</span>
                      </div>
                    </div>

                    <div className="bg-secondary/60 border border-border rounded-xl p-4">
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-stress">Stress &amp; Overwhelm Level</label>
                        <span className="font-mono tabular-nums text-primary">
                          {stressScore}/5 · {stressLabels[stressScore]}
                        </span>
                      </div>
                      <input
                        id="checkin-stress"
                        type="range"
                        min={1}
                        max={5}
                        value={stressScore}
                        onChange={(e) => setStressScore(Number(e.target.value))}
                        className="w-full accent-primary mt-2"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1 (Calm)</span>
                        <span>3 (Moderate)</span>
                        <span>5 (High Overwhelm)</span>
                      </div>
                    </div>

                    <div className="bg-secondary/60 border border-border rounded-xl p-4">
                      <div className="flex justify-between text-sm font-semibold text-foreground mb-1">
                        <label htmlFor="checkin-sleep">Approximate Sleep Last Night</label>
                        <span className="font-mono tabular-nums text-primary">{sleepHours} hours</span>
                      </div>
                      <input
                        id="checkin-sleep"
                        type="range"
                        min={2}
                        max={12}
                        step={0.5}
                        value={sleepHours}
                        onChange={(e) => setSleepHours(Number(e.target.value))}
                        className="w-full accent-primary mt-2"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>2 hrs</span>
                        <span>7 hrs</span>
                        <span>12 hrs</span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="checkin-notes"
                        className="block text-sm font-semibold text-foreground mb-1.5"
                      >
                        Optional Context Note (e.g., exam week, caffeine, menstrual/PCOS cycle, travel)
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

                    <button type="submit" className="button-primary text-sm">
                      Log Daily Check-In
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                  <h3 className="font-bold text-foreground mb-4">
                    Recent Check-In Log ({checkIns.length})
                  </h3>
                  {checkIns.length === 0 ? (
                    <div className="bg-secondary border border-border rounded-2xl p-6 text-center">
                      <CalendarCheck size={26} className="text-primary mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        No check-ins logged yet
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Logging mood, stress, and sleep helps you spot patterns to share during a medical or therapy appointment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                      {checkIns.map((ci) => (
                        <div
                          key={ci.id}
                          className="bg-secondary border border-border rounded-xl p-4 space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums text-muted-foreground">
                            <span>{new Date(ci.createdAt).toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCheckIn(ci.id)}
                              className="text-destructive hover:underline text-xs font-sans font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-foreground">
                            <div className="bg-card rounded-lg px-2.5 py-1.5 border border-border">
                              Mood: <span className="font-mono text-primary">{ci.moodScore}/5</span>
                            </div>
                            <div className="bg-card rounded-lg px-2.5 py-1.5 border border-border">
                              Stress: <span className="font-mono text-primary">{ci.stressScore}/5</span>
                            </div>
                            <div className="bg-card rounded-lg px-2.5 py-1.5 border border-border">
                              Sleep: <span className="font-mono text-primary">{ci.sleepHours}h</span>
                            </div>
                          </div>
                          {ci.notes && <p className="text-xs text-foreground">{ci.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Appointment Preparation & Responsible Conversational AI Guide */}
          {activeTab === 'ai-prep' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <ClipboardList
                      size={26}
                      className="text-primary shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="heading-md">
                        Appointment Preparation &amp; Educational AI Guide
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Prepare structured questions for a mental-health professional or ask for plain-language explanations of OCD and anxiety concepts.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadAppointmentSummary}
                    className="button-secondary text-xs py-2.5 px-3.5 inline-flex items-center gap-1.5 shrink-0"
                  >
                    <Download size={14} aria-hidden="true" />
                    Download Appointment Prep Sheet (.txt)
                  </button>
                </div>

                {/* Clear Limitations & OCD Safeguards Notice */}
                <div className="bg-secondary border border-border rounded-2xl p-4 mb-6 text-xs text-muted-foreground space-y-1.5">
                  <p className="font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck size={15} className="text-primary shrink-0" aria-hidden="true" />
                    Scope, Limitations &amp; OCD Clinical Safeguards
                  </p>
                  <p>
                    · <strong>AI-Generated Educational Output:</strong> Responses are generated to help you organize questions or understand concepts. This guide cannot diagnose conditions, provide clinical certainty, or replace a qualified clinician.
                  </p>
                  <p>
                    · <strong>OCD Anti-Reassurance Boundary:</strong> Because reassurance-seeking strengthens OCD cycles, this guide will gently decline requests for 100% certainty (e.g., &ldquo;Promise me nothing bad will happen&rdquo;).
                  </p>
                  <p>
                    · <strong>Crisis Pre-Screening:</strong> Prompts indicating acute self-harm risk are immediately directed to verified 24/7 human helplines.
                  </p>
                  <p className="pt-1">
                    · <strong>Looking for CBT, ERP, ACT, or Medication Education?</strong>{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('/treatment')}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Open the Understanding Treatment Guide &amp; Clinician Checklist →
                    </button>
                  </p>
                </div>

                {/* Calm Input Area with Suggested Starter Prompts */}
                <form
                  onSubmit={handleRunAiGuide}
                  className="bg-secondary/50 border border-border rounded-2xl p-5 space-y-4 mb-6"
                >
                  <div>
                    <label
                      htmlFor="ai-task-select"
                      className="block text-sm font-semibold text-foreground mb-1.5"
                    >
                      1. Choose how you want help today:
                    </label>
                    <select
                      id="ai-task-select"
                      value={aiTask}
                      onChange={(e) => setAiTask(e.target.value as typeof aiTask)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium"
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

                  {/* Clickable Suggested Starter Prompts */}
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Suggested prompts for this mode (click to populate):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_AI_PROMPTS[aiTask].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setAiInput(suggestion)}
                          className="text-left text-xs bg-card hover:bg-secondary border border-border hover:border-primary/40 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground smooth-transition cursor-pointer"
                        >
                          &ldquo;{suggestion}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Non-Diagnostic Concern & Context Organizer */}
                  <div className="pt-2 border-t border-border/70">
                    <p className="text-xs font-semibold text-foreground mb-1.5">
                      Optional: Tag non-diagnostic contexts to include in your appointment sheet &amp; prompt:
                    </p>
                    <div
                      className="flex flex-wrap gap-1.5"
                      role="group"
                      aria-label="Non-diagnostic concern and context tags"
                    >
                      {APPOINTMENT_CONCERN_TAGS.map((tagLabel) => {
                        const isSelected = selectedConcernTags.includes(tagLabel);
                        return (
                          <button
                            key={tagLabel}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleToggleConcernTag(tagLabel)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border smooth-transition cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tagLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="ai-user-input"
                      className="block text-sm font-semibold text-foreground mb-1.5"
                    >
                      2. Describe your question or what you want to discuss with a professional:
                    </label>
                    <textarea
                      id="ai-user-input"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      rows={3}
                      maxLength={600}
                      placeholder="e.g., I have repetitive doubts about mistakes at work and trouble sleeping, and I want to know what to ask a therapist..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm"
                      required
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                      <span>
                        Do not include sensitive personal identifiers (phone numbers, addresses).
                      </span>
                      <span className="font-mono tabular-nums">{aiInput.length} / 600</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="button-primary text-sm inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      <Sparkles size={16} aria-hidden="true" />
                      {aiLoading ? 'Generating Guidance...' : 'Generate Structured Guidance'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiInput(
                          'Can you promise me 100% sure that nothing bad will happen if I do not check the lock again?'
                        )
                      }
                      className="button-secondary text-xs py-2.5 px-3.5"
                    >
                      Test OCD Anti-Reassurance Guard
                    </button>
                  </div>
                </form>

                {/* Loading State */}
                {aiLoading && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="bg-secondary border border-border rounded-2xl p-5 mb-6 flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <RefreshCw
                      size={18}
                      className="text-primary animate-spin shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      Screening safety boundaries and preparing educational guidance...
                    </span>
                  </div>
                )}

                {/* Recoverable Error State with Retry Option */}
                {aiError && (
                  <div
                    role="alert"
                    className="bg-destructive/10 border border-destructive/40 text-destructive rounded-2xl p-4 text-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <span>{aiError}</span>
                    <button
                      type="button"
                      onClick={handleRetryAiGuide}
                      disabled={aiLoading}
                      className="px-3.5 py-1.5 rounded-xl bg-card border border-destructive/40 text-destructive text-xs font-semibold hover:bg-destructive/10 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <RefreshCw size={13} aria-hidden="true" />
                      Retry Request
                    </button>
                  </div>
                )}

                {/* Conversational Message Bubbles (Session History) */}
                {aiHistory.length > 0 ? (
                  <div className="space-y-6" data-testid="ai-guide-output">
                    {aiHistory.map((turn, idx) => (
                      <div key={turn.id} className="space-y-3">
                        {/* User Prompt Bubble */}
                        <div className="flex justify-end">
                          <div className="max-w-xl bg-secondary border border-border rounded-2xl rounded-tr-sm p-4 text-sm text-foreground">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <User size={13} className="text-primary" aria-hidden="true" />
                              <span className="font-semibold text-foreground">Your Prompt</span>
                              <span>·</span>
                              <span>{turn.taskLabel}</span>
                              <span>·</span>
                              <span className="font-mono">{turn.timestamp}</span>
                            </div>
                            <p className="leading-relaxed">{turn.userPrompt}</p>
                          </div>
                        </div>

                        {/* AI Guide Response Bubble */}
                        <div className="flex justify-start">
                          <div
                            className={`w-full bg-card border rounded-2xl rounded-tl-sm p-5 md:p-6 shadow-xs space-y-3 ${
                              idx === 0 ? 'border-primary/45' : 'border-border'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                              <div className="flex items-center gap-2 text-xs">
                                <Bot size={16} className="text-primary shrink-0" aria-hidden="true" />
                                <span className="font-bold text-foreground">
                                  AI-Generated Educational Guidance
                                </span>
                                <span className="text-muted-foreground">
                                  · Non-Diagnostic · Does Not Replace Clinical Care
                                </span>
                              </div>
                              {turn.guardTriggered && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                                  <AlertTriangle size={14} aria-hidden="true" />
                                  {turn.guardTriggered === 'ocd_anti_reassurance'
                                    ? 'OCD Anti-Reassurance Safeguard'
                                    : 'Immediate Human Crisis Escalation'}
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                              {turn.aiResponse}
                            </div>

                            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                              <span>
                                Source:{' '}
                                {turn.source === 'gemini_api' || turn.source === 'gemini_server'
                                  ? 'Server-Side Gemini API (Scoped Educational Prompt · Not Doctor-Reviewed)'
                                  : 'Evidence-Informed Educational Fallback Template (Clinical review pending)'}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('breathing')}
                                  className="text-primary font-semibold hover:underline cursor-pointer"
                                >
                                  Pause with 4-7-8 Breathing →
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('grounding')}
                                  className="text-primary font-semibold hover:underline cursor-pointer"
                                >
                                  5-4-3-2-1 Grounding →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !aiLoading && (
                    <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
                      <Sparkles size={24} className="text-primary mx-auto mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Ready to help you prepare or learn
                      </p>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Select a task above or click one of the suggested prompts to organize questions for a clinician or simplify an ERP concept.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Interactive 5-4-3-2-1 Sensory Grounding (Guided Step-by-Step + Checklist Mode) */}
          {activeTab === 'grounding' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="heading-md">5-4-3-2-1 Sensory Grounding</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      When your mind races into future &ldquo;what-ifs,&rdquo; sensory grounding brings attention back to the room you are in right now.
                    </p>
                  </div>

                  {/* Mode Switcher */}
                  <div
                    role="group"
                    aria-label="Grounding exercise view mode"
                    className="inline-flex rounded-xl bg-secondary p-1 border border-border shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setGroundingMode('guided')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
                        groundingMode === 'guided'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Interactive Guided Walkthrough
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroundingMode('checklist')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
                        groundingMode === 'checklist'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All-at-Once Checklists
                    </button>
                  </div>
                </div>

                {groundingMode === 'guided' ? (
                  <div className="bg-secondary/40 border border-border rounded-2xl p-6 md:p-8 space-y-6">
                    {/* Stepper Progress Pills */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {INTERACTIVE_GROUNDING_STEPS.map((st, idx) => {
                          const isCurrent = idx === activeGroundingStepIdx;
                          const isDone = idx < activeGroundingStepIdx || Boolean(groundingNotes[idx]);
                          return (
                            <button
                              key={st.count}
                              type="button"
                              onClick={() => setActiveGroundingStepIdx(idx)}
                              className={`w-9 h-9 rounded-xl font-mono tabular-nums text-xs font-bold border smooth-transition cursor-pointer ${
                                isCurrent
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : isDone
                                  ? 'bg-secondary text-primary border-primary/40'
                                  : 'bg-card text-muted-foreground border-border'
                              }`}
                              aria-label={`Sense step ${st.count}`}
                            >
                              {st.count}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-mono tabular-nums text-primary font-semibold">
                        Step {activeGroundingStepIdx + 1} of 5
                      </span>
                    </div>

                    {/* Active Sensory Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base md:text-lg font-bold text-foreground">
                          {currentGuidedStep.sense}
                        </p>
                        <button
                          type="button"
                          onClick={() => speakGuidedInstruction(currentGuidedStep.prompt)}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 size={14} aria-hidden="true" />
                          Read Aloud
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentGuidedStep.prompt}
                      </p>

                      {/* Gentle Animated Sensory Horizon Visual with Optional Pause Control (Phase 3.H) */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <svg
                            viewBox="0 0 88 88"
                            className="w-16 h-16 shrink-0"
                            role="img"
                            aria-label={`Sensory grounding visual anchor for ${currentGuidedStep.sense}`}
                          >
                            <circle
                              cx="44"
                              cy="44"
                              r="36"
                              fill="none"
                              stroke="currentColor"
                              className="text-primary/20"
                              strokeWidth="2"
                            />
                            <circle
                              cx="44"
                              cy="44"
                              r={14 + currentGuidedStep.count * 3.5}
                              fill="currentColor"
                              className={`text-primary/15 ${
                                groundingAnimationPaused ? '' : 'animate-pulse-gentle'
                              }`}
                            />
                            <circle
                              cx="44"
                              cy="44"
                              r="14"
                              fill="#2A6F68"
                            />
                            <text
                              x="44"
                              y="49"
                              textAnchor="middle"
                              fill="#FAF7F0"
                              fontSize="13"
                              fontWeight="700"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {currentGuidedStep.count}
                            </text>
                          </svg>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p className="font-semibold text-foreground">
                              Sensory Anchor Ring ({currentGuidedStep.count} Notice{currentGuidedStep.count === 1 ? '' : 's'})
                            </p>
                            <p>
                              Take a slow breath and orient your attention to the physical environment around you—no need to rush or force thoughts away.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGroundingAnimationPaused((p) => !p)}
                          aria-pressed={groundingAnimationPaused}
                          className="px-3 py-1.5 rounded-lg border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                        >
                          {groundingAnimationPaused ? 'Resume Visual Pulse' : 'Pause Visual Pulse'}
                        </button>
                      </div>

                      <div>
                        <label
                          htmlFor="grounding-step-note"
                          className="block text-xs font-semibold text-foreground mb-1.5"
                        >
                          Optional: Type what you notice right now (stays in this session only):
                        </label>
                        <input
                          id="grounding-step-note"
                          type="text"
                          value={groundingNotes[activeGroundingStepIdx] || ''}
                          onChange={(e) =>
                            setGroundingNotes({
                              ...groundingNotes,
                              [activeGroundingStepIdx]: e.target.value,
                            })
                          }
                          placeholder={currentGuidedStep.placeholder}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm"
                        />
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={activeGroundingStepIdx === 0}
                        onClick={() =>
                          setActiveGroundingStepIdx((i) => Math.max(0, i - 1))
                        }
                        className="button-secondary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <ChevronLeft size={15} aria-hidden="true" />
                        Previous Sense
                      </button>

                      {activeGroundingStepIdx < INTERACTIVE_GROUNDING_STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveGroundingStepIdx((i) =>
                              Math.min(INTERACTIVE_GROUNDING_STEPS.length - 1, i + 1)
                            )
                          }
                          className="button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                        >
                          Next Sense ({INTERACTIVE_GROUNDING_STEPS[activeGroundingStepIdx + 1].count})
                          <ChevronRight size={15} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGroundingStepIdx(0);
                            setGroundingNotes({});
                          }}
                          className="button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                        >
                          <CheckCircle size={15} aria-hidden="true" />
                          Complete &amp; Restart Walkthrough
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCompletedGroundingSteps({})}
                        className="button-secondary text-xs py-2 px-3.5"
                      >
                        Reset Checklists
                      </button>
                    </div>
                    {groundingExercises.map((exercise, idx) => {
                      const completedCount = exercise.steps.filter(
                        (_, sIdx) => completedGroundingSteps[`${idx}-${sIdx}`]
                      ).length;
                      return (
                        <div
                          key={exercise.name}
                          className="border border-border rounded-2xl p-6 bg-secondary/40"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="font-bold text-base md:text-lg text-foreground flex items-center gap-2">
                              <Compass size={19} className="text-primary" aria-hidden="true" />
                              {exercise.name}
                            </h3>
                            <span className="text-xs font-mono tabular-nums text-primary font-semibold">
                              {completedCount} / {exercise.steps.length} completed
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            {exercise.description}
                          </p>
                          <div className="space-y-2.5">
                            {exercise.steps.map((step, stepIdx) => {
                              const key = `${idx}-${stepIdx}`;
                              const checked = Boolean(completedGroundingSteps[key]);
                              return (
                                <label
                                  key={key}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/50 smooth-transition"
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
                                    className="w-4 h-4 rounded border-border accent-primary"
                                  />
                                  <span
                                    className={`text-sm ${
                                      checked
                                        ? 'line-through text-muted-foreground'
                                        : 'text-foreground'
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Interactive Self-Compassion & ERP Uncertainty Studio */}
          {activeTab === 'affirmations' && (
            <div
              role="tabpanel"
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
            >
              <div className="max-w-3xl mx-auto space-y-10">
                {/* Interactive ERP Uncertainty Reframe Studio */}
                <div className="bg-secondary/50 border border-border rounded-2xl p-6">
                  <p className="text-xs font-semibold text-primary mb-1">
                    Interactive ERP Uncertainty Studio
                  </p>
                  <h2 className="heading-md mb-2">
                    Practice Responding to Sticky Doubts Without Reassurance
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    In OCD and anxiety care, forced positive thinking (&ldquo;Everything is 100% fine&rdquo;) often backfires by triggering another argument in your head. Select a common sticky doubt below to practice an ERP uncertainty response:
                  </p>

                  <div className="grid sm:grid-cols-3 gap-2.5 mb-5">
                    {ERP_REFRAME_SCENARIOS.map((scen) => {
                      const isSelected = scen.id === activeReframe.id;
                      return (
                        <button
                          key={scen.id}
                          type="button"
                          onClick={() => setSelectedReframeId(scen.id)}
                          className={`text-left p-3.5 rounded-xl border text-xs font-semibold smooth-transition cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                              : 'bg-card text-foreground border-border hover:border-primary/40'
                          }`}
                        >
                          {scen.stickyThought}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-destructive">Compulsive Trap to Avoid:</strong>{' '}
                      {activeReframe.compulsiveTrap}
                    </div>
                    <div className="p-4 rounded-xl bg-secondary border border-primary/35">
                      <p className="text-xs font-bold text-primary mb-1">
                        Compassionate ERP Response Script:
                      </p>
                      <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
                        &ldquo;{activeReframe.compassionateErpScript}&rdquo;
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
                      <span>
                        <strong className="text-foreground">Why this works:</strong>{' '}
                        {activeReframe.whyItWorks}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          speakGuidedInstruction(activeReframe.compassionateErpScript)
                        }
                        className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={14} aria-hidden="true" />
                        Listen to Script
                      </button>
                    </div>
                  </div>
                </div>

                {/* Core Self-Compassion Statements Grid */}
                <div>
                  <h3 className="heading-md mb-4">
                    6 Core ERP &amp; Self-Compassion Anchor Statements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {affirmations.map((item, index) => {
                      const isBookmarked = Boolean(savedFavoriteStatements[index]);
                      return (
                        <div
                          key={index}
                          className={`border rounded-2xl p-5 flex flex-col justify-between smooth-transition ${
                            isBookmarked
                              ? 'bg-secondary border-primary'
                              : 'bg-secondary/60 border-border'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-start gap-2.5">
                                <CheckCircle
                                  size={18}
                                  className="text-primary shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
                                  &ldquo;{item.statement}&rdquo;
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground pl-7 leading-relaxed mb-3">
                              {item.context}
                            </p>
                          </div>
                          <div className="pl-7 flex items-center justify-between pt-2 border-t border-border/60">
                            <button
                              type="button"
                              onClick={() =>
                                setSavedFavoriteStatements({
                                  ...savedFavoriteStatements,
                                  [index]: !isBookmarked,
                                })
                              }
                              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Heart
                                size={13}
                                className={isBookmarked ? 'fill-primary' : ''}
                                aria-hidden="true"
                              />
                              {isBookmarked ? 'Pinned for Today' : 'Pin Statement'}
                            </button>
                            <button
                              type="button"
                              onClick={() => speakGuidedInstruction(item.statement)}
                              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 size={13} aria-hidden="true" />
                              Speak
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 bg-secondary/60 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex items-start gap-4">
            <Lightbulb size={24} className="text-primary shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Using Daily Tools Without Compulsive Pressure
              </h3>
              <ul className="space-y-1.5 text-muted-foreground text-sm">
                <li>
                  · Practice breathing and grounding gently—avoid turning relaxation exercises into a rigid test to &ldquo;erase&rdquo; bad thoughts.
                </li>
                <li>
                  · All journal entries and check-ins stay private in your browser and can be exported or erased anytime.
                </li>
                <li>
                  · Looking for a therapist or public clinic?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/resources')}
                    className="text-primary font-semibold hover:underline cursor-pointer"
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
