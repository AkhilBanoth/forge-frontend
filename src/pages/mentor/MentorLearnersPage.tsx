import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ReadinessBadge } from '../../components/shared/ReadinessBadge';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { mentorService } from '../../lib/api/services';
import type { LearnerDossier } from '../../lib/mocks/data';
import { Search, ArrowRight } from 'lucide-react';

interface MentorLearnersPageProps {
  onNavigate: (path: string) => void;
}

export function MentorLearnersPage({ onNavigate }: MentorLearnersPageProps) {
  const [learners, setLearners] = useState<LearnerDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  useEffect(() => {
    mentorService
      .getAssignedLearners()
      .then((res) => {
        setLearners(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = learners.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.targetCareer.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || l.readiness.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return <LoadingState message="Loading assigned learners..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Learners"
        description="Search and filter learners assigned to you. Open any profile for a read-only view of their skills, gaps, assessments, and AI mentor history."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by learner name, email, or target career..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="ALL">All Readiness Tiers</option>
          <option value="FOUNDATION_REQUIRED">Foundation Required</option>
          <option value="DEVELOPING">Developing</option>
          <option value="JUNIOR_READY">Junior Ready</option>
          <option value="STRONG_CANDIDATE">Strong Candidate</option>
          <option value="HIGHLY_READY">Highly Ready</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching learners"
          description="Try clearing your search or readiness level filter."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Target Career</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Verified Skills</th>
                  <th className="py-3 px-4">High Gaps</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((learner) => {
                  const highGaps = learner.gaps.filter((g) => g.gap === 'HIGH').length;
                  return (
                    <tr key={learner.learnerId} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{learner.name}</div>
                        <div className="text-[11px] text-muted-foreground">{learner.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {learner.targetCareer}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold tabular-nums text-foreground">
                            {learner.readiness.overall}%
                          </span>
                          <ReadinessBadge level={learner.readiness.level} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-foreground">
                        {learner.readiness.verifiedSkillsCount} / {learner.readiness.totalRequiredSkills}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-foreground">
                        {highGaps}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/mentor/learners/${learner.learnerId}`)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
