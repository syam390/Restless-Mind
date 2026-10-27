import React from 'react';
import { Heart, Users, BookOpen, Globe, ShieldAlert, ChevronRight } from 'lucide-react';
import EditorialPageHeader from '../components/EditorialPageHeader';

interface VolunteerPageProps {
  onNavigate: (path: string) => void;
}

export default function VolunteerPage({ onNavigate }: VolunteerPageProps) {
  const opportunities = [
    {
      title: 'Write & Review Educational Content',
      description:
        'Collaborate on evidence-informed guides covering OCD, Exposure and Response Prevention (ERP), anxiety, neurodiversity, and care navigation.',
      icon: BookOpen,
      commitment: '3–5 hours / week',
    },
    {
      title: 'Community Story Safety Moderation',
      description:
        'Review anonymous community story submissions against our non-triggering, anti-reassurance safety rubric.',
      icon: Users,
      commitment: 'Flexible schedule',
    },
    {
      title: 'Indian Regional Language Translation',
      description:
        'Help translate psychoeducation and helpline guides into Hindi, Telugu, Tamil, Kannada, Bengali, and Marathi.',
      icon: Globe,
      commitment: 'Project-based',
    },
    {
      title: 'Accessibility & Open-Source Engineering',
      description:
        'Improve WCAG AA keyboard and screen-reader accessibility, Open mHealth exports, and privacy-preserving tools.',
      icon: Heart,
      commitment: 'Flexible schedule',
    },
  ];

  return (
    <div>
      <EditorialPageHeader
        eyebrow="Community Collaboration · Non-Clinical Roles"
        title="Volunteer with Restless Mind"
        description="Help build a stigma-free, culturally grounded mental-wellbeing educational resource for India and beyond."
        variant="community"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opp) => {
              const Icon = opp.icon;
              return (
                <div
                  key={opp.title}
                  className="bg-card rounded-2xl p-6 md:p-8 border border-border flex items-start gap-4 shadow-xs"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary shrink-0">
                    <Icon size={22} aria-hidden="true" />
                  </div>
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

          <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-3.5 shadow-xs">
            <ShieldAlert size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important Ethics Boundary:</strong> Volunteers do not provide unlicensed psychotherapy, crisis intervention, or medical diagnosis, and never have access to users&apos; private local journals or personal contact details.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-secondary border border-border rounded-2xl p-8 text-center">
            <h2 className="heading-md mb-2">Ready to Contribute?</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Open the contact form with the Volunteer Inquiry subject pre-filled to share your background and area of interest.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/contact?subject=Volunteer%20Inquiry')}
              className="button-primary text-sm inline-flex items-center gap-1.5"
            >
              Express Volunteer Interest
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
