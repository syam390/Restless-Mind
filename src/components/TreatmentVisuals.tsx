import React, { useState } from 'react';
import {
  CBT_FIVE_PART_NODES,
  ERP_LEARNING_STAGES,
  TREATMENT_JOURNEY_STAGES,
} from '../data/treatmentEducationData';
import {
  CheckCircle,
  ShieldAlert,
  Info,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

/**
 * PHASE 3.B — CBT Thought–Feeling–Behaviour 5-Node Interactive Visual
 */
export function CbtInteractiveModelDiagram() {
  const [selectedId, setSelectedId] = useState<string>('thought');
  const activeNode =
    CBT_FIVE_PART_NODES.find((n) => n.id === selectedId) || CBT_FIVE_PART_NODES[0];

  const coords: Record<string, { x: number; y: number }> = {
    situation: { x: 260, y: 38 },
    thought: { x: 445, y: 112 },
    emotion_body: { x: 380, y: 232 },
    behaviour: { x: 140, y: 232 },
    feedback: { x: 75, y: 112 },
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Interactive Visual Model · Cognitive Behavioural Therapy (CBT)
          </p>
          <h3 className="heading-md">
            How Situations, Interpretations, Feelings &amp; Behaviours Interact
          </h3>
        </div>
        <span className="text-xs font-mono text-primary font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border self-start">
          Inspecting Node {activeNode.stepNumber}: {activeNode.title}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive 5-Node SVG Diagram */}
        <div className="lg:col-span-6 bg-secondary/50 border border-border rounded-2xl p-4">
          <svg
            viewBox="0 0 520 280"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Interactive five-part CBT diagram connecting Situation or trigger, Thought or interpretation, Emotion and physical sensations, Behaviour or response, and Feedback effects"
          >
            <defs>
              <linearGradient id="CbtLoopStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#2A6F68" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Connecting Pentagon & Bidirectional Arrows */}
            <polygon
              points="260,38 445,112 380,232 140,232 75,112"
              fill="rgba(42, 111, 104, 0.05)"
              stroke="url(#CbtLoopStroke)"
              strokeWidth="2.25"
              strokeDasharray="6 5"
            />
            <line
              x1="445"
              y1="112"
              x2="140"
              y2="232"
              stroke="#2A6F68"
              strokeOpacity="0.28"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1="75"
              y1="112"
              x2="380"
              y2="232"
              stroke="#2A6F68"
              strokeOpacity="0.28"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {CBT_FIVE_PART_NODES.map((node) => {
              const pt = coords[node.id];
              const isSelected = node.id === activeNode.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select CBT node ${node.stepNumber}: ${node.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle cx={pt.x} cy={pt.y} r="30" fill="#2A6F68" fillOpacity="0.22" />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '21' : '17'}
                    fill={isSelected ? '#1B4D3E' : 'var(--card)'}
                    stroke="#1B4D3E"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 4}
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold select-none ${
                      isSelected ? 'fill-white' : 'fill-foreground'
                    }`}
                  >
                    {node.stepNumber}
                  </text>
                  <text
                    x={pt.x}
                    y={pt.y > 180 ? pt.y + 34 : pt.y - 25}
                    textAnchor="middle"
                    className={`text-[11px] font-semibold select-none ${
                      isSelected ? 'fill-primary font-bold' : 'fill-foreground'
                    }`}
                  >
                    {node.title}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            Click or press Enter on any node (01–05) to inspect its role and a neutral example.
          </p>
        </div>

        {/* Right: Node Selector Strip & Selected Node Explanation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="CBT model nodes">
            {CBT_FIVE_PART_NODES.map((node) => {
              const isSelected = node.id === activeNode.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(node.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border smooth-transition ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {node.stepNumber} · {node.title}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3"
          >
            <div>
              <p className="text-xs font-mono text-primary font-semibold">
                Node {activeNode.stepNumber} · {activeNode.subtitle}
              </p>
              <h4 className="text-base font-bold text-foreground mt-0.5">{activeNode.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeNode.explanation}
            </p>
            <div className="bg-card border border-border rounded-xl p-3.5 text-xs text-foreground">
              <strong>Neutral Everyday Example:</strong> {activeNode.neutralExample}
            </div>
            <div className="flex items-start gap-2 text-xs text-primary font-medium">
              <CheckCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>{activeNode.cbtInsight}</span>
            </div>
          </div>

          <div className="bg-secondary/40 border border-border rounded-xl p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <Info size={15} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong className="text-foreground">Important Clarification:</strong> CBT for OCD is not about &ldquo;forcing positive thinking,&rdquo; suppressing unwanted thoughts, or debating every doubt until you feel 100% certain. Instead, it targets the inflated meaning given to intrusive thoughts and pairs cognitive awareness with behavioural experiments and ERP.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PHASE 3.C — ERP 5-Stage Collaborative Learning Model
 */
export function ErpLearningPathwayDiagram() {
  const [activeIdx, setActiveIdx] = useState<number>(2);
  const currentStage = ERP_LEARNING_STAGES[activeIdx] || ERP_LEARNING_STAGES[0];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Interactive Visual Pathway · Exposure and Response Prevention (ERP)
          </p>
          <h3 className="heading-md">
            How Collaborative ERP Builds Willingness for Uncertainty
          </h3>
        </div>
        <span className="text-xs font-mono text-primary font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border self-start">
          Stage {currentStage.stepNumber} of 05
        </span>
      </div>

      {/* SVG 5-Step Stepping-Stone Ladder */}
      <div className="bg-secondary/45 border border-border rounded-2xl p-4 mb-6 overflow-x-auto">
        <svg
          viewBox="0 0 720 145"
          className="w-full min-w-[540px] h-auto"
          role="img"
          aria-label="Five-stage Exposure and Response Prevention learning pathway: Identify triggers, Plan collaborative hierarchy, Approach without ritual, Practice willingness for uncertainty, and Review learning"
        >
          <defs>
            <linearGradient id="ErpPathLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E2D40" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#2A6F68" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <path
            d="M 76 82 L 218 68 L 360 76 L 502 58 L 644 48"
            fill="none"
            stroke="url(#ErpPathLine)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {ERP_LEARNING_STAGES.map((stage, idx) => {
            const x = 76 + idx * 142;
            const y = [82, 68, 76, 58, 48][idx];
            const isSelected = idx === activeIdx;
            return (
              <g
                key={stage.stepNumber}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Select ERP stage ${stage.stepNumber}: ${stage.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle cx={x} cy={y} r="28" fill="#2A6F68" fillOpacity="0.22" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '20' : '15'}
                  fill={isSelected ? '#1B4D3E' : 'var(--card)'}
                  stroke="#1B4D3E"
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold select-none ${
                    isSelected ? 'fill-white' : 'fill-foreground'
                  }`}
                >
                  {stage.stepNumber}
                </text>
                <text
                  x={x}
                  y={122}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold select-none ${
                    isSelected ? 'fill-primary font-bold' : 'fill-muted-foreground'
                  }`}
                >
                  {stage.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage Selector Buttons + Detail Panel */}
      <div className="grid sm:grid-cols-5 gap-2.5 mb-5">
        {ERP_LEARNING_STAGES.map((stage, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={stage.stepNumber}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`text-left p-3.5 rounded-xl border text-xs smooth-transition cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-secondary/60 text-foreground border-border hover:border-primary/40'
              }`}
            >
              <span className="font-mono text-[10px] opacity-80 block mb-0.5">
                Stage {stage.stepNumber}
              </span>
              <span className="font-bold block">{stage.title}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-secondary/65 border border-border rounded-2xl p-5 grid md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8 space-y-2">
          <h4 className="text-base font-bold text-foreground">
            {currentStage.stepNumber} · {currentStage.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStage.summary} {currentStage.whatHappens}
          </p>
        </div>
        <div className="md:col-span-4 bg-card border border-border rounded-xl p-4 text-xs space-y-1.5">
          <p className="font-bold text-primary flex items-center gap-1.5">
            <ShieldAlert size={14} aria-hidden="true" />
            Clinical Safety &amp; Learning Principle
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {currentStage.safetyPrinciple}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * PHASE 3.E — ACT & Psychological Flexibility Visual Comparison
 */
export function ActPsychologicalFlexibilityDiagram() {
  const [viewMode, setViewMode] = useState<'struggle' | 'flexibility'>('flexibility');

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Interactive Visual Comparison · Acceptance &amp; Commitment Therapy (ACT)
          </p>
          <h3 className="heading-md">
            Fighting Every Thought vs. Making Room &amp; Moving Toward Values
          </h3>
        </div>
        <div
          role="group"
          aria-label="ACT visual comparison mode"
          className="inline-flex rounded-xl bg-secondary p-1 border border-border self-start"
        >
          <button
            type="button"
            onClick={() => setViewMode('struggle')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
              viewMode === 'struggle'
                ? 'bg-card text-foreground border border-border shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            The Struggle Switch (Fusion)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flexibility')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
              viewMode === 'flexibility'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Psychological Flexibility (ACT)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 bg-secondary/45 border border-border rounded-2xl p-4">
          <svg
            viewBox="0 0 560 220"
            className="w-full h-auto"
            role="img"
            aria-label={
              viewMode === 'struggle'
                ? 'Diagram showing energy trapped in a tug-of-war trying to eliminate intrusive thoughts while personal values are sidelined'
                : 'Diagram showing cognitive defusion and acceptance allowing intrusive thoughts to pass like clouds while energy flows toward personal values'
            }
          >
            {viewMode === 'struggle' ? (
              <>
                {/* Left Node: Intrusive Thought */}
                <rect
                  x="24"
                  y="64"
                  width="145"
                  height="90"
                  rx="16"
                  fill="var(--card)"
                  stroke="#B91C1C"
                  strokeWidth="2"
                />
                <text x="96" y="100" textAnchor="middle" className="fill-foreground text-xs font-bold">
                  Unwanted Thought
                </text>
                <text x="96" y="120" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  &ldquo;What if something is wrong?&rdquo;
                </text>

                {/* Center: Tangled Struggle / Tug of War */}
                <path
                  d="M 170 110 C 215 55, 240 165, 280 110 C 315 55, 345 165, 375 110"
                  fill="none"
                  stroke="#B91C1C"
                  strokeWidth="3"
                />
                <circle cx="275" cy="110" r="38" fill="#B91C1C" fillOpacity="0.12" />
                <text x="275" y="106" textAnchor="middle" className="fill-destructive text-xs font-bold">
                  Exhausting Tug-of-War
                </text>
                <text x="275" y="122" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  Arguing, suppressing, checking
                </text>

                {/* Right Node: Values Blocked */}
                <rect
                  x="390"
                  y="64"
                  width="145"
                  height="90"
                  rx="16"
                  fill="var(--card)"
                  stroke="var(--border)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <text x="462" y="100" textAnchor="middle" className="fill-muted-foreground text-xs font-bold">
                  Meaningful Life Paused
                </text>
                <text x="462" y="120" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  Waiting for 100% certainty first
                </text>
              </>
            ) : (
              <>
                {/* Top Floating Cloud: Defused Thought */}
                <rect
                  x="175"
                  y="18"
                  width="210"
                  height="56"
                  rx="28"
                  fill="var(--card)"
                  stroke="#2A6F68"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text x="280" y="43" textAnchor="middle" className="fill-primary text-xs font-bold">
                  Cognitive Defusion &amp; Acceptance
                </text>
                <text x="280" y="59" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  &ldquo;I notice my mind is having a what-if thought&rdquo;
                </text>

                {/* Main Clear Pathway: Present Moment -> Values Action */}
                <rect
                  x="28"
                  y="114"
                  width="160"
                  height="78"
                  rx="16"
                  fill="var(--card)"
                  stroke="#1B4D3E"
                  strokeWidth="2.25"
                />
                <text x="108" y="148" textAnchor="middle" className="fill-foreground text-xs font-bold">
                  Present Awareness
                </text>
                <text x="108" y="166" textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  Dropping the tug-of-war rope
                </text>

                <line
                  x1="190"
                  y1="153"
                  x2="365"
                  y2="153"
                  stroke="#1B4D3E"
                  strokeWidth="3"
                />

                <rect
                  x="370"
                  y="114"
                  width="162"
                  height="78"
                  rx="16"
                  fill="#1B4D3E"
                />
                <text x="451" y="148" textAnchor="middle" className="fill-white text-xs font-bold">
                  Values-Guided Action
                </text>
                <text x="451" y="166" textAnchor="middle" className="fill-white/85 text-[10px]">
                  Connection, learning, kindness
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm">
          {viewMode === 'struggle' ? (
            <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-2.5">
              <h4 className="font-bold text-foreground text-base">
                Why Fighting Every Thought Backfires
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                When we treat every unwanted thought as an emergency that must be erased or proven 100% false before we can live our day, our attention stays locked onto the thought.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In ACT, this is called <strong className="text-foreground">cognitive fusion</strong> and <strong className="text-foreground">experiential avoidance</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-2.5">
              <h4 className="font-bold text-foreground text-base">
                Making Room &amp; Choosing Values
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Psychological flexibility means noticing an intrusive thought as words or pictures passing through awareness (<strong className="text-foreground">cognitive defusion</strong>), allowing uncomfortable feelings to exist without rituals (<strong className="text-foreground">acceptance</strong>), and taking steps toward what matters to you (<strong className="text-foreground">committed action</strong>).
              </p>
            </div>
          )}

          <div className="bg-secondary/40 border border-border rounded-xl p-3.5 text-xs text-muted-foreground">
            <strong className="text-foreground">Evidence Qualification:</strong> ACT is a valuable psychological approach often integrated alongside ERP, but it should not be presented as a proven replacement for established first-line OCD treatments (CBT with ERP).
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PHASE 3.F — Medication Categories & Clinical Planning Visual Summary
 */
export function MedicationClinicalFitDiagram() {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="pb-5 mb-6 border-b border-border">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          Educational Visual Summary · Pharmacotherapy in OCD Care
        </p>
        <h3 className="heading-md">
          How Medication Categories Fit into Clinician-Guided Treatment Planning
        </h3>
      </div>

      <div className="bg-secondary/45 border border-border rounded-2xl p-4 mb-6 overflow-x-auto">
        <svg
          viewBox="0 0 740 190"
          className="w-full min-w-[580px] h-auto"
          role="img"
          aria-label="Educational diagram showing how First-Line SSRIs, Second-Line Clomipramine, and Specialist Augmentation fit into clinician-guided OCD treatment planning"
        >
          {/* Box 1: Clinical Assessment */}
          <rect
            x="16"
            y="32"
            width="160"
            height="126"
            rx="16"
            fill="var(--card)"
            stroke="#1B4D3E"
            strokeWidth="2"
          />
          <text x="96" y="64" textAnchor="middle" className="fill-primary text-[10px] font-mono font-bold">
            01 · ASSESSMENT
          </text>
          <text x="96" y="86" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Medical &amp; Psychiatric
          </text>
          <text x="96" y="104" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Evaluation
          </text>
          <text x="96" y="128" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            Severity, age, health,
          </text>
          <text x="96" y="142" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            &amp; patient preference
          </text>

          <line x1="176" y1="95" x2="204" y2="95" stroke="#2A6F68" strokeWidth="2.5" />

          {/* Box 2: First-Line SSRIs */}
          <rect
            x="204"
            y="22"
            width="176"
            height="146"
            rx="16"
            fill="#1B4D3E"
          />
          <text x="292" y="52" textAnchor="middle" className="fill-white/80 text-[10px] font-mono font-bold">
            02 · FIRST-LINE CLASS
          </text>
          <text x="292" y="74" textAnchor="middle" className="fill-white text-xs font-bold">
            SSRIs (Serotonergic)
          </text>
          <text x="292" y="96" textAnchor="middle" className="fill-white/90 text-[10px]">
            e.g., Sertraline, Fluoxetine,
          </text>
          <text x="292" y="112" textAnchor="middle" className="fill-white/90 text-[10px]">
            Fluvoxamine, Paroxetine,
          </text>
          <text x="292" y="128" textAnchor="middle" className="fill-white/90 text-[10px]">
            Citalopram (per guideline)
          </text>
          <text x="292" y="150" textAnchor="middle" className="fill-white/80 text-[9px] font-mono">
            Gradual trial (~8–12+ weeks)
          </text>

          <line x1="380" y1="95" x2="408" y2="95" stroke="#2A6F68" strokeWidth="2.5" />

          {/* Box 3: Second-Line Clomipramine */}
          <rect
            x="408"
            y="32"
            width="154"
            height="126"
            rx="16"
            fill="var(--card)"
            stroke="#2A6F68"
            strokeWidth="2"
          />
          <text x="485" y="62" textAnchor="middle" className="fill-primary text-[10px] font-mono font-bold">
            03 · SECOND-LINE
          </text>
          <text x="485" y="84" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Different SSRI or
          </text>
          <text x="485" y="102" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Clomipramine
          </text>
          <text x="485" y="124" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            Considered if initial SSRI
          </text>
          <text x="485" y="138" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            is ineffective/not tolerated
          </text>

          <line x1="562" y1="95" x2="588" y2="95" stroke="#2A6F68" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* Box 4: Specialist Review */}
          <rect
            x="588"
            y="32"
            width="136"
            height="126"
            rx="16"
            fill="var(--card)"
            stroke="#1E2D40"
            strokeWidth="2"
          />
          <text x="656" y="62" textAnchor="middle" className="fill-primary text-[10px] font-mono font-bold">
            04 · SPECIALIST
          </text>
          <text x="656" y="84" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Specialist Team
          </text>
          <text x="656" y="102" textAnchor="middle" className="fill-foreground text-xs font-bold">
            Augmentation
          </text>
          <text x="656" y="124" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            Only for persistent
          </text>
          <text x="656" y="138" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            symptoms under care
          </text>
        </svg>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="bg-secondary/60 border border-border rounded-xl p-4">
          <strong className="text-foreground block mb-1">Individual Response Varies</strong>
          Medications may reduce obsessive intensity and anxiety for some people, while others experience partial benefit or side effects that require prescriber review.
        </div>
        <div className="bg-secondary/60 border border-border rounded-xl p-4">
          <strong className="text-foreground block mb-1">Jurisdiction &amp; Age Differences</strong>
          Approved indications, off-label prescribing, and pediatric safety rules differ by country and age group. Adult recommendations are never automatically applied to children.
        </div>
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-foreground">
          <strong className="text-destructive block mb-1">Strict Non-Prescribing Boundary</strong>
          Never start, stop, adjust, or combine medicines based on website information. Abruptly stopping serotonergic medicines can cause discontinuation symptoms.
        </div>
      </div>
    </div>
  );
}

/**
 * PHASE 3.G — Combined Treatment & Recovery Support Ecosystem Diagram
 */
export function CombinedRecoveryEcosystemDiagram() {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const pillars = [
    {
      title: 'Psychological Therapy (CBT / ERP / ACT)',
      role: 'Core behavioural skill-building to recognize the OCD/anxiety loop, approach feared situations gradually, and practice response prevention.',
      note: 'Often sufficient on its own for mild-to-moderate symptoms when delivered by a trained specialist.',
    },
    {
      title: 'Clinician-Supervised Medication (When Indicated)',
      role: 'Prescribed serotonergic medication (such as an SSRI) when symptoms are moderate-to-severe, coexisting depression is present, or therapy alone has not helped enough.',
      note: 'Can lower acute alarm intensity so engaging in ERP exercises feels more manageable.',
    },
    {
      title: 'Family Education & Reducing Accommodation',
      role: 'Helping loved ones understand why repeated reassurance-giving feeds the cycle, and agreeing on compassionate, non-reassuring support.',
      note: 'Especially important for children, adolescents, and shared household routines.',
    },
    {
      title: 'Daily Self-Regulation & Whole-Person Habits',
      role: 'Optional paced breathing, sensory grounding, private thought journaling, and consistent sleep/physical health care.',
      note: 'Supportive complements to daily wellbeing—never a replacement for clinical assessment or therapy.',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="pb-5 mb-6 border-b border-border">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          Interactive Care Ecosystem · Combined Treatment &amp; Support
        </p>
        <h3 className="heading-md">
          How Therapy, Medication &amp; Daily Support Can Work Together
        </h3>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 bg-secondary/45 border border-border rounded-2xl p-4">
          <svg
            viewBox="0 0 420 260"
            className="w-full h-auto"
            role="img"
            aria-label="Combined care ecosystem diagram showing the person at the center supported by Psychological Therapy, Clinician-Supervised Medication when appropriate, Family Support, and Daily Coping Skills"
          >
            <circle
              cx="210"
              cy="130"
              r="95"
              fill="none"
              stroke="#2A6F68"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <circle cx="210" cy="130" r="42" fill="#1B4D3E" />
            <text x="210" y="126" textAnchor="middle" className="fill-white text-xs font-bold">
              Tailored Care
            </text>
            <text x="210" y="142" textAnchor="middle" className="fill-white/80 text-[10px]">
              Your Needs First
            </text>

            {[
              { x: 210, y: 34, label: '01 · CBT / ERP' },
              { x: 355, y: 130, label: '02 · Medication' },
              { x: 210, y: 226, label: '03 · Family / Allies' },
              { x: 65, y: 130, label: '04 · Daily Tools' },
            ].map((node, idx) => {
              const isSelected = selectedPillar === idx;
              return (
                <g
                  key={node.label}
                  onClick={() => setSelectedPillar(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ecosystem pillar: ${pillars[idx].title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPillar(idx);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={node.x - 56}
                    y={node.y - 20}
                    width="112"
                    height="40"
                    rx="12"
                    fill={isSelected ? '#2A6F68' : 'var(--card)'}
                    stroke="#1B4D3E"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className={`text-[11px] font-bold select-none ${
                      isSelected ? 'fill-white' : 'fill-foreground'
                    }`}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {pillars.map((p, idx) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setSelectedPillar(idx)}
                className={`text-left p-3 rounded-xl border text-xs font-semibold cursor-pointer smooth-transition ${
                  selectedPillar === idx
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/60 text-foreground border-border hover:border-primary/40'
                }`}
              >
                0{idx + 1} · {p.title.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-2.5">
            <h4 className="font-bold text-foreground text-base">
              {pillars[selectedPillar].title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pillars[selectedPillar].role}
            </p>
            <p className="text-xs text-primary font-medium">
              <strong>Clinical Context:</strong> {pillars[selectedPillar].note}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Not every person needs every intervention shown here, and self-guided wellbeing tools complement—never replace—professional treatment.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * PHASE 3.I — Non-Linear Treatment Journey Pathway Visual
 */
export function TreatmentJourneyPathwayDiagram() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const stage = TREATMENT_JOURNEY_STAGES[activeStageIdx] || TREATMENT_JOURNEY_STAGES[0];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Interactive Pathway · Navigating Professional Care
          </p>
          <h3 className="heading-md">
            A Collaborative, Non-Linear Treatment Journey
          </h3>
        </div>
        <span className="text-xs font-mono text-primary font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border self-start inline-flex items-center gap-1.5">
          <RefreshCw size={12} aria-hidden="true" />
          Flexible &amp; Revisited Over Time
        </span>
      </div>

      {/* Interactive 6-Stage Winding Pathway SVG */}
      <div className="bg-secondary/45 border border-border rounded-2xl p-4 mb-6 overflow-x-auto">
        <svg
          viewBox="0 0 780 165"
          className="w-full min-w-[620px] h-auto"
          role="img"
          aria-label="Interactive six-stage non-linear treatment journey pathway: Understanding symptoms, Professional assessment, Discussing options, Starting an agreed plan, Reviewing progress, and Adjusting treatment with the clinician when needed"
        >
          {/* Main forward path */}
          <path
            d="M 65 95 C 125 55, 165 55, 205 95 C 245 135, 295 135, 345 95 C 395 55, 445 55, 485 95 C 525 135, 575 135, 625 95 L 720 75"
            fill="none"
            stroke="#1B4D3E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Non-linear feedback loop arc from Stage 06 back to Stage 03/05 */}
          <path
            d="M 720 62 C 630 14, 420 14, 345 72"
            fill="none"
            stroke="#2A6F68"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <text
            x="530"
            y="24"
            textAnchor="middle"
            className="fill-primary text-[10px] font-mono font-semibold"
          >
            ↺ Non-linear review &amp; plan adjustment loop
          </text>

          {TREATMENT_JOURNEY_STAGES.map((st, idx) => {
            const xCoords = [65, 205, 345, 485, 615, 720];
            const yCoords = [95, 95, 95, 95, 95, 75];
            const x = xCoords[idx];
            const y = yCoords[idx];
            const isSelected = idx === activeStageIdx;
            return (
              <g
                key={st.id}
                onClick={() => setActiveStageIdx(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect journey stage ${st.stepNumber}: ${st.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStageIdx(idx);
                  }
                }}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle cx={x} cy={y} r="27" fill="#2A6F68" fillOpacity="0.22" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '19' : '15'}
                  fill={isSelected ? '#1B4D3E' : 'var(--card)'}
                  stroke="#1B4D3E"
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold select-none ${
                    isSelected ? 'fill-white' : 'fill-foreground'
                  }`}
                >
                  {st.stepNumber}
                </text>
                <text
                  x={x}
                  y={142}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold select-none ${
                    isSelected ? 'fill-primary font-bold' : 'fill-muted-foreground'
                  }`}
                >
                  {st.title.split(' ')[0]} {st.title.split(' ')[1] || ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage Selector Pills + Active Explanation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
        {TREATMENT_JOURNEY_STAGES.map((st, idx) => {
          const isSelected = idx === activeStageIdx;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStageIdx(idx)}
              className={`text-left p-3 rounded-xl border text-xs smooth-transition cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-secondary/60 text-foreground border-border hover:border-primary/40'
              }`}
            >
              <span className="font-mono text-[10px] opacity-80 block">
                {st.stepNumber}
              </span>
              <span className="font-bold line-clamp-1">{st.title}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-secondary/60 border border-border rounded-2xl p-5 grid md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-1.5">
          <h4 className="font-bold text-foreground text-base">
            Stage {stage.stepNumber}: {stage.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stage.summary} {stage.details}
          </p>
        </div>
        <div className="md:col-span-4 bg-card border border-border rounded-xl p-3.5 text-xs text-muted-foreground">
          <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
            <Sparkles size={13} aria-hidden="true" />
            Why Journeys Differ
          </p>
          <p className="leading-relaxed">{stage.nonLinearNote}</p>
        </div>
      </div>
    </div>
  );
}
