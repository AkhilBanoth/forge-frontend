import React from 'react';
import { SKILL_UPGRADE_STEPS } from '../../constants';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SkillUpgradeStepperProps {
  currentStepIndex: number; // 1 = Course, 2 = Assessment, 3 = Project, 4 = Verification
  className?: string;
}

export function SkillUpgradeStepper({
  currentStepIndex = 1,
  className,
}: SkillUpgradeStepperProps) {
  return (
    <div className={cn('w-full border border-border bg-card rounded-lg p-4', className)}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Skill Upgrade Pipeline: Course → Assessment → Project → Verification
        </span>
        <span className="text-xs font-mono font-medium shrink-0 whitespace-nowrap">
          Step {Math.min(4, Math.max(1, currentStepIndex))} of 4
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SKILL_UPGRADE_STEPS.map((step) => {
          const isDone = step.step < currentStepIndex;
          const isCurrent = step.step === currentStepIndex;
          const isPending = step.step > currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                'flex flex-col p-2.5 rounded border transition-colors',
                isDone
                  ? 'bg-secondary border-border text-foreground'
                  : isCurrent
                  ? 'border-2 border-foreground bg-card text-foreground'
                  : 'border-border/60 bg-transparent text-muted-foreground opacity-60'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase font-bold">
                  {step.label}
                </span>
                {isDone && <Check size={12} strokeWidth={2.5} />}
                {isCurrent && (
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                )}
              </div>
              <span className="text-xs font-medium line-clamp-1">{step.sublabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
