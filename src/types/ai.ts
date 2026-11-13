export interface LearningPathStep {
  step: number;
  title: string;
  description: string;
  skillUnlocked: string;
  courseId?: string;
  estimatedHours: number;
  isUnlocked: boolean;
}

export interface PracticeQuestionItem {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillAnalysisBar {
  skill: string;
  score: number; // 0 to 100
  isWeakness: boolean;
  benchmarkScore: number;
}

export type AIMessage =
  | {
      id: string;
      sender: 'user' | 'assistant';
      type: 'text';
      content: string;
      timestamp: string;
    }
  | {
      id: string;
      sender: 'assistant';
      type: 'learning_path';
      content: string;
      steps: LearningPathStep[];
      timestamp: string;
    }
  | {
      id: string;
      sender: 'assistant';
      type: 'practice_questions';
      content: string;
      questions: PracticeQuestionItem[];
      timestamp: string;
    }
  | {
      id: string;
      sender: 'assistant';
      type: 'skill_analysis';
      content: string;
      strengths: SkillAnalysisBar[];
      weaknesses: SkillAnalysisBar[];
      timestamp: string;
    };

export interface QuickPrompt {
  id: string;
  label: string;
  action: 'learning_path' | 'practice_questions' | 'skill_analysis' | 'general';
  prompt: string;
}

export interface AIPracticeQuestion extends PracticeQuestionItem {
  skillId: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AIPracticeSubmissionResult {
  skillId: string;
  skillName: string;
  topic: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  gapUpdated: boolean;
  newGapLabel: 'NONE' | 'MEDIUM' | 'HIGH';
  readinessDelta: number;
  feedbackSummary: string;
}
