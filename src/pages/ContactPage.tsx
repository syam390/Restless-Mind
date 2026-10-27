import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { validateContactSubmission } from '../lib/wellbeingLogic';
import EditorialPageHeader from '../components/EditorialPageHeader';

interface ContactPageProps {
  initialSubject?: string;
}

interface ReceiptInfo {
  receiptId: string;
  createdAt: string;
  maskedEmail: string;
  subject: string;
  prototypeNotice: string;
}

const CONTACT_RECEIPTS_KEY = 'rm_contact_receipts_v1';

export default function ContactPage({ initialSubject = '' }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  });
  const [receipt, setReceipt] = useState<ReceiptInfo | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<ReceiptInfo[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(CONTACT_RECEIPTS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setReceipt(null);

    const validation = validateContactSubmission(formData);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please check all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Unable to submit message.');
      } else {
        const newReceipt: ReceiptInfo = {
          receiptId: data.receiptId,
          createdAt: data.createdAt,
          maskedEmail: data.maskedEmail || 'masked',
          subject: data.subject || formData.subject,
          prototypeNotice: data.prototypeNotice,
        };
        setReceipt(newReceipt);
        const updated = [newReceipt, ...recentReceipts];
        setRecentReceipts(updated);
        try {
          sessionStorage.setItem(CONTACT_RECEIPTS_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setErrorMsg('Network error while sending message.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      {/* Hero */}
      <EditorialPageHeader
        eyebrow="Feedback · Resource Suggestions · Volunteer Inquiries"
        title="Get in Touch with Restless Mind"
        description="Have feedback on our tools, a verified clinic to suggest, or interest in volunteering? Send us a non-clinical inquiry below."
        variant="sanctuary"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
              <Mail size={24} className="text-primary mb-3" aria-hidden="true" />
              <h2 className="font-bold text-foreground mb-1">General &amp; Editorial</h2>
              <p className="text-muted-foreground text-sm">hello@restlessmind.org</p>
              <p className="text-xs text-muted-foreground mt-1">Non-clinical inquiries &amp; partnerships</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
              <Phone size={24} className="text-destructive mb-3" aria-hidden="true" />
              <h2 className="font-bold text-foreground mb-1">24/7 Crisis Helplines</h2>
              <p className="text-foreground font-mono tabular-nums text-sm font-semibold">
                India: 14416 (Tele-MANAS) / 112
              </p>
              <p className="text-muted-foreground font-mono tabular-nums text-xs mt-1">
                iCall: +91 91529 87821 · US/CA: 988
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
              <ShieldCheck size={24} className="text-primary mb-3" aria-hidden="true" />
              <h2 className="font-bold text-foreground mb-1">Privacy &amp; Crisis Safeguard</h2>
              <p className="text-muted-foreground text-xs leading-relaxed">
                This form screens for acute crisis phrases, masks your email in server receipts, and never stores sensitive clinical records.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-secondary/70 border border-border rounded-2xl p-6 md:p-10">
              {receipt ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="bg-card border border-primary/40 rounded-2xl p-6 md:p-8 text-center space-y-3"
                >
                  <CheckCircle size={32} className="text-primary mx-auto" aria-hidden="true" />
                  <p className="text-xs font-semibold text-primary">Inquiry Receipt Created</p>
                  <h3 className="font-bold text-foreground text-lg">
                    Reference Number:{' '}
                    <span className="font-mono tabular-nums text-primary">{receipt.receiptId}</span>
                  </h3>
                  <div className="bg-secondary border border-border rounded-xl p-3.5 text-xs font-mono tabular-nums text-muted-foreground space-y-1">
                    <p>Subject: {receipt.subject}</p>
                    <p>Masked Contact: {receipt.maskedEmail}</p>
                    <p>Timestamp: {new Date(receipt.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{receipt.prototypeNotice}</p>
                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                    className="button-secondary text-xs py-2.5 px-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-2">
                    <h2 className="heading-md mb-1">Send an Inquiry</h2>
                    <p className="text-xs text-muted-foreground">
                      Please do not include private medical records or emergency crisis requests in this form.
                    </p>
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="bg-destructive/10 border border-destructive/40 text-destructive rounded-xl p-3.5 text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle size={17} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-1.5">
                      Name or Preferred Alias
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
                      placeholder="Your name or preferred alias"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-1.5">
                      Email Address (Masked in Server Receipts)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-foreground mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-1.5">
                      Message (Minimum 10 characters)
                    </label>
                    <textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm"
                      rows={5}
                      placeholder="Share your feedback, resource suggestion, or volunteer interest..."
                      minLength={10}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary w-full inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Send size={17} aria-hidden="true" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Session-Only Inquiry Receipts (Visible only to the current browser session) */}
            {recentReceipts.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-foreground mb-1">
                  Your Current Session Receipts ({recentReceipts.length})
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Visible only in your active browser tab (`sessionStorage`) and never exposed to other visitors.
                </p>
                <div className="space-y-2.5">
                  {recentReceipts.map((item) => (
                    <div
                      key={item.receiptId}
                      className="flex flex-wrap items-center justify-between gap-2 text-xs bg-secondary border border-border rounded-xl p-3.5"
                    >
                      <span className="font-mono tabular-nums font-bold text-primary">
                        {item.receiptId}
                      </span>
                      <span className="text-foreground font-medium">{item.subject}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {item.maskedEmail} · {new Date(item.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
