import React, { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { StatCard } from '../shared/PageHeader';
import { VerificationBadge } from '../shared/VerificationBadge';
import { StatusIndicator } from '../shared/StatusIndicator';
import { showToast } from '../shared/ToastNotification';
import { useAuthStore } from '../../stores/authStore';
import type { Role, SkillLevel } from '../../types';
import { PlatformOverview } from '../admin/PlatformOverview';
import { AdminMentorScreen } from '../admin/AdminMentorScreen';
import { AdminLearnerScreen } from '../admin/AdminLearnerScreen';
import { AdminRegistrarScreen } from '../admin/AdminRegistrarScreen';
import {
  Shield,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Sliders,
  Settings,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Award,
  Layers,
  Search,
  Check,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminScreenProps {
  onNavigate: (path: string) => void;
  defaultTab?:
    | 'overview'
    | 'learners'
    | 'mentors'
    | 'registrar'
    | 'queue'
    | 'curriculum'
    | 'assessments'
    | 'users'
    | 'taxonomy';
}

interface MockUserAdmin {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  targetCareer: string;
  readinessScore: number;
  verifiedSkillsCount: number;
  registeredDate: string;
}

interface PendingReviewItem {
  id: string;
  learnerName: string;
  learnerEmail: string;
  projectTitle: string;
  githubUrl: string;
  technologies: string[];
  submittedAt: string;
  status: 'UNDER_REVIEW' | 'PASSED' | 'REJECTED';
  rubricScore?: number;
}

export function AdminScreen({ onNavigate, defaultTab = 'overview' }: AdminScreenProps) {
  const currentRoles = useAuthStore((state) => state.roles);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'learners'
    | 'mentors'
    | 'registrar'
    | 'queue'
    | 'curriculum'
    | 'assessments'
    | 'users'
    | 'taxonomy'
  >(defaultTab);

  // Simulated Admin Queue
  const [reviewQueue, setReviewQueue] = useState<PendingReviewItem[]>([
    {
      id: 'sub_101',
      learnerName: 'Rahul Sharma',
      learnerEmail: 'rahul.sharma@skillforge.io',
      projectTitle: 'Healthcare Appointment Scheduling API',
      githubUrl: 'https://github.com/rahulsharma-dev/healthcare-scheduler-fastapi',
      technologies: ['FastAPI', 'PostgreSQL', 'Docker', 'PyTest'],
      submittedAt: '2026-11-11T14:30:00Z',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'sub_102',
      learnerName: 'Elena Rostova',
      learnerEmail: 'elena.r@example.com',
      projectTitle: 'Distributed Background Job Queue with Docker Compose',
      githubUrl: 'https://github.com/elena-code/distributed-worker-redis',
      technologies: ['Docker', 'Redis', 'FastAPI', 'Celery'],
      submittedAt: '2026-11-11T18:15:00Z',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'sub_103',
      learnerName: 'Marcus Chen',
      learnerEmail: 'marcus.chen@example.org',
      projectTitle: 'E-Commerce ACID Order Processing System',
      githubUrl: 'https://github.com/mchen-dev/order-processing-acid',
      technologies: ['Python', 'PostgreSQL', 'SQLAlchemy', 'PyTest'],
      submittedAt: '2026-11-10T09:20:00Z',
      status: 'PASSED',
      rubricScore: 44,
    },
  ]);

  // Review Inspection Modal State
  const [selectedSubForReview, setSelectedSubForReview] = useState<PendingReviewItem | null>(null);
  const [rubricScores, setRubricScores] = useState({
    codeQuality: 8,
    apiDesign: 9,
    databaseDesign: 8,
    testing: 7,
    documentation: 8,
  });
  const [reviewFeedback, setReviewFeedback] = useState(
    'Strong test coverage and clean code structure. Approved for verified certificate.'
  );

  // Interactive Curriculum Phases State
  const [phases, setPhases] = useState([
    { order: 1, title: 'Python Advanced Concepts', req: 'None (Starting Course)', unlocked: 'Advanced', locked: false, materials: ['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'] },
    { order: 2, title: 'OOP & Clean Code Structure', req: 'Python Advanced Concepts', unlocked: 'Advanced', locked: false, materials: ['Video', 'Reading Notes', 'Code Examples'] },
    { order: 3, title: 'REST API Design', req: 'OOP & Clean Code Structure', unlocked: 'Advanced', locked: false, materials: ['Video', 'Reading Notes', 'Practice Exercise'] },
    { order: 4, title: 'FastAPI Web Services', req: 'REST API Design', unlocked: 'Advanced', locked: false, materials: ['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'] },
    { order: 5, title: 'PostgreSQL Database & Indexing', req: 'FastAPI Web Services', unlocked: 'Intermediate', locked: false, materials: ['Video', 'Code Examples', 'Practice Exercise'] },
    { order: 6, title: 'JWT Login & API Security', req: 'PostgreSQL Database & Indexing', unlocked: 'Intermediate', locked: false, materials: ['Video', 'Reading Notes', 'Code Examples'] },
    { order: 7, title: 'PyTest Automated Testing', req: 'JWT Login & API Security', unlocked: 'Intermediate', locked: false, materials: ['Video', 'Code Examples', 'Practice Exercise'] },
    { order: 8, title: 'Docker & Multi-Stage Containers', req: 'PyTest Automated Testing', unlocked: 'Intermediate', locked: false, materials: ['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'] },
    { order: 9, title: 'AWS Cloud & ECS Deployment', req: 'Docker & Multi-Stage Containers', unlocked: 'Intermediate', locked: true, materials: ['Video', 'Reading Notes'] },
  ]);
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [editingPhaseOrder, setEditingPhaseOrder] = useState<number | null>(null);
  const [phaseForm, setPhaseForm] = useState({
    title: '',
    req: 'Docker & Multi-Stage Containers',
    unlocked: 'Intermediate',
    materials: ['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'] as string[],
  });

  // Interactive Quiz Banks & 5 Question Types (PDF Section 15)
  const [selectedQuizTitle, setSelectedQuizTitle] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState([
    { id: 'q1', type: 'MCQ', prompt: 'Which FastAPI decorator handles HTTP POST requests?' },
    { id: 'q2', type: 'Multiple Select', prompt: 'Which Dockerfile steps help reduce final container image size?' },
    { id: 'q3', type: 'True/False', prompt: 'PostgreSQL B-Tree indexes speed up equality and range lookups.' },
    { id: 'q4', type: 'Coding', prompt: 'Write an async FastAPI route using Depends() for a DB session.' },
    { id: 'q5', type: 'Scenario Based', prompt: 'Your API slows down under concurrent writes. How do you diagnose lock contention?' },
  ]);
  const [newQuestionType, setNewQuestionType] = useState<'MCQ' | 'Multiple Select' | 'True/False' | 'Coding' | 'Scenario Based'>('MCQ');
  const [newQuestionPrompt, setNewQuestionPrompt] = useState('');

  // Skill Catalog + Career Role Competency Weights (PDF Section 8: sums to 100%)
  const [catalogSkills, setCatalogSkills] = useState([
    { name: 'Python Core & Advanced', cat: 'Programming', verifiedBy: 'Timed Quiz + Code Review' },
    { name: 'FastAPI Web Services', cat: 'Backend', verifiedBy: 'REST API Project' },
    { name: 'PostgreSQL Databases', cat: 'Database', verifiedBy: 'Database Project' },
    { name: 'Docker Containers', cat: 'DevOps', verifiedBy: 'Container Quiz + Project' },
    { name: 'PyTest Automated Testing', cat: 'Testing', verifiedBy: 'Project with 85%+ Tests' },
    { name: 'AWS Cloud Deployment', cat: 'Cloud', verifiedBy: 'ECS Cloud Project' },
  ]);
  const [isNewSkillOpen, setIsNewSkillOpen] = useState(false);
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    cat: 'Backend',
    verifiedBy: 'Timed Quiz + Project',
  });
  const [roleWeights, setRoleWeights] = useState([
    { skill: 'Python (Advanced)', weight: 20 },
    { skill: 'Object-Oriented Programming', weight: 10 },
    { skill: 'REST API Design', weight: 10 },
    { skill: 'FastAPI Framework', weight: 15 },
    { skill: 'PostgreSQL & SQL', weight: 15 },
    { skill: 'Git & Version Control', weight: 5 },
    { skill: 'Automated Testing (PyTest)', weight: 10 },
    { skill: 'Docker Containers', weight: 5 },
    { skill: 'AWS Cloud Basics', weight: 10 },
  ]);
  const totalRoleWeight = roleWeights.reduce((sum, item) => sum + item.weight, 0);

  // User Management State
  const [userList, setUserList] = useState<MockUserAdmin[]>([
    {
      id: 'usr_01',
      name: 'Rahul Sharma (You)',
      email: 'rahul.sharma@skillforge.io',
      roles: currentRoles,
      targetCareer: 'Python Backend Developer',
      readinessScore: 72,
      verifiedSkillsCount: 7,
      registeredDate: '2026-06-15',
    },
    {
      id: 'usr_02',
      name: 'Marcus Vance',
      email: 'marcus.vance@skillforge.io',
      roles: ['MENTOR', 'LEARNER'],
      targetCareer: 'Staff Backend Architect',
      readinessScore: 96,
      verifiedSkillsCount: 10,
      registeredDate: '2026-01-10',
    },
    {
      id: 'usr_03',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      roles: ['LEARNER'],
      targetCareer: 'Python Backend Developer',
      readinessScore: 64,
      verifiedSkillsCount: 5,
      registeredDate: '2026-08-01',
    },
    {
      id: 'usr_04',
      name: 'Devon Hayes',
      email: 'devon.h@skillforge.io',
      roles: ['ADMIN'],
      targetCareer: 'Engineering Director',
      readinessScore: 98,
      verifiedSkillsCount: 10,
      registeredDate: '2025-11-20',
    },
  ]);

  // Handle Review Submission Approval
  const handleApproveProject = (id: string) => {
    const total =
      rubricScores.codeQuality +
      rubricScores.apiDesign +
      rubricScores.databaseDesign +
      rubricScores.testing +
      rubricScores.documentation;

    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'PASSED', rubricScore: total } : item
      )
    );
    showToast('success', `Project approved with score ${total}/50. Verification status upgraded.`);
    setSelectedSubForReview(null);
  };

  const handleRejectProject = (id: string) => {
    setReviewQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
    showToast('warning', 'Project marked as Revision Required. Feedback sent to learner.');
    setSelectedSubForReview(null);
  };

  // Toggle user role
  const handleToggleUserRole = (userId: string, roleToToggle: Role) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const has = u.roles.includes(roleToToggle);
          const newRoles = has
            ? u.roles.filter((r) => r !== roleToToggle)
            : [...u.roles, roleToToggle];
          return { ...u, roles: newRoles.length > 0 ? newRoles : ['LEARNER'] };
        }
        return u;
      })
    );
    showToast('info', `Updated ${roleToToggle} role assignment.`);
  };

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Admin Dashboard"
        description="Manage courses, review student projects, oversee mentors, and manage user accounts and certificates."
        badge={
          <span className="font-mono text-xs border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
            ADMIN ACCESS
          </span>
        }
      />

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'learners', label: 'Learners', icon: GraduationCap },
          { id: 'mentors', label: 'Mentors', icon: ShieldCheck },
          { id: 'registrar', label: 'Certificates', icon: Award },
          {
            id: 'queue',
            label: `Review Queue (${reviewQueue.filter((q) => q.status === 'UNDER_REVIEW').length})`,
            icon: FolderGit2,
          },
          { id: 'curriculum', label: 'Courses & Rules', icon: Layers },
          { id: 'assessments', label: 'Quizzes & Tests', icon: CheckCircle2 },
          { id: 'users', label: 'Users & Roles', icon: Users },
          { id: 'taxonomy', label: 'Skill Catalog', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'mentors') {
                  window.history.pushState({}, '', '/admin/mentors');
                } else if (tab.id === 'learners') {
                  window.history.pushState({}, '', '/admin/learners');
                } else if (tab.id === 'registrar') {
                  window.history.pushState({}, '', '/admin/registrar');
                } else if (tab.id === 'overview') {
                  window.history.pushState({}, '', '/admin');
                }
              }}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-t-md transition-all whitespace-nowrap',
                isActive
                  ? 'border-b-2 border-foreground bg-surface text-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Platform Overview Summary */}
      {activeTab === 'overview' && (
        <PlatformOverview
          totalLearners={1428}
          averageReadinessScore={71.8}
          pendingReviewsCount={reviewQueue.filter((q) => q.status === 'UNDER_REVIEW').length}
          verificationPassRate={68.4}
          userList={userList}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Tab: Separate Dedicated Learner Administration */}
      {activeTab === 'learners' && (
        <AdminLearnerScreen onNavigate={onNavigate} />
      )}

      {/* Tab: Separate Dedicated Mentor Administration */}
      {activeTab === 'mentors' && (
        <AdminMentorScreen onNavigate={onNavigate} />
      )}

      {/* Tab: Separate Dedicated Registrar & Credentials Administration */}
      {activeTab === 'registrar' && (
        <AdminRegistrarScreen onNavigate={onNavigate} />
      )}

      {/* Tab 1: Mentor Review Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Project Review Queue
              </h2>
              <p className="text-xs text-muted-foreground">
                Grade student projects using the 5-part review checklist. Passing marks a project as verified.
              </p>
            </div>
            <span className="font-mono text-xs border border-border px-2.5 py-1 rounded bg-surface">
              {reviewQueue.filter((q) => q.status === 'UNDER_REVIEW').length} Waiting for Review
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface/60 border-b border-border font-mono text-[11px] text-muted-foreground uppercase">
                <tr>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Tools Used</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reviewQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{item.learnerName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{item.learnerEmail}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{item.projectTitle}</div>
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground mt-0.5"
                      >
                        <Github size={11} />
                        <span>View GitHub Code</span>
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.technologies.map((t) => (
                          <span
                            key={t}
                            className="rounded border border-border bg-surface px-1.5 py-0.2 font-mono text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <StatusIndicator status={item.status} size="sm" />
                      {item.rubricScore && (
                        <span className="block text-[10px] font-mono font-bold mt-0.5">
                          {item.rubricScore} / 50 pts
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {item.status === 'UNDER_REVIEW' ? (
                        <button
                          onClick={() => setSelectedSubForReview(item)}
                          className="rounded bg-foreground px-3 py-1 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
                        >
                          Review Project →
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedSubForReview(item)}
                          className="rounded border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          View Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Curriculum & Prerequisite Rules */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold tracking-tight">Course Order &amp; Prerequisite Rules</h2>
              <p className="text-xs text-muted-foreground">
                Set which course a student must pass before unlocking the next step, and track included lesson materials.
              </p>
            </div>
            <button
              onClick={() => {
                setPhaseForm({
                  title: '',
                  req: phases[phases.length - 1]?.title || 'None',
                  unlocked: 'Intermediate',
                  materials: ['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'],
                });
                setIsAddPhaseOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-mono font-bold text-background self-start"
            >
              <Plus size={13} />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            {phases.map((ph) => (
              <div
                key={ph.order}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface gap-3 text-xs font-mono"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-card border border-border font-bold mt-0.5">
                    {ph.order}
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-foreground text-sm font-sans block">
                      {ph.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Required First: {ph.req}
                    </span>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {ph.materials.map((mat) => (
                        <span
                          key={mat}
                          className="rounded border border-border bg-card px-1.5 py-0.2 text-[10px] text-muted-foreground"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="border border-border bg-card px-2 py-0.5 rounded text-[11px]">
                    Level: {ph.unlocked}
                  </span>
                  <button
                    onClick={() => {
                      setEditingPhaseOrder(ph.order);
                      setPhaseForm({
                        title: ph.title,
                        req: ph.req,
                        unlocked: ph.unlocked,
                        materials: ph.materials,
                      });
                    }}
                    className="rounded border border-border px-2.5 py-1 hover:bg-secondary"
                  >
                    Edit Rule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Quizzes & Question Bank */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight">Quizzes &amp; Passing Scores</h2>
              <p className="text-xs text-muted-foreground">
                Set passing scores and manage questions across all 5 question types (MCQ, Multiple Select, True/False, Coding, and Scenario).
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Python Core & Async Quiz', questions: 20, time: 25, passRate: '78%', threshold: 70 },
              { title: 'Docker Containers Quiz', questions: 15, time: 20, passRate: '61%', threshold: 70 },
              { title: 'PostgreSQL Query Quiz', questions: 20, time: 30, passRate: '72%', threshold: 70 },
            ].map((asmt, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-5 space-y-3 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Quiz #{idx + 1}</span>
                <h3 className="text-sm font-bold font-sans text-foreground">{asmt.title}</h3>
                <div className="space-y-1 text-muted-foreground border-t border-border pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-bold text-foreground">{asmt.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-bold text-foreground">{asmt.time} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Rate:</span>
                    <span className="font-bold text-foreground">{asmt.passRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-bold text-foreground">{asmt.threshold}%</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuizTitle(asmt.title)}
                  className="w-full mt-2 rounded border border-border py-1.5 hover:bg-secondary text-center font-semibold"
                >
                  Manage Questions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: User Directory & Roles */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight">User Accounts &amp; Roles</h2>
              <p className="text-xs text-muted-foreground">
                Turn Mentor or Admin permissions on or off for any user account. Changes take effect right away.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface/60 border-b border-border font-mono text-[11px] text-muted-foreground uppercase">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Target Job Role</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Current Roles</th>
                  <th className="py-3 px-4 text-right">Change Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {userList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{usr.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{usr.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {usr.targetCareer}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-foreground">{usr.readinessScore}%</span>
                      <span className="text-[10px] text-muted-foreground block">
                        ({usr.verifiedSkillsCount}/10 verified)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex gap-1 flex-wrap">
                        {usr.roles.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-foreground text-background px-1.5 py-0.2 text-[10px] font-bold"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleUserRole(usr.id, 'MENTOR')}
                          className={cn(
                            'rounded px-2 py-0.5 text-[10px] border transition-colors',
                            usr.roles.includes('MENTOR')
                              ? 'bg-foreground text-background font-bold border-foreground'
                              : 'border-border text-muted-foreground hover:text-foreground'
                          )}
                        >
                          Mentor
                        </button>
                        <button
                          onClick={() => handleToggleUserRole(usr.id, 'ADMIN')}
                          className={cn(
                            'rounded px-2 py-0.5 text-[10px] border transition-colors',
                            usr.roles.includes('ADMIN')
                              ? 'bg-foreground text-background font-bold border-foreground'
                              : 'border-border text-muted-foreground hover:text-foreground'
                          )}
                        >
                          Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Skill Catalog & Career Role Weight Builder (PDF Section 8) */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold tracking-tight">Skill Catalog</h2>
                <p className="text-xs text-muted-foreground">
                  All platform skills and how learners verify each one through quizzes and projects.
                </p>
              </div>
              <button
                onClick={() => setIsNewSkillOpen(true)}
                className="inline-flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-mono font-bold text-background self-start"
              >
                <Plus size={13} />
                <span>Add New Skill</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalogSkills.map((sk, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{sk.cat}</span>
                    <VerificationBadge status="VERIFIED" size="sm" />
                  </div>
                  <h4 className="font-bold text-sm font-sans text-foreground">{sk.name}</h4>
                  <p className="text-[11px] text-muted-foreground border-t border-border pt-1.5">
                    Verified by: {sk.verifiedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Role Weight Builder (PDF Section 8: Weights must sum to 100%) */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Career Role Skill Weights · Python Backend Developer
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set how much each skill counts toward the job readiness score. All weights must add up to 100%.
                </p>
              </div>
              <span
                className={cn(
                  'font-mono text-xs font-bold px-3 py-1 rounded border self-start sm:self-center',
                  totalRoleWeight === 100
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-dashed border-foreground text-foreground bg-surface'
                )}
              >
                Total Weight: {totalRoleWeight}% {totalRoleWeight === 100 ? '(Valid)' : '(Must equal 100%)'}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roleWeights.map((rw, idx) => (
                <div
                  key={rw.skill}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-mono"
                >
                  <span className="font-semibold text-foreground truncate">{rw.skill}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={rw.weight}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        setRoleWeights((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, weight: val } : item))
                        );
                      }}
                      className="w-16 rounded border border-border bg-card px-2 py-1 text-right font-bold text-foreground"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={totalRoleWeight !== 100}
                onClick={() =>
                  showToast('success', 'Saved Python Backend Developer skill weights (100%).')
                }
                className="rounded-lg bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 disabled:opacity-40 transition-colors"
              >
                Save Role Weights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Phase Modal */}
      {(isAddPhaseOpen || editingPhaseOrder !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">
                {editingPhaseOrder !== null ? `Edit Phase #${editingPhaseOrder}` : 'Add New Course Phase'}
              </h3>
              <button
                onClick={() => {
                  setIsAddPhaseOpen(false);
                  setEditingPhaseOrder(null);
                }}
                className="text-xs font-mono border border-border px-2 py-1 rounded hover:bg-secondary"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Course Phase Title</label>
                <input
                  type="text"
                  value={phaseForm.title}
                  onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })}
                  placeholder="e.g. Kubernetes & Service Scaling"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Required Course First</label>
                <input
                  type="text"
                  value={phaseForm.req}
                  onChange={(e) => setPhaseForm({ ...phaseForm, req: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Target Skill Level</label>
                <select
                  value={phaseForm.unlocked}
                  onChange={(e) => setPhaseForm({ ...phaseForm, unlocked: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-muted-foreground block">
                  Included Lesson Materials
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Video', 'Reading Notes', 'Code Examples', 'Practice Exercise'].map((mat) => {
                    const checked = phaseForm.materials.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() =>
                          setPhaseForm((prev) => ({
                            ...prev,
                            materials: checked
                              ? prev.materials.filter((m) => m !== mat)
                              : [...prev.materials, mat],
                          }))
                        }
                        className={cn(
                          'rounded border px-2.5 py-1 text-[11px] font-mono',
                          checked
                            ? 'bg-foreground text-background border-foreground font-bold'
                            : 'bg-surface border-border text-muted-foreground'
                        )}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => {
                  setIsAddPhaseOpen(false);
                  setEditingPhaseOrder(null);
                }}
                className="rounded border border-border px-3 py-1.5 text-xs font-mono hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!phaseForm.title.trim()) return;
                  if (editingPhaseOrder !== null) {
                    setPhases((prev) =>
                      prev.map((p) =>
                        p.order === editingPhaseOrder
                          ? { ...p, title: phaseForm.title, req: phaseForm.req, unlocked: phaseForm.unlocked, materials: phaseForm.materials }
                          : p
                      )
                    );
                    showToast('success', `Updated Phase #${editingPhaseOrder}.`);
                  } else {
                    setPhases((prev) => [
                      ...prev,
                      {
                        order: prev.length + 1,
                        title: phaseForm.title,
                        req: phaseForm.req,
                        unlocked: phaseForm.unlocked,
                        locked: true,
                        materials: phaseForm.materials,
                      },
                    ]);
                    showToast('success', `Added course phase: ${phaseForm.title}.`);
                  }
                  setIsAddPhaseOpen(false);
                  setEditingPhaseOrder(null);
                }}
                className="rounded bg-foreground px-4 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90"
              >
                Save Phase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Bank Modal (5 Question Types from PDF Section 15) */}
      {selectedQuizTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                  Question Bank
                </span>
                <h3 className="font-bold text-base">{selectedQuizTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedQuizTitle(null)}
                className="text-xs font-mono border border-border px-2 py-1 rounded hover:bg-secondary"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {quizQuestions.map((qq) => (
                <div
                  key={qq.id}
                  className="rounded border border-border bg-surface p-3 text-xs space-y-1"
                >
                  <span className="inline-block rounded border border-border bg-card px-1.5 py-0.2 font-mono text-[10px] font-bold">
                    {qq.type}
                  </span>
                  <p className="text-foreground font-medium">{qq.prompt}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2.5 text-xs">
              <span className="font-mono text-[11px] font-bold text-foreground block">
                Add New Question
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value as any)}
                  className="sm:w-44 rounded border border-border bg-surface px-2.5 py-2 text-xs font-mono"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Multiple Select">Multiple Select</option>
                  <option value="True/False">True/False</option>
                  <option value="Coding">Coding</option>
                  <option value="Scenario Based">Scenario Based</option>
                </select>
                <input
                  type="text"
                  value={newQuestionPrompt}
                  onChange={(e) => setNewQuestionPrompt(e.target.value)}
                  placeholder="Write the question prompt..."
                  className="flex-1 rounded border border-border bg-surface px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newQuestionPrompt.trim()) return;
                    setQuizQuestions((prev) => [
                      ...prev,
                      { id: `q_${Date.now()}`, type: newQuestionType, prompt: newQuestionPrompt.trim() },
                    ]);
                    setNewQuestionPrompt('');
                    showToast('success', `Added ${newQuestionType} question to ${selectedQuizTitle}.`);
                  }}
                  className="rounded bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Skill Modal */}
      {isNewSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Add Skill to Catalog</h3>
              <button
                onClick={() => setIsNewSkillOpen(false)}
                className="text-xs font-mono border border-border px-2 py-1 rounded hover:bg-secondary"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Skill Name</label>
                <input
                  type="text"
                  value={newSkillForm.name}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                  placeholder="e.g. Redis Caching"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Category</label>
                <input
                  type="text"
                  value={newSkillForm.cat}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, cat: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">How It Is Verified</label>
                <input
                  type="text"
                  value={newSkillForm.verifiedBy}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, verifiedBy: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setIsNewSkillOpen(false)}
                className="rounded border border-border px-3 py-1.5 text-xs font-mono hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newSkillForm.name.trim()) return;
                  setCatalogSkills((prev) => [...prev, newSkillForm]);
                  setNewSkillForm({ name: '', cat: 'Backend', verifiedBy: 'Timed Quiz + Project' });
                  setIsNewSkillOpen(false);
                  showToast('success', 'New skill added to the catalog.');
                }}
                className="rounded bg-foreground px-4 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Review Checklist Modal */}
      {selectedSubForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-xl border-2 border-foreground bg-card p-6 text-foreground space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Mentor Project Review
                </span>
                <h3 className="font-bold text-base">{selectedSubForReview.projectTitle}</h3>
                <span className="text-xs font-mono text-muted-foreground">
                  Student: {selectedSubForReview.learnerName} ({selectedSubForReview.learnerEmail})
                </span>
              </div>
              <button
                onClick={() => setSelectedSubForReview(null)}
                className="text-xs font-mono border border-border px-2 py-1 rounded hover:bg-secondary"
              >
                Close
              </button>
            </div>

            <div className="rounded border border-border bg-surface p-3 text-xs font-mono flex items-center justify-between">
              <span>GitHub Code Link:</span>
              <a
                href={selectedSubForReview.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold underline text-foreground"
              >
                <Github size={12} />
                <span>Open in GitHub</span>
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Grading Checklist (5 Criteria, Max 10 Each) */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                5-Part Grading Checklist (Out of 50 Points):
              </span>

              <div className="space-y-2.5">
                {[
                  { key: 'codeQuality', label: '1. Clean Code & Style Rules' },
                  { key: 'apiDesign', label: '2. API Routes & Input Validation' },
                  { key: 'databaseDesign', label: '3. PostgreSQL Setup & Safe Queries' },
                  { key: 'testing', label: '4. Automated PyTest Coverage (85%+)' },
                  { key: 'documentation', label: '5. Docker Setup & Clear Docs' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <span className="flex-1 text-[11px] truncate">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={(rubricScores as any)[item.key]}
                        onChange={(e) =>
                          setRubricScores({
                            ...rubricScores,
                            [item.key]: Number(e.target.value),
                          })
                        }
                        className="w-24 accent-foreground"
                      />
                      <span className="w-8 font-bold text-right">
                        {(rubricScores as any)[item.key]}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
                <span>Total Score:</span>
                <span className="underline">
                  {rubricScores.codeQuality +
                    rubricScores.apiDesign +
                    rubricScores.databaseDesign +
                    rubricScores.testing +
                    rubricScores.documentation}{' '}
                  / 50 pts
                </span>
              </div>
            </div>

            {/* Written Feedback Text */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Written Feedback &amp; Next Steps
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="w-full rounded border border-border bg-surface p-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Evaluation Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button
                onClick={() => handleRejectProject(selectedSubForReview.id)}
                className="rounded border border-foreground/50 px-4 py-2 text-xs font-mono hover:bg-secondary text-foreground"
              >
                Ask for Changes
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSubForReview(null)}
                  className="rounded border border-border px-3 py-2 text-xs font-mono hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveProject(selectedSubForReview.id)}
                  className="rounded bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Approve Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
