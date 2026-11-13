import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { mentorService } from '../../lib/api/services';
import type { ProjectSubmission } from '../../types';
import { ArrowRight, Github } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MentorReviewsPageProps {
  onNavigate: (path: string) => void;
}

export function MentorReviewsPage({ onNavigate }: MentorReviewsPageProps) {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PASSED' | 'REJECTED'>('ALL');

  useEffect(() => {
    mentorService
      .getReviewQueue()
      .then((res) => {
        setSubmissions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = submissions.filter((s) => {
    if (filter === 'PENDING') return s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED';
    if (filter === 'PASSED') return s.status === 'PASSED';
    if (filter === 'REJECTED') return s.status === 'REJECTED';
    return true;
  });

  if (loading) {
    return <LoadingState message="Loading project review queue..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Review Queue"
        description="Inspect learner repositories, live demos, and grade all 8 rubric criteria before approving PROJECT_VERIFIED status."
      />

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'PENDING', 'PASSED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === tab
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'ALL'
              ? `All (${submissions.length})`
              : tab === 'PENDING'
              ? `Pending (${submissions.filter((s) => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED').length})`
              : tab === 'PASSED'
              ? `Approved (${submissions.filter((s) => s.status === 'PASSED').length})`
              : `Rejected (${submissions.filter((s) => s.status === 'REJECTED').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No submissions in this filter"
          description="Switch filters to inspect other project submissions."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{sub.id}</span>
                  <StatusIndicator status={sub.status} />
                </div>
                <h2 className="text-base font-bold text-foreground">{sub.projectTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  Learner: <strong className="text-foreground">{sub.learnerName || 'Learner'}</strong> ·{' '}
                  {sub.targetRole || 'Backend Developer'} · Submitted{' '}
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </p>
                {sub.review && (
                  <p className="text-xs font-mono font-semibold text-primary">
                    Graded: {sub.review.totalScore} / {sub.review.maxScore} pts
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {sub.githubRepoUrl && (
                  <a
                    href={sub.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate(`/mentor/reviews/${sub.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <span>{sub.review ? 'Edit Review' : 'Grade Project'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
