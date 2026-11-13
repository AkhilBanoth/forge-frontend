import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../stores/authStore';
import { ROLE_HOME } from '../../constants/rbac';
import { isPathAllowedForRoles, getQueryParam } from '../../routes/navigation';
import { AlertCircle, ArrowRight, GraduationCap, Users, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

type LoginPortalHint = 'LEARNER' | 'MENTOR' | 'ADMIN';

interface LoginPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  portalHint?: LoginPortalHint;
}

const PORTAL_TABS: Array<{
  id: LoginPortalHint;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'LEARNER', label: 'Learner', path: '/login', icon: GraduationCap },
  { id: 'MENTOR', label: 'Mentor', path: '/mentor/login', icon: Users },
  { id: 'ADMIN', label: 'Admin', path: '/admin/login', icon: Shield },
];

const PORTAL_COPY: Record<
  LoginPortalHint,
  {
    title: string;
    subtitle: string;
    placeholder: string;
  }
> = {
  LEARNER: {
    title: 'Learner Sign In',
    subtitle: 'Enter your email and password to open your learning dashboard.',
    placeholder: 'you@example.com',
  },
  MENTOR: {
    title: 'Mentor Sign In',
    subtitle: 'Sign in with your Mentor credentials to review learners and grade projects.',
    placeholder: 'mentor@skillforge.io',
  },
  ADMIN: {
    title: 'Admin Sign In',
    subtitle: 'Sign in with your Administrator credentials to manage users, roles, and courses.',
    placeholder: 'admin@skillforge.io',
  },
};

export function LoginPage({
  currentPath,
  onNavigate,
  portalHint = 'LEARNER',
}: LoginPageProps) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = PORTAL_COPY[portalHint];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await login(email.trim(), password);
    setIsSubmitting(false);

    if (ok) {
      // Role always comes from backend auth state / GET /auth/me
      const backendRoles = useAuthStore.getState().roles;
      const primaryRole = backendRoles[0] || 'LEARNER';
      const redirectParam = getQueryParam('redirect');

      if (redirectParam && isPathAllowedForRoles(redirectParam, backendRoles)) {
        onNavigate(redirectParam);
      } else {
        onNavigate(ROLE_HOME[primaryRole]);
      }
    }
  };

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
          {/* Distinct Portal Entry Tabs (/login, /mentor/login, /admin/login) */}
          <div
            role="tablist"
            aria-label="Login portal selection"
            className="grid grid-cols-3 gap-1.5 rounded-lg border border-border bg-surface p-1"
          >
            {PORTAL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = portalHint === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    clearError();
                    onNavigate(tab.path);
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3.5 text-xs text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                placeholder={copy.placeholder}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="border-t border-border pt-4 space-y-3 text-center text-xs text-muted-foreground">
            {portalHint === 'LEARNER' ? (
              <div>
                New learner?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="font-semibold text-primary hover:underline"
                >
                  Create Learner Account
                </button>
              </div>
            ) : (
              <div>Mentor and Admin accounts are created by an Administrator.</div>
            )}

            <details className="text-left rounded-lg border border-border bg-surface/60 px-3 py-2 text-[11px]">
              <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground">
                Demo login credentials
              </summary>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-foreground">
                <div>Learner: rahul.sharma@skillforge.io</div>
                <div>Mentor: marcus.vance@skillforge.io</div>
                <div>Admin: devon.h@skillforge.io</div>
                <div className="text-muted-foreground">Password: any 4+ chars (e.g. skillforge123)</div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
