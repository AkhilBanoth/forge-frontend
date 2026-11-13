import React, { useEffect, useState } from 'react';
import { SettingsScreen } from '../../components/screens/SettingsScreen';
import { userService } from '../../lib/api/services';
import type { UserSkill } from '../../types';
import { createLearnerNavigator } from './navigationHelper';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const nav = createLearnerNavigator(onNavigate);
  const [expiring, setExpiring] = useState<UserSkill[]>([]);

  useEffect(() => {
    userService.getUserSkills().then((res) => {
      const now = new Date('2026-11-12T00:00:00Z').getTime();
      const soon = now + 30 * 24 * 60 * 60 * 1000;
      setExpiring(
        res.data.filter((s) => s.expiresAt && new Date(s.expiresAt).getTime() <= soon)
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">Verification Rule:</strong> Skills you add yourself are marked{' '}
          <code className="font-mono text-foreground">SELF_DECLARED</code>. Learners cannot mark skills as{' '}
          <code className="font-mono text-foreground">PROJECT_VERIFIED</code>—only timed assessments and mentor reviews upgrade your verification badge.
        </span>
      </div>

      {expiring.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Skill Expiry Notice: </span>
              <span className="text-muted-foreground">
                {expiring.map((s) => `${s.skill.name} (valid until ${s.expiresAt})`).join(', ')}. Renew by retaking an assessment or AI practice session.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/app/ai-practice')}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary shrink-0"
          >
            Renew with AI Practice
          </button>
        </div>
      )}

      <SettingsScreen onNavigate={nav} />
    </div>
  );
}
