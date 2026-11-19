import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { CircularProgress } from '../../components/shared/CircularProgress';
import { ReadinessBadge } from '../../components/shared/ReadinessBadge';
import { LoadingState } from '../../components/shared/States';
import { useReadiness } from '../../hooks/useReadiness';
import { ADVISORY_DISCLAIMERS, READINESS_THRESHOLDS } from '../../constants/readiness';
import { Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReadinessPageProps {
  onNavigate: (path: string) => void;
}

export function ReadinessPage({ onNavigate }: ReadinessPageProps) {
  const { scoreData, currentTier, history, isLoading } = useReadiness();

  if (isLoading || !scoreData) {
    return <LoadingState message="Calculating your readiness breakdown..." />;
  }

  const breakdownRows = [
    {
      label: 'Technical Skills',
      weight: '35%',
      score: scoreData.breakdown.technicalSkills,
      actionLabel: 'Check Skill Gaps',
      actionPath: '/app/career',
    },
    {
      label: 'Timed Assessments',
      weight: '25%',
      score: scoreData.breakdown.assessments,
      actionLabel: 'Take Assessments',
      actionPath: '/app/quizzes',
    },
    {
      label: 'Mentor-Reviewed Projects',
      weight: '25%',
      score: scoreData.breakdown.projects,
      actionLabel: 'Open Projects',
      actionPath: '/app/projects',
    },
    {
      label: 'Interview & Scenario Prep',
      weight: '15%',
      score: scoreData.breakdown.interviewPrep,
      actionLabel: 'Practice Weak Topics',
      actionPath: '/app/ai-practice',
    },
  ];

  const nextTier =
    READINESS_THRESHOLDS.find((t) => t.min > scoreData.overall) ||
    READINESS_THRESHOLDS[READINESS_THRESHOLDS.length - 1];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Readiness Score & History"
        description="Transparent calculation of your readiness based on verified skills, assessments, projects, and interview prep."
      />

      {/* Advisory Summary Banner — Honest guidance, never "guaranteed job" */}
      <div className="rounded-xl border border-primary/30 bg-card p-5 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold text-foreground">
            {scoreData.advisorySummary ||
              (scoreData.overall >= 60
                ? 'Based on your SkillForge data, you appear ready for junior roles.'
                : 'Build your verified profile by taking timed quizzes and submitting mentor-reviewed projects.')}
          </p>
          <p className="text-xs text-muted-foreground">
            {ADVISORY_DISCLAIMERS.noGuaranteeRule}
          </p>
        </div>
      </div>

      {/* Hero Score Card + 4-Part Formula Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Overall Readiness</div>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {currentTier?.label || scoreData.level.replace(/_/g, ' ')}
              </div>
            </div>
            <ReadinessBadge level={scoreData.level} />
          </div>

          <div className="flex items-center justify-center py-2">
            <CircularProgress
              value={scoreData.overall}
              size={140}
              strokeWidth={12}
              variant="indigo"
              label={currentTier?.label || scoreData.level.replace(/_/g, ' ')}
            />
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Verified Skills</span>
              <span className="font-mono font-bold tabular-nums text-foreground">
                {scoreData.verifiedSkillsCount} / {scoreData.totalRequiredSkills}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Level</span>
              <span className="font-mono font-bold text-primary">
                {nextTier.label} ({nextTier.min}%+)
              </span>
            </div>
          </div>
        </div>

        {/* Formula Components */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground">
              Score Formula (35% + 25% + 25% + 15%)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each signal contributes a fixed weight toward your overall 0–100% score.
            </p>
          </div>

          <div className="space-y-4">
            {breakdownRows.map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{row.label}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Weight: {row.weight}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold tabular-nums text-foreground">
                      {row.score}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(row.actionPath)}
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{row.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${row.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Readiness History Chart */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">Readiness Score History</h2>
            <p className="text-xs text-muted-foreground">
              Monthly score progression across assessments and project milestones.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-primary">
            Current: {scoreData.overall}%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value ?? 0}%`, 'Readiness']}
                contentStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#readinessFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5 Readiness Tier Scale */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground">Readiness Level Guide</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {READINESS_THRESHOLDS.map((tier) => {
            const isCurrent = tier.level === scoreData.level;
            return (
              <div
                key={tier.level}
                className={cn(
                  'rounded-lg border p-4 space-y-2',
                  isCurrent
                    ? 'border-2 border-primary bg-surface'
                    : 'border-border bg-background'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {tier.min}–{tier.max}%
                  </span>
                  {isCurrent && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <div className="text-xs font-bold text-primary">{tier.level.replace(/_/g, ' ')}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
