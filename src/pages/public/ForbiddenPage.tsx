import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ForbiddenPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function ForbiddenPage({ currentPath, onNavigate }: ForbiddenPageProps) {
  const { isAuthenticated, homePath, role } = useAuth();

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-destructive/40 bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-destructive">
            Error 403 · Access Restricted
          </p>
          <h1 className="text-3xl font-extrabold text-foreground">
            You do not have permission to open this page
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isAuthenticated
              ? `Your signed-in role (${role}) cannot access ${currentPath}. Each workspace is strictly separated by role.`
              : 'You must sign in with an authorized account to view this workspace.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate(homePath)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to My Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}
