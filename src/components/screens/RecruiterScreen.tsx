import React, { useState } from 'react';
import { PageHeader, StatCard } from '../shared/PageHeader';
import { ReadinessBadge } from '../shared/ReadinessBadge';
import { VerificationBadge } from '../shared/VerificationBadge';
import { showToast } from '../shared/ToastNotification';
import type { ReadinessLevel, SkillLevel } from '../../types';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Award,
  Plus,
  Search,
  Building2,
  Star,
  ShieldCheck,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RecruiterScreenProps {
  onNavigate: (path: string) => void;
}

interface JobRequirement {
  skillName: string;
  requiredLevel: SkillLevel;
}

interface CompanyJobProfile {
  id: string;
  companyName: string;
  roleTitle: string;
  location: string;
  requirements: JobRequirement[];
}

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  compatibilityScore: number;
  readinessLevel: ReadinessLevel;
  verifiedSkills: Array<{ name: string; level: SkillLevel; status: 'VERIFIED' | 'PROJECT_VERIFIED' | 'ASSESSED' }>;
  claimedOnlySkills: string[];
  projectsPassed: number;
  certificatesCount: number;
  shortlisted: boolean;
  githubUrl: string;
}

export function RecruiterScreen({ onNavigate }: RecruiterScreenProps) {
  const [jobs, setJobs] = useState<CompanyJobProfile[]>([
    {
      id: 'job_abc_py',
      companyName: 'ABC Technologies',
      roleTitle: 'Python Backend Developer',
      location: 'San Francisco, CA (Hybrid)',
      requirements: [
        { skillName: 'Python', requiredLevel: 'Advanced' },
        { skillName: 'FastAPI', requiredLevel: 'Intermediate' },
        { skillName: 'PostgreSQL', requiredLevel: 'Intermediate' },
        { skillName: 'Docker', requiredLevel: 'Beginner' },
        { skillName: 'AWS', requiredLevel: 'Beginner' },
        { skillName: 'Testing', requiredLevel: 'Intermediate' },
      ],
    },
    {
      id: 'job_abc_qa',
      companyName: 'ABC Technologies',
      roleTitle: 'QA Automation Engineer',
      location: 'Remote',
      requirements: [
        { skillName: 'Python', requiredLevel: 'Intermediate' },
        { skillName: 'Testing', requiredLevel: 'Advanced' },
        { skillName: 'REST APIs', requiredLevel: 'Intermediate' },
        { skillName: 'Docker', requiredLevel: 'Beginner' },
      ],
    },
  ]);

  const [selectedJobId, setSelectedJobId] = useState<string>('job_abc_py');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);

  // Create job form state
  const [newCompany, setNewCompany] = useState('ABC Technologies');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newSkillText, setNewSkillText] = useState('Python (Advanced), FastAPI (Intermediate), PostgreSQL (Intermediate)');

  const [candidates, setCandidates] = useState<CandidateProfile[]>([
    {
      id: 'cand_a',
      name: 'Candidate A · Aisha Patel',
      email: 'aisha.p@example.com',
      compatibilityScore: 91,
      readinessLevel: 'HIGHLY_READY',
      verifiedSkills: [
        { name: 'Python', level: 'Advanced', status: 'VERIFIED' },
        { name: 'FastAPI', level: 'Advanced', status: 'PROJECT_VERIFIED' },
        { name: 'PostgreSQL', level: 'Intermediate', status: 'VERIFIED' },
        { name: 'Testing', level: 'Intermediate', status: 'ASSESSED' },
        { name: 'Docker', level: 'Intermediate', status: 'PROJECT_VERIFIED' },
        { name: 'AWS', level: 'Beginner', status: 'ASSESSED' },
      ],
      claimedOnlySkills: [],
      projectsPassed: 3,
      certificatesCount: 4,
      shortlisted: true,
      githubUrl: 'https://github.com/aishap-data',
    },
    {
      id: 'cand_b',
      name: 'Candidate B · Rahul Sharma',
      email: 'rahul.sharma@skillforge.io',
      compatibilityScore: 76,
      readinessLevel: 'JUNIOR_READY',
      verifiedSkills: [
        { name: 'Python', level: 'Advanced', status: 'ASSESSED' },
        { name: 'FastAPI', level: 'Intermediate', status: 'ASSESSED' },
        { name: 'PostgreSQL', level: 'Intermediate', status: 'PROJECT_VERIFIED' },
        { name: 'Testing', level: 'Intermediate', status: 'ASSESSED' },
      ],
      claimedOnlySkills: ['Docker (Self-Declared)', 'AWS (Self-Declared)'],
      projectsPassed: 1,
      certificatesCount: 3,
      shortlisted: false,
      githubUrl: 'https://github.com/rahulsharma-dev',
    },
    {
      id: 'cand_c',
      name: 'Candidate C · Elena Rostova',
      email: 'elena.r@example.com',
      compatibilityScore: 64,
      readinessLevel: 'DEVELOPING',
      verifiedSkills: [
        { name: 'Python', level: 'Intermediate', status: 'ASSESSED' },
        { name: 'PostgreSQL', level: 'Intermediate', status: 'ASSESSED' },
        { name: 'Docker', level: 'Beginner', status: 'PROJECT_VERIFIED' },
      ],
      claimedOnlySkills: ['FastAPI (Self-Declared)', 'Testing (Self-Declared)'],
      projectsPassed: 1,
      certificatesCount: 1,
      shortlisted: false,
      githubUrl: 'https://github.com/elena-code',
    },
  ]);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verifiedSkills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVerified = !verifiedOnlyFilter || c.verifiedSkills.length >= 3;
    return matchesSearch && matchesVerified;
  });

  const handleToggleShortlist = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, shortlisted: !c.shortlisted } : c))
    );
    const target = candidates.find((c) => c.id === id);
    showToast(
      'success',
      target?.shortlisted
        ? `Removed ${target.name} from shortlist.`
        : `Shortlisted ${target?.name} for ${activeJob.roleTitle}.`
    );
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    const parsedRequirements: JobRequirement[] = newSkillText
      .split(',')
      .map((part) => {
        const clean = part.trim();
        const match = clean.match(/^(.*?)\s*\((Beginner|Intermediate|Advanced|Expert)\)$/i);
        if (match) {
          return {
            skillName: match[1].trim(),
            requiredLevel: (match[2].charAt(0).toUpperCase() +
              match[2].slice(1).toLowerCase()) as SkillLevel,
          };
        }
        return { skillName: clean, requiredLevel: 'Intermediate' as SkillLevel };
      })
      .filter((r) => r.skillName.length > 0);

    const newJob: CompanyJobProfile = {
      id: `job_${Date.now()}`,
      companyName: newCompany.trim() || 'Partner Company',
      roleTitle: newRoleTitle.trim(),
      location: newLocation.trim() || 'Remote',
      requirements: parsedRequirements,
    };

    setJobs([newJob, ...jobs]);
    setSelectedJobId(newJob.id);
    setNewRoleTitle('');
    setIsNewJobOpen(false);
    showToast('success', `Created job profile for ${newJob.roleTitle}.`);
  };

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Employer & Recruiter Hub"
        description="Create job skill profiles and compare candidates using verified assessment scores and mentor-reviewed projects instead of unverified resume claims."
        actions={
          <button
            onClick={() => setIsNewJobOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Job Profile</span>
          </button>
        }
      />

      {/* Top KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Job Profiles"
          value={jobs.length}
          sublabel="Active company hiring roles"
          icon={Briefcase}
        />
        <StatCard
          title="Matched Candidates"
          value={filteredCandidates.length}
          sublabel="Ranked by verified skill fit"
          icon={Users}
        />
        <StatCard
          title="Shortlisted"
          value={candidates.filter((c) => c.shortlisted).length}
          sublabel="Ready for team interviews"
          icon={Star}
        />
        <StatCard
          title="Top Match Score"
          value="91%"
          sublabel="Verified skills + project proof"
          icon={Award}
        />
      </div>

      {/* Job Profile Selector + Requirements Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground">Company Job Profiles</h2>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-2.5">
            {jobs.map((job) => {
              const isSelected = job.id === activeJob.id;
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    'w-full text-left rounded-lg border p-3.5 transition-all space-y-1',
                    isSelected
                      ? 'border-2 border-foreground bg-surface'
                      : 'border-border bg-card hover:bg-secondary/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {job.companyName}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {job.location}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-foreground">{job.roleTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.requirements.length} required skills
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-xs font-mono text-muted-foreground">
                {activeJob.companyName} · {activeJob.location}
              </span>
              <h2 className="text-base font-bold text-foreground">
                Required Skills for {activeJob.roleTitle}
              </h2>
            </div>
            <ShieldCheck className="h-5 w-5 text-foreground" />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {activeJob.requirements.map((req, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-mono"
              >
                <span className="font-semibold text-foreground">{req.skillName}</span>
                <span className="text-muted-foreground">{req.requiredLevel}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
            SkillForge compares candidates using their <strong className="text-foreground">verified skills</strong> from timed tests and mentor-approved projects rather than resume claims alone.
          </div>
        </div>
      </div>

      {/* Candidate Ranking & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates by name or verified skill..."
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            onClick={() => setVerifiedOnlyFilter(!verifiedOnlyFilter)}
            className={cn(
              'rounded-lg border px-3 py-2 text-xs font-mono font-semibold transition-colors',
              verifiedOnlyFilter
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {verifiedOnlyFilter ? 'Showing Verified Skills Only' : 'Show All Candidates'}
          </button>
        </div>

        <div className="space-y-4">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="rounded-xl border border-border bg-card p-5 space-y-4 hover:border-foreground/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">{cand.name}</h3>
                    <ReadinessBadge level={cand.readinessLevel} size="sm" />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {cand.email} · {cand.projectsPassed} projects passed · {cand.certificatesCount} certificates
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[11px] text-muted-foreground block">Job Match</span>
                    <span className="text-2xl font-extrabold text-foreground tabular-nums">
                      {cand.compatibilityScore}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleShortlist(cand.id)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold transition-colors',
                        cand.shortlisted
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-surface border-border text-foreground hover:bg-secondary'
                      )}
                    >
                      {cand.shortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(cand)}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold hover:bg-secondary transition-colors"
                    >
                      View Proof
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Skills vs Unverified Claims */}
              <div className="grid gap-3 md:grid-cols-2 border-t border-border/60 pt-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-foreground block">
                    Verified Skills ({cand.verifiedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.verifiedSkills.map((vs) => (
                      <span
                        key={vs.name}
                        className="rounded border border-border bg-surface px-2 py-0.5 text-[11px] font-mono text-foreground"
                      >
                        {vs.name} · {vs.level}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    Self-Declared Only ({cand.claimedOnlySkills.length})
                  </span>
                  {cand.claimedOnlySkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cand.claimedOnlySkills.map((cs) => (
                        <span
                          key={cs}
                          className="rounded border border-dashed border-border px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                        >
                          {cs}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      All required skills have been verified.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Proof Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border-2 border-foreground bg-card p-6 space-y-5 text-foreground shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold">{selectedCandidate.name}</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  {selectedCandidate.compatibilityScore}% match for {activeJob.roleTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-foreground block">
                Verified Skill Breakdown
              </span>
              <div className="space-y-1.5">
                {selectedCandidate.verifiedSkills.map((vs) => (
                  <div
                    key={vs.name}
                    className="flex items-center justify-between rounded border border-border bg-surface px-3 py-2 text-xs font-mono"
                  >
                    <span>
                      {vs.name} ({vs.level})
                    </span>
                    <VerificationBadge status={vs.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <button
                onClick={() => {
                  showToast('success', `Sent role assessment invite to ${selectedCandidate.email}.`);
                  setSelectedCandidate(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Role Assessment</span>
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-mono hover:bg-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Profile Modal */}
      {isNewJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Create Company Job Profile</h3>
              <button
                onClick={() => setIsNewJobOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Cloud Engineer"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">
                  Required Skills (comma separated)
                </label>
                <textarea
                  rows={2}
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewJobOpen(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-mono hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90"
                >
                  Publish Job Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
