import React from 'react';
import type { VerificationStatus } from '../../types';
import { VERIFICATION_CONFIG } from '../../constants';
import { Check, Clock, FolderCheck, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function VerificationBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: VerificationBadgeProps) {
  const config = VERIFICATION_CONFIG[status] || VERIFICATION_CONFIG.SELF_DECLARED;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  // Color styling based on reference palette (emerald, indigo, blue, amber)
  const styleClasses = {
    SELF_DECLARED: 'border border-dashed border-amber-500/80 text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20',
    ASSESSED: 'border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/30 font-medium',
    PROJECT_VERIFIED: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium',
    VERIFIED: 'bg-emerald-500 text-white font-semibold shadow-xs shadow-emerald-500/20 border border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500',
  }[status];

  const renderIcon = () => {
    const iconSize = size === 'sm' ? 10 : size === 'md' ? 12 : 14;
    switch (status) {
      case 'VERIFIED':
        return <Check size={iconSize} strokeWidth={2.5} />;
      case 'PROJECT_VERIFIED':
        return <FolderCheck size={iconSize} strokeWidth={2} />;
      case 'ASSESSED':
        return <Clock size={iconSize} strokeWidth={2} />;
      case 'SELF_DECLARED':
      default:
        return <HelpCircle size={iconSize} strokeWidth={1.5} />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded select-none font-mono tracking-tight transition-colors',
        sizeClasses,
        styleClasses,
        className
      )}
      title={config.description}
    >
      {showIcon && renderIcon()}
      <span>{config.label}</span>
    </span>
  );
}
