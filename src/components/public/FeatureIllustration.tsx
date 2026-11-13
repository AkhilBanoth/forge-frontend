import React, { useId } from 'react';
import {
  Code2,
  Database,
  ShieldCheck,
  Terminal,
  Server,
  GitBranch,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type FeatureIllustrationVariant = 'assessment-flow' | 'readiness-grid';

export interface FeatureIllustrationProps {
  variant: FeatureIllustrationVariant;
  title?: string;
  subtitle?: string;
  className?: string;
}

const FLOW_NODES = [
  { label: 'Skill Map', sub: 'Target Gap Check', icon: Code2 },
  { label: 'Timed Test', sub: 'Objective Score', icon: Terminal },
  { label: 'Code Review', sub: '8-Point Rubric', icon: GitBranch },
  { label: 'Readiness', sub: 'Verified Proof', icon: ShieldCheck },
];

const DOMAIN_NODES = [
  { name: 'Backend APIs', icon: Server },
  { name: 'Databases', icon: Database },
  { name: 'Auth & Security', icon: ShieldCheck },
  { name: 'Testing & CI', icon: Terminal },
  { name: 'Clean Code', icon: Code2 },
  { name: 'Git Workflow', icon: GitBranch },
];

/**
 * Reusable minimalist technical illustration rendering SVG geometric grids,
 * connector vectors, and technical domain icons for SkillForge public pages.
 */
export function FeatureIllustration({
  variant,
  title,
  subtitle,
  className,
}: FeatureIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const dotPatternId = `sf-dot-grid-${uid}`;
  const linePatternId = `sf-line-grid-${uid}`;

  if (variant === 'assessment-flow') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-border bg-card p-6',
          className
        )}
        aria-label={title || 'Technical illustration of skill assessment workflow'}
      >
        {/* Geometric SVG Dot Grid */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-border/70"
          aria-hidden="true"
        >
          <defs>
            <pattern id={dotPatternId} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${dotPatternId})`} />
        </svg>

        {(title || subtitle) && (
          <div className="relative z-10 mb-5 space-y-1">
            {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="relative z-10 grid gap-4 sm:grid-cols-4 items-center">
          {FLOW_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.label}
                className="relative flex items-center gap-3 rounded-lg border border-border bg-background/95 p-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">{node.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{node.sub}</div>
                </div>
                {idx < FLOW_NODES.length - 1 && (
                  <svg
                    className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-primary z-20"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-7',
        className
      )}
      aria-label={title || 'Technical icon grid illustrating readiness evaluation signals'}
    >
      {/* Geometric SVG Orthographic Grid */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-border/60"
        aria-hidden="true"
      >
        <defs>
          <pattern id={linePatternId} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${linePatternId})`} />
      </svg>

      {(title || subtitle) && (
        <div className="relative z-10 mb-5 space-y-1">
          {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DOMAIN_NODES.map((dom) => {
            const Icon = dom.icon;
            return (
              <div
                key={dom.name}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-background/95 px-3.5 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-foreground">{dom.name}</span>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-5 flex items-center gap-4 rounded-xl border border-primary/30 bg-background/95 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Award className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Evidence-Based Readiness</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Six core engineering domains combine with timed quizzes and mentor reviews into one transparent score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
