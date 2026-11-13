import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { assessmentService, roadmapService } from '../../lib/api/services';
import type { Assessment, Course, RoadmapPhase } from '../../types';
import { BookOpen, Plus, Save, ChevronDown, ChevronRight, CheckSquare } from 'lucide-react';

export function AdminCoursesPage() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState<string>('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [targetPhaseId, setTargetPhaseId] = useState('');

  useEffect(() => {
    Promise.all([roadmapService.getRoadmap(), assessmentService.getAssessments()]).then(
      ([rRes, aRes]) => {
        setPhases(rRes.data);
        setAssessments(aRes.data);
        if (rRes.data.length > 0) {
          setTargetPhaseId(rRes.data[0].id);
          const firstCourse = rRes.data[0].courses[0];
          if (firstCourse) setExpandedCourseId(firstCourse.id);
        }
        setLoading(false);
      }
    );
  }, []);

  const persistPhases = async (next: RoadmapPhase[], msg: string) => {
    setPhases(next);
    await roadmapService.saveRoadmapPhases(next);
    showToast('success', msg);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !targetPhaseId) return;
    const phase = phases.find((p) => p.id === targetPhaseId);
    if (!phase) return;

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      title: newCourseTitle.trim(),
      description: 'Structured curriculum module with practical coding exercises.',
      skillId: phase.skill.id,
      skill: phase.skill,
      skillLevelUnlocked: phase.unlocksLevel,
      modules: [
        {
          id: `mod_${Date.now()}`,
          courseId: `crs_${Date.now()}`,
          title: 'Module 1: Core Foundations',
          order: 1,
          lessons: [
            {
              id: `les_${Date.now()}`,
              moduleId: `mod_${Date.now()}`,
              title: 'Lesson 1: Architecture Overview',
              durationMinutes: 20,
              status: 'NOT_STARTED',
              order: 1,
              contentMarkdown: 'Overview of concepts and practical engineering conventions.',
            },
          ],
        },
      ],
      requiredQuizId: assessments[0]?.id,
      isEnrolled: true,
      progressPercentage: 0,
      isCompleted: false,
      totalLessons: 1,
      completedLessons: 0,
    };

    const next = phases.map((p) =>
      p.id === targetPhaseId ? { ...p, courses: [...p.courses, newCourse] } : p
    );
    setNewCourseTitle('');
    setExpandedCourseId(newCourse.id);
    await persistPhases(next, `Added course "${newCourse.title}".`);
  };

  const handleAddLesson = async (phaseId: string, courseId: string, moduleId: string) => {
    if (!newLessonTitle.trim()) return;
    const next = phases.map((p) => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        courses: p.courses.map((c) => {
          if (c.id !== courseId) return c;
          const updatedModules = c.modules.map((m) => {
            if (m.id !== moduleId) return m;
            return {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: `les_${Date.now()}`,
                  moduleId: m.id,
                  title: newLessonTitle.trim(),
                  durationMinutes: 15,
                  status: 'NOT_STARTED' as const,
                  order: m.lessons.length + 1,
                  contentMarkdown: 'Interactive lesson content.',
                },
              ],
            };
          });
          return {
            ...c,
            modules: updatedModules,
            totalLessons: c.totalLessons + 1,
          };
        }),
      };
    });
    setNewLessonTitle('');
    await persistPhases(next, 'Added new lesson to module.');
  };

  const handleQuizLink = async (phaseId: string, courseId: string, quizId: string) => {
    const next = phases.map((p) =>
      p.id !== phaseId
        ? p
        : {
            ...p,
            courses: p.courses.map((c) =>
              c.id !== courseId ? c : { ...c, requiredQuizId: quizId || undefined }
            ),
          }
    );
    await persistPhases(next, 'Updated required quiz for course.');
  };

  if (loading) {
    return <LoadingState message="Loading courses, modules, and lessons..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses, Modules, Lessons & Quizzes"
        description="Manage the full curriculum hierarchy: Phases > Courses > Modules > Lessons > Required Quizzes."
      />

      {/* Add Course Bar */}
      <form
        onSubmit={handleAddCourse}
        className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
      >
        <div className="space-y-1 sm:w-64">
          <label className="text-xs font-semibold text-foreground">Roadmap Phase</label>
          <select
            value={targetPhaseId}
            onChange={(e) => setTargetPhaseId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          >
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                Phase {p.order}: {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-foreground">New Course Title</label>
          <input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="e.g., Production Kubernetes & Service Mesh"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Course</span>
        </button>
      </form>

      {/* Curriculum Hierarchy */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-surface px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] font-bold text-primary">
                  Phase {phase.order} · {phase.skill.name}
                </div>
                <h2 className="text-base font-bold text-foreground">{phase.title}</h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {phase.courses.length} course(s)
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {phase.courses.map((course) => {
                const isExpanded = expandedCourseId === course.id;
                return (
                  <div key={course.id} className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCourseId(isExpanded ? '' : course.id)
                        }
                        className="flex items-center gap-2.5 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <BookOpen className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-foreground">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.modules.length} module(s) · {course.totalLessons} lesson(s)
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 text-xs">
                        <CheckSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Quiz:</span>
                        <select
                          value={course.requiredQuizId || ''}
                          onChange={(e) =>
                            handleQuizLink(phase.id, course.id, e.target.value)
                          }
                          className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                        >
                          <option value="">No linked quiz</option>
                          {assessments.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pl-6 space-y-4 border-l border-border ml-2">
                        {course.modules.map((mod) => (
                          <div key={mod.id} className="rounded-lg border border-border bg-background p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-foreground">{mod.title}</h3>
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {mod.lessons.length} lessons
                              </span>
                            </div>
                            <ul className="space-y-1.5 text-xs">
                              {mod.lessons.map((les) => (
                                <li
                                  key={les.id}
                                  className="flex items-center justify-between rounded bg-surface px-3 py-1.5"
                                >
                                  <span className="text-foreground">{les.title}</span>
                                  <span className="font-mono text-[11px] text-muted-foreground">
                                    {les.durationMinutes} min
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex gap-2 pt-1">
                              <input
                                type="text"
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                placeholder="New lesson title..."
                                className="flex-1 rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddLesson(phase.id, course.id, mod.id)}
                                className="inline-flex items-center gap-1 rounded bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Save className="h-3 w-3" />
                                <span>Add Lesson</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
