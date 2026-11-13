import type { Role, Permission } from '../types/auth';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  LEARNER: [
    'projects:submit',
    'readiness:view',
    'quizzes:take',
    'skills:declare',
  ],
  MENTOR: [
    'projects:review',
    'projects:verify',
    'readiness:view',
  ],
  ADMIN: [
    'projects:submit',
    'projects:review',
    'projects:verify',
    'content:manage',
    'candidates:view',
    'readiness:view',
    'quizzes:take',
    'skills:declare',
    'assessments:manage',
    'users:manage',
  ],
  RECRUITER: [
    'candidates:view',
    'readiness:view',
  ],
};

export const ROLE_HOME: Record<Role, string> = {
  LEARNER: '/app/dashboard',
  MENTOR: '/mentor/dashboard',
  ADMIN: '/admin/dashboard',
  RECRUITER: '/app/dashboard',
};

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  iconName: string;
  allowedRoles: Role[];
  section: 'primary' | 'secondary' | 'catalog' | 'governance';
  badge?: string;
}

export const LEARNER_NAV_ITEMS: NavItemConfig[] = [
  { id: 'l-dashboard', label: 'Dashboard', href: '/app/dashboard', iconName: 'LayoutDashboard', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-career', label: 'Career Mapping', href: '/app/career', iconName: 'Compass', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-roadmap', label: 'Roadmap', href: '/app/roadmap', iconName: 'Map', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-courses', label: 'Courses', href: '/app/courses', iconName: 'BookOpen', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-quizzes', label: 'Quizzes & Tests', href: '/app/quizzes', iconName: 'CheckSquare', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-projects', label: 'Projects', href: '/app/projects', iconName: 'FolderGit2', allowedRoles: ['LEARNER'], section: 'primary' },
  { id: 'l-readiness', label: 'Readiness Score', href: '/app/readiness', iconName: 'TrendingUp', allowedRoles: ['LEARNER'], section: 'secondary' },
  { id: 'l-ai-mentor', label: 'AI Mentor', href: '/app/ai-mentor', iconName: 'Bot', allowedRoles: ['LEARNER'], section: 'secondary' },
  { id: 'l-ai-practice', label: 'AI Practice', href: '/app/ai-practice', iconName: 'Sparkles', allowedRoles: ['LEARNER'], section: 'secondary' },
  { id: 'l-analytics', label: 'Analytics', href: '/app/analytics', iconName: 'BarChart3', allowedRoles: ['LEARNER'], section: 'secondary' },
  { id: 'l-certificates', label: 'Certificates', href: '/app/certificates', iconName: 'Award', allowedRoles: ['LEARNER'], section: 'secondary' },
  { id: 'l-profile', label: 'My Profile & Skills', href: '/app/profile', iconName: 'User', allowedRoles: ['LEARNER'], section: 'secondary' },
];

export const MENTOR_NAV_ITEMS: NavItemConfig[] = [
  { id: 'm-dashboard', label: 'Mentor Dashboard', href: '/mentor/dashboard', iconName: 'LayoutDashboard', allowedRoles: ['MENTOR', 'ADMIN'], section: 'primary' },
  { id: 'm-learners', label: 'Assigned Learners', href: '/mentor/learners', iconName: 'Users', allowedRoles: ['MENTOR', 'ADMIN'], section: 'primary' },
  { id: 'm-reviews', label: 'Project Reviews', href: '/mentor/reviews', iconName: 'FolderGit2', allowedRoles: ['MENTOR', 'ADMIN'], section: 'primary' },
  { id: 'm-feedback', label: 'Feedback History', href: '/mentor/feedback', iconName: 'MessageSquare', allowedRoles: ['MENTOR', 'ADMIN'], section: 'secondary' },
];

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  { id: 'a-dashboard', label: 'Dashboard', href: '/admin/dashboard', iconName: 'LayoutDashboard', allowedRoles: ['ADMIN'], section: 'primary' },
  { id: 'a-users', label: 'Users & Roles', href: '/admin/users', iconName: 'Users', allowedRoles: ['ADMIN'], section: 'primary' },
  { id: 'a-learners', label: 'Learners', href: '/admin/learners', iconName: 'GraduationCap', allowedRoles: ['ADMIN'], section: 'primary' },
  { id: 'a-mentors', label: 'Mentors', href: '/admin/mentors', iconName: 'ShieldCheck', allowedRoles: ['ADMIN'], section: 'primary' },
  { id: 'a-skills', label: 'Skills Catalog', href: '/admin/skills', iconName: 'Sliders', allowedRoles: ['ADMIN'], section: 'catalog' },
  { id: 'a-careers', label: 'Career Roles', href: '/admin/careers', iconName: 'Compass', allowedRoles: ['ADMIN'], section: 'catalog' },
  { id: 'a-courses', label: 'Courses & Lessons', href: '/admin/courses', iconName: 'BookOpen', allowedRoles: ['ADMIN'], section: 'catalog' },
  { id: 'a-assessments', label: 'Assessments', href: '/admin/assessments', iconName: 'CheckSquare', allowedRoles: ['ADMIN'], section: 'catalog' },
  { id: 'a-projects', label: 'Projects & Queue', href: '/admin/projects', iconName: 'FolderGit2', allowedRoles: ['ADMIN'], section: 'catalog' },
  { id: 'a-certificates', label: 'Certificates', href: '/admin/certificates', iconName: 'Award', allowedRoles: ['ADMIN'], section: 'governance' },
  { id: 'a-analytics', label: 'Analytics', href: '/admin/analytics', iconName: 'BarChart3', allowedRoles: ['ADMIN'], section: 'governance' },
  { id: 'a-audit', label: 'Audit Logs', href: '/admin/audit-logs', iconName: 'FileText', allowedRoles: ['ADMIN'], section: 'governance' },
];

// Keep NAV_ITEMS alias for any legacy shared imports, scoped safely
export const NAV_ITEMS: NavItemConfig[] = LEARNER_NAV_ITEMS;
