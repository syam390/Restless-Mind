import React, { useState } from 'react';
import { Shield, Download, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { exportToOpenMHealthSchema } from '../lib/wellbeingLogic';

const STORAGE_CONSENT_KEY = 'rm_local_storage_consent_v1';
const STORAGE_JOURNAL_KEY = 'rm_journal_entries_v1';
const STORAGE_CHECKIN_KEY = 'rm_daily_checkins_v1';

export default function PrivacyPage() {
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleExportData = () => {
    try {
      const journals = JSON.parse(localStorage.getItem(STORAGE_JOURNAL_KEY) || '[]');
      const checkIns = JSON.parse(localStorage.getItem(STORAGE_CHECKIN_KEY) || '[]');
      const payload = exportToOpenMHealthSchema(checkIns, journals);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restless-mind-privacy-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setActionStatus('Exported your local data in Open mHealth JSON format.');
    } catch {
      setActionStatus('No local data found to export.');
    }
  };

  const handleDeleteData = () => {
    try {
      localStorage.removeItem(STORAGE_JOURNAL_KEY);
      localStorage.removeItem(STORAGE_CHECKIN_KEY);
      localStorage.removeItem(STORAGE_CONSENT_KEY);
      setActionStatus('All local journals, daily check-ins, and consent flags have been permanently erased from this device.');
    } catch {
      setActionStatus('Cleared session data.');
    }
  };

  return (
    <div>
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-lg mb-3">Privacy Policy, Consent &amp; Data Controls</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Mental-health information is deeply personal. See exactly how Restless Mind protects your data and manage your device storage anytime.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Interactive Data Portability & Deletion Controls */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-3 mb-4">
              <Shield size={24} className="text-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="heading-md mb-1">Your Data Rights: Export or Erase Immediately</h2>
                <p className="text-sm text-muted-foreground">
                  Your Thought Journal entries and Daily Check-Ins are stored strictly on your device (`localStorage`) only when you opt in. You can export them in Open mHealth standard JSON format or erase them in one click:
                </p>
              </div>
            </div>

            {actionStatus && (
              <div
                role="status"
                className="bg-secondary border border-primary/40 rounded-xl p-3.5 text-sm text-foreground mb-4 flex items-center gap-2"
              >
                <CheckCircle size={16} className="text-primary shrink-0" />
                <span>{actionStatus}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="button-secondary text-sm inline-flex items-center gap-2"
              >
                <Download size={16} aria-hidden="true" />
                Download My Data (Open mHealth JSON)
              </button>
              <button
                type="button"
                onClick={handleDeleteData}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-destructive text-white hover:opacity-95 smooth-transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete All My Device Data
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">1. Local-First By Default</h3>
              <p>
                Your private Thought Journal entries and Daily Check-Ins stay in your browser&apos;s local storage (only after you toggle consent) and are never uploaded to a central database, shared with employers, family members, or volunteers, or used for advertising.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">2. How the Optional AI Guide Processes Input</h3>
              <p>
                When you explicitly submit a question in the &ldquo;Appointment &amp; AI Guide&rdquo; tab, your prompt is sent over HTTPS to our server-side route (`/api/ai/guide`). Our server first runs deterministic local checks for crisis keywords and OCD reassurance-seeking before forwarding non-crisis educational requests to the Gemini API (`gemini-3.8-flash`). Private API keys stay strictly on the server and are never exposed in client code. We do not log or store your prompts on the server.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">3. Community Stories &amp; Contact Inquiries</h3>
              <p>
                Stories submitted on the Stories page default to anonymous submission and enter a safety moderation queue. Contact inquiries are used solely to respond to your message.
              </p>
            </div>

            <div className="bg-secondary border border-border rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs">
                <strong className="text-foreground">Clinical &amp; Emergency Notice:</strong> Restless Mind is an educational prototype and does not provide 24/7 clinical monitoring. In an emergency, contact Tele-MANAS (14416), iCall (+91 91529 87821), 112 (India), or 988 (US/Canada).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
