import React, { useState } from 'react';
import { PageHeader, StatCard } from '../shared/PageHeader';
import { StatusIndicator } from '../shared/StatusIndicator';
import { showToast } from '../shared/ToastNotification';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Filter,
  Sliders,
  UserPlus,
  Mail,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Github,
  X,
  AlertCircle,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminMentorScreenProps {
  onNavigate: (path: string) => void;
}

interface MentorRecord {
  id: string;
  name: string;
  email: string;
  title: string;
  specialties: string[];
  activeMenteesCount: number;
  maxCapacity: number;
  assignedReviewsCount: number;
  completedReviewsCount: number;
  avgTurnaroundHours: number;
  avgRubricScore: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'PENDING_APPROVAL';
  joinedDate: string;
}

export function AdminMentorScreen({ onNavigate }: AdminMentorScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedMentor, setSelectedMentor] = useState<MentorRecord | null>(null);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);

  // New mentor form state
  const [newMentorName, setNewMentorName] = useState('');
  const [newMentorEmail, setNewMentorEmail] = useState('');
  const [newMentorTitle, setNewMentorTitle] = useState('Senior Staff Engineer');
  const [newMentorSpecialty, setNewMentorSpecialty] = useState('Python Backend');

  const [mentors, setMentors] = useState<MentorRecord[]>([
    {
      id: 'mnt_01',
      name: 'Marcus Vance',
      email: 'marcus.vance@skillforge.io',
      title: 'Staff Backend Architect',
      specialties: ['FastAPI', 'PostgreSQL', 'System Design'],
      activeMenteesCount: 4,
      maxCapacity: 6,
      assignedReviewsCount: 2,
      completedReviewsCount: 42,
      avgTurnaroundHours: 11.2,
      avgRubricScore: 39.4,
      status: 'ACTIVE',
      joinedDate: '2026-01-10',
    },
    {
      id: 'mnt_02',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@skillforge.io',
      title: 'Principal DevOps Architect',
      specialties: ['Docker', 'Kubernetes', 'AWS ECS', 'CI/CD'],
      activeMenteesCount: 5,
      maxCapacity: 5,
      assignedReviewsCount: 1,
      completedReviewsCount: 58,
      avgTurnaroundHours: 9.8,
      avgRubricScore: 41.2,
      status: 'ACTIVE',
      joinedDate: '2025-08-15',
    },
    {
      id: 'mnt_03',
      name: 'Alexei Ivanov',
      email: 'alexei.i@skillforge.io',
      title: 'Senior Distributed Systems Lead',
      specialties: ['Kafka', 'Redis', 'Python Async', 'PyTest'],
      activeMenteesCount: 3,
      maxCapacity: 8,
      assignedReviewsCount: 3,
      completedReviewsCount: 29,
      avgTurnaroundHours: 15.4,
      avgRubricScore: 38.6,
      status: 'ACTIVE',
      joinedDate: '2026-03-01',
    },
    {
      id: 'mnt_04',
      name: 'Priya Sundaram',
      email: 'priya.s@skillforge.io',
      title: 'Staff Database Administrator',
      specialties: ['PostgreSQL', 'Query Optimization', 'Transaction Isolation'],
      activeMenteesCount: 2,
      maxCapacity: 6,
      assignedReviewsCount: 0,
      completedReviewsCount: 35,
      avgTurnaroundHours: 14.1,
      avgRubricScore: 42.0,
      status: 'ON_LEAVE',
      joinedDate: '2025-11-20',
    },
    {
      id: 'mnt_05',
      name: 'Liam Gallagher',
      email: 'liam.g@external-evaluator.io',
      title: 'Lead Software Architect',
      specialties: ['REST APIs', 'FastAPI', 'Microservices'],
      activeMenteesCount: 0,
      maxCapacity: 5,
      assignedReviewsCount: 0,
      completedReviewsCount: 0,
      avgTurnaroundHours: 0,
      avgRubricScore: 0,
      status: 'PENDING_APPROVAL',
      joinedDate: '2026-11-08',
    },
  ]);

  // Filtered mentors list
  const filteredMentors = mentors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'ALL' || m.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  const totalReviews = mentors.reduce((acc, m) => acc + m.completedReviewsCount, 0);
  const avgSla = (
    mentors.filter((m) => m.avgTurnaroundHours > 0).reduce((acc, m) => acc + m.avgTurnaroundHours, 0) /
    mentors.filter((m) => m.avgTurnaroundHours > 0).length
  ).toFixed(1);
  const activeCount = mentors.filter((m) => m.status === 'ACTIVE').length;
  const pendingApprovals = mentors.filter((m) => m.status === 'PENDING_APPROVAL').length;

  const handleApproveMentor = (id: string) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'ACTIVE' } : m))
    );
    showToast('success', 'Mentor approved and added to the active review team.');
    if (selectedMentor && selectedMentor.id === id) {
      setSelectedMentor({ ...selectedMentor, status: 'ACTIVE' });
    }
  };

  const handleToggleLeave = (id: string) => {
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
    showToast('info', 'Updated mentor availability.');
    if (selectedMentor && selectedMentor.id === id) {
      setSelectedMentor((prev) => (prev ? { ...prev, status: prev.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE' } : null));
    }
  };

  const handleCreateMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentorName || !newMentorEmail) return;
    const newM: MentorRecord = {
      id: `mnt_${Date.now()}`,
      name: newMentorName,
      email: newMentorEmail,
      title: newMentorTitle,
      specialties: [newMentorSpecialty, 'System Architecture'],
      activeMenteesCount: 0,
      maxCapacity: 6,
      assignedReviewsCount: 0,
      completedReviewsCount: 0,
      avgTurnaroundHours: 0,
      avgRubricScore: 0,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setMentors([newM, ...mentors]);
    setIsAddMentorOpen(false);
    setNewMentorName('');
    setNewMentorEmail('');
    showToast('success', `Mentor ${newM.name} added to the team.`);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Sub-Nav Breadcrumb to Admin Hub */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border pb-3">
        <button onClick={() => onNavigate('/admin')} className="hover:text-foreground">
          Admin Dashboard
        </button>
        <span>/</span>
        <span className="font-bold text-foreground">Mentor Team</span>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/learners')}
            className="hover:text-foreground text-[11px]"
          >
            Learners →
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
        title="Mentor Team Management"
        description="Manage mentors, monitor review turnaround times, balance student capacity, and approve new reviewers."
        badge={
          <span className="font-mono text-xs border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
            MENTOR TEAM
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/mentor')}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Open Mentor Workspace →
            </button>
            <button
              onClick={() => setIsAddMentorOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <UserPlus size={13} />
              <span>Add Mentor</span>
            </button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Mentors"
          value={activeCount}
          sublabel={`${mentors.length} total mentors`}
          icon={Users}
        />
        <StatCard
          title="Avg. Review Time"
          value={`${avgSla} hrs`}
          sublabel="Goal: Under 24 hours"
          icon={Clock}
        />
        <StatCard
          title="Projects Reviewed"
          value={totalReviews}
          sublabel="5-part grading checklist"
          icon={CheckCircle2}
        />
        <StatCard
          title="Waiting for Approval"
          value={pendingApprovals}
          sublabel="New mentor applications"
          icon={ShieldCheck}
        />
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentors by name, email, or job title..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-[11px] text-muted-foreground uppercase font-bold shrink-0">Filter:</span>
          {['ALL', 'FastAPI', 'Docker', 'PostgreSQL', 'Kafka'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSpecialty(cat)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs transition-colors border',
                selectedSpecialty === cat
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface/60 px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-foreground">
            MENTOR DIRECTORY ({filteredMentors.length})
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Passing Project Score: 35 / 50 pts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-surface/40 border-b border-border/80 font-mono text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="py-3 px-4">Mentor</th>
                <th className="py-3 px-4">Skill Areas</th>
                <th className="py-3 px-4">Assigned Students</th>
                <th className="py-3 px-4">Completed Reviews</th>
                <th className="py-3 px-4">Avg. Review Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{mentor.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{mentor.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{mentor.title}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {mentor.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded border border-border bg-surface px-1.5 py-0.2 font-mono text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{mentor.activeMenteesCount}</span>
                      <span className="text-muted-foreground">/ {mentor.maxCapacity} mentees</span>
                    </div>
                    {mentor.assignedReviewsCount > 0 && (
                      <span className="text-[10px] text-muted-foreground block">
                        ({mentor.assignedReviewsCount} reviews in queue)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-foreground">{mentor.completedReviewsCount} graded</span>
                    {mentor.avgRubricScore > 0 && (
                      <span className="text-[10px] text-muted-foreground block">
                        Avg: {mentor.avgRubricScore}/50 pts
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {mentor.avgTurnaroundHours > 0 ? (
                      <span
                        className={cn(
                          'font-bold',
                          mentor.avgTurnaroundHours <= 14 ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {mentor.avgTurnaroundHours} hrs
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {mentor.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 rounded bg-foreground text-background px-2 py-0.5 text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                    {mentor.status === 'ON_LEAVE' && (
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface text-muted-foreground px-2 py-0.5 text-[10px] font-mono">
                        ON LEAVE
                      </span>
                    )}
                    {mentor.status === 'PENDING_APPROVAL' && (
                      <span className="inline-flex items-center gap-1 rounded border border-foreground/60 bg-surface text-foreground font-bold px-2 py-0.5 text-[10px] font-mono">
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mentor Inspection & Capacity Drawer Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border-2 border-foreground bg-card p-6 space-y-6 text-foreground shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Mentor Details
                </span>
                <h3 className="text-lg font-bold">{selectedMentor.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedMentor.email} · {selectedMentor.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Active Students</span>
                <span className="font-extrabold text-base text-foreground">{selectedMentor.activeMenteesCount}</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Max Capacity</span>
                <span className="font-extrabold text-base text-foreground">{selectedMentor.maxCapacity}</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Avg. Review Time</span>
                <span className="font-extrabold text-base text-foreground">{selectedMentor.avgTurnaroundHours}h</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-[10px] text-muted-foreground block uppercase">Avg. Score</span>
                <span className="font-extrabold text-base text-foreground">{selectedMentor.avgRubricScore}/50</span>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-[11px] uppercase text-muted-foreground">Skill Areas:</span>
              <div className="flex gap-1.5 flex-wrap">
                {selectedMentor.specialties.map((spec) => (
                  <span key={spec} className="rounded border border-border bg-card px-2 py-0.5 text-xs">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 border-t border-border pt-4">
              <span className="font-mono text-xs font-bold uppercase text-foreground block">
                Mentor Actions:
              </span>

              <div className="flex flex-wrap gap-2">
                {selectedMentor.status === 'PENDING_APPROVAL' && (
                  <button
                    onClick={() => handleApproveMentor(selectedMentor.id)}
                    className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors"
                  >
                    Approve as Active Mentor
                  </button>
                )}

                <button
                  onClick={() => handleToggleLeave(selectedMentor.id)}
                  className="rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  {selectedMentor.status === 'ACTIVE' ? 'Set to On Leave' : 'Set to Active'}
                </button>

                <button
                  onClick={() => {
                    showToast('info', `Assigned next pending project review to ${selectedMentor.name}.`);
                  }}
                  className="rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Assign Next Project in Queue
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedMentor(null)}
                className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-mono font-semibold text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Mentor Modal */}
      {isAddMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Add a New Mentor</h3>
              <button
                onClick={() => setIsAddMentorOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMentor} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={newMentorName}
                  onChange={(e) => setNewMentorName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">WORK EMAIL</label>
                <input
                  type="email"
                  required
                  value={newMentorEmail}
                  onChange={(e) => setNewMentorEmail(e.target.value)}
                  placeholder="d.vance@skillforge.io"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">JOB TITLE</label>
                <input
                  type="text"
                  value={newMentorTitle}
                  onChange={(e) => setNewMentorTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">PRIMARY SKILL AREA</label>
                <select
                  value={newMentorSpecialty}
                  onChange={(e) => setNewMentorSpecialty(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="Python Backend">Python Backend</option>
                  <option value="Docker & DevOps">Docker & DevOps</option>
                  <option value="PostgreSQL & Database">PostgreSQL & Database</option>
                  <option value="Distributed Systems">Distributed Systems</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddMentorOpen(false)}
                  className="rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Save &amp; Add Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
