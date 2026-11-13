export type Role = 'LEARNER' | 'MENTOR' | 'ADMIN' | 'RECRUITER';

export type Permission =
  | 'projects:submit'
  | 'projects:review'
  | 'projects:verify'
  | 'content:manage'
  | 'candidates:view'
  | 'readiness:view'
  | 'quizzes:take'
  | 'skills:declare'
  | 'assessments:manage'
  | 'users:manage';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  avatarUrl?: string;
  isActive?: boolean;
  disabledReason?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LearnerProfile {
  userId: string;
  targetCareerId: string;
  phone?: string;
  location?: string;
  education?: string;
  currentJob?: string;
  yearsExperience?: number;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeUploadedAt?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isProfileComplete: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  targetCareerId?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  profile: LearnerProfile | null;
}
