import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { useAuth } from '../../context/AuthContext';
import { mentorService } from '../../lib/api/services';
import type { ProjectReviewScore, ProjectSubmission } from '../../types';
import { ArrowLeft, Github, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

interface MentorReviewDetailPageProps {
  submissionId: string;
  onNavigate: (path: string) => void;
}

const RUBRIC_CRITERIA: Array<{ key: keyof ProjectReviewScore; label: string; help: string }> = [
  { key: 'codeQuality', label: 'Code Quality', help: 'Clean structure, naming, modularity, and readability' },
  { key: 'apiDesign', label: 'API Design', help: 'REST semantics, validation, status codes, schemas' },
  { key: 'databaseDesign', label: 'Database Design', help: 'Normalization, indexes, migrations, query efficiency' },
  { key: 'auth', label: 'Authentication & Security', help: 'JWT handling, password hashing, RBAC guards' },
  { key: 'testing', label: 'Automated Testing', help: 'Unit and integration tests with meaningful assertions' },
  { key: 'errorHandling', label: 'Error Handling', help: 'Graceful edge cases, clear messages, no silent failures' },
  { key: 'documentation', label: 'Documentation', help: 'Clear README, setup instructions, environment notes' },
  { key: 'deployment', label: 'Deployment & Docker', help: 'Dockerfile, compose config, reproducible startup' },
];

export function MentorReviewDetailPage({
  submissionId,
  onNavigate,
}: MentorReviewDetailPageProps) {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [scores, setScores] = useState<ProjectReviewScore>({
    codeQuality: 8,
    apiDesign: 8,
    databaseDesign: 8,
    auth: 8,
    testing: 7,
    errorHandling: 8,
    documentation: 8,
    deployment: 7,
  });
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    mentorService.getReviewQueue().then((res) => {
      const found = res.data.find((s) => s.id === submissionId) || null;
      setSubmission(found);
      if (found?.review) {
        setScores(found.review.scores);
        setFeedbackText(found.review.feedbackText);
      }
      setLoading(false);
    });
  }, [submissionId]);

  if (loading) {
    return <LoadingState message="Loading project submission..." />;
  }

  if (!submission) {
    return (
      <EmptyState
        title="Submission not found"
        description="The requested project submission does not exist."
        action={{
          label: 'Back to Review Queue',
          onClick: () => onNavigate('/mentor/reviews'),
        }}
      />
    );
  }

  const totalScore =
    scores.codeQuality +
    scores.apiDesign +
    scores.databaseDesign +
    scores.auth +
    scores.testing +
    scores.errorHandling +
    scores.documentation +
    scores.deployment;

  const handleDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (!feedbackText.trim()) {
      showToast('warning', 'Please enter constructive feedback for the learner before submitting.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await mentorService.submitProjectReview({
        submissionId: submission.id,
        scores,
        feedbackText: feedbackText.trim(),
        decision,
        reviewerName: user?.name ? `${user.name} (Mentor)` : undefined,
      });
      setSubmission(res.data);
      showToast(
        'success',
        decision === 'APPROVE'
          ? 'Project approved! Learner skill marked PROJECT_VERIFIED.'
          : 'Changes requested and feedback sent to learner.'
      );
      onNavigate('/mentor/reviews');
    } catch {
      showToast('error', 'Failed to save project review.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => onNavigate('/mentor/reviews')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Review Queue</span>
      </button>

      <PageHeader
        title={`Review: ${submission.projectTitle}`}
        description={`Submitted by ${submission.learnerName || 'Learner'} (${submission.learnerEmail || ''})`}
        badge={<StatusIndicator status={submission.status} />}
      />

      {/* Submission Details */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Submitted on {new Date(submission.submittedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            {submission.githubRepoUrl && (
              <a
                href={submission.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Open GitHub Repo</span>
              </a>
            )}
            {submission.liveDemoUrl && (
              <a
                href={submission.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-surface p-4 rounded-lg border border-border">
          {submission.description}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
          <span>Stack:</span>
          {submission.technologiesUsed.map((tech) => (
            <span key={tech} className="rounded border border-border bg-background px-2 py-0.5 text-foreground">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 8-Criteria Rubric Scoring Form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              8-Criteria Project Scoring Rubric
            </h2>
            <p className="text-xs text-muted-foreground">
              Score each category from 0 to 10. Total score is calculated out of 80 points.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total Score</div>
            <div className="font-mono text-2xl font-extrabold tabular-nums text-primary">
              {totalScore} / 80
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {RUBRIC_CRITERIA.map((item) => (
            <div
              key={item.key}
              className="rounded-lg border border-border bg-background p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground" htmlFor={`score-${item.key}`}>
                  {item.label}
                </label>
                <span className="font-mono text-xs font-bold tabular-nums text-primary">
                  {scores[item.key]} / 10
                </span>
              </div>
              <input
                id={`score-${item.key}`}
                type="range"
                min={0}
                max={10}
                value={scores[item.key]}
                onChange={(e) =>
                  setScores((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))
                }
                className="w-full accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">{item.help}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground" htmlFor="mentor-feedback">
            Mentor Feedback &amp; Next Steps *
          </label>
          <textarea
            id="mentor-feedback"
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Summarize strengths, specific code improvements, and any required fixes..."
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleDecision('REJECT')}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-5 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/15 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject (Request Changes)</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleDecision('APPROVE')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}
