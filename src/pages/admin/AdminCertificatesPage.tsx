import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { certificateService } from '../../lib/api/services';
import type { Certificate } from '../../types';
import { Award, Save, Ban, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminCertificatesPageProps {
  onNavigate: (path: string) => void;
}

export function AdminCertificatesPage({ onNavigate }: AdminCertificatesPageProps) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [rules, setRules] = useState({
    minCourseCompletion: 80,
    minQuizAverage: 70,
    minFinalAssessment: 70,
    requireProjectPassed: true,
    validityMonths: 12,
  });
  const [loading, setLoading] = useState(true);
  const [isSavingRules, setIsSavingRules] = useState(false);

  useEffect(() => {
    Promise.all([
      certificateService.getCertificates(),
      certificateService.getCertificateRules(),
    ]).then(([cRes, rRes]) => {
      setCerts(cRes.data);
      setRules(rRes.data);
      setLoading(false);
    });
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRules(true);
    try {
      const res = await certificateService.updateCertificateRules(rules);
      setRules(res.data);
      showToast('success', 'Certificate eligibility rules saved.');
    } catch {
      showToast('error', 'Failed to update certificate rules.');
    } finally {
      setIsSavingRules(false);
    }
  };

  const handleRevoke = async (certId: string) => {
    try {
      const res = await certificateService.revokeCertificate(
        certId,
        'Revoked by Admin from Certificate Governance'
      );
      setCerts((prev) => prev.map((c) => (c.id === certId ? res.data : c)));
      showToast('warning', `Certificate ${res.data.certificateNumber} marked REVOKED.`);
    } catch {
      showToast('error', 'Could not revoke certificate.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading certificate rules and issued records..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Certificates & Issuance Rules"
        description="Configure global certificate eligibility thresholds, inspect all issued credentials, and revoke compromised or invalid records."
      />

      {/* Rules Form */}
      <form
        onSubmit={handleSaveRules}
        className="rounded-xl border border-border bg-card p-6 space-y-5"
      >
        <div className="border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Eligibility Threshold Rules</h2>
          <p className="text-xs text-muted-foreground">
            Default standard: Course &ge; 80%, Quiz average &ge; 70%, Final assessment &ge; 70%, and Mentor Project PASSED.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Min Course (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={rules.minCourseCompletion}
              onChange={(e) =>
                setRules({ ...rules, minCourseCompletion: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Min Quiz Avg (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={rules.minQuizAverage}
              onChange={(e) => setRules({ ...rules, minQuizAverage: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Min Final Exam (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={rules.minFinalAssessment}
              onChange={(e) =>
                setRules({ ...rules, minFinalAssessment: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Validity (Months)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={rules.validityMonths}
              onChange={(e) => setRules({ ...rules, validityMonths: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs font-bold"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              id="req-project"
              type="checkbox"
              checked={rules.requireProjectPassed}
              onChange={(e) =>
                setRules({ ...rules, requireProjectPassed: e.target.checked })
              }
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor="req-project" className="text-xs font-semibold text-foreground">
              Require Project PASSED
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <button
            type="submit"
            disabled={isSavingRules}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSavingRules ? 'Saving...' : 'Save Certificate Rules'}</span>
          </button>
        </div>
      </form>

      {/* Certificates Registry */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              Issued Certificates ({certs.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface/50 font-mono text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Learner</th>
                <th className="py-3 px-4">Credential</th>
                <th className="py-3 px-4">Score / Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/20">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {c.certificateNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">{c.learnerName}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{c.courseOrProjectName}</div>
                    <div className="text-[11px] text-muted-foreground">{c.skillName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>{c.scorePercentage}%</div>
                    <div className="text-[11px] text-muted-foreground">
                      Valid until {c.expiryDate || '—'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold',
                        c.status === 'VALID'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : c.status === 'EXPIRED'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                          : 'bg-destructive/15 text-destructive'
                      )}
                    >
                      {c.status === 'VALID' && <CheckCircle2 className="h-3 w-3" />}
                      {c.status === 'EXPIRED' && <Clock className="h-3 w-3" />}
                      {c.status === 'REVOKED' && <XCircle className="h-3 w-3" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/verify/${c.certificateNumber}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                      >
                        <span>Verify</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                      {c.status !== 'REVOKED' && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(c.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
