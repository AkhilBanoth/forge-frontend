import React, { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { StatCard } from '../shared/PageHeader';
import { VerificationBadge } from '../shared/VerificationBadge';
import { ReadinessBadge } from '../shared/ReadinessBadge';
import { showToast } from '../shared/ToastNotification';
import { useAuthStore } from '../../stores/authStore';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Users,
  ExternalLink,
  Github,
  Check,
  X,
  Sliders,
  FileText,
  AlertTriangle,
  Award,
  ChevronRight,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MentorScreenProps {
  onNavigate: (path: string) => void;
}

interface ProjectSubmission {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  projectTitle: string;
  targetRole: string;
  githubUrl: string;
  technologies: string[];
  submittedAt: string;
  status: 'UNDER_REVIEW' | 'PASSED' | 'REJECTED';
  rubricScore?: number;
  feedback?: string;
}

interface MenteeCohortMember {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  readinessScore: number;
  verifiedSkills: number;
  criticalGap: string;
  lastActive: string;
}

export function MentorScreen({ onNavigate }: MentorScreenProps) {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'mentees'>('queue');

  // Review Queue state
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([
    {
      id: 'sub_101',
      learnerId: 'usr_01',
      learnerName: 'Rahul Sharma',
      learnerEmail: 'rahul.sharma@skillforge.io',
      projectTitle: 'Healthcare Appointment Scheduling API with FastAPI',
      targetRole: 'Python Backend Developer',
      githubUrl: 'https://github.com/rahulsharma-dev/healthcare-scheduler-fastapi',
      technologies: ['FastAPI', 'PostgreSQL', 'Docker', 'PyTest', 'Alembic'],
      submittedAt: '2026-11-11T14:30:00Z',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'sub_102',
      learnerId: 'usr_03',
      learnerName: 'Elena Rostova',
      learnerEmail: 'elena.r@example.com',
      projectTitle: 'Distributed Background Job Queue with Docker Compose',
      targetRole: 'Python Backend Developer',
      githubUrl: 'https://github.com/elena-code/distributed-worker-redis',
      technologies: ['Docker', 'Redis', 'FastAPI', 'Celery'],
      submittedAt: '2026-11-11T18:15:00Z',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'sub_103',
      learnerId: 'usr_05',
      learnerName: 'Marcus Chen',
      learnerEmail: 'marcus.chen@example.org',
      projectTitle: 'E-Commerce ACID Order Processing System',
      targetRole: 'Python Backend Developer',
      githubUrl: 'https://github.com/mchen-dev/order-processing-acid',
      technologies: ['Python', 'PostgreSQL', 'SQLAlchemy', 'PyTest'],
      submittedAt: '2026-11-10T09:20:00Z',
      status: 'PASSED',
      rubricScore: 44,
      feedback: 'Excellent transaction isolation handling with unit and integration test coverage. Approved.',
    },
    {
      id: 'sub_104',
      learnerId: 'usr_06',
      learnerName: 'Aisha Patel',
      learnerEmail: 'aisha.p@example.com',
      projectTitle: 'Real-Time Event Stream Analytics with Kafka',
      targetRole: 'Data Engineer',
      githubUrl: 'https://github.com/aishap-data/kafka-event-stream',
      technologies: ['Apache Kafka', 'Python', 'Docker', 'InfluxDB'],
      submittedAt: '2026-11-09T11:00:00Z',
      status: 'PASSED',
      rubricScore: 46,
      feedback: 'Production-ready consumer group offset handling and Docker compose setup.',
    },
  ]);

  // Selected for grading modal
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [rubricScores, setRubricScores] = useState({
    codeQuality: 8,
    apiDesign: 9,
    databaseDesign: 8,
    testing: 7,
    documentation: 8,
  });
  const [feedbackText, setFeedbackText] = useState(
    'Clean code structure and solid test coverage above 80%. Approved for project verification.'
  );

  // Mentees cohort
  const [mentees] = useState<MenteeCohortMember[]>([
    {
      id: 'usr_01',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@skillforge.io',
      targetRole: 'Python Backend Developer',
      readinessScore: 72,
      verifiedSkills: 7,
      criticalGap: 'Docker Containerization',
      lastActive: 'Today, 10:15 AM',
    },
    {
      id: 'usr_03',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      targetRole: 'Python Backend Developer',
      readinessScore: 64,
      verifiedSkills: 5,
      criticalGap: 'Redis & Caching',
      lastActive: 'Yesterday',
    },
    {
      id: 'usr_07',
      name: 'James Wilson',
      email: 'j.wilson@example.com',
      targetRole: 'Staff Backend Architect',
      readinessScore: 84,
      verifiedSkills: 9,
      criticalGap: 'Distributed Systems Tracing',
      lastActive: '3 days ago',
    },
  ]);

  const pendingCount = submissions.filter((s) => s.status === 'UNDER_REVIEW').length;
  const passedCount = submissions.filter((s) => s.status === 'PASSED').length;

  const currentTotalRubric =
    rubricScores.codeQuality +
    rubricScores.apiDesign +
    rubricScores.databaseDesign +
    rubricScores.testing +
    rubricScores.documentation;

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: 'PASSED',
              rubricScore: currentTotalRubric,
              feedback: feedbackText,
            }
          : sub
      )
    );
    showToast('success', `Project approved with score ${currentTotalRubric}/50. Verification badge issued.`);
    setSelectedSub(null);
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: 'REJECTED',
              feedback: feedbackText,
            }
          : sub
      )
    );
    showToast('warning', 'Changes requested. Your feedback has been sent to the student.');
    setSelectedSub(null);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Mentor Header */}
      <PageHeader
        title="Mentor Review & Grading Portal"
        description="Review student code submissions and give helpful feedback. Passing grades help students verify their skills and earn badges."
        badge={
          <span className="font-mono text-xs border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Senior Mentor
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              ← Learner Dashboard
            </button>
            <button
              onClick={() => onNavigate('/admin')}
              className="rounded-lg border border-foreground bg-foreground px-3 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
            >
              Admin Dashboard →
            </button>
          </div>
        }
      />

      {/* Mentor Performance Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Projects Waiting"
          value={pendingCount}
          sublabel="Average turnaround: 14 hours"
          icon={FolderGit2}
        />
        <StatCard
          title="Reviews Completed"
          value="42"
          sublabel="Graded with standard rubric"
          icon={CheckCircle2}
        />
        <StatCard
          title="My Students"
          value={mentees.length}
          sublabel="Active learning roadmaps"
          icon={Users}
        />
        <StatCard
          title="Average Score"
          value="39.4 / 50"
          sublabel="Passing score: 35 or higher"
          icon={Award}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-t-md transition-all whitespace-nowrap',
            activeTab === 'queue'
              ? 'border-b-2 border-foreground bg-surface text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
          )}
        >
          <FolderGit2 className="h-4 w-4" />
          <span>Projects to Review ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-t-md transition-all whitespace-nowrap',
            activeTab === 'history'
              ? 'border-b-2 border-foreground bg-surface text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Past Reviews ({passedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentees')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-t-md transition-all whitespace-nowrap',
            activeTab === 'mentees'
              ? 'border-b-2 border-foreground bg-surface text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
          )}
        >
          <Users className="h-4 w-4" />
          <span>My Students ({mentees.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Review Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Projects Waiting for Your Review
              </h2>
              <p className="text-xs text-muted-foreground">
                Review student code, test coverage, and documentation. Passing grades award the student a Verified Project badge.
              </p>
            </div>
            <span className="font-mono text-xs border border-border px-2.5 py-1 rounded bg-surface">
              Target: Under 24h
            </span>
          </div>

          <div className="space-y-3">
            {submissions
              .filter((s) => s.status === 'UNDER_REVIEW')
              .map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs hover:border-foreground/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          ID: {sub.id}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {sub.learnerName} ({sub.learnerEmail})
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          Target: {sub.targetRole}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground">{sub.projectTitle}</h3>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/30 bg-surface px-2.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Waiting for Review</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="text-muted-foreground text-[11px]">Tools Used:</span>
                    {sub.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border bg-surface px-2 py-0.5 text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-3">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[280px] sm:max-w-md">{sub.githubUrl}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        setFeedbackText(
                          `Review for ${sub.projectTitle}: Clean code structure and solid test coverage. Approved for verified project badge.`
                        );
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors shadow-xs"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Review &amp; Grade Project</span>
                    </button>
                  </div>
                </div>
              ))}

            {submissions.filter((s) => s.status === 'UNDER_REVIEW').length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-foreground" />
                <h4 className="font-bold text-sm">All Caught Up</h4>
                <p className="text-xs text-muted-foreground">
                  Every submitted project has been reviewed and graded.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Past Reviews */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Completed Project Reviews
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {passedCount} projects approved
            </span>
          </div>

          <div className="space-y-3">
            {submissions
              .filter((s) => s.status !== 'UNDER_REVIEW')
              .map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                        <span>{sub.learnerName}</span>
                        <span>·</span>
                        <span>{sub.targetRole}</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{sub.projectTitle}</h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="rounded bg-foreground text-background font-bold px-2 py-0.5">
                        {sub.rubricScore}/50 pts
                      </span>
                      <VerificationBadge status="PROJECT_VERIFIED" size="sm" />
                    </div>
                  </div>

                  {sub.feedback && (
                    <div className="rounded border border-border bg-surface p-3 text-xs text-muted-foreground">
                      <span className="font-bold font-mono text-foreground block mb-0.5">
                        Mentor Feedback:
                      </span>
                      <p>{sub.feedback}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1 border-t border-border">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      <Github className="h-3 w-3" />
                      <span>View GitHub Code</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span>Reviewed by Senior Mentor</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Assigned Students */}
      {activeTab === 'mentees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                My Assigned Students
              </h2>
              <p className="text-xs text-muted-foreground">
                Students receiving your feedback and project reviews as they prepare for engineering roles.
              </p>
            </div>
            <span className="font-mono text-xs border border-border px-2.5 py-1 rounded bg-surface">
              {mentees.length} Active Students
            </span>
          </div>

          <div className="space-y-3">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-foreground/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{mentee.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">({mentee.email})</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      Target Job: <span className="font-semibold text-foreground">{mentee.targetRole}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <span className="block text-[10px] text-muted-foreground uppercase">Readiness</span>
                      <span className="text-base font-extrabold text-foreground">{mentee.readinessScore}%</span>
                    </div>
                    <ReadinessBadge
                      level={mentee.readinessScore >= 75 ? 'STRONG_CANDIDATE' : 'JUNIOR_READY'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-border pt-3 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">VERIFIED SKILLS</span>
                    <span className="font-bold text-foreground">{mentee.verifiedSkills} Skills Verified</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">MAIN SKILL TO IMPROVE</span>
                    <span className="font-bold text-foreground">{mentee.criticalGap}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">LAST ACTIVE</span>
                    <span className="font-bold text-foreground">{mentee.lastActive}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-border/50">
                  <button
                    onClick={() => {
                      showToast('info', `Study note sent to ${mentee.name}.`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 text-xs font-mono hover:bg-secondary text-foreground"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Send Note</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('/roadmap');
                    }}
                    className="inline-flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90"
                  >
                    <span>View Roadmap</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive 5-Part Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-foreground bg-card p-6 space-y-6 text-foreground shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Project Grading Checklist (50 Points Max)
                </span>
                <h3 className="text-lg font-bold">{selectedSub.projectTitle}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Student: {selectedSub.learnerName} · Target Job: {selectedSub.targetRole}
                </p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Repository Info */}
            <div className="rounded-lg border border-border bg-surface p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">GitHub Code Link:</span>
                <a
                  href={selectedSub.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground underline"
                >
                  <Github className="h-3 w-3" />
                  <span>Open in GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {selectedSub.technologies.map((t) => (
                  <span key={t} className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 5-Score Rubric Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase">5-Part Grading Score</span>
                <span className="font-mono text-sm font-extrabold border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded">
                  Total: {currentTotalRubric} / 50 pts
                </span>
              </div>

              {[
                { key: 'codeQuality', label: '1. Clean Code & Structure', desc: 'Follows Python style rules, clear folders, and proper error handling' },
                { key: 'apiDesign', label: '2. REST API Design & Validation', desc: 'Correct HTTP methods, status codes, schemas, and input checks' },
                { key: 'databaseDesign', label: '3. Database Setup & Migrations', desc: 'Proper indexes, table links, migrations, and safe DB sessions' },
                { key: 'testing', label: '4. Automated Testing Coverage', desc: 'PyTest unit and API tests covering 80% or more of the code' },
                { key: 'documentation', label: '5. Setup Docs & Docker', desc: 'Clear README instructions, Docker setup, and example env file' },
              ].map((criteria) => (
                <div key={criteria.key} className="space-y-1.5 rounded-lg border border-border bg-surface p-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-foreground">{criteria.label}</span>
                      <p className="text-[10px] text-muted-foreground">{criteria.desc}</p>
                    </div>
                    <span className="text-sm font-extrabold text-foreground tabular-nums">
                      {(rubricScores as any)[criteria.key]} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={(rubricScores as any)[criteria.key]}
                    onChange={(e) =>
                      setRubricScores({
                        ...rubricScores,
                        [criteria.key]: Number(e.target.value),
                      })
                    }
                    className="w-full accent-foreground cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Written Feedback Textarea */}
            <div className="space-y-1.5 font-mono">
              <label className="text-xs font-bold text-foreground block">
                WRITTEN FEEDBACK &amp; SUGGESTIONS
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-3 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                placeholder="Share what worked well and any changes the student should make..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Passing Score: &ge; 35 / 50 pts
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleReject(selectedSub.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-mono font-bold text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Ask for Changes</span>
                </button>

                <button
                  onClick={() => handleApprove(selectedSub.id)}
                  disabled={currentTotalRubric < 35}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 disabled:opacity-40 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve Project ({currentTotalRubric}/50)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
