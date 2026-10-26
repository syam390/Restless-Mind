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
} from './wellbeingLogic';

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
