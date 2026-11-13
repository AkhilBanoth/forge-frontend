import {
  Users,
  Target,
  FolderGit2,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Award,
  Activity,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { cn } from '../../lib/utils';
import { TechieInventoryWorkspace } from '../shared/TechieInventoryWorkspace';

export interface PlatformOverviewProps {
  totalLearners?: number;
  averageReadinessScore?: number;
  pendingReviewsCount: number;
  verificationPassRate?: number;
  userList?: Array<{
    id: string;
    name: string;
    email: string;
    roles: string[];
    targetCareer: string;
    readinessScore: number;
    verifiedSkillsCount: number;
    registeredDate: string;
  }>;
  onNavigateTab?: (tab: 'queue' | 'curriculum' | 'assessments' | 'users' | 'taxonomy') => void;
  className?: string;
}

export function PlatformOverview({
  totalLearners = 1428,
  averageReadinessScore = 71.8,
  pendingReviewsCount = 2,
  verificationPassRate = 68.4,
  userList = [],
  onNavigateTab,
  className,
}: PlatformOverviewProps) {
  // Compute metrics dynamically if userList is provided
  const dynamicTotal = userList.length > 0 ? userList.length : totalLearners;
  const computedAverage =
    userList.length > 0
      ? Number(
          (
            userList.reduce((acc, u) => acc + u.readinessScore, 0) / userList.length
          ).toFixed(1)
        )
      : averageReadinessScore;

  // 30-day trend datasets for mini Recharts sparklines
  const learner30DayTrend = [
    { day: 'Day 1', value: 1140 },
    { day: 'Day 2', value: 1155 },
    { day: 'Day 3', value: 1168 },
    { day: 'Day 4', value: 1162 },
    { day: 'Day 5', value: 1180 },
    { day: 'Day 6', value: 1195 },
    { day: 'Day 7', value: 1210 },
    { day: 'Day 8', value: 1218 },
    { day: 'Day 9', value: 1232 },
    { day: 'Day 10', value: 1245 },
    { day: 'Day 11', value: 1238 },
    { day: 'Day 12', value: 1256 },
    { day: 'Day 13', value: 1270 },
    { day: 'Day 14', value: 1285 },
    { day: 'Day 15', value: 1300 },
    { day: 'Day 16', value: 1294 },
    { day: 'Day 17', value: 1312 },
    { day: 'Day 18', value: 1328 },
    { day: 'Day 19', value: 1340 },
    { day: 'Day 20', value: 1335 },
    { day: 'Day 21', value: 1354 },
    { day: 'Day 22', value: 1370 },
    { day: 'Day 23', value: 1382 },
    { day: 'Day 24', value: 1378 },
    { day: 'Day 25', value: 1395 },
    { day: 'Day 26', value: 1408 },
    { day: 'Day 27', value: 1415 },
    { day: 'Day 28', value: 1420 },
    { day: 'Day 29', value: 1424 },
    { day: 'Day 30', value: dynamicTotal },
  ];

  const review30DayTrend = [
    { day: 'Day 1', reviews: 3 },
    { day: 'Day 2', reviews: 5 },
    { day: 'Day 3', reviews: 4 },
    { day: 'Day 4', reviews: 8 },
    { day: 'Day 5', reviews: 6 },
    { day: 'Day 6', reviews: 2 },
    { day: 'Day 7', reviews: 4 },
    { day: 'Day 8', reviews: 9 },
    { day: 'Day 9', reviews: 11 },
    { day: 'Day 10', reviews: 8 },
    { day: 'Day 11', reviews: 5 },
    { day: 'Day 12', reviews: 10 },
    { day: 'Day 13', reviews: 12 },
    { day: 'Day 14', reviews: 7 },
    { day: 'Day 15', reviews: 5 },
    { day: 'Day 16', reviews: 9 },
    { day: 'Day 17', reviews: 11 },
    { day: 'Day 18', reviews: 14 },
    { day: 'Day 19', reviews: 10 },
    { day: 'Day 20', reviews: 8 },
    { day: 'Day 21', reviews: 6 },
    { day: 'Day 22', reviews: 9 },
    { day: 'Day 23', reviews: 12 },
    { day: 'Day 24', reviews: 10 },
    { day: 'Day 25', reviews: 7 },
    { day: 'Day 26', reviews: 5 },
    { day: 'Day 27', reviews: 8 },
    { day: 'Day 28', reviews: 10 },
    { day: 'Day 29', reviews: 6 },
    { day: 'Day 30', reviews: Math.max(2, pendingReviewsCount) },
  ];

  const readiness30DayTrend = [
    { day: 'Day 1', score: 68.2 },
    { day: 'Day 2', score: 68.4 },
    { day: 'Day 3', score: 68.5 },
    { day: 'Day 4', score: 68.3 },
    { day: 'Day 5', score: 68.7 },
    { day: 'Day 6', score: 68.9 },
    { day: 'Day 7', score: 69.1 },
    { day: 'Day 8', score: 69.0 },
    { day: 'Day 9', score: 69.4 },
    { day: 'Day 10', score: 69.6 },
    { day: 'Day 11', score: 69.5 },
    { day: 'Day 12', score: 69.8 },
    { day: 'Day 13', score: 70.1 },
    { day: 'Day 14', score: 70.2 },
    { day: 'Day 15', score: 70.4 },
    { day: 'Day 16', score: 70.3 },
    { day: 'Day 17', score: 70.6 },
    { day: 'Day 18', score: 70.8 },
    { day: 'Day 19', score: 70.9 },
    { day: 'Day 20', score: 70.8 },
    { day: 'Day 21', score: 71.1 },
    { day: 'Day 22', score: 71.3 },
    { day: 'Day 23', score: 71.4 },
    { day: 'Day 24', score: 71.2 },
    { day: 'Day 25', score: 71.5 },
    { day: 'Day 26', score: 71.6 },
    { day: 'Day 27', score: 71.5 },
    { day: 'Day 28', score: 71.7 },
    { day: 'Day 29', score: 71.7 },
    { day: 'Day 30', score: computedAverage },
  ];

  const passRate30DayTrend = [
    { day: 'Day 1', rate: 64.5 },
    { day: 'Day 2', rate: 65.0 },
    { day: 'Day 3', rate: 64.8 },
    { day: 'Day 4', rate: 65.5 },
    { day: 'Day 5', rate: 66.0 },
    { day: 'Day 6', rate: 65.8 },
    { day: 'Day 7', rate: 66.2 },
    { day: 'Day 8', rate: 66.8 },
    { day: 'Day 9', rate: 67.0 },
    { day: 'Day 10', rate: 66.7 },
    { day: 'Day 11', rate: 67.2 },
    { day: 'Day 12', rate: 67.5 },
    { day: 'Day 13', rate: 67.3 },
    { day: 'Day 14', rate: 67.8 },
    { day: 'Day 15', rate: 68.0 },
    { day: 'Day 16', rate: 67.9 },
    { day: 'Day 17', rate: 68.2 },
    { day: 'Day 18', rate: 68.5 },
    { day: 'Day 19', rate: 68.3 },
    { day: 'Day 20', rate: 68.4 },
    { day: 'Day 21', rate: 68.1 },
    { day: 'Day 22', rate: 68.5 },
    { day: 'Day 23', rate: 68.7 },
    { day: 'Day 24', rate: 68.4 },
    { day: 'Day 25', rate: 68.6 },
    { day: 'Day 26', rate: 68.5 },
    { day: 'Day 27', rate: 68.3 },
    { day: 'Day 28', rate: 68.4 },
    { day: 'Day 29', rate: 68.5 },
    { day: 'Day 30', rate: verificationPassRate },
  ];

  return (
    <section
      aria-label="Platform Overview and Key Metrics"
      className={cn('space-y-6', className)}
    >
      {/* Platform Header & System Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
            <span>Live Platform Overview · All Systems Running</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
            Platform Overview &amp; Student Progress
          </h2>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Live summary of active students, average readiness scores, and mentor project reviews with 30-day activity charts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="rounded-lg border border-border bg-surface px-3 py-2 text-right">
            <span className="block text-[10px] uppercase text-muted-foreground font-semibold">
              Scoring System
            </span>
            <span className="font-bold text-foreground">Standard Rubric v2.4</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards with Integrated Recharts Mini Sparklines) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Active Learners with 30-Day Activity Sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs hover:border-foreground/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Total Active Learners
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                {dynamicTotal.toLocaleString()}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-foreground font-mono">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                +14.2%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Across 8 career learning tracks
            </p>
          </div>

          {/* Recharts Mini Sparkline: 30-Day Learner Activity */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>30-Day Activity Trend</span>
              </span>
              <span className="font-semibold text-foreground tabular-nums">Peak: {dynamicTotal}</span>
            </div>
            <div className="h-11 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={learner30DayTrend} margin={{ top: 2, right: 1, left: 1, bottom: 0 }}>
                  <defs>
                    <linearGradient id="learnerSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono shadow-xs text-foreground">
                            <span className="font-bold">{payload[0].value}</span> active learners
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    fill="url(#learnerSparklineGrad)"
                    isAnimationActive={false}
                    className="text-foreground"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-border pt-2.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Weekly Active:</span>
            <span className="font-semibold text-foreground">86.4% cohort</span>
          </div>
        </div>

        {/* Metric 2: Average Readiness Score with 30-Day Trend Sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs hover:border-foreground/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Avg. Readiness Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Target className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                {computedAverage}%
              </span>
              <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tier: <span className="font-bold text-foreground">Junior Ready</span> (Benchmark 72)
            </p>
          </div>

          {/* Recharts Mini Sparkline: 30-Day Readiness Score Progression */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>30-Day Score Trend</span>
              </span>
              <span className="font-semibold text-foreground tabular-nums">+3.5 pts</span>
            </div>
            <div className="h-11 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={readiness30DayTrend} margin={{ top: 2, right: 1, left: 1, bottom: 0 }}>
                  <defs>
                    <linearGradient id="readinessSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono shadow-xs text-foreground">
                            <span className="font-bold">{payload[0].value}%</span> readiness
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    fill="url(#readinessSparklineGrad)"
                    isAnimationActive={false}
                    className="text-foreground"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-border pt-2.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Goal: 75% Strong</span>
            <span className="font-semibold text-foreground">Target +3.2 pts</span>
          </div>
        </div>

        {/* Metric 3: Pending Mentor Reviews with 30-Day Review Velocity Sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs hover:border-foreground/40 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Pending Reviews
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                {pendingReviewsCount}
              </span>
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border font-mono',
                  pendingReviewsCount > 0
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-surface text-muted-foreground'
                )}
              >
                {pendingReviewsCount > 0 ? 'Needs Review' : 'All Done'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Student projects waiting for a mentor
            </p>
          </div>

          {/* Recharts Mini Sparkline: 30-Day Project Review Velocity */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>30-Day Review Activity</span>
              </span>
              <span className="font-semibold text-foreground tabular-nums">Avg 7.4/day</span>
            </div>
            <div className="h-11 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={review30DayTrend} margin={{ top: 2, right: 1, left: 1, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reviewSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono shadow-xs text-foreground">
                            <span className="font-bold">{payload[0].value}</span> reviews
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reviews"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    fill="url(#reviewSparklineGrad)"
                    isAnimationActive={false}
                    className="text-foreground"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-border pt-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Wait time:</span>
            {onNavigateTab ? (
              <button
                onClick={() => onNavigateTab('queue')}
                className="inline-flex items-center gap-1 font-bold text-foreground underline hover:opacity-80 transition-opacity"
              >
                <span>Open Queue</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <span className="font-semibold text-foreground">18.4 hrs average</span>
            )}
          </div>
        </div>

        {/* Metric 4: Verification Pass Rate with 30-Day Stability Sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs hover:border-foreground/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Project Pass Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                {verificationPassRate}%
              </span>
              <span className="text-xs text-muted-foreground font-semibold">pass rate</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on quiz &amp; project passing rules
            </p>
          </div>

          {/* Recharts Mini Sparkline: 30-Day Verification Pass Rate */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>30-Day Pass Stability</span>
              </span>
              <span className="font-semibold text-foreground tabular-nums">Avg 68%</span>
            </div>
            <div className="h-11 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={passRate30DayTrend} margin={{ top: 2, right: 1, left: 1, bottom: 0 }}>
                  <defs>
                    <linearGradient id="passRateSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono shadow-xs text-foreground">
                            <span className="font-bold">{payload[0].value}%</span> pass rate
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    fill="url(#passRateSparklineGrad)"
                    isAnimationActive={false}
                    className="text-foreground"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-border pt-2.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Changes Requested:</span>
            <span className="font-semibold text-foreground">31.6%</span>
          </div>
        </div>
      </div>

      {/* Interactive Infrastructure Hardware & Tech Inventory Hub */}
      <TechieInventoryWorkspace
        mode="admin"
        onNavigate={onNavigateTab ? () => onNavigateTab('queue') : undefined}
      />

      {/* Cohort Analytics & Queue Speed Breakdown (2-Column Grid) */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Readiness Tier Distribution (7 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-7 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
                Student Readiness Levels
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                How all active students rank using our 4-part readiness formula
              </p>
            </div>
            <span className="font-mono text-xs font-bold border border-border px-2 py-0.5 rounded bg-surface">
              1,428 Students Tracked
            </span>
          </div>

          {/* Tier Distribution Bars */}
          <div className="space-y-3.5">
            {/* Tier 1: Highly Ready */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                  <span>Highly Ready (90–100%)</span>
                </span>
                <span className="tabular-nums font-semibold">
                  114 learners <span className="text-muted-foreground font-normal">(8.0%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded bg-secondary overflow-hidden">
                <div className="h-full bg-foreground rounded" style={{ width: '8%' }} />
              </div>
            </div>

            {/* Tier 2: Strong Candidate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground/80" />
                  <span>Strong Candidate (75–89%)</span>
                </span>
                <span className="tabular-nums font-semibold">
                  271 learners <span className="text-muted-foreground font-normal">(19.0%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded bg-secondary overflow-hidden">
                <div className="h-full bg-foreground/80 rounded" style={{ width: '19%' }} />
              </div>
            </div>

            {/* Tier 3: Junior Ready (Median Cohort) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground/60" />
                  <span>Junior Ready (60–74%) · Average</span>
                </span>
                <span className="tabular-nums font-semibold">
                  586 learners <span className="text-muted-foreground font-normal">(41.0%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded bg-secondary overflow-hidden">
                <div className="h-full bg-foreground/60 rounded" style={{ width: '41%' }} />
              </div>
            </div>

            {/* Tier 4: Developing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground/40" />
                  <span>Developing (40–59%)</span>
                </span>
                <span className="tabular-nums font-semibold">
                  400 learners <span className="text-muted-foreground font-normal">(28.0%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded bg-secondary overflow-hidden">
                <div className="h-full bg-foreground/40 rounded" style={{ width: '28%' }} />
              </div>
            </div>

            {/* Tier 5: Foundation Required */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-foreground/50 bg-transparent" />
                  <span>Getting Started (&lt;40%)</span>
                </span>
                <span className="tabular-nums font-semibold">
                  57 learners <span className="text-muted-foreground font-normal">(4.0%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded bg-secondary overflow-hidden">
                <div className="h-full bg-foreground/20 rounded" style={{ width: '4%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-muted-foreground gap-2">
            <span>Average Speed: 4.2 verified skills / month</span>
            <span>Goal for Junior Roles: 75% readiness</span>
          </div>
        </div>

        {/* Right Column: Review Queue Speed (5 Cols) */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-5 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
                  Review Speed &amp; Queue Status
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  How long projects have been waiting
                </p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Wait Time Cards */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                  <span className="font-semibold text-foreground">Under 12 Hours</span>
                </div>
                <span className="font-bold tabular-nums">1 project</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full border border-foreground bg-transparent" />
                  <span className="font-semibold text-foreground">12–24 Hours</span>
                </div>
                <span className="font-bold tabular-nums">1 project</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full border border-dashed border-foreground/60 bg-transparent" />
                  <span className="font-semibold text-muted-foreground">Over 24 Hours (Late)</span>
                </div>
                <span className="font-bold text-foreground tabular-nums">0 overdue</span>
              </div>
            </div>

            {/* Target Career Enrollment Distribution */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                Most Popular Career Paths
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Python Backend Developer</span>
                  <span className="font-bold">642 (45%)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Frontend React &amp; Web Apps</span>
                  <span className="font-bold">457 (32%)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Data Engineering</span>
                  <span className="font-bold">329 (23%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions Row */}
          {onNavigateTab && (
            <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigateTab('queue')}
                className="flex-1 rounded-lg bg-foreground py-2 text-center text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
              >
                Review Projects ({pendingReviewsCount})
              </button>
              <button
                onClick={() => onNavigateTab('users')}
                className="flex-1 rounded-lg border border-border bg-surface py-2 text-center text-xs font-mono font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Manage Roles
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
