import React, { useState } from 'react';
import {
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Heart,
  Wind,
  Users,
  BookOpen,
  Compass,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  Lock,
  RefreshCw,
  Brain,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  OCD_SYMPTOMS,
  WELLBEING_PATHWAYS,
  INITIAL_COMMUNITY_STORIES,
} from '../data/restlessMindData';
import { CrisisRegionCode, getCrisisResourcesByRegion } from '../lib/wellbeingLogic';
import OcdErpSimulator from '../components/OcdErpSimulator';
import InteractiveClarityHero from '../components/InteractiveClarityHero';

interface HomePageProps {
  onNavigate: (path: string) => void;
  region: CrisisRegionCode;
  onRegionChange: (region: CrisisRegionCode) => void;
}

const SYMPTOM_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  checking: Sliders,
  cleaning: Sparkles,
  intrusive: Brain,
  guilt: Heart,
  rituals: RefreshCw,
  fear: AlertCircle,
};

export default function HomePage({ onNavigate, region, onRegionChange }: HomePageProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>('checking');
  const [activePathwayId, setActivePathwayId] = useState<string>('ocd');

  const activePathway =
    WELLBEING_PATHWAYS.find((p) => p.id === activePathwayId) || WELLBEING_PATHWAYS[0];
  const crisisInfo = getCrisisResourcesByRegion(region);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  const platformFeatures = [
    {
      title: 'Understanding Treatment (CBT, ERP, ACT & Medications)',
      description:
        'Explore evidence-based OCD and anxiety care—including interactive CBT and ERP diagrams, SSRIs, clomipramine, specialist options, and clinician questions.',
      meta: 'NICE CG31 · NHS · IOCDF · Interactive Explorer',
      href: '/treatment',
      icon: ShieldCheck,
    },
    {
      title: '4-7-8 Paced Breathing',
      description:
        'Guided 19-second respiratory rhythm with optional soft chime, voice cues, and ambient soundscapes to settle acute physiological arousal.',
      meta: 'Interactive Timer · Opt-In Audio · Reduced-Motion Safe',
      href: '/tools?tab=breathing',
      icon: Wind,
    },
    {
      title: 'Thought & ERP Reflection Journal',
      description:
        'Observe intrusive thoughts and urges without performing compulsions. Edit, search, and store privately in your browser.',
      meta: 'Local-First Storage · Inline Edit & Erase',
      href: '/tools?tab=journal',
      icon: BookOpen,
    },
    {
      title: 'Mood, Stress & Sleep Check-Ins',
      description:
        'Track daily patterns across mood, overwhelm, and sleep duration with personal insights and Open mHealth JSON export.',
      meta: 'Open mHealth Standard · Real Pattern Insights',
      href: '/tools?tab=checkin',
      icon: CalendarCheck,
    },
    {
      title: 'Scoped AI Appointment Guide',
      description:
        'Organize non-diagnostic concerns and prepare structured questions for a clinician with OCD anti-reassurance safeguards.',
      meta: 'Non-Diagnostic · Anti-Reassurance Guard',
      href: '/tools?tab=ai-prep',
      icon: Sparkles,
    },
    {
      title: '5-4-3-2-1 Sensory Grounding',
      description:
        'Step-by-step interactive sensory walkthrough with custom visual anchors to return attention to the present room.',
      meta: 'Guided Stepper + Completion Summary',
      href: '/tools?tab=grounding',
      icon: Compass,
    },
  ];

  return (
    <div>
      {/* 1. Art-Directed Interactive Clarity Horizon & Constellation Hero */}
      <InteractiveClarityHero onNavigate={onNavigate} />

      {/* 2. How the Platform Works & Trust/Privacy Architecture */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-primary mb-2">How Restless Mind Works</p>
            <h2 className="heading-lg mb-3">Three structured steps from overwhelm to informed support</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Use the platform at your own pace—whether you are trying to make sense of repetitive doubts for the first time or preparing notes for a specialist appointment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-xs font-mono tabular-nums font-semibold text-primary mb-2">01. Understand</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Recognize Patterns Without Self-Blame</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Read plain-language guides on how the OCD cycle and anxiety loops operate, why intrusive thoughts stick, and how Exposure and Response Prevention (ERP) helps reduce compulsive urgency.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-xs font-mono tabular-nums font-semibold text-primary mb-2">02. Practice</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Use Distraction-Free Daily Tools</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practice 4-7-8 breathing, 5-4-3-2-1 sensory grounding, daily mood/stress/sleep check-ins, and non-compulsive thought journaling stored strictly on your device.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-xs font-mono tabular-nums font-semibold text-primary mb-2">03. Connect</p>
              <h3 className="text-lg font-bold text-foreground mb-2">Prepare for Qualified Human Care</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate structured questions for a psychologist or psychiatrist, download a plain-text appointment prep sheet, and locate affordable public or NGO mental-health services.
              </p>
            </div>
          </div>

          {/* Feature Cards for Existing Tools & Resources */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h3 className="heading-md">Tools &amp; Educational Resources</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Every tool is free, works without an account, and respects your privacy.
                </p>
              </div>
              <a
                href="/tools"
                onClick={(e) => handleLink(e, '/tools')}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Open All Wellness Tools
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {platformFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <a
                    key={feat.title}
                    href={feat.href}
                    onClick={(e) => handleLink(e, feat.href)}
                    className="card-hover flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary mb-4">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <h4 className="font-bold text-foreground text-base mb-2 group-hover:text-primary smooth-transition">
                        {feat.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {feat.description}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground pt-3 border-t border-border">
                      {feat.meta}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Accurate Trust & Privacy Architecture Banner */}
          <div className="bg-secondary border border-border rounded-2xl p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <Lock size={15} aria-hidden="true" />
                <span>Transparent Privacy &amp; Data Ownership</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Your journals and check-ins stay on your device unless you choose to export them.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thought journal entries and daily check-ins are saved in your browser&apos;s <code className="font-mono text-xs">localStorage</code> only when you enable consent. Community story submissions automatically redact accidental phone numbers and email addresses, and you can export or permanently erase your local data at any time.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-wrap md:justify-end gap-3">
              <a
                href="/privacy"
                onClick={(e) => handleLink(e, '/privacy')}
                className="button-secondary text-xs py-2.5 px-4 whitespace-nowrap"
              >
                Review Privacy &amp; Data Controls
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Symptom Discovery Section */}
      <section id="symptoms" className="py-16 md:py-20 bg-secondary/60 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-primary mb-2">Common OCD &amp; Anxiety Patterns</p>
            <h2 className="heading-lg mb-3">Do any of these experiences feel familiar?</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Select any card below to read why this pattern happens and how Exposure and Response Prevention (ERP) approaches it gently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {OCD_SYMPTOMS.map((symptom) => {
              const isExpanded = selectedSymptom === symptom.id;
              const SymptomIcon = SYMPTOM_ICON_MAP[symptom.id] || Compass;
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => setSelectedSymptom(isExpanded ? null : symptom.id)}
                  aria-expanded={isExpanded}
                  className={`text-left card-hover w-full ${
                    isExpanded ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <SymptomIcon size={20} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-foreground text-base md:text-lg">{symptom.title}</h3>
                        <span className="text-xs font-semibold text-primary shrink-0">
                          {isExpanded ? 'Hide details' : 'Read perspective'}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-3 space-y-3 animate-slide-in-up">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {symptom.description}
                          </p>
                          <div className="bg-secondary rounded-xl p-3.5 border border-border">
                            <p className="text-xs text-foreground leading-relaxed">
                              <strong>Evidence-Informed ERP Perspective:</strong> {symptom.erpTip}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-7">
            <div className="flex items-start gap-3.5">
              <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-foreground text-base mb-1">A compassionate reminder</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Experiencing intrusive thoughts or urges to check does not reflect your character or intentions. While these descriptions are educational and not a clinical diagnosis, structured therapies such as ERP and CBT help people respond differently to uncertainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Whole-Person Wellbeing Pathways */}
      <section id="pathways" className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <p className="text-xs font-semibold text-primary mb-2">Whole-Person Context</p>
            <h2 className="heading-lg mb-3">Inclusive Mental &amp; Physical Wellbeing Pathways</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Anxiety and intrusive thoughts often intersect with sleep, burnout, neurodiversity (ADHD &amp; Autism), and hormonal health (including PCOS/PCOD). Explore non-diagnostic guidance across each area:
            </p>
          </div>

          {/* Segmented Pathway Filter Bar */}
          <div
            role="tablist"
            aria-label="Mental wellbeing pathways"
            className="flex flex-wrap gap-2 mb-8"
          >
            {WELLBEING_PATHWAYS.map((pathway) => {
              const isSelected = pathway.id === activePathway.id;
              return (
                <button
                  key={pathway.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActivePathwayId(pathway.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 smooth-transition cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-foreground border border-border hover:bg-secondary'
                  }`}
                >
                  {pathway.title}
                </button>
              );
            })}
          </div>

          {/* Active Pathway Card */}
          <div
            role="tabpanel"
            className="bg-card border border-border rounded-2xl p-6 md:p-9 shadow-xs animate-slide-in-up"
          >
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-xs font-semibold text-primary mb-1">{activePathway.subtitle}</p>
              <h3 className="heading-md mb-2">{activePathway.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {activePathway.summary}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm md:text-base">
                  <Compass size={18} className="text-primary" aria-hidden="true" />
                  Common Experiences (Non-Diagnostic)
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {activePathway.whatItFeelsLike.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-primary font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm md:text-base">
                  <CheckCircle size={18} className="text-primary" aria-hidden="true" />
                  Practical Next Steps &amp; Platform Tools
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {activePathway.practicalSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono tabular-nums text-primary font-semibold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-4 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong className="text-foreground">Recommended Care Route:</strong>{' '}
                  {activePathway.professionalRoute}
                </p>
                <p>
                  <strong className="text-foreground">Scope Boundary:</strong>{' '}
                  {activePathway.disclaimerNote}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href="/tools"
                  onClick={(e) => handleLink(e, '/tools')}
                  className="button-primary text-xs py-2 px-4 whitespace-nowrap"
                >
                  Open Daily Tools
                </a>
                <a
                  href="/resources"
                  onClick={(e) => handleLink(e, '/resources')}
                  className="button-secondary text-xs py-2 px-4 whitespace-nowrap"
                >
                  Find Specialists
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive OCD Cycle & ERP Habituation Simulator Section */}
      <section id="ocd-cycle" className="py-16 md:py-20 bg-secondary/60 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold text-primary mb-2">Interactive Visual Guide · Mechanism of the Loop</p>
            <h2 className="heading-lg mb-3">Explore the 5-Stage OCD Cycle &amp; ERP Habituation</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Compulsions and reassurance-seeking bring brief relief, which inadvertently teaches the brain that the intrusive thought was dangerous. Use the interactive simulator below to compare repeated rituals against Exposure and Response Prevention (ERP).
            </p>
          </div>

          <OcdErpSimulator onNavigate={onNavigate} />
        </div>
      </section>

      {/* 6. Community Stories Preview */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-primary mb-2">Peer Reflections</p>
              <h2 className="heading-lg">Lived Experiences from the Community</h2>
            </div>
            <a
              href="/stories"
              onClick={(e) => handleLink(e, '/stories')}
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              View &amp; Share Stories
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {INITIAL_COMMUNITY_STORIES.slice(0, 3).map((story) => (
              <div
                key={story.id}
                className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {story.author} · {story.category}
                  </p>
                  <p className="text-sm text-foreground/90 mb-5 italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-border pt-3.5">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Reflection:</strong> {story.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Verified Location-Aware Crisis Resources Section */}
      <section className="py-14 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-destructive shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">
                  Need Immediate Human Crisis Support?
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Restless Mind does not monitor emergencies. Connect with verified 24/7 crisis counselors in your region:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="home-crisis-region" className="text-xs font-semibold text-muted-foreground">
                Location:
              </label>
              <select
                id="home-crisis-region"
                value={region}
                onChange={(e) => onRegionChange(e.target.value as CrisisRegionCode)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-card text-foreground"
              >
                <option value="IN">India (Tele-MANAS / iCall / NIMHANS)</option>
                <option value="US">United States &amp; Canada (988)</option>
                <option value="UK">United Kingdom (NHS 111 / Samaritans)</option>
                <option value="GLOBAL">International Directory</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {crisisInfo.helplines.map((helpline) => (
              <div
                key={helpline.name}
                className="bg-card rounded-2xl p-5 border border-border flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-foreground text-sm mb-0.5">{helpline.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {helpline.organization} · {helpline.hours}
                  </p>
                  <p className="text-destructive font-mono tabular-nums font-bold text-base mb-2 inline-flex items-center gap-1.5">
                    <PhoneCall size={15} aria-hidden="true" />
                    {helpline.phone}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {helpline.description}
                  </p>
                </div>
                <a
                  href={helpline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Official Helpline Portal
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
