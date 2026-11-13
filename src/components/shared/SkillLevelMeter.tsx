import React from 'react';
import type { SkillLevel } from '../../types';
import { SKILL_LEVEL_ORDER } from '../../constants';
import { cn } from '../../lib/utils';

export interface SkillLevelMeterProps {
  level: SkillLevel | null;
  targetLevel?: SkillLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function SkillLevelMeter({
  level,
  targetLevel,
  showLabel = true,
  size = 'md',
  className,
}: SkillLevelMeterProps) {
  const currentCount = level ? SKILL_LEVEL_ORDER[level] : 0;
  const targetCount = targetLevel ? SKILL_LEVEL_ORDER[targetLevel] : null;

  const segmentHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((step) => {
          const isFilled = step <= currentCount;
          const isTarget = targetCount !== null && step <= targetCount && !isFilled;

          return (
            <div
              key={step}
              className={cn(
                'flex-1 rounded-sm transition-all',
                segmentHeight,
                isFilled
                  ? 'bg-indigo-600 dark:bg-indigo-500 shadow-xs shadow-indigo-500/20'
                  : isTarget
                  ? 'border border-dashed border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/20'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
              )}
              title={`Level ${step}/4: ${['Beginner', 'Intermediate', 'Advanced', 'Expert'][step - 1]}`}
            />
          );
        })}
      </div>
      {showLabel && (
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>{level || 'Not Started'}</span>
          {targetLevel && level !== targetLevel && (
            <span className="opacity-80">Req: {targetLevel}</span>
          )}
        </div>
      )}
    </div>
  );
}
