import React from 'react';
import { PageHeader } from '../shared/PageHeader';
import { SkillLevelMeter } from '../shared/SkillLevelMeter';
import { VerificationBadge } from '../shared/VerificationBadge';
import { mockSkillGaps, mockUserSkills } from '../../lib/mocks/data';
import { ArrowRight, Calendar } from 'lucide-react';

export function SkillGapScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Skill Gap Summary"
        description="See how your current verified skills compare to what is needed for your target job role."
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-muted-foreground">
                Target Job Role
              </span>
              <h2 className="text-lg font-bold text-foreground">Python Backend Developer (75% Target)</h2>
            </div>
            <span className="font-mono text-xs border border-border bg-card px-3 py-1 rounded">
              {mockSkillGaps.length} Skill Gaps Found
            </span>
          </div>
        </div>

        {/* Detailed Gap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-surface/50 border-b border-border font-mono text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="py-3 px-4">Skill & Verification</th>
                <th className="py-3 px-4">Current vs Needed</th>
                <th className="py-3 px-4">Gap Size</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockSkillGaps.map((gap) => {
                const userSkill = mockUserSkills.find((us) => us.skillId === gap.skill.id);
                return (
                  <tr key={gap.skill.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{gap.skill.name}</span>
                          {userSkill && (
                            <VerificationBadge status={userSkill.verificationStatus} size="sm" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                          <span>{gap.skill.category}</span>
                          {userSkill?.expiresAt && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 text-foreground">
                                <Calendar className="h-3 w-3" />
                                Valid until {userSkill.expiresAt}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[160px]">
                      <SkillLevelMeter level={gap.current} targetLevel={gap.required} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] ${
                          gap.gap === 'HIGH'
                            ? 'border-foreground bg-foreground text-background font-bold'
                            : 'border-border bg-surface text-foreground'
                        }`}
                      >
                        {gap.gap} GAP
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`text-xs uppercase font-bold ${
                          gap.severity === 'CRITICAL' ? 'underline' : 'text-muted-foreground'
                        }`}
                      >
                        {gap.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('/roadmap')}
                        className="inline-flex items-center gap-1 rounded border border-foreground/30 px-3 py-1 text-xs font-mono hover:bg-foreground hover:text-background transition-colors"
                      >
                        <span>Study</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
