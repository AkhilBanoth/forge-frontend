export type CertificateStatus = 'VALID' | 'REVOKED' | 'EXPIRED';

export interface Certificate {
  id: string;
  certificateNumber: string;
  learnerName: string;
  skillName: string;
  courseOrProjectName: string;
  issueDate: string;
  expiryDate?: string;
  scorePercentage: number;
  status: CertificateStatus;
  verificationUrl: string;
  badgeLevel: string;
}
