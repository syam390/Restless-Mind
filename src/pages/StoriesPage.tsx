import React, { useState, useEffect } from 'react';
import { Send, Users, ShieldCheck, Trash2 } from 'lucide-react';
import { INITIAL_COMMUNITY_STORIES, StoryItem } from '../data/restlessMindData';
import { validateStorySubmission } from '../lib/wellbeingLogic';

interface StoriesPageProps {
  onNavigate: (path: string) => void;
}

const STORY_TOKENS_KEY = 'rm_my_story_tokens_v1';

export default function StoriesPage({ onNavigate }: StoriesPageProps) {
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_COMMUNITY_STORIES);
  const [myTokens, setMyTokens] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORY_TOKENS_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [formData, setFormData] = useState({
    story: '',
    anonymous: true,
    email: '',
    category: 'Living with Uncertainty',
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/stories')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.stories && Array.isArray(data.stories)) {
          setStories(data.stories);
        }
      })
      .catch(() => {
        // fallback to initial stories
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!consentChecked) {
      setStatusMessage({
        type: 'error',
        text: 'Please confirm moderation and privacy consent before submitting your story.',
      });
      return;
    }

    const validation = validateStorySubmission(formData);
    if (!validation.valid) {
      setStatusMessage({ type: 'error', text: validation.error || 'Please check your input.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Could not submit story.',
        });
      } else {
        if (data.story) {
          setStories((prev) => [data.story, ...prev]);
          if (data.deletionToken) {
            const updatedTokens = { ...myTokens, [data.story.id]: data.deletionToken };
            setMyTokens(updatedTokens);
            try {
              localStorage.setItem(STORY_TOKENS_KEY, JSON.stringify(updatedTokens));
            } catch {
              // ignore
            }
          }
        }
        setFormData({
          story: '',
          anonymous: true,
          email: '',
          category: 'Living with Uncertainty',
        });
        setConsentChecked(false);
        setStatusMessage({
          type: 'success',
          text: 'Thank you for sharing! Your story was automatically scrubbed for accidental PII and added above with "Pending Safety Review" status. You can delete it anytime from this browser.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while submitting story.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOwnStory = async (storyId: string) => {
    const token = myTokens[storyId];
    if (!token) return;
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: { 'x-deletion-token': token },
      });
      if (response.ok) {
        setStories((prev) => prev.filter((s) => s.id !== storyId));
        const nextTokens = { ...myTokens };
        delete nextTokens[storyId];
        setMyTokens(nextTokens);
        try {
          localStorage.setItem(STORY_TOKENS_KEY, JSON.stringify(nextTokens));
        } catch {
          // ignore
        }
        setStatusMessage({
          type: 'success',
          text: 'Your submitted story has been permanently removed from the moderation queue.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Unable to delete story right now.',
      });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-lg mb-3">Community Stories &amp; Lived Reflections</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Lived experiences from people navigating OCD, intrusive thoughts, and anxiety. Every submission is automatically scrubbed of accidental phone/email PII, screened for safety, and can be deleted by its author.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-md mb-8 flex items-center gap-3">
            <Users size={28} className="text-primary" aria-hidden="true" />
            Stories from Our Community ({stories.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {stories.map((story) => {
              const canDelete = Boolean(myTokens[story.id]);
              return (
                <div
                  key={story.id}
                  className="bg-card rounded-2xl p-6 md:p-8 border border-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-3">
                      <span>
                        {story.author} · {story.category}
                      </span>
                      <div className="flex items-center gap-3">
                        {story.status === 'pending_moderation' && (
                          <span className="font-semibold text-primary">Pending Safety Review</span>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOwnStory(story.id)}
                            className="text-destructive font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                            aria-label="Delete my submitted story"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                            Delete My Story
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-foreground/90 mb-6 italic leading-relaxed">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Key Takeaway:</strong> {story.highlight}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share Story Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary border border-border rounded-2xl p-6 md:p-10">
              <div className="flex items-start gap-3 mb-4">
                <ShieldCheck size={24} className="text-primary shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 className="heading-md mb-1">Share Your Recovery Reflection</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sharing what helped you cope or seek support helps others feel less isolated. To protect the community, avoid describing graphic self-harm details or specific compulsion triggers. Any phone numbers or emails inside your story text are automatically redacted.
                  </p>
                </div>
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className={`p-4 rounded-xl mb-6 text-sm border ${
                    statusMessage.type === 'error'
                      ? 'bg-destructive/10 border-destructive/40 text-destructive'
                      : 'bg-card border-primary/40 text-foreground'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="story-category" className="block text-sm font-semibold text-foreground mb-1.5">
                    Theme
                  </label>
                  <select
                    id="story-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm"
                  >
                    <option value="Living with Uncertainty">Living with Uncertainty</option>
                    <option value="ERP & Therapy Journey">ERP &amp; Therapy Journey</option>
                    <option value="Early Recognition">Early Recognition</option>
                    <option value="Family & Support">Family &amp; Support</option>
                    <option value="Whole-Person Wellbeing">Whole-Person Wellbeing</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="story-textarea" className="block text-sm font-semibold text-foreground mb-1.5">
                    Your Story (50–2000 characters)
                  </label>
                  <textarea
                    id="story-textarea"
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                    placeholder="Share what helped you understand your experiences or take a positive step toward support..."
                    minLength={50}
                    maxLength={2000}
                    required
                  />
                  <p className="text-xs font-mono tabular-nums text-muted-foreground mt-1.5">
                    {formData.story.length} / 2000 characters (minimum 50)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Submit anonymously (recommended — no email or name required)
                    </span>
                  </label>
                </div>

                {!formData.anonymous && (
                  <div>
                    <label htmlFor="story-email" className="block text-sm font-semibold text-foreground mb-1.5">
                      Contact Email (Never displayed publicly or stored in plaintext)
                    </label>
                    <input
                      id="story-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm"
                      placeholder="you@example.com"
                      required={!formData.anonymous}
                    />
                  </div>
                )}

                <div className="bg-card border border-border rounded-xl p-3.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border"
                      required
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I consent to Restless Mind reviewing and displaying this reflection in the community moderation queue, and I have read the{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('/privacy')}
                        className="text-primary font-semibold hover:underline"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} aria-hidden="true" />
                  {isSubmitting ? 'Submitting...' : 'Submit Story to Moderation Queue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
