import React from 'react';
import type { ReadinessLevel } from '../../types';
import { READINESS_THRESHOLDS } from '../../constants';
import { cn } from '../../lib/utils';
import { Shield, Sparkles } from 'lucide-react';

export interface ReadinessBadgeProps {
  level: ReadinessLevel;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
  className?: string;
}

export function ReadinessBadge({
  level,
  size = 'md',
  showTier = false,
  className,
}: ReadinessBadgeProps) {
  const config =
    READINESS_THRESHOLDS.find((t) => t.level === level) || READINESS_THRESHOLDS[0];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  // Progressive color hierarchy from developing amber to highly ready emerald
  const tierStyles: Record<ReadinessLevel, string> = {
    FOUNDATION_REQUIRED: 'border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 font-normal',
    DEVELOPING: 'border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 font-medium',
    JUNIOR_READY: 'border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 font-semibold',
    STRONG_CANDIDATE: 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold',
    HIGHLY_READY: 'bg-emerald-600 text-white border border-emerald-600 shadow-xs shadow-emerald-500/20 font-extrabold dark:bg-emerald-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded select-none font-mono uppercase tracking-wider transition-colors',
        sizeClasses,
        tierStyles[level],
        className
      )}
      title={config.description}
    >
      {level === 'HIGHLY_READY' && <Sparkles size={size === 'sm' ? 10 : 12} />}
      {level !== 'HIGHLY_READY' && <Shield size={size === 'sm' ? 10 : 12} />}
      <span>{config.label}</span>
      {showTier && <span className="opacity-70">· TIER {config.tierIndex + 1}</span>}
    </span>
  );
}
