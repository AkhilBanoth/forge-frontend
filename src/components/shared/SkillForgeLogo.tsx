import React from 'react';
import { GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SkillForgeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function SkillForgeLogo({
  size = 'md',
  className,
  showText = true,
}: SkillForgeLogoProps) {
  const iconSizes = {
    sm: 'h-6 w-6 rounded-md',
    md: 'h-8 w-8 rounded-lg',
    lg: 'h-10 w-10 rounded-xl',
  }[size];

  const capSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'flex items-center justify-center bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 shrink-0 transition-transform hover:scale-105 rounded-xl',
          iconSizes
        )}
      >
        <GraduationCap className={capSizes} strokeWidth={2.4} />
      </div>
      {showText && (
        <span
          className={cn(
            'font-sans font-extrabold tracking-tight text-slate-900 dark:text-white lowercase',
            textSizes
          )}
        >
          skillforge
        </span>
      )}
    </div>
  );
}
