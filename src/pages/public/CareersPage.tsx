import React, { useEffect, useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { careerService } from '../../lib/api/services';
import type { CareerRole } from '../../types';
import { LoadingState } from '../../components/shared/States';
import { ArrowRight, Compass, CheckCircle2 } from 'lucide-react';

interface CareersPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function CareersPage({ currentPath, onNavigate }: CareersPageProps) {
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let mounted = true;
    careerService
      .getCareers()
      .then((res) => {
        if (mounted) {
          setCareers(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['ALL', ...Array.from(new Set(careers.map((c) => c.category)))];
  const filtered =
    selectedCategory === 'ALL'
      ? careers
      : careers.filter((c) => c.category === selectedCategory);

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Public Career Directory
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore target career roles & required skills
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Inspect the exact technical skills, target proficiency levels, and importance weights before starting your roadmap.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 self-start md:self-auto"
          >
            <span>Start Tracking Readiness</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat === 'ALL' ? 'All Roles' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState message="Loading career roles..." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((career) => {
              const totalWeight = career.requirements.reduce(
                (sum, r) => sum + (r.weightPercentage ?? 0),
                0
              );
              return (
                <div
                  key={career.id}
                  className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">{career.category}</span>
                      <span className="font-mono tabular-nums">
                        {career.requirements.length} skills · {totalWeight || 100}% weight
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary shrink-0">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{career.title}</h2>
                        <p className="text-xs leading-relaxed text-muted-foreground mt-1">
                          {career.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        Required Skills & Importance
                      </div>
                      <div className="divide-y divide-border/70">
                        {career.requirements.map((req) => (
                          <div
                            key={req.skillId}
                            className="flex items-center justify-between py-2 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="font-medium text-foreground truncate">
                                {req.skill.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-muted-foreground">
                              <span>{req.requiredLevel}</span>
                              <span className="font-bold text-foreground tabular-nums">
                                {req.weightPercentage ?? Math.round(100 / career.requirements.length)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Read-only career preview
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('/register')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Choose this goal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
