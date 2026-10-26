import React, { useState } from 'react';
import {
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Heart,
  Zap,
  Users,
  BookOpen,
  Compass,
  PhoneCall,
} from 'lucide-react';
import {
  OCD_SYMPTOMS,
  OCD_CYCLE_STAGES,
  WELLBEING_PATHWAYS,
  INITIAL_COMMUNITY_STORIES,
} from '../data/restlessMindData';
import { CrisisRegionCode, getCrisisResourcesByRegion } from '../lib/wellbeingLogic';

interface HomePageProps {
  onNavigate: (path: string) => void;
  region: CrisisRegionCode;
  onRegionChange: (region: CrisisRegionCode) => void;
}

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

  return (
    <div>
      {/* Hero Section preserving Restless Mind aesthetic */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 gradient-hero" />

        <svg
          className="absolute inset-0 -z-10 w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ba8ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#9ec5ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z"
            fill="url(#waveGrad)"
            opacity="0.5"
          />
        </svg>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-in-up">
              <p className="text-sm font-semibold text-primary mb-4">
                You&apos;re not alone · Earlier, safer mental-wellbeing support
              </p>
              <h1 className="heading-xl mb-6">
                When your mind feels loud, find peace here.
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                You are not your thoughts. <strong className="text-foreground">Restless Mind</strong> helps people understand repetitive fears, unwanted intrusive thoughts, compulsions, anxiety, and whole-person mental wellbeing with compassion.
              </p>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                A free, judgment-free, privacy-first space to recognize patterns early, practice evidence-informed grounding and journaling tools, and navigate affordable professional care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#symptoms"
                  className="button-primary inline-flex items-center justify-center whitespace-nowrap"
                >
                  Understand My Experiences
                  <ChevronRight size={18} className="ml-2" aria-hidden="true" />
                </a>
                <a
                  href="/tools"
                  onClick={(e) => handleLink(e, '/tools')}
                  className="button-secondary inline-flex items-center justify-center whitespace-nowrap"
                >
                  Open Daily Calm Tools
                  <ChevronRight size={18} className="ml-2" aria-hidden="true" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Free · Anonymous Option · Local-First Privacy · Verified India &amp; Global Helplines
              </p>
            </div>

            {/* Calm Interactive Overview Card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-2xl gradient-blue-soft flex items-center justify-center text-3xl shrink-0">
                  🧘
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Finding Calm &amp; Clarity Step by Step
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Non-diagnostic support designed to reduce shame and help you take practical next steps.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">1. Recognize Without Self-Judgment</p>
                    <p className="text-muted-foreground text-xs">
                      Explore OCD symptoms, anxiety, burnout, sleep, neurodiversity, and body-mind wellbeing pathways.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">2. Practice Evidence-Informed Daily Tools</p>
                    <p className="text-muted-foreground text-xs">
                      Use the interactive 4-7-8 breathing timer, 5-4-3-2-1 grounding, private thought journal, and daily check-in.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">3. Connect With Qualified Human Care</p>
                    <p className="text-muted-foreground text-xs">
                      Prepare questions for your first appointment and find verified public and affordable services (NIMHANS, Tele-MANAS 14416, iCall).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Discovery Section (Upgraded to Accessible Keyboard Buttons) */}
      <section id="symptoms" className="py-16 md:py-24 bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Do any of these feel familiar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Select any experience below to read why it happens and a gentle Exposure and Response Prevention (ERP) perspective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {OCD_SYMPTOMS.map((symptom) => {
              const isExpanded = selectedSymptom === symptom.id;
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
                    <span className="text-4xl shrink-0" aria-hidden="true">
                      {symptom.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-foreground text-lg">{symptom.title}</h3>
                        <span className="text-xs font-semibold text-primary shrink-0">
                          {isExpanded ? 'Hide details' : 'Learn more'}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-3 space-y-3 animate-slide-in-up">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {symptom.description}
                          </p>
                          <div className="bg-muted/70 rounded-xl p-3 border border-border">
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

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <CheckCircle size={24} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-foreground mb-2">What you should know:</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  These experiences are real, valid, and far more common than people realize. Experiencing intrusive thoughts or compulsions is not a sign of character weakness or danger—and Restless Mind does not diagnose conditions. Evidence-based therapies like ERP and CBT help people step out of this loop safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inclusive Whole-Person Wellbeing Pathways Section */}
      <section id="pathways" className="py-16 md:py-24 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading-lg mb-4">Inclusive Whole-Person Wellbeing Pathways</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mental wellbeing goes beyond a single label. Explore non-diagnostic educational guidance and care routes across OCD, anxiety, stress, sleep, neurodiversity (ADHD &amp; Autism), and body-mind health (including PCOS/PCOD).
            </p>
          </div>

          {/* Segmented Pathway Filter Bar */}
          <div
            role="tablist"
            aria-label="Mental wellbeing pathways"
            className="flex flex-wrap gap-2 justify-center mb-8"
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
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 smooth-transition ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-foreground border border-border hover:bg-accent/50'
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
            className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs animate-slide-in-up"
          >
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-xs font-semibold text-primary mb-1">{activePathway.subtitle}</p>
              <h3 className="heading-md mb-3">{activePathway.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{activePathway.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-base">
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
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-base">
                  <CheckCircle size={18} className="text-primary" aria-hidden="true" />
                  Practical Next Steps &amp; Platform Tools
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {activePathway.practicalSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-primary font-bold">{idx + 1}.</span>
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

      {/* OCD Cycle Section */}
      <section id="ocd-cycle" className="py-16 md:py-24 bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Understanding the OCD Cycle</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              OCD works in a repeating loop. Understanding why compulsions and reassurance only give brief relief is the first step toward breaking free.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {OCD_CYCLE_STAGES.map((stage, index) => (
              <div key={stage.step} className="relative bg-card border border-border rounded-2xl p-5 text-center">
                <div className="w-16 h-16 mx-auto rounded-full gradient-blue-soft flex items-center justify-center text-3xl mb-4 shadow-xs">
                  {stage.emoji}
                </div>
                <p className="text-xs font-mono tabular-nums text-primary font-semibold mb-1">
                  Stage 0{index + 1}
                </p>
                <h3 className="font-bold text-foreground mb-2 text-sm">{stage.step}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-10 text-center border border-border">
            <p className="text-xs font-semibold text-primary mb-2">
              Evidence-Informed Care · Exposure &amp; Response Prevention (ERP)
            </p>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              How Recovery Works: Stepping Out of the Compulsion Loop
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Exposure and Response Prevention (ERP) therapy helps you gradually face intrusive doubts while choosing not to perform compulsions or reassurance checks. Over time, your brain learns that uncertainty is tolerable and the alarm naturally quiets down.
            </p>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-16 md:py-24 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Stories from People Like You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              You are not alone in this. Read lived experiences from people navigating intrusive thoughts and anxiety.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {INITIAL_COMMUNITY_STORIES.slice(0, 3).map((story) => (
              <div
                key={story.id}
                className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {story.author} · {story.category}
                  </p>
                  <p className="text-foreground/90 mb-6 italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Reflection:</strong> {story.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-secondary border border-border rounded-2xl p-8">
            <p className="text-muted-foreground mb-4 text-base">
              Have a reflection to share with the community? All stories go through safety moderation and can be submitted anonymously.
            </p>
            <a
              href="/stories"
              onClick={(e) => handleLink(e, '/stories')}
              className="button-primary inline-flex items-center"
            >
              Read &amp; Share Stories Anonymously
              <ChevronRight size={18} className="ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-secondary border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-lg mb-4">Ready to take a gentle next step?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
            Whether you want to practice a 4-7-8 breathing exercise, write in your private local journal, prepare questions for a doctor, or find a public hospital clinic—choose what fits today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <a
              href="/tools"
              onClick={(e) => handleLink(e, '/tools')}
              className="button-primary inline-flex items-center justify-center"
            >
              Try Daily Calm Tools
              <Zap size={18} className="ml-2" aria-hidden="true" />
            </a>
            <a
              href="/resources"
              onClick={(e) => handleLink(e, '/resources')}
              className="button-secondary inline-flex items-center justify-center"
            >
              Find Verified Help
              <Users size={18} className="ml-2" aria-hidden="true" />
            </a>
            <a
              href="/blog"
              onClick={(e) => handleLink(e, '/blog')}
              className="button-secondary inline-flex items-center justify-center"
            >
              Read Educational Guides
              <BookOpen size={18} className="ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Verified Location-Aware Emergency Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={26} className="text-destructive shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  If you are in immediate crisis or having thoughts of self-harm
                </h2>
                <p className="text-sm text-muted-foreground">
                  Restless Mind cannot monitor emergencies. Connect immediately with verified human crisis counselors in your region:
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
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-secondary text-foreground"
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
                className="bg-secondary rounded-2xl p-5 border border-border flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-foreground mb-1">{helpline.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{helpline.organization}</p>
                  <p className="text-destructive font-mono tabular-nums font-bold text-lg mb-1 inline-flex items-center gap-1.5">
                    <PhoneCall size={16} aria-hidden="true" />
                    {helpline.phone}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{helpline.hours}</p>
                  <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                    {helpline.description}
                  </p>
                </div>
                <a
                  href={helpline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Official Helpline Portal →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
