import React, { useState } from 'react';
import { Menu, X, PhoneCall, Sun, Moon } from 'lucide-react';
import { CrisisRegionCode, getCrisisResourcesByRegion } from '../lib/wellbeingLogic';

export type AppRoute =
  | '/'
  | '/tools'
  | '/resources'
  | '/stories'
  | '/blog'
  | '/contact'
  | '/volunteer'
  | '/privacy'
  | '/terms';

interface HeaderProps {
  currentPath: AppRoute;
  onNavigate: (path: string) => void;
  region: CrisisRegionCode;
  onRegionChange: (region: CrisisRegionCode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  currentPath,
  onNavigate,
  region,
  onRegionChange,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const crisisData = getCrisisResourcesByRegion(region);

  const navItems: Array<{ label: string; href: string; match: AppRoute }> = [
    { label: 'Symptoms & Pathways', href: '/#symptoms', match: '/' },
    { label: 'Daily Tools', href: '/tools', match: '/tools' },
    { label: 'Find Help', href: '/resources', match: '/resources' },
    { label: 'Stories', href: '/stories', match: '/stories' },
    { label: 'Blog & Guides', href: '/blog', match: '/blog' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <nav
          aria-label="Primary Navigation"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6"
        >
          {/* Zone 1: Brand Title */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap shrink-0 hover:text-primary smooth-transition"
          >
            Restless Mind
          </a>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPath === item.match && !item.href.includes('#');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap shrink-0 py-1 border-b-2 smooth-transition ${
                    isActive
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-foreground/80 hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Zone 3: Primary Crisis Action + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 smooth-transition"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setShowCrisisModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-destructive rounded-lg hover:opacity-95 smooth-transition whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 shadow-xs"
            >
              <PhoneCall size={14} aria-hidden="true" />
              Crisis Support ({region === 'IN' ? '14416' : region === 'US' ? '988' : 'Help'})
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent/60 smooth-transition"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="block text-foreground hover:text-primary smooth-transition font-medium px-3 py-2.5 rounded-lg hover:bg-accent/40"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Location-Aware Verified Crisis Support Dialog */}
      {showCrisisModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="crisis-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 id="crisis-dialog-title" className="text-xl font-bold text-foreground">
                  Immediate Human Crisis &amp; Emergency Support
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Restless Mind does not provide 24/7 live monitoring. Please connect with a verified helpline in your region:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCrisisModal(false)}
                className="p-2 rounded-lg hover:bg-muted text-foreground"
                aria-label="Close crisis support dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Region Selector */}
            <div className="mb-6">
              <label htmlFor="crisis-region-select" className="block text-xs font-semibold text-muted-foreground mb-2">
                Select Your Location for Verified Local Helplines:
              </label>
              <div id="crisis-region-select" className="flex flex-wrap gap-2">
                {(['IN', 'US', 'UK', 'GLOBAL'] as CrisisRegionCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onRegionChange(code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 smooth-transition ${
                      region === code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    {code === 'IN'
                      ? 'India (14416 / 112)'
                      : code === 'US'
                      ? 'US & Canada (988)'
                      : code === 'UK'
                      ? 'UK (111 / 999)'
                      : 'International Directory'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-foreground">
                Emergency Services in {crisisData.regionName}:{' '}
                <span className="font-mono tabular-nums text-destructive font-bold">{crisisData.emergencyNumber}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                If you or someone else is in immediate physical danger, call {crisisData.emergencyNumber} or go to the nearest hospital emergency room.
              </p>
            </div>

            <div className="space-y-4">
              {crisisData.helplines.map((line) => (
                <div key={line.name} className="border border-border rounded-xl p-4 bg-secondary/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base">{line.name}</h3>
                    <span className="font-mono tabular-nums text-sm font-bold text-primary">{line.phone}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {line.organization} · {line.hours} · Languages: {line.languages}
                  </p>
                  <p className="text-sm text-foreground/90 mb-2">{line.description}</p>
                  <a
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Visit official website ({line.url}) →
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCrisisModal(false)}
                className="button-secondary text-sm py-2 px-4"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
