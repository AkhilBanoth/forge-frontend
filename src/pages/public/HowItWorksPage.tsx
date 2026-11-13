import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { READINESS_THRESHOLDS } from '../../constants/readiness';
import mentorReviewImg from '../../assets/images/mentor_engineering_review_1794553555720.jpg';

interface HowItWorksPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const PIPELINE = [
  {
    num: '01',
    title: 'Pick your target career',
    detail: 'Select from curated engineering and data roles. Each role defines required skills, target proficiency, and importance weights totaling 100%.',
  },
  {
    num: '02',
    title: 'Analyze your skill gaps',
    detail: 'SkillForge compares your current profile against your target role and highlights NONE, MEDIUM, and HIGH skill gaps.',
  },
  {
    num: '03',
    title: 'Follow a custom roadmap',
    detail: 'Focus on the exact courses, modules, and lessons that close your largest gaps first instead of re-watching topics you already know.',
  },
  {
    num: '04',
    title: 'Pass timed quizzes & AI practice',
    detail: 'Test yourself under real time limits or run targeted AI practice sessions on weak areas to feed verified results straight back into your gap profile.',
  },
  {
    num: '05',
    title: 'Ship a mentor-reviewed project',
    detail: 'Submit a GitHub repository and live demo. A human mentor scores 8 engineering criteria including API design, auth, testing, and error handling.',
  },
  {
    num: '06',
    title: 'Track readiness & earn certificates',
    detail: 'Watch your readiness score evolve over time and unlock publicly verifiable certificates once every threshold is met.',
  },
];

export function HowItWorksPage({ currentPath, onNavigate }: HowItWorksPageProps) {
  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 space-y-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              How SkillForge Works
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A clear, measurable path from learning to verified readiness
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Every step on SkillForge connects directly to your readiness formula and skill verification status.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-border bg-card aspect-[4/3]">
              <img
                src={mentorReviewImg}
                alt="Senior engineer mentoring a developer during a code review"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 6 Steps */}
        <section className="grid gap-5 md:grid-cols-2">
          {PIPELINE.map((step) => (
            <div
              key={step.num}
              className="rounded-xl border border-border bg-card p-6 space-y-2.5"
            >
              <div className="font-mono text-xs font-bold text-primary">Step {step.num}</div>
              <h2 className="text-base font-bold text-foreground">{step.title}</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Readiness Formula + Thresholds */}
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">How the Readiness Score is calculated</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your overall score (0–100%) uses a fixed, transparent formula across four signals:
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="font-mono text-xl font-bold text-primary">35%</div>
              <div className="text-xs font-semibold text-foreground mt-1">Technical Skills</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Weighted skill coverage</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="font-mono text-xl font-bold text-primary">25%</div>
              <div className="text-xs font-semibold text-foreground mt-1">Assessments</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Timed quiz & test scores</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="font-mono text-xl font-bold text-primary">25%</div>
              <div className="text-xs font-semibold text-foreground mt-1">Projects</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Mentor 8-criteria score</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="font-mono text-xl font-bold text-primary">15%</div>
              <div className="text-xs font-semibold text-foreground mt-1">Interview Prep</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Scenario & explanation tests</div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-foreground">Five Readiness Levels</h3>
            <div className="grid gap-2.5 sm:grid-cols-5">
              {READINESS_THRESHOLDS.map((tier) => (
                <div key={tier.level} className="rounded-lg border border-border bg-surface p-3 space-y-1">
                  <div className="font-mono text-xs font-bold text-foreground">
                    {tier.min}–{tier.max}%
                  </div>
                  <div className="text-xs font-semibold text-primary">{tier.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificate Rules */}
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Certificate Eligibility Rules</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            To protect employer trust, every SkillForge certificate requires all four conditions:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Course completion >= 80%',
              'Quiz average score >= 70%',
              'Final assessment score >= 70%',
              'Capstone project mentor status: PASSED',
            ].map((rule) => (
              <div
                key={rule}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Start Your Readiness Path</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
