import type {
  AIMessage,
  Assessment,
  CareerRole,
  Certificate,
  DomainRadarSnapshot,
  DomainSkillMetric,
  LearnerProfile,
  ProjectSubmission,
  ReadinessLevel,
  ReadinessScore,
  RoadmapPhase,
  SkillLevel,
  UserSkill,
} from '../../types';
import { READINESS_THRESHOLDS, SKILL_LEVEL_ORDER } from '../../constants';
import {
  mockAssessments,
  mockCareers,
  mockCertificates,
  mockDomainRadarSnapshots,
  mockLearnerDossiers,
  mockProfile,
  mockReadinessHistory,
  mockReadinessScore,
  mockRoadmapPhases,
  mockSubmissions,
  mockUserSkills,
} from '../mocks/data';

export interface LearnerWorkspaceState {
  userId: string;
  userName: string;
  userEmail: string;
  isDemoSeed: boolean;
  profile: LearnerProfile;
  skills: UserSkill[];
  phases: RoadmapPhase[];
  assessments: Assessment[];
  submissions: ProjectSubmission[];
  certificates: Certificate[];
  aiMessages: AIMessage[];
  readinessHistory: Array<{ date: string; score: number; level: ReadinessLevel }>;
  practiceBonus: number;
}

const WORKSPACE_STORAGE_KEY = 'skillforge_user_workspaces_v1';
const memoryWorkspaces = new Map<string, LearnerWorkspaceState>();

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Ignore storage access errors in non-browser environments.
  }
  return null;
}

function loadAllPersistedWorkspaces(): Record<string, LearnerWorkspaceState> {
  const storage = getStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveWorkspace(ws: LearnerWorkspaceState): void {
  memoryWorkspaces.set(ws.userId, ws);
  const storage = getStorage();
  if (!storage) return;
  try {
    const all = loadAllPersistedWorkspaces();
    all[ws.userId] = ws;
    storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore quota/storage errors.
  }
}

export function clearMemoryWorkspaces(): void {
  memoryWorkspaces.clear();
}

export function createFreshRoadmapPhases(template: RoadmapPhase[] = mockRoadmapPhases): RoadmapPhase[] {
  const cloned = deepClone(template);
  return cloned.map((phase, idx) => ({
    ...phase,
    isLocked: idx > 0 && Boolean(phase.prerequisites?.length),
    courses: phase.courses.map((course) => ({
      ...course,
      completedLessons: 0,
      progressPercentage: 0,
      modules: course.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((lesson) => ({
          ...lesson,
          status: 'NOT_STARTED' as const,
        })),
      })),
    })),
  }));
}

export function createFreshAssessments(template: Assessment[] = mockAssessments): Assessment[] {
  return deepClone(template).map((a) => ({
    ...a,
    previousScore: undefined,
    previousPassed: undefined,
  }));
}

export function getReadinessLevelFromScore(score: number): ReadinessLevel {
  const matched = READINESS_THRESHOLDS.find((t) => score >= t.min && score <= t.max);
  if (matched) return matched.level;
  if (score >= 90) return 'HIGHLY_READY';
  if (score >= 75) return 'STRONG_CANDIDATE';
  if (score >= 60) return 'JUNIOR_READY';
  if (score >= 40) return 'DEVELOPING';
  return 'FOUNDATION_REQUIRED';
}

export function getCurrentMonthLabel(): string {
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
}

export function createWelcomeAIMessage(userName: string, careerTitle: string): AIMessage {
  const firstName = userName.trim().split(/\s+/)[0] || 'there';
  return {
    id: `msg_welcome_${Date.now()}`,
    sender: 'assistant',
    type: 'text',
    content: `Welcome to SkillForge, ${firstName}! I'm your AI Career Mentor for the ${careerTitle} track.\n\nComplete your roadmap lessons, pass timed assessments (≥70%), and submit capstone projects to build your verified readiness score. Ask me "What should I do next?", "Analyze my weak areas", or "Practice quiz" anytime!`,
    timestamp: new Date().toISOString(),
  };
}

export function buildWorkspaceForUser(params: {
  userId: string;
  userName: string;
  userEmail: string;
  targetCareerId?: string;
  isProfileComplete?: boolean;
  careers?: CareerRole[];
}): LearnerWorkspaceState {
  const careers = params.careers || mockCareers;

  // 1. Pre-seeded Rahul Sharma demo learner preserves the rich demo state
  if (params.userId === 'usr_rahul_01') {
    const rahulSubmissions = deepClone(mockSubmissions).filter(
      (s) => s.learnerId === 'usr_rahul_01'
    );
    const rahulCerts = deepClone(mockCertificates).filter(
      (c) => c.learnerName.toLowerCase().includes('rahul')
    );
    return {
      userId: 'usr_rahul_01',
      userName: 'Rahul Sharma',
      userEmail: 'rahul.sharma@skillforge.io',
      isDemoSeed: true,
      profile: deepClone(mockProfile),
      skills: deepClone(mockUserSkills),
      phases: deepClone(mockRoadmapPhases),
      assessments: deepClone(mockAssessments),
      submissions: rahulSubmissions,
      certificates: rahulCerts,
      aiMessages: deepClone(mockLearnerDossiers.usr_rahul_01?.aiHistory || []),
      readinessHistory: deepClone(mockReadinessHistory),
      practiceBonus: 0,
    };
  }

  // 2. Other pre-seeded demo dossiers (Elena Rostova, Marcus Chen)
  const dossier = mockLearnerDossiers[params.userId];
  if (dossier) {
    const matchedCareer =
      careers.find((c) => c.title.toLowerCase() === dossier.targetCareer.toLowerCase()) ||
      careers[0];
    return {
      userId: params.userId,
      userName: dossier.name,
      userEmail: dossier.email,
      isDemoSeed: false,
      profile: {
        userId: params.userId,
        targetCareerId: matchedCareer.id,
        isProfileComplete: true,
      },
      skills: deepClone(dossier.skills),
      phases: createFreshRoadmapPhases(),
      assessments: createFreshAssessments(),
      submissions: deepClone(dossier.projects),
      certificates: deepClone(dossier.certificates),
      aiMessages: deepClone(
        dossier.aiHistory.length > 0
          ? dossier.aiHistory
          : [createWelcomeAIMessage(dossier.name, matchedCareer.title)]
      ),
      readinessHistory: dossier.readinessHistory.map((pt) => ({
        date: pt.date,
        score: pt.score,
        level: getReadinessLevelFromScore(pt.score),
      })),
      practiceBonus: 0,
    };
  }

  // 3. Brand-new registered learner starts with a clean, isolated workspace
  const targetCareerId = params.targetCareerId || careers[0]?.id || 'career_py_backend';
  const targetCareer = careers.find((c) => c.id === targetCareerId) || careers[0];
  return {
    userId: params.userId,
    userName: params.userName,
    userEmail: params.userEmail,
    isDemoSeed: false,
    profile: {
      userId: params.userId,
      targetCareerId,
      isProfileComplete: Boolean(params.isProfileComplete),
    },
    skills: [],
    phases: createFreshRoadmapPhases(),
    assessments: createFreshAssessments(),
    submissions: [],
    certificates: [],
    aiMessages: [createWelcomeAIMessage(params.userName, targetCareer?.title || 'Software Engineer')],
    readinessHistory: [
      {
        date: getCurrentMonthLabel(),
        score: 0,
        level: 'FOUNDATION_REQUIRED',
      },
    ],
    practiceBonus: 0,
  };
}

export function getOrCreateWorkspace(params: {
  userId: string;
  userName?: string;
  userEmail?: string;
  targetCareerId?: string;
  isProfileComplete?: boolean;
  careers?: CareerRole[];
}): LearnerWorkspaceState {
  const existingMem = memoryWorkspaces.get(params.userId);
  if (existingMem) return existingMem;

  const persistedAll = loadAllPersistedWorkspaces();
  const persisted = persistedAll[params.userId];
  if (persisted) {
    memoryWorkspaces.set(params.userId, persisted);
    return persisted;
  }

  const created = buildWorkspaceForUser({
    userId: params.userId,
    userName: params.userName || 'Learner',
    userEmail: params.userEmail || '',
    targetCareerId: params.targetCareerId,
    isProfileComplete: params.isProfileComplete,
    careers: params.careers,
  });
  saveWorkspace(created);
  return created;
}

export function computeReadinessScoreForWorkspace(
  ws: LearnerWorkspaceState,
  targetCareer: CareerRole
): ReadinessScore {
  const requirements = targetCareer.requirements || [];
  const totalRequiredSkills = requirements.length || 10;

  const verifiedSkillsCount = ws.skills.filter(
    (s) => s.verificationStatus !== 'SELF_DECLARED'
  ).length;

  // Preserve Rahul's canonical 72% baseline when on default career, plus any incremental gains
  if (ws.isDemoSeed && ws.profile.targetCareerId === 'career_py_backend') {
    const extraVerified = Math.max(0, verifiedSkillsCount - 7);
    const extraPassedProjects = Math.max(
      0,
      ws.submissions.filter((s) => s.status === 'PASSED').length - 1
    );
    const tech = Math.min(100, mockReadinessScore.breakdown.technicalSkills + ws.practiceBonus + extraVerified * 3);
    const assess = Math.min(
      100,
      ws.assessments.some((a) => a.previousScore === 93)
        ? Math.max(mockReadinessScore.breakdown.assessments, 85)
        : mockReadinessScore.breakdown.assessments
    );
    const proj = Math.min(100, mockReadinessScore.breakdown.projects + extraPassedProjects * 12);
    const interview = Math.min(100, mockReadinessScore.breakdown.interviewPrep + ws.practiceBonus * 2);
    const bonusDelta =
      Math.round(tech * 0.35 + assess * 0.25 + proj * 0.25 + interview * 0.15) -
      Math.round(78 * 0.35 + 81 * 0.25 + 76 * 0.25 + 48 * 0.15);
    const overall = Math.min(100, Math.max(0, mockReadinessScore.overall + bonusDelta));
    const level = getReadinessLevelFromScore(overall);
    const assessedSkillsCount = ws.skills.filter(
      (s) => typeof s.assessedScore === 'number' || s.verificationStatus !== 'SELF_DECLARED'
    ).length;
    return {
      overall,
      level,
      breakdown: {
        technicalSkills: tech,
        assessments: assess,
        projects: proj,
        interviewPrep: interview,
      },
      assessedSkillsCount,
      verifiedSkillsCount,
      totalRequiredSkills,
      isMostlySelfDeclared: false,
      calculatedAt: new Date().toISOString(),
      advisorySummary: mockReadinessScore.advisorySummary,
    };
  }

  // Dynamic calculation for all other learners
  const totalWeight =
    requirements.reduce((sum, r) => sum + (r.weightPercentage || 10), 0) || 100;

  let techPoints = 0;
  for (const req of requirements) {
    const weight = req.weightPercentage || Math.round(100 / totalRequiredSkills);
    const owned = ws.skills.find((us) => us.skillId === req.skillId);
    if (!owned) continue;

    const reqRank = SKILL_LEVEL_ORDER[req.requiredLevel] || 2;
    const curRank = SKILL_LEVEL_ORDER[owned.level] || 1;
    const levelRatio = Math.min(1, curRank / reqRank);

    if (owned.verificationStatus === 'SELF_DECLARED') {
      // Business Rule 1: Self-declared gives minimal exposure credit until verified
      techPoints += weight * 0.22 * levelRatio;
    } else if (owned.verificationStatus === 'ASSESSED') {
      const scoreFactor = owned.assessedScore ? owned.assessedScore / 100 : 0.78;
      techPoints += weight * Math.max(0.65, scoreFactor) * levelRatio;
    } else {
      // PROJECT_VERIFIED or VERIFIED
      techPoints += weight * levelRatio;
    }
  }

  // Give small bonus if user declared skills outside the target role requirements
  if (techPoints === 0 && ws.skills.length > 0) {
    techPoints = Math.min(18, ws.skills.length * 5);
  }

  const technicalSkills = Math.min(100, Math.round((techPoints / totalWeight) * 100) + ws.practiceBonus);

  const attemptedAssessments = ws.assessments.filter((a) => typeof a.previousScore === 'number');
  const assessments =
    attemptedAssessments.length > 0
      ? Math.round(
          attemptedAssessments.reduce((sum, a) => sum + (a.previousScore || 0), 0) /
            attemptedAssessments.length
        )
      : 0;

  const passedProjects = ws.submissions.filter((s) => s.status === 'PASSED').length;
  const pendingProjects = ws.submissions.filter((s) => s.status === 'UNDER_REVIEW').length;
  const projects = Math.min(100, passedProjects * 50 + pendingProjects * 20);

  const interviewPrep = Math.min(
    100,
    verifiedSkillsCount * 10 + attemptedAssessments.length * 10 + ws.practiceBonus * 5
  );

  const overall = Math.min(
    100,
    Math.round(
      technicalSkills * 0.35 + assessments * 0.25 + projects * 0.25 + interviewPrep * 0.15
    )
  );
  const level = getReadinessLevelFromScore(overall);

  let advisorySummary = `Based on your SkillForge data for ${targetCareer.title}, you are just getting started. Take timed quizzes and submit capstone projects to verify your skills.`;
  if (overall >= 75) {
    advisorySummary = `Based on your verified SkillForge assessments and projects, you are tracking as a Strong Candidate for ${targetCareer.title} roles.`;
  } else if (overall >= 60) {
    advisorySummary = `Based on your SkillForge scores, you appear ready for junior ${targetCareer.title} roles.`;
  } else if (overall >= 40) {
    advisorySummary = `You are making steady progress toward ${targetCareer.title}. Verify your remaining priority skills through quizzes and mentor-reviewed projects.`;
  }

  const assessedSkillsCount = ws.skills.filter(
    (s) => typeof s.assessedScore === 'number' || s.verificationStatus !== 'SELF_DECLARED'
  ).length;
  const isMostlySelfDeclared =
    ws.skills.length === 0 || verifiedSkillsCount < Math.ceil(ws.skills.length / 2);

  return {
    overall,
    level,
    breakdown: {
      technicalSkills,
      assessments,
      projects,
      interviewPrep,
    },
    assessedSkillsCount,
    verifiedSkillsCount,
    totalRequiredSkills,
    isMostlySelfDeclared,
    calculatedAt: new Date().toISOString(),
    advisorySummary,
  };
}

const REQUIRED_LEVEL_SCORE: Record<SkillLevel, number> = {
  Beginner: 40,
  Intermediate: 68,
  Advanced: 85,
  Expert: 95,
};

const SELF_DECLARED_SCORE: Record<SkillLevel, number> = {
  Beginner: 20,
  Intermediate: 35,
  Advanced: 48,
  Expert: 55,
};

const VERIFIED_LEVEL_SCORE: Record<SkillLevel, number> = {
  Beginner: 45,
  Intermediate: 74,
  Advanced: 88,
  Expert: 96,
};

export function computeDomainSnapshotsForWorkspace(
  ws: LearnerWorkspaceState,
  targetCareer: CareerRole
): DomainRadarSnapshot[] {
  if (ws.isDemoSeed && targetCareer.id === 'career_py_backend') {
    return mockDomainRadarSnapshots;
  }

  const domainMap = new Map<
    string,
    Array<{ name: string; score: number; target: number; verified: boolean }>
  >();

  const seenSkillIds = new Set<string>();

  for (const req of targetCareer.requirements) {
    seenSkillIds.add(req.skillId);
    const domain = req.skill.category;
    const owned = ws.skills.find((us) => us.skillId === req.skillId);
    let score = 0;
    if (owned) {
      if (typeof owned.assessedScore === 'number') {
        score = owned.assessedScore;
      } else if (owned.verificationStatus === 'SELF_DECLARED') {
        score = SELF_DECLARED_SCORE[owned.level] ?? 25;
      } else {
        score = VERIFIED_LEVEL_SCORE[owned.level] ?? 70;
      }
    }
    const target = REQUIRED_LEVEL_SCORE[req.requiredLevel] ?? 70;
    const verified = Boolean(owned && owned.verificationStatus !== 'SELF_DECLARED');
    const list = domainMap.get(domain) || [];
    list.push({ name: req.skill.name, score, target, verified });
    domainMap.set(domain, list);
  }

  for (const us of ws.skills) {
    if (seenSkillIds.has(us.skillId)) continue;
    const domain = us.skill.category;
    const score =
      typeof us.assessedScore === 'number'
        ? us.assessedScore
        : us.verificationStatus === 'SELF_DECLARED'
          ? SELF_DECLARED_SCORE[us.level] ?? 25
          : VERIFIED_LEVEL_SCORE[us.level] ?? 70;
    const verified = us.verificationStatus !== 'SELF_DECLARED';
    const list = domainMap.get(domain) || [];
    list.push({ name: us.skill.name, score, target: 70, verified });
    domainMap.set(domain, list);
  }

  const currentMetrics: DomainSkillMetric[] = Array.from(domainMap.entries()).map(
    ([domain, items]) => {
      const avgScore = Math.round(items.reduce((acc, i) => acc + i.score, 0) / items.length);
      const avgTarget = Math.round(items.reduce((acc, i) => acc + i.target, 0) / items.length);
      const verifiedCount = items.filter((i) => i.verified).length;
      return {
        domain,
        learnerScore: avgScore,
        targetScore: avgTarget,
        cohortAvgScore: Math.max(55, avgTarget - 8),
        verifiedCount,
        totalSkills: items.length,
        gap: avgTarget - avgScore,
        skills: items,
      };
    }
  );

  const baselineMetrics: DomainSkillMetric[] = currentMetrics.map((m) => {
    const score = Math.max(0, Math.round(m.learnerScore * 0.5));
    return {
      ...m,
      learnerScore: score,
      verifiedCount: 0,
      gap: m.targetScore - score,
    };
  });

  const projectedMetrics: DomainSkillMetric[] = currentMetrics.map((m) => {
    const score = Math.min(100, Math.max(m.learnerScore + 25, Math.min(m.targetScore, m.learnerScore + 35)));
    return {
      ...m,
      learnerScore: score,
      gap: m.targetScore - score,
    };
  });

  return [
    {
      id: 'current',
      label: 'Current Skills',
      description: `Your live domain profile for ${targetCareer.title} as of ${getCurrentMonthLabel()}.`,
      metrics: currentMetrics,
    },
    {
      id: 'baseline',
      label: 'Starting Baseline',
      description: `Initial starting benchmark before completing quizzes and capstone projects.`,
      metrics: baselineMetrics,
    },
    {
      id: 'projected',
      label: 'Next Goal (+30 Days)',
      description: `Projected readiness after completing your next roadmap modules and verification tests.`,
      metrics: projectedMetrics,
    },
  ];
}
