import React, { useState } from 'react';
import { PageHeader, StatCard } from '../shared/PageHeader';
import { StatusIndicator } from '../shared/StatusIndicator';
import { showToast } from '../shared/ToastNotification';
import {
  Award,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  X,
  ExternalLink,
  Download,
  AlertTriangle,
  QrCode,
  FileCheck2,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminRegistrarScreenProps {
  onNavigate: (path: string) => void;
}

interface CertificateRecord {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  specialization: string;
  issuedDate: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  cryptoHash: string;
  qrVerifyUrl: string;
  mentorSigner: string;
  revocationReason?: string;
  recruiterViewsCount: number;
}

export function AdminRegistrarScreen({ onNavigate }: AdminRegistrarScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VALID' | 'REVOKED'>('ALL');
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);

  // New certificate issuance modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('Rahul Sharma');
  const [newRecipientEmail, setNewRecipientEmail] = useState('rahul.sharma@skillforge.io');
  const [newSpecialization, setNewSpecialization] = useState('Python Backend Development (Verified Junior Ready)');
  const [newMentorSigner, setNewMentorSigner] = useState('Marcus Vance, Staff Backend Architect');

  // Revocation modal
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('Academic dishonesty / unauthorized code reuse detected on capstone.');

  const [certificates, setCertificates] = useState<CertificateRecord[]>([
    {
      id: 'cert_rec_01',
      certificateNumber: 'SF-2026-PY-8841',
      recipientName: 'Rahul Sharma',
      recipientEmail: 'rahul.sharma@skillforge.io',
      specialization: 'Python Core & Asynchronous Systems (Assessed)',
      issuedDate: '2026-09-15',
      status: 'VALID',
      cryptoHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrVerifyUrl: 'https://skillforge.io/verify/SF-2026-PY-8841',
      mentorSigner: 'Dr. Sarah Jenkins, Principal Evaluator',
      recruiterViewsCount: 48,
    },
    {
      id: 'cert_rec_02',
      certificateNumber: 'SF-2026-DOCK-9022',
      recipientName: 'Elena Rostova',
      recipientEmail: 'elena.r@example.com',
      specialization: 'Docker Multi-Stage & Microservices Architecture',
      issuedDate: '2026-10-01',
      status: 'VALID',
      cryptoHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      qrVerifyUrl: 'https://skillforge.io/verify/SF-2026-DOCK-9022',
      mentorSigner: 'Marcus Vance, Staff Backend Architect',
      recruiterViewsCount: 29,
    },
    {
      id: 'cert_rec_03',
      certificateNumber: 'SF-2026-SQL-7731',
      recipientName: 'Marcus Chen',
      recipientEmail: 'marcus.chen@example.org',
      specialization: 'PostgreSQL Relational Schema & ACID Optimization',
      issuedDate: '2026-10-18',
      status: 'VALID',
      cryptoHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      qrVerifyUrl: 'https://skillforge.io/verify/SF-2026-SQL-7731',
      mentorSigner: 'Priya Sundaram, Staff DBA',
      recruiterViewsCount: 64,
    },
    {
      id: 'cert_rec_04',
      certificateNumber: 'SF-2025-FAST-4412',
      recipientName: 'Dmitri Volkov',
      recipientEmail: 'dmitri.v@example.net',
      specialization: 'High-Performance REST APIs with FastAPI',
      issuedDate: '2025-12-10',
      status: 'REVOKED',
      cryptoHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      qrVerifyUrl: 'https://skillforge.io/verify/SF-2025-FAST-4412',
      mentorSigner: 'Marcus Vance, Staff Backend Architect',
      revocationReason: 'Candidate repository plagiarized from archived open-source repository.',
      recruiterViewsCount: 12,
    },
    {
      id: 'cert_rec_05',
      certificateNumber: 'SF-2026-DATA-6601',
      recipientName: 'Aisha Patel',
      recipientEmail: 'aisha.p@example.com',
      specialization: 'Real-Time Streaming Systems & Kafka Pipelines',
      issuedDate: '2026-11-05',
      status: 'VALID',
      cryptoHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      qrVerifyUrl: 'https://skillforge.io/verify/SF-2026-DATA-6601',
      mentorSigner: 'Alexei Ivanov, Distributed Systems Lead',
      recruiterViewsCount: 82,
    },
  ]);

  // Filtered certificates
  const filteredCerts = certificates.filter((c) => {
    const matchesSearch =
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValid = certificates.filter((c) => c.status === 'VALID').length;
  const totalRevoked = certificates.filter((c) => c.status === 'REVOKED').length;
  const totalViews = certificates.reduce((acc, c) => acc + c.recruiterViewsCount, 0);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName || !newRecipientEmail) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certNum = `SF-2026-FULL-${randomSuffix}`;
    const newCert: CertificateRecord = {
      id: `cert_rec_${Date.now()}`,
      certificateNumber: certNum,
      recipientName: newRecipientName,
      recipientEmail: newRecipientEmail,
      specialization: newSpecialization,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'VALID',
      cryptoHash: `a${Date.now()}b${Math.random().toString(36).substring(2, 15)}4c8996fb92427ae`,
      qrVerifyUrl: `https://skillforge.io/verify/${certNum}`,
      mentorSigner: newMentorSigner,
      recruiterViewsCount: 0,
    };

    setCertificates([newCert, ...certificates]);
    setIsIssueModalOpen(false);
    showToast('success', `Certificate ${certNum} created and issued.`);
  };

  const handleRevoke = () => {
    if (!selectedCert) return;
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === selectedCert.id
          ? {
              ...c,
              status: 'REVOKED',
              revocationReason: revokeReason,
            }
          : c
      )
    );
    showToast('warning', `Certificate ${selectedCert.certificateNumber} revoked. Public checks will now show it as revoked.`);
    setIsRevokeModalOpen(false);
    setSelectedCert(null);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Sub-Nav Breadcrumb to Admin Hub */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border pb-3">
        <button onClick={() => onNavigate('/admin')} className="hover:text-foreground">
          Admin Dashboard
        </button>
        <span>/</span>
        <span className="font-bold text-foreground">Certificate Records</span>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/learners')}
            className="hover:text-foreground text-[11px]"
          >
            Learners →
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('/admin/mentors')}
            className="hover:text-foreground text-[11px]"
          >
            Mentors →
          </button>
        </span>
      </div>

      <PageHeader
        title="Certificate Records & Verification"
        description="Issue official certificates, manage public verification links, and revoke credentials when needed."
        badge={
          <span className="font-mono text-xs border border-foreground bg-foreground text-background px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
            CERTIFICATES
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/certificates')}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Verify Certificates Page →
            </button>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <Award size={13} />
              <span>Issue New Certificate</span>
            </button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Certificates"
          value={totalValid}
          sublabel={`${certificates.length} total certificates on record`}
          icon={Award}
        />
        <StatCard
          title="Revoked"
          value={totalRevoked}
          sublabel="Removed for policy or academic issues"
          icon={ShieldAlert}
        />
        <StatCard
          title="Verification Checks"
          value={totalViews}
          sublabel="Employer checks via QR & link this month"
          icon={QrCode}
        />
        <StatCard
          title="Verification"
          value="Verified ID"
          sublabel="Unique verification code per certificate"
          icon={Lock}
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
            placeholder="Search by certificate ID, student name, or program..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Status:</span>
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'VALID', label: 'Active Only' },
            { id: 'REVOKED', label: 'Revoked Only' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs transition-colors border',
                statusFilter === st.id
                  ? 'bg-foreground text-background border-foreground font-bold'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Official Registry Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-surface/60 px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-foreground">
            ISSUED CERTIFICATES ({filteredCerts.length})
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Official Verification Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-surface/40 border-b border-border/80 font-mono text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Program / Track</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Checks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      <span>{cert.certificateNumber}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate max-w-[120px] font-normal">
                      {cert.cryptoHash.slice(0, 16)}...
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{cert.recipientName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{cert.recipientEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="text-foreground font-medium">{cert.specialization}</span>
                    <span className="text-[10px] text-muted-foreground block">Signer: {cert.mentorSigner}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {cert.issuedDate}
                  </td>

                  <td className="py-3.5 px-4">
                    {cert.status === 'VALID' && (
                      <span className="inline-flex items-center gap-1 rounded bg-foreground text-background px-2 py-0.5 text-[10px] font-mono font-bold">
                        VALID
                      </span>
                    )}
                    {cert.status === 'REVOKED' && (
                      <span className="inline-flex items-center gap-1 rounded border border-foreground text-foreground px-2 py-0.5 text-[10px] font-mono font-bold bg-surface">
                        REVOKED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {cert.recruiterViewsCount} checks
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Details & Revocation Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border-2 border-foreground bg-card p-6 space-y-6 text-foreground shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Certificate Details
                </span>
                <h3 className="text-lg font-bold">{selectedCert.certificateNumber}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Student: {selectedCert.recipientName} ({selectedCert.recipientEmail})
                </p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Program / Skill Track:</span>
                <span className="font-bold text-foreground text-sm font-sans block">{selectedCert.specialization}</span>
                <span className="text-[11px] text-muted-foreground block">Approved By: {selectedCert.mentorSigner}</span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-surface space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Verification Code:</span>
                <span className="break-all text-[11px] text-foreground font-mono block">{selectedCert.cryptoHash}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Public Verification Link:</span>
                  <span className="text-[11px] text-foreground">{selectedCert.qrVerifyUrl}</span>
                </div>
                <button
                  onClick={() => {
                    showToast('info', 'Verification link copied.');
                  }}
                  className="rounded border border-border px-2 py-1 text-[11px] hover:bg-secondary"
                >
                  Copy Link
                </button>
              </div>

              {selectedCert.status === 'REVOKED' && (
                <div className="p-3 rounded-lg border border-foreground/40 bg-surface text-foreground space-y-1">
                  <span className="font-bold text-[11px] block">REVOCATION NOTICE:</span>
                  <p className="font-sans text-xs text-muted-foreground">{selectedCert.revocationReason}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              {selectedCert.status === 'VALID' ? (
                <button
                  onClick={() => setIsRevokeModalOpen(true)}
                  className="rounded-lg border border-foreground/50 bg-surface px-4 py-2 font-mono text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                >
                  Revoke Certificate
                </button>
              ) : (
                <span className="font-mono text-xs text-muted-foreground">Certificate Revoked</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('success', `Downloaded PDF certificate for ${selectedCert.recipientName}.`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  <Download size={13} />
                  <span>Download PDF Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Sub-Modal */}
      {isRevokeModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Revoke Certificate</h3>
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <div className="font-mono text-xs space-y-3">
              <p className="text-muted-foreground font-sans">
                Warning: Revoking certificate <span className="font-bold text-foreground">{selectedCert.certificateNumber}</span> permanently marks it as invalid and stops public verification.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">REASON FOR REVOKING</label>
                <textarea
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface p-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRevokeModalOpen(false)}
                  className="rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue New Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-bold text-base">Issue New Certificate</h3>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">STUDENT FULL NAME</label>
                <input
                  type="text"
                  required
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">STUDENT EMAIL</label>
                <input
                  type="email"
                  required
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">PROGRAM OR SKILL TITLE</label>
                <input
                  type="text"
                  required
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground">APPROVING MENTOR</label>
                <input
                  type="text"
                  required
                  value={newMentorSigner}
                  onChange={(e) => setNewMentorSigner(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors"
                >
                  Create &amp; Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
