import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ReadinessBadge } from '../../components/shared/ReadinessBadge';
import { VerificationBadge } from '../../components/shared/VerificationBadge';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { aiService, mentorService } from '../../lib/api/services';
import type { LearnerDossier } from '../../lib/mocks/data';
import type { AIMessage } from '../../types';
import {
  ArrowLeft,
  Bot,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MentorLearnerDetailPageProps {
  learnerId: string;
  onNavigate: (path: string) => void;
}

type DossierTab = 'overview' | 'skills' | 'assessments' | 'certificates' | 'ai-history';

export function MentorLearnerDetailPage({
  learnerId,
  onNavigate,
}: MentorLearnerDetailPageProps) {
  const [dossier, setDossier] = useState<LearnerDossier | null>(null);
  const [aiHistory, setAiHistory] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DossierTab>('overview');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      mentorService.getLearnerDossier(learnerId),
      aiService.getLearnerHistory(learnerId),
    ])
      .then(([dosRes, aiRes]) => {
        if (!mounted) return;
        setDossier(dosRes.data);
        setAiHistory(aiRes.data);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [learnerId]);

  if (loading) {
    return <LoadingState message="Loading learner dossier..." />;
  }

  if (!dossier) {
    return (
      <EmptyState
        title="Learner not found"
        description="The requested learner profile could not be loaded."
        action={{
          label: 'Back to Assigned Learners',
          onClick: () => onNavigate('/mentor/learners'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('/mentor/learners')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Assigned Learners</span>
        </button>
        <span className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Read-Only Mentor View</span>
        </span>
      </div>

      <PageHeader
        title={dossier.name}
        description={`${dossier.email} · Target Career: ${dossier.targetCareer}`}
        badge={<ReadinessBadge level={dossier.readiness.level} />}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface p-1.5">
        {(
          [
            { id: 'overview', label: 'Readiness Overview' },
            { id: 'skills', label: `Skills & Gaps (${dossier.skills.length})` },
            { id: 'assessments', label: `Tests & Projects (${dossier.assessments.length + dossier.projects.length})` },
            { id: 'certificates', label: `Certificates (${dossier.certificates.length})` },
            { id: 'ai-history', label: `AI Mentor History (${aiHistory.length})` },
          ] as Array<{ id: DossierTab; label: string }>
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Readiness Breakdown</h2>
              <span className="font-mono text-2xl font-extrabold tabular-nums text-primary">
                {dossier.readiness.overall}%
              </span>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Technical Skills (35%)', value: dossier.readiness.breakdown.technicalSkills },
                { label: 'Assessments (25%)', value: dossier.readiness.breakdown.assessments },
                { label: 'Projects (25%)', value: dossier.readiness.breakdown.projects },
                { label: 'Interview Prep (15%)', value: dossier.readiness.breakdown.interviewPrep },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">{row.label}</span>
                    <span className="font-mono font-bold tabular-nums">{row.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Monthly Readiness History
            </h2>
            <div className="space-y-2.5">
              {dossier.readinessHistory.map((pt) => (
                <div
                  key={pt.date}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-xs"
                >
                  <span className="font-mono font-semibold text-foreground">{pt.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{pt.level.replace(/_/g, ' ')}</span>
                    <span className="font-mono font-bold tabular-nums text-primary">{pt.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Gaps */}
      {activeTab === 'skills' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Verified &amp; Declared Skills
            </h2>
            <div className="divide-y divide-border/60">
              {dossier.skills.map((sk) => (
                <div key={sk.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground">{sk.skill.name}</span>
                      <VerificationBadge status={sk.verificationStatus} size="sm" />
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-2">
                      <span>Level: {sk.level}</span>
                      {sk.expiresAt && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Valid until {sk.expiresAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {sk.assessedScore !== undefined && (
                    <span className="font-mono font-bold tabular-nums text-foreground">
                      {sk.assessedScore}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Skill Gaps for {dossier.targetCareer}
            </h2>
            <div className="divide-y divide-border/60">
              {dossier.gaps.map((gap) => (
                <div key={gap.skill.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-foreground">{gap.skill.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Current: {gap.current || 'None'} · Required: {gap.required}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 font-mono text-[11px] font-bold',
                      gap.gap === 'HIGH'
                        ? 'bg-destructive/15 text-destructive'
                        : gap.gap === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    )}
                  >
                    {gap.gap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Assessments & Projects */}
      {activeTab === 'assessments' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Assessment History
            </h2>
            {dossier.assessments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No assessment attempts recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {dossier.assessments.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border border-border bg-background p-4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-foreground">{a.title}</div>
                      <div className="text-muted-foreground mt-0.5">
                        Taken {a.completedAt} · {a.passed ? 'Passed' : 'Needs Retake'}
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold tabular-nums text-primary">
                      {a.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Project Submissions
            </h2>
            {dossier.projects.length === 0 ? (
              <p className="text-xs text-muted-foreground">No projects submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {dossier.projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border bg-background p-4 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{p.projectTitle}</span>
                        <StatusIndicator status={p.status} />
                      </div>
                      <div className="text-muted-foreground">
                        {p.review
                          ? `Score: ${p.review.totalScore}/${p.review.maxScore}`
                          : 'Awaiting mentor review'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/mentor/reviews/${p.id}`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-secondary shrink-0"
                    >
                      <span>Review</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Certificates */}
      {activeTab === 'certificates' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
            Issued Certificates
          </h2>
          {dossier.certificates.length === 0 ? (
            <p className="text-xs text-muted-foreground">No certificates issued for this learner yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {dossier.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-lg border border-border bg-background p-4 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground">{cert.courseOrProjectName}</span>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      ID: {cert.certificateNumber} · Status: {cert.status}
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Read-Only AI Mentor Chat History */}
      {activeTab === 'ai-history' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Learner AI Mentor History (Read Only)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Mentors and Admins can inspect learner prompts and AI guidance
            </span>
          </div>

          {aiHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4">
              This learner has no AI mentor conversations yet.
            </p>
          ) : (
            <div className="space-y-3">
              {aiHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'rounded-lg border p-4 text-xs space-y-1.5',
                    msg.sender === 'user'
                      ? 'border-primary/30 bg-secondary/40'
                      : 'border-border bg-background'
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {msg.sender === 'user' ? dossier.name.toUpperCase() : 'SKILLFORGE AI MENTOR'}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
