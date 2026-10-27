import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Wind,
  Compass,
  Stethoscope,
  Pause,
  Play,
  BookOpen,
} from 'lucide-react';

interface InteractiveClarityHeroProps {
  onNavigate: (path: string) => void;
}

interface HorizonState {
  id: 'overwhelm' | 'grounding' | 'erp_uncertainty' | 'human_support';
  stepNumber: string;
  label: string;
  shortTag: string;
  headline: string;
  description: string;
  waveFrequency: number;
  waveAmplitude: number;
  waveSpeed: number;
  secondaryNoise: number;
  primaryColor: string;
  accentColor: string;
  nodeX: number;
  nodeY: number;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

const HORIZON_STATES: HorizonState[] = [
  {
    id: 'overwhelm',
    stepNumber: '01',
    label: 'When Thoughts Feel Loud',
    shortTag: 'Mental Overwhelm',
    headline: 'Notice the wave without fighting the thought.',
    description:
      'Intrusive doubts and "what-if" spirals trigger a real physical alarm in the nervous system. You do not have to solve or argue with every thought that arrives.',
    waveFrequency: 0.025,
    waveAmplitude: 26,
    waveSpeed: 0.03,
    secondaryNoise: 12,
    primaryColor: '#2A6F68',
    accentColor: '#1E2D40',
    nodeX: 78,
    nodeY: 142,
    ctaLabel: 'Settle with 4-7-8 Breathing',
    ctaHref: '/tools?tab=breathing',
    secondaryLabel: 'Explore Familiar Patterns',
    secondaryHref: '/#symptoms',
  },
  {
    id: 'grounding',
    stepNumber: '02',
    label: 'Grounded Observation',
    shortTag: 'Sensory Anchoring',
    headline: 'Bring gentle attention back to the room around you.',
    description:
      'Before deciding what to do next, anchor your senses in the present moment. Paced breathing and 5-4-3-2-1 sensory grounding help lower physiological urgency.',
    waveFrequency: 0.016,
    waveAmplitude: 16,
    waveSpeed: 0.019,
    secondaryNoise: 5.5,
    primaryColor: '#1B4D3E',
    accentColor: '#2A6F68',
    nodeX: 188,
    nodeY: 96,
    ctaLabel: 'Start 5-4-3-2-1 Walkthrough',
    ctaHref: '/tools?tab=grounding',
    secondaryLabel: 'Log a Daily Check-In',
    secondaryHref: '/tools?tab=checkin',
  },
  {
    id: 'erp_uncertainty',
    stepNumber: '03',
    label: 'Practising "Maybe, Maybe Not"',
    shortTag: 'ERP & Uncertainty',
    headline: 'Stepping out of the compulsion loop one pause at a time.',
    description:
      'In Exposure and Response Prevention (ERP), pausing a checking or reassurance ritual allows your brain to learn that uncertainty is tolerable without rituals.',
    waveFrequency: 0.011,
    waveAmplitude: 11,
    waveSpeed: 0.013,
    secondaryNoise: 2.2,
    primaryColor: '#1B4D3E',
    accentColor: '#2A6F68',
    nodeX: 308,
    nodeY: 110,
    ctaLabel: 'Explore Interactive ERP Simulator',
    ctaHref: '/#ocd-cycle',
    secondaryLabel: 'Understanding CBT & ERP',
    secondaryHref: '/treatment',
  },
  {
    id: 'human_support',
    stepNumber: '04',
    label: 'Evidence-Informed Care',
    shortTag: 'Treatment & Care',
    headline: 'Understand treatment options and prepare for qualified care.',
    description:
      'Explore how CBT, ERP, ACT, and clinician-supervised medications work, organize questions for a professional, or connect with verified 24/7 helplines.',
    waveFrequency: 0.008,
    waveAmplitude: 7,
    waveSpeed: 0.009,
    secondaryNoise: 1,
    primaryColor: '#1B4D3E',
    accentColor: '#1E2D40',
    nodeX: 416,
    nodeY: 70,
    ctaLabel: 'Explore Treatment Guide',
    ctaHref: '/treatment',
    secondaryLabel: 'Prepare Clinician Questions',
    secondaryHref: '/tools?tab=ai-prep',
  },
];

export default function InteractiveClarityHero({ onNavigate }: InteractiveClarityHeroProps) {
  const [activeStateId, setActiveStateId] = useState<HorizonState['id']>('grounding');
  const [motionPaused, setMotionPaused] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeState =
    HORIZON_STATES.find((s) => s.id === activeStateId) || HORIZON_STATES[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let phase = 0;

    const renderFrame = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Soft atmospheric light diffusion shifted subtly by pointer
      const glowX = width * (0.28 + pointerOffset.x * 0.44);
      const glowY = height * (0.24 + pointerOffset.y * 0.34);
      const radial = ctx.createRadialGradient(glowX, glowY, 14, glowX, glowY, width * 0.68);
      radial.addColorStop(0, 'rgba(42, 111, 104, 0.22)');
      radial.addColorStop(0.55, 'rgba(27, 77, 62, 0.11)');
      radial.addColorStop(1, 'rgba(250, 247, 240, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Draw 3 layered harmonic waves in Forest Green, Muted Teal, and Midnight Blue
      const layers = [
        {
          yBase: height * 0.58,
          ampScale: 1.0,
          freqScale: 1.0,
          stroke: 'rgba(27, 77, 62, 0.46)',
          fillTop: 'rgba(42, 111, 104, 0.21)',
          fillBottom: 'rgba(234, 239, 233, 0.03)',
        },
        {
          yBase: height * 0.68,
          ampScale: 0.72,
          freqScale: 1.24,
          stroke: 'rgba(42, 111, 104, 0.40)',
          fillTop: 'rgba(42, 111, 104, 0.15)',
          fillBottom: 'rgba(30, 45, 64, 0.02)',
        },
        {
          yBase: height * 0.78,
          ampScale: 0.48,
          freqScale: 0.82,
          stroke: 'rgba(30, 45, 64, 0.32)',
          fillTop: 'rgba(27, 77, 62, 0.12)',
          fillBottom: 'rgba(250, 247, 240, 0)',
        },
      ];

      layers.forEach((layer, layerIdx) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          const primaryWave =
            Math.sin(x * activeState.waveFrequency * layer.freqScale + phase + layerIdx * 1.1) *
            (activeState.waveAmplitude * layer.ampScale);
          const harmonicRipple =
            Math.cos(x * 0.045 - phase * 1.3 + layerIdx) *
            (activeState.secondaryNoise * layer.ampScale);
          const pointerInfluence = (pointerOffset.y - 0.5) * 9;
          const y = layer.yBase + primaryWave + harmonicRipple + pointerInfluence;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, layer.yBase - 30, 0, height);
        grad.addColorStop(0, layer.fillTop);
        grad.addColorStop(1, layer.fillBottom);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      if (!motionPaused) {
        phase += activeState.waveSpeed;
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeState, motionPaused, pointerOffset]);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <section className="relative overflow-hidden border-b border-border hero-atmosphere">
      {/* Subtle Ambient Light Diffusion Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-accent/70 blur-3xl"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-18 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Art-Directed Editorial Copy & Primary Entry Points */}
          <div className="lg:col-span-6 space-y-6 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 border border-border shadow-2xs text-xs font-semibold text-primary">
              <Sparkles size={13} aria-hidden="true" />
              <span>Evidence-Informed OCD &amp; Anxiety Education Platform</span>
            </div>

            <h1 className="heading-xl tracking-tight">
              From loud, tangled doubts toward calm self-understanding.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Unwanted intrusive thoughts and repetitive checking urges can feel exhausting—yet they do not define who you are. Explore interactive visual models, evidence-based treatment education (CBT, ERP, ACT, and medications), and private reflection tools at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
              <a
                href="/treatment"
                onClick={(e) => handleLink(e, '/treatment')}
                className="button-primary inline-flex items-center justify-center whitespace-nowrap text-sm"
              >
                <Stethoscope size={16} className="mr-2" aria-hidden="true" />
                Explore Treatment Guide
                <ChevronRight size={16} className="ml-1" aria-hidden="true" />
              </a>
              <a
                href="/tools"
                onClick={(e) => handleLink(e, '/tools')}
                className="button-secondary inline-flex items-center justify-center whitespace-nowrap text-sm"
              >
                Open Daily Wellness Tools
              </a>
              <a
                href="/#ocd-cycle"
                onClick={(e) => handleLink(e, '/#ocd-cycle')}
                className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-primary hover:bg-secondary/80 smooth-transition inline-flex items-center justify-center whitespace-nowrap"
              >
                Try OCD &amp; ERP Simulator →
              </a>
            </div>

            {/* Welcoming Reassurance & Non-Diagnostic Boundary */}
            <div className="surface-glass rounded-2xl p-4 text-xs text-muted-foreground space-y-2 max-w-xl">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  <strong className="text-foreground">Calm, Non-Diagnostic Education:</strong> Restless Mind helps you understand OCD and anxiety mechanisms and prepare for conversations with qualified clinicians—without streaks, diagnostic scores, or prescribing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Clarity Horizon & Constellation Stage */}
          <div className="lg:col-span-6">
            <div
              className="surface-glass rounded-3xl p-5 md:p-6 relative overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                setPointerOffset({ x, y });
              }}
            >
              {/* Stage Header & Accessible Motion Control */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                    Clarity Horizon · Step {activeState.stepNumber} of 04
                  </p>
                  <h2 className="text-sm md:text-base font-bold text-foreground">
                    {activeState.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMotionPaused((p) => !p)}
                  aria-pressed={motionPaused}
                  className="px-2.5 py-1.5 rounded-xl bg-card/90 border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer smooth-transition"
                >
                  {motionPaused ? (
                    <Play size={12} className="text-primary" aria-hidden="true" />
                  ) : (
                    <Pause size={12} className="text-primary" aria-hidden="true" />
                  )}
                  <span>{motionPaused ? 'Resume Waves' : 'Pause Motion'}</span>
                </button>
              </div>

              {/* Interactive Canvas + Constellation Overlay + Tangled-to-Clarity Focal Illustration */}
              <div className="relative rounded-2xl border border-border bg-secondary/75 overflow-hidden h-56 sm:h-64 mb-4">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={240}
                  className="w-full h-full block"
                  aria-hidden="true"
                />

                {/* Interactive Constellation & Unspooling Clarity Focal SVG Overlay */}
                <svg
                  viewBox="0 0 500 220"
                  className="absolute inset-0 w-full h-full"
                  role="img"
                  aria-label="Interactive Clarity Horizon illustration showing tangles of intrusive doubt unspooling into a calm four-stage pathway toward evidence-based care"
                >
                  <defs>
                    <linearGradient id="ConstellationPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1E2D40" stopOpacity="0.45" />
                      <stop offset="50%" stopColor="#2A6F68" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.85" />
                    </linearGradient>
                    <radialGradient id="ClaritySunGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FAF7F0" stopOpacity="0.95" />
                      <stop offset="55%" stopColor="#2A6F68" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#2A6F68" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Left Subtle Tangled Loop Focal Motif (Representing Overwhelm Unspooling) */}
                  <path
                    d="M 28 148 C 42 112, 68 166, 52 126 C 38 96, 86 118, 78 142"
                    fill="none"
                    stroke="#1E2D40"
                    strokeOpacity="0.26"
                    strokeWidth="1.5"
                  />

                  {/* Right Luminous Horizon Focal Orb (Representing Clarity & Understanding) */}
                  <circle cx="416" cy="70" r="44" fill="url(#ClaritySunGlow)" />

                  {/* Connecting Constellation Path */}
                  <path
                    d="M 78 142 C 130 114, 150 99, 188 96 C 240 92, 270 113, 308 110 C 355 106, 382 80, 416 70"
                    fill="none"
                    stroke="url(#ConstellationPathGrad)"
                    strokeWidth="2.25"
                    strokeDasharray="5 5"
                  />

                  {/* Subtle Constellation Stars */}
                  {[
                    { x: 54, y: 58, r: 1.8 },
                    { x: 142, y: 46, r: 2.2 },
                    { x: 248, y: 44, r: 1.8 },
                    { x: 356, y: 48, r: 2.4 },
                    { x: 458, y: 42, r: 2.0 },
                  ].map((star, idx) => (
                    <circle
                      key={idx}
                      cx={star.x}
                      cy={star.y}
                      r={star.r}
                      fill="#2A6F68"
                      fillOpacity="0.45"
                    />
                  ))}

                  {/* Interactive Constellation Nodes */}
                  {HORIZON_STATES.map((st) => {
                    const isSelected = st.id === activeState.id;
                    return (
                      <g
                        key={st.id}
                        onClick={() => setActiveStateId(st.id)}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`Select journey stage ${st.stepNumber}: ${st.label}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveStateId(st.id);
                          }
                        }}
                      >
                        {isSelected && (
                          <circle
                            cx={st.nodeX}
                            cy={st.nodeY}
                            r="22"
                            fill="#2A6F68"
                            fillOpacity="0.22"
                          />
                        )}
                        <circle
                          cx={st.nodeX}
                          cy={st.nodeY}
                          r={isSelected ? '11' : '8'}
                          fill={isSelected ? '#1B4D3E' : '#FAF7F0'}
                          stroke="#1B4D3E"
                          strokeWidth="2.5"
                        />
                        <text
                          x={st.nodeX}
                          y={st.nodeY - 16}
                          textAnchor="middle"
                          className={`text-[10px] font-semibold select-none ${
                            isSelected ? 'fill-primary font-bold' : 'fill-muted-foreground'
                          }`}
                        >
                          {st.stepNumber} · {st.shortTag}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Bottom Overlay Legend */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-muted-foreground bg-card/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/80">
                  <span>Select any constellation node to inspect the pathway</span>
                  <span className="font-mono text-primary font-semibold hidden sm:inline">
                    {activeState.shortTag}
                  </span>
                </div>
              </div>

              {/* 4-Step Interactive Selector Strip */}
              <div
                role="tablist"
                aria-label="Explore journey stages"
                className="grid grid-cols-2 gap-2 mb-4"
              >
                {HORIZON_STATES.map((st) => {
                  const isSelected = st.id === activeState.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveStateId(st.id)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border text-xs smooth-transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                          : 'bg-card/90 text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="font-bold">{st.shortTag}</span>
                      <span className="font-mono text-[10px] opacity-80 shrink-0">
                        {st.stepNumber}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Insight & Direct Action Card */}
              <div
                role="tabpanel"
                className="bg-card/95 border border-border rounded-2xl p-4 space-y-3"
              >
                <div>
                  <h3 className="text-sm md:text-base font-bold text-foreground mb-1">
                    {activeState.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeState.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={activeState.ctaHref}
                    onClick={(e) => handleLink(e, activeState.ctaHref)}
                    className="button-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                  >
                    <span>{activeState.ctaLabel}</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={activeState.secondaryHref}
                    onClick={(e) => handleLink(e, activeState.secondaryHref)}
                    className="button-secondary text-xs py-2 px-3.5"
                  >
                    {activeState.secondaryLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Interactive Entry Bar Below Hero */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              icon: Stethoscope,
              title: 'Understand Treatment',
              subtitle: 'CBT, ERP, ACT, SSRIs & Clinician Questions',
              href: '/treatment',
            },
            {
              icon: Wind,
              title: 'Settle Physical Tension',
              subtitle: '4-7-8 Breathing + Optional Ambient Sound',
              href: '/tools?tab=breathing',
            },
            {
              icon: Compass,
              title: 'Anchor Your 5 Senses',
              subtitle: 'Step-by-Step 5-4-3-2-1 Walkthrough',
              href: '/tools?tab=grounding',
            },
            {
              icon: BookOpen,
              title: 'Private ERP Journal',
              subtitle: 'Observe Triggers Without Rituals (Local-First)',
              href: '/tools?tab=journal',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                onClick={(e) => handleLink(e, item.href)}
                className="surface-glass rounded-2xl p-4 flex items-start gap-3.5 hover:border-primary smooth-transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground smooth-transition">
                  <Icon size={19} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary smooth-transition">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
