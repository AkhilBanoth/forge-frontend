import React, { useEffect, useState } from 'react';
import { PageHeader, StatCard } from '../../components/shared/PageHeader';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState } from '../../components/shared/States';
import { mentorService } from '../../lib/api/services';
import type { LearnerDossier } from '../../lib/mocks/data';
import type { ProjectSubmission } from '../../types';
import { Users, FolderGit2, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface MentorDashboardPageProps {
  onNavigate: (path: string) => void;
}

export function MentorDashboardPage({ onNavigate }: MentorDashboardPageProps) {
  const [learners, setLearners] = useState<LearnerDossier[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mentorService.getAssignedLearners(), mentorService.getReviewQueue()])
      .then(([lRes, rRes]) => {
        setLearners(lRes.data);
        setSubmissions(rRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState message="Loading mentor dashboard..." />;
  }

  const pendingReviews = submissions.filter(
    (s) => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED'
  );
  const completedReviews = submissions.filter((s) => s.status === 'PASSED' || s.status === 'REJECTED');
  const avgReadiness =
    learners.length > 0
      ? Math.round(learners.reduce((acc, l) => acc + l.readiness.overall, 0) / learners.length)
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mentor Dashboard"
        description="Track your assigned learners, inspect readiness progress, and grade pending project submissions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Assigned Learners"
          value={learners.length}
          sublabel="Active cohort mentees"
          icon={Users}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews.length}
          sublabel="Awaiting 8-point grading"
          icon={Clock}
        />
        <StatCard
          title="Completed Reviews"
          value={completedReviews.length}
          sublabel="Graded submissions"
          icon={CheckCircle2}
        />
        <StatCard
          title="Avg Cohort Readiness"
          value={`${avgReadiness}%`}
          sublabel="Across assigned learners"
          icon={FolderGit2}
        />
      </div>

      {/* Recent Submissions Queue */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface p-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Project Submissions</h2>
            <p className="text-xs text-muted-foreground">
              Open a submission to score all 8 rubric criteria and post feedback.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/mentor/reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View All Reviews</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border/60">
          {submissions.slice(0, 5).map((sub) => (
            <div
              key={sub.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-foreground">{sub.projectTitle}</span>
                  <StatusIndicator status={sub.status} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Submitted by <span className="font-semibold text-foreground">{sub.learnerName || 'Learner'}</span> ·{' '}
                  {sub.targetRole || 'Backend Developer'} ·{' '}
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(`/mentor/reviews/${sub.id}`)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 self-start sm:self-center shrink-0"
              >
                <span>{sub.review ? 'View / Update Review' : 'Grade Submission'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Assigned Learners Overview */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface p-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Assigned Learners</h2>
            <p className="text-xs text-muted-foreground">
              Click any learner to inspect their verified skills, gaps, assessments, and AI mentor chat history.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/mentor/learners')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>All Learners</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {learners.map((learner) => (
            <button
              key={learner.learnerId}
              type="button"
              onClick={() => onNavigate(`/mentor/learners/${learner.learnerId}`)}
              className="rounded-xl border border-border bg-background p-4 text-left hover:border-primary/50 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-foreground">{learner.name}</div>
                  <div className="text-xs text-muted-foreground">{learner.targetCareer}</div>
                </div>
                <span className="font-mono text-base font-extrabold tabular-nums text-primary">
                  {learner.readiness.overall}%
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px] font-mono text-muted-foreground">
                <span>
                  {learner.readiness.verifiedSkillsCount}/{learner.readiness.totalRequiredSkills} verified
                </span>
                <span className="text-primary font-semibold">Open Dossier →</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
