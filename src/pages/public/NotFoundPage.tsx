import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { Compass, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function NotFoundPage({ currentPath, onNavigate }: NotFoundPageProps) {
  const { isAuthenticated, homePath } = useAuth();

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Error 404 · Page Not Found
          </p>
          <h1 className="text-3xl font-extrabold text-foreground">
            We could not find that page
          </h1>
          <p className="text-sm text-muted-foreground">
            The route <code className="font-mono text-foreground">{currentPath}</code> does not exist or may have moved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(isAuthenticated ? homePath : '/')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/careers')}
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Browse Careers
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}
