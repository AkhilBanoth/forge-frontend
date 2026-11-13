import type { Skill, SkillLevel } from './skills';

export type LessonStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'doc';
}

export interface PracticalExercise {
  prompt: string;
  starterCode?: string;
  solutionNotes?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  status: LessonStatus;
  order: number;
  videoUrl?: string;
  contentMarkdown: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  resources?: LessonResource[];
  practicalExercise?: PracticalExercise;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  skillId: string;
  skill: Skill;
  skillLevelUnlocked: SkillLevel;
  modules: Module[];
  requiredQuizId?: string;
  isEnrolled?: boolean;
  progressPercentage: number;
  isCompleted: boolean;
  totalLessons: number;
  completedLessons: number;
}

export type PhaseStatus = 'COMPLETED' | 'CURRENT' | 'AVAILABLE' | 'LOCKED';

export interface RoadmapPhase {
  id: string;
  order: number;
  title: string;
  skill: Skill;
  unlocksLevel: SkillLevel;
  prerequisites: string[]; // Skill IDs or titles required before unlocking
  status: PhaseStatus;
  lockReason?: string;
  courses: Course[];
}
