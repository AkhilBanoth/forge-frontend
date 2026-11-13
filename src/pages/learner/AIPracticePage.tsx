import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { showToast } from '../../components/shared/ToastNotification';
import { aiService, careerService } from '../../lib/api/services';
import type { AIPracticeQuestion, AIPracticeSubmissionResult, Skill } from '../../types';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIPracticePageProps {
  onNavigate: (path: string) => void;
}

export function AIPracticePage({ onNavigate }: AIPracticePageProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState('sk_docker');
  const [topic, setTopic] = useState('Multi-stage builds & Docker Compose');
  const [count, setCount] = useState<number>(3);

  const [questions, setQuestions] = useState<AIPracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AIPracticeSubmissionResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    careerService.getSkillCatalog().then((res) => {
      setSkills(res.data);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setAnswers({});
    setIsGenerating(true);
    try {
      const res = await aiService.generatePracticeQuestions({
        skillId,
        topic: topic.trim() || 'Core fundamentals',
        count,
      });
      setQuestions(res.data);
    } catch {
      setError('Could not generate practice questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswers = async () => {
    if (questions.length === 0) return;
    if (Object.keys(answers).length < questions.length) {
      showToast('warning', 'Please select an answer for every question before submitting.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await aiService.submitPracticeAnswers({
        skillId,
        topic,
        questions,
        answers,
      });
      setResult(res.data);
      showToast(
        'success',
        `Scored ${res.data.scorePercentage}%. Skill gap state updated!`
      );
    } catch {
      setError('Failed to submit practice answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="AI Practice Questions"
        description="Choose a skill, a weak topic, and question count. Your score feeds directly back into your skill gap and readiness tracking."
      />

      {/* Configuration Form */}
      <form
        onSubmit={handleGenerate}
        className="rounded-xl border border-border bg-card p-6 space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="practice-skill">
              Skill
            </label>
            <select
              id="practice-skill"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {skills.length > 0 ? (
                skills.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="sk_docker">Docker &amp; Containerization</option>
                  <option value="sk_fastapi">FastAPI Framework</option>
                  <option value="sk_pg">PostgreSQL &amp; Indexing</option>
                  <option value="sk_py">Python Core &amp; Advanced</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="practice-topic">
              Weak Topic
            </label>
            <input
              id="practice-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., B-Tree Indexes, JWT refresh..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="practice-count">
              Question Count
            </label>
            <select
              id="practice-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Passing (&ge; 70%) upgrades Self-Declared skills to Assessed and updates your readiness.
          </span>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Generate Practice Set'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-xs text-destructive"
        >
          {error}
        </div>
      )}

      {/* Result Summary Banner */}
      {result && (
        <div className="rounded-xl border-2 border-primary bg-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="text-xs font-semibold text-primary">Practice Result Recorded</div>
              <h2 className="text-xl font-extrabold text-foreground mt-0.5">
                {result.skillName}: {result.scorePercentage}% ({result.correctCount}/{result.totalQuestions} correct)
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="rounded border border-border bg-surface px-3 py-1.5 font-bold">
                Updated Gap: {result.newGapLabel}
              </span>
              {result.readinessDelta > 0 && (
                <span className="rounded bg-emerald-500/15 px-3 py-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  +{result.readinessDelta}% Readiness
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground">{result.feedbackSummary}</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/app/career')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>View Updated Skill Gaps</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry This Set</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const picked = answers[q.id];
            const showReview = Boolean(result);
            return (
              <div
                key={q.id}
                className="rounded-xl border border-border bg-card p-6 space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>
                    Question {idx + 1} of {questions.length}
                  </span>
                  <span>
                    {skills.find((s) => s.id === q.skillId)?.name || q.topic} · {q.difficulty}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">{q.prompt}</h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isPicked = picked === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={showReview}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 rounded-lg border p-3.5 text-left text-xs transition-colors',
                          showReview && isCorrect
                            ? 'border-emerald-600 bg-emerald-500/10 font-semibold text-foreground'
                            : showReview && isPicked && !isCorrect
                            ? 'border-destructive bg-destructive/10 text-foreground'
                            : isPicked
                            ? 'border-primary bg-secondary font-semibold text-foreground'
                            : 'border-border bg-background hover:bg-surface text-foreground'
                        )}
                      >
                        <span>{opt}</span>
                        {showReview && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                        {showReview && isPicked && !isCorrect && (
                          <XCircle className="h-4 w-4 text-destructive shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showReview && (
                  <div className="rounded-lg border border-border bg-surface p-3.5 text-xs text-muted-foreground">
                    <strong className="text-foreground">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!result && (
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitAnswers}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Grading & Updating Gaps...' : 'Submit Practice Answers'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
