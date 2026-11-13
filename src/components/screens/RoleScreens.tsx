import React from 'react';
import { ShieldAlert, Home, ArrowRight, Lock } from 'lucide-react';
import { ROLE_HOME } from '../../constants';
import { useAuthStore } from '../../stores/authStore';

interface Forbidden403ScreenProps {
  onNavigate: (path: string) => void;
}

export function Forbidden403Screen({ onNavigate }: Forbidden403ScreenProps) {
  const roles = useAuthStore((state) => state.roles);
  const primaryRole = roles[0] || 'LEARNER';
  const homePath = ROLE_HOME[primaryRole] || '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="w-full max-w-md space-y-6 rounded-xl border-2 border-foreground bg-card p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-foreground bg-secondary">
          <ShieldAlert className="h-7 w-7 text-foreground" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Access Restricted
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Account Permissions Required</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your current account role (<span className="font-mono font-semibold">{roles.join(', ') || 'LEARNER'}</span>) does not have access to this page.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate(homePath)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Go to My Home Page ({primaryRole})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReservedRoleScreen({
  roleName,
  onNavigate,
}: {
  roleName: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 p-12 text-center text-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary mb-4">
        <Lock className="h-6 w-6 text-foreground" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Restricted Area
      </span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{roleName} Workspace</h2>
      <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
        This workspace is limited to specific account roles. You can switch accounts or return to your main dashboard below.
      </p>

      <button
        onClick={() => onNavigate('/dashboard')}
        className="mt-6 inline-flex items-center gap-2 rounded border border-foreground bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
      >
        <span>Return to Learner Dashboard</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
