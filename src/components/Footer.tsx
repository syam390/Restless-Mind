import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { CrisisRegionCode } from '../lib/wellbeingLogic';

interface FooterProps {
  onNavigate: (path: string) => void;
  region: CrisisRegionCode;
  onRegionChange: (region: CrisisRegionCode) => void;
}

export default function Footer({ onNavigate, region, onRegionChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="bg-secondary/80 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-10">
          {/* Brand & Region Selector */}
          <div className="lg:col-span-4">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="font-bold text-lg text-foreground tracking-tight inline-block mb-3 hover:text-primary smooth-transition"
            >
              Restless Mind
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-sm">
              Compassionate, privacy-first educational support and daily self-reflection tools for understanding OCD, intrusive thoughts, and anxiety.
            </p>
            <div>
              <label htmlFor="footer-region" className="block text-xs font-semibold text-foreground mb-1.5">
                Crisis Helpline Region:
              </label>
              <select
                id="footer-region"
                value={region}
                onChange={(e) => onRegionChange(e.target.value as CrisisRegionCode)}
                className="w-full max-w-xs text-xs px-3.5 py-2 rounded-xl border border-border bg-card text-foreground font-medium"
              >
                <option value="IN">India (Tele-MANAS 14416 / iCall)</option>
                <option value="US">US &amp; Canada (988 Lifeline)</option>
                <option value="UK">United Kingdom (NHS 111 / 116 123)</option>
                <option value="GLOBAL">International (Find A Helpline)</option>
              </select>
            </div>
          </div>

          {/* Learn & Understand */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-foreground mb-4">Understand OCD &amp; Anxiety</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/treatment"
                  onClick={(e) => handleLink(e, '/treatment')}
                  className="text-sm font-semibold text-primary hover:underline smooth-transition"
                >
                  Understanding Treatment (CBT, ERP, ACT &amp; Medications)
                </a>
              </li>
              <li>
                <a
                  href="/#symptoms"
                  onClick={(e) => handleLink(e, '/#symptoms')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Symptom Patterns &amp; ERP Guide
                </a>
              </li>
              <li>
                <a
                  href="/#pathways"
                  onClick={(e) => handleLink(e, '/#pathways')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Whole-Person Wellbeing Pathways
                </a>
              </li>
              <li>
                <a
                  href="/#ocd-cycle"
                  onClick={(e) => handleLink(e, '/#ocd-cycle')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Understanding the OCD Cycle
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLink(e, '/blog')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Educational Articles &amp; Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Tools & Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-foreground mb-4">Tools &amp; Care</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/tools"
                  onClick={(e) => handleLink(e, '/tools')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Daily Wellness Tools
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  onClick={(e) => handleLink(e, '/resources')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Verified Help Directory
                </a>
              </li>
              <li>
                <a
                  href="/stories"
                  onClick={(e) => handleLink(e, '/stories')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Community Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-foreground mb-4">Community &amp; Privacy</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, '/contact')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Contact &amp; Inquiry Receipts
                </a>
              </li>
              <li>
                <a
                  href="/volunteer"
                  onClick={(e) => handleLink(e, '/volunteer')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Volunteer Opportunities
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLink(e, '/privacy')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Privacy, Consent &amp; Data Export
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLink(e, '/terms')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Terms &amp; Clinical Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Non-Diagnostic & Crisis Support Notice */}
        <div className="border-t border-border pt-8">
          <div className="bg-card border border-border p-5 rounded-2xl mb-6 grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex items-start gap-3">
              <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Non-Diagnostic Educational Platform:</strong> Restless Mind is an educational and self-reflection resource. It does not diagnose medical or psychiatric conditions, provide clinical certainty, or replace care from a qualified mental-health professional.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <div className="inline-flex items-center gap-2 text-xs text-foreground bg-secondary px-3.5 py-2 rounded-xl border border-border font-medium">
                <PhoneCall size={14} className="text-destructive shrink-0" aria-hidden="true" />
                <span>
                  24/7 Crisis: <strong className="font-mono tabular-nums">14416</strong> (IN) · <strong className="font-mono tabular-nums">988</strong> (US/CA)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
            <p>© {currentYear} Restless Mind — Understanding OCD &amp; Anxiety. All rights reserved.</p>
            <p>Local-First Device Privacy · Open mHealth Schema Export · WCAG AA Accessible</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
