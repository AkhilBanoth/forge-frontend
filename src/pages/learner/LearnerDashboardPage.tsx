import React, { useEffect, useState } from 'react';
import { DashboardScreen } from '../../components/screens/DashboardScreen';
import { userService } from '../../lib/api/services';
import type { UserSkill } from '../../types';
import { createLearnerNavigator } from './navigationHelper';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface LearnerDashboardPageProps {
  onNavigate: (path: string) => void;
}

export function LearnerDashboardPage({ onNavigate }: LearnerDashboardPageProps) {
  const nav = createLearnerNavigator(onNavigate);
  const [expiringSkills, setExpiringSkills] = useState<UserSkill[]>([]);

  useEffect(() => {
    let mounted = true;
    userService.getUserSkills().then((res) => {
      if (!mounted) return;
      const now = new Date('2026-11-12T00:00:00Z').getTime();
      const soon = now + 30 * 24 * 60 * 60 * 1000;
      const flagged = res.data.filter((sk) => {
        if (!sk.expiresAt) return false;
        const ts = new Date(sk.expiresAt).getTime();
        return ts <= soon;
      });
      setExpiringSkills(flagged);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {expiringSkills.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-foreground">
                Skill Renewal Reminder ({expiringSkills.length} skill{expiringSkills.length > 1 ? 's' : ''} expiring or expired)
              </div>
              <div className="text-muted-foreground">
                {expiringSkills
                  .map((s) => `${s.skill.name} (valid until ${s.expiresAt})`)
                  .join(' · ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/app/ai-practice')}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Quick Practice
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/app/profile')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Review Skills</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <DashboardScreen onNavigate={nav} />
    </div>
  );
}
