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
import { READINESS_THRESHOLDS } from '../../constants';
import { mockCareers } from '../../lib/mocks/data';
import {
  assessmentService,
  careerService,
  certificateService,
  projectService,
  roadmapService,
  skillGapService,
  userService,
} from '../../lib/api/services';
import type {
  Assessment,
  CareerRole,
  Certificate,
  ProjectSubmission,
  RoadmapPhase,
  SkillGap,
  UserSkill,
} from '../../types';
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

  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [careers, setCareers] = useState<CareerRole[]>(mockCareers);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      userService.getUserSkills(),
      skillGapService.getSkillGaps(),
      careerService.getCareers(),
      roadmapService.getRoadmap(),
      assessmentService.getAssessments(),
      projectService.getSubmissions(),
      certificateService.getCertificates(),
    ])
      .then(([skillsRes, gapsRes, careersRes, roadmapRes, assessRes, subRes, certRes]) => {
        if (!mounted) return;
        setUserSkills(skillsRes.data || []);
        setSkillGaps(gapsRes.data || []);
        if (careersRes.data?.length) setCareers(careersRes.data);
        setRoadmapPhases(roadmapRes.data || []);
        setAssessments(assessRes.data || []);
        setSubmissions(subRes.data || []);
        setCertificates(certRes.data || []);
      })
      .catch(() => {
        // Keep empty defaults on transient error
      });
    return () => {
      mounted = false;
    };
  }, [user?.id, profile?.targetCareerId]);

  const targetCareer =
    careers.find((c) => c.id === profile?.targetCareerId) || careers[0] || mockCareers[0];

  const openGaps = skillGaps.filter((g) => g.gap !== 'NONE');
  const criticalGaps = openGaps.filter((g) => g.severity === 'CRITICAL');
  const secondaryGaps = openGaps.filter((g) => g.severity === 'SECONDARY');
  const topPriorityGap = criticalGaps[0] || secondaryGaps[0];

  const readinessValue = scoreData?.overall ?? 0;
  const verifiedSkillsCount = scoreData?.verifiedSkillsCount ?? 0;
  const totalSkillsCount = scoreData?.totalRequiredSkills ?? (targetCareer.requirements.length || 10);
  const remainingToVerify = Math.max(0, totalSkillsCount - verifiedSkillsCount);

  // Next tier progress calculation
  const nextTier =
    READINESS_THRESHOLDS.find((t) => t.min > readinessValue) ||
    READINESS_THRESHOLDS[READINESS_THRESHOLDS.length - 1];
  const pointsToNextTier = Math.max(0, nextTier.min - readinessValue);

  // Dynamic stat card calculations from logged-in user's workspace
  const allCourses = roadmapPhases.flatMap((p) => p.courses || []);
  const totalLessons = allCourses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);
  const completedLessons = allCourses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
  const courseCompletionPct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const passedProjects = submissions.filter((s) => s.status === 'PASSED').length;
  const latestPassedProject = submissions.find((s) => s.status === 'PASSED' && s.review);

  const attemptedQuizzes = assessments.filter((a) => typeof a.previousScore === 'number');
  const passedQuizzesCount = attemptedQuizzes.filter((a) => a.previousPassed).length;
  const quizAverage =
    attemptedQuizzes.length > 0
      ? Math.round(
          attemptedQuizzes.reduce((sum, a) => sum + (a.previousScore || 0), 0) /
            attemptedQuizzes.length
        )
      : 0;

  // Dynamic pipeline step index (0..3)
  const pipelineStepIndex =
    passedProjects > 0
      ? 3
      : submissions.length > 0 || passedQuizzesCount > 0
        ? 2
        : completedLessons > 0
          ? 1
          : 0;

  const nextRenewalDate = userSkills.find((s) => s.expiresAt)?.expiresAt || 'Not scheduled yet';

  // Growth trend caption
  const historyDelta =
    history.length >= 2 ? history[history.length - 1].score - history[0].score : 0;
  const trendCaption =
    history.length >= 2
      ? `${historyDelta >= 0 ? '+' : ''}${historyDelta} pts growth over ${history.length} months of verified projects and quizzes`
      : 'Baseline recorded — pass quizzes and submit projects to track your monthly growth';

  const breakdownTechnical = scoreData?.breakdown.technicalSkills ?? 0;
  const breakdownAssessments = scoreData?.breakdown.assessments ?? 0;
  const breakdownProjects = scoreData?.breakdown.projects ?? 0;
  const breakdownInterview = scoreData?.breakdown.interviewPrep ?? 0;

  const advisoryHeadline =
    scoreData?.advisorySummary ||
    (readinessValue >= 60
      ? `Based on your SkillForge scores, you appear ready for junior ${targetCareer.title} roles.`
      : `You are building your ${targetCareer.title} readiness profile. Start a course and take a quiz to verify your first skill.`);

  return (
    <div className="space-y-8 select-none">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Learning Overview
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground font-sans">
            Welcome back, {user?.name || 'Learner'}
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
          <p className="font-medium text-foreground">{advisoryHeadline}</p>
          <p className="text-[11px] leading-relaxed">
            Completing courses is a great start, but passing skill quizzes and building real projects is what proves you are ready for the job.
          </p>
        </div>
      </div>

      {/* Hero Section: Two Rings + Readiness Status */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Readiness Core Hero Card (7 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                Readiness Score
              </span>
              <ReadinessBadge
                level={scoreData?.level || 'FOUNDATION_REQUIRED'}
                size="sm"
                showTier
              />
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
                    {currentTier?.label || 'Foundation Required'}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentTier?.description ||
                      'Core concepts need strengthening before entering assessment pipelines.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between sm:justify-start gap-6 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">CURRENT SCORE</span>
                    <span className="font-bold text-foreground">
                      {readinessValue} / {nextTier.min} pts
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">POINTS TO NEXT LEVEL</span>
                    <span className="font-bold text-foreground">{pointsToNextTier} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <SkillUpgradeStepper currentStepIndex={pipelineStepIndex} />
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
                value={
                  totalSkillsCount > 0
                    ? Math.round((verifiedSkillsCount / totalSkillsCount) * 100)
                    : 0
                }
                size={140}
                strokeWidth={10}
                valueFormatter={() => `${verifiedSkillsCount}/${totalSkillsCount}`}
                label="Verified"
                sublabel="Competencies"
                variant="emerald"
              />
            </div>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {verifiedSkillsCount} skill{verifiedSkillsCount === 1 ? '' : 's'} verified through quizzes and projects.{' '}
              {remainingToVerify} important skill{remainingToVerify === 1 ? '' : 's'} still need verification.
            </p>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Next Skill Renewal:</span>
            </span>
            <span className="font-bold">{nextRenewalDate}</span>
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
              {topPriorityGap
                ? `Build & Verify ${topPriorityGap.skill.name}`
                : `Advance Your ${targetCareer.title} Mastery`}
            </h3>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              {topPriorityGap
                ? `${topPriorityGap.skill.name} is your highest-priority gap for ${targetCareer.title} roles. Finishing the course and passing the quiz can lift your score from ${readinessValue}% toward ${Math.min(100, readinessValue + 6)}%.`
                : `You have covered all core requirements for ${targetCareer.title}. Submit a capstone project or take a timed quiz to raise your score further.`}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('/roadmap')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-mono text-xs font-bold text-indigo-700 hover:bg-slate-50 transition-all shadow-lg shadow-black/10 hover:scale-105 active:scale-100"
            >
              <span>
                {topPriorityGap
                  ? `Start ${topPriorityGap.skill.name.split(' ')[0]} Course`
                  : 'Open Learning Roadmap'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Four Stat Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courses Completed"
          value={`${courseCompletionPct}%`}
          sublabel={`${completedLessons} of ${totalLessons} lessons finished`}
          icon={BookOpen}
        />
        <StatCard
          title="Projects Reviewed"
          value={`${passedProjects} / ${submissions.length}`}
          sublabel={
            latestPassedProject?.review
              ? `${passedProjects} passed (${latestPassedProject.review.totalScore}/${latestPassedProject.review.maxScore} score)`
              : submissions.length > 0
                ? `${submissions.length} awaiting mentor review`
                : 'No projects submitted yet'
          }
          icon={FolderGit2}
        />
        <StatCard
          title="Quiz Average"
          value={attemptedQuizzes.length > 0 ? `${quizAverage}%` : '—'}
          sublabel={
            attemptedQuizzes.length > 0
              ? `${passedQuizzesCount} timed quiz${passedQuizzesCount === 1 ? '' : 'zes'} passed`
              : 'Take your first timed quiz'
          }
          icon={CheckSquare}
        />
        <StatCard
          title="Certificates Earned"
          value={String(certificates.length)}
          sublabel={
            certificates.length > 0
              ? 'Verified SkillForge proof'
              : 'Complete quizzes & projects to unlock'
          }
          icon={Award}
        />
      </div>

      {/* Technical Domain Skill Distribution Radar Chart */}
      <SkillDomainRadarChart
        userSkills={userSkills}
        targetCareer={targetCareer}
        snapshots={domainSnapshots.length > 0 ? domainSnapshots : undefined}
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
                  {breakdownTechnical}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdownTechnical}%` }}
                />
              </div>
            </div>

            {/* Assessments: 25% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Timed Assessments (Weight: 25%)</span>
                <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  {breakdownAssessments}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdownAssessments}%` }}
                />
              </div>
            </div>

            {/* Projects: 25% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Mentor-Reviewed Projects (Weight: 25%)</span>
                <span className="tabular-nums font-bold text-purple-600 dark:text-purple-400">
                  {breakdownProjects}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdownProjects}%` }}
                />
              </div>
            </div>

            {/* Interview Prep: 15% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Interview Readiness (Weight: 15%)</span>
                <span className="tabular-nums font-bold text-amber-600 dark:text-amber-400">
                  {breakdownInterview}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${breakdownInterview}%` }}
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
              <div className="flex items-end justify-around h-20 px-2 border-b border-border/80">
                {history.map((pt) => {
                  const barHeight = Math.max(10, (pt.score / 100) * 70);
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
                {trendCaption}
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
              Skills Needed for {targetCareer.title} Jobs
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

          {criticalGaps.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
              All critical role skills are currently met!
            </div>
          ) : (
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
          )}
        </div>

        {/* Other Skills to Improve Section */}
        {secondaryGaps.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
