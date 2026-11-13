import React from 'react';
import { LucideIcon, Inbox, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-lg border border-border bg-card/50',
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
      <p className="text-xs font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border bg-card/50',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary mb-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center justify-center rounded bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to complete this request. Please verify your connection or try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border border-foreground/30 bg-card',
        className
      )}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-secondary mb-3">
        <AlertTriangle className="h-6 w-6 text-foreground" />
      </div>
      <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center rounded border border-foreground px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Retry Request
        </button>
      )}
    </div>
  );
}
