import React, { useState, useMemo } from 'react';
import { BookOpen, CheckCircle, ArrowLeft, Sparkles, Search } from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from '../data/restlessMindData';
import { CrisisRegionCode } from '../lib/wellbeingLogic';
import EditorialPageHeader from '../components/EditorialPageHeader';

interface BlogPageProps {
  onNavigate: (path: string) => void;
  region?: CrisisRegionCode;
}

export default function BlogPage({ onNavigate, region = 'IN' }: BlogPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)));
    return ['All', ...unique];
  }, []);

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
    setAiSummary(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <EditorialPageHeader
        eyebrow="Evidence-Informed Psychoeducation · Non-Diagnostic"
        title="Restless Mind Educational Guides & Articles"
        description="Plain-language reading on OCD, Exposure and Response Prevention (ERP), intrusive thoughts, sleep, family support, and care navigation."
        variant="editorial"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <article className="bg-card border border-border rounded-2xl p-6 md:p-10 max-w-3xl mx-auto shadow-xs animate-slide-in-up">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5 mb-6 cursor-pointer"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to all educational guides
              </button>

              <p className="text-xs text-muted-foreground mb-2">
                {selectedArticle.category} · {selectedArticle.date} · {selectedArticle.readTime}
              </p>
              <h2 className="heading-md mb-6">{selectedArticle.title}</h2>

              {/* Key Takeaways Box */}
              <div className="bg-secondary border border-border rounded-2xl p-5 md:p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-foreground">Key Takeaways</h3>
                  <button
                    type="button"
                    onClick={() => handleSimplifyArticle(selectedArticle)}
                    disabled={aiLoading}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    {aiLoading ? 'Generating plain-language summary...' : 'Explain in Plain Language (AI Guide)'}
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {aiSummary && (
                  <div className="mt-4 pt-4 border-t border-border text-xs text-foreground whitespace-pre-line leading-relaxed">
                    <p className="font-bold text-primary mb-1">
                      AI-Generated Plain-Language Summary (Educational Only):
                    </p>
                    {aiSummary}
                  </div>
                )}
              </div>

              <div className="space-y-5 text-foreground/95 leading-relaxed text-base max-w-[68ch]">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Connected Interactive Practice Box */}
              <div className="mt-8 bg-secondary/70 border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-primary">
                    Connect Reading to Practice
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Apply the concepts from <strong className="text-foreground">{selectedArticle.title}</strong> directly in our private self-reflection workspace:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools?tab=journal')}
                    className="button-primary text-xs py-2 px-3.5"
                  >
                    Open ERP Journal
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools?tab=breathing')}
                    className="button-secondary text-xs py-2 px-3.5"
                  >
                    4-7-8 Breathing
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Educational material only — does not replace evaluation by a licensed clinician.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools?tab=ai-prep')}
                    className="button-primary text-xs py-2.5 px-4"
                  >
                    Prepare Clinician Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="button-secondary text-xs py-2.5 px-4"
                  >
                    Read Another Guide
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <>
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div
                  role="group"
                  aria-label="Filter articles by category"
                  className="flex flex-wrap gap-2"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 smooth-transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-card text-foreground border border-border hover:bg-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guides (e.g., ERP, sleep)..."
                    aria-label="Search educational guides"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs"
                  />
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <BookOpen size={28} className="text-primary mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground mb-1">
                    No articles match your filter
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Try clearing your search query or selecting &ldquo;All&rdquo; categories.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="button-secondary text-xs py-2 px-4"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-card rounded-2xl p-6 md:p-7 border border-border flex flex-col justify-between hover:border-primary/60 smooth-transition shadow-xs"
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
              )}

              <div className="mt-12 bg-secondary border border-border rounded-2xl p-8 text-center">
                <BookOpen size={32} className="text-primary mx-auto mb-3" aria-hidden="true" />
                <h3 className="heading-md mb-2">Want a concept explained in simpler terms?</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
                  Use our scoped Educational &amp; Appointment Guide in Daily Tools, or suggest a new educational topic to our volunteer editorial team.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onNavigate('/tools')}
                    className="button-primary text-xs py-2.5 px-4"
                  >
                    Open Educational AI Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/contact?subject=Topic%20Suggestion')}
                    className="button-secondary text-xs py-2.5 px-4"
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
