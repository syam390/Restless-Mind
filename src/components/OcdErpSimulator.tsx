import React, { useState } from 'react';
import {
  Sliders,
  RefreshCw,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Brain,
  Info,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { computeErpHabituationCurve } from '../lib/wellbeingLogic';
import { OCD_CYCLE_STAGES } from '../data/restlessMindData';

interface OcdErpSimulatorProps {
  onNavigate: (path: string) => void;
}

const SCENARIO_EXAMPLES = [
  {
    id: 'checking',
    title: 'Checking Locks & Appliances (Fictional Example)',
    trigger:
      'Leaving home and feeling a sudden wave of doubt: "What if the stove or front door lock is still open?"',
    compulsionResponse:
      'Walking back 3 times to check the handle or taking a photo for temporary relief.',
    erpResponse:
      'Locking once, walking away while allowing the "maybe, maybe not" feeling to sit without returning.',
  },
  {
    id: 'intrusive',
    title: 'Unwanted Intrusive Thoughts (Fictional Example)',
    trigger:
      'An abrupt, ego-dystonic thought or mental image that clashes with your deepest values.',
    compulsionResponse:
      'Mentally reviewing past actions for 30 minutes or asking a loved one for 100% reassurance.',
    erpResponse:
      'Labeling it as "an intrusive mental event" and gently returning attention to your current activity without mental review.',
  },
  {
    id: 'contamination',
    title: 'Contamination & Washing Urges (Fictional Example)',
    trigger: 'Touching a doorknob or package and feeling an urgent spike of contamination dread.',
    compulsionResponse: 'Re-washing hands repeatedly until it "feels just right."',
    erpResponse:
      'Delaying or reducing the ritual wash and practicing willingness to tolerate uncertainty.',
  },
];

const MINUTE_EXPLANATIONS: Record<
  'compulsion_loop' | 'erp_habituation',
  Record<number, string>
> = {
  compulsion_loop: {
    0: '0m · Baseline: An unwanted intrusive thought or uncertainty trigger arrives.',
    5: '5m · Alarm Spike: Physical anxiety surges; the urge to check or seek reassurance feels urgent.',
    10: '10m · Brief Ritual Relief: Performing the compulsion drops distress temporarily—convincing the brain the ritual "saved" you.',
    15: '15m · Doubt Rebounds: A new "What if I didn’t check properly?" thought spikes anxiety back up.',
    20: '20m · Second Ritual: Another check or mental review brings fleeting relief again.',
    30: '30m · Escalating Loop: The cycle repeats with higher sensitivity to uncertainty.',
    45: '45m · Exhaustion: Mental energy is drained by repeated checking and reassurance-seeking.',
    60: '60m · Persistent Loop: Because the alarm was never allowed to pass without rituals, the fear loop stays active.',
  },
  erp_habituation: {
    0: '0m · Trigger Arrives: You notice the intrusive doubt without arguing with it.',
    5: '5m · Urge Rises: Discomfort increases as you choose to pause the checking or reassurance ritual.',
    10: '10m · Practicing Willingness: Distress may feel strong while you practice "maybe, maybe not" without performing a ritual.',
    15: '15m · Response Prevention: By not feeding the alarm with a ritual, you learn that discomfort is tolerable.',
    20: '20m · Inhibitory Learning: Your brain records new learning—uncertainty can exist without a catastrophe.',
    30: '30m · Gradual Settling: Tension often begins to ease naturally, though ERP succeeds through response prevention even if anxiety stays elevated.',
    45: '45m · Wider Perspective: The intrusive thought loses its command over your behaviour.',
    60: '60m · Long-Term Learning: Completing the pause weakens future ritual urges across repeated practice.',
  },
};

const CYCLE_NODE_COORDS = [
  { x: 180, y: 36, short: '01 · Trigger' },
  { x: 314, y: 112, short: '02 · Distress' },
  { x: 264, y: 242, short: '03 · Compulsion' },
  { x: 96, y: 242, short: '04 · Brief Relief' },
  { x: 46, y: 112, short: '05 · Reinforces' },
];

export default function OcdErpSimulator({ onNavigate }: OcdErpSimulatorProps) {
  const [mode, setMode] = useState<'compulsion_loop' | 'erp_habituation'>('erp_habituation');
  const [sessionNumber, setSessionNumber] = useState<number>(2);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(2);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('checking');
  const [inspectedPointIdx, setInspectedPointIdx] = useState<number>(2);

  const simulation = computeErpHabituationCurve(sessionNumber, mode);
  const activeScenario =
    SCENARIO_EXAMPLES.find((s) => s.id === selectedScenarioId) || SCENARIO_EXAMPLES[0];
  const activeStage = OCD_CYCLE_STAGES[selectedStageIndex] || OCD_CYCLE_STAGES[0];
  const inspectedPoint =
    simulation.points[inspectedPointIdx] || simulation.points[0];

  return (
    <div
      data-testid="ocd-erp-simulator"
      className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs"
    >
      {/* Top Interactive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Sparkles size={14} aria-hidden="true" />
            <span>Conceptual Educational Illustration · Not Clinical Outcome Data</span>
          </div>
          <h3 className="heading-md">
            Why Compulsions Reinforce Doubt vs. Response-Prevention Learning
          </h3>
        </div>

        {/* Mode Switcher */}
        <div
          role="group"
          aria-label="Simulation response mode"
          className="inline-flex rounded-xl bg-secondary p-1 border border-border self-start"
        >
          <button
            type="button"
            onClick={() => setMode('compulsion_loop')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold smooth-transition cursor-pointer ${
              mode === 'compulsion_loop'
                ? 'bg-card text-foreground shadow-xs border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Compulsive Reassurance Loop
          </button>
          <button
            type="button"
            onClick={() => setMode('erp_habituation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold smooth-transition cursor-pointer ${
              mode === 'erp_habituation'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ERP Response-Prevention Model
          </button>
        </div>
      </div>

      {/* Explicit Conceptual vs. Clinical Care Boundary Banner */}
      <div className="bg-secondary/75 border border-border rounded-2xl p-4 mb-6 flex items-start gap-2.5 text-xs text-muted-foreground">
        <Info size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Conceptual Educational Model (Not Patient Outcome Data):</strong>{' '}
          This interactive diagram is a conceptual illustration of how compulsive reassurance-seeking compares with Exposure and Response Prevention (ERP). The values shown are illustrative educational models—not clinical trial measurements, research statistics, or a guarantee of how quickly anxiety will change in any single session. In real ERP, learning to tolerate uncertainty and pausing rituals matters even when anxiety does not immediately drop during an exercise.
        </p>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive SVG Conceptual Curve + Timestamp Scrubber */}
        <div className="lg:col-span-7 bg-secondary/50 border border-border rounded-2xl p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Brain size={15} className="text-primary" aria-hidden="true" />
              {mode === 'compulsion_loop'
                ? 'Conceptual Illustration: Repeated Reassurance / Ritual Loop'
                : `Conceptual Illustration: ERP Practice Stage ${sessionNumber}`}
            </span>
            <span className="font-mono tabular-nums text-xs text-primary font-semibold">
              Illustrative Peak: {simulation.peakDistress}/10 · 60m: {simulation.endingDistress}/10
            </span>
          </div>

          <svg
            viewBox="0 0 600 230"
            className="w-full h-56 md:h-64 overflow-visible"
            role="img"
            aria-label={`Conceptual educational chart comparing ${
              mode === 'compulsion_loop'
                ? 'Compulsive Reassurance Loop'
                : `ERP Practice Stage ${sessionNumber}`
            }`}
          >
            <defs>
              <linearGradient id="SimCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={mode === 'compulsion_loop' ? '#B91C1C' : '#2A6F68'}
                  stopOpacity="0.32"
                />
                <stop
                  offset="100%"
                  stopColor={mode === 'compulsion_loop' ? '#B91C1C' : '#1B4D3E'}
                  stopOpacity="0.03"
                />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines (Conceptual Scale 2, 5, 8, 10) */}
            {[2, 5, 8, 10].map((lvl) => {
              const y = Math.round(195 - (lvl / 10) * 165);
              return (
                <g key={lvl}>
                  <line
                    x1="45"
                    y1={y}
                    x2="560"
                    y2={y}
                    stroke="currentColor"
                    className="text-border"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="14"
                    y={y + 4}
                    className="fill-muted-foreground text-[10px] font-mono"
                  >
                    {lvl}/10
                  </text>
                </g>
              );
            })}

            {/* Vertical Scrubber Line for Inspected Minute */}
            <line
              x1={inspectedPoint.svgX}
              y1="25"
              x2={inspectedPoint.svgX}
              y2="195"
              stroke="#2A6F68"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* X-Axis Labels (Minutes) */}
            {[0, 15, 30, 45, 60].map((min) => {
              const x = Math.round(45 + (min / 60) * 510);
              return (
                <text
                  key={min}
                  x={x}
                  y="216"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  {min}m
                </text>
              );
            })}

            {/* Shaded Area under Curve */}
            <path d={simulation.svgAreaD} fill="url(#SimCurveGrad)" />

            {/* Primary Curve Line */}
            <path
              d={simulation.svgPathD}
              fill="none"
              stroke={mode === 'compulsion_loop' ? '#B91C1C' : '#1B4D3E'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points & Callouts */}
            {simulation.points.map((pt, idx) => {
              const isValley = pt.distress < 4.5 && mode === 'compulsion_loop';
              const isInspected = idx === inspectedPointIdx;
              return (
                <g
                  key={pt.minute}
                  onClick={() => setInspectedPointIdx(idx)}
                  className="cursor-pointer"
                >
                  {isInspected && (
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r="11"
                      fill="#2A6F68"
                      fillOpacity="0.25"
                    />
                  )}
                  <circle
                    cx={pt.svgX}
                    cy={pt.svgY}
                    r={isInspected ? 6.5 : pt.annotation ? 5.5 : 4}
                    fill={isInspected ? '#1B4D3E' : '#FAF7F0'}
                    stroke={mode === 'compulsion_loop' ? '#B91C1C' : '#1B4D3E'}
                    strokeWidth="2.5"
                  />
                  {pt.annotation && (
                    <text
                      x={Math.min(485, Math.max(105, pt.svgX))}
                      y={isValley ? Math.min(192, pt.svgY + 20) : Math.max(16, pt.svgY - 15)}
                      textAnchor="middle"
                      stroke="var(--card)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      style={{ paintOrder: 'stroke' }}
                      className="fill-foreground text-[10px] font-semibold select-none"
                    >
                      {pt.annotation}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive 60-Minute Timestamp Explorer Strip */}
          <div className="mt-3 pt-3 border-t border-border space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold text-foreground inline-flex items-center gap-1.5">
                <Clock size={13} className="text-primary" aria-hidden="true" />
                Inspect Conceptual Stage Along the 60-Minute Window:
              </span>
              <div className="flex flex-wrap gap-1">
                {simulation.points.map((pt, idx) => (
                  <button
                    key={pt.minute}
                    type="button"
                    onClick={() => setInspectedPointIdx(idx)}
                    className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold cursor-pointer smooth-transition ${
                      inspectedPointIdx === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground border border-border hover:text-foreground'
                    }`}
                  >
                    {pt.minute}m
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">
                At {inspectedPoint.minute} minutes (Conceptual Illustration {inspectedPoint.distress}/10):
              </strong>{' '}
              {MINUTE_EXPLANATIONS[mode][inspectedPoint.minute]}
            </div>
          </div>
        </div>

        {/* Right Zone: Interactive Parameters & Fictional Scenario Walkthrough */}
        <div className="lg:col-span-5 space-y-5">
          {/* ERP Session Slider */}
          <div className="bg-secondary/60 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="erp-session-slider"
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Sliders size={14} className="text-primary" aria-hidden="true" />
                Repeated ERP Practice Illustration (1 to 5)
              </label>
              <span className="font-mono tabular-nums text-xs font-bold text-primary">
                Practice {sessionNumber} of 5
              </span>
            </div>
            <input
              id="erp-session-slider"
              type="range"
              min={1}
              max={5}
              value={sessionNumber}
              disabled={mode === 'compulsion_loop'}
              onChange={(e) => {
                setMode('erp_habituation');
                setSessionNumber(Number(e.target.value));
              }}
              className="w-full accent-primary disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>Stage 1 (First pause)</span>
              <span>Stage 3 (Building willingness)</span>
              <span>Stage 5 (Consolidated)</span>
            </div>
          </div>

          {/* Scenario Selector */}
          <div>
            <p className="text-xs font-bold text-foreground mb-2">
              Explore Fictional Educational Examples (Not Personalised Advice):
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SCENARIO_EXAMPLES.map((scen) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer smooth-transition ${
                    selectedScenarioId === scen.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground border border-border hover:border-primary/40'
                  }`}
                >
                  {scen.title.replace(' (Fictional Example)', '')}
                </button>
              ))}
            </div>

            <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-2.5 text-xs">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Trigger Moment:</strong>{' '}
                {activeScenario.trigger}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-destructive">Short-Term Ritual (Maintains Loop):</strong>{' '}
                {activeScenario.compulsionResponse}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-primary">Response-Prevention Learning (ERP):</strong>{' '}
                {activeScenario.erpResponse}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/treatment')}
              className="button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
            >
              <Stethoscope size={14} aria-hidden="true" />
              Read Full CBT &amp; ERP Guide
              <ChevronRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/tools?tab=journal')}
              className="button-secondary text-xs py-2.5 px-4"
            >
              Open Private ERP Journal
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Animated 5-Stage Circular OCD Cycle Diagram + Stage Cards */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-xs font-bold text-foreground">
              Interactive 5-Stage OCD Cycle Diagram (Educational Model)
            </p>
            <p className="text-xs text-muted-foreground">
              Select any stage in the circular diagram or cards below to inspect how the cycle operates and where ERP steps in. Individual OCD experiences vary.
            </p>
          </div>
          <span className="text-[11px] font-mono text-primary font-semibold shrink-0">
            Selected: Stage 0{selectedStageIndex + 1} · {activeStage.step}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-center mb-5">
          {/* Circular Animated SVG Diagram of the 5-Stage OCD Cycle */}
          <div className="lg:col-span-5 bg-secondary/45 border border-border rounded-2xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 360 285"
              className="w-full max-w-[340px] h-auto"
              role="img"
              aria-label="Interactive five-stage circular diagram of the OCD cycle: Trigger or intrusive thought, Anxiety or distress, Compulsion or mental ritual, Temporary relief, and Reinforcement of the cycle"
            >
              <defs>
                <linearGradient id="OcdRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#2A6F68" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Outer Dashed Cycle Ring */}
              <circle
                cx="180"
                cy="145"
                r="108"
                fill="none"
                stroke="url(#OcdRingGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />

              {/* Center Educational Hub */}
              <circle
                cx="180"
                cy="145"
                r="46"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.5"
              />
              <text
                x="180"
                y="139"
                textAnchor="middle"
                className="fill-primary text-[10px] font-mono font-bold"
              >
                OCD CYCLE
              </text>
              <text
                x="180"
                y="153"
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                Stage 0{selectedStageIndex + 1} of 05
              </text>

              {/* 5 Interactive Stage Nodes */}
              {CYCLE_NODE_COORDS.map((coord, idx) => {
                const isSelected = selectedStageIndex === idx;
                const isErpPoint = idx === 2;
                return (
                  <g
                    key={coord.short}
                    onClick={() => setSelectedStageIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect OCD cycle stage ${idx + 1}: ${OCD_CYCLE_STAGES[idx].step}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedStageIndex(idx);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="28"
                        fill="#2A6F68"
                        fillOpacity="0.2"
                      />
                    )}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? '20' : '16'}
                      fill={isSelected ? '#1B4D3E' : 'var(--card)'}
                      stroke={isErpPoint ? '#2A6F68' : '#1B4D3E'}
                      strokeWidth="2.5"
                    />
                    <text
                      x={coord.x}
                      y={coord.y + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold select-none ${
                        isSelected ? 'fill-white' : 'fill-foreground'
                      }`}
                    >
                      0{idx + 1}
                    </text>
                    <text
                      x={coord.x}
                      y={coord.y > 200 ? coord.y + 32 : coord.y - 24}
                      textAnchor="middle"
                      className={`text-[10px] font-semibold select-none ${
                        isSelected ? 'fill-primary font-bold' : 'fill-muted-foreground'
                      }`}
                    >
                      {coord.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 5 Stage Cards + Active Stage Detail */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {OCD_CYCLE_STAGES.map((stage, index) => {
                const isSelected = selectedStageIndex === index;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setSelectedStageIndex(index)}
                    className={`text-left rounded-xl p-3.5 border smooth-transition cursor-pointer ${
                      isSelected
                        ? 'bg-secondary border-primary ring-1 ring-primary'
                        : 'bg-background border-border hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono tabular-nums text-xs font-bold text-primary">
                        Stage 0{index + 1}
                      </span>
                      {index === 2 && (
                        <span className="text-[10px] font-semibold text-primary">
                          ERP Window
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-foreground text-xs sm:text-sm mb-1">
                      {stage.step}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="bg-secondary/70 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    Stage 0{selectedStageIndex + 1} ({activeStage.step}) — Educational Perspective:
                  </strong>{' '}
                  {selectedStageIndex === 0 &&
                    'Intrusive thoughts are automatic brain events, not intentions or character flaws. Avoid arguing with the thought when it arrives.'}
                  {selectedStageIndex === 1 &&
                    'Physical anxiety feels urgent, yet discomfort is not danger. Grounding or paced breathing can support your body without trying to force certainty.'}
                  {selectedStageIndex === 2 &&
                    'This is the Response Prevention window: delaying or skipping a checking, washing, or mental reassurance ritual interrupts the cycle.'}
                  {selectedStageIndex === 3 &&
                    'Short-term relief after a ritual is misleading—it teaches the brain’s threat detector that the ritual was required to stay safe.'}
                  {selectedStageIndex === 4 &&
                    'Stepping out of the cycle is a gradual learning process. Each time you practice willingness for uncertainty, the loop loses authority.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('erp_habituation');
                  setSessionNumber((s) => (s < 5 ? s + 1 : 1));
                }}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <RefreshCw size={13} aria-hidden="true" />
                Next ERP Stage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
