import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SkillLevelMeter } from '../../components/shared/SkillLevelMeter';
import { VerificationBadge } from '../../components/shared/VerificationBadge';
import { SkillDomainRadarChart } from '../../components/shared/SkillDomainRadarChart';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { useAuth } from '../../context/AuthContext';
import { careerService, readinessService, skillGapService, userService } from '../../lib/api/services';
import type { CareerMatch, CareerRole, SkillGap, UserSkill } from '../../types';
import { Check, Compass, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CareerPageProps {
  onNavigate: (path: string) => void;
}

export function CareerPage({ onNavigate }: CareerPageProps) {
  const { profile, setProfile } = useAuth();
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const activeCareerId = profile?.targetCareerId || 'career_py_backend';

  const loadData = async () => {
    const [carRes, matchRes, gapRes, skillRes] = await Promise.all([
      careerService.getCareers(),
      readinessService.getCareerMatches(),
      skillGapService.getSkillGaps(),
      userService.getUserSkills(),
    ]);
    setCareers(carRes.data);
    setMatches(matchRes.data);
    setGaps(gapRes.data);
    setUserSkills(skillRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeCareerId]);

  const handleSelectCareer = async (career: CareerRole) => {
    setUpdatingId(career.id);
    try {
      const updated = await careerService.selectTargetCareer(career.id);
      setProfile(updated.data);
      await loadData();
      showToast('success', `Target career updated to ${career.title}.`);
    } catch {
      showToast('error', 'Could not update target career.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Loading career mapping & skill gaps..." />;
  }

  const activeCareer = careers.find((c) => c.id === activeCareerId) || careers[0];

  const isExpiringOrExpired = (dateStr?: string) => {
    if (!dateStr) return null;
    const now = new Date('2026-11-12T00:00:00Z').getTime();
    const target = new Date(dateStr).getTime();
    if (target < now) return 'Expired';
    if (target - now <= 30 * 24 * 60 * 60 * 1000) return 'Expiring soon';
    return null;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Mapping & Skill Gaps"
        description="Compare your verified skills against target roles, switch your goal anytime, and inspect NONE / MEDIUM / HIGH skill gaps."
      />

      {/* Multi-Career Job Match Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            Your Match Across Career Roles
          </h2>
          <span className="text-xs text-muted-foreground">
            Click any role card to set it as your target career
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {matches.map((match) => {
            const isActive = match.careerId === activeCareerId;
            return (
              <button
                key={match.careerId}
                type="button"
                disabled={updatingId === match.careerId}
                onClick={() => handleSelectCareer(match.role)}
                className={cn(
                  'rounded-xl border p-5 text-left transition-all space-y-3',
                  isActive
                    ? 'border-2 border-primary bg-card shadow-xs'
                    : 'border-border bg-card hover:border-primary/40'
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{match.role.category}</span>
                  <span className="font-mono text-lg font-extrabold tabular-nums text-primary">
                    {match.matchPercentage}%
                  </span>
                </div>
                <div className="text-sm font-bold text-foreground">{match.role.title}</div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {match.criticalGapsCount} critical · {match.secondaryGapsCount} secondary gaps
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Check className="h-3.5 w-3.5" />
                      Active Target
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {updatingId === match.careerId ? 'Switching...' : 'Set as Target'}
                    </span>
                  )}
                  <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Required vs Current Skill Table */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-primary">Active Target Role</div>
            <h2 className="text-lg font-bold text-foreground">{activeCareer?.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{activeCareer?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/app/ai-practice')}
              className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Practice Weak Topics
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/app/roadmap')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Open Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface/60 font-mono text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Skill &amp; Badge</th>
                <th className="py-3 px-4">Current vs Required</th>
                <th className="py-3 px-4">Gap Level</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {gaps.map((gap) => {
                const owned = userSkills.find((us) => us.skillId === gap.skill.id);
                const expiryFlag = isExpiringOrExpired(owned?.expiresAt);
                return (
                  <tr key={gap.skill.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-foreground">{gap.skill.name}</span>
                          {owned ? (
                            <VerificationBadge status={owned.verificationStatus} size="sm" />
                          ) : (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              Not yet added
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {gap.skill.category} · Priority: {gap.severity}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[160px]">
                      <SkillLevelMeter level={gap.current} targetLevel={gap.required} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={cn(
                          'inline-block rounded px-2 py-0.5 text-[11px] font-bold',
                          gap.gap === 'HIGH'
                            ? 'bg-destructive/15 text-destructive'
                            : gap.gap === 'MEDIUM'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        )}
                      >
                        {gap.gap}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {owned?.expiresAt ? (
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1 text-foreground">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{owned.expiresAt}</span>
                          </div>
                          {expiryFlag && (
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{expiryFlag}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate(gap.gap === 'NONE' ? '/app/quizzes' : '/app/roadmap')
                        }
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                      >
                        {gap.gap === 'NONE' ? 'Take Quiz' : 'Close Gap'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Domain Radar Comparison */}
      {activeCareer && (
        <SkillDomainRadarChart
          userSkills={userSkills}
          targetCareer={activeCareer}
          onNavigate={(path) => onNavigate(path.startsWith('/app') ? path : `/app${path}`)}
        />
      )}
    </div>
  );
}
