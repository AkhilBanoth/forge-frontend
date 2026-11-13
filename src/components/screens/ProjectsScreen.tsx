import React, { useState, useEffect } from 'react';
import { projectService } from '../../lib/api/services';
import type { Project, ProjectSubmission } from '../../types';
import { StatusIndicator } from '../shared/StatusIndicator';
import { PageHeader } from '../shared/PageHeader';
import { showToast } from '../shared/ToastNotification';
import {
  FolderGit2,
  Check,
  AlertCircle,
  ExternalLink,
  Github,
  Clock,
  ShieldCheck,
  UserCheck,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProjectsScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedProjectForSubmit, setSelectedProjectForSubmit] = useState<Project | null>(null);

  // Submission Form State
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [techUsed, setTechUsed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const [pRes, sRes] = await Promise.all([
        projectService.getProjects(),
        projectService.getSubmissions(),
      ]);
      setProjects(pRes.data);
      setSubmissions(sRes.data);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForSubmit || !githubRepoUrl || !description) return;
    setIsSubmitting(true);
    try {
      const newSub = await projectService.submitProject({
        projectId: selectedProjectForSubmit.id,
        projectTitle: selectedProjectForSubmit.title,
        githubRepoUrl,
        liveDemoUrl,
        description,
        technologiesUsed: techUsed.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setSubmissions((prev) => [newSub.data, ...prev]);
      setSelectedProjectForSubmit(null);
      setGithubRepoUrl('');
      setLiveDemoUrl('');
      setDescription('');
      setTechUsed('');
      showToast('success', 'Project submitted! Awaiting mentor inspection & rubric evaluation.');
    } catch {
      showToast('error', 'Failed to submit project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Mentor-Reviewed Capstone Projects"
        description="Real-world system implementations evaluated against strict production rubrics. Passing a project review awards PROJECT_VERIFIED status."
        badge={
          <span className="font-mono text-xs border border-foreground bg-card px-2 py-0.5 rounded font-bold">
            Human Mentor Verification
          </span>
        }
      />

      {/* Business Rule 4 Enforced Banner */}
      <div className="rounded-lg border border-border bg-surface p-4 text-xs font-mono text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-foreground shrink-0" />
          <span>
            <strong className="text-foreground">Business Rule 4: </strong> Learners cannot self-verify projects. All codebases require formal senior engineer evaluation.
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold border border-border px-1.5 py-0.5 rounded shrink-0">
          Peer-Reviewed
        </span>
      </div>

      {/* Submitted Projects with Reviews */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-muted-foreground">
          Your Project Submissions & Mentor Reviews
        </h2>

        {submissions.map((sub) => {
          const isPassed = sub.status === 'PASSED';
          const isUnderReview = sub.status === 'UNDER_REVIEW' || sub.status === 'SUBMITTED';

          return (
            <div
              key={sub.id}
              className="rounded-xl border border-border bg-card p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Submission ID: {sub.id}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {sub.projectTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <StatusIndicator
                    status={sub.status}
                    label={isUnderReview ? 'Awaiting Mentor Review' : undefined}
                  />
                  {sub.githubRepoUrl && (
                    <a
                      href={sub.githubRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono border border-border px-2.5 py-1 rounded hover:bg-secondary"
                    >
                      <Github size={12} />
                      <span>Code Repo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies Tag list */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold mr-1">
                  Stack:
                </span>
                {sub.technologiesUsed.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Mentor Review Breakdown (if reviewed) */}
              {sub.review && (
                <div className="rounded-lg border-2 border-foreground bg-surface p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-foreground" />
                      <span className="font-mono text-xs font-bold text-foreground">
                        Mentor Evaluation by {sub.review.reviewerName}
                      </span>
                    </div>

                    <div className="font-mono text-xs font-extrabold text-foreground">
                      Total Rubric Score: {sub.review.totalScore} / {sub.review.maxScore} pts
                    </div>
                  </div>

                  {/* Rubric Criteria 8-Score Breakdown */}
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 font-mono text-xs">
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Code Quality</span>
                      <span className="font-bold">{sub.review.scores.codeQuality}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">API Design</span>
                      <span className="font-bold">{sub.review.scores.apiDesign}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Database Design</span>
                      <span className="font-bold">{sub.review.scores.databaseDesign}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Auth &amp; Security</span>
                      <span className="font-bold">{sub.review.scores.auth}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Testing</span>
                      <span className="font-bold">{sub.review.scores.testing}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Error Handling</span>
                      <span className="font-bold">{sub.review.scores.errorHandling}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Documentation</span>
                      <span className="font-bold">{sub.review.scores.documentation}/10</span>
                    </div>
                    <div className="rounded border border-border bg-card p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">Deployment</span>
                      <span className="font-bold">{sub.review.scores.deployment}/10</span>
                    </div>
                  </div>

                  {/* Written Feedback Text */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                      Architect Review Notes:
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-card p-3 rounded border border-border">
                      "{sub.review.feedbackText}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Projects Catalog */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-muted-foreground">
          Capstone Project Catalog
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Target: {proj.targetSkill.name}</span>
                  <span>Est: {proj.estimatedHours} hours</span>
                </div>

                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {proj.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {proj.description}
                </p>

                {/* Requirements Checklist */}
                <div className="space-y-1.5 border-t border-border/60 pt-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                    Submission Specifications:
                  </span>
                  <div className="space-y-1">
                    {proj.requirementsChecklist.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-mono text-muted-foreground">
                        <Check size={12} className="shrink-0 mt-0.5 text-foreground" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <button
                  onClick={() => setSelectedProjectForSubmit(proj)}
                  className="w-full rounded bg-foreground py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Submit Repository for Mentor Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Modal */}
      {selectedProjectForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border-2 border-foreground bg-card p-6 text-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Capstone Submission
                </span>
                <h3 className="font-bold text-base">{selectedProjectForSubmit.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProjectForSubmit(null)}
                className="text-xs font-mono border border-border px-2 py-1 rounded hover:bg-secondary"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Live Demo / OpenAPI Swagger URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://my-service.run.app/docs"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="FastAPI, PostgreSQL, Docker, PyTest"
                  value={techUsed}
                  onChange={(e) => setTechUsed(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Architectural Summary & Highlights *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your database isolation strategy, dependency injections, and test coverage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForSubmit(null)}
                  className="rounded border border-border px-4 py-2 text-xs font-mono hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Queue...' : 'Submit to Mentor Queue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
