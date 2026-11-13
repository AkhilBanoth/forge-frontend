import React from 'react';
import { Menu, Sun, Moon, Compass, Target, GraduationCap, ShieldCheck, Shield, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { CircularProgress } from '../shared/CircularProgress';
import { cn } from '../../lib/utils';

interface TopBarProps {
  pageTitle: string;
  onOpenMobileMenu: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  readinessScore?: number;
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onOpenCommandPalette?: () => void;
}

export function TopBar({
  pageTitle,
  onOpenMobileMenu,
  isDarkMode,
  onToggleTheme,
  readinessScore = 72,
  onNavigate,
  currentPath = '/dashboard',
  onOpenCommandPalette,
}: TopBarProps) {
  const roles = useAuthStore((state) => state.roles);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6">
      {/* Left: Mobile trigger & Page Title + Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {pageTitle}
          </h2>
        </div>

        {/* Quick Search Cmd+K Trigger Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-surface transition-all ml-1 sm:ml-3"
            title="Search roadmap, assessments, and projects (Cmd+K / Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Search roadmap, projects...</span>
            <span className="xl:hidden">Search</span>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.2 text-[10px] font-bold text-foreground">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right: Target Career chip + Readiness mini indicator + Theme toggle */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Target Career Chip */}
        <div className="hidden items-center gap-2 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 px-3 py-1 text-xs sm:flex">
          <Target className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-indigo-700/80 dark:text-indigo-300/80 font-mono text-[11px] font-semibold">TARGET:</span>
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
            Python Backend Developer
          </span>
        </div>

        {/* Readiness Mini Ring */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-surface px-2.5 py-1">
          <div className="h-7 w-7 flex items-center justify-center">
            <CircularProgress
              value={readinessScore}
              size={26}
              strokeWidth={3}
              showPercentage={false}
              variant="indigo"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
              Readiness
            </span>
            <span className="font-mono text-xs font-bold leading-none mt-0.5 text-indigo-600 dark:text-indigo-400">
              {readinessScore}%
            </span>
          </div>
        </div>

        {/* Role Portal Switcher — Only visible to Mentor/Admin */}
        {onNavigate && (roles.includes('MENTOR') || roles.includes('ADMIN')) && (
          <div className="hidden md:flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs font-mono">
            {roles.includes('LEARNER') && (
              <button
                onClick={() => onNavigate('/app/dashboard')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all font-semibold',
                  !currentPath.startsWith('/admin') && !currentPath.startsWith('/mentor')
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Learner</span>
              </button>
            )}

            {(roles.includes('MENTOR') || roles.includes('ADMIN')) && (
              <button
                onClick={() => onNavigate('/mentor/dashboard')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all font-semibold',
                  currentPath.startsWith('/mentor')
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Mentor</span>
              </button>
            )}

            {roles.includes('ADMIN') && (
              <button
                onClick={() => onNavigate('/admin/dashboard')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all font-semibold',
                  currentPath.startsWith('/admin')
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
