import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from '../data/restlessMindData';
import { CrisisRegionCode } from '../lib/wellbeingLogic';

interface BlogPageProps {
  onNavigate: (path: string) => void;
  region?: CrisisRegionCode;
}

export default function BlogPage({ onNavigate, region = 'IN' }: BlogPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleOpenArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
    setAiSummary(null);
  };

  const handleSimplifyArticle = async (article: BlogArticle) => {
    setAiLoading(true);
    setAiSummary(null);
    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'simplify_concept',
          userInput: `${article.title}: ${article.excerpt}`,
          region,
        }),
      });
      const data = await response.json();
      if (response.ok && data.response) {
        setAiSummary(data.response);
      } else {
        setAiSummary(data.error || 'Could not generate simplified summary right now.');
      }
    } catch {
      setAiSummary('Network error while contacting educational guide.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-lg mb-3">Restless Mind Educational Guides &amp; Blog</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Plain-language, evidence-informed articles on OCD, Exposure and Response Prevention (ERP), intrusive thoughts, family support, and care navigation.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <article className="bg-card border border-border rounded-2xl p-6 md:p-10 max-w-3xl mx-auto animate-slide-in-up">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5 mb-6 cursor-pointer"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to all articles
              </button>

              <p className="text-xs text-muted-foreground mb-2">
                {selectedArticle.category} · {selectedArticle.date} · {selectedArticle.readTime}
              </p>
              <h2 className="heading-md mb-6">{selectedArticle.title}</h2>

              {/* Key Takeaways Box */}
              <div className="bg-secondary border border-border rounded-xl p-5 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-foreground">Key Takeaways</h3>
                  <button
                    type="button"
                    onClick={() => handleSimplifyArticle(selectedArticle)}
                    disabled={aiLoading}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    {aiLoading ? 'Simplifying...' : 'Explain in Plain Language (AI Guide)'}
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {aiSummary && (
                  <div className="mt-4 pt-4 border-t border-border text-xs text-foreground whitespace-pre-line leading-relaxed">
                    {aiSummary}
                  </div>
                )}
              </div>

              <div className="space-y-4 text-foreground/90 leading-relaxed text-base">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Educational material only — not a clinical diagnosis.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools')}
                    className="button-primary text-xs py-2 px-4"
                  >
                    Practice in Daily Tools
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="button-secondary text-xs py-2 px-4"
                  >
                    Read Another Guide
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {BLOG_ARTICLES.map((article) => (
                  <article
                    key={article.id}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-primary smooth-transition"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {article.category} · {article.date} · {article.readTime}
                      </p>
                      <h2 className="heading-md mb-3">{article.title}</h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenArticle(article)}
                        className="text-primary text-sm font-semibold hover:underline cursor-pointer"
                      >
                        Read Full Article →
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12 bg-secondary border border-border rounded-2xl p-8 text-center">
                <BookOpen size={36} className="text-primary mx-auto mb-3" aria-hidden="true" />
                <h3 className="heading-md mb-2">Want a topic explained in simpler terms?</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
                  Use our scoped Educational &amp; Appointment Guide in Daily Tools, or suggest a new educational topic to our volunteer editorial team.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools')}
                    className="button-primary text-sm"
                  >
                    Open Educational AI Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/contact?subject=Topic%20Suggestion')}
                    className="button-secondary text-sm"
                  >
                    Suggest a Topic
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
