import React, { useState, useEffect } from 'react';
import { roadmapService } from '../../lib/api/services';
import type { RoadmapPhase, Course } from '../../types';
import { StatusIndicator } from '../shared/StatusIndicator';
import { VerificationBadge } from '../shared/VerificationBadge';
import { PageHeader } from '../shared/PageHeader';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RoadmapScreenProps {
  onNavigate: (path: string) => void;
}

export function RoadmapScreen({ onNavigate }: RoadmapScreenProps) {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string>('phase_docker');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await roadmapService.getRoadmap();
        setPhases(res.data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const toggleExpand = (phaseId: string) => {
    setExpandedPhaseId((prev) => (prev === phaseId ? '' : phaseId));
  };

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Target Career Learning Roadmap"
        description="A strict dependency-driven curriculum for Python Backend Engineers. Milestones unlock only when prerequisite foundations and technical tests are satisfied."
        badge={
          <span className="font-mono text-xs border border-foreground bg-card px-2 py-0.5 rounded font-bold">
            9 Phases · 1 In Progress
          </span>
        }
      />

      {/* Rules Notice */}
      <div className="rounded-lg border border-dashed border-border bg-surface p-4 text-xs font-mono text-muted-foreground flex items-center justify-between">
        <div>
          <span className="font-bold text-foreground uppercase">Readiness Principle: </span>
          Course completion alone does not equal job readiness. Each phase culminates in a timed assessment and a mentor-reviewed project.
        </div>
        <span className="text-[10px] uppercase font-bold border border-border px-1.5 py-0.5 rounded">
          Prerequisite Enforced
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:bottom-3 before:top-3 before:left-3 sm:before:left-4 before:w-0.5 before:bg-border">
        {phases.map((phase) => {
          const isCompleted = phase.status === 'COMPLETED';
          const isCurrent = phase.status === 'CURRENT';
          const isLocked = phase.status === 'LOCKED';
          const isExpanded = expandedPhaseId === phase.id;

          return (
            <div key={phase.id} className="relative group">
              {/* Timeline Node Marker */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-colors z-10',
                  isCompleted
                    ? 'border-foreground bg-foreground text-background'
                    : isCurrent
                    ? 'border-foreground bg-card text-foreground ring-4 ring-foreground/10'
                    : 'border-border bg-card text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : isLocked ? (
                  <Lock size={11} strokeWidth={2} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                )}
              </div>

              {/* Phase Card */}
              <div
                className={cn(
                  'rounded-xl border transition-all duration-200 overflow-hidden',
                  isCurrent
                    ? 'border-2 border-foreground bg-card shadow-sm'
                    : isLocked
                    ? 'border-border/60 bg-card/60 opacity-80'
                    : 'border-border bg-card hover:border-foreground/40'
                )}
              >
                {/* Phase Header */}
                <div
                  onClick={() => !isLocked && toggleExpand(phase.id)}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 cursor-pointer',
                    isLocked && 'cursor-not-allowed'
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground font-bold">
                        PHASE 0{phase.order}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <h2 className="text-base font-bold tracking-tight text-foreground">
                        {phase.title}
                      </h2>
                      {isCurrent && (
                        <span className="rounded bg-foreground px-2 py-0.5 text-[10px] font-mono font-bold text-background uppercase">
                          Current Focus
                        </span>
                      )}
                    </div>

                    {/* Prerequisites label */}
                    {phase.prerequisites.length > 0 && (
                      <div className="text-[11px] font-mono text-muted-foreground">
                        Requires:{' '}
                        <span className="font-medium text-foreground">
                          {phase.prerequisites.join(', ')}
                        </span>
                      </div>
                    )}

                    {isLocked && phase.lockReason && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono pt-1">
                        <Lock size={12} />
                        <span>{phase.lockReason}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono border border-border px-2 py-1 rounded bg-surface">
                      Unlocks: {phase.unlocksLevel}
                    </span>

                    {!isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(phase.id);
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Course Modules */}
                {isExpanded && !isLocked && phase.courses.length > 0 && (
                  <div className="border-t border-border bg-surface p-4 sm:p-6 space-y-4">
                    {phase.courses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-lg border border-border bg-card p-4 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                          <div>
                            <h3 className="font-bold text-sm text-foreground">
                              {course.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {course.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <span>
                              {course.completedLessons}/{course.totalLessons} Lessons ({course.progressPercentage}%)
                            </span>
                          </div>
                        </div>

                        {/* Dual Completion Checklist Condition Rule */}
                        <div className="rounded border border-dashed border-border p-3 text-xs bg-surface space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                            Course Verification Criteria (Both Mandatory):
                          </span>
                          <div className="grid gap-2 sm:grid-cols-2 font-mono text-[11px]">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded border',
                                  course.completedLessons === course.totalLessons
                                    ? 'bg-foreground border-foreground text-background'
                                    : 'border-border bg-card'
                                )}
                              >
                                {course.completedLessons === course.totalLessons && <Check size={10} />}
                              </span>
                              <span>All {course.totalLessons} Interactive Lessons Completed</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded border',
                                  course.isCompleted
                                    ? 'bg-foreground border-foreground text-background'
                                    : 'border-border bg-card'
                                )}
                              >
                                {course.isCompleted && <Check size={10} />}
                              </span>
                              <span>Passing Score (&ge;70%) on Timed Assessment</span>
                            </div>
                          </div>
                        </div>

                        {/* Lessons List in Course */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                            Module Lessons:
                          </span>
                          {course.modules.flatMap((m) => m.lessons).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2.5 rounded border border-border/60 bg-surface hover:bg-secondary/40 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <StatusIndicator status={lesson.status} size="sm" />
                                <span className="text-xs font-medium text-foreground">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-mono text-muted-foreground">
                                  {lesson.durationMinutes} min
                                </span>
                                <button
                                  onClick={() =>
                                    onNavigate(`/roadmap/${course.id}/lessons/${lesson.id}`)
                                  }
                                  className="rounded border border-foreground/30 px-2.5 py-1 text-xs font-mono hover:bg-foreground hover:text-background transition-colors"
                                >
                                  Open Lesson
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LessonViewerScreen({
  courseId,
  lessonId,
  onNavigate,
}: {
  courseId: string;
  lessonId: string;
  onNavigate: (path: string) => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const lesson = {
    id: lessonId || 'les_dock_01',
    title: 'Multi-Stage Dockerfile Architecture for Python Backends',
    durationMinutes: 25,
    videoUrl: 'https://skillforge.io/videos/docker_multistage.mp4',
    contentMarkdown: `### Architectural Rationale for Multi-Stage Builds

In professional backend environments, bloated container images introduce severe security vulnerabilities and slow down deployment rollouts. 

#### Core Engineering Directives:
1. **Builder Stage Isolation**: Keep compilation packages (like \`gcc\`, \`make\`, and development header libraries) inside the intermediate stage.
2. **Deterministic Layer Ordering**: Copy requirements definitions prior to copying application source files to maximize Docker layer cache hits.
3. **Least Privilege Principle**: Declare an explicit non-root service user (\`USER appuser\`) so execution has zero administrative root rights inside the container namespace.`,
    codeSnippet: {
      language: 'dockerfile',
      code: `# Multi-stage production container for FastAPI
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
COPY --from=builder /install /usr/local
COPY . /app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    },
    practicalExercise: {
      prompt: 'Modify this configuration to verify that a healthcheck probes /healthz with a 30s period.',
      solutionNotes: 'HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8000/healthz || exit 1',
    },
    resources: [
      { title: 'Docker Official Best Practices Guide', url: 'https://docs.docker.com', type: 'link' as const },
      { title: 'SkillForge Container Rubric Spec', url: 'https://skillforge.io/rubric.pdf', type: 'pdf' as const },
    ],
  };

  const handleCopyCode = () => {
    if (lesson.codeSnippet) {
      navigator.clipboard.writeText(lesson.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    await roadmapService.completeLesson(lesson.id);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <button
            onClick={() => onNavigate('/roadmap')}
            className="text-xs font-mono text-muted-foreground hover:text-foreground mb-1 block"
          >
            ← Back to Learning Roadmap
          </button>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{lesson.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={cn(
              'inline-flex items-center gap-2 rounded px-4 py-2 font-mono text-xs font-bold transition-all',
              isCompleted
                ? 'bg-secondary text-foreground border border-border cursor-default'
                : 'bg-foreground text-background hover:bg-foreground/90'
            )}
          >
            <Check size={14} strokeWidth={2.5} />
            <span>{isCompleted ? 'Marked Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Lesson Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Placeholder */}
          <div className="relative aspect-video rounded-lg border border-border bg-card flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            <PlayCircle className="h-12 w-12 text-foreground mb-2 opacity-80" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Technical Lecture: Container Construction
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Duration: {lesson.durationMinutes} minutes · Resolution 1080p
            </span>
          </div>

          {/* Markdown Content */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-bold text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Core Technical Specification
            </h2>
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap font-sans">
              {lesson.contentMarkdown}
            </div>
          </div>

          {/* Interactive Code Snippet with Copy */}
          {lesson.codeSnippet && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-xs font-mono">
                <span className="uppercase text-muted-foreground">{lesson.codeSnippet.language}</span>
                <button
                  onClick={handleCopyCode}
                  className="rounded border border-border px-2 py-0.5 text-[11px] hover:bg-secondary transition-colors"
                >
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto bg-surface/50 text-foreground">
                <code>{lesson.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Practical Exercise */}
          <div className="rounded-lg border-2 border-foreground bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Practical Applied Exercise
              </span>
              <span className="text-[10px] font-mono border border-border px-1.5 py-0.5 rounded">
                Hands-on Task
              </span>
            </div>
            <p className="text-xs text-foreground font-medium">
              {lesson.practicalExercise.prompt}
            </p>
            <details className="text-xs font-mono text-muted-foreground cursor-pointer pt-1">
              <summary className="hover:text-foreground">Reveal Solution Implementation</summary>
              <div className="mt-2 p-3 bg-card border border-border rounded font-mono text-[11px] text-foreground">
                {lesson.practicalExercise.solutionNotes}
              </div>
            </details>
          </div>
        </div>

        {/* Lesson Sidebar: Resources & Module Outline (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Resources */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-muted-foreground tracking-wider block">
              Reference Resources
            </span>
            <div className="space-y-2">
              {lesson.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded border border-border/80 hover:bg-secondary text-xs font-mono transition-colors"
                >
                  <span className="truncate pr-2">{res.title}</span>
                  <span className="uppercase text-[10px] text-muted-foreground border border-border px-1 rounded">
                    {res.type}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Module Lessons Nav */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-muted-foreground tracking-wider block">
              Module Outline
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded bg-foreground text-background font-bold flex items-center justify-between">
                <span>1. Multi-Stage Dockerfile</span>
                <span className="text-[10px]">Active</span>
              </div>
              <div className="p-2 rounded border border-border text-muted-foreground flex items-center justify-between hover:bg-secondary">
                <span>2. Docker Compose Stacks</span>
                <span className="text-[10px]">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
