import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { careerService } from '../../lib/api/services';
import type { CareerRequirement, CareerRole, SkillLevel } from '../../types';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminCareersPage() {
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('');
  const [requirements, setRequirements] = useState<CareerRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    careerService.getCareers().then((res) => {
      setCareers(res.data);
      if (res.data.length > 0) {
        setSelectedCareerId(res.data[0].id);
        setRequirements(res.data[0].requirements);
      }
      setLoading(false);
    });
  }, []);

  const handleSelectCareer = (career: CareerRole) => {
    setSelectedCareerId(career.id);
    setRequirements(career.requirements.map((r) => ({ ...r })));
  };

  const totalWeight = requirements.reduce((sum, r) => sum + (r.weightPercentage || 0), 0);
  const isValidTotal = totalWeight === 100;

  const handleSave = async () => {
    if (!isValidTotal) {
      showToast('error', `Skill importance weights must total 100% (currently ${totalWeight}%).`);
      return;
    }
    setIsSaving(true);
    try {
      const res = await careerService.saveCareerWeights(selectedCareerId, requirements);
      setCareers((prev) => prev.map((c) => (c.id === selectedCareerId ? res.data : c)));
      showToast('success', `Saved skill weights for ${res.data.title} (100%).`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save career weights.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading career roles..." />;
  }

  const activeCareer = careers.find((c) => c.id === selectedCareerId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Roles & Skill Importance Weights"
        description="Configure required skills, target proficiency levels, and importance percentages for each career role. Weights must total 100%."
      />

      <div className="flex flex-wrap gap-2">
        {careers.map((career) => (
          <button
            key={career.id}
            type="button"
            onClick={() => handleSelectCareer(career)}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
              career.id === selectedCareerId
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-foreground hover:bg-secondary'
            )}
          >
            {career.title}
          </button>
        ))}
      </div>

      {activeCareer && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">{activeCareer.title}</h2>
              <p className="text-xs text-muted-foreground">{activeCareer.description}</p>
            </div>
            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold',
                isValidTotal
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'border-destructive/40 bg-destructive/10 text-destructive'
              )}
            >
              {isValidTotal ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              <span>Total Weight: {totalWeight}% (must equal 100%)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface/50 font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Skill</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Required Level</th>
                  <th className="py-3 px-4 text-right">Importance (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {requirements.map((req, idx) => (
                  <tr key={req.skillId}>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {req.skill.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.importance}
                        onChange={(e) => {
                          const next = [...requirements];
                          next[idx] = {
                            ...req,
                            importance: e.target.value as 'CRITICAL' | 'SECONDARY',
                          };
                          setRequirements(next);
                        }}
                        className="rounded border border-border bg-background px-2.5 py-1 text-xs font-mono"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="SECONDARY">SECONDARY</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.requiredLevel}
                        onChange={(e) => {
                          const next = [...requirements];
                          next[idx] = {
                            ...req,
                            requiredLevel: e.target.value as SkillLevel,
                          };
                          setRequirements(next);
                        }}
                        className="rounded border border-border bg-background px-2.5 py-1 text-xs font-mono"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={req.weightPercentage ?? 0}
                        onChange={(e) => {
                          const next = [...requirements];
                          next[idx] = {
                            ...req,
                            weightPercentage: Math.max(0, Math.min(100, Number(e.target.value))),
                          };
                          setRequirements(next);
                        }}
                        className="w-20 rounded border border-border bg-background px-2.5 py-1 text-right font-mono text-xs font-bold tabular-nums"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border p-4 flex justify-end">
            <button
              type="button"
              disabled={!isValidTotal || isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Career Weights'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
