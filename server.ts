import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  detectCrisisKeywords,
  detectOcdReassuranceSeeking,
  getCrisisResourcesByRegion,
  validateStorySubmission,
  validateContactSubmission,
  sanitizeStoryText,
  maskEmailAddress,
  CrisisRegionCode,
} from './src/lib/wellbeingLogic.ts';
import { INITIAL_COMMUNITY_STORIES, StoryItem } from './src/data/restlessMindData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));

// Security headers (preserving iframe embedding compatibility for AI Studio preview)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Durable file-backed store with graceful fallback for read-only container environments
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'runtime-store.json');

interface StoredStoryRecord extends StoryItem {
  deletionTokenHash: string;
  createdAt: string;
}

interface StoredContactReceipt {
  id: string;
  createdAt: string;
  subject: string;
  maskedEmail: string;
  messageLength: number;
  status: 'queued_in_prototype';
}

interface RuntimeStoreData {
  submittedStories: StoredStoryRecord[];
  contactReceipts: StoredContactReceipt[];
}

function loadStore(): RuntimeStoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        submittedStories: Array.isArray(parsed.submittedStories) ? parsed.submittedStories : [],
        contactReceipts: Array.isArray(parsed.contactReceipts) ? parsed.contactReceipts : [],
      };
    }
  } catch {
    // Fallback to empty store
  }
  return { submittedStories: [], contactReceipts: [] };
}

function saveStore(store: RuntimeStoreData): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

const runtimeStore: RuntimeStoreData = loadStore();

// Simple in-memory rate limiter per IP (privacy-preserving: no payload logging)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, maxRequests = 25, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 10 && key !== 'MY_GEMINI_API_KEY');
}

function getGenAIClient(): GoogleGenAI | null {
  if (!isGeminiConfigured()) return null;
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: isGeminiConfigured(),
    mode: isGeminiConfigured() ? 'live_gemini_server' : 'deterministic_evidence_fallback',
    persistenceMode: 'file_and_memory_store',
    storiesCount: runtimeStore.submittedStories.length + INITIAL_COMMUNITY_STORIES.length,
  });
});

app.get('/api/stories', (_req, res) => {
  const publicSubmitted: StoryItem[] = runtimeStore.submittedStories.map(
    ({ deletionTokenHash: _hidden, ...publicStory }) => publicStory
  );
  res.json({
    stories: [...publicSubmitted, ...INITIAL_COMMUNITY_STORIES],
  });
});

app.post('/api/stories', (req, res) => {
  const ip = req.ip || 'local';
  if (!checkRateLimit(ip, 12)) {
    res.status(429).json({ error: 'Rate limit exceeded. Please wait a few minutes before submitting again.' });
    return;
  }

  const { story, anonymous = true, email = '', category = 'Community Reflection' } = req.body || {};
  const validation = validateStorySubmission({ story, anonymous: Boolean(anonymous), email });
  if (!validation.valid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  if (detectCrisisKeywords(story)) {
    res.status(422).json({
      error:
        'Your submission contains language suggesting acute distress or self-harm. For your safety, we have not posted this publicly. Please reach out to Tele-MANAS (14416), iCall (+91 91529 87821), or 988 immediately.',
      isCrisisAlert: true,
    });
    return;
  }

  const cleanQuote = sanitizeStoryText(String(story));
  const rawDeletionToken = crypto.randomBytes(16).toString('hex');
  const storyId = `story-${Date.now()}`;

  const storedRecord: StoredStoryRecord = {
    id: storyId,
    quote: cleanQuote,
    author: anonymous ? 'Anonymous (Pending Safety Review)' : 'Community Member (Pending Safety Review)',
    highlight: 'Submitted in this environment — queued for human moderator safety review before public listing.',
    category: String(category).slice(0, 40) || 'Community Reflection',
    status: 'pending_moderation',
    createdAt: new Date().toISOString(),
    deletionTokenHash: hashToken(rawDeletionToken),
  };

  runtimeStore.submittedStories.unshift(storedRecord);
  saveStore(runtimeStore);

  const { deletionTokenHash: _hidden, ...publicStory } = storedRecord;
  res.status(201).json({
    message: 'Story sanitized for PII, received, and saved in the moderation queue.',
    story: publicStory,
    deletionToken: rawDeletionToken,
  });
});

app.delete('/api/stories/:id', (req, res) => {
  const { id } = req.params;
  const token = String(req.headers['x-deletion-token'] || '');
  if (!token) {
    res.status(401).json({ error: 'Deletion token required to remove your submitted story.' });
    return;
  }

  const index = runtimeStore.submittedStories.findIndex((s) => s.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Submitted story not found.' });
    return;
  }

  const storedHash = runtimeStore.submittedStories[index].deletionTokenHash;
  const providedHash = hashToken(token);
  if (
    !/^[a-f0-9]{64}$/i.test(storedHash) ||
    !crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(providedHash, 'hex')
    )
  ) {
    res.status(403).json({ error: 'Invalid deletion token for this story.' });
    return;
  }

  runtimeStore.submittedStories.splice(index, 1);
  saveStore(runtimeStore);
  res.json({ deleted: true, id });
});

app.post('/api/contact', (req, res) => {
  const ip = req.ip || 'local';
  if (!checkRateLimit(ip, 15)) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const { name = '', email = '', subject = '', message = '' } = req.body || {};
  const validation = validateContactSubmission({ name, email, subject, message });
  if (!validation.valid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  if (detectCrisisKeywords(message) || detectCrisisKeywords(subject)) {
    res.status(422).json({
      error:
        'This contact form is not monitored 24/7 for emergencies. Please call Tele-MANAS (14416), iCall (+91 91529 87821), 112, or 988 immediately for live human support.',
      isCrisisAlert: true,
    });
    return;
  }

  const receiptId = `RM-${Date.now().toString().slice(-6)}`;
  const receiptRecord: StoredContactReceipt = {
    id: receiptId,
    createdAt: new Date().toISOString(),
    subject: String(subject).trim().slice(0, 80),
    maskedEmail: maskEmailAddress(String(email)),
    messageLength: String(message).trim().length,
    status: 'queued_in_prototype',
  };

  runtimeStore.contactReceipts.unshift(receiptRecord);
  saveStore(runtimeStore);

  res.status(201).json({
    receiptId,
    createdAt: receiptRecord.createdAt,
    maskedEmail: receiptRecord.maskedEmail,
    subject: receiptRecord.subject,
    prototypeNotice:
      'Saved with PII-masked receipt in the server store. Note: No external SMTP email relay or live clinical team is connected in this demo environment.',
  });
});


function isAuthorizedModerator(providedToken: string): boolean {
  const expectedToken = process.env.RESTLESS_MIND_MODERATION_TOKEN;
  if (!expectedToken || expectedToken.length < 32 || !providedToken) {
    return false;
  }
  const expected = Buffer.from(expectedToken, 'utf8');
  const provided = Buffer.from(providedToken, 'utf8');
  if (expected.length !== provided.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, provided);
}
app.get('/api/admin/stories', (req, res) => {
  if (!isAuthorizedModerator(String(req.headers['x-moderation-token'] || ''))) {
    res.status(401).json({ error: 'Unauthorized moderator.' });
    return;
  }
  const pending = runtimeStore.submittedStories
    .filter((story) => story.status === 'pending_moderation')
    .map(({ deletionTokenHash: _hidden, ...story }) => story);
  res.json({ stories: pending });
});
app.post('/api/admin/stories/:id/moderation', (req, res) => {
  if (!isAuthorizedModerator(String(req.headers['x-moderation-token'] || ''))) {
    res.status(401).json({ error: 'Unauthorized moderator.' });
    return;
  }
  const action = req.body?.action;
  if (action !== 'approve' && action !== 'reject') {
    res.status(400).json({ error: 'Action must be approve or reject.' });
    return;
  }
  const story = runtimeStore.submittedStories.find(
    (item) => item.id === req.params.id
  );
  if (!story) {
    res.status(404).json({ error: 'Submitted story not found.' });
    return;
  }
  if (story.status !== 'pending_moderation') {
    res.status(409).json({ error: 'Only pending stories can be moderated.' });
    return;
  }
  const previousStatus = story.status;
  if (action === 'reject') {
    runtimeStore.submittedStories = runtimeStore.submittedStories.filter(
      (item) => item.id !== story.id
    );
    try {
      saveStore(runtimeStore);
    } catch {
      runtimeStore.submittedStories.push(story);
      res.status(500).json({ error: 'Could not save moderation decision.' });
      return;
    }
    res.json({ success: true, id: story.id, status: 'rejected' });
    return;
  }
  story.status = 'published';
  try {
    saveStore(runtimeStore);
  } catch {
    story.status = previousStatus;
    res.status(500).json({ error: 'Could not save moderation decision.' });
    return;
  }
  res.json({ success: true, id: story.id, status: story.status });
});type AiGuideTask = 'simplify_concept' | 'prepare_doctor_questions' | 'reflection_prompt' | 'support_navigation';

function buildDeterministicEducationalResponse(task: AiGuideTask, userInput: string): string {
  const cleanTopic = userInput.trim();
  if (task === 'prepare_doctor_questions') {
    return [
      'Here are structured, non-diagnostic questions you can bring to a psychologist, psychiatrist, or general physician:',
      '1. "Here are the main patterns I have noticed over the past few weeks (thoughts, physical feelings, and sleep changes). What evidence-based options fit these experiences?"',
      '2. "Could OCD-specific Cognitive Behavioural Therapy (CBT) with Exposure and Response Prevention (ERP) be appropriate for the repetitive doubts or checking behaviors I described?"',
      '3. "What are the expected benefits, limitations, and follow-up plans for any therapy or medication options we discuss?"',
      '4. "What small, manageable steps can I safely practice between sessions without overwhelming myself?"',
      '',
      'Further reading: Visit the "Understanding Treatment" (/treatment) guide on Restless Mind to compare CBT, ERP, ACT, and medication classes before your visit.',
      'Note: Prepared using evidence-informed educational templates (clinical review pending; non-diagnostic; not medical advice).',
    ].join('\n');
  }

  if (task === 'reflection_prompt') {
    return [
      'Gentle Non-Diagnostic Reflection Prompts (ERP & ACT Informed):',
      '• Notice & Name: "Right now, I notice my mind is offering the thought that ____. Can I view this as a passing mental event rather than a fact?"',
      '• Compulsion Pause: "What action or reassurance is anxiety urging me to do right now to feel 100% certain? What happens if I pause and allow uncertainty for 2 minutes?"',
      '• Values Compass: "If this anxious wave were quieter, what small, meaningful activity would I want to give my attention to next?"',
      '',
      'Note: Do not use reflection to argue with or analyze intrusive thoughts. Educational support only; not a substitute for clinical therapy.',
    ].join('\n');
  }

  if (task === 'support_navigation') {
    return [
      'Suggested Next Steps Within Restless Mind:',
      '• If your body feels tense or racing right now: Visit Daily Tools → 4-7-8 Breathing or 5-4-3-2-1 Grounding.',
      '• If you want to learn about CBT, ERP, ACT, SSRIs, or specialist care: Visit Understanding Treatment (/treatment) for our interactive treatment explorer and reference library.',
      '• If you are ready to talk to a professional in India: Call Tele-MANAS (14416, 24/7 free) or iCall (+91 91529 87821), or review public institutes like NIMHANS on the Find Help (/resources) page.',
    ].join('\n');
  }

  return [
    `Plain-Language Educational Summary (${cleanTopic.slice(0, 60) || 'Mental Wellbeing'}):`,
    '• Thoughts are not actions: Having an unwanted or distressing intrusive thought does not reflect your character or intentions.',
    '• Why rituals backfire: Checking, washing, or asking for reassurance lowers anxiety briefly, which reinforces the alarm cycle.',
    '• Evidence-based care: Psychological therapies such as CBT with Exposure and Response Prevention (ERP) and clinician-prescribed medicines (such as SSRIs when indicated) are established treatments for OCD.',
    '• Explore in depth: Visit the Understanding Treatment (/treatment) page to review CBT, ERP, ACT, medication safety, and verified clinical references (NICE CG31, NHS, IOCDF).',
    '',
    'Reminder: This explanation is for general educational clarity only (clinical review pending) and does not diagnose any condition or recommend a specific medicine or dose.',
  ].join('\n');
}

app.post('/api/ai/guide', async (req, res) => {
  const ip = req.ip || 'local';
  if (!checkRateLimit(ip, 20)) {
    res.status(429).json({
      error: 'Usage limit reached (20 requests per 15 minutes). Please take a gentle breath and try again shortly.',
    });
    return;
  }

  const {
    task = 'simplify_concept',
    userInput = '',
    region = 'IN',
  }: { task?: AiGuideTask; userInput?: string; region?: CrisisRegionCode } = req.body || {};

  const trimmed = String(userInput || '').trim();
  if (trimmed.length < 4 || trimmed.length > 600) {
    res.status(400).json({
      error: 'Please enter a brief question or topic between 4 and 600 characters.',
    });
    return;
  }

  // 1. Deterministic Human-Safety Crisis Pre-Check (Never rely solely on AI for crisis risk)
  if (detectCrisisKeywords(trimmed)) {
    const crisisInfo = getCrisisResourcesByRegion(region);
    res.json({
      guardTriggered: 'crisis_escalation',
      source: 'deterministic_safety_guard',
      response: `Immediate Human Support Priority: It sounds like you may be going through a very difficult or unsafe moment. Automated tools cannot assess safety or replace human care. Please reach out right now to ${crisisInfo.regionName} Emergency (${crisisInfo.emergencyNumber}) or ${crisisInfo.helplines.map((h) => `${h.name} (${h.phone})`).join(' / ')}.`,
      helplines: crisisInfo.helplines,
    });
    return;
  }

  // 2. Deterministic OCD Anti-Reassurance Pre-Check (Prevent reinforcing compulsions)
  const reassuranceCheck = detectOcdReassuranceSeeking(trimmed);
  if (reassuranceCheck.isReassuranceSeeking) {
    res.json({
      guardTriggered: 'ocd_anti_reassurance',
      source: 'deterministic_erp_guard',
      response: reassuranceCheck.safeResponse,
    });
    return;
  }

  // 3. Server-Side Gemini Call (or transparent deterministic fallback if GEMINI_API_KEY is unconfigured)
  const ai = getGenAIClient();
  if (!ai) {
    res.json({
      guardTriggered: null,
      source: 'curated_template_fallback',
      response: buildDeterministicEducationalResponse(task, trimmed),
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Task type: ${task}\nUser topic or context: ${trimmed}`,
      config: {
        temperature: 0.3,
        systemInstruction: [
          'You are the scoped Educational & Care-Navigation Assistant for Restless Mind, an evidence-informed mental-wellbeing education platform.',
          'STRICT CLINICAL & SAFETY BOUNDARIES:',
          '1. NEVER diagnose any condition (OCD, anxiety disorders, ADHD, autism, depression, PCOS/PCOD) or act as a therapist or clinician.',
          '2. NEVER select medications, recommend specific dosages or titrations, advise starting/stopping/combining medicines, or make personalized treatment recommendations.',
          '3. NEVER provide compulsive reassurance, certainty guarantees ("I promise nothing bad will happen"), or endless symptom analysis. If the user seeks reassurance for an intrusive thought, gently explain how reassurance reinforces the OCD cycle and suggest a brief grounding step.',
          '4. NEVER represent generated responses as doctor-reviewed or medically verified.',
          '5. When users ask general questions about CBT, ERP, ACT, SSRIs, clomipramine, or specialist care, refer them to the Restless Mind "Understanding Treatment" (/treatment) page and encourage discussion with a qualified clinician.',
          '6. Keep language warm, plain, non-stigmatizing, and concise (under 160 words, using clear bullet points). Always end with a brief reminder that this is educational support, not individual medical advice.',
        ].join('\n'),
      },
    });

    const text = response.text?.trim() || buildDeterministicEducationalResponse(task, trimmed);
    res.json({
      guardTriggered: null,
      source: 'gemini_server',
      response: text,
    });
  } catch {
    res.json({
      guardTriggered: null,
      source: 'curated_template_fallback',
      response: buildDeterministicEducationalResponse(task, trimmed),
    });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Restless Mind server listening on http://localhost:${PORT}`);
  });
}

startServer();
