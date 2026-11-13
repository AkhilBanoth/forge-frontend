import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const PLANS = [
  {
    name: 'Learner Starter',
    price: '$0',
    cadence: 'Free forever',
    desc: 'For learners exploring career gaps and practicing fundamentals.',
    features: [
      'Target career selection & skill gap map',
      'Roadmap courses and lesson progress tracking',
      'Timed skill quizzes & initial readiness score',
      'Self-declared skill inventory with expiry tracking',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Verified Pro',
    price: '$29',
    cadence: 'per month',
    desc: 'For active job seekers completing projects with human mentors.',
    features: [
      'Unlimited AI Mentor chat & weak-topic AI practice sets',
      '8-criteria human mentor code & project reviews',
      'Official public certificates with QR verification links',
      'Full readiness history & multi-career job match comparison',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Bootcamp & Teams',
    price: '$199',
    cadence: 'per month (up to 25 seats)',
    desc: 'For training cohorts, universities, and engineering academies.',
    features: [
      'Dedicated Admin & Mentor dashboards',
      'Custom career skill catalogs & weight validation (100%)',
      'Certificate governance, revocations, and audit logs',
      'Learner assignment & cohort readiness analytics',
    ],
    cta: 'Contact Sales',
    highlight: false,
    toContact: true,
  },
];

export function PricingPage({ currentPath, onNavigate }: PricingPageProps) {
  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Simple Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Clear plans for learners and mentoring teams
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Start checking your skill gaps for free, then upgrade when you are ready for human mentor project reviews and verified certificates.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col justify-between space-y-6 ${
                plan.highlight
                  ? 'border-primary bg-card shadow-sm'
                  : 'border-border bg-card'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-2 border-b border-border pb-4">
                  <span className="font-mono text-3xl font-extrabold tabular-nums text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-foreground">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(plan.toContact ? '/contact' : '/register')}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
