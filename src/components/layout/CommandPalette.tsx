import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Map,
  CheckSquare,
  FolderGit2,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Bot,
  Award,
  TrendingUp,
  BarChart3,
  ArrowRight,
  FileCode,
  X,
  GraduationCap,
  Settings,
  Compass,
  BookOpen,
  Sparkles,
  Users,
  FileText,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'learning' | 'assessments' | 'projects' | 'workspace';
  path: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles: Role[];
  tags?: string[];
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const { hasAnyRole } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems: SearchItem[] = useMemo(
    () => [
      // LEARNER ONLY ITEMS (/app/*)
      {
        id: 'l-dash',
        title: 'Learner Dashboard',
        subtitle: 'Readiness score, verified skills, and next best action',
        category: 'workspace',
        path: '/app/dashboard',
        icon: LayoutDashboard,
        badge: 'Learner',
        allowedRoles: ['LEARNER'],
        tags: ['dashboard', 'home', 'readiness'],
      },
      {
        id: 'l-career',
        title: 'Career Mapping & Skill Gaps',
        subtitle: 'Compare job matches and target career skill requirements',
        category: 'learning',
        path: '/app/career',
        icon: Compass,
        badge: 'Career',
        allowedRoles: ['LEARNER'],
        tags: ['career', 'skill gap', 'match'],
      },
      {
        id: 'l-roadmap',
        title: 'Learning Roadmap',
        subtitle: 'Prerequisite-ordered modules and technical milestones',
        category: 'learning',
        path: '/app/roadmap',
        icon: Map,
        badge: 'Roadmap',
        allowedRoles: ['LEARNER'],
        tags: ['roadmap', 'docker', 'fastapi', 'phases'],
      },
      {
        id: 'l-lesson-docker',
        title: 'Multi-Stage Dockerfile Architecture',
        subtitle: 'Course: Production Docker · Lesson 8.1',
        category: 'learning',
        path: '/app/roadmap/crs_docker_01/lessons/les_dock_01',
        icon: FileCode,
        badge: 'Lesson',
        allowedRoles: ['LEARNER'],
        tags: ['docker', 'lesson', 'containers'],
      },
      {
        id: 'l-courses',
        title: 'Courses & Lesson Progress',
        subtitle: 'Browse all active modules and complete lessons',
        category: 'learning',
        path: '/app/courses',
        icon: BookOpen,
        badge: 'Courses',
        allowedRoles: ['LEARNER'],
        tags: ['courses', 'lessons', 'modules'],
      },
      {
        id: 'l-quizzes',
        title: 'Quizzes & Timed Assessments',
        subtitle: 'Take timed skill quizzes to earn ASSESSED status',
        category: 'assessments',
        path: '/app/quizzes',
        icon: CheckSquare,
        badge: 'Quizzes',
        allowedRoles: ['LEARNER'],
        tags: ['quiz', 'assessment', 'test'],
      },
      {
        id: 'l-quiz-docker',
        title: 'Docker Containers Assessment',
        subtitle: '15 questions · 20 minutes · 70% passing score',
        category: 'assessments',
        path: '/app/quizzes/asmt_docker_01',
        icon: CheckSquare,
        badge: 'Ready',
        allowedRoles: ['LEARNER'],
        tags: ['docker', 'quiz', 'exam'],
      },
      {
        id: 'l-projects',
        title: 'Capstone Projects & Mentor Reviews',
        subtitle: 'Submit GitHub and demo links for review',
        category: 'projects',
        path: '/app/projects',
        icon: FolderGit2,
        badge: 'Projects',
        allowedRoles: ['LEARNER'],
        tags: ['project', 'github', 'submit'],
      },
      {
        id: 'l-readiness',
        title: 'Readiness Score & History',
        subtitle: 'Formula breakdown (35/25/25/15) and monthly growth',
        category: 'workspace',
        path: '/app/readiness',
        icon: TrendingUp,
        badge: 'Readiness',
        allowedRoles: ['LEARNER'],
        tags: ['readiness', 'score', 'history'],
      },
      {
        id: 'l-ai-mentor',
        title: 'AI Mentor Chat',
        subtitle: 'Ask questions and get personalized study recommendations',
        category: 'learning',
        path: '/app/ai-mentor',
        icon: Bot,
        badge: 'AI Mentor',
        allowedRoles: ['LEARNER'],
        tags: ['ai', 'mentor', 'chat'],
      },
      {
        id: 'l-ai-practice',
        title: 'AI Practice Questions',
        subtitle: 'Practice weak topics and update your skill gaps',
        category: 'learning',
        path: '/app/ai-practice',
        icon: Sparkles,
        badge: 'Practice',
        allowedRoles: ['LEARNER'],
        tags: ['ai', 'practice', 'questions'],
      },
      {
        id: 'l-analytics',
        title: 'Progress Analytics & Job Matches',
        subtitle: 'Weakest skills, improvement trends, and role matches',
        category: 'workspace',
        path: '/app/analytics',
        icon: BarChart3,
        badge: 'Analytics',
        allowedRoles: ['LEARNER'],
        tags: ['analytics', 'weakest', 'improvement'],
      },
      {
        id: 'l-certs',
        title: 'My Certificates & Verification Links',
        subtitle: 'View qualification checklist and share verification IDs',
        category: 'workspace',
        path: '/app/certificates',
        icon: Award,
        badge: 'Certificates',
        allowedRoles: ['LEARNER'],
        tags: ['certificates', 'verify', 'qr'],
      },
      {
        id: 'l-profile',
        title: 'My Profile, Skills & Expiry Dates',
        subtitle: 'Manage skills, verification badges, and account preferences',
        category: 'workspace',
        path: '/app/profile',
        icon: Settings,
        badge: 'Profile',
        allowedRoles: ['LEARNER'],
        tags: ['profile', 'skills', 'settings', 'expiry'],
      },

      // MENTOR ITEMS (/mentor/*) - NEVER visible to LEARNER
      {
        id: 'm-dash',
        title: 'Mentor Dashboard',
        subtitle: 'Assigned learners, pending reviews, and recent submissions',
        category: 'workspace',
        path: '/mentor/dashboard',
        icon: LayoutDashboard,
        badge: 'Mentor',
        allowedRoles: ['MENTOR', 'ADMIN'],
        tags: ['mentor', 'dashboard'],
      },
      {
        id: 'm-learners',
        title: 'Assigned Learners Directory',
        subtitle: 'Search learners and open read-only dossiers & AI chat history',
        category: 'workspace',
        path: '/mentor/learners',
        icon: Users,
        badge: 'Mentor',
        allowedRoles: ['MENTOR', 'ADMIN'],
        tags: ['learners', 'students', 'dossier'],
      },
      {
        id: 'm-reviews',
        title: 'Pending Project Reviews',
        subtitle: 'Grade submissions across 8 engineering criteria',
        category: 'projects',
        path: '/mentor/reviews',
        icon: FolderGit2,
        badge: 'Queue',
        allowedRoles: ['MENTOR', 'ADMIN'],
        tags: ['reviews', 'grade', 'approve'],
      },
      {
        id: 'm-feedback',
        title: 'Mentor Feedback History',
        subtitle: 'Past graded submissions and written feedback',
        category: 'projects',
        path: '/mentor/feedback',
        icon: MessageSquare,
        badge: 'History',
        allowedRoles: ['MENTOR', 'ADMIN'],
        tags: ['feedback', 'history'],
      },

      // ADMIN ITEMS (/admin/*) - Strictly ADMIN ONLY
      {
        id: 'a-dash',
        title: 'Admin Platform Overview',
        subtitle: 'Platform users, courses, certificates, and average readiness',
        category: 'workspace',
        path: '/admin/dashboard',
        icon: Shield,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['admin', 'overview', 'analytics'],
      },
      {
        id: 'a-users',
        title: 'Admin: Users & Roles',
        subtitle: 'Create Learner/Mentor/Admin users, disable accounts, edit roles',
        category: 'workspace',
        path: '/admin/users',
        icon: Users,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['users', 'roles', 'disable'],
      },
      {
        id: 'a-learners',
        title: 'Admin: All Learners',
        subtitle: 'Monitor learner readiness scores and manual verifications',
        category: 'workspace',
        path: '/admin/learners',
        icon: GraduationCap,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['learners', 'readiness'],
      },
      {
        id: 'a-mentors',
        title: 'Admin: Mentors & Assignments',
        subtitle: 'Manage mentors and assign learners to mentors',
        category: 'workspace',
        path: '/admin/mentors',
        icon: ShieldCheck,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['mentors', 'assign'],
      },
      {
        id: 'a-skills',
        title: 'Admin: Skill Catalog',
        subtitle: 'Configure platform skills and proficiency levels',
        category: 'workspace',
        path: '/admin/skills',
        icon: Sliders,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['skills', 'catalog'],
      },
      {
        id: 'a-careers',
        title: 'Admin: Career Roles & Weights',
        subtitle: 'Edit required skills and importance % (must equal 100%)',
        category: 'workspace',
        path: '/admin/careers',
        icon: Compass,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['careers', 'weights', '100%'],
      },
      {
        id: 'a-courses',
        title: 'Admin: Courses, Modules & Lessons',
        subtitle: 'Manage curriculum hierarchy and prerequisite rules',
        category: 'workspace',
        path: '/admin/courses',
        icon: BookOpen,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['courses', 'modules', 'lessons'],
      },
      {
        id: 'a-assessments',
        title: 'Admin: Assessments & Question Bank',
        subtitle: 'Manage quiz thresholds and 5-type question banks',
        category: 'workspace',
        path: '/admin/assessments',
        icon: CheckSquare,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['assessments', 'quizzes', 'questions'],
      },
      {
        id: 'a-projects',
        title: 'Admin: Projects & Submissions',
        subtitle: 'View capstone catalog and all learner submissions',
        category: 'workspace',
        path: '/admin/projects',
        icon: FolderGit2,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['projects', 'submissions'],
      },
      {
        id: 'a-certs',
        title: 'Admin: Certificates & Rules',
        subtitle: 'Configure passing rules, view issued records, or revoke IDs',
        category: 'workspace',
        path: '/admin/certificates',
        icon: Award,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['certificates', 'revoke', 'rules'],
      },
      {
        id: 'a-audit',
        title: 'Admin: Audit Logs',
        subtitle: 'Review role, project, and certificate security logs',
        category: 'workspace',
        path: '/admin/audit-logs',
        icon: FileText,
        badge: 'Admin',
        allowedRoles: ['ADMIN'],
        tags: ['audit', 'logs'],
      },
    ],
    []
  );

  // Strict RBAC filtering: do not even include restricted role links in search pool
  const roleScopedItems = useMemo(
    () => allItems.filter((item) => hasAnyRole(item.allowedRoles)),
    [allItems, hasAnyRole]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return roleScopedItems;
    const q = query.toLowerCase().trim();
    return roleScopedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge?.toLowerCase().includes(q) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [roleScopedItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    onNavigate(item.path);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border-2 border-foreground bg-card text-foreground shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-surface/40">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, courses, quizzes, or projects..."
            className="w-full bg-transparent text-sm sm:text-base font-sans font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-card px-2 py-0.5 text-[11px] font-mono font-bold text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-border/40 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="mx-auto h-8 w-8 text-muted-foreground opacity-40" />
              <p className="font-mono text-sm font-bold text-foreground">No matching items found</p>
              <p className="text-xs text-muted-foreground">
                No pages match &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 cursor-pointer transition-all my-0.5',
                    isSelected
                      ? 'bg-foreground text-background'
                      : 'hover:bg-secondary/60 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                        isSelected
                          ? 'border-background/40 bg-background/20 text-background'
                          : 'border-border bg-surface text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase shrink-0 border',
                              isSelected
                                ? 'bg-background text-foreground border-background'
                                : 'bg-surface border-border text-muted-foreground'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-xs truncate font-mono mt-0.5',
                          isSelected ? 'text-background/80' : 'text-muted-foreground'
                        )}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'font-mono text-[11px] hidden sm:inline-block',
                        isSelected ? 'text-background/70' : 'text-muted-foreground'
                      )}
                    >
                      {item.path}
                    </span>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4',
                        isSelected ? 'text-background' : 'text-muted-foreground opacity-50'
                      )}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
