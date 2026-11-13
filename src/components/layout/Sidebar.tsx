import React from 'react';
import { NAV_ITEMS, type NavItemConfig } from '../../constants';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  FolderGit2,
  Bot,
  BarChart3,
  Award,
  TrendingUp,
  Users,
  Shield,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Home,
  GraduationCap,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SkillForgeLogo } from '../shared/SkillForgeLogo';

// Icon registry for dynamic NAV_ITEMS lookup
const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  LayoutDashboard,
  Map,
  CheckSquare,
  FolderGit2,
  Bot,
  BarChart3,
  Award,
  TrendingUp,
  Users,
  Shield,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Settings,
};

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export function Sidebar({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const logout = useAuthStore((state) => state.logout);

  // Filter items by user role
  const visibleItems = NAV_ITEMS.filter((item) =>
    item.allowedRoles.some((role) => roles.includes(role))
  );

  const primaryItems = visibleItems.filter((i) => i.section === 'primary' && i.id !== 'projects');
  const secondaryItems = visibleItems.filter((i) => i.section !== 'primary');

  const renderNavButton = (item: NavItemConfig) => {
    const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
    const isActive = currentPath === item.href;

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.href)}
        className={cn(
          'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all select-none',
          isActive
            ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-500/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white')} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {!isCollapsed && item.badge && (
          <span
            className={cn(
              'ml-auto rounded px-1.5 py-0.5 text-[10px] font-mono',
              isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
            )}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card transition-all duration-200 select-none z-30',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 hover:opacity-90 text-left"
            title="Go to SkillForge Home"
          >
            <SkillForgeLogo size="sm" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/')}
            className="mx-auto hover:opacity-90"
            title="Go to SkillForge Home"
          >
            <SkillForgeLogo size="sm" showText={false} />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Primary Items */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Learning & Progress
            </span>
          )}
          {primaryItems.map(renderNavButton)}
        </div>

        {/* Secondary Items */}
        {secondaryItems.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-border/50">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                More Tools
              </span>
            )}
            {secondaryItems.map(renderNavButton)}
          </div>
        )}
      </div>

      {/* User Avatar & Logout Footer */}
      <div className="border-t border-border p-3 bg-surface/50">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 shrink-0 rounded-full border border-border bg-secondary flex items-center justify-center font-mono font-bold text-xs text-foreground">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RS'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-foreground">
                  {user?.name || 'Rahul Sharma'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate font-mono">
                  {roles.join(', ') || 'LEARNER'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center font-mono font-bold text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RS'}
            </div>
            <button
              onClick={logout}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
