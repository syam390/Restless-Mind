import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import EditorialPageHeader from '../components/EditorialPageHeader';

export default function TermsPage() {
  return (
    <div>
      <EditorialPageHeader
        eyebrow="Platform Scope · Non-Diagnostic Boundaries · Community Guidelines"
        title="Terms of Service & Clinical Disclaimer"
        description="Clear, transparent boundaries on how Restless Mind operates as an educational and self-reflection platform."
        variant="shield"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed shadow-xs">
            <div className="bg-secondary border border-border rounded-2xl p-5 flex items-start gap-3.5">
              <AlertCircle size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="font-bold text-foreground text-base mb-1">
                  Not Medical Advice or Clinical Diagnosis
                </h2>
                <p>
                  Restless Mind is for educational, informational, and self-reflection purposes only. Nothing on this platform constitutes a medical diagnosis, psychiatric evaluation, or treatment guarantee for OCD, anxiety, ADHD, autism, depression, or PCOS/PCOD. Always consult a qualified healthcare professional.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                1. No 24/7 Monitoring or Emergency Intervention
              </h3>
              <p>
                Restless Mind does not monitor user journals or messages in real time and cannot dispatch emergency services. If you are experiencing thoughts of suicide or self-harm, call 14416 (Tele-MANAS India), 112, or 988 immediately.
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                2. Responsible AI Boundaries
              </h3>
              <p>
                Our optional AI educational guide is strictly scoped to simplify educational concepts and help prepare questions for a clinician. It is programmed to decline diagnostic claims, clinical certainty, and compulsive OCD reassurance-seeking.
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                3. User Content &amp; Community Safety
              </h3>
              <ul className="list-disc list-inside space-y-1.5">
                <li>You retain ownership of any reflections you write.</li>
                <li>
                  Community story submissions are screened for self-harm triggers and personal identifiers before publication.
                </li>
                <li>Harassing, stigmatizing, or harmful content is strictly prohibited.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={16} className="text-primary shrink-0" aria-hidden="true" />
              <span>Last updated for the Restless Mind Mental-Wellbeing Platform.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
