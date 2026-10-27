import React, { useState } from 'react';
import { MapPin, DollarSign, Globe, Phone, Users, BookOpen, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { GOVERNMENT_AND_PUBLIC_RESOURCES, ONLINE_AND_NGO_RESOURCES } from '../data/restlessMindData';
import EditorialPageHeader from '../components/EditorialPageHeader';

interface ResourcesPageProps {
  onNavigate: (path: string) => void;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const [filterType, setFilterType] = useState<'all' | 'Free / Public' | 'Sliding Scale / NGO' | 'Global Directory'>('all');
  const [checkedPrepItems, setCheckedPrepItems] = useState<Record<number, boolean>>({});

  const appointmentChecklist = [
    'Jot down 2–3 examples of recurring thoughts, doubts, or rituals that take up time',
    'Note how sleep, work, study, or physical health (e.g., PCOS, thyroid, fatigue) have felt recently',
    'List any past therapies or medications you have tried (if applicable)',
    'Bring 2 questions for the clinician (e.g., "Do you use ERP or CBT for OCD and anxiety?")',
  ];

  const filteredGov = GOVERNMENT_AND_PUBLIC_RESOURCES.filter(
    (r) => filterType === 'all' || r.costType === filterType
  );
  const filteredOnline = ONLINE_AND_NGO_RESOURCES.filter(
    (r) => filterType === 'all' || r.costType === filterType
  );

  return (
    <div>
      {/* Hero */}
      <EditorialPageHeader
        eyebrow="Verified Public Institutes · NGO Helplines · Global Directories"
        title="Find Verified & Affordable Mental-Health Support"
        description="Verified government mental-health institutes, 24/7 free tele-counseling lines, and evidence-based OCD and anxiety directories across India and internationally."
        variant="sanctuary"
        actions={
          <div className="flex flex-wrap gap-2 shrink-0" role="group" aria-label="Filter resources by cost type">
            {(['all', 'Free / Public', 'Sliding Scale / NGO', 'Global Directory'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 smooth-transition cursor-pointer ${
                  filterType === type
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card text-foreground border border-border hover:bg-secondary'
                }`}
              >
                {type === 'all' ? 'All Resources' : type}
              </button>
            ))}
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Immediate Crisis Banner */}
          <div className="bg-secondary border border-border rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-destructive shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs md:text-sm text-muted-foreground">
                <strong className="text-foreground">Immediate 24/7 Crisis Lines:</strong> India Tele-MANAS{' '}
                <strong className="font-mono tabular-nums text-foreground">14416</strong> /{' '}
                <strong className="font-mono tabular-nums text-foreground">1800-891-4416</strong> · iCall TISS{' '}
                <strong className="font-mono tabular-nums text-foreground">+91 91529 87821</strong> · Emergency{' '}
                <strong className="font-mono tabular-nums text-foreground">112</strong> · US/Canada{' '}
                <strong className="font-mono tabular-nums text-foreground">988</strong> · UK{' '}
                <strong className="font-mono tabular-nums text-foreground">111</strong>
              </div>
            </div>
          </div>

          {/* Government Hospitals & Public Services */}
          {filteredGov.length > 0 && (
            <div>
              <h2 className="heading-md mb-6 flex items-center gap-3">
                <MapPin size={24} className="text-primary" aria-hidden="true" />
                Government Mental Health Institutes &amp; Public Helplines (Free / Low Cost)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredGov.map((item) => (
                  <div
                    key={item.name}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {item.locationOrScope} · {item.costType}
                      </p>
                      <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      <span className="flex items-center gap-2 text-xs sm:text-sm font-mono tabular-nums font-semibold text-foreground">
                        <Phone size={15} className="text-primary" aria-hidden="true" />
                        {item.contactOrPhone}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Official Portal
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Online, Non-Profit & Specialist Directories */}
          {filteredOnline.length > 0 && (
            <div>
              <h2 className="heading-md mb-6 flex items-center gap-3">
                <Globe size={24} className="text-primary" aria-hidden="true" />
                Verified Non-Profit Helplines &amp; Specialist Directories
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredOnline.map((item) => (
                  <div
                    key={item.name}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {item.locationOrScope} · {item.costType}
                      </p>
                      <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      <span className="text-xs font-mono tabular-nums font-semibold text-foreground">
                        {item.contactOrPhone}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Visit Verified Directory
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Expect + Interactive First-Visit Readiness Checklist */}
          <div>
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <Users size={24} className="text-primary" aria-hidden="true" />
              What to Expect &amp; First-Appointment Readiness Checklist
            </h2>
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-foreground mb-4">Your First Appointment</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        They will ask about what you have been experiencing, how long it has been happening, and how it affects daily life.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        You never have to share every intrusive thought detail on day one—share at a pace that feels safe.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Use our Appointment Preparation tool on the Daily Tools page to download a written question sheet.
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-4">Evidence-Based Treatment Approaches</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-foreground">ERP (Exposure &amp; Response Prevention)</strong> — First-line behavioral therapy for OCD.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-foreground">CBT &amp; ACT</strong> — Structured approaches for generalized anxiety, panic, and low mood.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-foreground">Medical / Psychiatric Consultation</strong> — When appropriate, medication evaluation or screening for thyroid/hormonal factors (e.g., PCOS/PCOD).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="bg-secondary/60 border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-foreground text-sm">
                    Interactive First-Appointment Preparation Checklist
                  </h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools?tab=ai-prep')}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Generate Custom Questions with AI Guide →
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {appointmentChecklist.map((item, idx) => {
                    const checked = Boolean(checkedPrepItems[idx]);
                    return (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/40 smooth-transition text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setCheckedPrepItems({ ...checkedPrepItems, [idx]: e.target.checked })
                          }
                          className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className={checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Insurance & Costs */}
          <div>
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <DollarSign size={24} className="text-primary" aria-hidden="true" />
              Understanding Costs &amp; Rights (Mental Healthcare Act 2017)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-bold text-foreground mb-3">Mental Health Coverage in India</h3>
                <ul className="space-y-2.5 text-muted-foreground text-sm">
                  <li>
                    · Under Section 21(4) of India&apos;s Mental Healthcare Act 2017 and IRDAI mandates, health insurers must cover mental illness on the same basis as physical illness.
                  </li>
                  <li>
                    · District Mental Health Programme (DMHP) clinics and government medical colleges provide free or nominal-cost outpatient care.
                  </li>
                  <li>
                    · Many NGOs and private clinics offer student or income-based sliding-scale fee slots.
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-bold text-foreground mb-3">Questions to Ask Before Booking</h3>
                <ul className="space-y-2.5 text-muted-foreground text-sm">
                  <li>· &ldquo;Do you have clinical training in ERP or CBT for OCD and anxiety?&rdquo;</li>
                  <li>· &ldquo;Do you offer sliding-scale fees or student rates?&rdquo;</li>
                  <li>· &ldquo;What is your cancellation policy and session fee structure?&rdquo;</li>
                  <li>· &ldquo;How is my confidentiality protected under clinic policy?&rdquo;</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Books & Learning */}
          <div>
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <BookOpen size={24} className="text-primary" aria-hidden="true" />
              Evidence-Based Books &amp; Learning Guides
            </h2>
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>
                  <strong className="text-foreground">&ldquo;The OCD Workbook&rdquo;</strong> by Bruce Hyman &amp; Cherry Pedrick — Practical self-help guide with step-by-step ERP exercises.
                </li>
                <li>
                  <strong className="text-foreground">&ldquo;Overcoming Unwanted Intrusive Thoughts&rdquo;</strong> by Sally Winston &amp; Martin Seif — Clear CBT/ERP guide to understanding sticky thoughts.
                </li>
                <li>
                  <strong className="text-foreground">&ldquo;Brain Lock&rdquo;</strong> by Jeffrey M. Schwartz — Four-step mindfulness and cognitive-behavioral approach to OCD.
                </li>
                <li>
                  <strong className="text-foreground">World Health Organization (WHO) — Doing What Matters in Times of Stress:</strong> Free illustrated open-access stress-management guide.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-secondary/60 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-md mb-3">Want help preparing for your first appointment?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Use our Appointment Preparation tool or get in touch with questions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="button-primary text-xs py-2.5 px-4"
            >
              Open Appointment Prep Tool
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="button-secondary text-xs py-2.5 px-4"
            >
              Contact Restless Mind
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
