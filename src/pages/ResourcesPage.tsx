import React, { useState } from 'react';
import { MapPin, DollarSign, Globe, Phone, Users, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import { GOVERNMENT_AND_PUBLIC_RESOURCES, ONLINE_AND_NGO_RESOURCES } from '../data/restlessMindData';

interface ResourcesPageProps {
  onNavigate: (path: string) => void;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const [filterType, setFilterType] = useState<'all' | 'Free / Public' | 'Sliding Scale / NGO' | 'Global Directory'>('all');

  const filteredGov = GOVERNMENT_AND_PUBLIC_RESOURCES.filter(
    (r) => filterType === 'all' || r.costType === filterType
  );
  const filteredOnline = ONLINE_AND_NGO_RESOURCES.filter(
    (r) => filterType === 'all' || r.costType === filterType
  );

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="heading-lg mb-3">Find Verified &amp; Affordable Help</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Verified public mental health institutes, free tele-counseling helplines, and evidence-based OCD &amp; anxiety directories in India and globally.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0" role="group" aria-label="Filter resources by cost type">
            {(['all', 'Free / Public', 'Sliding Scale / NGO', 'Global Directory'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 smooth-transition cursor-pointer ${
                  filterType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border hover:bg-accent/50'
                }`}
              >
                {type === 'all' ? 'All Resources' : type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Government Hospitals & Public Services */}
          {filteredGov.length > 0 && (
            <div>
              <h2 className="heading-md mb-6 flex items-center gap-3">
                <MapPin size={28} className="text-primary" aria-hidden="true" />
                Government Mental Health Institutes &amp; Public Helplines (Free / Low Cost)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredGov.map((item) => (
                  <div
                    key={item.name}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.locationOrScope} · {item.costType}
                      </p>
                      <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      <span className="flex items-center gap-2 text-sm font-mono tabular-nums font-semibold text-foreground">
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
                <Globe size={28} className="text-primary" aria-hidden="true" />
                Verified Non-Profit Helplines &amp; Specialist Directories
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredOnline.map((item) => (
                  <div
                    key={item.name}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.locationOrScope} · {item.costType}
                      </p>
                      <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
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

          {/* What to Expect */}
          <div>
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <Users size={28} className="text-primary" aria-hidden="true" />
              What to Expect from a Mental Health Professional
            </h2>
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-foreground mb-4">Your First Appointment</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span>They will ask about what you have been experiencing, how long it has been happening, and how it affects daily life.</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span>You never have to share every intrusive thought detail on day one—share at a pace that feels safe.</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span>Use our Appointment Prep tool on the Daily Tools page to bring written questions.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-4">Evidence-Based Treatment Approaches</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">ERP (Exposure &amp; Response Prevention)</strong> — Gold standard therapy for OCD.</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">CBT &amp; ACT</strong> — Structured approaches for anxiety, worry, panic, and low mood.</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Medical / Psychiatric Consultation</strong> — When appropriate, medication or screening for thyroid/hormonal factors (e.g., PCOS/PCOD).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance & Costs */}
          <div>
            <h2 className="heading-md mb-6 flex items-center gap-3">
              <DollarSign size={28} className="text-primary" aria-hidden="true" />
              Understanding Costs &amp; Rights (Mental Healthcare Act 2017)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-bold text-foreground mb-3">Mental Health Coverage in India</h3>
                <ul className="space-y-2.5 text-muted-foreground text-sm">
                  <li>· Under Section 21(4) of India&apos;s Mental Healthcare Act 2017 and IRDAI mandates, health insurers must cover mental illness on the same basis as physical illness.</li>
                  <li>· District Mental Health Programme (DMHP) clinics and government medical colleges provide free or nominal-cost outpatient care.</li>
                  <li>· Many NGOs and private clinics offer student or income-based sliding-scale fee slots.</li>
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
              <BookOpen size={28} className="text-primary" aria-hidden="true" />
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
      <section className="py-12 md:py-16 bg-secondary border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-md mb-3">Want help preparing for your first appointment?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Use our Appointment Preparation tool or get in touch with questions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="button-primary text-sm"
            >
              Open Appointment Prep Tool
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="button-secondary text-sm"
            >
              Contact Restless Mind
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
