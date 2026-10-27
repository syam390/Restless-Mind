export interface BreathingPhaseConfig {
  id: 'inhale' | 'hold' | 'exhale';
  label: string;
  instruction: string;
  durationSeconds: number;
}

export const BREATHING_PHASES: BreathingPhaseConfig[] = [
  {
    id: 'inhale',
    label: 'Breathe In',
    instruction: 'Breathe in quietly through your nose for 4 seconds',
    durationSeconds: 4,
  },
  {
    id: 'hold',
    label: 'Hold',
    instruction: 'Hold your breath gently for 7 seconds',
    durationSeconds: 7,
  },
  {
    id: 'exhale',
    label: 'Breathe Out',
    instruction: 'Exhale completely through your mouth for 8 seconds',
    durationSeconds: 8,
  },
];

export interface BreathingTimerState {
  phaseIndex: number;
  secondsRemaining: number;
  completedCycles: number;
  totalTargetCycles: number;
  isComplete: boolean;
}

export function getInitialBreathingState(totalTargetCycles = 4): BreathingTimerState {
  return {
    phaseIndex: 0,
    secondsRemaining: BREATHING_PHASES[0].durationSeconds,
    completedCycles: 0,
    totalTargetCycles,
    isComplete: false,
  };
}

export function advanceBreathingTick(state: BreathingTimerState): BreathingTimerState {
  if (state.isComplete) {
    return state;
  }

  if (state.secondsRemaining > 1) {
    return {
      ...state,
      secondsRemaining: state.secondsRemaining - 1,
    };
  }

  // Transition to next phase
  const nextPhaseIndex = (state.phaseIndex + 1) % BREATHING_PHASES.length;
  const completedCycleNow = nextPhaseIndex === 0;
  const newCompletedCycles = completedCycleNow ? state.completedCycles + 1 : state.completedCycles;

  if (newCompletedCycles >= state.totalTargetCycles) {
    return {
      phaseIndex: 0,
      secondsRemaining: BREATHING_PHASES[0].durationSeconds,
      completedCycles: newCompletedCycles,
      totalTargetCycles: state.totalTargetCycles,
      isComplete: true,
    };
  }

  return {
    ...state,
    phaseIndex: nextPhaseIndex,
    secondsRemaining: BREATHING_PHASES[nextPhaseIndex].durationSeconds,
    completedCycles: newCompletedCycles,
  };
}

export type CrisisRegionCode = 'IN' | 'US' | 'UK' | 'GLOBAL';

export interface CrisisHelpline {
  name: string;
  organization: string;
  phone: string;
  hours: string;
  languages: string;
  description: string;
  url: string;
}

export const CRISIS_DIRECTORY: Record<CrisisRegionCode, { regionName: string; emergencyNumber: string; helplines: CrisisHelpline[] }> = {
  IN: {
    regionName: 'India',
    emergencyNumber: '112',
    helplines: [
      {
        name: 'Tele-MANAS (Govt. of India)',
        organization: 'Ministry of Health & Family Welfare (MoHFW)',
        phone: '14416 / 1800-891-4416',
        hours: '24/7 Toll-Free',
        languages: '20+ Indian languages (Hindi, English, Telugu, Tamil, Bengali, etc.)',
        description: 'Official national 24/7 tele-mental health counselling and care navigation service.',
        url: 'https://telemanas.mohfw.gov.in',
      },
      {
        name: 'iCall Psychosocial Helpline',
        organization: 'Tata Institute of Social Sciences (TISS), Mumbai',
        phone: '+91 91529 87821',
        hours: 'Mon–Sat, 8:00 AM – 10:00 PM IST',
        languages: 'English, Hindi, Marathi, Gujarati, Tamil, Bengali',
        description: 'Free professional telephone and email counseling by trained mental health counselors.',
        url: 'https://icallhelpline.org',
      },
      {
        name: 'NIMHANS Psychosocial Support Helpline',
        organization: 'National Institute of Mental Health and Neurosciences, Bengaluru',
        phone: '080-4611 0007',
        hours: '24/7 Toll-Free',
        languages: 'English, Kannada, Hindi, Tamil, Telugu',
        description: 'National public mental health institute helpline for acute distress and psychiatric support.',
        url: 'https://nimhans.ac.in',
      },
    ],
  },
  US: {
    regionName: 'United States & Canada',
    emergencyNumber: '911',
    helplines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        organization: 'SAMHSA / Public Health Canada',
        phone: 'Call or Text 988',
        hours: '24/7 Free & Confidential',
        languages: 'English, Spanish',
        description: 'Free, confidential crisis support for anyone in suicidal crisis or emotional distress.',
        url: 'https://988lifeline.org',
      },
      {
        name: 'Crisis Text Line',
        organization: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        hours: '24/7',
        languages: 'English, Spanish',
        description: 'Text-based mental health support and crisis intervention.',
        url: 'https://www.crisistextline.org',
      },
    ],
  },
  UK: {
    regionName: 'United Kingdom',
    emergencyNumber: '999',
    helplines: [
      {
        name: 'NHS Mental Health Services',
        organization: 'National Health Service (NHS)',
        phone: 'Call 111 (select option 2)',
        hours: '24/7',
        languages: 'English + interpreter support',
        description: 'Urgent NHS mental health support and local crisis team connection.',
        url: 'https://www.nhs.uk/mental-health/',
      },
      {
        name: 'Samaritans',
        organization: 'Samaritans UK & Ireland',
        phone: '116 123',
        hours: '24/7 Free to call',
        languages: 'English, Welsh',
        description: 'Confidential emotional support for anyone experiencing distress or despair.',
        url: 'https://www.samaritans.org',
      },
    ],
  },
  GLOBAL: {
    regionName: 'International / Other Countries',
    emergencyNumber: '112 / Local Emergency',
    helplines: [
      {
        name: 'Find A Helpline (ThroughLine & IASP)',
        organization: 'International Association for Suicide Prevention',
        phone: 'Directory for 130+ countries',
        hours: '24/7 Online Directory',
        languages: 'Multilingual',
        description: 'Verified free, confidential support from a local crisis center in over 130 countries.',
        url: 'https://findahelpline.com',
      },
      {
        name: 'Befrienders Worldwide',
        organization: 'Befrienders Worldwide',
        phone: 'Global Emotional Support Network',
        hours: 'Varies by local center',
        languages: 'Multilingual',
        description: 'Volunteer crisis centers providing confidential support around the globe.',
        url: 'https://www.befrienders.org',
      },
    ],
  },
};

export function getCrisisResourcesByRegion(region: CrisisRegionCode) {
  return CRISIS_DIRECTORY[region] || CRISIS_DIRECTORY.IN;
}

const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|kill myself|end my life|want to die|better off dead)\b/i,
  /\b(self[- ]?harm|hurt myself|cut myself|overdose)\b/i,
  /\b(no reason to live|can'?t go on living)\b/i,
];

export function detectCrisisKeywords(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return CRISIS_PATTERNS.some((pattern) => pattern.test(input));
}

const OCD_REASSURANCE_PATTERNS = [
  /\b(promise me|guarantee|100%\s*(sure|certain)|are you sure i won'?t|prove that i didn'?t)\b/i,
  /\b(am i a bad person|am i a monster|will something bad definitely happen|tell me nothing bad will happen)\b/i,
  /\b(did i lock|did i contaminate|am i going crazy|check for me if)\b/i,
];

export interface ReassuranceCheckResult {
  isReassuranceSeeking: boolean;
  safeResponse?: string;
}

export function detectOcdReassuranceSeeking(input: string): ReassuranceCheckResult {
  if (!input || typeof input !== 'string') {
    return { isReassuranceSeeking: false };
  }

  const matched = OCD_REASSURANCE_PATTERNS.some((pattern) => pattern.test(input));
  if (!matched) {
    return { isReassuranceSeeking: false };
  }

  return {
    isReassuranceSeeking: true,
    safeResponse:
      'It sounds like your mind is asking for 100% certainty or reassurance right now. In OCD and anxiety recovery (especially Exposure and Response Prevention, or ERP), answering "Are you sure?" or "Promise nothing bad will happen?" gives only brief relief and actually makes the intrusive doubt return stronger. Instead of checking or seeking certainty together, let\'s pause: notice that this is an uncomfortable thought or uncertainty wave, allow it to be present without solving it right now, and try a 60-second grounding step.',
  };
}

export interface JournalEntryRecord {
  id: string;
  createdAt: string;
  thought: string;
  anxietyLevel: number;
  responseAction: string;
  nextStepPlan: string;
  category?: string;
}

export interface DailyCheckInRecord {
  id: string;
  createdAt: string;
  moodScore: number; // 1-5
  stressScore: number; // 1-5
  sleepHours: number;
  notes: string;
}

export function validateJournalEntry(input: {
  thought: string;
  anxietyLevel: number;
  responseAction: string;
  nextStepPlan: string;
}): { valid: boolean; error?: string } {
  const thought = input.thought?.trim() || '';
  if (thought.length < 5) {
    return { valid: false, error: 'Please describe the thought or feeling (at least 5 characters).' };
  }
  if (thought.length > 2000) {
    return { valid: false, error: 'Thought description must be under 2000 characters.' };
  }
  if (typeof input.anxietyLevel !== 'number' || input.anxietyLevel < 1 || input.anxietyLevel > 10) {
    return { valid: false, error: 'Anxiety level must be between 1 and 10.' };
  }
  return { valid: true };
}

export function validateStorySubmission(input: {
  story: string;
  anonymous: boolean;
  email?: string;
}): { valid: boolean; error?: string } {
  const story = input.story?.trim() || '';
  if (story.length < 50) {
    return { valid: false, error: 'Story must be at least 50 characters long.' };
  }
  if (story.length > 2000) {
    return { valid: false, error: 'Story must not exceed 2000 characters.' };
  }
  if (!input.anonymous) {
    const email = input.email?.trim() || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { valid: false, error: 'Please provide a valid email address when not submitting anonymously.' };
    }
  }
  return { valid: true };
}

export function validateContactSubmission(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { valid: boolean; error?: string } {
  if (!input.name?.trim()) return { valid: false, error: 'Name is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email?.trim() || '')) {
    return { valid: false, error: 'A valid email address is required.' };
  }
  if (!input.subject?.trim()) return { valid: false, error: 'Subject is required.' };
  if ((input.message?.trim() || '').length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters.' };
  }
  return { valid: true };
}

/**
 * Formats user check-ins and journal entries following the Open mHealth (Apache-2.0)
 * standard schema envelope (`omh:DataPoint:1.0`) for transparent user data portability.
 */
export function exportToOpenMHealthSchema(
  checkIns: DailyCheckInRecord[],
  journals: JournalEntryRecord[]
) {
  const dataPoints = [
    ...checkIns.map((item) => ({
      header: {
        id: item.id,
        creation_date_time: item.createdAt,
        schema_id: {
          namespace: 'omh',
          name: 'mental-wellbeing-checkin',
          version: '1.0',
        },
        acquisition_provenance: {
          source_name: 'Restless Mind Self-Report',
          modality: 'self-reported',
        },
      },
      body: {
        effective_time_frame: {
          date_time: item.createdAt,
        },
        mood_score: {
          value: item.moodScore,
          unit: 'scale_1_to_5',
        },
        perceived_stress_score: {
          value: item.stressScore,
          unit: 'scale_1_to_5',
        },
        sleep_duration: {
          value: item.sleepHours,
          unit: 'h',
        },
        user_notes: item.notes,
      },
    })),
    ...journals.map((entry) => ({
      header: {
        id: entry.id,
        creation_date_time: entry.createdAt,
        schema_id: {
          namespace: 'omh',
          name: 'thought-reflection-record',
          version: '1.0',
        },
        acquisition_provenance: {
          source_name: 'Restless Mind Thought Journal',
          modality: 'self-reported',
        },
      },
      body: {
        effective_time_frame: {
          date_time: entry.createdAt,
        },
        subjective_units_of_distress: {
          value: entry.anxietyLevel,
          unit: 'suds_1_to_10',
        },
        thought_observation: entry.thought,
        behavioral_response: entry.responseAction,
        erp_next_step_plan: entry.nextStepPlan,
      },
    })),
  ];

  return {
    export_format: 'Open mHealth Compatible JSON (Apache-2.0 Schema Standard)',
    exported_at: new Date().toISOString(),
    record_count: dataPoints.length,
    data_points: dataPoints,
  };
}

/**
 * Redacts accidental email addresses and phone numbers from user-submitted stories
 * to prevent unintentional public disclosure of PII.
 */
export function sanitizeStoryText(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email redacted for privacy]')
    .replace(/(?:\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){9,12}\d/g, '[phone redacted for privacy]')
    .trim();
}

export function maskEmailAddress(email: string): string {
  const clean = (email || '').trim();
  const parts = clean.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return 'anonymous';
  const name = parts[0];
  const maskedName = name.length <= 2 ? `${name[0]}*` : `${name[0]}***${name[name.length - 1]}`;
  return `${maskedName}@${parts[1]}`;
}

export function formatAppointmentSummaryText(params: {
  checkIns: DailyCheckInRecord[];
  journals: JournalEntryRecord[];
  userNotes: string;
  aiQuestions: string;
}): string {
  const { checkIns, journals, userNotes, aiQuestions } = params;
  const avgMood =
    checkIns.length > 0
      ? (checkIns.reduce((acc, c) => acc + c.moodScore, 0) / checkIns.length).toFixed(1)
      : 'N/A';
  const avgStress =
    checkIns.length > 0
      ? (checkIns.reduce((acc, c) => acc + c.stressScore, 0) / checkIns.length).toFixed(1)
      : 'N/A';
  const avgSleep =
    checkIns.length > 0
      ? (checkIns.reduce((acc, c) => acc + c.sleepHours, 0) / checkIns.length).toFixed(1)
      : 'N/A';

  return [
    '==========================================================',
    'RESTLESS MIND — CLINICIAN APPOINTMENT PREPARATION SUMMARY',
    '==========================================================',
    `Generated Date: ${new Date().toISOString().slice(0, 10)}`,
    'Scope Note: Self-reported non-diagnostic summary prepared by the user.',
    '',
    '1. RECENT WELLBEING CHECK-IN AVERAGES (Self-Reported)',
    `   - Total Check-Ins Logged: ${checkIns.length}`,
    `   - Average Mood (1-5 scale): ${avgMood}`,
    `   - Average Stress/Overwhelm (1-5 scale): ${avgStress}`,
    `   - Average Sleep Duration: ${avgSleep} hours/night`,
    `   - Total Thought Journal Observations Logged: ${journals.length}`,
    '',
    '2. USER CONTEXT & EXPERIENCES TO DISCUSS',
    `   ${userNotes.trim() || 'No specific context entered.'}`,
    '',
    '3. QUESTIONS & DISCUSSION POINTS FOR MY CLINICIAN',
    aiQuestions.trim() || '   - What evidence-based options (such as ERP or CBT) fit my experiences?',
    '',
    '==========================================================',
  ].join('\n');
}

export interface ErpSimulationPoint {
  minute: number;
  distress: number; // 0 to 10 scale
  svgX: number; // 40 to 560
  svgY: number; // 25 to 195
  annotation?: string;
}

export interface ErpSimulationResult {
  mode: 'compulsion_loop' | 'erp_habituation';
  sessionNumber: number;
  peakDistress: number;
  endingDistress: number;
  minutesToSettle: number;
  points: ErpSimulationPoint[];
  svgPathD: string;
  svgAreaD: string;
  clinicalTakeaway: string;
}

/**
 * Pure mathematical model of the OCD Compulsion Reassurance Loop vs.
 * Exposure and Response Prevention (ERP) habituation & inhibitory learning across sessions 1-5.
 */
export function computeErpHabituationCurve(
  exposureSession: number,
  mode: 'compulsion_loop' | 'erp_habituation'
): ErpSimulationResult {
  const session = Math.min(5, Math.max(1, Math.round(exposureSession)));
  const minutes = [0, 5, 10, 15, 20, 30, 45, 60];

  const rawDistress: number[] =
    mode === 'compulsion_loop'
      ? // Compulsion loop: spike -> brief drop after ritual -> rebound spike -> ritual -> chronic baseline
        [2.5, 8.8, 3.0, 8.5, 3.2, 8.9, 3.5, 8.4]
      : // ERP Habituation: initial peak decreases and settles faster with each practice session (1..5)
        (() => {
          const peak = Number(Math.max(4.2, 9.2 - (session - 1) * 1.15).toFixed(1));
          const mid15 = Number(Math.max(3.2, peak - (0.9 + session * 0.35)).toFixed(1));
          const mid20 = Number(Math.max(2.6, mid15 - (0.8 + session * 0.25)).toFixed(1));
          const mid30 = Number(Math.max(2.0, mid20 - 1.1).toFixed(1));
          const mid45 = Number(Math.max(1.5, mid30 - 0.8).toFixed(1));
          const end60 = Number(Math.max(1.2, mid45 - 0.4).toFixed(1));
          return [2.2, peak * 0.88, peak, mid15, mid20, mid30, mid45, end60];
        })();

  const points: ErpSimulationPoint[] = minutes.map((min, idx) => {
    const d = Number(rawDistress[idx].toFixed(1));
    const svgX = Math.round(45 + (min / 60) * 510);
    const svgY = Math.round(195 - (d / 10) * 165);
    let annotation: string | undefined;
    if (mode === 'compulsion_loop') {
      if (idx === 1) annotation = 'Trigger spikes urge';
      if (idx === 2) annotation = 'Brief ritual relief';
      if (idx === 5) annotation = 'Doubt rebounds ("Did I check?")';
    } else {
      if (idx === 2) annotation = `Session ${session} peak (${d}/10) — pause ritual`;
      if (idx === 5) annotation = 'Nervous system habituates naturally';
    }
    return { minute: min, distress: d, svgX, svgY, annotation };
  });

  const svgPathD = points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.svgX} ${pt.svgY}`)
    .join(' ');
  const svgAreaD = `${svgPathD} L ${points[points.length - 1].svgX} 195 L ${points[0].svgX} 195 Z`;

  const peakDistress = Math.max(...points.map((p) => p.distress));
  const endingDistress = points[points.length - 1].distress;
  const minutesToSettle =
    mode === 'compulsion_loop' ? 60 : Math.max(15, 50 - (session - 1) * 8);

  const clinicalTakeaway =
    mode === 'compulsion_loop'
      ? 'Performing a compulsion or asking for reassurance drops anxiety for a few minutes, but teaches the brain that the intrusive thought was a real threat—causing the spike to return.'
      : session === 1
      ? 'In ERP Session 1, pausing the compulsion feels uncomfortable at first, but distress reaches a natural ceiling and begins to subside on its own without a ritual.'
      : `By ERP Session ${session}, your brain begins inhibitory learning: the initial alarm peaks lower (${peakDistress}/10) and settles in ~${minutesToSettle} minutes without checking.`;

  return {
    mode,
    sessionNumber: session,
    peakDistress,
    endingDistress,
    minutesToSettle,
    points,
    svgPathD,
    svgAreaD,
    clinicalTakeaway,
  };
}

export interface PersonalWellbeingInsights {
  hasUserData: boolean;
  totalCheckIns: number;
  totalJournals: number;
  periodLabel: string;
  avgMood: number | null;
  avgStress: number | null;
  avgSleep: number | null;
  avgJournalDistress: number | null;
  latestJournalDistress: number | null;
  observationSummary: string;
}

/**
 * Computes genuine personal insights strictly from actual user-logged check-ins and journals.
 * Never fabricates streaks, diagnostic scores, or synthetic statistics when arrays are empty.
 */
export function computePersonalWellbeingInsights(
  checkIns: DailyCheckInRecord[],
  journals: JournalEntryRecord[]
): PersonalWellbeingInsights {
  const totalCheckIns = checkIns.length;
  const totalJournals = journals.length;
  const hasUserData = totalCheckIns > 0 || totalJournals > 0;

  if (!hasUserData) {
    return {
      hasUserData: false,
      totalCheckIns: 0,
      totalJournals: 0,
      periodLabel: 'No entries logged',
      avgMood: null,
      avgStress: null,
      avgSleep: null,
      avgJournalDistress: null,
      latestJournalDistress: null,
      observationSummary:
        'Log a daily check-in or thought reflection to view your private, on-device wellbeing patterns.',
    };
  }

  const allTimestamps = [
    ...checkIns.map((c) => new Date(c.createdAt).getTime()),
    ...journals.map((j) => new Date(j.createdAt).getTime()),
  ].filter((t) => !Number.isNaN(t));

  let periodLabel = `Sample: n = ${totalCheckIns} check-in${totalCheckIns === 1 ? '' : 's'}, ${totalJournals} reflection${totalJournals === 1 ? '' : 's'}`;
  if (allTimestamps.length > 0) {
    const earliest = new Date(Math.min(...allTimestamps)).toISOString().slice(0, 10);
    const latest = new Date(Math.max(...allTimestamps)).toISOString().slice(0, 10);
    const rangeStr = earliest === latest ? earliest : `${earliest} to ${latest}`;
    periodLabel = `Period: ${rangeStr} · Sample: n = ${totalCheckIns} check-in${totalCheckIns === 1 ? '' : 's'}, ${totalJournals} reflection${totalJournals === 1 ? '' : 's'}`;
  }

  const avgMood =
    totalCheckIns > 0
      ? Number((checkIns.reduce((s, c) => s + c.moodScore, 0) / totalCheckIns).toFixed(1))
      : null;
  const avgStress =
    totalCheckIns > 0
      ? Number((checkIns.reduce((s, c) => s + c.stressScore, 0) / totalCheckIns).toFixed(1))
      : null;
  const avgSleep =
    totalCheckIns > 0
      ? Number((checkIns.reduce((s, c) => s + c.sleepHours, 0) / totalCheckIns).toFixed(1))
      : null;
  const avgJournalDistress =
    totalJournals > 0
      ? Number((journals.reduce((s, j) => s + j.anxietyLevel, 0) / totalJournals).toFixed(1))
      : null;
  const latestJournalDistress = totalJournals > 0 ? journals[0].anxietyLevel : null;

  const notes: string[] = [];
  if (avgSleep !== null && avgStress !== null) {
    if (avgSleep < 6.5 && avgStress >= 3.5) {
      notes.push(
        `Your recent self-reported logs (n = ${totalCheckIns}) show shorter average sleep (${avgSleep}h) alongside elevated stress (${avgStress}/5). Shorter rest can sometimes make intrusive doubts feel louder.`
      );
    } else {
      notes.push(
        `Across ${totalCheckIns} self-reported check-in${totalCheckIns === 1 ? '' : 's'}, your average sleep is ${avgSleep}h with an average mood of ${avgMood}/5.`
      );
    }
  }
  if (avgJournalDistress !== null) {
    notes.push(
      `You have recorded ${totalJournals} ERP reflection${totalJournals === 1 ? '' : 's'} with an average self-rated urge intensity of ${avgJournalDistress}/10 (non-diagnostic personal observation).`
    );
  }

  return {
    hasUserData: true,
    totalCheckIns,
    totalJournals,
    periodLabel,
    avgMood,
    avgStress,
    avgSleep,
    avgJournalDistress,
    latestJournalDistress,
    observationSummary: notes.join(' '),
  };
}


