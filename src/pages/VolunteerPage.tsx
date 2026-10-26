import React from 'react';
import { Heart, Users, BookOpen, Globe, ShieldAlert } from 'lucide-react';

interface VolunteerPageProps {
  onNavigate: (path: string) => void;
}

export default function VolunteerPage({ onNavigate }: VolunteerPageProps) {
  const opportunities = [
    {
      title: 'Write & Review Educational Content',
      description:
        'Collaborate on evidence-informed guides covering OCD, ERP, anxiety, neurodiversity, and care navigation.',
      icon: BookOpen,
      commitment: '3–5 hours/week',
    },
    {
      title: 'Community Story Safety Moderation',
      description:
        'Review anonymous community story submissions against our non-triggering, anti-reassurance safety rubric.',
      icon: Users,
      commitment: 'Flexible',
    },
    {
      title: 'Indian Regional Language Translation',
      description:
        'Help translate psychoeducation and helpline guides into Hindi, Telugu, Tamil, Kannada, Bengali, and Marathi.',
      icon: Globe,
      commitment: 'Variable',
    },
    {
      title: 'Accessibility & Open-Source Engineering',
      description:
        'Improve WCAG keyboard/screen-reader accessibility, Open mHealth exports, and privacy-preserving tools.',
      icon: Heart,
      commitment: 'Flexible',
    },
  ];

  return (
    <div>
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-lg mb-3">Volunteer with Restless Mind</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Help build a stigma-free, culturally grounded mental-wellbeing resource for India and beyond.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opp) => {
              const Icon = opp.icon;
              return (
                <div
                  key={opp.title}
                  className="bg-card rounded-2xl p-6 md:p-8 border border-border flex items-start gap-4"
                >
                  <Icon size={28} className="text-primary shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h2 className="font-bold text-foreground text-lg mb-2">{opp.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {opp.description}
                    </p>
                    <p className="text-xs font-semibold text-primary">
                      Typical Commitment: {opp.commitment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-3">
            <ShieldAlert size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important Ethics Boundary:</strong> Volunteers do not provide unlicensed psychotherapy, crisis intervention, or medical diagnosis, and never have access to users&apos; private local journals or personal contact details.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-secondary border border-border rounded-2xl p-8 text-center">
            <h2 className="heading-md mb-3">Ready to Contribute?</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Click below to open the contact form with the Volunteer Inquiry subject pre-filled.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/contact?subject=Volunteer%20Inquiry')}
              className="button-primary"
            >
              Tell Us About Yourself
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
