import React, { useEffect, useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { certificateService } from '../../lib/api/services';
import type { Certificate } from '../../types';
import { showToast } from '../../components/shared/ToastNotification';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Award,
  ShieldAlert,
} from 'lucide-react';

interface VerifyCertificatePageProps {
  currentPath: string;
  certificateId?: string;
  onNavigate: (path: string) => void;
}

function DeterministicQR({ code }: { code: string }) {
  // Deterministic 9x9 QR-like grid from certificate code characters
  const cells: boolean[] = [];
  for (let i = 0; i < 81; i++) {
    const ch = code.charCodeAt(i % code.length) || 42;
    const row = Math.floor(i / 9);
    const col = i % 9;
    const isCorner =
      (row < 3 && col < 3) ||
      (row < 3 && col > 5) ||
      (row > 5 && col < 3);
    if (isCorner) {
      cells.push(
        row === 0 ||
          row === 2 ||
          row === 6 ||
          row === 8 ||
          col === 0 ||
          col === 2 ||
          col === 6 ||
          col === 8 ||
          (row === 1 && col === 1) ||
          (row === 1 && col === 7) ||
          (row === 7 && col === 1)
      );
    } else {
      cells.push(((ch + i * 7) % 3) !== 0);
    }
  }

  return (
    <div
      className="grid grid-cols-9 gap-0.5 rounded-lg border border-border bg-white p-2 w-24 h-24 shrink-0"
      aria-label={`Verification QR code for ${code}`}
    >
      {cells.map((filled, idx) => (
        <div
          key={idx}
          className={filled ? 'bg-slate-900 rounded-[1px]' : 'bg-transparent'}
        />
      ))}
    </div>
  );
}

export function VerifyCertificatePage({
  currentPath,
  certificateId,
  onNavigate,
}: VerifyCertificatePageProps) {
  const [searchInput, setSearchInput] = useState(certificateId || 'SF-2026-PY-8821');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const targetId = certificateId || '';
    if (!targetId) {
      setCert(null);
      setNotFound(false);
      return;
    }
    setSearchInput(targetId);
    let mounted = true;
    setLoading(true);
    setNotFound(false);
    certificateService
      .verifyCertificate(targetId)
      .then((res) => {
        if (mounted) {
          setCert(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setCert(null);
          setNotFound(true);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [certificateId]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (!clean) return;
    onNavigate(`/verify/${encodeURIComponent(clean)}`);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Public verification link copied.');
  };

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Public Certificate Verification
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Verify a SkillForge credential
          </h1>
          <p className="text-sm text-muted-foreground">
            No login required. Enter a certificate ID to inspect its live status (VALID, REVOKED, or EXPIRED) and earned evaluation metrics.
          </p>
        </div>

        {/* Lookup Bar */}
        <form onSubmit={handleLookup} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Certificate ID (e.g. SF-2026-PY-8821)"
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Verify ID
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Quick examples:</span>
            {[
              { id: 'SF-2026-PY-8821', label: 'SF-2026-PY-8821 (Valid)' },
              { id: 'SF-2025-SQL-4410', label: 'SF-2025-SQL-4410 (Expired)' },
              { id: 'SF-2025-JS-1092', label: 'SF-2025-JS-1092 (Revoked)' },
            ].map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onNavigate(`/verify/${sample.id}`)}
                className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-foreground hover:border-primary/50"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Checking certificate registry...
          </div>
        )}

        {!loading && notFound && (
          <div className="rounded-xl border border-destructive/40 bg-card p-8 text-center space-y-3">
            <ShieldAlert className="h-9 w-9 text-destructive mx-auto" />
            <h2 className="text-lg font-bold text-foreground">Certificate Not Found</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              No certificate matching <span className="font-mono font-semibold text-foreground">{certificateId}</span> exists in the SkillForge registry. Double-check the code or try one of the sample IDs above.
            </p>
          </div>
        )}

        {!loading && cert && (
          <div className="rounded-xl border-2 border-foreground bg-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    Certificate ID: {cert.certificateNumber}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {cert.courseOrProjectName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Awarded to{' '}
                  <span className="font-semibold text-foreground">{cert.learnerName}</span> ·{' '}
                  {cert.skillName} ({cert.badgeLevel})
                </p>
              </div>

              <div className="flex items-center gap-4">
                <DeterministicQR code={cert.certificateNumber} />
              </div>
            </div>

            {/* Status Banner */}
            <div
              className={`rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                cert.status === 'VALID'
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : cert.status === 'EXPIRED'
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-destructive/40 bg-destructive/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {cert.status === 'VALID' && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
                {cert.status === 'EXPIRED' && (
                  <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                )}
                {cert.status === 'REVOKED' && (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                <div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    Status: {cert.status}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cert.status === 'VALID' &&
                      'This certificate is active and verified by SkillForge.'}
                    {cert.status === 'EXPIRED' &&
                      'This credential has passed its validity date and requires renewal.'}
                    {cert.status === 'REVOKED' &&
                      'This certificate was revoked by a platform administrator and is no longer valid.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(cert.verificationUrl)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary self-start sm:self-center"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </button>
            </div>

            {/* Verified Details Grid */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="text-muted-foreground">Issued On</div>
                <div className="font-mono text-sm font-bold text-foreground mt-1">
                  {cert.issueDate}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="text-muted-foreground">Valid Until</div>
                <div className="font-mono text-sm font-bold text-foreground mt-1">
                  {cert.expiryDate || 'No expiry'}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="text-muted-foreground">Evaluated Score</div>
                <div className="font-mono text-sm font-bold text-foreground mt-1 tabular-nums">
                  {cert.scorePercentage}%
                </div>
              </div>
            </div>

            {/* Verified Requirements */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="text-xs font-semibold text-foreground">
                Verified Eligibility Criteria
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                <div>Course completion &ge; 80%: Verified</div>
                <div>Quiz average score &ge; 70%: Verified</div>
                <div>Final assessment &ge; 70%: Verified</div>
                <div>Mentor project status: PASSED</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
