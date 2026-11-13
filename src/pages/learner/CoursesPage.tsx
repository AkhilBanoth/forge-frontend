import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { roadmapService } from '../../lib/api/services';
import type { Course, RoadmapPhase } from '../../types';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight } from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (path: string) => void;
}

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roadmapService.getRoadmap().then((res) => {
      setPhases(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState message="Loading your courses and lessons..." />;
  }

  const allCourses: Array<{ phaseTitle: string; phaseStatus: RoadmapPhase['status']; course: Course }> =
    phases.flatMap((p) =>
      p.courses.map((course) => ({ phaseTitle: p.title, phaseStatus: p.status, course }))
    );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses & Lesson Progress"
        description="Track every course, module, and lesson. Remember: completing at least 80% of courses is required alongside quiz and project scores for certificates."
        actions={
          <button
            type="button"
            onClick={() => onNavigate('/app/roadmap')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <span>Open Full Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {allCourses.map(({ phaseTitle, phaseStatus, course }) => {
          const isLocked = phaseStatus === 'LOCKED';
          const isCompleted = course.isCompleted;
          const firstLesson = course.modules[0]?.lessons[0];
          const nextUnfinishedLesson =
            course.modules.flatMap((m) => m.lessons).find((l) => l.status !== 'COMPLETED') ||
            firstLesson;

          return (
            <div
              key={course.id}
              className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{phaseTitle}</span>
                  <span className="font-mono font-bold text-foreground">
                    {course.progressPercentage}% complete
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary shrink-0">
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{course.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  {course.modules.map((mod) => {
                    const done = mod.lessons.filter((l) => l.status === 'COMPLETED').length;
                    return (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between text-xs text-muted-foreground"
                      >
                        <span className="text-foreground font-medium truncate pr-3">
                          {mod.title}
                        </span>
                        <span className="font-mono tabular-nums shrink-0">
                          {done}/{mod.lessons.length} lessons
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-muted-foreground">
                  {course.completedLessons}/{course.totalLessons} lessons · {phaseStatus}
                </span>
                {nextUnfinishedLesson && !isLocked ? (
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate(`/app/courses/${course.id}/lessons/${nextUnfinishedLesson.id}`)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>{isCompleted ? 'Review Lessons' : 'Continue Lesson'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('/app/quizzes')}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Pass Prerequisite First
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
