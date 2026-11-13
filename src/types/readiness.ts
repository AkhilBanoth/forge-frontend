export type ReadinessLevel =
  | 'FOUNDATION_REQUIRED'
  | 'DEVELOPING'
  | 'JUNIOR_READY'
  | 'STRONG_CANDIDATE'
  | 'HIGHLY_READY';

export interface ReadinessBreakdown {
  technicalSkills: number; // 35% weight
  assessments: number; // 25% weight
  projects: number; // 25% weight
  interviewPrep: number; // 15% weight
}

export interface ReadinessScore {
  overall: number; // 0 to 100
  level: ReadinessLevel;
  breakdown: ReadinessBreakdown;
  assessedSkillsCount: number;
  verifiedSkillsCount: number;
  totalRequiredSkills: number;
  isMostlySelfDeclared: boolean;
  advisorySummary: string;
  calculatedAt: string;
}

export interface ReadinessHistoryPoint {
  date: string; // e.g. "Aug 2026", "Sep 2026", "Oct 2026"
  score: number;
  level: ReadinessLevel;
}

export interface DomainSkillDetail {
  name: string;
  score: number;
  target: number;
  verified: boolean;
}

export interface DomainSkillMetric {
  domain: string;
  learnerScore: number;
  targetScore: number;
  cohortAvgScore: number;
  verifiedCount: number;
  totalSkills: number;
  gap: number;
  skills: DomainSkillDetail[];
}

export interface DomainRadarSnapshot {
  id: 'current' | 'baseline' | 'projected';
  label: string;
  description: string;
  metrics: DomainSkillMetric[];
}
