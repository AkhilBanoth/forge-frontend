export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown> | Array<unknown>;
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'LEARNER' | 'MENTOR' | 'ADMIN';
  action: string;
  targetType: 'USER' | 'PROJECT' | 'CERTIFICATE' | 'CAREER' | 'SKILL' | 'ASSESSMENT' | 'MENTOR_ASSIGNMENT';
  targetId: string;
  details: string;
}

export interface ManagedUserRecord {
  id: string;
  name: string;
  email: string;
  roles: Array<'LEARNER' | 'MENTOR' | 'ADMIN'>;
  isActive: boolean;
  targetCareer: string;
  assignedMentorId?: string;
  assignedMentorName?: string;
  readinessScore: number;
  verifiedSkillsCount: number;
  registeredDate: string;
}

export interface MentorDirectoryRecord {
  id: string;
  name: string;
  email: string;
  title: string;
  specialties: string[];
  assignedLearnerIds: string[];
  maxCapacity: number;
  completedReviewsCount: number;
  avgTurnaroundHours: number;
  avgRubricScore: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'PENDING_APPROVAL';
  joinedDate: string;
}
