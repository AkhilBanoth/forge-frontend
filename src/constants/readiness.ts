import type { ReadinessLevel } from '../types/readiness';
import type { VerificationStatus, SkillLevel } from '../types/skills';

export interface ReadinessThresholdConfig {
  min: number;
  max: number;
  level: ReadinessLevel;
  label: string;
  description: string;
  tierIndex: number; // 0 to 4
}

export const READINESS_THRESHOLDS: ReadinessThresholdConfig[] = [
  {
    min: 0,
    max: 39,
    level: 'FOUNDATION_REQUIRED',
    label: 'Foundation Required',
    description: 'Core concepts need strengthening before entering assessment pipelines.',
    tierIndex: 0,
  },
  {
    min: 40,
    max: 59,
    level: 'DEVELOPING',
    label: 'Developing',
    description: 'Foundational competence established; undergoing verification across key areas.',
    tierIndex: 1,
  },
  {
    min: 60,
    max: 74,
    level: 'JUNIOR_READY',
    label: 'Junior Ready',
    description: 'Demonstrated proficiency in core backend capabilities. Ready for junior-level roles.',
    tierIndex: 2,
  },
  {
    min: 75,
    max: 89,
    level: 'STRONG_CANDIDATE',
    label: 'Strong Candidate',
    description: 'Consistently verified across complex architectural topics and projects.',
    tierIndex: 3,
  },
  {
    min: 90,
    max: 100,
    level: 'HIGHLY_READY',
    label: 'Highly Ready',
    description: 'Comprehensive mastery verified through mentor reviews and strict technical evaluations.',
    tierIndex: 4,
  },
];

export const READINESS_WEIGHTS = {
  technicalSkills: 0.35, // 35%
  assessments: 0.25,     // 25%
  projects: 0.25,        // 25%
  interviewPrep: 0.15,   // 15%
} as const;

export const ADVISORY_DISCLAIMERS = {
  defaultJuniorPython: 'Based on your SkillForge data, you appear ready for junior Python backend roles.',
  mostlySelfDeclaredNotice: 'Based mostly on self-declared skills. Take assessments to improve accuracy.',
  advisoryFooter: 'Readiness scores represent observed performance on SkillForge assessments and mentor-reviewed projects. Career outcomes depend on external market conditions and employer requirements.',
  noGuaranteeRule: 'SkillForge provides objective skill verification; scores do not constitute job guarantees or employment warranties.',
} as const;

export interface SkillUpgradeStep {
  step: number;
  id: 'course' | 'assessment' | 'project' | 'verification';
  label: string;
  sublabel: string;
}

export const SKILL_UPGRADE_STEPS: SkillUpgradeStep[] = [
  {
    step: 1,
    id: 'course',
    label: '1. Learn',
    sublabel: 'Course & Concepts',
  },
  {
    step: 2,
    id: 'assessment',
    label: '2. Assess',
    sublabel: 'Timed Technical Quiz',
  },
  {
    step: 3,
    id: 'project',
    label: '3. Build',
    sublabel: 'Real-world Project',
  },
  {
    step: 4,
    id: 'verification',
    label: '4. Verify',
    sublabel: 'Mentor Code Review',
  },
];

export interface VerificationStatusConfig {
  status: VerificationStatus;
  label: string;
  description: string;
  badgeStyle: 'dashed' | 'thin-solid' | 'filled-gray' | 'solid-black';
  iconName: string;
}

export const VERIFICATION_CONFIG: Record<VerificationStatus, VerificationStatusConfig> = {
  SELF_DECLARED: {
    status: 'SELF_DECLARED',
    label: 'Self-Declared',
    description: 'Claimed by learner. Not yet validated by SkillForge testing.',
    badgeStyle: 'dashed',
    iconName: 'HelpCircle',
  },
  ASSESSED: {
    status: 'ASSESSED',
    label: 'Assessed',
    description: 'Validated via timed objective technical assessment.',
    badgeStyle: 'thin-solid',
    iconName: 'Clock',
  },
  PROJECT_VERIFIED: {
    status: 'PROJECT_VERIFIED',
    label: 'Project-Verified',
    description: 'Demonstrated in production-like codebase under mentor inspection.',
    badgeStyle: 'filled-gray',
    iconName: 'FolderCheck',
  },
  VERIFIED: {
    status: 'VERIFIED',
    label: 'Verified',
    description: 'Fully certified through assessment, code review, and rubric criteria.',
    badgeStyle: 'solid-black',
    iconName: 'CheckCircle2',
  },
};

export const SKILL_LEVEL_ORDER: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};
