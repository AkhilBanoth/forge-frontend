export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type VerificationStatus =
  | 'SELF_DECLARED'
  | 'ASSESSED'
  | 'PROJECT_VERIFIED'
  | 'VERIFIED';

export type SkillCategory =
  | 'Programming'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'Testing'
  | 'Architecture';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
  level: SkillLevel;
  verificationStatus: VerificationStatus;
  expiresAt?: string;
  verifiedAt?: string;
  assessedScore?: number;
}

export type SkillGapSeverity = 'CRITICAL' | 'SECONDARY';
export type GapMagnitude = 'NONE' | 'MEDIUM' | 'HIGH';

export interface SkillGap {
  skill: Skill;
  current: SkillLevel | null;
  required: SkillLevel;
  gap: GapMagnitude;
  severity: SkillGapSeverity;
  roadmapCourseId?: string;
  roadmapPhaseId?: string;
}

export interface CareerRequirement {
  skillId: string;
  skill: Skill;
  requiredLevel: SkillLevel;
  importance: 'CRITICAL' | 'SECONDARY' | 'OPTIONAL';
  weightPercentage?: number;
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  category: string;
  targetScore: number;
  requirements: CareerRequirement[];
  averageSalary?: string;
}

export interface CareerMatch {
  careerId: string;
  role: CareerRole;
  matchPercentage: number;
  readinessLevel: string;
  criticalGapsCount: number;
  secondaryGapsCount: number;
}
