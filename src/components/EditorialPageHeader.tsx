import React from 'react';

interface EditorialPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  variant?: 'sanctuary' | 'constellation' | 'editorial' | 'community' | 'shield' | 'treatment';
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function EditorialPageHeader({
  eyebrow,
  title,
  description,
  variant = 'sanctuary',
  actions,
  children,
}: EditorialPageHeaderProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 hero-atmosphere border-b border-border">
      {/* Decorative Art-Directed Botanical & Pathway SVG Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-full max-w-xl opacity-85 hidden md:flex items-center justify-end pr-8"
      >
        <svg viewBox="0 0 360 180" className="w-80 h-40 overflow-visible">
          <defs>
            <linearGradient id="EdGradSageTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A6F68" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#1E2D40" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="EdGradForest" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2A6F68" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {variant === 'sanctuary' && (
            <>
              <circle cx="250" cy="88" r="68" fill="url(#EdGradSageTeal)" />
              <circle cx="195" cy="96" r="46" fill="url(#EdGradForest)" />
              <path
                d="M 85 135 Q 175 80 260 122 T 350 98"
                fill="none"
                stroke="#2A6F68"
                strokeWidth="2"
                strokeOpacity="0.55"
              />
              <circle
                cx="250"
                cy="88"
                r="14"
                fill="#FAF7F0"
                fillOpacity="0.9"
                stroke="#1B4D3E"
                strokeWidth="2"
              />
            </>
          )}

          {variant === 'constellation' && (
            <>
              <circle cx="265" cy="75" r="60" fill="url(#EdGradSageTeal)" />
              <path
                d="M 130 130 L 195 78 L 265 102 L 325 52"
                fill="none"
                stroke="#1B4D3E"
                strokeWidth="1.75"
                strokeDasharray="4 4"
                strokeOpacity="0.55"
              />
              {[
                { x: 130, y: 130 },
                { x: 195, y: 78 },
                { x: 265, y: 102 },
                { x: 325, y: 52 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#FAF7F0"
                  stroke="#1B4D3E"
                  strokeWidth="2"
                />
              ))}
            </>
          )}

          {variant === 'treatment' && (
            <>
              <circle cx="248" cy="88" r="66" fill="url(#EdGradSageTeal)" />
              <circle cx="248" cy="88" r="42" fill="url(#EdGradForest)" />
              <path
                d="M 135 126 C 175 120, 195 62, 248 88 C 288 108, 310 66, 345 58"
                fill="none"
                stroke="#1B4D3E"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
              {[
                { x: 135, y: 126 },
                { x: 205, y: 82 },
                { x: 248, y: 88 },
                { x: 300, y: 78 },
                { x: 345, y: 58 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === 2 ? '8' : '5.5'}
                  fill="#FAF7F0"
                  stroke={idx === 2 ? '#1B4D3E' : '#2A6F68'}
                  strokeWidth="2"
                />
              ))}
            </>
          )}

          {variant === 'editorial' && (
            <>
              <rect
                x="165"
                y="28"
                width="145"
                height="118"
                rx="18"
                fill="url(#EdGradSageTeal)"
                stroke="#2A6F68"
                strokeOpacity="0.35"
              />
              <line
                x1="190"
                y1="62"
                x2="275"
                y2="62"
                stroke="#1B4D3E"
                strokeWidth="2.5"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
              <line
                x1="190"
                y1="86"
                x2="290"
                y2="86"
                stroke="#2A6F68"
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
              <line
                x1="190"
                y1="110"
                x2="250"
                y2="110"
                stroke="#1E2D40"
                strokeWidth="2"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            </>
          )}

          {variant === 'community' && (
            <>
              <circle cx="205" cy="92" r="48" fill="url(#EdGradSageTeal)" />
              <circle cx="265" cy="84" r="52" fill="url(#EdGradForest)" />
              <circle
                cx="235"
                cy="88"
                r="18"
                fill="#FAF7F0"
                fillOpacity="0.85"
                stroke="#2A6F68"
                strokeWidth="2"
              />
            </>
          )}

          {variant === 'shield' && (
            <>
              <circle cx="245" cy="88" r="64" fill="url(#EdGradSageTeal)" />
              <path
                d="M 245 40 L 285 56 V 92 C 285 118 267 136 245 144 C 223 136 205 118 205 92 V 56 L 245 40 Z"
                fill="#FAF7F0"
                fillOpacity="0.85"
                stroke="#1B4D3E"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-primary mb-2 tracking-wide uppercase">
            {eyebrow}
          </p>
          <h1 className="heading-lg mb-3">{title}</h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        {(actions || children) && <div className="shrink-0">{actions || children}</div>}
      </div>
    </section>
  );
}
