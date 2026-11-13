import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import type {
  CareerRole,
  DomainRadarSnapshot,
  DomainSkillMetric,
  SkillLevel,
  UserSkill,
} from '../../types';
import { mockDomainRadarSnapshots } from '../../lib/mocks/data';
import { ArrowRight, CheckCircle2, Compass, Layers, Target, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SkillDomainRadarChartProps {
  userSkills: UserSkill[];
  targetCareer: CareerRole;
  snapshots?: DomainRadarSnapshot[];
  onNavigate: (path: string) => void;
}

const REQUIRED_LEVEL_SCORE: Record<SkillLevel, number> = {
  Beginner: 40,
  Intermediate: 68,
  Advanced: 85,
  Expert: 95,
};

const SELF_DECLARED_SCORE: Record<SkillLevel, number> = {
  Beginner: 30,
  Intermediate: 50,
  Advanced: 65,
  Expert: 75,
};

const VERIFIED_LEVEL_SCORE: Record<SkillLevel, number> = {
  Beginner: 45,
  Intermediate: 74,
  Advanced: 88,
  Expert: 96,
};

function getLearnerSkillScore(userSkill?: UserSkill): number {
  if (!userSkill) return 0;
  if (typeof userSkill.assessedScore === 'number') {
    return userSkill.assessedScore;
  }
  if (userSkill.verificationStatus === 'SELF_DECLARED') {
    return SELF_DECLARED_SCORE[userSkill.level] ?? 30;
  }
  return VERIFIED_LEVEL_SCORE[userSkill.level] ?? 70;
}

export function SkillDomainRadarChart({
  userSkills,
  targetCareer,
  snapshots = mockDomainRadarSnapshots,
  onNavigate,
}: SkillDomainRadarChartProps) {
  const [activeSnapshotId, setActiveSnapshotId] = useState<'current' | 'baseline' | 'projected'>('current');
  const [showTargetOverlay, setShowTargetOverlay] = useState(true);
  const [showCohortOverlay, setShowCohortOverlay] = useState(false);

  const selectedSnapshot =
    snapshots.find((s) => s.id === activeSnapshotId) || snapshots[0] || mockDomainRadarSnapshots[0];

  const domainMetrics = useMemo<DomainSkillMetric[]>(() => {
    // Use the dedicated mock snapshot metrics for baseline/projected views,
    // or for the default Python Backend role when userSkills match the baseline mock set.
    if (activeSnapshotId !== 'current' || targetCareer.id === 'career_py_backend') {
      return selectedSnapshot.metrics;
    }

    // Dynamically compute domain metrics if the learner switched to another target career role
    const domainMap = new Map<
      string,
      Array<{
        name: string;
        score: number;
        target: number;
        verified: boolean;
      }>
    >();

    const seenSkillIds = new Set<string>();

    for (const req of targetCareer.requirements) {
      seenSkillIds.add(req.skillId);
      const domain = req.skill.category;
      const matchedUserSkill = userSkills.find((us) => us.skillId === req.skillId);
      const score = getLearnerSkillScore(matchedUserSkill);
      const target = REQUIRED_LEVEL_SCORE[req.requiredLevel] ?? 70;
      const verified = Boolean(
        matchedUserSkill && matchedUserSkill.verificationStatus !== 'SELF_DECLARED'
      );

      const list = domainMap.get(domain) || [];
      list.push({
        name: req.skill.name,
        score,
        target,
        verified,
      });
      domainMap.set(domain, list);
    }

    for (const us of userSkills) {
      if (seenSkillIds.has(us.skillId)) continue;
      const domain = us.skill.category;
      const score = getLearnerSkillScore(us);
      const verified = us.verificationStatus !== 'SELF_DECLARED';
      const list = domainMap.get(domain) || [];
      list.push({
        name: us.skill.name,
        score,
        target: 68,
        verified,
      });
      domainMap.set(domain, list);
    }

    return Array.from(domainMap.entries()).map(([domain, skills]) => {
      const totalSkills = skills.length;
      const learnerScore = Math.round(
        skills.reduce((acc, s) => acc + s.score, 0) / Math.max(1, totalSkills)
      );
      const targetScore = Math.round(
        skills.reduce((acc, s) => acc + s.target, 0) / Math.max(1, totalSkills)
      );
      const verifiedCount = skills.filter((s) => s.verified).length;
      const cohortLookup = selectedSnapshot.metrics.find((m) => m.domain === domain);
      return {
        domain,
        learnerScore,
        targetScore,
        cohortAvgScore: cohortLookup?.cohortAvgScore ?? 62,
        verifiedCount,
        totalSkills,
        gap: targetScore - learnerScore,
        skills,
      };
    });
  }, [activeSnapshotId, selectedSnapshot, userSkills, targetCareer]);

  const strongestDomain = useMemo(() => {
    if (domainMetrics.length === 0) return null;
    return [...domainMetrics].sort((a, b) => b.learnerScore - a.learnerScore)[0];
  }, [domainMetrics]);

  const focusDomain = useMemo(() => {
    if (domainMetrics.length === 0) return null;
    return [...domainMetrics].sort((a, b) => b.gap - a.gap)[0];
  }, [domainMetrics]);

  const domainsMeetingTarget = domainMetrics.filter((d) => d.gap <= 0).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
              Skill Distribution by Domain
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {activeSnapshotId === 'current'
              ? `See where you stand across ${domainMetrics.length} technical areas compared to ${targetCareer.title} requirements.`
              : selectedSnapshot.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mock Snapshot Selector */}
          <div className="inline-flex items-center rounded-lg border border-border bg-surface p-0.5 font-mono text-[11px]">
            {snapshots.map((snap) => (
              <button
                key={snap.id}
                type="button"
                onClick={() => setActiveSnapshotId(snap.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 transition-colors',
                  activeSnapshotId === snap.id
                    ? 'bg-foreground text-background font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {snap.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowTargetOverlay((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-mono font-semibold transition-colors',
              showTargetOverlay
                ? 'border-primary/40 bg-secondary text-foreground'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground'
            )}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Target</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCohortOverlay((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-mono font-semibold transition-colors',
              showCohortOverlay
                ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Peer Avg</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/skill-gap')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <span>Skill Gaps</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Chart (7 Cols) + Domain Standings (5 Cols) */}
      <div className="grid gap-6 lg:grid-cols-12 items-center">
        {/* Left: Recharts Radar Chart */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="74%" data={domainMetrics}>
                <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{
                    fill: 'hsl(var(--foreground))',
                    fontSize: 11,
                    fontFamily: 'Geist Mono, ui-monospace, monospace',
                    fontWeight: 600,
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tickCount={5}
                  tick={{
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 9,
                    fontFamily: 'Geist Mono, ui-monospace, monospace',
                  }}
                  axisLine={false}
                />

                {showTargetOverlay && (
                  <Radar
                    name="Role Target"
                    dataKey="targetScore"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    fill="hsl(var(--muted-foreground))"
                    fillOpacity={0.08}
                    isAnimationActive={false}
                  />
                )}

                {showCohortOverlay && (
                  <Radar
                    name="Peer Average"
                    dataKey="cohortAvgScore"
                    stroke="#10b981"
                    strokeWidth={1.75}
                    strokeDasharray="2 2"
                    fill="#10b981"
                    fillOpacity={0.12}
                    isAnimationActive={false}
                  />
                )}

                <Radar
                  name="Your Skills"
                  dataKey="learnerScore"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.28}
                  dot={{ r: 3.5, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                  isAnimationActive={false}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload as DomainSkillMetric;
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-xs space-y-2 max-w-[240px]">
                        <div className="flex items-center justify-between gap-4 border-b border-border pb-1.5">
                          <span className="font-bold text-foreground font-mono uppercase">
                            {item.domain}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-primary">
                            {item.learnerScore}%
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] font-mono">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Role Target:</span>
                            <span className="font-semibold text-foreground">{item.targetScore}%</span>
                          </div>
                          {showCohortOverlay && (
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Peer Average:</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {item.cohortAvgScore}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span
                              className={cn(
                                'font-bold',
                                item.gap <= 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              )}
                            >
                              {item.gap <= 0 ? `Ahead (+${Math.abs(item.gap)}%)` : `${item.gap}% below target`}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-border pt-1.5 space-y-1">
                          {item.skills.map((sk) => (
                            <div
                              key={sk.name}
                              className="flex items-center justify-between gap-2 text-[10px] font-mono"
                            >
                              <span className="truncate text-muted-foreground">{sk.name}</span>
                              <span className="font-bold text-foreground shrink-0">{sk.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-primary/30 border-2 border-primary" />
              <span className="font-semibold text-foreground">{selectedSnapshot.label}</span>
            </div>
            {showTargetOverlay && (
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
                <span className="text-muted-foreground">Target Role Benchmark</span>
              </div>
            )}
            {showCohortOverlay && (
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 border-t-2 border-dotted border-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Peer Average</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Standings & Domain Summary List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
                Strongest Domain
              </span>
              <div className="font-bold text-sm text-foreground truncate">
                {strongestDomain?.domain || 'Programming'}
              </div>
              <span className="font-mono text-xs font-bold text-primary">
                {strongestDomain?.learnerScore ?? 92}% avg
              </span>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
                Focus Next
              </span>
              <div className="font-bold text-sm text-foreground truncate">
                {focusDomain && focusDomain.gap > 0 ? focusDomain.domain : 'All On Track'}
              </div>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                {focusDomain && focusDomain.gap > 0
                  ? `${focusDomain.learnerScore}% vs ${focusDomain.targetScore}%`
                  : `${domainsMeetingTarget}/${domainMetrics.length} ready`}
              </span>
            </div>
          </div>

          {/* Domain-by-Domain Breakdown */}
          <div className="rounded-lg border border-border bg-surface/60 divide-y divide-border/70">
            <div className="px-3.5 py-2 flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground font-bold">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                <span>Domain Breakdown</span>
              </span>
              <span>You / Target</span>
            </div>

            {domainMetrics.map((dm) => {
              const meetsTarget = dm.gap <= 0;
              return (
                <div
                  key={dm.domain}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground truncate">{dm.domain}</span>
                      {meetsTarget && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          meetsTarget ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-primary'
                        )}
                        style={{ width: `${dm.learnerScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <div className="font-bold text-foreground tabular-nums">
                      {dm.learnerScore}%{' '}
                      <span className="text-muted-foreground font-normal">/ {dm.targetScore}%</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      {dm.verifiedCount}/{dm.totalSkills} verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
            <span>
              {domainsMeetingTarget} of {domainMetrics.length} domains meet your target role level
            </span>
            <button
              type="button"
              onClick={() => onNavigate('/roadmap')}
              className="font-bold text-foreground underline hover:opacity-80 transition-opacity"
            >
              Improve Weak Areas →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
