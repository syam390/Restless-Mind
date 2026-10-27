import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  ExternalLink,
  CheckCircle,
  ClipboardList,
  Download,
  ChevronRight,
  Info,
  Sparkles,
  Scale,
  Users,
  Pill,
  Brain,
  Compass,
} from 'lucide-react';
import EditorialPageHeader from '../components/EditorialPageHeader';
import {
  TREATMENT_ENTRIES,
  TREATMENT_SOURCES_REGISTRY,
  ANXIETY_BEYOND_OCD_GUIDE,
  APPOINTMENT_QUESTION_CHECKLIST,
  TreatmentExplorerId,
  TreatmentEvidenceLevel,
} from '../data/treatmentEducationData';
import {
  CbtInteractiveModelDiagram,
  ErpLearningPathwayDiagram,
  ActPsychologicalFlexibilityDiagram,
  MedicationClinicalFitDiagram,
  CombinedRecoveryEcosystemDiagram,
  TreatmentJourneyPathwayDiagram,
} from '../components/TreatmentVisuals';
import OcdErpSimulator from '../components/OcdErpSimulator';

interface TreatmentPageProps {
  onNavigate: (path: string) => void;
}

const APPOINT_PREP_PREFILL_KEY = 'rm_treatment_selected_questions_v1';

export default function TreatmentPage({ onNavigate }: TreatmentPageProps) {
  const [selectedExplorerId, setSelectedExplorerId] = useState<TreatmentExplorerId>('erp');
  const [compareExplorerId, setCompareExplorerId] = useState<TreatmentExplorerId | 'none'>('none');
  const [evidenceFilter, setEvidenceFilter] = useState<TreatmentEvidenceLevel | 'all'>('all');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Record<string, boolean>>({
    'q-symptoms': true,
    'q-erp-training': true,
    'q-options': true,
  });
  const [customClinicianNote, setCustomClinicianNote] = useState('');

  const filteredEntries = useMemo(() => {
    if (evidenceFilter === 'all') return TREATMENT_ENTRIES;
    return TREATMENT_ENTRIES.filter((entry) => entry.evidence_level === evidenceFilter);
  }, [evidenceFilter]);

  const activeEntry = useMemo(() => {
    const found = filteredEntries.find((e) => e.id === selectedExplorerId);
    return found || filteredEntries[0] || TREATMENT_ENTRIES[0];
  }, [filteredEntries, selectedExplorerId]);

  const compareEntry = useMemo(() => {
    if (compareExplorerId === 'none') return null;
    return TREATMENT_ENTRIES.find((e) => e.id === compareExplorerId) || null;
  }, [compareExplorerId]);

  const sourceMap = useMemo(() => {
    const map = new Map<string, (typeof TREATMENT_SOURCES_REGISTRY)[number]>();
    for (const src of TREATMENT_SOURCES_REGISTRY) {
      map.set(src.id, src);
    }
    return map;
  }, []);

  const selectedQuestionsList = useMemo(() => {
    return APPOINTMENT_QUESTION_CHECKLIST.filter((item) => selectedQuestionIds[item.id]).map(
      (item) => item.question
    );
  }, [selectedQuestionIds]);

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownloadQuestionChecklist = () => {
    const lines = [
      '====================================================================',
      'RESTLESS MIND — CLINICIAN APPOINTMENT DISCUSSION CHECKLIST',
      '====================================================================',
      `Generated Date: ${new Date().toISOString().slice(0, 10)}`,
      'Editorial Status: Prepared using evidence sources; clinical review pending',
      'Important Boundary: Educational preparation sheet only — not a diagnosis or prescription.',
      '',
      '1. QUESTIONS TO ASK MY CLINICIAN / THERAPIST / PRESCRIBER:',
      ...(selectedQuestionsList.length > 0
        ? selectedQuestionsList.map((q, idx) => `   ${idx + 1}. ${q}`)
        : ['   1. What evidence-based options (such as CBT with ERP or SSRIs) fit my experiences?']),
      '',
      '2. SPECIFIC QUESTIONS FROM MY SELECTED TREATMENT TOPIC (' + activeEntry.title + '):',
      ...activeEntry.clinician_questions.map((q) => `   - ${q}`),
      '',
      '3. MY PERSONAL NOTES & EXPERIENCES TO DESCRIBE:',
      `   ${customClinicianNote.trim() || 'No additional notes entered.'}`,
      '',
      '====================================================================',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restless-mind-treatment-questions-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInAiPrepTool = () => {
    const combinedQuestions = [
      ...selectedQuestionsList,
      ...activeEntry.clinician_questions.slice(0, 2),
    ].slice(0, 4);
    const prefillPayload = {
      topic: activeEntry.title,
      questions: combinedQuestions,
      customNote: customClinicianNote.trim(),
    };
    try {
      sessionStorage.setItem(APPOINT_PREP_PREFILL_KEY, JSON.stringify(prefillPayload));
    } catch {
      // ignore storage errors
    }
    onNavigate('/tools?tab=ai-prep');
  };

  const renderExplorerCard = (entry: (typeof TREATMENT_ENTRIES)[number], isSecondary = false) => {
    const entrySources = entry.source_ids
      .map((id) => sourceMap.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
      <div
        data-testid={isSecondary ? 'treatment-compare-card' : 'treatment-explorer-card'}
        className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs space-y-6"
      >
        {/* Top Metadata & Evidence Label */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-border">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-secondary text-primary font-mono text-xs font-bold border border-border">
                {entry.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold border border-primary/25">
                Evidence Label: {entry.evidence_level}
              </span>
            </div>
            <h3 className="heading-md">{entry.title}</h3>
          </div>
          <div className="text-right text-[11px] text-muted-foreground font-mono">
            <p>Verified: {entry.last_verified_date}</p>
            <p className="text-primary font-sans font-semibold">
              {entry.clinical_review_status}
            </p>
          </div>
        </div>

        {/* Concise Summary & Detailed Explanation */}
        <div className="space-y-3">
          <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
            {entry.concise_summary}
          </p>
          <div className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
            {entry.detailed_explanation.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Delivery, Evidence Strength, Population & Jurisdiction Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Compass size={14} className="text-primary" aria-hidden="true" />
              How It Is Generally Delivered
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{entry.how_delivered}</p>
          </div>

          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Scale size={14} className="text-primary" aria-hidden="true" />
              Supporting Evidence Context
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {entry.evidence_summary}
            </p>
          </div>

          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users size={14} className="text-primary" aria-hidden="true" />
              Intended Population (Adults vs. Children/Adolescents)
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {entry.intended_population}
            </p>
          </div>

          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Stethoscope size={14} className="text-primary" aria-hidden="true" />
              Who Guides the Decision &amp; Regional Notes
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Clinician:</strong> {entry.who_guides_decision}{' '}
              <span className="block mt-1">{entry.jurisdiction_notes}</span>
            </p>
          </div>
        </div>

        {/* Benefits & Important Limitations */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-background border border-border rounded-2xl p-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle size={15} className="text-primary" aria-hidden="true" />
              What It May Help With
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              {entry.possible_benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-background border border-border rounded-2xl p-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Info size={15} className="text-primary" aria-hidden="true" />
              Important Limitations
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              {entry.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">·</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clinical Safety Notes */}
        <div className="bg-secondary/75 border border-primary/30 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-primary" aria-hidden="true" />
            Safety &amp; Clinical Oversight Notes
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            {entry.safety_notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions to Ask a Clinician */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-foreground">
              Questions You Can Ask a Qualified Clinician About {entry.shortLabel}:
            </h4>
            <a
              href="#appointment-checklist"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Open Full Question Checklist ↓
            </a>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground/90">
            {entry.clinician_questions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-primary font-bold">{idx + 1}.</span>
                <span>&ldquo;{q}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cited Sources */}
        <div className="pt-4 border-t border-border">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Supporting Authoritative Sources (Click to verify):
          </p>
          <div className="flex flex-wrap gap-2">
            {entrySources.map((src) => (
              <a
                key={src.id}
                href={src.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-accent text-xs font-medium text-foreground border border-border smooth-transition"
              >
                <span>{src.title.slice(0, 48)}...</span>
                <ExternalLink size={12} className="text-primary shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 1. Art-Directed Page Header */}
      <EditorialPageHeader
        eyebrow="Evidence-Informed Treatment Education · Non-Diagnostic · Non-Prescribing"
        title="Understanding OCD & Anxiety Treatment"
        description="Explore how Cognitive Behavioural Therapy (CBT), Exposure and Response Prevention (ERP), ACT, and clinician-supervised medications work, examine their evidence and limitations, and prepare thoughtful questions for a qualified professional."
        variant="treatment"
        actions={
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#treatment-explorer"
              className="button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
            >
              <Stethoscope size={15} aria-hidden="true" />
              Compare Treatments
            </a>
            <a
              href="#appointment-checklist"
              className="button-secondary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
            >
              <ClipboardList size={15} aria-hidden="true" />
              Prepare Clinician Questions
            </a>
          </div>
        }
      />

      {/* Quick In-Page Section Navigation Bar */}
      <nav
        aria-label="Treatment guide sections"
        className="bg-secondary/80 border-b border-border sticky top-16 z-30 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { label: '1. Overview & Journey', href: '#overview' },
            { label: '2. Treatment Explorer', href: '#treatment-explorer' },
            { label: '3. CBT & ERP Models', href: '#cbt-erp-models' },
            { label: '4. ACT & Supportive Care', href: '#act-supportive' },
            { label: '5. Medications & Safety', href: '#medication-education' },
            { label: '6. Combined & Specialist Care', href: '#combined-specialist' },
            { label: '7. Anxiety Beyond OCD', href: '#anxiety-beyond-ocd' },
            { label: '8. Clinician Checklist', href: '#appointment-checklist' },
            { label: '9. Reference Library', href: '#reference-library' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-xl bg-card/85 hover:bg-card text-foreground hover:text-primary border border-border whitespace-nowrap smooth-transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-18">
        {/* 2. Prominent Explanation of Educational Limits & Editorial Provenance */}
        <section id="overview" className="space-y-8 scroll-mt-28">
          <div className="editorial-panel rounded-3xl p-6 md:p-8 grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Scope &amp; Limits of Educational Information</span>
              </div>
              <h2 className="heading-md">
                Designed for Learning and Preparing Questions—Never for Self-Diagnosis or Self-Prescribing
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every person&apos;s experience with OCD or anxiety is unique. Treatment decisions depend on accurate professional assessment, symptom severity, age (adult vs. child or adolescent), coexisting health conditions, medication history, and personal preference. Nothing on this website diagnoses a condition, recommends a specific treatment plan for you, or replaces consultation with a qualified psychiatrist, clinical psychologist, or medical doctor.
              </p>
            </div>
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 space-y-2.5 text-xs">
              <p className="font-bold text-foreground flex items-center justify-between">
                <span>Content Provenance</span>
                <span className="font-mono text-primary">2026-10-27</span>
              </p>
              <p className="text-primary font-semibold">
                Status: Prepared using evidence sources; clinical review pending
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Synthesised from NICE CG31, NHS OCD Guidance, IOCDF Clinical Guides, NICE CG113, and the 2025 Indian Psychiatric Society OCD Clinical Practice Guideline (PMC12900050).
              </p>
              <a
                href="#reference-library"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 pt-1"
              >
                Inspect All {TREATMENT_SOURCES_REGISTRY.length} Verified Sources →
              </a>
            </div>
          </div>

          {/* Non-Linear Treatment Journey Visual Pathway */}
          <TreatmentJourneyPathwayDiagram />
        </section>

        {/* 3. PHASE 5 — INTERACTIVE TREATMENT COMPARISON EXPLORER */}
        <section id="treatment-explorer" className="space-y-6 scroll-mt-28">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                Interactive Educational Comparison · 8 Treatment &amp; Support Categories
              </p>
              <h2 className="heading-lg mb-2">Interactive Treatment Explorer</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Select any approach below to examine what it is, how it is delivered, supporting evidence, limitations, safety notes, and questions to bring to a clinician. You can also compare two approaches side by side.
              </p>
            </div>

            {/* Educational Evidence Filter */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label
                htmlFor="evidence-filter-select"
                className="text-xs font-semibold text-muted-foreground"
              >
                Filter by Evidence Category (Educational Only):
              </label>
              <select
                id="evidence-filter-select"
                value={evidenceFilter}
                onChange={(e) =>
                  setEvidenceFilter(e.target.value as TreatmentEvidenceLevel | 'all')
                }
                className="px-3.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-semibold"
              >
                <option value="all">All 8 Treatment &amp; Support Categories</option>
                <option value="Established evidence-based treatment">
                  Established evidence-based treatment
                </option>
                <option value="Supportive or complementary approach">
                  Supportive or complementary approach
                </option>
                <option value="Specialist option">
                  Specialist option (Persistent symptoms)
                </option>
              </select>
            </div>
          </div>

          {/* Required Non-Prescriptive Comparison Notice */}
          <div className="bg-secondary border border-border rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-foreground">
            <Info size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>
                &ldquo;Different people need different care. This comparison is for learning and preparing questions, not for choosing or changing treatment without a qualified professional.&rdquo;
              </strong>{' '}
              <span className="text-muted-foreground">
                We intentionally do not assign numerical &ldquo;best treatment&rdquo; scores or match user symptoms to prescriptions.
              </span>
            </p>
          </div>

          {/* 8 Category Tabs + Optional Side-by-Side Comparison Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Treatment Explorer Categories"
              className="flex flex-wrap gap-2"
            >
              {filteredEntries.map((entry) => {
                const isSelected = entry.id === activeEntry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedExplorerId(entry.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border smooth-transition cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary/60'
                    }`}
                  >
                    {entry.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="compare-treatment-select"
                className="text-xs font-semibold text-muted-foreground whitespace-nowrap"
              >
                Compare side-by-side with:
              </label>
              <select
                id="compare-treatment-select"
                value={compareExplorerId}
                onChange={(e) =>
                  setCompareExplorerId(e.target.value as TreatmentExplorerId | 'none')
                }
                className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-semibold"
              >
                <option value="none">None (Single detailed view)</option>
                {TREATMENT_ENTRIES.filter((e) => e.id !== activeEntry.id).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.shortLabel} ({e.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Explorer Content Area */}
          <div className={compareEntry ? 'grid lg:grid-cols-2 gap-6 items-start' : ''}>
            {renderExplorerCard(activeEntry, false)}
            {compareEntry && renderExplorerCard(compareEntry, true)}
          </div>
        </section>

        {/* 4. PHASE 4.A & 4.B — CBT & ERP DEEP-DIVE + INTERACTIVE VISUAL MODELS */}
        <section id="cbt-erp-models" className="space-y-10 scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Psychological Therapies · First-Line Evidence-Based Approaches
            </p>
            <h2 className="heading-lg mb-3">
              Cognitive Behavioural Therapy (CBT) &amp; Exposure and Response Prevention (ERP)
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              In clinical guidelines worldwide (NICE CG31, NHS, IOCDF, and the 2025 IPS OCD Guideline), CBT that incorporates Exposure and Response Prevention (ERP) is the primary psychological treatment for OCD. Explore the interactive diagrams below to see how CBT and ERP work in practice.
            </p>
          </div>

          {/* Interactive 5-Node CBT Diagram */}
          <CbtInteractiveModelDiagram />

          {/* Key Clinical Distinctions in CBT & ERP for OCD */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <Brain size={18} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-base">
                How OCD CBT Differs from General CBT
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                In general anxiety, cognitive therapy often examines evidence for and against a worry. In OCD, repeatedly trying to prove an intrusive thought false (&ldquo;Let me review my memory to be 100% sure&rdquo;) becomes a mental compulsion. OCD-focused CBT targets the need for certainty itself and pairs cognitive insight with ERP.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-base">
                Addressing Invisible Mental Compulsions
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Compulsions are not always visible actions like handwashing or checking locks. Many people experience &ldquo;Pure-O&rdquo; or predominantly mental rituals—silent counting, mental reviewing, repeating prayers until they feel &ldquo;right,&rdquo; or self-reassurance. ERP adapts response prevention to pause mental reviewing gently.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <Users size={18} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-base">
                Why Collaborative Training Matters
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                ERP works best when planned collaboratively with a trained clinician—especially when symptoms are complex or coexist with depression, trauma, ADHD, or autism. You and your therapist agree on every step and review between-session practice together.
              </p>
            </div>
          </div>

          {/* Interactive 5-Stage ERP Learning Pathway Diagram */}
          <ErpLearningPathwayDiagram />

          {/* Interactive OCD Cycle & ERP vs. Compulsive Reassurance Simulator */}
          <OcdErpSimulator onNavigate={onNavigate} />
        </section>

        {/* 5. PHASE 4.C & 4.D — ACT & SUPPORTIVE APPROACHES */}
        <section id="act-supportive" className="space-y-8 scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Psychological Flexibility &amp; Complementary Care
            </p>
            <h2 className="heading-lg mb-3">
              Acceptance and Commitment Therapy (ACT) &amp; Supportive Approaches
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Alongside first-line CBT/ERP, approaches such as Acceptance and Commitment Therapy (ACT), family accommodation reduction, psychoeducation, and guided self-help play important roles in comprehensive care.
            </p>
          </div>

          <ActPsychologicalFlexibilityDiagram />
        </section>

        {/* 6. PHASE 4.E — MEDICATION EDUCATION & SAFETY */}
        <section id="medication-education" className="space-y-8 scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Pharmacotherapy Education · Non-Prescribing Overview
            </p>
            <h2 className="heading-lg mb-3">
              Understanding Medications Used in OCD &amp; Anxiety Care
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Medications can help reduce the intensity of obsessive thoughts and anxious distress for many people—either alongside psychological therapy or when therapy alone is not sufficient. Choice of medicine always depends on individual clinical evaluation.
            </p>
          </div>

          {/* Prominent Medication Safety Banner */}
          <div
            data-testid="medication-safety-banner"
            className="bg-destructive/10 border-2 border-destructive/35 rounded-3xl p-6 md:p-7 space-y-3"
          >
            <div className="flex items-center gap-2.5 text-destructive font-bold text-sm md:text-base">
              <AlertTriangle size={20} className="shrink-0" aria-hidden="true" />
              <h3>Essential Medication Safety &amp; Non-Prescribing Notice</h3>
            </div>
            <ul className="grid md:grid-cols-2 gap-3 text-xs sm:text-sm text-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>
                  <strong>This website does not prescribe medication:</strong> We do not show dosage tables, titration schedules, or drug combinations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>
                  <strong>Never change medicines on your own:</strong> Do not start, stop, increase, decrease, or combine medicines based on website content or AI responses.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>
                  <strong>Do not discontinue abruptly:</strong> Stopping SSRIs or clomipramine suddenly can cause withdrawal or rebound symptoms; always taper with your prescriber.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>
                  <strong>Consult your prescriber or pharmacist:</strong> Discuss side effects, drug interactions, missed doses, pregnancy/breastfeeding, and urgent adverse effects promptly with a qualified clinician.
                </span>
              </li>
            </ul>
          </div>

          {/* Visual Diagram of Medication Categories */}
          <MedicationClinicalFitDiagram />

          {/* Detailed Educational Cards: SSRIs, Clomipramine, Specialist Augmentation */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary font-mono text-xs font-bold">
                  First-Line Class
                </span>
                <Pill size={18} className="text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Selective Serotonin Reuptake Inhibitors (SSRIs)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                SSRIs are the most commonly prescribed first-line medicines for OCD. Examples supported by NICE CG31, NHS, IOCDF, and the 2025 IPS guideline include <strong>sertraline, fluoxetine, fluvoxamine, paroxetine, and citalopram</strong>.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>Timeline &amp; Monitoring:</strong> Improvement in OCD typically builds gradually over <strong>8 to 12 weeks</strong>. Approved indications and off-label prescribing differ by country and age group (pediatric prescribing requires specialist child/adolescent psychiatric oversight).
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary font-mono text-xs font-bold">
                  Second-Line Option
                </span>
                <Pill size={18} className="text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Clomipramine (Tricyclic Medication)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Clomipramine is a tricyclic antidepressant with strong serotonergic action and proven efficacy in OCD. However, it is <strong>not</strong> positioned as the automatic first choice ahead of SSRIs, and clinical trials do not show it to be better tolerated than SSRIs.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>Why Oversight Matters:</strong> Guidelines (NICE CG31, IPS 2025) recommend considering clomipramine after at least one adequate SSRI trial because clomipramine requires closer monitoring for anticholinergic, blood-pressure, and heart-rhythm side effects.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary font-mono text-xs font-bold">
                  Specialist Context Only
                </span>
                <Stethoscope size={18} className="text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Other Medicines &amp; Specialist Augmentation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When standard CBT/ERP and adequate trials of serotonergic medicines have not provided sufficient relief, a specialist psychiatrist may evaluate adjunctive medication strategies.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>Important Qualification:</strong> Pharmacological augmentation is <strong>never</strong> routine first-line treatment, requires careful risk-benefit monitoring by a psychiatrist, and must never be attempted without specialist supervision.
              </p>
            </div>
          </div>
        </section>

        {/* 7. PHASE 4.F & 4.G — COMBINED TREATMENT & SPECIALIST OPTIONS FOR PERSISTENT SYMPTOMS */}
        <section id="combined-specialist" className="space-y-8 scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Stepped Care &amp; Persistent Symptoms
            </p>
            <h2 className="heading-lg mb-3">
              Combined Treatment &amp; Specialist Options When First-Line Care Isn&apos;t Enough
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Clinical guidelines use a stepped-care framework: matching support intensity to how much symptoms affect daily functioning, and providing structured specialist reviews when initial treatments do not help enough.
            </p>
          </div>

          <CombinedRecoveryEcosystemDiagram />

          {/* Qualified Specialist & Neuromodulation (rTMS) Context */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="heading-md">
                Specialist Options for Treatment-Resistant OCD (Including Qualified rTMS Context)
              </h3>
              <span className="px-3 py-1 rounded-lg bg-secondary text-primary text-xs font-bold border border-border">
                Evidence Label: Specialist option / Emerging or uncertain evidence by protocol
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If symptoms remain severe after adequate trials of CBT/ERP and first-line medications, guidelines (NICE CG31, IPS 2025) recommend assessment by a multidisciplinary OCD specialist team. Options explored in specialist centres include:
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
                <strong className="text-foreground block">1. Intensive ERP Programmes</strong>
                Comprehensive review of subtle mental rituals and family accommodation, paired with intensive outpatient or residential therapist-guided ERP sessions.
              </div>
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
                <strong className="text-foreground block">
                  2. Repetitive / Deep TMS (rTMS)
                </strong>
                Non-invasive magnetic stimulation targeting OCD-related brain circuits. Considered a next-line adjunctive option in specialist centres; availability, regulatory clearance, and strength of evidence depend on the specific coil, target protocol, and clinical setting.
              </div>
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-1.5">
                <strong className="text-foreground block">
                  3. Caution Against Unverified Cures
                </strong>
                Emerging or experimental interventions are never guaranteed cures. Invasive neurosurgical procedures are reserved strictly for extremely rare, refractory adult cases under formal multidisciplinary ethics boards.
              </div>
            </div>
          </div>
        </section>

        {/* 8. PHASE 4.H — ANXIETY TREATMENT BEYOND OCD */}
        <section id="anxiety-beyond-ocd" className="space-y-6 scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Condition-Specific Care · NICE CG113 &amp; International Guidance
            </p>
            <h2 className="heading-lg mb-2">
              Anxiety Treatment Beyond OCD: Why Specific Assessment Matters
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              OCD and anxiety disorders often co-occur, but they are not interchangeable. Effective psychological therapy and medical care depend on identifying the specific condition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ANXIETY_BEYOND_OCD_GUIDE.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2.5">
                  <h3 className="font-bold text-foreground text-base md:text-lg">
                    {item.conditionName}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Core Focus:</strong> {item.coreFocus}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">How It Differs from OCD:</strong>{' '}
                    {item.howItDiffersFromOcd}
                  </p>
                </div>
                <div className="pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-primary block mb-0.5">
                    Evidence-Informed Approach:
                  </strong>
                  {item.evidenceInformedCare}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. PHASE 5 — INTERACTIVE APPOINTMENT-PREPARATION CHECKLIST */}
        <section id="appointment-checklist" className="space-y-6 scroll-mt-28">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-9 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Interactive Preparation Tool · Non-Diagnostic Question Organizer
                </p>
                <h2 className="heading-md">
                  Prepare Questions for a Qualified Clinician
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Select the questions you want to bring to your appointment, add optional context notes, and download a clean text summary or continue in our AI &amp; Doctor Prep workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadQuestionChecklist}
                  className="button-secondary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                >
                  <Download size={15} aria-hidden="true" />
                  Download Question Sheet (.txt)
                </button>
                <button
                  type="button"
                  onClick={handleOpenInAiPrepTool}
                  className="button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                >
                  <Sparkles size={15} aria-hidden="true" />
                  Open in AI &amp; Doctor Prep Tool
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3.5">
              {APPOINTMENT_QUESTION_CHECKLIST.map((item) => {
                const isChecked = Boolean(selectedQuestionIds[item.id]);
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer smooth-transition ${
                      isChecked
                        ? 'bg-secondary border-primary/50 shadow-2xs'
                        : 'bg-background border-border hover:bg-secondary/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleQuestion(item.id)}
                      className="mt-1 w-4 h-4 rounded border-border accent-primary shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <span className="font-mono text-[10px] text-primary font-bold uppercase">
                        {item.category}
                      </span>
                      <p className="font-bold text-foreground text-xs sm:text-sm leading-snug">
                        {item.question}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{item.whyHelpful}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="treatment-custom-note"
                className="block text-xs font-bold text-foreground mb-1.5"
              >
                Optional: Jot down 1–2 everyday examples or questions in your own words (stays in your browser):
              </label>
              <textarea
                id="treatment-custom-note"
                value={customClinicianNote}
                onChange={(e) => setCustomClinicianNote(e.target.value)}
                rows={2}
                placeholder="e.g., Checking locks takes 30 minutes every morning; I want to ask about outpatient ERP..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-xs sm:text-sm"
              />
            </div>
          </div>
        </section>

        {/* 10. PHASE 6 — ACCESSIBLE REFERENCE LIBRARY & REVIEW PROVENANCE */}
        <section id="reference-library" className="space-y-6 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                Data Provenance · Guidelines &amp; Official Public-Health Sources
              </p>
              <h2 className="heading-lg">
                Verified Clinical Reference Library ({TREATMENT_SOURCES_REGISTRY.length} Sources)
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Every clinical claim on this page is cross-referenced against official clinical practice guidelines, national health services, or specialist OCD organisations.
              </p>
            </div>
            <div className="text-xs font-mono bg-secondary border border-border px-3.5 py-2 rounded-xl text-foreground shrink-0">
              Editorial Status: <strong>Prepared using evidence sources; clinical review pending</strong>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {TREATMENT_SOURCES_REGISTRY.map((src, index) => (
              <div
                key={src.id}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary font-mono font-bold">
                      Ref #{index + 1} · {src.sourceType}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      Checked: {src.dateChecked}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {src.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Organisation / Authors:</strong>{' '}
                    {src.organisationOrAuthors}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Jurisdiction:</strong> {src.jurisdiction} ·{' '}
                    <strong className="text-foreground">Publication / Update:</strong>{' '}
                    {src.publicationOrUpdateDate}
                  </p>
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-foreground mb-1">
                      Key Claims Supported:
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {src.claimsSupported.map((claim, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">·</span>
                          <span>{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <a
                    href={src.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    <BookOpen size={14} aria-hidden="true" />
                    <span>Open Official Source ({new URL(src.canonicalUrl).hostname})</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
