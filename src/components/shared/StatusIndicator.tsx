import React from 'react';
import { CheckCircle2, Circle, Clock, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type GeneralStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'LOCKED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PASSED'
  | 'REJECTED';

export interface StatusIndicatorProps {
  status: GeneralStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  size = 'md',
  className,
}: StatusIndicatorProps) {
  const iconSize = size === 'sm' ? 12 : 14;

  const getStatusDetails = () => {
    switch (status) {
      case 'COMPLETED':
      case 'PASSED':
        return {
          icon: <CheckCircle2 size={iconSize} strokeWidth={2.5} className="shrink-0" />,
          defaultLabel: status === 'PASSED' ? 'Passed' : 'Completed',
          classes: 'font-semibold text-foreground',
        };
      case 'IN_PROGRESS':
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return {
          icon: <Clock size={iconSize} strokeWidth={2} className="shrink-0" />,
          defaultLabel:
            status === 'IN_PROGRESS'
              ? 'In Progress'
              : status === 'SUBMITTED'
              ? 'Submitted'
              : 'Under Review',
          classes: 'font-medium text-foreground/90',
        };
      case 'LOCKED':
        return {
          icon: <Lock size={iconSize} strokeWidth={2} className="shrink-0" />,
          defaultLabel: 'Locked',
          classes: 'text-muted-foreground font-normal',
        };
      case 'REJECTED':
        return {
          icon: <AlertTriangle size={iconSize} strokeWidth={2} className="shrink-0" />,
          defaultLabel: 'Revision Required',
          classes: 'font-semibold text-foreground',
        };
      case 'NOT_STARTED':
      default:
        return {
          icon: <Circle size={iconSize} strokeWidth={1.5} className="shrink-0" />,
          defaultLabel: 'Not Started',
          classes: 'text-muted-foreground',
        };
    }
  };

  const details = getStatusDetails();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-xs select-none',
        details.classes,
        className
      )}
    >
      {details.icon}
      <span>{label || details.defaultLabel}</span>
    </span>
  );
}
