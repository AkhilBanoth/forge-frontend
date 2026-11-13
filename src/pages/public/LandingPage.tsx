import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Sliders,
  Map as MapIcon,
  CheckSquare,
  FolderGit2,
  TrendingUp,
  Bot,
  Award,
  ShieldCheck,
  GraduationCap,
  Users,
  Shield,
  Search,
} from 'lucide-react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { FeatureIllustration } from '../../components/public/FeatureIllustration';
import heroTechImg from '../../assets/images/hero_tech_workspace_1794553554969.jpg';
import techArchImg from '../../assets/images/tech_architecture_nodes_1794553554776.jpg';
import mentorReviewImg from '../../assets/images/mentor_engineering_review_1794553555720.jpg';

interface LandingPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Pick career',
    desc: 'Choose a clear target role such as Python Backend, Full-Stack, Data Analyst, or DevOps Engineer.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Skill gap',
    desc: 'Compare your current skills against real job requirements and spot high-priority gaps.',
    icon: Sliders,
  },
  {
    step: '03',
    title: 'Roadmap',
    desc: 'Follow structured courses, lessons, and practice topics built specifically around your gaps.',
    icon: MapIcon,
  },
  {
    step: '04',
    title: 'Assess',
    desc: 'Pass timed technical quizzes and AI practice sets to replace self-claims with proof.',
    icon: CheckSquare,
  },
  {
    step: '05',
    title: 'Project',
    desc: 'Submit real GitHub repositories and get line-by-line rubric reviews from human mentors.',
    icon: FolderGit2,
  },
  {
    step: '06',
    title: 'Readiness',
    desc: 'Track an honest 0–100% readiness score and earn public certificates employers can verify.',
    icon: TrendingUp,
  },
];

const FEATURES = [
  {
    title: 'Skill Gap Engine',
    desc: 'Maps every required skill to NONE, MEDIUM, or HIGH gap levels with clear weighting.',
    icon: Sliders,
  },
  {
    title: 'AI Mentor & Practice',
    desc: 'Ask questions anytime and generate targeted practice quizzes on your weakest topics.',
    icon: Bot,
  },
  {
    title: 'Verified Skills & Expiry',
    desc: 'Progression from Self-Declared to Assessed, Project-Verified, and Verified with renewal dates.',
    icon: ShieldCheck,
  },
  {
    title: 'Public Certificates',
    desc: 'Earned only after >= 80% course completion, >= 70% test scores, and a passing mentor project.',
    icon: Award,
  },
  {
    title: 'Transparent Readiness Score',
    desc: 'Formula-driven score combining Technical Skills (35%), Assessments (25%), Projects (25%), and Interview (15%).',
    icon: TrendingUp,
  },
  {
    title: 'Human Mentor Review',
    desc: 'Learners cannot self-verify projects. Mentors grade 8 engineering criteria before approval.',
    icon: FolderGit2,
  },
];

export function LandingPage({ currentPath, onNavigate }: LandingPageProps) {
  const { isAuthenticated, homePath } = useAuth();
  const [certLookupId, setCertLookupId] = useState('SF-2026-PY-8821');

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = certLookupId.trim();
    if (!cleaned) {
      onNavigate('/verify');
      return;
    }
    onNavigate(`/verify/${encodeURIComponent(cleaned)}`);
  };

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      {/* Hero Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Career Readiness &amp; Skill Verification
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Are you really job-ready?
              </h1>
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                Stop guessing after watching video courses. SkillForge measures your real skills through timed assessments, targeted practice, and human mentor project reviews—giving you an honest readiness score before you apply.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(homePath)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Open My Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigate('/register')}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/login')}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                      <span>Login</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate('/careers')}
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Browse Career Roles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm aspect-video">
                <img
                  src={heroTechImg}
                  alt="Software engineer workstation running backend code"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                The Problem We Solve
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground text-balance">
                Course completion does not mean job readiness
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Finishing 100% of a video playlist feels productive, but hiring teams look for proof: can you write reliable APIs, debug failures, explain trade-offs, and ship a clean codebase?
              </p>
            </div>
            <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  Passive Video Courses
                </div>
                <div className="text-sm font-bold text-foreground">
                  Self-claimed skills with no proof
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Anyone can mark a lesson complete or list a skill on a resume without passing a single technical check.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="text-xs font-semibold text-primary">
                  The SkillForge Standard
                </div>
                <div className="text-sm font-bold text-foreground">
                  Assessed + Mentor-Reviewed Proof
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Skills earn Verified status only after timed quizzes and an 8-point mentor codebase inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (6 Steps) */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Six clear steps from skill gaps to verified readiness
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-xl border border-border bg-background p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      Step {item.step}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Platform Capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Built around verifiable engineering competence
            </h2>
          </div>

          <FeatureIllustration variant="assessment-flow" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-xl border border-border bg-card p-6 space-y-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden border-b border-border">
                <img
                  src={techArchImg}
                  alt="Isometric illustration of verified cloud services and API architecture"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Structured System &amp; Skill Verification
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every career role maps to real engineering skills across APIs, databases, testing, and deployment.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden border-b border-border">
                <img
                  src={mentorReviewImg}
                  alt="Senior software mentor reviewing project architecture with a developer"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Human Mentor Code &amp; Project Reviews
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real engineers inspect your GitHub repositories across 8 production criteria before verifying skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section: Learner / Mentor / Admin */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Dedicated Role Portals
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Three focused workspaces with clear responsibilities
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Learner</h3>
                  <p className="text-xs text-muted-foreground">Build & prove job readiness</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Select a target career and inspect NONE / MEDIUM / HIGH gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Complete roadmap lessons, timed quizzes, and AI practice sets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Submit GitHub projects and earn verifiable certificates</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Mentor</h3>
                  <p className="text-xs text-muted-foreground">Review code & verify learners</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Monitor assigned learners, skill gaps, and AI mentor history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Grade project submissions across 8 engineering criteria</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Approve or request changes with actionable technical feedback</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Admin</h3>
                  <p className="text-xs text-muted-foreground">Manage roles, careers & rules</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Create Mentor and Admin accounts and assign learners to mentors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Configure career roles, skill importance weights (100%), and courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Manage certificate rules, revoke credentials, and inspect audit logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Public Certificate Verification Quick Box */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Verify a SkillForge Certificate
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Employers and recruiters can check certificate authenticity, status (VALID, REVOKED, or EXPIRED), and evaluation scores without signing in.
              </p>
            </div>
            <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certLookupId}
                  onChange={(e) => setCertLookupId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. SF-2026-PY-8821)"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Verify Certificate
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
