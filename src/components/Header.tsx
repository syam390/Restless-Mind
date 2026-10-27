import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, Sun, Moon, Sparkles, ExternalLink } from 'lucide-react';
import { CrisisRegionCode, getCrisisResourcesByRegion } from '../lib/wellbeingLogic';

export type AppRoute =
  | '/'
  | '/treatment'
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCrisisModal(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: Array<{ label: string; href: string; match: AppRoute }> = [
    { label: 'Overview', href: '/', match: '/' },
    { label: 'Treatment', href: '/treatment', match: '/treatment' },
    { label: 'Daily Tools', href: '/tools', match: '/tools' },
    { label: 'Resources', href: '/resources', match: '/resources' },
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
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <nav
          aria-label="Primary Navigation"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6"
        >
          {/* Zone 1: Brand Title */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="text-base sm:text-lg font-bold tracking-tight text-foreground whitespace-nowrap shrink-0 hover:text-primary smooth-transition"
          >
            Restless Mind
          </a>

          {/* Zone 2: Primary Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPath === item.match;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap shrink-0 py-1.5 border-b-2 smooth-transition ${
                    isActive
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Zone 3: Primary Wellness Tools Action + Crisis Support & Theme Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary smooth-transition cursor-pointer"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setShowCrisisModal(true)}
              className="px-2.5 sm:px-3 py-2 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/25 rounded-xl hover:bg-destructive/15 smooth-transition whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall size={14} aria-hidden="true" />
              <span>
                <span className="hidden sm:inline">Crisis Support </span>
                <span className="sm:hidden">Crisis </span>({region === 'IN' ? '14416' : region === 'US' ? '988' : 'Help'})
              </span>
            </button>

            <a
              href="/tools"
              onClick={(e) => handleLinkClick(e, '/tools')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl button-primary whitespace-nowrap shrink-0"
            >
              <Sparkles size={14} aria-hidden="true" />
              Explore Wellness Tools
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-secondary smooth-transition cursor-pointer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Accessible Mobile Navigation Drawer */}
        {isOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-t border-border bg-card px-4 py-4 space-y-1.5 shadow-lg"
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.match;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block font-medium px-3.5 py-2.5 rounded-xl smooth-transition ${
                    isActive
                      ? 'bg-secondary text-primary font-semibold'
                      : 'text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2 mt-2 border-t border-border flex flex-col gap-2">
              <a
                href="/tools"
                onClick={(e) => handleLinkClick(e, '/tools')}
                className="w-full button-primary text-xs py-2.5 text-center inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} aria-hidden="true" />
                Explore Wellness Tools
              </a>
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pt-1">
                <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-primary">
                  Contact
                </a>
                <span>·</span>
                <a href="/volunteer" onClick={(e) => handleLinkClick(e, '/volunteer')} className="hover:text-primary">
                  Volunteer
                </a>
                <span>·</span>
                <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-primary">
                  Privacy
                </a>
                <span>·</span>
                <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-primary">
                  Terms
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Location-Aware Verified Crisis Support Dialog */}
      {showCrisisModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="crisis-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-semibold text-destructive mb-1">
                  24/7 Verified Human Support Directory
                </p>
                <h2 id="crisis-dialog-title" className="text-xl font-bold text-foreground">
                  Immediate Human Crisis &amp; Emergency Support
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Restless Mind is a self-guided platform and does not provide 24/7 live monitoring. Please connect with a verified helpline in your region:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCrisisModal(false)}
                className="p-2 rounded-xl hover:bg-secondary text-foreground cursor-pointer"
                aria-label="Close crisis support dialog"
              >
                <X size={20} aria-hidden="true" />
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 smooth-transition cursor-pointer ${
                      region === code
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-secondary text-foreground border border-border hover:border-primary/50'
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
                If you or someone else is in immediate physical danger, call {crisisData.emergencyNumber} or visit the nearest hospital emergency department.
              </p>
            </div>

            <div className="space-y-3.5">
              {crisisData.helplines.map((line) => (
                <div key={line.name} className="border border-border rounded-xl p-4 bg-secondary/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base">{line.name}</h3>
                    <span className="font-mono tabular-nums text-sm font-bold text-primary">{line.phone}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {line.organization} · {line.hours} · Languages: {line.languages}
                  </p>
                  <p className="text-sm text-foreground/90 mb-2.5 leading-relaxed">{line.description}</p>
                  <a
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit official website ({line.url})
                    <ExternalLink size={12} aria-hidden="true" />
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
