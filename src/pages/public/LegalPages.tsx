import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';

interface LegalPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function TermsPage({ currentPath, onNavigate }: LegalPageProps) {
  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Legal
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Terms of Use
          </h1>
          <p className="text-xs text-muted-foreground">
            Clear guidelines for using SkillForge assessments, mentor reviews, and certificates.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">1. Accounts &amp; Roles</h2>
            <p>
              Public registration is available for Learner accounts only. Mentor and Administrator accounts are provisioned by authorized platform Administrators. You are responsible for keeping your login credentials secure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">2. Skill Verification &amp; Projects</h2>
            <p>
              All project submissions must represent your own original engineering work. Verified skill badges and certificates are issued based on completed coursework, assessment scores, and mentor rubric reviews, and may expire or be revoked if standards are not met.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. Readiness Guidance</h2>
            <p>
              SkillForge readiness scores provide structured feedback based on your verified platform activity. A readiness score does not guarantee employment or job placement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">4. Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
              <span className="font-medium text-foreground">support@skillforge.io</span> or through our{' '}
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="font-semibold text-primary hover:underline"
              >
                Contact page
              </button>
              .
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

export function PrivacyPage({ currentPath, onNavigate }: LegalPageProps) {
  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Legal
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            How SkillForge handles your profile, assessment results, and certificate verification records.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">1. Information We Collect</h2>
            <p>
              We store your name, email address, target career selection, skill records, quiz results, project links, and AI mentor conversation history needed to calculate your readiness and support mentor reviews.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">2. Role-Based Visibility</h2>
            <p>
              Your private learner records are visible only to you, your assigned Mentor (read-only for review and guidance), and authorized Administrators. Other learners cannot access your account data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. Public Certificate Verification</h2>
            <p>
              When you share a certificate verification ID or link, anyone inspecting that ID can view the holder name, credential title, issue/expiry dates, score, and VALID/REVOKED/EXPIRED status.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">4. Contact</h2>
            <p>
              For privacy or account removal requests, reach us at{' '}
              <span className="font-medium text-foreground">support@skillforge.io</span>.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
