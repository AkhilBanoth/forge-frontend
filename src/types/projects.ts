import type { Skill } from './skills';

export type ProjectStatus =
  | 'NOT_STARTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PASSED'
  | 'REJECTED';

export interface ProjectRubricItem {
  criteria: string;
  maxPoints: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  targetSkill: Skill;
  requiredSkills: string[];
  requirementsChecklist: string[];
  estimatedHours: number;
  status: ProjectStatus;
  rubric: ProjectRubricItem[];
  repositoryTemplateUrl?: string;
}

export interface ProjectReviewScore {
  codeQuality: number; // /10
  apiDesign: number; // /10
  databaseDesign: number; // /10
  auth: number; // /10
  testing: number; // /10
  errorHandling: number; // /10
  documentation: number; // /10
  deployment: number; // /10
}

export interface ProjectReview {
  id: string;
  submissionId: string;
  reviewerName: string;
  scores: ProjectReviewScore;
  totalScore: number;
  maxScore: number;
  feedbackText: string;
  passed: boolean;
  reviewedAt: string;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  learnerId: string;
  learnerName?: string;
  learnerEmail?: string;
  targetRole?: string;
  githubRepoUrl: string;
  liveDemoUrl?: string;
  description: string;
  technologiesUsed: string[];
  submittedAt: string;
  status: ProjectStatus;
  review?: ProjectReview;
}
