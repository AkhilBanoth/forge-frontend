import React, { useEffect, useState } from 'react';
import { useReadiness } from '../../hooks/useReadiness';
import { useAuthStore } from '../../stores/authStore';
import {
  CircularProgress,
  ReadinessBadge,
  SkillLevelMeter,
  StatCard,
  SkillUpgradeStepper,
  SkillDomainRadarChart,
} from '../shared';
import { mockCareers, mockSkillGaps, mockUserSkills } from '../../lib/mocks/data';
import { userService } from '../../lib/api/services';
import type { UserSkill } from '../../types';
import { TechieInventoryWorkspace } from '../shared/TechieInventoryWorkspace';
import {
  ArrowRight,
  FolderGit2,
  CheckSquare,
  Award,
  BookOpen,
  TrendingUp,
  Info,
  Calendar,
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (path: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const { scoreData, currentTier, history, matches, domainSnapshots } = useReadiness();
  const [userSkills, setUserSkills] = useState<UserSkill[]>(mockUserSkills);

  useEffect(() => {
    let mounted = true;
    userService
      .getUserSkills()
      .then((res) => {
        if (mounted && res.data.length > 0) {
          setUserSkills(res.data);
        }
      })
      .catch(() => {
        // Keep mockUserSkills fallback
      });
    return () => {
      mounted = false;
    };
  }, []);

  const targetCareer =
    mockCareers.find((c) => c.id === profile?.targetCareerId) || mockCareers[0];

  const criticalGaps = mockSkillGaps.filter((g) => g.severity === 'CRITICAL');
  const secondaryGaps = mockSkillGaps.filter((g) => g.severity === 'SECONDARY');

  const readinessValue = scoreData?.overall || 72;
  const verifiedSkillsCount = scoreData?.verifiedSkillsCount || 7;
  const totalSkillsCount = scoreData?.totalRequiredSkills || 10;

  return (
    <div className="space-y-8 select-none">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Learning Overview
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground font-sans">
            Welcome back, {user?.name || 'Rahul'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">Target Job:</span>
          <span className="rounded border border-border bg-card px-2.5 py-1 text-xs font-bold font-mono">
            {targetCareer.title}
          </span>
        </div>
      </div>

      {/* Friendly Note Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 text-foreground mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="font-medium text-foreground">
            Based on your SkillForge scores, you appear ready for junior Python backend roles.
          </p>
          <p className="text-[11px] leading-relaxed">
            Completing courses is a great start, but passing skill quizzes and building real projects is what proves you are ready for the job.
          </p>
        </div>
      </div>

      {/* Interactive Techie Developer Inventory & Hardware Workspace */}
      <TechieInventoryWorkspace mode="learner" onNavigate={onNavigate} />

      {/* Hero Section: Two Rings + Readiness Status */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Readiness Core Hero Card (7 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                Readiness Score
              </span>
              <ReadinessBadge level={scoreData?.level || 'JUNIOR_READY'} size="sm" showTier />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
              <CircularProgress
                value={readinessValue}
                size={160}
                strokeWidth={12}
                label="Overall"
                sublabel="Readiness"
                variant="indigo"
              />

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight">
                    {currentTier?.label || 'Junior Ready'}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentTier?.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between sm:justify-start gap-6 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">CURRENT SCORE</span>
                    <span className="font-bold text-foreground">72 / 75 pts</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">POINTS TO NEXT LEVEL</span>
                    <span className="font-bold text-foreground">3 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <SkillUpgradeStepper currentStepIndex={2} />
          </div>
        </div>

        {/* Secondary Ring & Verification Summary (5 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                Skills Verification
              </span>
              <span className="text-xs font-mono font-semibold">
                {verifiedSkillsCount} of {totalSkillsCount} Verified
              </span>
            </div>

            <div className="flex items-center justify-center py-4">
              <CircularProgress
                value={Math.round((verifiedSkillsCount / totalSkillsCount) * 100)}
                size={140}
                strokeWidth={10}
                valueFormatter={() => `${verifiedSkillsCount}/${totalSkillsCount}`}
                label="Verified"
                sublabel="Competencies"
                variant="emerald"
              />
            </div>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              7 skills verified through quizzes and projects. 3 important skills still need verification.
            </p>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Next Skill Renewal:</span>
            </span>
            <span className="font-bold">
              {userSkills.find((s) => s.expiresAt)?.expiresAt || '2028-09-12'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Call-to-Action: High Contrast Indigo Gradient "Next Recommended Action" Card */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white p-6 sm:p-7 shadow-xl shadow-indigo-500/20 transition-all border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold">Next Best Step · Recommended Action</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Complete Your Docker Container Project
            </h3>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Docker is your biggest missing skill for Python Backend jobs. Finishing this course and submitting the project can move your score from 72% up to 76%.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('/roadmap')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-mono text-xs font-bold text-indigo-700 hover:bg-slate-50 transition-all shadow-lg shadow-black/10 hover:scale-105 active:scale-100"
            >
              <span>Start Docker Course</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Four Stat Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courses Completed"
          value="68%"
          sublabel="17 of 25 lessons finished"
          icon={BookOpen}
        />
        <StatCard
          title="Projects Reviewed"
          value="3 / 4"
          sublabel="1 passed (38/50 score)"
          icon={FolderGit2}
        />
        <StatCard
          title="Quiz Average"
          value="81%"
          sublabel="3 timed quizzes passed"
          icon={CheckSquare}
        />
        <StatCard
          title="Certificates Earned"
          value="3"
          sublabel="Verified SkillForge proof"
          icon={Award}
        />
      </div>

      {/* Technical Domain Skill Distribution Radar Chart */}
      <SkillDomainRadarChart
        userSkills={userSkills}
        targetCareer={targetCareer}
        snapshots={domainSnapshots}
        onNavigate={onNavigate}
      />

      {/* Readiness Breakdown by Weights + Trend Sparkline */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Formula Weights Breakdown (7 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-7 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider">
                Readiness Score Breakdown
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Formula: Technical (35%) + Assessments (25%) + Projects (25%) + Interview (15%)
              </p>
            </div>
            <span className="font-mono text-xs font-bold">{readinessValue}% Total</span>
          </div>

          <div className="space-y-4">
            {/* Technical Skills: 35% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Technical Skills (Weight: 35%)</span>
                <span className="tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                  {scoreData?.breakdown.technicalSkills || 78}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${scoreData?.breakdown.technicalSkills || 78}%` }}
                />
              </div>
            </div>

            {/* Assessments: 25% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Timed Assessments (Weight: 25%)</span>
                <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {scoreData?.breakdown.assessments || 81}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${scoreData?.breakdown.assessments || 81}%` }}
                />
              </div>
            </div>

            {/* Projects: 25% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Mentor-Reviewed Projects (Weight: 25%)</span>
                <span className="tabular-nums font-bold text-purple-600 dark:text-purple-400">
                  {scoreData?.breakdown.projects || 76}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${scoreData?.breakdown.projects || 76}%` }}
                />
              </div>
            </div>

            {/* Interview Prep: 15% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Interview Readiness (Weight: 15%)</span>
                <span className="tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {scoreData?.breakdown.interviewPrep || 48}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${scoreData?.breakdown.interviewPrep || 48}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Trend Sparkline & Closest Career Matches (5 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">
                Score Over Time
              </span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Simple Grayscale Trend Sparkline */}
            <div className="space-y-3">
              <div className="flex items-end justify-between h-20 px-2 border-b border-border/80">
                {history.map((pt) => {
                  const barHeight = Math.max(15, (pt.score / 100) * 70);
                  return (
                    <div key={pt.date} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold">{pt.score}%</span>
                      <div
                        className="w-8 bg-foreground rounded-t-sm transition-all"
                        style={{ height: `${barHeight}px` }}
                      />
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">
                        {pt.date.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground text-center font-mono">
                +24 pts growth over 3 months of verified projects and quizzes
              </p>
            </div>
          </div>

          {/* Closest Careers Mini List */}
          <div className="border-t border-border pt-4 space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
              Closest Job Matches
            </span>
            <div className="space-y-1.5">
              {matches.slice(0, 3).map((cm) => (
                <div
                  key={cm.careerId}
                  className="flex items-center justify-between text-xs py-1 border-b border-border/40 font-mono"
                >
                  <span className="truncate max-w-[170px]">{cm.role.title}</span>
                  <span className="font-bold">{cm.matchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Priority & Other Skill Gaps Table */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider">
              Skills Needed for Python Backend Jobs
            </h3>
            <button
              onClick={() => onNavigate('/skill-gap')}
              className="text-xs font-mono underline hover:text-foreground text-muted-foreground"
            >
              View Full Skill Gap List
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ordered by how much they affect your job readiness score. Focus on the top priority skills first.
          </p>
        </div>

        {/* Top Priority Gaps Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Top Priority Skills ({criticalGaps.length})
            </span>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border overflow-hidden">
            {criticalGaps.map((gap) => (
              <div
                key={gap.skill.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface hover:bg-secondary/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{gap.skill.name}</span>
                    <span className="rounded border border-foreground/40 px-1.5 py-0.2 text-[10px] font-mono uppercase font-semibold">
                      PRIORITY
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground max-w-md">{gap.skill.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <SkillLevelMeter level={gap.current} targetLevel={gap.required} size="sm" />
                  </div>
                  <button
                    onClick={() => onNavigate('/roadmap')}
                    className="shrink-0 rounded border border-foreground px-2.5 py-1 text-xs font-mono hover:bg-foreground hover:text-background transition-colors"
                  >
                    Study →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Skills to Improve Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full border border-foreground" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Other Skills to Improve ({secondaryGaps.length})
            </span>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border/80 overflow-hidden">
            {secondaryGaps.map((gap) => (
              <div
                key={gap.skill.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{gap.skill.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{gap.skill.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <SkillLevelMeter level={gap.current} targetLevel={gap.required} size="sm" />
                  </div>
                  <button
                    onClick={() => onNavigate('/roadmap')}
                    className="shrink-0 rounded border border-border px-2.5 py-1 text-xs font-mono hover:bg-secondary transition-colors text-muted-foreground"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
