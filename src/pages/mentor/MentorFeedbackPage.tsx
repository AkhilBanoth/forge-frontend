import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { mentorService } from '../../lib/api/services';
import type { ProjectSubmission } from '../../types';
import { ArrowRight } from 'lucide-react';

interface MentorFeedbackPageProps {
  onNavigate: (path: string) => void;
}

export function MentorFeedbackPage({ onNavigate }: MentorFeedbackPageProps) {
  const [reviewed, setReviewed] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorService
      .getReviewQueue()
      .then((res) => {
        setReviewed(res.data.filter((s) => Boolean(s.review)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState message="Loading feedback history..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback History"
        description="Archive of project reviews you have graded, including total rubric scores and written comments."
      />

      {reviewed.length === 0 ? (
        <EmptyState
          title="No completed reviews yet"
          description="Grade a pending project submission to build your mentor feedback log."
          action={{
            label: 'Open Review Queue',
            onClick: () => onNavigate('/mentor/reviews'),
          }}
        />
      ) : (
        <div className="space-y-4">
          {reviewed.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{sub.projectTitle}</h2>
                    <StatusIndicator status={sub.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Learner: {sub.learnerName || 'Learner'} · Reviewed{' '}
                    {sub.review?.reviewedAt
                      ? new Date(sub.review.reviewedAt).toLocaleDateString()
                      : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-primary">
                    {sub.review?.totalScore} / {sub.review?.maxScore} pts
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/mentor/reviews/${sub.id}`)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed bg-surface p-3.5 rounded-lg border border-border">
                &ldquo;{sub.review?.feedbackText}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
