import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  BookOpen,
  CheckSquare,
  FolderGit2,
  TrendingUp,
  Bot,
  Sparkles,
  BarChart3,
  Award,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Target,
} from 'lucide-react';
import { LEARNER_NAV_ITEMS } from '../constants/rbac';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../stores/themeStore';
import { useReadiness } from '../hooks/useReadiness';
import { mockCareers } from '../lib/mocks/data';
import { SkillForgeLogo } from '../components/shared/SkillForgeLogo';
import { CircularProgress } from '../components/shared/CircularProgress';
import { ToastContainer } from '../components/shared/ToastNotification';
import { FloatingMentorLauncher } from '../components/layout/FloatingMentorLauncher';
import { CommandPalette } from '../components/layout/CommandPalette';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Compass,
  Map: MapIcon,
  BookOpen,
  CheckSquare,
  FolderGit2,
  TrendingUp,
  Bot,
  Sparkles,
  BarChart3,
  Award,
  User: UserIcon,
};

interface LearnerLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  pageTitle: string;
  children: React.ReactNode;
}

export function LearnerLayout({
  currentPath,
  onNavigate,
  pageTitle,
  children,
}: LearnerLayoutProps) {
  const { user, profile, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const { scoreData } = useReadiness();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const readinessScore = scoreData?.overall ?? 72;
  const targetCareer =
    mockCareers.find((c) => c.id === profile?.targetCareerId)?.title || 'Python Backend Developer';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const primaryItems = LEARNER_NAV_ITEMS.filter((i) => i.section === 'primary');
  const secondaryItems = LEARNER_NAV_ITEMS.filter((i) => i.section === 'secondary');

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    onNavigate(href);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const isNavActive = (href: string) =>
    currentPath === href || currentPath.startsWith(`${href}/`);

  const renderNavSection = (title: string, items: typeof LEARNER_NAV_ITEMS) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      {items.map((item) => {
        const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
        const active = isNavActive(item.href);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNav(item.href)}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground font-medium',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar — Strictly Learner items only */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 sticky top-0 h-screen shrink-0',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <button
            type="button"
            onClick={() => handleNav('/app/dashboard')}
            className="focus-visible:outline-none"
          >
            <SkillForgeLogo size="sm" showText={!collapsed} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Learner navigation">
          {renderNavSection('Learning Path', primaryItems)}
          {renderNavSection('Insights & Profile', secondaryItems)}
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          {!collapsed && (
            <div className="rounded-lg bg-surface px-3 py-2">
              <div className="text-xs font-semibold text-foreground truncate">
                {user?.name || 'Learner'}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {user?.email || ''}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors',
              collapsed && 'justify-center px-2'
            )}
            title="Log out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-card border-r border-border h-full">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <SkillForgeLogo size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-5">
              {LEARNER_NAV_ITEMS.map((item) => {
                const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                const active = isNavActive(item.href);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                      active
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {pageTitle}
            </h1>
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Quick search</span>
              <kbd className="rounded border border-border bg-card px-1.5 text-[10px] font-mono font-semibold text-foreground">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('/app/career')}
              className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs hover:border-primary/40 transition-colors"
              title="Change target career"
            >
              <Target className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-muted-foreground">Goal:</span>
              <span className="font-semibold text-foreground max-w-[160px] truncate">
                {targetCareer}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/app/readiness')}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1 hover:border-primary/40 transition-colors"
              title="View readiness breakdown"
            >
              <CircularProgress
                value={readinessScore}
                size={26}
                strokeWidth={3}
                showPercentage={false}
                variant="indigo"
              />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-muted-foreground">Readiness</div>
                <div className="font-mono text-xs font-bold tabular-nums text-primary">
                  {readinessScore}%
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={handleNav}
      />
      <FloatingMentorLauncher />
      <ToastContainer />
    </div>
  );
}
