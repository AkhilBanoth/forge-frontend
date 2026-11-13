import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusIndicator } from '../../components/shared/StatusIndicator';
import { LoadingState } from '../../components/shared/States';
import { mentorService, projectService } from '../../lib/api/services';
import type { Project, ProjectSubmission } from '../../types';
import { FolderGit2, ArrowRight, Github } from 'lucide-react';

interface AdminProjectsPageProps {
  onNavigate: (path: string) => void;
}

export function AdminProjectsPage({ onNavigate }: AdminProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectService.getProjects(), mentorService.getReviewQueue()])
      .then(([pRes, sRes]) => {
        setProjects(pRes.data);
        setSubmissions(sRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState message="Loading project catalog and submissions..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects Catalog & All Submissions"
        description="Inspect capstone templates and review every learner project submission across the platform."
      />

      {/* Catalog */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-foreground">Capstone Project Catalog</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((proj) => (
            <div key={proj.id} className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Target: {proj.targetSkill.name}</span>
                <span>{proj.estimatedHours}h estimate</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="h-4 w-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">{proj.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-foreground"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submissions Table */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface p-5">
          <h2 className="text-base font-bold text-foreground">
            All Learner Submissions ({submissions.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Admins can inspect or step into any project evaluation in the Mentor Review portal.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface/50 font-mono text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Learner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rubric Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-secondary/20">
                  <td className="py-3.5 px-4 font-bold text-foreground">{sub.projectTitle}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{sub.learnerName || 'Learner'}</div>
                    <div className="text-[11px] text-muted-foreground">{sub.learnerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusIndicator status={sub.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-foreground">
                    {sub.review ? `${sub.review.totalScore} / ${sub.review.maxScore}` : 'Pending'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {sub.githubRepoUrl && (
                        <a
                          href={sub.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
                          title="Open GitHub repository"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onNavigate(`/mentor/reviews/${sub.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        <span>Open Review</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
