import type { Skill, SkillLevel } from './skills';

export type QuestionType =
  | 'MCQ'
  | 'MULTI_SELECT'
  | 'TRUE_FALSE'
  | 'CODING'
  | 'SCENARIO';

export interface Question {
  id: string;
  assessmentId: string;
  prompt: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[]; // Indices of correct options
  explanation: string;
  codeSnippet?: string;
}

export interface Assessment {
  id: string;
  title: string;
  skillId: string;
  skill: Skill;
  targetLevel: SkillLevel;
  questionCount: number;
  timeLimitMinutes: number;
  passingScorePercentage: number; // e.g., 70
  previousScore?: number;
  previousPassed?: boolean;
  questions?: Question[];
}

export interface AssessmentAttempt {
  assessmentId: string;
  startedAt: string;
  timeRemainingSeconds: number;
  answers: Record<string, number[]>; // questionId -> selectedOptionIndices
  flaggedQuestionIds: string[];
}

export interface AssessmentQuestionReview {
  question: Question;
  selectedAnswers: number[];
  isCorrect: boolean;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  skill: Skill;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passingScorePercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  previousSkillLevel: SkillLevel | null;
  newVerifiedLevel: SkillLevel;
  newVerificationStatus: 'ASSESSED';
  nextRecommendedStep: string;
  questionReviews: AssessmentQuestionReview[];
}
