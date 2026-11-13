import React from 'react';
import { cn } from '../../lib/utils';

export interface CircularProgressProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: number; // Outer diameter in pixels
  strokeWidth?: number;
  showPercentage?: boolean;
  valueFormatter?: (val: number) => string;
  className?: string;
  variant?: 'indigo' | 'emerald' | 'amber' | 'default';
}

export function CircularProgress({
  value,
  label,
  sublabel,
  size = 140,
  strokeWidth = 9,
  showPercentage = true,
  valueFormatter,
  className,
  variant = 'indigo',
}: CircularProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const displayValue = valueFormatter
    ? valueFormatter(clampedValue)
    : `${Math.round(clampedValue)}%`;

  const strokeColor = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    emerald: 'text-emerald-500 dark:text-emerald-400',
    amber: 'text-amber-500 dark:text-amber-400',
    default: 'text-indigo-600 dark:text-indigo-400',
  }[variant];

  return (
    <div
      className={cn('relative inline-flex flex-col items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform transition-all duration-300"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-100 dark:text-slate-800"
        />
        {/* Progress indicator circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className={cn(strokeColor, "transition-all duration-700 ease-out")}
        />
      </svg>

      {/* Center typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        {showPercentage && (
          <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
            {displayValue}
          </span>
        )}
        {label && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 line-clamp-1">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] text-muted-foreground opacity-80 mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
