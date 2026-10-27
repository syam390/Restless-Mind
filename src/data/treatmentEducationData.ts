export type TreatmentEvidenceLevel =
  | 'Established evidence-based treatment'
  | 'Supportive or complementary approach'
  | 'Specialist option'
  | 'Emerging or uncertain evidence';

export const VALID_EVIDENCE_LEVELS: TreatmentEvidenceLevel[] = [
  'Established evidence-based treatment',
  'Supportive or complementary approach',
  'Specialist option',
  'Emerging or uncertain evidence',
];

export type TreatmentExplorerId =
  | 'cbt'
  | 'erp'
  | 'act'
  | 'ssris'
  | 'clomipramine'
  | 'combined'
  | 'supportive'
  | 'specialist';

export interface TreatmentSourceReference {
  id: string;
  organisationOrAuthors: string;
  title: string;
  canonicalUrl: string;
  publicationOrUpdateDate: string;
  dateChecked: string;
  sourceType:
    | 'Clinical Practice Guideline'
    | 'National Public Health Guidance'
    | 'Specialist Professional Organisation'
    | 'Peer-Reviewed Clinical Guideline Update';
  jurisdiction: string;
  claimsSupported: string[];
}

export interface TreatmentEducationEntry {
  id: TreatmentExplorerId;
  title: string;
  shortLabel: string;
  category:
    | 'Psychological Therapy'
    | 'Pharmacotherapy'
    | 'Combined Care'
    | 'Supportive Care'
    | 'Specialist / Next-Line Care';
  concise_summary: string;
  detailed_explanation: string[];
  how_delivered: string;
  possible_benefits: string[];
  limitations: string[];
  safety_notes: string[];
  evidence_level: TreatmentEvidenceLevel;
  evidence_summary: string;
  intended_population: string;
  jurisdiction_notes: string;
  who_guides_decision: string;
  clinician_questions: string[];
  source_ids: string[];
  last_verified_date: string;
  clinical_review_status: 'Prepared using evidence sources; clinical review pending';
}

export const TREATMENT_SOURCES_REGISTRY: TreatmentSourceReference[] = [
  {
    id: 'nice-cg31',
    organisationOrAuthors:
      'National Institute for Health and Care Excellence (NICE, United Kingdom)',
    title:
      'Obsessive-compulsive disorder and body dysmorphic disorder: treatment (Clinical Guideline CG31)',
    canonicalUrl: 'https://www.nice.org.uk/guidance/cg31/chapter/Recommendations',
    publicationOrUpdateDate: 'Published November 2005 (surveillance reviewed)',
    dateChecked: '2026-10-27',
    sourceType: 'Clinical Practice Guideline',
    jurisdiction: 'United Kingdom (widely referenced internationally)',
    claimsSupported: [
      'Stepped-care model for OCD across mild, moderate, and severe functional impairment',
      'CBT incorporating Exposure and Response Prevention (ERP) as core psychological therapy',
      'SSRIs (fluoxetine, fluvoxamine, paroxetine, sertraline, citalopram) as first-line pharmacological option for adults',
      'Clomipramine considered after an adequate trial of at least one SSRI has been ineffective or poorly tolerated',
      'Combined CBT (including ERP) plus SSRI for severe functional impairment or inadequate response to monotherapy',
      'Age-specific distinctions for children and young people (guided CBT/ERP first; specialist oversight for medication)',
    ],
  },
  {
    id: 'nhs-ocd-treatment',
    organisationOrAuthors: 'National Health Service (NHS, United Kingdom)',
    title: 'Treatment — Obsessive compulsive disorder (OCD)',
    canonicalUrl:
      'https://www.nhs.uk/mental-health/conditions/obsessive-compulsive-disorder-ocd/treatment/',
    publicationOrUpdateDate: 'NHS Public Health Guidance (reviewed every 3 years)',
    dateChecked: '2026-10-27',
    sourceType: 'National Public Health Guidance',
    jurisdiction: 'United Kingdom',
    claimsSupported: [
      'Overview of psychological therapy (CBT with ERP) and gradual exposure hierarchies',
      'Role of SSRIs in OCD and why noticeable improvement often takes several weeks to months',
      'Importance of not stopping SSRIs abruptly without speaking to a prescribing clinician',
      'Referral pathways from primary care to specialist mental health services',
    ],
  },
  {
    id: 'iocdf-erp',
    organisationOrAuthors: 'International OCD Foundation (IOCDF)',
    title: 'Exposure and Response Prevention (ERP) — OCD Treatment Guide',
    canonicalUrl:
      'https://iocdf.org/about-ocd/ocd-treatment-guide/exposure-response-prevention/',
    publicationOrUpdateDate: 'Current IOCDF Clinical Education Guide',
    dateChecked: '2026-10-27',
    sourceType: 'Specialist Professional Organisation',
    jurisdiction: 'United States & International',
    claimsSupported: [
      'Definition of Exposure (confronting feared thoughts, images, objects, or situations) and Response Prevention (choosing not to perform compulsive rituals)',
      'Collaborative hierarchy planning and role of outpatient vs. intensive ERP formats',
      'Habituation and inhibitory learning mechanisms (learning to tolerate uncertainty rather than demanding 100% certainty)',
      'Why traditional unstructured talk therapy or reassurance can inadvertently reinforce OCD rituals',
    ],
  },
  {
    id: 'nhs-ocd-overview',
    organisationOrAuthors: 'National Health Service (NHS, United Kingdom)',
    title: 'Overview — Obsessive compulsive disorder (OCD)',
    canonicalUrl:
      'https://www.nhs.uk/mental-health/conditions/obsessive-compulsive-disorder-ocd/overview/',
    publicationOrUpdateDate: 'NHS Public Health Guidance',
    dateChecked: '2026-10-27',
    sourceType: 'National Public Health Guidance',
    jurisdiction: 'United Kingdom',
    claimsSupported: [
      'Core educational model of obsessions, anxiety/distress, compulsions (visible and mental), and temporary relief',
      'Non-judgmental explanation that intrusive thoughts can be disturbing yet ego-dystonic',
    ],
  },
  {
    id: 'ips-cpg-ocd-2025',
    organisationOrAuthors:
      'Indian Psychiatric Society (IPS) / Indian Journal of Psychiatry',
    title: 'Clinical practice guidelines for obsessive-compulsive disorder: 2025 update (PMCID: PMC12900050)',
    canonicalUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12900050/',
    publicationOrUpdateDate: 'Published 2025',
    dateChecked: '2026-10-27',
    sourceType: 'Peer-Reviewed Clinical Guideline Update',
    jurisdiction: 'India & International Clinical Practice',
    claimsSupported: [
      'SSRIs and CBT/ERP as fundamental first-line treatments for OCD in clinical practice',
      'Comprehensive evaluation of symptom dimensions, insight, comorbidities, and patient preference',
      'Duration of adequate pharmacotherapy trial (typically 8–12 weeks at optimal tolerated dose)',
      'Structured management of inadequate response: combined CBT+SSRI, switching SSRIs, clomipramine, specialist augmentation, and qualified neuromodulation (rTMS) context',
      'Specific clinical considerations for pediatric, adolescent, pregnancy/postpartum, and older adult populations',
    ],
  },
  {
    id: 'iocdf-meds',
    organisationOrAuthors: 'International OCD Foundation (IOCDF)',
    title: 'Medications for OCD — OCD Treatment Guide',
    canonicalUrl: 'https://iocdf.org/about-ocd/ocd-treatment-guide/medications-for-ocd/',
    publicationOrUpdateDate: 'Current IOCDF Clinical Education Guide',
    dateChecked: '2026-10-27',
    sourceType: 'Specialist Professional Organisation',
    jurisdiction: 'United States & International',
    claimsSupported: [
      'Serotonergic medicines commonly prescribed for OCD (fluoxetine, fluvoxamine, sertraline, paroxetine, citalopram/escitalopram, and clomipramine)',
      'General observation that OCD pharmacotherapy often requires gradual titration and 8–12 weeks to evaluate benefit',
      'Why medication decisions, side-effect monitoring, pregnancy discussions, and tapering require a qualified prescriber',
    ],
  },
  {
    id: 'iocdf-act',
    organisationOrAuthors: 'International OCD Foundation (IOCDF)',
    title: 'Acceptance and Commitment Therapy (ACT) in the Treatment of OCD',
    canonicalUrl:
      'https://iocdf.org/expert-opinions/acceptance-and-commitment-therapy-in-the-treatment-of-ocd/',
    publicationOrUpdateDate: 'IOCDF Expert Consensus & Clinical Guide',
    dateChecked: '2026-10-27',
    sourceType: 'Specialist Professional Organisation',
    jurisdiction: 'United States & International',
    claimsSupported: [
      'Six core processes of psychological flexibility: acceptance, cognitive defusion, present-moment awareness, self-as-context, values, and committed action',
      'How ACT is used alongside ERP (e.g., ACT-enhanced ERP) or for individuals who struggle with ERP engagement',
      'Qualification that ERP remains the most extensively studied first-line psychotherapy for OCD',
    ],
  },
  {
    id: 'iocdf-tms',
    organisationOrAuthors: 'International OCD Foundation (IOCDF)',
    title: 'Transcranial Magnetic Stimulation (TMS) for OCD',
    canonicalUrl: 'https://iocdf.org/about-ocd/ocd-treatment-guide/tms/',
    publicationOrUpdateDate: 'Current IOCDF Neuromodulation Guide',
    dateChecked: '2026-10-27',
    sourceType: 'Specialist Professional Organisation',
    jurisdiction: 'United States & International',
    claimsSupported: [
      'Non-invasive nature of repetitive/deep TMS targeting specific OCD-related brain circuits',
      'Positioning of rTMS/deep TMS as an adjunctive or next-line specialist option when first-line ERP and/or SSRIs have not provided sufficient relief',
      'Variability in protocol type, regulatory clearance, clinic availability, and individual response',
    ],
  },
  {
    id: 'nice-cg113-anxiety',
    organisationOrAuthors:
      'National Institute for Health and Care Excellence (NICE, United Kingdom)',
    title:
      'Generalised anxiety disorder and panic disorder in adults: management (Clinical Guideline CG113)',
    canonicalUrl: 'https://www.nice.org.uk/guidance/cg113/chapter/Recommendations',
    publicationOrUpdateDate: 'Published January 2011 (updated July 2019)',
    dateChecked: '2026-10-27',
    sourceType: 'Clinical Practice Guideline',
    jurisdiction: 'United Kingdom & International Reference',
    claimsSupported: [
      'Distinction between generalised anxiety disorder (GAD), panic disorder, and OCD treatment protocols',
      'Role of disorder-specific CBT, applied relaxation, guided self-help, and clinician-supervised pharmacotherapy in anxiety disorders',
    ],
  },
];

export const TREATMENT_ENTRIES: TreatmentEducationEntry[] = [
  {
    id: 'cbt',
    title: 'Cognitive Behavioural Therapy (CBT) for OCD & Anxiety',
    shortLabel: 'CBT',
    category: 'Psychological Therapy',
    concise_summary:
      'A structured, collaborative talking therapy that explores how situations, interpretations, physical sensations, emotions, and behaviours interact—and uses practical experiments and exposure to change unhelpful loops.',
    detailed_explanation: [
      'Cognitive Behavioural Therapy (CBT) examines how our interpretations of events—rather than the events alone—shape emotional distress and protective behaviours. In OCD, cognitive work focuses not on the mere presence of an unwanted intrusive thought, but on the inflated meaning attached to it (such as overestimated threat, inflated personal responsibility, or the belief that having a thought is morally equivalent to acting on it).',
      'CBT for OCD differs crucially from general anxiety CBT. In general anxiety, a therapist may occasionally help examine realistic probabilities. In OCD, repeatedly debating whether an intrusive doubt is 0% likely can turn into a mental compulsion (reassurance-seeking). Therefore, evidence-based CBT for OCD integrates Exposure and Response Prevention (ERP) and behavioural experiments designed to build tolerance for uncertainty.',
      'Sessions are active and collaborative: you and your therapist map your specific cycle, agree on manageable between-session experiments, and review what happened without judgment. CBT is never about "forcing positive thoughts" or trying to suppress unwanted thoughts.',
    ],
    how_delivered:
      'Typically delivered in structured weekly individual or group sessions (often 8–20+ sessions depending on severity and individual needs) with a trained clinical psychologist or CBT therapist, including agreed between-session practice.',
    possible_benefits: [
      'Helps identify how safety behaviours, avoidance, and mental rituals maintain anxiety over time',
      'Reduces secondary guilt and catastrophic misinterpretations of normal intrusive thoughts',
      'Provides practical, transferable skills for noticing cognitive traps without arguing with thoughts',
    ],
    limitations: [
      'General "talk therapy" or generic CBT that omits Exposure and Response Prevention (ERP) is often less effective for core OCD rituals',
      'Requires active collaboration and willingness to practice skills between sessions',
      'Access to therapists specifically trained in OCD-focused CBT/ERP can vary by region',
    ],
    safety_notes: [
      'CBT should never involve shaming you for intrusive thoughts or pressuring you into unagreed exposures.',
      'If cognitive restructuring starts feeling like a repetitive ritual to "prove nothing bad will happen," let your therapist know so the focus can shift toward tolerating uncertainty.',
    ],
    evidence_level: 'Established evidence-based treatment',
    evidence_summary:
      'Recommended by NICE CG31, NHS guidance, and the 2025 Indian Psychiatric Society (IPS) OCD Clinical Practice Guideline when CBT includes Exposure and Response Prevention (ERP).',
    intended_population:
      'Adults, adolescents, and children (aged 8+ in NICE CG31), using developmentally adapted protocols and family involvement where appropriate for younger people.',
    jurisdiction_notes:
      'Recognised as a first-line psychological intervention in India (IPS 2025), the UK (NICE CG31 / NHS Talking Therapies), the US (APA / IOCDF), and WHO mental health frameworks.',
    who_guides_decision:
      'A licensed clinical psychologist, accredited CBT therapist, or psychiatrist following a comprehensive assessment.',
    clinician_questions: [
      'When you use CBT for OCD, how do you incorporate Exposure and Response Prevention (ERP)?',
      'How do we make sure cognitive reframing does not become a reassurance ritual for my intrusive doubts?',
      'What does between-session practice typically look like in your approach?',
    ],
    source_ids: ['nice-cg31', 'nhs-ocd-treatment', 'ips-cpg-ocd-2025', 'nice-cg113-anxiety'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'erp',
    title: 'Exposure and Response Prevention (ERP)',
    shortLabel: 'ERP',
    category: 'Psychological Therapy',
    concise_summary:
      'The specialized form of CBT most strongly supported for OCD. ERP involves gradually, collaboratively approaching feared thoughts or situations (Exposure) while choosing not to perform compulsive rituals or reassurance-seeking (Response Prevention).',
    detailed_explanation: [
      'Exposure and Response Prevention (ERP) targets the behavioural engine of OCD directly. "Exposure" means gradually facing the internal thoughts, mental images, doubts, or external situations that trigger obsessive distress—arranged in a collaborative hierarchy from manageable steps up to more challenging ones.',
      '"Response Prevention" means making a deliberate commitment not to perform the physical ritual (such as repeated checking, washing, or ordering) or the invisible mental compulsion (such as silent counting, mental reviewing, praying to neutralize a thought, or asking loved ones for reassurance).',
      'Modern clinical understanding of ERP emphasises both habituation (noticing that alarm signals can subside naturally over time) and inhibitory learning: discovering that you can tolerate discomfort and uncertainty ("maybe, maybe not") without needing a compulsion to stay safe. Importantly, anxiety does not have to drop to zero during every single session for ERP learning to succeed.',
    ],
    how_delivered:
      'Planned collaboratively with an ERP-trained therapist across outpatient weekly sessions, guided self-help for milder symptoms (where clinically appropriate), or intensive outpatient/residential programmes for severe symptoms.',
    possible_benefits: [
      'Directly weakens the reinforcement link between intrusive doubts and compulsive urgency',
      'Addresses both visible physical compulsions and subtle mental rituals or family reassurance traps',
      'Builds lasting confidence in handling everyday uncertainty without rigid rules',
    ],
    limitations: [
      'Intentionally pausing rituals brings temporary discomfort and requires supportive pacing',
      'Self-directed exposure to overwhelming triggers without a clear plan can feel discouraging if subtle mental compulsions continue unnoticed',
      'Coexisting conditions (such as severe depression, active trauma, or neurodivergent sensory needs) require tailored clinical adaptation',
    ],
    safety_notes: [
      'ERP never requires reckless behaviour, actual physical danger, deliberate trauma, or violating your core moral or religious values.',
      'Exposures are always collaborative—a qualified therapist will never force or surprise you with an unagreed exercise.',
      'The interactive simulator on this website is an educational illustration of ERP concepts, not an unsupervised treatment prescription.',
    ],
    evidence_level: 'Established evidence-based treatment',
    evidence_summary:
      'Endorsed as the primary first-line psychological treatment for OCD across NICE CG31, NHS guidance, IOCDF guidelines, and the 2025 IPS OCD Clinical Practice Guideline.',
    intended_population:
      'Adults, adolescents, and children (with age-appropriate hierarchy design and non-accommodating family support for children and young people).',
    jurisdiction_notes:
      'Recommended globally across UK (NICE/NHS), India (IPS 2025 / NIMHANS OCD Clinic protocols), and US/International (IOCDF) guidance.',
    who_guides_decision:
      'A clinical psychologist, psychiatrist, or specialist therapist trained specifically in ERP for OCD.',
    clinician_questions: [
      'What specific training and clinical experience do you have delivering ERP for OCD?',
      'How do you adapt ERP when compulsions are mostly mental (such as rumination or reviewing memories)?',
      'How do we build an exposure hierarchy together so the pace feels collaborative and manageable?',
    ],
    source_ids: ['iocdf-erp', 'nice-cg31', 'nhs-ocd-treatment', 'ips-cpg-ocd-2025'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'act',
    title: 'Acceptance and Commitment Therapy (ACT)',
    shortLabel: 'ACT',
    category: 'Psychological Therapy',
    concise_summary:
      'A behavioural therapy focused on psychological flexibility: learning to make room for unwanted internal experiences (acceptance and cognitive defusion) while investing energy into actions guided by personal values.',
    detailed_explanation: [
      'Acceptance and Commitment Therapy (ACT) is a "third-wave" behavioural therapy that changes how you relate to thoughts and feelings rather than trying to eliminate or replace them. It cultivates six core processes: Acceptance (allowing uncomfortable feelings to be present without struggling against them), Cognitive Defusion (stepping back and observing thoughts as passing words or images rather than literal truths), Present-Moment Awareness, Self-as-Context, Values Clarification, and Committed Action.',
      'In OCD and anxiety care, ACT helps illustrate why the struggle to suppress or neutralize every intrusive thought ("the tug-of-war with the monster") often exhausts a person and shrinks their life. By dropping the rope and choosing values-based actions even when anxiety is present, individuals reduce the power of intrusive doubts.',
      'Evidence Qualification: While ACT has a growing clinical research base and is frequently integrated with ERP ("ACT-enhanced ERP") or used when someone finds traditional ERP difficult to start, ERP remains the most extensively established first-line psychological treatment specifically for OCD.',
    ],
    how_delivered:
      'Delivered by a trained psychologist or psychotherapist either as a standalone psychotherapy for anxiety/OCD or integrated alongside Exposure and Response Prevention (ACT-informed ERP).',
    possible_benefits: [
      'Teaches practical "cognitive defusion" skills to notice sticky thoughts without debating them',
      'Reconnects recovery work to meaningful personal values rather than just symptom Fighting',
      'Can support willingness to engage in exposure steps by framing discomfort as purposeful',
    ],
    limitations: [
      'Should not be presented as a proven superior replacement for established first-line ERP in OCD',
      'Some people misinterpret "acceptance" as resignation; skilled guidance clarifies that acceptance applies to internal feelings while behaviour remains active',
    ],
    safety_notes: [
      'In OCD, cognitive defusion exercises should not be turned into a new ritual performed to make anxious feelings disappear immediately.',
    ],
    evidence_level: 'Supportive or complementary approach',
    evidence_summary:
      'Supported by clinical trials and IOCDF expert guidance as a valuable psychological approach—often integrated with ERP or used in anxiety care—while recognising CBT/ERP as the primary established first-line therapy in major guidelines.',
    intended_population:
      'Adults and adolescents navigating OCD, generalised anxiety, or chronic worry who benefit from values-based psychological flexibility skills.',
    jurisdiction_notes:
      'Practised internationally by clinical psychologists and CBT/ACT clinicians across India, the UK, North America, and Australia.',
    who_guides_decision:
      'A qualified clinical psychologist or psychotherapist familiar with both ACT and OCD ritual dynamics.',
    clinician_questions: [
      'Do you integrate ACT concepts (like cognitive defusion and values) with Exposure and Response Prevention?',
      'How can I practice "making room" for intrusive thoughts without turning defusion into a checking ritual?',
    ],
    source_ids: ['iocdf-act', 'ips-cpg-ocd-2025', 'iocdf-erp'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'ssris',
    title: 'Selective Serotonin Reuptake Inhibitors (SSRIs)',
    shortLabel: 'SSRIs',
    category: 'Pharmacotherapy',
    concise_summary:
      'A class of prescription medicines commonly used as first-line pharmacological treatment for OCD and several anxiety disorders. Examples referenced in clinical guidelines include sertraline, fluoxetine, fluvoxamine, paroxetine, and citalopram.',
    detailed_explanation: [
      'Selective Serotonin Reuptake Inhibitors (SSRIs) are prescription medications that influence serotonin signalling across neural circuits involved in mood, anxiety, and obsessive-compulsive loops. Despite being classified broadly as "antidepressants," SSRIs have specific, well-established anti-obsessional properties even when a person does not have depression.',
      'Clinical guidelines (including NICE CG31, NHS guidance, IOCDF, and the 2025 IPS OCD guideline) list medicines such as fluoxetine, fluvoxamine, paroxetine, sertraline, and citalopram/escitalopram among SSRIs used in adult OCD management. For many people, an SSRI helps "turn down the volume" and urgency of intrusive thoughts so it becomes easier to pause compulsions and engage in ERP therapy.',
      'Important timeline expectation: In OCD, medication response is typically gradual. Guidelines note that an adequate trial often takes 8 to 12 weeks at an appropriate clinician-monitored dose before full benefits can be evaluated.',
    ],
    how_delivered:
      'Prescribed and monitored by a qualified psychiatrist, medical doctor, or authorised prescriber, with regular follow-up visits to review benefits, tolerability, and timeline.',
    possible_benefits: [
      'Established first-line medication class for moderate-to-severe OCD and coexisting anxiety or depression',
      'Can lower baseline physiological alarm and obsessive intensity, making psychological therapy (ERP) more accessible',
      'Generally more favourable side-effect and safety profile than older tricyclic medications',
    ],
    limitations: [
      'Benefits take several weeks (often 8–12 weeks) to build; it is not an immediate "as-needed" tranquiliser',
      'Individual response varies—some people experience partial relief or need a prescriber to adjust the plan',
      'Symptoms may recur if medication is stopped without consolidating behavioural coping skills (such as ERP)',
    ],
    safety_notes: [
      'This website does not prescribe medication or recommend specific drugs or doses.',
      'Never start, stop, increase, decrease, or combine prescription medicines based on website content or AI responses.',
      'Do not stop an SSRI abruptly, as sudden discontinuation can cause uncomfortable withdrawal or rebound symptoms; any tapering must be planned with your prescriber.',
      'Discuss potential side effects (such as gastrointestinal upset, sleep changes, restlessness, sexual side effects, or rare activation/mood shifts), drug interactions, and pregnancy or breastfeeding considerations directly with your doctor or pharmacist.',
    ],
    evidence_level: 'Established evidence-based treatment',
    evidence_summary:
      'Recommended as first-line pharmacotherapy for OCD across NICE CG31, NHS OCD guidance, IOCDF treatment guides, and the 2025 Indian Psychiatric Society (IPS) Clinical Practice Guideline.',
    intended_population:
      'Adults with moderate-to-severe OCD or those who prefer or require medication. For children and adolescents, prescribing indications, licensing, and safety monitoring (including close monitoring for agitation or suicidal ideation in young people) are stricter and must be led by a specialist child/adolescent psychiatrist.',
    jurisdiction_notes:
      'Specific regulatory approvals (e.g., CDSCO in India, MHRA in the UK, FDA in the US) and age-group licensing differ by country and individual medicine (for instance, citalopram/escitalopram may be prescribed off-label in some jurisdictions while sertraline, fluoxetine, fluvoxamine, and paroxetine hold specific OCD indications).',
    who_guides_decision:
      'A qualified psychiatrist or medical prescriber after reviewing medical history, age, coexisting conditions, and personal preferences.',
    clinician_questions: [
      'How long does an SSRI trial typically take before we evaluate whether it is helping my OCD symptoms?',
      'What common early side effects should I expect, and which side effects mean I should contact the clinic promptly?',
      'How would medication work alongside Exposure and Response Prevention (ERP) therapy in my care plan?',
    ],
    source_ids: ['nice-cg31', 'nhs-ocd-treatment', 'iocdf-meds', 'ips-cpg-ocd-2025'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'clomipramine',
    title: 'Clomipramine (Tricyclic Serotonergic Medication)',
    shortLabel: 'Clomipramine',
    category: 'Pharmacotherapy',
    concise_summary:
      'A tricyclic antidepressant with potent serotonergic activity that was the first medication proven effective for OCD. Because of its broader side-effect and safety profile, guidelines generally consider it after at least one SSRI trial.',
    detailed_explanation: [
      'Clomipramine is a tricyclic medication with strong effects on serotonin reuptake. Historically, it was the first pharmacological treatment shown in rigorous clinical trials to reduce OCD symptoms, and it remains an important evidence-based option in psychiatric care.',
      'However, clinical guidelines (including NICE CG31, NHS guidance, and the 2025 IPS OCD guideline) do not position clomipramine as the automatic first-choice medicine ahead of SSRIs. While both SSRIs and clomipramine are effective for OCD, clomipramine affects additional receptor systems in the body, leading to a higher rate of anticholinergic, antihistaminic, and cardiovascular side effects.',
      'Consequently, clinicians typically consider clomipramine as a second-line pharmacological option when an individual has not responded adequately to—or could not tolerate—at least one adequate trial of an SSRI.',
    ],
    how_delivered:
      'Prescribed and closely monitored by a psychiatrist, often with baseline and periodic clinical checks (such as blood pressure or electrocardiogram/ECG monitoring when clinically indicated).',
    possible_benefits: [
      'Well-established anti-obsessional efficacy supported by decades of clinical trials',
      'Provides an important evidence-based alternative when standard SSRI trials have not brought sufficient relief',
    ],
    limitations: [
      'Higher likelihood of side effects such as dry mouth, constipation, blurred vision, drowsiness, dizziness on standing, weight changes, or heart-rhythm effects',
      'Requires closer medical monitoring and caution regarding drug-drug interactions and overdose toxicity',
      'Not superior to SSRIs in head-to-head tolerability, which is why SSRIs are generally tried first',
    ],
    safety_notes: [
      'Never start, adjust, combine, or discontinue clomipramine without direct psychiatric supervision.',
      'Inform your prescriber about any cardiac history, other medications, or pregnancy considerations before considering clomipramine.',
      'Because tricyclic medicines carry higher toxicity if taken in excess, safe prescribing and close follow-up are essential.',
    ],
    evidence_level: 'Established evidence-based treatment',
    evidence_summary:
      'Recognised by NICE CG31, NHS guidance, IOCDF, and the 2025 IPS OCD guideline as an established pharmacological treatment, typically positioned after an adequate trial of at least one SSRI.',
    intended_population:
      'Primarily adults (and selected specialist-managed cases) who have had an inadequate response to or intolerance of SSRI therapy, under close psychiatric supervision.',
    jurisdiction_notes:
      'Consistent across NICE CG31 (UK), IPS 2025 (India), and APA/IOCDF (US) guidelines: effective for OCD, reserved as second-line pharmacotherapy after SSRIs due to tolerability and safety considerations.',
    who_guides_decision:
      'A specialist psychiatrist who can evaluate past medication trials, cardiovascular health, and potential interactions.',
    clinician_questions: [
      'Why might clomipramine be considered compared with trying a different SSRI first?',
      'What health checks (such as ECG or blood pressure monitoring) and side-effect precautions are needed?',
    ],
    source_ids: ['nice-cg31', 'nhs-ocd-treatment', 'iocdf-meds', 'ips-cpg-ocd-2025'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'combined',
    title: 'Combined Psychological & Medication Treatment',
    shortLabel: 'Combined Treatment',
    category: 'Combined Care',
    concise_summary:
      'Integrating structured psychological therapy (CBT with ERP) and clinician-prescribed medication (such as an SSRI) when symptoms are severe, when one modality alone has not helped enough, or when coexisting conditions are present.',
    detailed_explanation: [
      'Treatment planning for OCD and anxiety is not an "either/or" contest between therapy and medication. According to NICE CG31 and the 2025 IPS OCD guideline, the choice among CBT/ERP alone, medication alone, or combined treatment depends on symptom severity, functional impact, coexisting conditions (such as major depression), prior treatment response, treatment availability, and personal preference.',
      'For mild-to-moderate OCD, many people begin with CBT incorporating ERP. However, when OCD causes severe functional impairment—or when overwhelming anxiety makes it too difficult to engage in exposure exercises—combining an SSRI with CBT/ERP is frequently recommended.',
      'In combined care, medication can reduce the acute intensity of intrusive alarms, while ERP teaches long-term behavioural skills for handling uncertainty and preventing relapse.',
    ],
    how_delivered:
      'Coordinated care involving a prescribing psychiatrist (or physician) and an ERP-trained psychologist/therapist—or a psychiatrist who delivers both pharmacotherapy and structured CBT/ERP.',
    possible_benefits: [
      'Recommended by clinical guidelines for severe OCD or when monotherapy (therapy alone or medicine alone) produces an inadequate response',
      'Addresses both neurobiological symptom intensity and learned behavioural/compulsive loops simultaneously',
      'Supports individuals who also experience significant coexisting depression or severe generalized anxiety',
    ],
    limitations: [
      'Not everyone with OCD requires medication; milder presentations often respond well to structured CBT/ERP alone',
      'Requires coordination between your therapy and prescribing appointments',
    ],
    safety_notes: [
      'Starting medication does not mean you have failed at therapy, and starting therapy does not mean you should stop prescribed medication without consulting your doctor.',
    ],
    evidence_level: 'Established evidence-based treatment',
    evidence_summary:
      'Explicitly recommended in NICE CG31 and the 2025 IPS OCD Clinical Practice Guideline for severe OCD impairment or inadequate response to standalone CBT/ERP or standalone SSRI treatment.',
    intended_population:
      'Adults, adolescents, and children with moderate-to-severe functional impairment or partial response to single-modality care, guided by a multidisciplinary team.',
    jurisdiction_notes:
      'Standard stepped-care escalation pathway in UK (NICE CG31), India (IPS 2025), and international guidelines.',
    who_guides_decision:
      'You, your psychiatrist, and your clinical psychologist/therapist working collaboratively.',
    clinician_questions: [
      'Given how much my symptoms affect daily life right now, would starting with ERP alone or combined ERP + medication make more sense?',
      'How can my therapist and prescribing doctor coordinate my treatment plan?',
    ],
    source_ids: ['nice-cg31', 'nhs-ocd-treatment', 'ips-cpg-ocd-2025', 'iocdf-erp'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'supportive',
    title: 'Supportive, Complementary & Whole-Person Approaches',
    shortLabel: 'Supportive Approaches',
    category: 'Supportive Care',
    concise_summary:
      'Psychoeducation, mindfulness skills, family/caregiver accommodation reduction, peer support groups, guided self-help, and sleep/lifestyle regulation that complement—but do not replace—established clinical care.',
    detailed_explanation: [
      'Recovery happens in everyday life, not only inside a clinic room. Supportive approaches provide practical scaffolding around formal treatment. Accurate psychoeducation helps people and families recognize that intrusive thoughts are ego-dystonic (opposite to personal values), reducing shame and isolation.',
      'Family and caregiver education is particularly helpful in OCD: loved ones often provide repeated reassurance or participate in checking rituals out of kindness ("family accommodation"), which inadvertently reinforces the OCD cycle. Learning compassionate ways to support the person without answering the OCD question improves treatment outcomes.',
      'Mindfulness skills, paced breathing, sensory grounding, peer support groups, and consistent sleep/physical health routines help regulate overall nervous system stress. However, it is important to distinguish supportive practices from core treatment: relaxation or breathing exercises should never be used compulsively to neutralize intrusive thoughts or replace ERP when OCD is clinically significant.',
    ],
    how_delivered:
      'Through therapist-guided self-help books, reputable educational platforms, family psychoeducation sessions, moderated peer support groups, and daily self-reflection routines.',
    possible_benefits: [
      'Reduces stigma, shame, and family accommodation of compulsive reassurance-seeking',
      'Lowers background physiological stress and sleep disruption that can make intrusive doubts feel louder',
      'Brief guided self-help based on CBT/ERP principles can be a helpful first step in mild OCD (per NICE CG31 stepped care)',
    ],
    limitations: [
      'Complementary wellbeing tools, breathing exercises, and unguided apps are not a substitute for specialist ERP or medical care in moderate-to-severe OCD',
      'Relaxation techniques can backfire if a person uses them as a ritual to "force away" unwanted thoughts',
    ],
    safety_notes: [
      'When using peer support groups, choose moderated spaces that focus on recovery encouragement rather than comparing triggers or seeking reassurance.',
    ],
    evidence_level: 'Supportive or complementary approach',
    evidence_summary:
      'Family involvement and guided CBT/ERP self-help for mild impairment are supported in NICE CG31 and IPS 2025 guidelines; general mindfulness, breathing, and peer support serve as valuable complements to core treatment.',
    intended_population:
      'Anyone learning about OCD and anxiety, family members and allies, and individuals using daily wellbeing tools alongside professional care.',
    jurisdiction_notes:
      'Applicable across all settings; public helplines (such as Tele-MANAS 14416 in India) and organisations (such as IOCDF and OCD-UK) offer free educational and support navigation resources.',
    who_guides_decision:
      'Individuals and families in consultation with their mental-health professional.',
    clinician_questions: [
      'How can my family or partner support me during anxious spikes without accidentally enabling reassurance rituals?',
      'Which evidence-based self-help workbooks or between-session tools do you recommend alongside our sessions?',
    ],
    source_ids: ['nice-cg31', 'nhs-ocd-overview', 'ips-cpg-ocd-2025', 'iocdf-erp'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
  {
    id: 'specialist',
    title: 'Specialist & Next-Line Options for Persistent OCD',
    shortLabel: 'Specialist Options',
    category: 'Specialist / Next-Line Care',
    concise_summary:
      'Multidisciplinary specialist options considered when adequate trials of first-line CBT/ERP and serotonergic medications have not brought sufficient relief—including intensive ERP programmes, specialist pharmacological augmentation, and qualified neuromodulation such as rTMS.',
    detailed_explanation: [
      'When someone continues to experience substantial OCD distress despite adequate trials of first-line treatments (such as structured CBT/ERP and adequate 8–12 week trials of SSRIs/clomipramine), clinical guidelines recommend a comprehensive review by a specialist OCD team rather than losing hope.',
      'A specialist review first checks common modifiable factors: whether therapy included genuine response prevention (including hidden mental rituals), whether medication reached an adequate duration and tolerated level, and whether coexisting conditions (such as depression, tic disorders, autism, ADHD, or medical factors) need attention. Intensive outpatient or residential ERP programmes may be offered.',
      'Specialist-guided next-line options may also include carefully monitored pharmacological augmentation strategies or non-invasive neuromodulation such as repetitive or deep Transcranial Magnetic Stimulation (rTMS / dTMS) targeting OCD-related cortical-striatal circuits. Availability, regulatory clearance, protocol selection, and strength of evidence vary by setting and device protocol, and these approaches are generally used as adjuncts rather than standalone first-line replacements.',
    ],
    how_delivered:
      'Delivered exclusively through specialist psychiatric centres, dedicated hospital OCD clinics (such as NIMHANS OCD Clinic in India or specialist NHS/academic centres), and multidisciplinary care teams.',
    possible_benefits: [
      'Provides structured next-line pathways when standard outpatient therapy and first-line SSRIs have not helped enough',
      'Intensive ERP programmes offer daily therapist-supported practice in a concentrated format',
      'Non-invasive neuromodulation (rTMS/dTMS) offers a specialist adjunctive option in approved centres without systemic medication side effects',
    ],
    limitations: [
      'Pharmacological augmentation and rTMS are next-line specialist interventions, not routine first-line treatments',
      'rTMS requires multiple in-clinic sessions, has variable evidence depending on the specific coil/protocol, and is not universally available in all public clinics',
      'Highly specialized neurosurgical or invasive procedures are reserved strictly for extremely rare, severe, refractory adult cases under rigorous ethical and multidisciplinary board oversight—never pursued without exhaustive specialist care',
    ],
    safety_notes: [
      'Never attempt to combine medications or copy specialist augmentation regimens on your own.',
      'Be cautious of commercial clinics advertising experimental procedures or neuromodulation as a "guaranteed cure." Always seek evaluation from an accredited academic or public specialist OCD team.',
    ],
    evidence_level: 'Specialist option',
    evidence_summary:
      'Reviewed in the 2025 IPS OCD Clinical Practice Guideline, NICE CG31 escalation pathways, and IOCDF TMS guidance as specialist next-line or adjunctive options when first-line treatments have been insufficient.',
    intended_population:
      'Primarily adults with treatment-resistant or persistent OCD who have already completed adequate trials of first-line psychological and pharmacological care.',
    jurisdiction_notes:
      'Certain deep TMS/rTMS protocols hold regulatory clearance for adjunctive adult OCD use in specific jurisdictions (e.g., US FDA clearance) and are offered in major Indian tertiary institutes (e.g., NIMHANS/AIIMS) and international specialist centres; NICE and regional availability vary.',
    who_guides_decision:
      'A multidisciplinary specialist OCD team led by a senior psychiatrist and specialist clinical psychologist.',
    clinician_questions: [
      'Before considering next-line options, have we reviewed whether subtle mental compulsions or family accommodation are limiting my ERP progress?',
      'Would a referral to a specialist OCD clinic or an intensive ERP programme be appropriate for my situation?',
      'What is the realistic evidence, schedule, and regulatory status of adjunctive options like rTMS in our region?',
    ],
    source_ids: ['ips-cpg-ocd-2025', 'iocdf-tms', 'nice-cg31'],
    last_verified_date: '2026-10-27',
    clinical_review_status: 'Prepared using evidence sources; clinical review pending',
  },
];

export interface CbtModelNode {
  id: 'situation' | 'thought' | 'emotion_body' | 'behaviour' | 'feedback';
  stepNumber: string;
  title: string;
  subtitle: string;
  explanation: string;
  neutralExample: string;
  cbtInsight: string;
}

export const CBT_FIVE_PART_NODES: CbtModelNode[] = [
  {
    id: 'situation',
    stepNumber: '01',
    title: 'Situation or Trigger',
    subtitle: 'Internal thought or external event',
    explanation:
      'A trigger can be an everyday external situation (locking the front door, sending a work email, touching a surface) or an abrupt internal mental event (an unwanted image, doubt, or memory).',
    neutralExample:
      'Example: Walking away from your apartment building on the way to morning classes or work.',
    cbtInsight:
      'In CBT, the trigger itself is recognized as a normal moment in life—not proof of danger.',
  },
  {
    id: 'thought',
    stepNumber: '02',
    title: 'Thought & Interpretation',
    subtitle: 'The meaning attached to the trigger',
    explanation:
      'Nearly everyone has fleeting doubts. Distress escalates when the brain attaches an inflated interpretation: "If I am not 100% certain the stove is off, I am irresponsible and a disaster will happen."',
    neutralExample:
      'Example: "What if the lock didn’t click properly? Having this doubt means I must be 100% sure right now."',
    cbtInsight:
      'CBT does not try to force positive thoughts ("It is definitely locked!") or suppress the doubt; instead, it notices the inflated demand for 100% certainty.',
  },
  {
    id: 'emotion_body',
    stepNumber: '03',
    title: 'Emotion & Physical Sensations',
    subtitle: 'Nervous system alarm response',
    explanation:
      'Because the brain interprets the doubt as an urgent threat, the sympathetic nervous system activates—producing anxiety, guilt, dread, a tight chest, racing heart, or a "not-just-right" sensation.',
    neutralExample:
      'Example: A sudden knot in the stomach, rising physical tension, and an urgent feeling of dread.',
    cbtInsight:
      'Physical anxiety feels urgent, yet CBT and ERP teach that an uncomfortable bodily alarm is not evidence of real-world danger.',
  },
  {
    id: 'behaviour',
    stepNumber: '04',
    title: 'Behaviour or Response',
    subtitle: 'Compulsion, avoidance, or ERP pause',
    explanation:
      'To escape the uncomfortable alarm, a person may perform a visible compulsion (walking back to check), a mental ritual (replaying the memory of locking up), or avoidance.',
    neutralExample:
      'Example: Returning three times to rattle the door handle or asking a family member for reassurance.',
    cbtInsight:
      'Behaviour is the most direct lever you can change: choosing to pause the ritual (Response Prevention) changes what happens next.',
  },
  {
    id: 'feedback',
    stepNumber: '05',
    title: 'Feedback Effects',
    subtitle: 'What the brain learns for tomorrow',
    explanation:
      'When you perform a ritual, anxiety drops briefly—teaching your brain that the doubt was dangerous and the ritual "saved" you. When you pause the ritual, your brain learns that uncertainty is tolerable.',
    neutralExample:
      'Example: Pausing the return check allows the alarm to settle naturally over time, weakening tomorrow’s urge.',
    cbtInsight:
      'Stepping out of the feedback loop builds long-term confidence rather than short-term reassurance.',
  },
];

export interface ErpLearningStage {
  stepNumber: string;
  title: string;
  shortLabel: string;
  summary: string;
  whatHappens: string;
  safetyPrinciple: string;
}

export const ERP_LEARNING_STAGES: ErpLearningStage[] = [
  {
    stepNumber: '01',
    title: 'Identify Triggers & Rituals',
    shortLabel: 'Map the Loop',
    summary:
      'Map the specific external triggers, intrusive thoughts, physical rituals, avoidance patterns, and invisible mental compulsions.',
    whatHappens:
      'You and your clinician observe what triggers doubt and what actions you currently take to seek relief or certainty.',
    safetyPrinciple:
      'No judgment: intrusive thoughts are recognized as ego-dystonic signals, never character flaws.',
  },
  {
    stepNumber: '02',
    title: 'Plan Collaborative Hierarchy',
    shortLabel: 'Design Together',
    summary:
      'Build a graduated ladder of practice situations with a qualified therapist, starting with mild-to-moderate steps.',
    whatHappens:
      'You choose where to begin. ERP never starts by throwing you into your hardest fear without preparation.',
    safetyPrinciple:
      'ERP never involves reckless danger, actual harm, trauma, or unagreed surprises.',
  },
  {
    stepNumber: '03',
    title: 'Approach Without the Ritual',
    shortLabel: 'Response Prevention',
    summary:
      'Face the selected trigger while deliberately choosing not to perform the targeted physical or mental compulsion.',
    whatHappens:
      'Instead of checking, washing repeatedly, or mentally reviewing, you allow the trigger to remain present without neutralizing it.',
    safetyPrinciple:
      'Distinguishes discomfort from danger: feeling anxious is uncomfortable, not unsafe.',
  },
  {
    stepNumber: '04',
    title: 'Practice Willingness for Uncertainty',
    shortLabel: 'Tolerate Uncertainty',
    summary:
      'Allow internal sensations and "maybe, maybe not" thoughts to be present without demanding 100% certainty.',
    whatHappens:
      'Success in ERP is measured by pausing the compulsion and making room for uncertainty—not by forcing anxiety to drop on a strict schedule.',
    safetyPrinciple:
      'Anxiety does not have to fall to zero in every single exercise for powerful brain learning to occur.',
  },
  {
    stepNumber: '05',
    title: 'Review Learning & Consolidate',
    shortLabel: 'Inhibitory Learning',
    summary:
      'Reflect on what happened when the ritual was paused and repeat practice across everyday contexts.',
    whatHappens:
      'Over repeated sessions, your brain builds new inhibitory pathways: "I can handle this thought and uncertainty without rituals."',
    safetyPrinciple:
      'Between-session practice is reviewed collaboratively with your clinician and adjusted at your pace.',
  },
];

export interface TreatmentJourneyStage {
  id: string;
  stepNumber: string;
  title: string;
  summary: string;
  details: string;
  nonLinearNote: string;
}

export const TREATMENT_JOURNEY_STAGES: TreatmentJourneyStage[] = [
  {
    id: 'understanding',
    stepNumber: '01',
    title: 'Understanding Symptoms',
    summary:
      'Recognizing that repetitive doubts, intrusive thoughts, or rituals are part of a known, treatable pattern.',
    details:
      'Learning how the OCD or anxiety cycle operates helps replace self-blame with curiosity and prepares you to describe what you are experiencing.',
    nonLinearNote:
      'Many people revisit educational guides at different points as new questions come up.',
  },
  {
    id: 'assessment',
    stepNumber: '02',
    title: 'Professional Assessment',
    summary:
      'Meeting with a qualified psychiatrist, clinical psychologist, or medical doctor for a comprehensive evaluation.',
    details:
      'A clinician explores your symptom patterns, how much time they consume, coexisting anxiety or mood changes, sleep, and physical health.',
    nonLinearNote:
      'You never have to share every difficult thought in the first five minutes—assessment can unfold at a safe pace.',
  },
  {
    id: 'discussing_options',
    stepNumber: '03',
    title: 'Discussing Evidence-Based Options',
    summary:
      'Reviewing CBT/ERP, medication options (such as SSRIs), or combined care based on your needs and preferences.',
    details:
      'Your clinician explains expected timelines, possible benefits, limitations, and side effects so you can make an informed, shared decision.',
    nonLinearNote:
      'Different people need different starting points depending on severity, access, and personal preference.',
  },
  {
    id: 'starting_plan',
    stepNumber: '04',
    title: 'Starting an Agreed Plan',
    summary:
      'Beginning collaborative therapy sessions (such as an ERP hierarchy), clinician-monitored medication, or both.',
    details:
      'Early weeks focus on building trust, learning to spot subtle rituals, or allowing initial medication adjustments time to settle.',
    nonLinearNote:
      'Progress is rarely a straight line; normal fluctuations do not mean treatment has failed.',
  },
  {
    id: 'reviewing_progress',
    stepNumber: '05',
    title: 'Reviewing Progress Together',
    summary:
      'Checking in regularly with your clinician on daily functioning, sleep, side effects, and exposure learning.',
    details:
      'Guidelines recommend reviewing therapy progress and evaluating SSRI trials after an adequate window (often 8–12 weeks for medication).',
    nonLinearNote:
      'Reviews celebrate small increases in daily freedom, not just the absence of intrusive thoughts.',
  },
  {
    id: 'adjusting_care',
    stepNumber: '06',
    title: 'Adjusting & Maintaining Care',
    summary:
      'Refining therapy goals, adjusting medication with your prescriber when needed, or building relapse-prevention plans.',
    details:
      'If initial steps have not helped enough, your clinician can adjust the plan, combine modalities, or consult a specialist OCD team.',
    nonLinearNote:
      'Care plans evolve over time—stepping up or stepping down support is a normal part of long-term wellbeing.',
  },
];

export interface AnxietyConditionComparison {
  id: string;
  conditionName: string;
  coreFocus: string;
  howItDiffersFromOcd: string;
  evidenceInformedCare: string;
}

export const ANXIETY_BEYOND_OCD_GUIDE: AnxietyConditionComparison[] = [
  {
    id: 'gad',
    conditionName: 'Generalised Anxiety Disorder (GAD)',
    coreFocus:
      'Persistent, hard-to-control "what-if" worry shifting across everyday life domains (work, finances, family health, daily responsibilities) accompanied by physical restlessness, muscle tension, and fatigue.',
    howItDiffersFromOcd:
      'GAD worries usually centre on real-life concerns without stereotypic physical rituals or ego-dystonic taboo obsessions, though reassurance-seeking and over-preparing can occur in both.',
    evidenceInformedCare:
      'Condition-specific CBT (addressing intolerance of uncertainty and worry postponement), applied relaxation, guided self-help, and clinician-supervised medication (such as SSRIs/SNRIs) when indicated (NICE CG113).',
  },
  {
    id: 'panic',
    conditionName: 'Panic Disorder',
    coreFocus:
      'Recurrent unexpected surges of intense physical alarm (racing heart, shortness of breath, dizziness) paired with fear of the bodily sensations themselves ("What if I faint or have a heart attack?").',
    howItDiffersFromOcd:
      'Driven primarily by catastrophic misinterpretation of normal bodily sensations rather than obsessional doubts or compulsive washing/checking rituals.',
    evidenceInformedCare:
      'CBT for panic (including interoceptive exposure to safely demystify physical sensations) and/or clinician-guided pharmacotherapy (NICE CG113).',
  },
  {
    id: 'social',
    conditionName: 'Social Anxiety',
    coreFocus:
      'Marked fear of scrutiny, embarrassment, or negative judgment in social or performance situations, often leading to avoidance or subtle "safety behaviours" (rehearsing sentences, avoiding eye contact).',
    howItDiffersFromOcd:
      'Focuses specifically on social evaluation rather than broader obsessional themes, though CBT behavioural experiments are helpful in both.',
    evidenceInformedCare:
      'Individual CBT specifically designed for social anxiety (dropping safety behaviours and shifting attention outward) and clinician-guided medication when appropriate.',
  },
];

export interface AppointmentChecklistItem {
  id: string;
  category: 'Symptoms & Impact' | 'Therapy & ERP Questions' | 'Medication & Safety' | 'Follow-Up & Review';
  question: string;
  whyHelpful: string;
}

export const APPOINTMENT_QUESTION_CHECKLIST: AppointmentChecklistItem[] = [
  {
    id: 'q-symptoms',
    category: 'Symptoms & Impact',
    question:
      'How can I best describe the intrusive thoughts, doubts, or repetitive rituals (physical or mental) that take up my time?',
    whyHelpful:
      'Helps your clinician see both visible behaviours and invisible mental reviewing.',
  },
  {
    id: 'q-functioning',
    category: 'Symptoms & Impact',
    question:
      'How are avoidance, reassurance-seeking, or sleep disruption affecting my daily work, studies, or relationships?',
    whyHelpful:
      'Clarifies functional impact so treatment intensity can be matched appropriately.',
  },
  {
    id: 'q-erp-training',
    category: 'Therapy & ERP Questions',
    question:
      'What specific experience and training do you have delivering CBT with Exposure and Response Prevention (ERP) for OCD?',
    whyHelpful:
      'Ensures therapy includes active response prevention rather than unstructured reassurance.',
  },
  {
    id: 'q-options',
    category: 'Therapy & ERP Questions',
    question:
      'What are the expected benefits, limitations, and alternatives of the proposed treatment plan (therapy, medication, or combined care)?',
    whyHelpful:
      'Supports shared decision-making tailored to your preferences and circumstances.',
  },
  {
    id: 'q-med-timeline',
    category: 'Medication & Safety',
    question:
      'If medication is considered, how many weeks does an adequate trial take, and what should I do if side effects or distress become difficult?',
    whyHelpful:
      'Sets realistic timelines (often 8–12 weeks for SSRIs in OCD) and establishes a clear safety plan.',
  },
  {
    id: 'q-monitoring',
    category: 'Follow-Up & Review',
    question:
      'What follow-up schedule and monitoring will be available during the first weeks of care?',
    whyHelpful:
      'Establishes collaborative check-ins and support between appointments.',
  },
  {
    id: 'q-progress-review',
    category: 'Follow-Up & Review',
    question:
      'How will progress be reviewed, and what options exist if symptoms do not improve sufficiently after an initial trial?',
    whyHelpful:
      'Clarifies how treatment adjustments, combined care, or specialist referrals are considered.',
  },
];

/**
 * Pure validation helper used by automated tests to ensure every treatment entry
 * has complete fields, valid evidence labels, valid source references, and honest review status.
 */
export function validateTreatmentDataIntegrity(): {
  valid: boolean;
  errors: string[];
  entryCount: number;
  sourceCount: number;
} {
  const errors: string[] = [];
  const sourceIds = new Set(TREATMENT_SOURCES_REGISTRY.map((s) => s.id));

  for (const src of TREATMENT_SOURCES_REGISTRY) {
    if (!src.id || !src.organisationOrAuthors || !src.title || !src.canonicalUrl) {
      errors.push(`Source ${src.id || 'unknown'} is missing required metadata.`);
    }
    if (!src.canonicalUrl.startsWith('https://')) {
      errors.push(`Source ${src.id} URL must use HTTPS: ${src.canonicalUrl}`);
    }
    if (!src.dateChecked || !/^\d{4}-\d{2}-\d{2}$/.test(src.dateChecked)) {
      errors.push(`Source ${src.id} is missing a valid ISO dateChecked.`);
    }
    if (!Array.isArray(src.claimsSupported) || src.claimsSupported.length === 0) {
      errors.push(`Source ${src.id} must list at least one supported claim.`);
    }
  }

  for (const entry of TREATMENT_ENTRIES) {
    if (!entry.id || !entry.title || !entry.concise_summary || !entry.how_delivered) {
      errors.push(`Treatment entry ${entry.id || 'unknown'} is missing required summary fields.`);
    }
    if (!VALID_EVIDENCE_LEVELS.includes(entry.evidence_level)) {
      errors.push(`Treatment entry ${entry.id} has invalid evidence_level: ${entry.evidence_level}`);
    }
    if (
      entry.clinical_review_status !==
      'Prepared using evidence sources; clinical review pending'
    ) {
      errors.push(
        `Treatment entry ${entry.id} must use honest clinical_review_status.`
      );
    }
    if (!entry.intended_population || entry.intended_population.trim().length < 15) {
      errors.push(`Treatment entry ${entry.id} must specify intended_population.`);
    }
    if (!Array.isArray(entry.detailed_explanation) || entry.detailed_explanation.length === 0) {
      errors.push(`Treatment entry ${entry.id} must have detailed_explanation paragraphs.`);
    }
    if (!Array.isArray(entry.possible_benefits) || entry.possible_benefits.length === 0) {
      errors.push(`Treatment entry ${entry.id} must list possible_benefits.`);
    }
    if (!Array.isArray(entry.limitations) || entry.limitations.length === 0) {
      errors.push(`Treatment entry ${entry.id} must list limitations.`);
    }
    if (!Array.isArray(entry.safety_notes) || entry.safety_notes.length === 0) {
      errors.push(`Treatment entry ${entry.id} must list safety_notes.`);
    }
    if (!Array.isArray(entry.clinician_questions) || entry.clinician_questions.length === 0) {
      errors.push(`Treatment entry ${entry.id} must list clinician_questions.`);
    }
    if (!Array.isArray(entry.source_ids) || entry.source_ids.length === 0) {
      errors.push(`Treatment entry ${entry.id} must reference at least one source_id.`);
    } else {
      for (const sid of entry.source_ids) {
        if (!sourceIds.has(sid)) {
          errors.push(`Treatment entry ${entry.id} references unknown source_id: ${sid}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    entryCount: TREATMENT_ENTRIES.length,
    sourceCount: TREATMENT_SOURCES_REGISTRY.length,
  };
}
