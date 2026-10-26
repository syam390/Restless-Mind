import React from 'react';
import { Heart } from 'lucide-react';
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
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-3">Restless Mind</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Free, compassionate support for understanding OCD, anxiety, intrusive thoughts, and whole-person mental wellbeing.
            </p>
            <div>
              <label htmlFor="footer-region" className="block text-xs font-semibold text-foreground mb-1">
                Crisis Helpline Region:
              </label>
              <select
                id="footer-region"
                value={region}
                onChange={(e) => onRegionChange(e.target.value as CrisisRegionCode)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="IN">India (Tele-MANAS 14416 / iCall)</option>
                <option value="US">US &amp; Canada (988 Lifeline)</option>
                <option value="UK">United Kingdom (NHS 111 / 116 123)</option>
                <option value="GLOBAL">International (Find A Helpline)</option>
              </select>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Learn</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#symptoms"
                  onClick={(e) => handleLink(e, '/#symptoms')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Symptom Guide &amp; Pathways
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
                  Blog &amp; Evidence Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get Help</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/resources"
                  onClick={(e) => handleLink(e, '/resources')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Find Verified Resources
                </a>
              </li>
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
                  href="/stories"
                  onClick={(e) => handleLink(e, '/stories')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Community Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Privacy */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Community &amp; Privacy</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, '/contact')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/volunteer"
                  onClick={(e) => handleLink(e, '/volunteer')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Volunteer
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLink(e, '/privacy')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Privacy, Consent &amp; Data Controls
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLink(e, '/terms')}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="bg-card border border-border p-4 rounded-xl mb-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important Clinical &amp; Prototype Disclaimer:</strong> Restless Mind is an educational and self-reflection platform, not a medical device, diagnostic tool, or substitute for professional psychiatric or psychological care. This prototype does not provide 24/7 human monitoring. In a crisis in India, call <strong className="font-mono tabular-nums text-foreground">14416</strong> (Tele-MANAS, 24/7 toll-free) or <strong className="font-mono tabular-nums text-foreground">112</strong>; in the US/Canada, call or text <strong className="font-mono tabular-nums text-foreground">988</strong>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>
              © {currentYear} Restless Mind. Built with{' '}
              <Heart size={13} className="inline fill-primary text-primary mx-0.5" aria-hidden="true" /> for earlier, safer mental-wellbeing support.
            </p>
            <p>Open-Source Schema Compatible (Open mHealth Apache-2.0) · Privacy-First Local Storage</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
