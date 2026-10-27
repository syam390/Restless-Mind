import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialBreathingState,
  advanceBreathingTick,
  detectCrisisKeywords,
  detectOcdReassuranceSeeking,
  getCrisisResourcesByRegion,
  validateJournalEntry,
  validateStorySubmission,
  validateContactSubmission,
  exportToOpenMHealthSchema,
  sanitizeStoryText,
  maskEmailAddress,
  formatAppointmentSummaryText,
  computeErpHabituationCurve,
  computePersonalWellbeingInsights,
} from './wellbeingLogic';
import {
  TREATMENT_SOURCES_REGISTRY,
  TREATMENT_ENTRIES,
  CBT_FIVE_PART_NODES,
  ERP_LEARNING_STAGES,
  TREATMENT_JOURNEY_STAGES,
  APPOINTMENT_QUESTION_CHECKLIST,
  validateTreatmentDataIntegrity,
} from '../data/treatmentEducationData';

test('4-7-8 breathing timer progresses accurately across 4s inhale, 7s hold, 8s exhale', () => {
  let state = getInitialBreathingState(2);
  assert.equal(state.phaseIndex, 0);
  assert.equal(state.secondsRemaining, 4);

  // Tick 3 seconds in Inhale
  state = advanceBreathingTick(state);
  state = advanceBreathingTick(state);
  state = advanceBreathingTick(state);
  assert.equal(state.phaseIndex, 0);
  assert.equal(state.secondsRemaining, 1);

  // 4th tick transitions to Hold (7s)
  state = advanceBreathingTick(state);
  assert.equal(state.phaseIndex, 1);
  assert.equal(state.secondsRemaining, 7);

  // Advance 7 ticks to transition to Exhale (8s)
  for (let i = 0; i < 7; i++) {
    state = advanceBreathingTick(state);
  }
  assert.equal(state.phaseIndex, 2);
  assert.equal(state.secondsRemaining, 8);

  // Advance 8 ticks to complete Cycle 1
  for (let i = 0; i < 8; i++) {
    state = advanceBreathingTick(state);
  }
  assert.equal(state.completedCycles, 1);
  assert.equal(state.phaseIndex, 0);
  assert.equal(state.isComplete, false);
});

test('Crisis keyword detector identifies acute self-harm phrases without false positives', () => {
  assert.equal(detectCrisisKeywords('I feel like I want to end my life tonight'), true);
  assert.equal(detectCrisisKeywords('Having thoughts of self-harm right now'), true);
  assert.equal(detectCrisisKeywords('I keep checking the door lock three times before work'), false);
});

test('OCD reassurance-seeking guard intercepts compulsive certainty requests', () => {
  const reassurance = detectOcdReassuranceSeeking(
    'Can you promise me 100% sure that nothing bad will happen if I do not wash my hands again?'
  );
  assert.equal(reassurance.isReassuranceSeeking, true);
  assert.ok(reassurance.safeResponse?.includes('Exposure and Response Prevention'));

  const educational = detectOcdReassuranceSeeking('How does ERP therapy help with checking compulsions?');
  assert.equal(educational.isReassuranceSeeking, false);
});

test('Location-aware crisis directory returns verified Tele-MANAS and iCall numbers for India', () => {
  const india = getCrisisResourcesByRegion('IN');
  assert.equal(india.emergencyNumber, '112');
  const teleManas = india.helplines.find((h) => h.name.includes('Tele-MANAS'));
  const iCall = india.helplines.find((h) => h.name.includes('iCall'));
  assert.ok(teleManas?.phone.includes('14416'));
  assert.equal(iCall?.phone, '+91 91529 87821');
});

test('Validation helpers enforce character limits and Open mHealth export formats data points', () => {
  assert.equal(
    validateJournalEntry({ thought: 'Too', anxietyLevel: 5, responseAction: '', nextStepPlan: '' }).valid,
    false
  );
  assert.equal(
    validateJournalEntry({
      thought: 'Intrusive worry about leaving the stove on',
      anxietyLevel: 7,
      responseAction: 'Waited 5 minutes before checking',
      nextStepPlan: 'Delay checking by 10 minutes tomorrow',
    }).valid,
    true
  );

  assert.equal(validateStorySubmission({ story: 'Short story', anonymous: true }).valid, false);
  assert.equal(
    validateContactSubmission({
      name: 'Aarav',
      email: 'aarav@example.com',
      subject: 'Volunteer Inquiry',
      message: 'I would love to help translate OCD guides into Hindi.',
    }).valid,
    true
  );

  const omh = exportToOpenMHealthSchema(
    [
      {
        id: 'ci-1',
        createdAt: '2026-10-26T10:00:00.000Z',
        moodScore: 4,
        stressScore: 2,
        sleepHours: 7.5,
        notes: 'Rested well',
      },
    ],
    []
  );
  assert.equal(omh.record_count, 1);
  assert.equal(omh.data_points[0].header.schema_id.namespace, 'omh');
});

test('PII sanitizer redacts emails and phone numbers from story text and masks contact emails', () => {
  const raw =
    'ERP helped me recover! Reach me at rahul.sharma@gmail.com or call +91 98765 43210 if you want to chat.';
  const sanitized = sanitizeStoryText(raw);
  assert.equal(sanitized.includes('rahul.sharma@gmail.com'), false);
  assert.equal(sanitized.includes('98765 43210'), false);
  assert.ok(sanitized.includes('[email redacted for privacy]'));
  assert.ok(sanitized.includes('[phone redacted for privacy]'));

  assert.equal(maskEmailAddress('syam@example.org'), 's***m@example.org');
});

test('Appointment summary formatter aggregates check-ins and questions accurately', () => {
  const summary = formatAppointmentSummaryText({
    checkIns: [
      { id: '1', createdAt: '2026-10-25T00:00:00Z', moodScore: 3, stressScore: 4, sleepHours: 6, notes: '' },
      { id: '2', createdAt: '2026-10-26T00:00:00Z', moodScore: 5, stressScore: 2, sleepHours: 8, notes: '' },
    ],
    journals: [],
    userNotes: 'Repetitive checking before leaving home.',
    aiQuestions: '1. Does ERP fit my checking patterns?',
  });

  assert.ok(summary.includes('Average Mood (1-5 scale): 4.0'));
  assert.ok(summary.includes('Average Stress/Overwhelm (1-5 scale): 3.0'));
  assert.ok(summary.includes('Average Sleep Duration: 7.0 hours/night'));
  assert.ok(summary.includes('Repetitive checking before leaving home.'));
});

test('ERP habituation simulator curve lowers peak distress and settling time across sessions 1 to 5', () => {
  const compulsion = computeErpHabituationCurve(1, 'compulsion_loop');
  const erpSession1 = computeErpHabituationCurve(1, 'erp_habituation');
  const erpSession5 = computeErpHabituationCurve(5, 'erp_habituation');

  assert.ok(compulsion.endingDistress > erpSession1.endingDistress);
  assert.ok(erpSession5.peakDistress < erpSession1.peakDistress);
  assert.ok(erpSession5.minutesToSettle < erpSession1.minutesToSettle);
  assert.equal(erpSession5.points.length, 8);
});

test('Personal wellbeing insights returns empty state when no user data exists and real averages with period/sample metadata when logged', () => {
  const empty = computePersonalWellbeingInsights([], []);
  assert.equal(empty.hasUserData, false);
  assert.equal(empty.avgMood, null);
  assert.equal(empty.periodLabel, 'No entries logged');

  const active = computePersonalWellbeingInsights(
    [
      { id: '1', createdAt: '2026-10-25T00:00:00Z', moodScore: 2, stressScore: 4, sleepHours: 5.5, notes: '' },
      { id: '2', createdAt: '2026-10-26T00:00:00Z', moodScore: 4, stressScore: 4, sleepHours: 6.0, notes: '' },
    ],
    [
      {
        id: 'j1',
        createdAt: '2026-10-26T00:00:00Z',
        thought: 'Did I lock the balcony door?',
        anxietyLevel: 7,
        responseAction: 'Paused 5 mins',
        nextStepPlan: 'Wait 10 mins',
      },
    ]
  );
  assert.equal(active.hasUserData, true);
  assert.equal(active.avgMood, 3.0);
  assert.equal(active.avgSleep, 5.8);
  assert.equal(active.avgJournalDistress, 7.0);
  assert.ok(active.periodLabel.includes('n = 2 check-ins, 1 reflection'));
  assert.ok(active.observationSummary.includes('shorter average sleep'));
});

test('Treatment education data layer passes integrity checks, verifies all 8 categories, and links to valid source registry entries', () => {
  const integrity = validateTreatmentDataIntegrity();
  assert.equal(integrity.valid, true, `Integrity errors: ${integrity.errors.join('; ')}`);
  assert.equal(TREATMENT_ENTRIES.length, 8);
  assert.ok(TREATMENT_SOURCES_REGISTRY.length >= 9);

  const requiredCategories = [
    'cbt',
    'erp',
    'act',
    'ssris',
    'clomipramine',
    'combined',
    'supportive',
    'specialist',
  ];
  for (const catId of requiredCategories) {
    const found = TREATMENT_ENTRIES.find((e) => e.id === catId);
    assert.ok(found, `Missing required treatment category: ${catId}`);
    assert.equal(
      found.clinical_review_status,
      'Prepared using evidence sources; clinical review pending'
    );
  }
});

test('Treatment sources include NICE CG31, NHS OCD Treatment, IOCDF ERP, and 2025 PMC12900050 guideline with explicit check dates', () => {
  const urls = TREATMENT_SOURCES_REGISTRY.map((s) => s.canonicalUrl);
  assert.ok(urls.includes('https://www.nice.org.uk/guidance/cg31/chapter/Recommendations'));
  assert.ok(urls.includes('https://www.nhs.uk/mental-health/conditions/obsessive-compulsive-disorder-ocd/treatment/'));
  assert.ok(urls.includes('https://iocdf.org/about-ocd/ocd-treatment-guide/exposure-response-prevention/'));
  assert.ok(urls.includes('https://www.nhs.uk/mental-health/conditions/obsessive-compulsive-disorder-ocd/overview/'));
  assert.ok(urls.includes('https://pmc.ncbi.nlm.nih.gov/articles/PMC12900050/'));

  for (const src of TREATMENT_SOURCES_REGISTRY) {
    assert.equal(src.dateChecked, '2026-10-27');
    assert.ok(src.claimsSupported.length > 0);
  }

  assert.equal(CBT_FIVE_PART_NODES.length, 5);
  assert.equal(ERP_LEARNING_STAGES.length, 5);
  assert.equal(TREATMENT_JOURNEY_STAGES.length, 6);
  assert.ok(APPOINTMENT_QUESTION_CHECKLIST.length >= 7);
});

