import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';
import { FeatureIllustration } from '../../components/public/FeatureIllustration';
import techArchImg from '../../assets/images/tech_architecture_nodes_1794553554776.jpg';

interface AboutPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AboutPage({ currentPath, onNavigate }: AboutPageProps) {
  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 space-y-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              About SkillForge
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Turning unverified learning into trusted job readiness
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              SkillForge was built around one simple idea: finishing lessons is only half the story. Both learners and engineering teams need transparent evidence of what someone can actually build, debug, and explain under real constraints.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-border bg-card aspect-[4/3]">
              <img
                src={techArchImg}
                alt="Modular software architecture and verification nodes"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <FeatureIllustration variant="readiness-grid" />

        {/* 4 Skill Verification Tiers */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-foreground">
            Four clear levels of skill proof
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-dashed border-border bg-card p-5 space-y-2">
              <div className="font-mono text-xs font-bold text-muted-foreground">SELF_DECLARED</div>
              <div className="text-sm font-bold text-foreground">Self-Declared</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Added by the learner in their profile. Counted lightly until backed by an assessment.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">ASSESSED</div>
              <div className="text-sm font-bold text-foreground">Assessed</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Earned by passing a timed quiz or AI practice set covering core concepts and debugging.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">PROJECT_VERIFIED</div>
              <div className="text-sm font-bold text-foreground">Project-Verified</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Awarded only after a human mentor inspects and approves your working GitHub project.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">VERIFIED</div>
              <div className="text-sm font-bold text-foreground">Verified</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Highest trust tier: confirmed by both objective tests and mentor project approval.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">No Self-Verification</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Learners can declare skills to start, but only assessments and mentor reviews upgrade a skill to verified status.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Skill Expiry Tracking</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Technical skills show a "Valid until" date and automatic renewal warnings so readiness stays current.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Honest Guidance</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              SkillForge explains where you stand today without making false "guaranteed job" claims.
            </p>
          </div>
        </section>

        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Ready to check your skill gaps?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore open career tracks or create a learner account in less than a minute.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/careers')}
              className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              View Careers
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
