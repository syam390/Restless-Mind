export interface SymptomCardItem {
  id: string;
  title: string;
  description: string;
  erpTip: string;
  icon: string;
}

export const OCD_SYMPTOMS: SymptomCardItem[] = [
  {
    id: 'checking',
    title: 'I keep checking things repeatedly',
    description:
      'Checking doors, locks, appliances, messages, or switches over and over can become exhausting. Many people do this to reduce worry about harm or mistakes.',
    erpTip:
      'Practice "check once mindfully, then walk away"—notice the urge to re-check as a false alarm rather than a command.',
    icon: '🔍',
  },
  {
    id: 'cleaning',
    title: 'I wash or clean again and again',
    description:
      'Washing hands, showering, or sanitizing objects repeatedly—even when you logically know they are clean. This often stems from contamination fears or feeling "not quite right."',
    erpTip:
      'Gradually shorten washing time or delay re-washing by a few minutes while allowing the discomfort to naturally peak and fade.',
    icon: '🧼',
  },
  {
    id: 'intrusive',
    title: "Thoughts I don't want keep coming back",
    description:
      "Unwanted thoughts, images, or urges that feel scary, disturbing, or opposite to your values. These are called ego-dystonic intrusive thoughts—having them does not mean you want to act on them.",
    erpTip:
      'Label the thought gently ("I am having an intrusive thought") instead of arguing with it or trying to force it out of your mind.',
    icon: '💭',
  },
  {
    id: 'guilt',
    title: 'I feel guilty about certain thoughts',
    description:
      'Feeling intense shame, responsibility, or moral anxiety about thoughts you have—even though thoughts are not actions. OCD frequently targets the values and people you care about most.',
    erpTip:
      'Remind yourself: thoughts are automatic mental events, not moral choices. Avoid confessing or seeking reassurance to erase guilt.',
    icon: '💔',
  },
  {
    id: 'rituals',
    title: 'I repeat prayers, counting, or mental actions',
    description:
      'Repeating specific words, numbers, silent prayers, mental reviews, or ordering rituals to neutralize anxiety or prevent something bad from happening.',
    erpTip:
      'Notice invisible "mental compulsions" (like replaying memories) just like physical rituals, and practice letting thoughts pass unreviewed.',
    icon: '🔄',
  },
  {
    id: 'fear',
    title: 'I fear something bad may happen unless I feel certain',
    description:
      'Excessive worry that something terrible will occur if you do not do things "just right" or achieve 100% certainty. This urgent need for certainty drives the anxiety loop.',
    erpTip:
      'Practice tolerating small everyday uncertainties ("Maybe, maybe not") to retrain your brain\'s threat detector.',
    icon: '⚠️',
  },
];

export const OCD_CYCLE_STAGES = [
  {
    step: 'Intrusive Thought',
    emoji: '💭',
    description: 'An unwanted thought, image, or doubt appears automatically.',
  },
  {
    step: 'Fear & Distress',
    emoji: '😰',
    description: 'Your brain treats the thought as a real danger and triggers alarm.',
  },
  {
    step: 'Compulsion / Reassurance',
    emoji: '🔄',
    description: 'You check, wash, avoid, or ask for reassurance to feel safe.',
  },
  {
    step: 'Temporary Relief',
    emoji: '😌',
    description: 'Anxiety drops briefly—teaching the brain it "needed" the ritual.',
  },
  {
    step: 'Cycle Repeats Stronger',
    emoji: '🔁',
    description: 'Doubt returns louder, requiring more rituals next time.',
  },
];

export interface WellbeingPathway {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  whatItFeelsLike: string[];
  practicalSteps: string[];
  professionalRoute: string;
  disclaimerNote: string;
}

export const WELLBEING_PATHWAYS: WellbeingPathway[] = [
  {
    id: 'ocd',
    title: 'OCD & Intrusive Thoughts',
    subtitle: 'Obsessions, physical rituals & mental checking',
    summary:
      'Obsessive-Compulsive Disorder involves unwanted, distressing thoughts (obsessions) and repetitive physical or mental actions (compulsions) aimed at reducing uncertainty or dread.',
    whatItFeelsLike: [
      'Urgent need for 100% certainty about safety, morality, health, or relationships',
      'Repetitive checking, washing, counting, confessing, or mental reviewing',
      'Distressing thoughts that clash with your core values (ego-dystonic thoughts)',
    ],
    practicalSteps: [
      'Learn how Exposure and Response Prevention (ERP) breaks the compulsion loop',
      'Avoid compulsive reassurance-seeking ("Are you sure nothing bad happened?")',
      'Use the Thought Journal to observe triggers without performing rituals',
    ],
    professionalRoute:
      'Clinical Psychologist or Psychiatrist trained in Exposure and Response Prevention (ERP) and CBT for OCD.',
    disclaimerNote:
      'Educational information only—only a qualified clinician can diagnose OCD.',
  },
  {
    id: 'anxiety',
    title: 'Anxiety & Excessive Worry',
    subtitle: 'Persistent worry, restlessness & physical tension',
    summary:
      'Anxiety becomes difficult when worry feels constant, hard to control, and shows up in your body as a racing heart, tight chest, stomach discomfort, or constant "what-if" scenarios.',
    whatItFeelsLike: [
      'Jumping from one "what-if" catastrophe to the next',
      'Physical restlessness, muscle tension, shallow breathing, or racing heart',
      'Avoiding everyday situations out of fear of panic or embarrassment',
    ],
    practicalSteps: [
      'Practice the 4-7-8 Breathing Exercise or 5-4-3-2-1 Grounding when physical alarm spikes',
      'Schedule a bounded 15-minute "Worry Window" rather than fighting worries all day',
      'Gradually approach avoided tasks in small, manageable steps',
    ],
    professionalRoute:
      'Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), or psychiatric consultation.',
    disclaimerNote:
      'These tools support self-regulation and are not a clinical diagnosis of Generalized Anxiety or Panic Disorder.',
  },
  {
    id: 'stress-low-mood',
    title: 'Stress, Overwhelm & Low Mood',
    subtitle: 'Emotional exhaustion, academic/work pressure & sadness',
    summary:
      'Prolonged stress, caregiving, academic or financial pressure, and isolation can leave you feeling emotionally numb, exhausted, tearful, or disconnected from things you used to enjoy.',
    whatItFeelsLike: [
      'Feeling drained even after resting, or losing interest in hobbies and social contact',
      'Difficulty concentrating, irritability, or feeling like small tasks take huge effort',
      'Persistent heaviness, self-criticism, or hopelessness about the future',
    ],
    practicalSteps: [
      'Try Behavioral Activation: pick one tiny, low-pressure nourishing activity each day',
      'Track your daily mood and energy in the Daily Check-In to spot draining patterns',
      'Reach out to a trusted friend, counselor, or helpline before exhaustion deepens',
    ],
    professionalRoute:
      'Counseling Psychologist, CBT/Interpersonal Therapy (IPT), or public tele-mental health (Tele-MANAS 14416).',
    disclaimerNote:
      'If low mood is accompanied by thoughts of self-harm, please use the Crisis Support numbers immediately.',
  },
  {
    id: 'sleep',
    title: 'Sleep & Racing Mind at Night',
    subtitle: 'Difficulty falling asleep, nighttime rumination & fatigue',
    summary:
      'Sleep and mental wellbeing are deeply linked. A restless mind often gets louder at night when daytime distractions fade, creating a frustrating cycle of exhaustion and worry about not sleeping.',
    whatItFeelsLike: [
      'Lying awake replaying conversations or worrying about tomorrow',
      'Waking up unrefreshed or experiencing fragmented sleep during stressful weeks',
      'Dreading bedtime because the bed has become associated with frustration',
    ],
    practicalSteps: [
      'Do a "Brain Dump" in the Thought Journal 60 minutes before bed to park unfinished worries',
      'If awake for >20 minutes feeling frustrated, step into dim light for a quiet activity until sleepy',
      'Keep wake-up times consistent and use 4-7-8 breathing to lower heart rate before sleep',
    ],
    professionalRoute:
      'CBT for Insomnia (CBT-I) specialist, General Physician, or Mental Health Professional.',
    disclaimerNote:
      'Persistent sleep disturbances can have physical or respiratory causes; consult a medical doctor.',
  },
  {
    id: 'neurodiversity',
    title: 'ADHD & Autism Support Navigation',
    subtitle: 'Executive function, sensory overload & neuro-affirming care',
    summary:
      'Many people experiencing anxiety or overwhelm also navigate attention differences, executive dysfunction, or sensory sensitivities associated with ADHD or Autism.',
    whatItFeelsLike: [
      'Task paralysis, time blindness, or difficulty starting tasks despite caring deeply',
      'Sensory overwhelm from loud environments, crowded spaces, or sudden routine changes',
      'Exhaustion from "masking" or trying to fit neurotypical expectations all day',
    ],
    practicalSteps: [
      'Use external scaffolding: body-doubling, visual timers, and breaking tasks into 5-minute micro-steps',
      'Build sensory recovery breaks (quiet space, noise reduction, predictable transitions) into your day',
      'Use our Appointment Prep tool to list lifelong patterns if seeking a formal specialist evaluation',
    ],
    professionalRoute:
      'Neuro-affirming Clinical Psychologist or Psychiatrist qualified in adult/adolescent ADHD and Autism assessment.',
    disclaimerNote:
      'Important: Restless Mind cannot screen for or confirm ADHD or Autism. Formal evaluation requires a qualified specialist.',
  },
  {
    id: 'whole-person-pcos',
    title: 'Physical & Hormonal Wellbeing (PCOS/PCOD & Body-Mind)',
    subtitle: 'How hormonal, thyroid & physical health interact with mood',
    summary:
      'Mental wellbeing does not exist separately from the body. Conditions like PCOS/PCOD, thyroid imbalances, nutritional deficiencies (Vitamin D/B12, iron), and chronic pain frequently impact mood, anxiety, energy, and body image.',
    whatItFeelsLike: [
      'Heightened anxiety, mood swings, or fatigue linked with hormonal cycles or PCOS/PCOD symptoms',
      'Stress around physical symptoms, medical appointments, or societal pressure',
      'Wondering whether exhaustion and anxiety have both physical and emotional roots',
    ],
    practicalSteps: [
      'Coordinate whole-person care: share both emotional changes and physical symptoms with your doctor',
      'Replace harsh self-blame with compassionate pacing, gentle movement, and regular nourishment',
      'Prepare combined questions for your Gynecologist/Endocrinologist and Mental Health Counselor',
    ],
    professionalRoute:
      'Gynecologist / Endocrinologist / General Physician alongside a Mental Health Professional.',
    disclaimerNote:
      'PCOS/PCOD is an endocrine/metabolic health condition, not a mental-health disorder—always consult qualified medical clinicians.',
  },
];

export interface StoryItem {
  id: string;
  quote: string;
  author: string;
  highlight: string;
  category: string;
  status?: 'published' | 'pending_moderation';
}

export const INITIAL_COMMUNITY_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    quote:
      "I thought I was losing my mind. The intrusive thoughts were so disturbing that I couldn't function. After therapy, I learned these thoughts don't define me.",
    author: 'Anonymous',
    highlight: 'Now I can observe my thoughts without being controlled by them.',
    category: 'Intrusive Thoughts',
    status: 'published',
  },
  {
    id: 'story-2',
    quote:
      "I spent hours checking things and couldn't leave my house without reassurance. ERP therapy changed my life completely.",
    author: 'Anonymous',
    highlight: "I'm slowly reclaiming my life.",
    category: 'Checking OCD',
    status: 'published',
  },
  {
    id: 'story-3',
    quote:
      "My family didn't understand why I was washing my hands so much. Finding this site helped me explain what I was experiencing to them.",
    author: 'Anonymous',
    highlight: 'Now they support my recovery journey.',
    category: 'Family & Support',
    status: 'published',
  },
  {
    id: 'story-4',
    quote:
      'I was diagnosed late because I felt too ashamed to tell anyone. Early recognition could have saved me years of suffering.',
    author: 'Anonymous',
    highlight: 'I wish I had found help sooner.',
    category: 'Early Recognition',
    status: 'published',
  },
  {
    id: 'story-5',
    quote:
      'The most powerful moment was when my therapist explained the OCD cycle. Understanding it gave me hope that recovery was possible.',
    author: 'Anonymous',
    highlight: 'Knowledge truly is power.',
    category: 'Understanding OCD',
    status: 'published',
  },
  {
    id: 'story-6',
    quote:
      'I\'m not "cured" but I\'m recovering. Some days are harder than others, but I\'m learning to live with uncertainty.',
    author: 'Anonymous',
    highlight: "Recovery isn't perfection—it's progress.",
    category: 'Living with Uncertainty',
    status: 'published',
  },
];

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  keyTakeaways: string[];
  content: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'what-is-ocd',
    title: 'What is OCD? Understanding the Basics',
    excerpt:
      'Obsessive-Compulsive Disorder (OCD) is more than just being organized or clean. Learn what OCD really is and how it differs from everyday habits.',
    date: 'Evidence Guide · Clinical review pending',
    readTime: '5 min read',
    category: 'OCD Fundamentals',
    keyTakeaways: [
      'OCD consists of two parts: distressing obsessions and repetitive compulsions (physical or mental).',
      'OCD thoughts are ego-dystonic—they target the very things you value and care about most.',
      'Compulsions bring short-term relief but strengthen the brain’s false alarm over time.',
    ],
    content: [
      'In everyday conversation, people sometimes say "I\'m so OCD" when they like a tidy desk. In reality, Obsessive-Compulsive Disorder is a serious, exhausting, and highly treatable condition driven by a misfiring threat-detection loop in the brain.',
      'Obsessions are repeated, unwanted thoughts, urges, or mental images that trigger intense anxiety, guilt, or disgust. Common themes include fear of contamination, fear of causing harm by accident, taboo religious or moral doubts (scrupulosity), relationship doubts, or needing things to feel "just right."',
      'Compulsions are repetitive behaviors or mental acts that a person feels driven to perform in response to an obsession. These include visible actions—like checking locks, washing hands, or repeating routines—as well as invisible mental compulsions like silent counting, replaying memories to be sure you did nothing wrong, or repeatedly asking loved ones for reassurance.',
      'Because compulsions temporarily lower anxiety, the brain mistakenly learns that the ritual "saved" you. Evidence-based therapies help you gently step out of this loop so your brain learns you are safe even without rituals.',
    ],
  },
  {
    id: 'erp-therapy-explained',
    title: 'Breaking the Cycle: How ERP Therapy Works',
    excerpt:
      'Exposure and Response Prevention (ERP) is the gold standard psychological treatment for OCD. Discover how this collaborative therapy helps people recover.',
    date: 'Treatment Guide · Clinical review pending',
    readTime: '7 min read',
    category: 'Therapy & Recovery',
    keyTakeaways: [
      'ERP stands for Exposure (facing triggers gradually) and Response Prevention (choosing not to do the compulsion).',
      'ERP is always collaborative and paced—you never start with your hardest fear.',
      'Over time, your nervous system learns habituation and inhibitory learning: uncertainty becomes tolerable.',
    ],
    content: [
      'Exposure and Response Prevention (ERP) is a specialized form of Cognitive Behavioral Therapy (CBT) backed by decades of clinical research for OCD.',
      'In ERP, "Exposure" means gradually, intentionally approaching thoughts, images, objects, or situations that trigger anxious doubt—starting with manageable steps on a personalized hierarchy you build with your therapist.',
      '"Response Prevention" means making the conscious choice not to perform the compulsive ritual, check, or reassurance request after the trigger appears.',
      'When you resist the compulsion, anxiety naturally rises like a wave, peaks, and eventually subsides on its own. More importantly, your brain forms new learning: "I can handle discomfort and uncertainty without needing a ritual to stay safe."',
    ],
  },
  {
    id: 'intrusive-vs-real-thoughts',
    title: "Intrusive Thoughts vs. Real Intentions: What's the Difference?",
    excerpt:
      'One of the most confusing parts of OCD and anxiety is dealing with unwanted thoughts. Learn why having an intrusive thought never equals wanting to act on it.',
    date: 'Psychoeducation · Clinical review pending',
    readTime: '6 min read',
    category: 'Intrusive Thoughts',
    keyTakeaways: [
      'Cross-cultural psychological research (e.g., Radomsky et al., 2014) shows that the vast majority of people experience occasional unwanted intrusive thoughts.',
      'Intrusive thoughts cause distress precisely because they conflict with your true values.',
      'Trying to suppress a thought ("don\'t think of a white bear") makes it rebound more frequently.',
    ],
    content: [
      'International psychological studies (including research by Rachman & de Silva and the International Intrusive Thoughts Consortium, Radomsky et al., 2014) show that most people in the general population experience occasional strange, sudden, or unwanted thoughts—such as a sudden image of swerving a car or blurting out something inappropriate.',
      'Most people dismiss these thoughts as random "mental spam." However, if you are prone to OCD or high anxiety, you may interpret the mere presence of the thought as dangerous or morally meaningful ("Why would I think that? Does this mean I am dangerous?").',
      'Clinicians call intrusive thoughts "ego-dystonic," meaning they are the exact opposite of who you are. A gentle, caring parent may have intrusive fears of harming their child precisely because protecting their child matters more to them than anything else.',
      'The most helpful skill is not arguing with the thought or proving it wrong, but noticing it like a passing train: "That is an intrusive thought. I don\'t need to analyze or check it."',
    ],
  },
  {
    id: 'supporting-a-loved-one',
    title: 'Supporting a Loved One with OCD Without Enabling Compulsions',
    excerpt:
      "If someone you care about has OCD or severe anxiety, here's how to offer compassionate support while stepping out of the reassurance trap.",
    date: 'Family Guide · Clinical review pending',
    readTime: '8 min read',
    category: 'Family & Allies',
    keyTakeaways: [
      'Answering repeated reassurance questions feels kind in the moment, but feeds the OCD cycle.',
      'Validate the person’s emotion ("I see how exhausting this anxiety is") rather than answering the OCD question.',
      'Agree on supportive phrases in advance when everyone is calm.',
    ],
    content: [
      'When someone you love is panicking and asks, "Are you 100% sure I locked the door?" or "Do you promise I didn\'t offend them?", it is completely natural to want to reassure them.',
      'Unfortunately, in OCD, family accommodation and reassurance act like a compulsion. The relief lasts only minutes before the brain demands "Just ask one more time to be completely sure."',
      'Instead of answering the fear content, validate the feeling: "I know OCD is loud right now and this feels really scary. Because I love you, I\'m not going to answer the checking question, but I am happy to sit with you or take a walk together."',
      'Discuss these boundaries collaboratively during a calm moment—never abruptly in the middle of a panic spike—and celebrate small moments of courage.',
    ],
  },
  {
    id: 'anxiety-vs-ocd',
    title: 'Anxiety, OCD, Burnout & Whole-Person Wellbeing: Key Differences',
    excerpt:
      'While anxiety and OCD often co-exist, understanding how they differ—and how sleep, neurodiversity, and physical health interact—helps you find the right care.',
    date: 'Care Navigation · Clinical review pending',
    readTime: '6 min read',
    category: 'Whole-Person Health',
    keyTakeaways: [
      'General anxiety usually focuses on real-life stressors; OCD often involves specific obsessional doubts paired with rituals.',
      'Standard talk reassurance can sometimes worsen OCD if compulsions aren’t addressed.',
      'Physical factors like sleep deprivation, thyroid issues, or PCOS/PCOD can amplify emotional distress.',
    ],
    content: [
      'Generalized anxiety typically centers on everyday life concerns—work deadlines, family health, finances—accompanied by physical tension and restlessness. OCD, by contrast, is driven by a specific cycle of intrusive obsessions and neutralizing compulsions (physical or mental).',
      'Recognizing this distinction helps you ask for the right approach: while general stress responds well to relaxation and problem-solving, OCD responds best to Exposure and Response Prevention (ERP) where you practice resisting rituals.',
      'At the same time, mental wellbeing is connected to your whole body. Sleep loss, sensory overload (in ADHD or Autism), and hormonal or metabolic conditions (such as PCOS/PCOD or thyroid changes) can lower your nervous system\'s resilience. Looking at the whole picture without self-judgment helps you connect with the right medical and psychological professionals.',
    ],
  },
  {
    id: 'support-groups-and-care-india',
    title: 'Navigating Affordable Mental Health Care & Support in India',
    excerpt:
      'From public institutions like NIMHANS and Tele-MANAS (14416) to preparing for your first appointment, here is a practical roadmap to finding help.',
    date: 'Resource Guide · Clinical review pending',
    readTime: '5 min read',
    category: 'Care Navigation',
    keyTakeaways: [
      'India’s Mental Healthcare Act 2017 mandates insurance parity for mental health conditions.',
      'Tele-MANAS (14416) offers free, 24/7 government tele-counseling across 20+ Indian languages.',
      'Writing down 3–4 key examples and questions before an appointment reduces first-visit anxiety.',
    ],
    content: [
      'Seeking professional mental health support for the first time can feel intimidating, especially when you are unsure about costs, confidentiality, or what kind of specialist to visit.',
      'In India, public institutes such as NIMHANS (Bengaluru), IHBAS (Delhi), CIP (Ranchi), and Government Medical College psychiatry/clinical psychology departments provide low-cost or free evidence-based care. For immediate, free phone guidance in your regional language, the Government of India’s Tele-MANAS helpline (14416) operates 24/7.',
      'When booking a private or NGO-supported session, you can ask upfront: "Do you have experience working with OCD using ERP or CBT?" and "Do you offer sliding-scale fees for students or low-income clients?"',
      'Use our Appointment Preparation tool on the Daily Tools page to organize what you have been experiencing so you don\'t have to remember everything on the spot.',
    ],
  },
];

export interface VerifiedResourceItem {
  name: string;
  locationOrScope: string;
  description: string;
  contactOrPhone: string;
  url: string;
  costType: 'Free / Public' | 'Sliding Scale / NGO' | 'Global Directory';
}

export const GOVERNMENT_AND_PUBLIC_RESOURCES: VerifiedResourceItem[] = [
  {
    name: 'Tele-MANAS (National Tele Mental Health Programme)',
    locationOrScope: 'All-India (20+ Languages)',
    description:
      'Government of India (MoHFW) 24/7 free tele-mental health counselling and referral to District Mental Health Programme (DMHP) clinics.',
    contactOrPhone: '14416 or 1800-891-4416',
    url: 'https://telemanas.mohfw.gov.in',
    costType: 'Free / Public',
  },
  {
    name: 'NIMHANS — National Institute of Mental Health and Neurosciences',
    locationOrScope: 'Bengaluru, Karnataka & National Helpline',
    description:
      'India’s premier public institute with a dedicated OCD Clinic, Clinical Psychology & Psychiatry departments, and 24/7 psychosocial helpline.',
    contactOrPhone: '080-2699 5000 · Helpline: 080-4611 0007',
    url: 'https://nimhans.ac.in',
    costType: 'Free / Public',
  },
  {
    name: 'IHBAS — Institute of Human Behaviour and Allied Sciences',
    locationOrScope: 'New Delhi',
    description:
      'Public autonomous mental health and neurosciences hospital providing outpatient and specialized CBT/psychiatric care.',
    contactOrPhone: '011-2211 4021',
    url: 'https://ihbas.delhi.gov.in',
    costType: 'Free / Public',
  },
  {
    name: 'CIP — Central Institute of Psychiatry',
    locationOrScope: 'Ranchi, Jharkhand',
    description:
      'Central government premier mental health institute offering clinical psychology, behavioural therapy, and outpatient care.',
    contactOrPhone: '0651-245 1115',
    url: 'https://cipranchi.nic.in',
    costType: 'Free / Public',
  },
];

export const ONLINE_AND_NGO_RESOURCES: VerifiedResourceItem[] = [
  {
    name: 'iCall Psychosocial Helpline (TISS)',
    locationOrScope: 'India (Mon–Sat, 8 AM – 10 PM IST)',
    description:
      'Run by Tata Institute of Social Sciences (TISS). Free, confidential telephone and email counseling in multiple Indian languages.',
    contactOrPhone: '+91 91529 87821',
    url: 'https://icallhelpline.org',
    costType: 'Free / Public',
  },
  {
    name: 'International OCD Foundation (IOCDF)',
    locationOrScope: 'Global & India Resource Directory',
    description:
      'Evidence-based OCD education, ERP self-advocacy guides, support group listings, and specialist provider directory.',
    contactOrPhone: 'Online Directory & Guides',
    url: 'https://iocdf.org',
    costType: 'Global Directory',
  },
  {
    name: 'Sangath India',
    locationOrScope: 'Goa, Delhi, Bhopal & Online',
    description:
      'Award-winning Indian non-profit mental health research and care organization pioneering community-based psychological support.',
    contactOrPhone: '+91 78878 82019',
    url: 'https://sangath.in',
    costType: 'Sliding Scale / NGO',
  },
  {
    name: 'The Live Love Laugh Foundation — Therapist & Helpline Directory',
    locationOrScope: 'All-India Verified Directory',
    description:
      'Curated Indian directory of verified mental health professionals, free helplines, and stigma-reduction educational resources.',
    contactOrPhone: 'Verified Online Directory',
    url: 'https://www.thelivelovelaughfoundation.org/find-help',
    costType: 'Sliding Scale / NGO',
  },
];
