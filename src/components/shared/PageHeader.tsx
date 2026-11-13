import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-6 border-b border-border sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  sublabel,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-all duration-150',
        className
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-foreground" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold font-mono tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-mono text-muted-foreground font-medium">
            {trend}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{sublabel}</p>
      )}
    </div>
  );
}
