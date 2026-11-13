import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { certificateService } from '../../lib/api/services';
import type { Certificate } from '../../types';
import { Award, CheckCircle2, Clock, XCircle, Copy, ExternalLink, QrCode } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CertificatesPageProps {
  onNavigate: (path: string) => void;
}

export function CertificatesPage({ onNavigate }: CertificatesPageProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService
      .getCertificates()
      .then((res) => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const criteriaChecklist = [
    { label: 'Course Completion', rule: 'Course >= 80%', current: '92%', met: true },
    { label: 'Quiz Average', rule: 'Quiz avg >= 70%', current: '84%', met: true },
    { label: 'Final Assessment', rule: 'Final assessment >= 70%', current: '82%', met: true },
    { label: 'Final Project Review', rule: 'Project PASSED', current: 'Under Review', met: false },
  ];

  const handleCopy = (code: string) => {
    const url = `${window.location.origin}/verify/${code}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Public verification link copied.');
  };

  if (loading) {
    return <LoadingState message="Loading your certificates..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Certificates"
        description="Earned credentials with public verification links, status tracking (VALID / REVOKED / EXPIRED), and clear eligibility rules."
      />

      {/* 4 Criteria Checklist */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="text-xs font-semibold text-primary">Next Certificate Milestone</div>
            <h2 className="text-base font-bold text-foreground">
              FastAPI Backend Developer – Level 1
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {criteriaChecklist.filter((c) => c.met).length} of 4 requirements met
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {criteriaChecklist.map((item) => (
            <div
              key={item.label}
              className={cn(
                'rounded-lg border p-4 space-y-2',
                item.met ? 'border-border bg-surface' : 'border-dashed border-border bg-card'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{item.label}</span>
                {item.met ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                )}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                Rule: <span className="text-foreground font-semibold">{item.rule}</span>
              </div>
              <div className="font-mono text-xs font-bold text-foreground pt-1 border-t border-border/60">
                Current: {item.current}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Certificates */}
      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates issued yet"
          description="Meet all four criteria above to earn your first publicly verifiable SkillForge certificate."
          action={{
            label: 'View Capstone Projects',
            onClick: () => onNavigate('/app/projects'),
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Award className="h-5 w-5 text-primary" />
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold',
                      cert.status === 'VALID'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : cert.status === 'EXPIRED'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        : 'bg-destructive/15 text-destructive'
                    )}
                  >
                    {cert.status === 'VALID' && <CheckCircle2 className="h-3 w-3" />}
                    {cert.status === 'EXPIRED' && <Clock className="h-3 w-3" />}
                    {cert.status === 'REVOKED' && <XCircle className="h-3 w-3" />}
                    {cert.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {cert.courseOrProjectName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cert.skillName} · {cert.badgeLevel}
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-border/60 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate ID</span>
                    <span className="font-bold text-foreground">{cert.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued</span>
                    <span className="text-foreground">{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="text-foreground">{cert.expiryDate || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-bold text-primary tabular-nums">
                      {cert.scorePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(cert.certificateNumber)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(`/verify/${cert.certificateNumber}`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Verify Page</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
