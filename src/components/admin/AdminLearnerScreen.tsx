import React, { useState } from 'react';
import { PageHeader, StatCard } from '../shared/PageHeader';
import { ReadinessBadge } from '../shared/ReadinessBadge';
import { VerificationBadge } from '../shared/VerificationBadge';
import { showToast } from '../shared/ToastNotification';
import type { ReadinessLevel } from '../../types';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  X,
  ExternalLink,
  Sliders,
  FileText,
  UserCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLearnerScreenProps {
  onNavigate: (path: string) => void;
}

interface LearnerAdminRecord {
  id: string;
  name: string;
  email: string;
  targetCareer: string;
  readinessScore: number;
  readinessLevel: ReadinessLevel;
  verifiedSkillsCount: number;
  totalRequiredSkills: number;
  criticalSkillGap: string;
  assignedMentor: string;
  lastActive: string;
  isAtRisk: boolean;
  atRiskReason?: string;
  assessmentsTaken: number;
  projectsSubmitted: number;
}

export function AdminLearnerScreen({ onNavigate }: AdminLearnerScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AT_RISK' | 'READY_FOR_HIRE'>('ALL');
  const [selectedLearner, setSelectedLearner] = useState<LearnerAdminRecord | null>(null);

  // Override modal state
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideSkillName, setOverrideSkillName] = useState('Docker Containerization');
  const [overrideReason, setOverrideReason] = useState('Verified via prior production GitHub PR history and technical interview.');

  const [learners, setLearners] = useState<LearnerAdminRecord[]>([
    {
      id: 'usr_01',
      name: 'Rahul Sharma (Current User)',
      email: 'rahul.sharma@skillforge.io',
      targetCareer: 'Python Backend Developer',
      readinessScore: 72,
      readinessLevel: 'JUNIOR_READY',
      verifiedSkillsCount: 7,
      totalRequiredSkills: 10,
      criticalSkillGap: 'Docker Containerization',
      assignedMentor: 'Marcus Vance',
      lastActive: 'Today, 10:15 AM',
      isAtRisk: false,
      assessmentsTaken: 3,
      projectsSubmitted: 1,
    },
    {
      id: 'usr_03',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      targetCareer: 'Python Backend Developer',
      readinessScore: 64,
      readinessLevel: 'DEVELOPING',
      verifiedSkillsCount: 5,
      totalRequiredSkills: 10,
      criticalSkillGap: 'Redis Caching & Background Queues',
      assignedMentor: 'Marcus Vance',
      lastActive: 'Yesterday',
      isAtRisk: true,
      atRiskReason: 'Stalled on Docker phase for >14 days',
      assessmentsTaken: 2,
      projectsSubmitted: 1,
    },
    {
      id: 'usr_05',
      name: 'Marcus Chen',
      email: 'marcus.chen@example.org',
      targetCareer: 'Python Backend Developer',
      readinessScore: 88,
      readinessLevel: 'STRONG_CANDIDATE',
      verifiedSkillsCount: 9,
      totalRequiredSkills: 10,
      criticalSkillGap: 'AWS Cloud ECS Infrastructure',
      assignedMentor: 'Dr. Sarah Jenkins',
      lastActive: '2 days ago',
      isAtRisk: false,
      assessmentsTaken: 4,
      projectsSubmitted: 2,
    },
    {
      id: 'usr_06',
      name: 'Aisha Patel',
      email: 'aisha.p@example.com',
      targetCareer: 'Data Engineer',
      readinessScore: 92,
      readinessLevel: 'HIGHLY_READY',
      verifiedSkillsCount: 10,
      totalRequiredSkills: 10,
      criticalSkillGap: 'None (Fully Verified)',
      assignedMentor: 'Alexei Ivanov',
      lastActive: '3 hours ago',
      isAtRisk: false,
      assessmentsTaken: 5,
      projectsSubmitted: 2,
    },
    {
      id: 'usr_08',
      name: 'Kevin O’Connor',
      email: 'kevin.oc@example.net',
      targetCareer: 'Python Backend Developer',
      readinessScore: 48,
      readinessLevel: 'FOUNDATION_REQUIRED',
      verifiedSkillsCount: 3,
      totalRequiredSkills: 10,
      criticalSkillGap: 'FastAPI High-Performance Services',
      assignedMentor: 'Unassigned',
      lastActive: '12 days ago',
      isAtRisk: true,
      atRiskReason: 'Failed timed assessment twice (<60%)',
      assessmentsTaken: 2,
      projectsSubmitted: 0,
    },
    {
      id: 'usr_09',
      name: 'Zoe Martinez',
      email: 'zoe.m@example.org',
      targetCareer: 'Cloud Infrastructure Engineer',
      readinessScore: 78,
      readinessLevel: 'STRONG_CANDIDATE',
      verifiedSkillsCount: 8,
      totalRequiredSkills: 10,
      criticalSkillGap: 'Kubernetes Cluster Architecture',
      assignedMentor: 'Dr. Sarah Jenkins',
      lastActive: '4 days ago',
      isAtRisk: false,
      assessmentsTaken: 4,
      projectsSubmitted: 1,
    },
  ]);

  // Filtering
  const filteredLearners = learners.filter((lrn) => {
    const matchesSearch =
      lrn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lrn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lrn.targetCareer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lrn.criticalSkillGap.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || lrn.readinessLevel === tierFilter;

    let matchesStatus = true;
    if (statusFilter === 'AT_RISK') matchesStatus = lrn.isAtRisk;
    if (statusFilter === 'READY_FOR_HIRE') matchesStatus = lrn.readinessScore >= 75;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalLearnersCount = 1428;
  const readyForHireCount = learners.filter((l) => l.readinessScore >= 75).length;
  const atRiskCount = learners.filter((l) => l.isAtRisk).length;
  const avgReadiness = (learners.reduce((acc, l) => acc + l.readinessScore, 0) / learners.length).toFixed(1);

  const handleResetAssessment = (learnerName: string) => {
    showToast('success', `Assessment retry unlocked for ${learnerName}. Lock cleared.`);
  };

  const handleApplyOverride = () => {
    if (!selectedLearner) return;
    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === selectedLearner.id) {
          const newVerified = Math.min(l.totalRequiredSkills, l.verifiedSkillsCount + 1);
          const newScore = Math.min(100, l.readinessScore + 6);
          return {
            ...l,
            verifiedSkillsCount: newVerified,
            readinessScore: newScore,
            isAtRisk: false,
          };
        }
        return l;
      })
    );
    showToast('success', `Skill verified for ${overrideSkillName}. Readiness score updated.`);
    setIsOverrideModalOpen(false);
    setSelectedLearner(null);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Sub-Nav Breadcrumb to Admin Hub */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border pb-3">
        <button onClick={() => onNavigate('/admin')} className="hover:text-foreground">
          Admin Dashboard
        </button>
        <span>/</span>
        <span className="font-bold text-foreground">Learner Directory</span>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/mentors')}
            className="hover:text-foreground text-[11px]"
          >
            Mentors →
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('/admin/registrar')}
            className="hover:text-foreground text-[11px]"
          >
            Certificates →
          </button>
        </span>
      </div>

      <PageHeader
        title="Learner Directory & Progress"
        description="Track active learners, check readiness scores, verify skills manually, and support students who need help."
        badge={
          <span className="font-mono text-xs border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
            MANAGE STUDENTS
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              View Learner Dashboard →
            </button>
            <button
              onClick={() => {
                setStatusFilter(statusFilter === 'AT_RISK' ? 'ALL' : 'AT_RISK');
                showToast('info', 'Updated student filter.');
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-colors border',
                statusFilter === 'AT_RISK'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card border-border text-foreground hover:bg-secondary'
              )}
            >
              <AlertTriangle size={13} />
              <span>{statusFilter === 'AT_RISK' ? 'Showing At-Risk' : 'Filter At-Risk'}</span>
            </button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Active Learners"
          value={totalLearnersCount}
          sublabel="Enrolled across career tracks"
          icon={Users}
        />
        <StatCard
          title="Average Readiness"
          value={`${avgReadiness}%`}
          sublabel="Target readiness: 75% or higher"
          icon={GraduationCap}
        />
        <StatCard
          title="Job-Ready Students"
          value={readyForHireCount}
          sublabel="Students with verified portfolios"
          icon={Award}
        />
        <StatCard
          title="Needs Support"
          value={atRiskCount}
          sublabel="Inactive or failed quizzes"
          icon={AlertTriangle}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learners by name, email, role, or skill gap..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-[11px] text-muted-foreground uppercase font-bold shrink-0">Level:</span>
          {['ALL', 'STRONG_CANDIDATE', 'JUNIOR_READY', 'DEVELOPING', 'FOUNDATION_REQUIRED'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs transition-colors border whitespace-nowrap',
                tierFilter === t
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'ALL' ? 'All Levels' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Learners Directory Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface/60 px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-foreground">
            ALL LEARNERS ({filteredLearners.length})
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Verified Skills &amp; Progress
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-surface/40 border-b border-border/80 font-mono text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Verified Skills</th>
                <th className="py-3 px-4">Top Skill Gap</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLearners.map((lrn) => (
                <tr key={lrn.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-foreground">{lrn.name}</div>
                      {lrn.isAtRisk && (
                        <span
                          className="rounded bg-foreground text-background px-1.5 py-0.2 font-mono text-[9px] font-extrabold uppercase shrink-0"
                          title={lrn.atRiskReason}
                        >
                          AT RISK
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">{lrn.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Active: {lrn.lastActive}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {lrn.targetCareer}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-foreground text-sm">{lrn.readinessScore}%</span>
                      <ReadinessBadge level={lrn.readinessLevel} size="sm" />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{lrn.verifiedSkillsCount}</span>
                      <span className="text-muted-foreground">/ {lrn.totalRequiredSkills} verified</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      {lrn.assessmentsTaken} tests · {lrn.projectsSubmitted} projects
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className={cn(lrn.criticalSkillGap.includes('None') ? 'text-muted-foreground' : 'text-foreground font-semibold')}>
                      {lrn.criticalSkillGap}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {lrn.assignedMentor}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLearner(lrn)}
                      className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Learner Details & Admin Actions Modal */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border-2 border-foreground bg-card p-6 space-y-6 text-foreground shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Student Profile
                </span>
                <h3 className="text-lg font-bold">{selectedLearner.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedLearner.email} · Target: {selectedLearner.targetCareer}
                </p>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={18} />
              </button>
            </div>

            {selectedLearner.isAtRisk && (
              <div className="rounded-lg border border-foreground/40 bg-surface p-3 font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <span className="font-bold block">NEEDS ATTENTION:</span>
                  <span className="text-muted-foreground">{selectedLearner.atRiskReason}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Readiness</span>
                <span className="font-extrabold text-base text-foreground">{selectedLearner.readinessScore}%</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Verified Skills</span>
                <span className="font-extrabold text-base text-foreground">{selectedLearner.verifiedSkillsCount}/10</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Assessments</span>
                <span className="font-extrabold text-base text-foreground">{selectedLearner.assessmentsTaken}</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Assigned Mentor</span>
                <span className="font-bold text-xs text-foreground truncate block">{selectedLearner.assignedMentor}</span>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="space-y-3 border-t border-border pt-4">
              <span className="font-mono text-xs font-bold uppercase text-foreground block">
                Student Actions:
              </span>

              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <button
                  onClick={() => setIsOverrideModalOpen(true)}
                  className="rounded-lg bg-foreground px-4 py-2 font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Verify Skill Manually
                </button>

                <button
                  onClick={() => handleResetAssessment(selectedLearner.name)}
                  className="rounded-lg border border-border bg-surface px-4 py-2 font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Unlock Timed Assessment
                </button>

                <button
                  onClick={() => {
                    showToast('info', `Assigned ${selectedLearner.name} to Mentor Marcus Vance.`);
                    setSelectedLearner({ ...selectedLearner, assignedMentor: 'Marcus Vance' });
                  }}
                  className="rounded-lg border border-border bg-surface px-4 py-2 font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Change Mentor
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedLearner(null)}
                className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-mono font-semibold text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Skill Manually Sub-Modal */}
      {isOverrideModalOpen && selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Verify Skill Manually</h3>
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <div className="font-mono text-xs space-y-3">
              <p className="text-muted-foreground font-sans">
                Manually mark a skill as verified for this student with a short note for the record.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">SKILL TO VERIFY</label>
                <select
                  value={overrideSkillName}
                  onChange={(e) => setOverrideSkillName(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="Docker Containerization">Docker Containerization</option>
                  <option value="FastAPI High-Performance Services">FastAPI High-Performance Services</option>
                  <option value="PostgreSQL Relational Architecture">PostgreSQL Relational Architecture</option>
                  <option value="PyTest Automated Test Suites">PyTest Automated Test Suites</option>
                  <option value="AWS Cloud Infrastructure">AWS Cloud Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">REASON FOR VERIFYING</label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface p-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Explain proof source (e.g., technical interview, external GitHub project)..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyOverride}
                  className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Confirm &amp; Verify Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
