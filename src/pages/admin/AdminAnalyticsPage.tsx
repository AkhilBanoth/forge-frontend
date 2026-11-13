import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { PageHeader, StatCard } from '../../components/shared/PageHeader';
import { TrendingUp, Users, Compass, AlertTriangle } from 'lucide-react';

const CAREER_DEMAND_DATA = [
  { career: 'Python Backend', learners: 640, avgReadiness: 74 },
  { career: 'Full-Stack TS', learners: 410, avgReadiness: 68 },
  { career: 'DevOps & Cloud', learners: 220, avgReadiness: 61 },
  { career: 'Data Analyst', learners: 158, avgReadiness: 77 },
];

const SKILL_BOTTLENECK_DATA = [
  { skill: 'Docker & Containers', gapRate: 62 },
  { skill: 'PyTest & Testing', gapRate: 54 },
  { skill: 'PostgreSQL Indexing', gapRate: 48 },
  { skill: 'JWT & Auth Security', gapRate: 39 },
  { skill: 'FastAPI Async', gapRate: 31 },
];

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Career & Platform Analytics"
        description="Track learner distribution across career roles, cohort readiness levels, and common skill gap bottlenecks."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Most Popular Role"
          value="Python Backend"
          sublabel="44.8% of active learners"
          icon={Compass}
        />
        <StatCard
          title="Platform Avg Readiness"
          value="71.8%"
          sublabel="+6.2% vs last month"
          icon={TrendingUp}
        />
        <StatCard
          title="Top Bottleneck Skill"
          value="Docker"
          sublabel="62% learners have HIGH/MEDIUM gap"
          icon={AlertTriangle}
        />
        <StatCard
          title="Junior Ready+ Learners"
          value="68.4%"
          sublabel="Scoring 60% or above"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Learners &amp; Average Readiness by Career
            </h2>
            <p className="text-xs text-muted-foreground">
              Enrollment volume and average readiness percentage per target track.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAREER_DEMAND_DATA} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="career" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '12px' }} />
                <Bar dataKey="learners" name="Learners" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgReadiness" name="Avg Readiness (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Most Frequent Skill Gap Bottlenecks
            </h2>
            <p className="text-xs text-muted-foreground">
              Percentage of learners currently below required level on key skills.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SKILL_BOTTLENECK_DATA}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" width={120} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [`${v ?? 0}% of learners`, 'Gap Rate']}
                  contentStyle={{ borderRadius: '0.5rem', fontSize: '12px' }}
                />
                <Bar dataKey="gapRate" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
