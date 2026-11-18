import { apiClient, USE_MOCKS } from './client';
import type {
  User,
  LearnerProfile,
  LoginCredentials,
  RegisterPayload,
  AuthResponse,
  Skill,
  UserSkill,
  CareerRole,
  SkillGap,
  RoadmapPhase,
  Assessment,
  AssessmentResult,
  Project,
  ProjectSubmission,
  ProjectReviewScore,
  Certificate,
  ReadinessScore,
  ReadinessLevel,
  CareerMatch,
  AIMessage,
  ApiEnvelope,
  DomainRadarSnapshot,
  AIPracticeQuestion,
  AIPracticeSubmissionResult,
  AuditLogEntry,
  ManagedUserRecord,
  MentorDirectoryRecord,
  SkillLevel,
} from '../../types';
import {
  mockUser,
  mockProfile,
  mockSkillsCatalog,
  mockUserSkills,
  mockCareers,
  mockRoadmapPhases,
  mockAssessments,
  mockAssessmentResult,
  mockProjects,
  mockSubmissions,
  mockCertificates,
  mockReadinessScore,
  mockReadinessHistory,
  mockDomainRadarSnapshots,
  mockManagedUsers,
  mockMentorsDirectory,
  mockAuditLogs,
  mockLearnerDossiers,
  mockAIPracticeBank,
  type LearnerDossier,
} from '../mocks/data';
import { SKILL_LEVEL_ORDER } from '../../constants';

function wrapResponse<T>(data: T, message = 'Success'): ApiEnvelope<T> {
  return {
    data,
    message,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

const DEMO_EMAILS = new Set([
  'rahul.sharma@skillforge.io',
  'marcus.vance@skillforge.io',
  'devon.h@skillforge.io',
]);

function isMockSessionActive(tokenOverride?: string | null): boolean {
  if (USE_MOCKS) return true;
  if (tokenOverride && tokenOverride.startsWith('mock_')) return true;
  try {
    const persisted = localStorage.getItem('skillforge_auth');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      const token: unknown = parsed?.state?.token;
      if (typeof token === 'string' && token.startsWith('mock_')) {
        return true;
      }
    }
  } catch {
    // Ignore localStorage errors.
  }
  return false;
}

// Live in-memory workspace state for interactive mock runtime
let liveSkillsCatalog: Skill[] = [...mockSkillsCatalog];
let liveUserSkills: UserSkill[] = [...mockUserSkills];
let liveCareers: CareerRole[] = JSON.parse(JSON.stringify(mockCareers));
let liveSubmissions: ProjectSubmission[] = JSON.parse(JSON.stringify(mockSubmissions));
let liveProjects: Project[] = JSON.parse(JSON.stringify(mockProjects));
let liveCertificates: Certificate[] = JSON.parse(JSON.stringify(mockCertificates));
let liveProfile: LearnerProfile = { ...mockProfile };
let livePhases: RoadmapPhase[] = JSON.parse(JSON.stringify(mockRoadmapPhases));
let liveAssessments: Assessment[] = JSON.parse(JSON.stringify(mockAssessments));
let liveAIMessages: AIMessage[] = [...mockAIMessagesFallback()];
let liveReadiness: ReadinessScore = JSON.parse(JSON.stringify(mockReadinessScore));
let liveReadinessHistory: Array<{ date: string; score: number; level: ReadinessLevel }> = [
  ...mockReadinessHistory,
];
let liveManagedUsers: ManagedUserRecord[] = JSON.parse(JSON.stringify(mockManagedUsers));
let liveMentors: MentorDirectoryRecord[] = JSON.parse(JSON.stringify(mockMentorsDirectory));
let liveAuditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(mockAuditLogs));
const liveDossiers: Record<string, LearnerDossier> = JSON.parse(JSON.stringify(mockLearnerDossiers));

let liveCertRules = {
  minCourseCompletion: 80,
  minQuizAverage: 70,
  minFinalAssessment: 70,
  requireProjectPassed: true,
  validityMonths: 12,
};

function mockAIMessagesFallback(): AIMessage[] {
  return mockLearnerDossiers.usr_rahul_01?.aiHistory || [];
}

function appendAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  liveAuditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
}

function computeGapsForCareer(career: CareerRole, skills: UserSkill[]): SkillGap[] {
  return career.requirements.map((req) => {
    const owned = skills.find((us) => us.skillId === req.skillId);
    const currentLvl = owned?.level || null;
    const reqRank = SKILL_LEVEL_ORDER[req.requiredLevel];
    const curRank = currentLvl ? SKILL_LEVEL_ORDER[currentLvl] : 0;
    const diff = reqRank - curRank;

    let gap: 'NONE' | 'MEDIUM' | 'HIGH' = 'NONE';
    if (!owned || diff >= 2) {
      gap = 'HIGH';
    } else if (diff === 1) {
      gap = 'MEDIUM';
    } else {
      gap = 'NONE';
    }

    return {
      skill: req.skill,
      current: currentLvl,
      required: req.requiredLevel,
      gap,
      severity: req.importance === 'CRITICAL' ? 'CRITICAL' : 'SECONDARY',
      roadmapCourseId: req.skillId === 'sk_docker' ? 'crs_docker_01' : undefined,
    };
  });
}

function computeCareerMatches(skills: UserSkill[]): CareerMatch[] {
  return liveCareers
    .map((career) => {
      const gaps = computeGapsForCareer(career, skills);
      const totalReqs = career.requirements.length || 1;
      const metScore = career.requirements.reduce((acc, req) => {
        const g = gaps.find((item) => item.skill.id === req.skillId);
        const weight = req.weightPercentage ?? Math.round(100 / totalReqs);
        if (!g || g.gap === 'NONE') return acc + weight;
        if (g.gap === 'MEDIUM') return acc + weight * 0.55;
        if (g.current) return acc + weight * 0.25;
        return acc;
      }, 0);
      const matchPercentage = Math.min(99, Math.max(20, Math.round(metScore)));
      const criticalGapsCount = gaps.filter((g) => g.gap !== 'NONE' && g.severity === 'CRITICAL').length;
      const secondaryGapsCount = gaps.filter((g) => g.gap !== 'NONE' && g.severity === 'SECONDARY').length;

      let readinessLevel = 'DEVELOPING';
      if (matchPercentage >= 90) readinessLevel = 'HIGHLY_READY';
      else if (matchPercentage >= 75) readinessLevel = 'STRONG_CANDIDATE';
      else if (matchPercentage >= 60) readinessLevel = 'JUNIOR_READY';
      else if (matchPercentage < 40) readinessLevel = 'FOUNDATION_REQUIRED';

      return {
        careerId: career.id,
        role: career,
        matchPercentage,
        readinessLevel,
        criticalGapsCount,
        secondaryGapsCount,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

const MOCK_USERS_STORAGE_KEY = 'skillforge_mock_users';

function loadPersistedMockUsers(): ManagedUserRecord[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePersistedMockUser(record: ManagedUserRecord) {
  try {
    const existing = loadPersistedMockUsers().filter(
      (u) => u.email.toLowerCase() !== record.email.toLowerCase()
    );
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify([record, ...existing]));
  } catch {
    // Ignore storage errors.
  }
}

function resolveMockUserFromToken(token?: string | null): User {
  if (!token) return mockUser;
  if (token.includes('admin')) {
    return {
      id: 'usr_admin_01',
      email: 'devon.h@skillforge.io',
      name: 'Devon Hayes',
      roles: ['ADMIN'],
      isActive: true,
      title: 'Platform Administrator',
      createdAt: '2025-11-20T08:00:00Z',
    };
  }
  if (token.includes('mentor')) {
    return {
      id: 'usr_mentor_01',
      email: 'marcus.vance@skillforge.io',
      name: 'Marcus Vance',
      roles: ['MENTOR'],
      isActive: true,
      title: 'Senior Backend Architect',
      createdAt: '2026-01-10T09:00:00Z',
    };
  }
  const allUsers = [...loadPersistedMockUsers(), ...liveManagedUsers];
  const matched = allUsers.find((u) => token.includes(u.id));
  if (matched) {
    return {
      id: matched.id,
      email: matched.email,
      name: matched.name,
      roles: matched.roles,
      isActive: matched.isActive,
      createdAt: matched.registeredDate,
    };
  }
  return mockUser;
}


function mapBackendUser(raw: {
  id: number | string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}): User {
  const roleName = raw.role.toUpperCase();
  const validRoles = ['LEARNER', 'MENTOR', 'ADMIN', 'RECRUITER'];

  const role = (
    validRoles.includes(roleName) ? roleName : 'LEARNER'
  ) as User['roles'][number];

  return {
    id: String(raw.id),
    name: raw.full_name,
    email: raw.email,
    roles: [role],
    isActive: raw.is_active,
    createdAt: raw.created_at,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiEnvelope<AuthResponse>> {
    if (USE_MOCKS || DEMO_EMAILS.has(credentials.email.trim().toLowerCase())) {
      await new Promise((r) => setTimeout(r, 350));
      const email = credentials.email.trim().toLowerCase();
      const password = (credentials.password || '').trim();

      if (!email) {
        throw { message: 'Please enter your email address.', status: 400 };
      }

      if (
        password === 'wrong' ||
        password === 'wrongpass' ||
        password === '123' ||
        (password.length > 0 && password.length < 4)
      ) {
        throw {
          message: 'Invalid email or password. Please check your credentials and try again.',
          status: 401,
        };
      }

      const allManagedUsers = [...loadPersistedMockUsers(), ...liveManagedUsers];
      const managedRecord = allManagedUsers.find(
        (u) => u.email.toLowerCase() === email
      );

      if (email.includes('disabled') || (managedRecord && !managedRecord.isActive)) {
        throw {
          message: 'This account has been disabled. Contact a SkillForge administrator for assistance.',
          status: 403,
        };
      }

      if (email.includes('admin') || email.includes('devon')) {
        const adminUser: User = {
          id: 'usr_admin_01',
          email: 'devon.h@skillforge.io',
          name: 'Devon Hayes',
          roles: ['ADMIN'],
          isActive: true,
          title: 'Platform Administrator',
          createdAt: '2025-11-20T08:00:00Z',
        };

        return wrapResponse({
          token: 'mock_jwt_token_admin_2026',
          refreshToken: 'mock_refresh_token_admin_2026',
          user: adminUser,
          profile: null,
        });
      }

      if (email.includes('marcus') || email.includes('mentor')) {
        const mentorUser: User = {
          id: 'usr_mentor_01',
          email: 'marcus.vance@skillforge.io',
          name: 'Marcus Vance',
          roles: ['MENTOR'],
          isActive: true,
          title: 'Senior Backend Architect',
          createdAt: '2026-01-10T09:00:00Z',
        };

        return wrapResponse({
          token: 'mock_jwt_token_mentor_2026',
          refreshToken: 'mock_refresh_token_mentor_2026',
          user: mentorUser,
          profile: null,
        });
      }

      if (managedRecord) {
        const role = managedRecord.roles[0] || 'LEARNER';

        const matchedUser: User = {
          id: managedRecord.id,
          email: managedRecord.email,
          name: managedRecord.name,
          roles: managedRecord.roles,
          isActive: managedRecord.isActive,
          createdAt: managedRecord.registeredDate,
        };

        return wrapResponse({
          token: `mock_jwt_token_${role.toLowerCase()}_${managedRecord.id}`,
          refreshToken: `mock_refresh_token_${role.toLowerCase()}_${managedRecord.id}`,
          user: matchedUser,
          profile: role === 'LEARNER' ? liveProfile : null,
        });
      }

      const learnerUser: User = {
        id: 'usr_rahul_01',
        email,
        name: email === 'rahul.sharma@skillforge.io'
          ? 'Rahul Sharma'
          : email.split('@')[0],
        roles: ['LEARNER'],
        isActive: true,
        createdAt: '2026-06-15T09:00:00Z',
      };

      return wrapResponse({
        token: 'mock_jwt_token_learner_2026',
        refreshToken: 'mock_refresh_token_learner_2026',
        user: learnerUser,
        profile: liveProfile,
      });
    }

    const loginRes = await apiClient.post<{
      access_token: string;
      token_type: string;
    }>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const token = loginRes.data.access_token;

    const userRes = await apiClient.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return wrapResponse({
      token,
      refreshToken: undefined,
      user: mapBackendUser(userRes.data),
      profile: null,
    });
  },

  async register(payload: RegisterPayload): Promise<ApiEnvelope<AuthResponse>> {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 150));

      const exists = liveManagedUsers.some(
        (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
      );

      if (exists) {
        throw { message: 'An account with this email already exists.', status: 409 };
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        roles: ['LEARNER'],
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const newProfile: LearnerProfile = {
        userId: newUser.id,
        targetCareerId: payload.targetCareerId || 'career_py_backend',
        isProfileComplete: false,
      };

      liveProfile = newProfile;

      const createdRecord: ManagedUserRecord = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: ['LEARNER'],
        isActive: true,
        targetCareer: liveCareers.find(
          (c) => c.id === newProfile.targetCareerId
        )?.title || 'Python Backend Developer',
        readinessScore: 25,
        verifiedSkillsCount: 0,
        registeredDate: new Date().toISOString().split('T')[0],
      };

      liveManagedUsers.unshift(createdRecord);
      savePersistedMockUser(createdRecord);

      return wrapResponse({
        token: `mock_jwt_token_learner_${newUser.id}`,
        refreshToken: `mock_refresh_token_learner_${newUser.id}`,
        user: newUser,
        profile: newProfile,
      });
    }

    if (!payload.password) {
      throw new Error('Password is required.');
    }

    const regRes = await apiClient.post('/auth/register', {
      full_name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    const loginRes = await apiClient.post<{
      access_token: string;
      token_type: string;
    }>('/auth/login', {
      email: payload.email,
      password: payload.password,
    });

    return wrapResponse({
      token: loginRes.data.access_token,
      refreshToken: undefined,
      user: mapBackendUser(regRes.data),
      profile: null,
    });
  },

  async refresh(
    refreshToken: string
  ): Promise<ApiEnvelope<{ token: string; refreshToken: string }>> {
    if (USE_MOCKS || refreshToken.startsWith('mock_')) {
      await new Promise((r) => setTimeout(r, 150));

      if (!refreshToken) {
        throw { message: 'Refresh token missing.', status: 401 };
      }

      const prefix = refreshToken.includes('admin')
        ? 'admin'
        : refreshToken.includes('mentor')
          ? 'mentor'
          : 'learner';

      return wrapResponse({
        token: `mock_jwt_token_${prefix}_refreshed_${Date.now()}`,
        refreshToken: `mock_refresh_token_${prefix}_refreshed_${Date.now()}`,
      });
    }

    throw {
      message: 'Token refresh is not supported by the backend.',
      status: 401,
    };
  },

  async getMe(
    tokenOverride?: string | null
  ): Promise<ApiEnvelope<{ user: User; profile: LearnerProfile | null }>> {
    if (isMockSessionActive(tokenOverride)) {
      await new Promise((r) => setTimeout(r, 120));

      const resolved = resolveMockUserFromToken(tokenOverride);

      return wrapResponse({
        user: resolved,
        profile: resolved.roles.includes('LEARNER') ? liveProfile : null,
      });
    }

    const res = await apiClient.get('/users/me', {
      headers: tokenOverride
        ? { Authorization: `Bearer ${tokenOverride}` }
        : undefined,
    });

    return wrapResponse({
      user: mapBackendUser(res.data),
      profile: null,
    });
  },
};

export const userService = {
  async getProfile(): Promise<ApiEnvelope<LearnerProfile>> {
    if (isMockSessionActive()) return wrapResponse(liveProfile);
    const res = await apiClient.get<ApiEnvelope<LearnerProfile>>('/users/me');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async updateProfile(profileData: Partial<LearnerProfile>): Promise<ApiEnvelope<LearnerProfile>> {
    if (isMockSessionActive()) {
      liveProfile = { ...liveProfile, ...profileData, isProfileComplete: true };
      return wrapResponse(liveProfile);
    }
    throw { message: 'Profile updates are not available in the current backend API.', status: 501 };
  },

  async getUserSkills(): Promise<ApiEnvelope<UserSkill[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveUserSkills]);
    const res = await apiClient.get<ApiEnvelope<UserSkill[]>>('/users/me/skills');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async addSkill(skill: Omit<UserSkill, 'id' | 'userId'>): Promise<ApiEnvelope<UserSkill>> {
    if (isMockSessionActive()) {
      const newSkill: UserSkill = {
        ...skill,
        id: `usk_${Date.now()}`,
        userId: mockUser.id,
        verificationStatus: 'SELF_DECLARED',
      };
      liveUserSkills.push(newSkill);
      return wrapResponse(newSkill);
    }
    const res = await apiClient.post<ApiEnvelope<UserSkill>>('/users/me/skills', skill);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async updateSkillLevel(skillRecordId: string, level: SkillLevel): Promise<ApiEnvelope<UserSkill>> {
    if (isMockSessionActive()) {
      liveUserSkills = liveUserSkills.map((s) =>
        s.id === skillRecordId ? { ...s, level, verificationStatus: 'SELF_DECLARED' } : s
      );
      const updated = liveUserSkills.find((s) => s.id === skillRecordId) || liveUserSkills[0];
      return wrapResponse(updated);
    }
    throw { message: 'Updating a declared skill is not available in the current backend API.', status: 501 };
  },

  async removeSkill(skillRecordId: string): Promise<ApiEnvelope<{ id: string }>> {
    if (isMockSessionActive()) {
      liveUserSkills = liveUserSkills.filter((s) => s.id !== skillRecordId);
      return wrapResponse({ id: skillRecordId });
    }
    throw { message: 'Removing a declared skill is not available in the current backend API.', status: 501 };
  },
};

export const careerService = {
  async getCareers(): Promise<ApiEnvelope<CareerRole[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveCareers]);
    const res = await apiClient.get<ApiEnvelope<CareerRole[]>>('/careers');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async getCareerById(id: string): Promise<ApiEnvelope<CareerRole>> {
    if (isMockSessionActive()) {
      const career = liveCareers.find((c) => c.id === id) || liveCareers[0];
      return wrapResponse(career);
    }
    const res = await apiClient.get<ApiEnvelope<CareerRole>>(`/careers/${id}`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async selectTargetCareer(careerId: string): Promise<ApiEnvelope<LearnerProfile>> {
    if (isMockSessionActive()) {
      liveProfile = { ...liveProfile, targetCareerId: careerId };
      return wrapResponse(liveProfile);
    }
    throw { message: 'Target-career selection is not available in the current backend API.', status: 501 };
  },

  async getSkillCatalog(): Promise<ApiEnvelope<Skill[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveSkillsCatalog]);
    const res = await apiClient.get<ApiEnvelope<Skill[]>>('/skills');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<ApiEnvelope<Skill>> {
    if (isMockSessionActive()) {
      const created: Skill = { ...skill, id: `sk_${Date.now()}` };
      liveSkillsCatalog.push(created);
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'SKILL_CREATED',
        targetType: 'SKILL',
        targetId: created.id,
        details: `Added skill "${created.name}" (${created.category}) to catalog.`,
      });
      return wrapResponse(created);
    }
    const res = await apiClient.post<ApiEnvelope<Skill>>('/skills', skill);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async saveCareerWeights(
    careerId: string,
    requirements: CareerRole['requirements']
  ): Promise<ApiEnvelope<CareerRole>> {
    if (isMockSessionActive()) {
      const total = requirements.reduce((sum, r) => sum + (r.weightPercentage || 0), 0);
      if (total !== 100) {
        throw { message: `Skill weights must total 100% (currently ${total}%).`, status: 400 };
      }
      liveCareers = liveCareers.map((c) => (c.id === careerId ? { ...c, requirements } : c));
      const updated = liveCareers.find((c) => c.id === careerId) || liveCareers[0];
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'CAREER_WEIGHTS_UPDATED',
        targetType: 'CAREER',
        targetId: careerId,
        details: `Updated required skill weights for ${updated.title} (Total: 100%).`,
      });
      return wrapResponse(updated);
    }
    throw { message: 'Updating career weights is not available in the current backend API.', status: 501 };
  },
};

export const skillGapService = {
  async getSkillGaps(): Promise<ApiEnvelope<SkillGap[]>> {
    if (isMockSessionActive()) {
      const target = liveCareers.find((c) => c.id === liveProfile.targetCareerId) || liveCareers[0];
      return wrapResponse(computeGapsForCareer(target, liveUserSkills));
    }
    const careersResponse = await apiClient.get('/careers');
    const careers = (careersResponse.data as any)?.data ?? careersResponse.data;
    if (!Array.isArray(careers) || careers.length === 0) return wrapResponse([]);
    const res = await apiClient.get(`/skill-gap/${careers[0].id}`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },
};

export const roadmapService = {
  async getRoadmap(): Promise<ApiEnvelope<RoadmapPhase[]>> {
    if (isMockSessionActive()) return wrapResponse([...livePhases]);
    const careersResponse = await apiClient.get('/careers');
    const careers = (careersResponse.data as any)?.data ?? careersResponse.data;
    if (!Array.isArray(careers) || careers.length === 0) return wrapResponse([]);
    const res = await apiClient.get(`/roadmap/${careers[0].id}`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async saveRoadmapPhases(phases: RoadmapPhase[]): Promise<ApiEnvelope<RoadmapPhase[]>> {
    if (isMockSessionActive()) {
      livePhases = phases;
      return wrapResponse(livePhases);
    }
    throw { message: 'Saving roadmap phases is not available in the current backend API.', status: 501 };
  },

  async completeLesson(lessonId: string): Promise<ApiEnvelope<{ lessonId: string; status: 'COMPLETED' }>> {
    if (isMockSessionActive()) {
      for (const phase of livePhases) {
        for (const course of phase.courses) {
          for (const mod of course.modules) {
            const match = mod.lessons.find((l) => l.id === lessonId);
            if (match && match.status !== 'COMPLETED') {
              match.status = 'COMPLETED';
              course.completedLessons = Math.min(course.totalLessons, course.completedLessons + 1);
              course.progressPercentage = Math.round((course.completedLessons / course.totalLessons) * 100);
              break;
            }
          }
        }
      }
      return wrapResponse({ lessonId, status: 'COMPLETED' });
    }
    const roadmap = await roadmapService.getRoadmap();
    for (const phase of roadmap.data) {
      for (const course of phase.courses || []) {
        const found = (course.modules || []).some((module) => module.lessons.some((lesson) => lesson.id === lessonId));
        if (found) {
          const completed = Math.min(course.totalLessons, course.completedLessons + 1);
          await apiClient.put(`/courses/${course.id}/progress`, { completed_lessons: completed });
          return wrapResponse({ lessonId, status: 'COMPLETED' as const });
        }
      }
    }
    throw { message: 'Could not find the lesson in the learner roadmap.', status: 404 };
  },
};

export const assessmentService = {
  async getAssessments(): Promise<ApiEnvelope<Assessment[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveAssessments]);
    const res = await apiClient.get<ApiEnvelope<Assessment[]>>('/assessments');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async getAssessmentById(id: string): Promise<ApiEnvelope<Assessment>> {
    if (isMockSessionActive()) {
      const match = liveAssessments.find((a) => a.id === id) || liveAssessments[1] || liveAssessments[0];
      return wrapResponse(match);
    }
    const res = await apiClient.get<ApiEnvelope<Assessment>>(`/assessments/${id}`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async submitAssessment(
    id: string,
    answers: Record<string, number[]>,
    timeTakenSeconds: number
  ): Promise<ApiEnvelope<AssessmentResult>> {
    if (isMockSessionActive()) {
      await new Promise((r) => setTimeout(r, 450));
      const target = liveAssessments.find((a) => a.id === id) || liveAssessments[1];
      if (target) {
        target.previousScore = 93;
        target.previousPassed = true;
      }
      return wrapResponse({
        ...mockAssessmentResult,
        assessmentId: id,
        assessmentTitle: target?.title || mockAssessmentResult.assessmentTitle,
        timeTakenSeconds,
      });
    }
    const attemptResponse = await apiClient.post(`/assessments/${id}/attempt`, { assessment_id: Number(id) });
    const attempt = (attemptResponse.data as any)?.data ?? attemptResponse.data;
    const attemptId = attempt.id;
    for (const [questionId, selected] of Object.entries(answers)) {
      const selectedAnswer = (selected || []).map((index) => ['A', 'B', 'C', 'D'][index]).filter(Boolean).join(',');
      await apiClient.post(`/assessments/attempts/${attemptId}/answers`, { question_id: Number(questionId), selected_answer: selectedAnswer });
    }
    await apiClient.post(`/assessments/attempts/${attemptId}/submit`);
    const resultResponse = await apiClient.get(`/assessments/attempts/${attemptId}/result`);
    const backendResult = (resultResponse.data as any)?.data ?? resultResponse.data;
    const assessment = liveAssessments.find((item) => item.id === id);
    return wrapResponse({ ...mockAssessmentResult, id: String(attemptId), assessmentId: id, assessmentTitle: assessment?.title || mockAssessmentResult.assessmentTitle, score: Number(backendResult.score ?? 0), timeTakenSeconds } as AssessmentResult);
  },
};

export const projectService = {
  async getProjects(): Promise<ApiEnvelope<Project[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveProjects]);
    const res = await apiClient.get<ApiEnvelope<Project[]>>('/projects');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async getSubmissions(): Promise<ApiEnvelope<ProjectSubmission[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveSubmissions]);
    const res = await apiClient.get<ApiEnvelope<ProjectSubmission[]>>('/project-submissions/my');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async submitProject(payload: {
    projectId: string;
    projectTitle: string;
    githubRepoUrl: string;
    liveDemoUrl?: string;
    description: string;
    technologiesUsed: string[];
  }): Promise<ApiEnvelope<ProjectSubmission>> {
    if (isMockSessionActive()) {
      const newSub: ProjectSubmission = {
        id: `sub_${Date.now()}`,
        projectId: payload.projectId,
        projectTitle: payload.projectTitle,
        learnerId: mockUser.id,
        learnerName: mockUser.name,
        learnerEmail: mockUser.email,
        targetRole: liveCareers.find((c) => c.id === liveProfile.targetCareerId)?.title || 'Python Backend Developer',
        githubRepoUrl: payload.githubRepoUrl,
        liveDemoUrl: payload.liveDemoUrl,
        description: payload.description,
        technologiesUsed: payload.technologiesUsed,
        submittedAt: new Date().toISOString(),
        status: 'UNDER_REVIEW', // Learners can NEVER self-mark verified
      };
      liveSubmissions.unshift(newSub);
      return wrapResponse(newSub);
    }
    const res = await apiClient.post('/project-submissions', {
      project_id: Number(payload.projectId),
      repository_url: payload.githubRepoUrl,
      demo_url: payload.liveDemoUrl || null,
      description: payload.description,
    });
    return wrapResponse((res.data as any)?.data ?? res.data);
  },
};

export const certificateService = {
  async getCertificates(): Promise<ApiEnvelope<Certificate[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveCertificates]);
    const res = await apiClient.get<ApiEnvelope<Certificate[]>>('/certifications/my');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async verifyCertificate(id: string): Promise<ApiEnvelope<Certificate | null>> {
    if (isMockSessionActive()) {
      const cleanId = id.trim().toLowerCase();
      const cert = liveCertificates.find(
        (c) => c.certificateNumber.toLowerCase() === cleanId || c.id.toLowerCase() === cleanId
      );
      return wrapResponse(cert || null);
    }
    const res = await apiClient.get<ApiEnvelope<Certificate | null>>(`/certifications/verify/${id}`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async getCertificateRules(): Promise<ApiEnvelope<typeof liveCertRules>> {
    if (isMockSessionActive()) return wrapResponse({ ...liveCertRules });
    return wrapResponse({ ...liveCertRules });
  },

  async updateCertificateRules(rules: typeof liveCertRules): Promise<ApiEnvelope<typeof liveCertRules>> {
    if (isMockSessionActive()) {
      liveCertRules = { ...rules };
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'CERTIFICATE_RULES_UPDATED',
        targetType: 'CERTIFICATE',
        targetId: 'global_rules',
        details: `Updated certificate criteria: Course >=${rules.minCourseCompletion}%, Quiz >=${rules.minQuizAverage}%, Final >=${rules.minFinalAssessment}%.`,
      });
      return wrapResponse(liveCertRules);
    }
    throw { message: 'Certificate rule management is not available in the current backend API.', status: 501 };
  },

  async revokeCertificate(certId: string, reason: string): Promise<ApiEnvelope<Certificate>> {
    if (isMockSessionActive()) {
      liveCertificates = liveCertificates.map((c) =>
        c.id === certId || c.certificateNumber === certId
          ? { ...c, status: 'REVOKED', badgeLevel: 'Revoked Record' }
          : c
      );
      const target = liveCertificates.find((c) => c.id === certId || c.certificateNumber === certId) || liveCertificates[0];
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'CERTIFICATE_REVOKED',
        targetType: 'CERTIFICATE',
        targetId: target.certificateNumber,
        details: reason || 'Certificate revoked by platform administrator.',
      });
      return wrapResponse(target);
    }
    const res = await apiClient.patch(`/certifications/${certId}/revoke`);
    return wrapResponse((res.data as any)?.data ?? res.data);
  },
};


export const readinessService = {
  async getReadiness(): Promise<ApiEnvelope<ReadinessScore>> {
    if (isMockSessionActive()) return wrapResponse({ ...liveReadiness });

    const careersRes = await apiClient.get('/careers');
    const careers = careersRes.data;

    if (!Array.isArray(careers) || careers.length === 0) {
      throw new Error('No careers are available to calculate readiness.');
    }

    const careerId = careers[0].id;
    const res = await apiClient.get(`/readiness/${careerId}`);
    const backend = res.data;

    const score = Number(backend.readiness_score ?? 0);

    const result = {
      ...liveReadiness,
      overall: score,
      calculatedAt: new Date().toISOString(),
    } as ReadinessScore;

    return wrapResponse(result);
  },

  async getReadinessHistory(): Promise<ApiEnvelope<typeof liveReadinessHistory>> {
    if (isMockSessionActive()) return wrapResponse([...liveReadinessHistory]);

    // Backend does not currently provide readiness history.
    return wrapResponse([]);
  },

  async getCareerMatches(): Promise<ApiEnvelope<CareerMatch[]>> {
    if (isMockSessionActive()) return wrapResponse(computeCareerMatches(liveUserSkills));

    const res = await apiClient.get('/recommendations/careers');
    const recommendations = res.data?.recommendations ?? [];

    const matches = recommendations.map((item: any) => ({
      careerId: String(item.career_id),
      role: {
        id: String(item.career_id),
        title: item.career_title,
        description: '',
        category: 'Technology',
        targetScore: 100,
        requirements: [],
      },
      matchPercentage: Number(item.match_score ?? 0),
      readinessLevel: 'DEVELOPING',
      criticalGapsCount: 0,
      secondaryGapsCount: 0,
    })) as CareerMatch[];

    return wrapResponse(matches);
  },

  async getDomainDistribution(): Promise<ApiEnvelope<DomainRadarSnapshot[]>> {
    if (isMockSessionActive()) return wrapResponse(mockDomainRadarSnapshots);

    // Backend does not currently provide domain-distribution data.
    return wrapResponse([]);
  },
};


export const aiService = {
  async getMessages(): Promise<ApiEnvelope<AIMessage[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveAIMessages]);
    return wrapResponse([...liveAIMessages]);
  },

  async getLearnerHistory(learnerId: string): Promise<ApiEnvelope<AIMessage[]>> {
    if (isMockSessionActive()) {
      if (learnerId === 'usr_rahul_01') return wrapResponse([...liveAIMessages]);
      return wrapResponse(liveDossiers[learnerId]?.aiHistory || []);
    }
    return wrapResponse([]);
  },

  async sendMessage(content: string): Promise<ApiEnvelope<AIMessage>> {
    if (isMockSessionActive()) {
      const userMsg: AIMessage = {
        id: `msg_usr_${Date.now()}`,
        sender: 'user',
        type: 'text',
        content,
        timestamp: new Date().toISOString(),
      };
      liveAIMessages.push(userMsg);

      await new Promise((r) => setTimeout(r, 500));

      let assistantMsg: AIMessage;
      const lower = content.toLowerCase();

      if (lower.includes('practice') || lower.includes('quiz')) {
        assistantMsg = {
          id: `msg_asst_${Date.now()}`,
          sender: 'assistant',
          type: 'practice_questions',
          content: 'Here are targeted practice questions based on your current Docker and FastAPI gaps:',
          questions: [
            {
              id: 'pq_1',
              prompt: 'Which Dockerfile instruction creates a persistent storage mount outside the container filesystem?',
              options: ['EXPOSE', 'VOLUME', 'WORKDIR', 'ENV'],
              correctIndex: 1,
              explanation: 'VOLUME defines a persistent mount point outside the container layer.',
            },
            {
              id: 'pq_2',
              prompt: 'In FastAPI, what is the best way to manage database sessions per async request?',
              options: [
                'Create a global session shared by every request',
                'Use an async generator with yield inside a Depends() dependency',
                'Disable connection pooling',
                'Open a new database engine inside every route',
              ],
              correctIndex: 1,
              explanation: 'Yielding a session from Depends() ensures clean session teardown even if an error happens.',
            },
          ],
          timestamp: new Date().toISOString(),
        };
      } else if (lower.includes('plan') || lower.includes('roadmap') || lower.includes('next')) {
        assistantMsg = {
          id: `msg_asst_${Date.now()}`,
          sender: 'assistant',
          type: 'learning_path',
          content: 'Here is your personalized, verified-first study plan toward 85%+ Python Backend readiness:',
          steps: [
            {
              step: 1,
              title: 'Complete Docker Multi-Stage Build Lesson',
              description: 'Focus on non-root execution and lean runner layers.',
              skillUnlocked: 'Docker (Intermediate)',
              courseId: 'crs_docker_01',
              estimatedHours: 2,
              isUnlocked: true,
            },
            {
              step: 2,
              title: 'Pass Docker Architecture Assessment',
              description: 'Score 70% or higher to upgrade status to ASSESSED.',
              skillUnlocked: 'Docker Assessment Badge',
              estimatedHours: 1,
              isUnlocked: true,
            },
            {
              step: 3,
              title: 'Submit Distributed Task Queue Project',
              description: 'Build a containerized worker pool with Redis and FastAPI for mentor review.',
              skillUnlocked: 'Docker & Microservices (Project-Verified)',
              estimatedHours: 12,
              isUnlocked: false,
            },
          ],
          timestamp: new Date().toISOString(),
        };
      } else {
        assistantMsg = {
          id: `msg_asst_${Date.now()}`,
          sender: 'assistant',
          type: 'text',
          content: `Regarding "${content}": SkillForge prioritizes verified ability over passive course completion. Your highest-impact step right now is closing your Docker gap to lift your readiness score from ${liveReadiness.overall}% toward the Strong Candidate tier.`,
          timestamp: new Date().toISOString(),
        };
      }

      liveAIMessages.push(assistantMsg);
      return wrapResponse(assistantMsg);
    }

    const res = await apiClient.post('/project-agent/ask', {
  question: content,
});

const answer = res.data?.answer ?? 'No response received from AI.';

const assistantMsg: AIMessage = {
  id: `msg_asst_${Date.now()}`,
  sender: 'assistant',
  type: 'text',
  content: answer,
  timestamp: new Date().toISOString(),
};

liveAIMessages.push(assistantMsg);
return wrapResponse(assistantMsg);
  },

  async clearMessages(): Promise<void> {
    if (isMockSessionActive()) {
      liveAIMessages = [];
    }
  },

  async generatePracticeQuestions(params: {
    skillId: string;
    topic: string;
    count: number;
  }): Promise<ApiEnvelope<AIPracticeQuestion[]>> {
    if (isMockSessionActive()) {
      await new Promise((r) => setTimeout(r, 350));
      const matching = mockAIPracticeBank.filter((q) => q.skillId === params.skillId);
      const pool = matching.length > 0 ? matching : mockAIPracticeBank;
      const result: AIPracticeQuestion[] = [];
      for (let i = 0; i < params.count; i++) {
        const base = pool[i % pool.length];
        result.push({
          ...base,
          id: `${base.id}_gen_${i}`,
          topic: params.topic || base.topic,
        });
      }
      return wrapResponse(result);
    }
    const res = await apiClient.get('/ai/generate-questions', { params: { topic: params.topic, difficulty: 'intermediate', number_of_questions: params.count ?? 5 } });
    const payload = (res.data as any)?.data ?? res.data;
    const questions = (payload.questions || []).map((q: any, index: number) => ({
  id: String(q.id ?? `generated_${index}`),
  prompt: q.question_text ?? q.question ?? q.prompt ?? '',
  options: q.options ?? [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
  correctIndex: 0,
  explanation: q.explanation ?? '',
  skillId: String(''),
  topic: payload.topic ?? '',
  difficulty: payload.difficulty ?? '',
}));
    return wrapResponse(questions as AIPracticeQuestion[]);
  },

  async submitPracticeAnswers(params: {
    skillId: string;
    topic: string;
    questions: AIPracticeQuestion[];
    answers: Record<string, number>;
  }): Promise<ApiEnvelope<AIPracticeSubmissionResult>> {
    if (isMockSessionActive()) {
      await new Promise((r) => setTimeout(r, 350));
      const totalQuestions = params.questions.length || 1;
      const correctCount = params.questions.reduce(
        (count, q) => (params.answers[q.id] === q.correctIndex ? count + 1 : count),
        0
      );
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      const skillObj = liveSkillsCatalog.find((s) => s.id === params.skillId) || liveSkillsCatalog[7];

      // Feed result back into learner's skill & readiness state
      let gapUpdated = false;
      const existingSkill = liveUserSkills.find((us) => us.skillId === params.skillId);
      if (scorePercentage >= 60) {
        gapUpdated = true;
        if (existingSkill) {
          existingSkill.assessedScore = Math.max(existingSkill.assessedScore || 0, scorePercentage);
          if (existingSkill.level === 'Beginner' && scorePercentage >= 75) {
            existingSkill.level = 'Intermediate';
          }
          if (existingSkill.verificationStatus === 'SELF_DECLARED' && scorePercentage >= 70) {
            existingSkill.verificationStatus = 'ASSESSED';
            existingSkill.verifiedAt = new Date().toISOString();
            existingSkill.expiresAt = '2027-11-12';
          }
        } else {
          liveUserSkills.push({
            id: `usk_${Date.now()}`,
            userId: mockUser.id,
            skillId: params.skillId,
            skill: skillObj,
            level: scorePercentage >= 75 ? 'Intermediate' : 'Beginner',
            verificationStatus: scorePercentage >= 70 ? 'ASSESSED' : 'SELF_DECLARED',
            assessedScore: scorePercentage,
            expiresAt: scorePercentage >= 70 ? '2027-11-12' : undefined,
          });
        }
      }

      const readinessDelta = scorePercentage >= 70 ? 2 : scorePercentage >= 50 ? 1 : 0;
      if (readinessDelta > 0) {
        liveReadiness.overall = Math.min(100, liveReadiness.overall + readinessDelta);
        liveReadiness.breakdown.technicalSkills = Math.min(100, liveReadiness.breakdown.technicalSkills + readinessDelta);
        liveReadinessHistory = [
          ...liveReadinessHistory.slice(0, -1),
          {
            date: 'Nov 2026',
            score: liveReadiness.overall,
            level: liveReadiness.overall >= 75 ? ('STRONG_CANDIDATE' as const) : ('JUNIOR_READY' as const),
          },
        ];
      }

      const targetCareer = liveCareers.find((c) => c.id === liveProfile.targetCareerId) || liveCareers[0];
      const updatedGaps = computeGapsForCareer(targetCareer, liveUserSkills);
      const updatedGapItem = updatedGaps.find((g) => g.skill.id === params.skillId);
      const newGapLabel = updatedGapItem?.gap || (scorePercentage >= 75 ? 'NONE' : 'MEDIUM');

      return wrapResponse({
        skillId: params.skillId,
        skillName: skillObj.name,
        topic: params.topic,
        scorePercentage,
        correctCount,
        totalQuestions,
        gapUpdated,
        newGapLabel,
        readinessDelta,
        feedbackSummary:
          scorePercentage >= 70
            ? `Strong work! Your ${skillObj.name} practice result has been recorded and updated your skill gap status.`
            : `Review the explanations below and retry ${params.topic} to raise your ${skillObj.name} readiness.`,
      });
    }
    throw { message: 'AI practice submission is not implemented by the current backend API.', status: 501 };
  },
};

export const mentorService = {
  async getAssignedLearners(): Promise<ApiEnvelope<LearnerDossier[]>> {
    if (isMockSessionActive()) {
      return wrapResponse(Object.values(liveDossiers));
    }
    return wrapResponse([]);
  },

  async getLearnerDossier(learnerId: string): Promise<ApiEnvelope<LearnerDossier | null>> {
    if (isMockSessionActive()) {
      const dossier = liveDossiers[learnerId];
      if (!dossier) {
        const userRec = liveManagedUsers.find((u) => u.id === learnerId);
        if (!userRec) return wrapResponse(null);
        return wrapResponse({
          learnerId: userRec.id,
          name: userRec.name,
          email: userRec.email,
          targetCareer: userRec.targetCareer,
          readiness: {
            ...mockReadinessScore,
            overall: userRec.readinessScore,
            verifiedSkillsCount: userRec.verifiedSkillsCount,
          },
          readinessHistory: mockReadinessHistory,
          skills: mockUserSkills.slice(0, 4),
          gaps: computeGapsForCareer(liveCareers[0], mockUserSkills.slice(0, 4)),
          assessments: [],
          projects: liveSubmissions.filter((s) => s.learnerId === userRec.id),
          certificates: liveCertificates.filter((c) => c.learnerName === userRec.name),
          aiHistory: [],
        });
      }
      return wrapResponse(dossier);
    }
    return wrapResponse(null);
  },

  async getReviewQueue(): Promise<ApiEnvelope<ProjectSubmission[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveSubmissions]);
    const res = await apiClient.get('/admin/project-submissions');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async submitProjectReview(payload: {
    submissionId: string;
    scores: ProjectReviewScore;
    feedbackText: string;
    decision: 'APPROVE' | 'REJECT';
    reviewerName?: string;
  }): Promise<ApiEnvelope<ProjectSubmission>> {
    if (isMockSessionActive()) {
      const s = payload.scores;
      const totalScore =
        s.codeQuality +
        s.apiDesign +
        s.databaseDesign +
        s.auth +
        s.testing +
        s.errorHandling +
        s.documentation +
        s.deployment;
      const passed = payload.decision === 'APPROVE';

      liveSubmissions = liveSubmissions.map((sub) => {
        if (sub.id !== payload.submissionId) return sub;
        return {
          ...sub,
          status: passed ? 'PASSED' : 'REJECTED',
          review: {
            id: `rev_${Date.now()}`,
            submissionId: sub.id,
            reviewerName: payload.reviewerName || 'Marcus Vance (Senior Backend Architect)',
            scores: payload.scores,
            totalScore,
            maxScore: 80,
            feedbackText: payload.feedbackText,
            passed,
            reviewedAt: new Date().toISOString(),
          },
        };
      });

      const updated = liveSubmissions.find((sub) => sub.id === payload.submissionId) || liveSubmissions[0];

      // Upgrade learner's target project skill to PROJECT_VERIFIED when approved
      if (passed && updated.learnerId === mockUser.id) {
        const dockerSkill = liveUserSkills.find((sk) => sk.skillId === 'sk_docker');
        if (dockerSkill) {
          dockerSkill.verificationStatus = 'PROJECT_VERIFIED';
          dockerSkill.level = 'Intermediate';
          dockerSkill.assessedScore = Math.round((totalScore / 80) * 100);
          dockerSkill.expiresAt = '2027-11-12';
        }
      }

      appendAudit({
        actorName: payload.reviewerName || 'Marcus Vance',
        actorRole: 'MENTOR',
        action: passed ? 'PROJECT_REVIEW_APPROVED' : 'PROJECT_REVIEW_REJECTED',
        targetType: 'PROJECT',
        targetId: updated.id,
        details: `${passed ? 'Approved' : 'Requested changes on'} "${updated.projectTitle}" (${totalScore}/80 pts).`,
      });

      return wrapResponse(updated);
    }
    const status = payload.decision === 'APPROVE' ? 'approved' : 'rejected';
    const score = Object.values(payload.scores).reduce((sum, value) => sum + value, 0);
    const res = await apiClient.put(`/project-submissions/${payload.submissionId}/review`, {
      status,
      score,
      feedback: payload.feedbackText,
    });
    return wrapResponse((res.data as any)?.data ?? res.data);
  },
};

export const adminService = {
  async getUsers(): Promise<ApiEnvelope<ManagedUserRecord[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveManagedUsers]);
    const res = await apiClient.get<ApiEnvelope<ManagedUserRecord[]>>('/admin/users');
    return wrapResponse((res.data as any)?.data ?? res.data);
  },

  async createUser(payload: {
    name: string;
    email: string;
    roles: Array<'LEARNER' | 'MENTOR' | 'ADMIN'>;
    targetCareer?: string;
  }): Promise<ApiEnvelope<ManagedUserRecord>> {
    if (isMockSessionActive()) {
      const created: ManagedUserRecord = {
        id: `usr_${Date.now()}`,
        name: payload.name,
        email: payload.email.toLowerCase(),
        roles: payload.roles.length ? payload.roles : ['LEARNER'],
        isActive: true,
        targetCareer: payload.targetCareer || 'Python Backend Developer',
        readinessScore: payload.roles.includes('LEARNER') ? 35 : 95,
        verifiedSkillsCount: payload.roles.includes('LEARNER') ? 1 : 10,
        registeredDate: new Date().toISOString().split('T')[0],
      };
      liveManagedUsers.unshift(created);
      if (created.roles.includes('MENTOR')) {
        liveMentors.unshift({
          id: `mnt_${Date.now()}`,
          name: created.name,
          email: created.email,
          title: 'Technical Mentor',
          specialties: ['Python', 'FastAPI'],
          assignedLearnerIds: [],
          maxCapacity: 6,
          completedReviewsCount: 0,
          avgTurnaroundHours: 0,
          avgRubricScore: 0,
          status: 'ACTIVE',
          joinedDate: created.registeredDate,
        });
      }
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'USER_CREATED',
        targetType: 'USER',
        targetId: created.id,
        details: `Created account for ${created.name} with role(s): ${created.roles.join(', ')}.`,
      });
      return wrapResponse(created);
    }
    throw { message: 'Creating users through the admin API is not available in the current backend.', status: 501 };
  },

  async updateUser(
    userId: string,
    patch: Partial<Pick<ManagedUserRecord, 'name' | 'roles' | 'isActive' | 'targetCareer'>>
  ): Promise<ApiEnvelope<ManagedUserRecord>> {
    if (isMockSessionActive()) {
      liveManagedUsers = liveManagedUsers.map((u) => (u.id === userId ? { ...u, ...patch } : u));
      const updated = liveManagedUsers.find((u) => u.id === userId) || liveManagedUsers[0];
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'USER_UPDATED',
        targetType: 'USER',
        targetId: userId,
        details: `Updated ${updated.name}: roles=[${updated.roles.join(', ')}], active=${updated.isActive}.`,
      });
      return wrapResponse(updated);
    }
    if (patch.isActive === undefined) {
      throw { message: 'The backend currently supports only changing user active status.', status: 501 };
    }
    await apiClient.patch(`/admin/users/${userId}/status`, null, {
      params: { is_active: patch.isActive },
    });
    const detail = await apiClient.get(`/admin/users/${userId}`);
    return wrapResponse((detail.data as any)?.data ?? detail.data);
  },

  async getMentors(): Promise<ApiEnvelope<MentorDirectoryRecord[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveMentors]);
    return wrapResponse([]);
  },

  async assignLearnerToMentor(learnerId: string, mentorId: string): Promise<ApiEnvelope<{ learnerId: string; mentorId: string }>> {
    if (isMockSessionActive()) {
      const mentor = liveMentors.find((m) => m.id === mentorId);
      const learner = liveManagedUsers.find((u) => u.id === learnerId);
      if (mentor) {
        liveMentors = liveMentors.map((m) => {
          const filtered = m.assignedLearnerIds.filter((id) => id !== learnerId);
          return m.id === mentorId
            ? { ...m, assignedLearnerIds: [...filtered, learnerId] }
            : { ...m, assignedLearnerIds: filtered };
        });
      }
      liveManagedUsers = liveManagedUsers.map((u) =>
        u.id === learnerId
          ? { ...u, assignedMentorId: mentorId, assignedMentorName: mentor?.name || 'Marcus Vance' }
          : u
      );
      appendAudit({
        actorName: 'Devon Hayes',
        actorRole: 'ADMIN',
        action: 'MENTOR_ASSIGNED',
        targetType: 'MENTOR_ASSIGNMENT',
        targetId: learnerId,
        details: `Assigned ${learner?.name || learnerId} to mentor ${mentor?.name || mentorId}.`,
      });
      return wrapResponse({ learnerId, mentorId });
    }
    throw { message: 'Mentor assignment is not available in the current backend API.', status: 501 };
  },

  async getAuditLogs(): Promise<ApiEnvelope<AuditLogEntry[]>> {
    if (isMockSessionActive()) return wrapResponse([...liveAuditLogs]);
    return wrapResponse([]);
  },
};

