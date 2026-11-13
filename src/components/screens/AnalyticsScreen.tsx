import React from 'react';
import { PageHeader } from '../shared/PageHeader';
import { useReadiness } from '../../hooks/useReadiness';
import { useAuthStore } from '../../stores/authStore';
import { mockUserSkills, mockCareerMatches } from '../../lib/mocks/data';
import { TrendingUp, BarChart3, ArrowRight, Compass, Check } from 'lucide-react';
import { showToast } from '../shared/ToastNotification';
import { cn } from '../../lib/utils';

export function AnalyticsScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { history } = useReadiness();
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const activeTargetId = profile?.targetCareerId || 'career_py_backend';

  // Sort user skills by proficiency to identify weakest
  const sortedWeakestSkills = [...mockUserSkills]
    .filter((s) => s.assessedScore !== undefined || s.verificationStatus === 'SELF_DECLARED')
    .sort((a, b) => (a.assessedScore || 30) - (b.assessedScore || 30));

  const handleSetTarget = (careerId: string, title: string) => {
    if (profile) {
      setProfile({ ...profile, targetCareerId: careerId });
    }
    showToast('success', `Your target job role is now set to ${title}.`);
  };

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Career Progress & Job Match Analytics"
        description="Clear answers about your weakest skills, score progress, next study steps, and matching job roles."
      />

      <div className="grid gap-6 md:grid-cols-12">
        {/* Question 1: What are my weakest skills? */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Question 1
              </span>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                What are my weakest skills?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Improve these lowest-scoring skills first to boost your readiness score fastest.
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {sortedWeakestSkills.slice(0, 5).map((item) => {
              const score = item.assessedScore || 35;
              return (
                <div key={item.id} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{item.skill.name}</span>
                    <span className="font-bold tabular-nums text-foreground">
                      {score}% ({item.level})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-sm bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 2: Am I improving? */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Question 2
              </span>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Am I improving over time?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Steady score growth from completed quizzes and mentor-approved projects.
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex items-end justify-between h-36 px-4 border-b border-border/80">
              {history.map((pt) => {
                const height = Math.max(25, (pt.score / 100) * 110);
                return (
                  <div key={pt.date} className="flex flex-col items-center gap-2">
                    <span className="font-mono text-xs font-bold tabular-nums">{pt.score}%</span>
                    <div
                      className="w-12 bg-foreground rounded-t-sm transition-all"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {pt.date}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="rounded border border-dashed border-border bg-surface p-3 text-xs font-mono text-muted-foreground">
              <span className="font-bold text-foreground">Outlook: </span>
              At your current pace, you are on track to cross the 80% Strong Candidate mark within 3 weeks.
            </div>
          </div>
        </div>
      </div>

      {/* Question 3: What should I learn next? */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
              Question 3
            </span>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              What should I learn next?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recommended steps based on your missing verified skills and course prerequisites.
            </p>
          </div>
          <Compass className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              priority: '1st Priority',
              title: 'Docker & Multi-Stage Containers',
              impact: '+8% readiness boost',
              reason: 'Required before you can unlock the AWS Cloud course and pass the container quiz.',
              path: '/roadmap',
              action: 'Open Course',
            },
            {
              priority: '2nd Priority',
              title: 'Pass Docker Timed Assessment',
              impact: 'Verifies Docker skill',
              reason: 'Score 70% or higher to upgrade Docker from Self-Declared to Assessed.',
              path: '/assessments',
              action: 'Go to Quizzes',
            },
            {
              priority: '3rd Priority',
              title: 'Finish Healthcare API Review',
              impact: '+6% project credit',
              reason: 'Passing mentor review gives project verification for FastAPI and PostgreSQL.',
              path: '/projects',
              action: 'View Projects',
            },
          ].map((rec) => (
            <div
              key={rec.title}
              className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-foreground">{rec.priority}</span>
                  <span className="text-muted-foreground">{rec.impact}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.reason}</p>
              </div>
              <button
                onClick={() => onNavigate(rec.path)}
                className="inline-flex items-center justify-center gap-1.5 w-full rounded border border-border bg-card py-1.5 text-xs font-mono font-semibold hover:bg-secondary transition-colors"
              >
                <span>{rec.action}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Question 4: What jobs am I currently closest to? */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
            Question 4
          </span>
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            What jobs am I currently closest to?
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare your verified skills against related job roles and switch your active goal anytime.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockCareerMatches.map((cm) => {
            const isTarget = cm.careerId === activeTargetId;
            return (
              <div
                key={cm.careerId}
                className={cn(
                  'flex flex-col justify-between p-4 rounded-lg border space-y-3 transition-colors',
                  isTarget ? 'border-2 border-foreground bg-surface' : 'border-border bg-surface'
                )}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                    {cm.role.category}
                  </span>
                  <h4 className="text-sm font-bold text-foreground mt-0.5">{cm.role.title}</h4>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-extrabold text-foreground tabular-nums">
                      {cm.matchPercentage}%
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">Match</span>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-1">
                    {cm.criticalGapsCount} key skill gap{cm.criticalGapsCount === 1 ? '' : 's'}
                  </div>
                </div>

                <button
                  onClick={() => handleSetTarget(cm.careerId, cm.role.title)}
                  className={cn(
                    'w-full rounded border py-1.5 text-xs font-mono font-semibold transition-colors inline-flex items-center justify-center gap-1.5',
                    isTarget
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-foreground/40 hover:bg-foreground hover:text-background'
                  )}
                >
                  {isTarget && <Check size={12} />}
                  <span>{isTarget ? 'Active Target Role' : 'Set as Target Role'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
