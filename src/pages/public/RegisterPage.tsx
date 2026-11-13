import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowRight, Info } from 'lucide-react';

interface RegisterPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function RegisterPage({ currentPath, onNavigate }: RegisterPageProps) {
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password.trim().length < 6) {
      setLocalError('Please choose a password with at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const ok = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (ok) {
      onNavigate('/app/onboarding');
    }
  };

  const activeError = localError || error;

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Learner Registration
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Create your learner account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Start tracking your skill gaps, roadmaps, projects, and job readiness score.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3.5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              Public registration creates <strong className="text-foreground">LEARNER</strong> accounts only. Mentor and Admin accounts are created by a platform Administrator.
            </span>
          </div>

          {activeError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3.5 text-xs text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Taylor"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="reg-pass">
                Password
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Learner Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="font-semibold text-primary hover:underline"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
