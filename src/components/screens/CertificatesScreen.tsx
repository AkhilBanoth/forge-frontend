import React, { useState, useEffect } from 'react';
import { certificateService } from '../../lib/api/services';
import type { Certificate } from '../../types';
import { PageHeader } from '../shared/PageHeader';
import { showToast } from '../shared/ToastNotification';
import { Award, CheckCircle2, Clock, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CertificatesScreen() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function load() {
      const res = await certificateService.getCertificates();
      setCertificates(res.data);
    }
    load();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Verification link copied to clipboard.');
  };

  const criteriaChecklist = [
    {
      label: 'Course Completion',
      rule: 'At least 80%',
      current: '92%',
      met: true,
    },
    {
      label: 'Quiz Average',
      rule: 'At least 70%',
      current: '84%',
      met: true,
    },
    {
      label: 'Final Assessment',
      rule: 'At least 70%',
      current: '82%',
      met: true,
    },
    {
      label: 'Final Project Review',
      rule: 'Mentor Status: PASSED',
      current: 'Under Review',
      met: false,
    },
  ];

  const metCount = criteriaChecklist.filter((c) => c.met).length;

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Verified Certificates"
        description="Official certificates you earn by passing timed tests and getting mentor approval on your projects."
        badge={
          <span className="font-mono text-xs border border-foreground bg-card px-2 py-0.5 rounded font-bold">
            {certificates.length} Certificates Earned
          </span>
        }
      />

      {/* Certification Criteria Checklist (PDF Section 19) */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="font-mono text-[11px] uppercase font-bold text-muted-foreground">
              Next Certificate Milestone
            </span>
            <h2 className="text-base font-bold text-foreground">
              FastAPI Backend Developer – Level 1
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete all 4 requirements below to unlock your next official certificate.
            </p>
          </div>
          <span className="font-mono text-xs font-bold border border-foreground bg-surface px-3 py-1 rounded self-start sm:self-center">
            {metCount} of {criteriaChecklist.length} Met
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {criteriaChecklist.map((item) => (
            <div
              key={item.label}
              className={cn(
                'rounded-lg border p-4 space-y-2',
                item.met ? 'border-foreground/50 bg-surface' : 'border-dashed border-border bg-card'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{item.label}</span>
                {item.met ? (
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                Required: <span className="text-foreground font-semibold">{item.rule}</span>
              </div>
              <div className="font-mono text-xs font-bold text-foreground pt-1 border-t border-border/50">
                Current: {item.current}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Certificates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl border-2 border-foreground bg-card p-6 flex flex-col justify-between space-y-6 shadow-sm"
          >
            {/* Certificate Badge Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    SkillForge Certificate
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-foreground">
                  <CheckCircle2 size={12} /> {cert.status}
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider">
                  Verified Skill:
                </span>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {cert.skillName}
                </h3>
              </div>

              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p className="line-clamp-2 leading-relaxed">{cert.courseOrProjectName}</p>
                <div className="pt-2 flex items-center justify-between border-t border-border/40 text-[11px]">
                  <span>Final Score:</span>
                  <span className="font-bold text-foreground">{cert.scorePercentage}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Issued On:</span>
                  <span className="font-bold text-foreground">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Certificate ID:</span>
                  <span className="font-bold text-foreground">{cert.certificateNumber}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-border/60">
              <button
                onClick={() => handleCopyUrl(cert.verificationUrl)}
                className="w-full flex items-center justify-center gap-2 rounded border border-foreground/40 py-2 text-xs font-mono font-medium hover:bg-secondary transition-colors"
              >
                <Copy size={13} />
                <span>Copy Verification Link</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
