import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Presentation,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Layers,
  Users,
  Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface PresentationPageProps {
  onNavigate: (path: string) => void;
}

interface SlideDef {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  speakerNotes: string;
  render: () => React.ReactNode;
}

const SLIDES: SlideDef[] = [
  {
    id: 1,
    tag: 'TITLE SLIDE',
    title: 'SkillForge — AI-Powered Career Readiness Platform',
    subtitle: 'Moving Beyond Passive Course Completion to Verified Job Readiness',
    speakerNotes:
      'Introduce SkillForge: Unlike traditional video-learning platforms that track hours watched, SkillForge proves whether a candidate actually possesses the verified skills required for their target engineering role.',
    render: () => (
      <div className="flex h-full flex-col justify-between rounded-2xl bg-slate-950 p-8 sm:p-12 text-white border border-slate-800">
        <div className="space-y-5">
          <span className="inline-block rounded-md border border-indigo-500/50 bg-indigo-950/80 px-3 py-1 font-mono text-xs font-bold tracking-wider text-indigo-300">
            CAPSTONE & PRODUCT PRESENTATION
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">SkillForge</h2>
          <p className="text-xl sm:text-2xl font-bold text-indigo-300">
            AI-Powered Career Readiness & Skill Verification Platform
          </p>
          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Measuring real engineering readiness through skill gap mapping, prerequisite-gated roadmaps, timed assessments, mentor-reviewed capstone projects, and personalized AI study guidance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 pt-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="font-mono text-[10px] font-bold uppercase text-indigo-400">CORE QUESTION</div>
            <div className="mt-1 text-sm font-bold">Verified Proof vs. Passive Completion</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="font-mono text-[10px] font-bold uppercase text-indigo-400">FRONTEND STACK</div>
            <div className="mt-1 text-sm font-bold">React 19 · TypeScript · Vite · Zustand</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="font-mono text-[10px] font-bold uppercase text-indigo-400">PORTALS</div>
            <div className="mt-1 text-sm font-bold">Learner (/app) · Mentor (/mentor) · Admin (/admin)</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    tag: '01 · PROBLEM & VISION',
    title: 'Why Course Completion Does Not Equal Job Readiness',
    subtitle: 'SkillForge answers: "Does this candidate actually possess the verified skills required for the job?"',
    speakerNotes:
      'Explain the gap in current EdTech: 100% playlist completion gives false confidence. Employers need verified assessments and human code review, not self-claimed bullet points.',
    render: () => (
      <div className="grid gap-6 md:grid-cols-2 h-full">
        <div className="rounded-xl border border-amber-200 bg-white dark:bg-card p-6 space-y-4">
          <div className="font-mono text-xs font-bold uppercase text-amber-600">
            THE PROBLEM WITH TRADITIONAL PLATFORMS
          </div>
          <div className="space-y-3">
            {[
              ['Passive Video Watching', 'Finishing playlists gives certificates without proving ability to build or debug systems.'],
              ['Self-Declared Resume Claims', 'Candidates list Docker or FastAPI without objective proof separating exposure from mastery.'],
              ['Unstructured Learning', 'Learners skip foundational APIs and testing, jumping straight to cloud deployment.'],
              ['No Human Code Review', 'MCQs alone miss architecture quality, error handling, and production readiness.'],
            ].map(([h, d]) => (
              <div key={h} className="rounded-lg border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 p-3">
                <div className="text-sm font-bold text-foreground">{h}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-white dark:bg-card p-6 space-y-4">
          <div className="font-mono text-xs font-bold uppercase text-indigo-600">
            THE SKILLFORGE SOLUTION (4 ENFORCED RULES)
          </div>
          <div className="space-y-3">
            {[
              ['1. Verified Beats Self-Declared', 'Self-claimed skills carry a dashed SELF_DECLARED badge and earn zero verified weight.'],
              ['2. Prerequisite-Gated Roadmaps', 'Modules enforce dependencies (e.g., core APIs before Docker; Docker before AWS).'],
              ['3. Business Rule 4 — Mentor Authority', 'Learners can never self-verify projects; submissions enter UNDER_REVIEW for mentor rubric grading.'],
              ['4. Honest Advisory Readiness Score', 'Transparent 0–100% formula with clear tiers and zero false employment guarantees.'],
            ].map(([h, d]) => (
              <div key={h} className="rounded-lg border border-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/20 p-3">
                <div className="text-sm font-bold text-indigo-900 dark:text-indigo-200">{h}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    tag: '02 · CORE WORKFLOW',
    title: 'End-to-End Career Loop & Verification Ladder',
    subtitle: 'Every learner progresses through a closed verification pipeline from target role to certified proof.',
    speakerNotes:
      'Walk through the 8-step loop and highlight how each skill upgrades through 4 distinct verification tiers: Self-Declared -> Assessed -> Project-Verified -> Verified.',
    render: () => (
      <div className="space-y-6">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'Target Career', 'Select role & benchmark requirements'],
            ['02', 'Skill Gap Analysis', 'Spot critical vs. secondary gaps'],
            ['03', 'Gated Roadmap', 'Follow prerequisite-locked phases'],
            ['04', 'Interactive Learn', 'Study focused lessons & examples'],
            ['05', 'Timed Quiz (>=70%)', 'Earn ASSESSED verification tier'],
            ['06', 'Capstone Project', 'Submit GitHub codebase for review'],
            ['07', 'Mentor Review', '8-point rubric unlocks VERIFIED'],
            ['08', 'Score & Certificate', 'Public /verify/:id credential'],
          ].map(([num, title, desc]) => (
            <div key={num} className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {num}
                </span>
                <span className="text-sm font-bold">{title}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="font-mono text-xs font-bold uppercase text-indigo-600 mb-3">
            4-STAGE SKILL VERIFICATION LADDER
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ['SELF_DECLARED', '1. Self-Declared', 'Dashed border; claimed by user, 0 credit', 'border-dashed border-slate-400 bg-slate-50 dark:bg-slate-900'],
              ['ASSESSED', '2. Assessed', 'Passed >=70% timed technical quiz', 'border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/30'],
              ['PROJECT_VERIFIED', '3. Project-Verified', 'Demonstrated in mentor-reviewed repo', 'border-purple-400 bg-purple-50/70 dark:bg-purple-950/30'],
              ['VERIFIED', '4. Fully Verified', 'Certified competency with renewal date', 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30'],
            ].map(([code, name, desc, cls]) => (
              <div key={code} className={cn('rounded-lg border p-3', cls)}>
                <div className="font-mono text-[10px] font-bold">{code}</div>
                <div className="text-sm font-bold mt-1">{name}</div>
                <div className="text-xs text-muted-foreground mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    tag: '03 · READINESS SCORING ENGINE',
    title: 'Weighted Readiness Formula & 5 Benchmark Tiers',
    subtitle: 'Formula: Technical Skills (35%) + Assessments (25%) + Mentor Projects (25%) + Interview Readiness (15%)',
    speakerNotes:
      'Highlight why projects and assessments together make up 50% of the score, while Technical Skills make up 35% and Interview Prep 15%. Point out Rahul Sharma sits at 72% (Junior Ready), just 3 points from Strong Candidate.',
    render: () => (
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5 rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="font-mono text-xs font-bold uppercase text-indigo-600">SCORE FORMULA WEIGHTS</div>
          {[
            ['Technical Skills', '35%', 35, 'bg-indigo-600'],
            ['Timed Assessments', '25%', 25, 'bg-blue-600'],
            ['Mentor-Reviewed Projects', '25%', 25, 'bg-purple-600'],
            ['Interview Readiness', '15%', 15, 'bg-amber-500'],
          ].map(([label, pct, w, color]) => (
            <div key={String(label)} className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span>{label}</span>
                <span>{pct}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className={cn('h-full rounded-full', color)} style={{ width: `${Number(w) * 2.2}%` }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 dark:bg-indigo-950/30 p-3.5 text-xs space-y-1">
            <div className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
              DEMO SNAPSHOT · RAHUL SHARMA
            </div>
            <div className="font-semibold">72% Overall · Junior Ready (Tier 3) · 7/10 Verified</div>
            <div className="text-muted-foreground">Only +3 pts needed to reach Strong Candidate (75%+)</div>
          </div>
        </div>

        <div className="md:col-span-7 rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="font-mono text-xs font-bold uppercase text-indigo-600">5 READINESS TIERS</div>
          {[
            ['0 – 39%', 'Foundation Required', 'Core concepts need strengthening before assessment pipelines.', false],
            ['40 – 59%', 'Developing', 'Foundational competence established; ongoing verification.', false],
            ['60 – 74%', 'Junior Ready (Current Demo: 72%)', 'Demonstrated core backend capabilities; ready for junior roles.', true],
            ['75 – 89%', 'Strong Candidate', 'Consistently verified across complex architecture & projects.', false],
            ['90 – 100%', 'Highly Ready', 'Comprehensive mastery verified via strict mentor evaluations.', false],
          ].map(([range, label, desc, active]) => (
            <div
              key={String(range)}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3',
                active
                  ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30'
                  : 'border-border bg-surface'
              )}
            >
              <span className="shrink-0 rounded bg-slate-900 dark:bg-indigo-600 px-2.5 py-1 font-mono text-xs font-bold text-white">
                {range}
              </span>
              <div>
                <div className="text-sm font-bold">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    tag: '04 · RBAC ARCHITECTURE',
    title: 'Three Role-Separated Portals',
    subtitle: 'ProtectedRoute and PublicOnlyRoute enforce strict access control across Learner, Mentor, and Admin views.',
    speakerNotes:
      'Explain the 3 portals: Learners learn and build; Mentors evaluate and verify; Admins govern skills, roles, courses, and audit logs. Trying to cross portal boundaries redirects cleanly to /403.',
    render: () => (
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            role: 'Learner Portal',
            path: '/app/*',
            acct: 'rahul.sharma@skillforge.io',
            accent: 'border-t-indigo-600',
            items: [
              '4-step Career Onboarding Wizard',
              'Readiness Dashboard & 7-Domain Radar',
              'Career Mapping & Skill Gap Engine',
              'Prerequisite-Gated Roadmap & Courses',
              'Timed Quizzes & Capstone Submissions',
              'AI Career Mentor & Practice Generator',
            ],
          },
          {
            role: 'Mentor Portal',
            path: '/mentor/*',
            acct: 'marcus.vance@skillforge.io',
            accent: 'border-t-purple-600',
            items: [
              'Assigned Learners & Cohort Overview',
              'Read-Only Learner Dossiers',
              'Pending Project Review Queue',
              '8-Criterion Rubric Grading Form',
              'Pass / Revision Verification Decisions',
              'Feedback History & Audit Trail',
            ],
          },
          {
            role: 'Admin Portal',
            path: '/admin/*',
            acct: 'devon.h@skillforge.io',
            accent: 'border-t-emerald-600',
            items: [
              'Platform Analytics & Readiness KPIs',
              'Users, Roles & Mentor Assignments',
              'Skills Catalog & Career Role Weights',
              'Courses, Modules & Lesson Builder',
              'Assessments & Question Bank',
              'Certificate Rules & Audit Logs',
            ],
          },
        ].map((p) => (
          <div key={p.role} className={cn('rounded-xl border border-t-4 border-border bg-card p-5 space-y-3', p.accent)}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">{p.path}</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{p.role}</h3>
              <p className="font-mono text-[11px] text-muted-foreground">{p.acct}</p>
            </div>
            <ul className="space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-indigo-600 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 6,
    tag: '05 · LEARNER DASHBOARD SHOWCASE',
    title: 'Actionable Readiness Insights at a Glance',
    subtitle: 'Designed to guide the learner toward the single highest-impact next action.',
    speakerNotes:
      'Describe what the learner sees first on /app/dashboard: Skill Renewal alerts, Readiness Score ring (72%), Verification ring (7/10), the Next Best Step CTA (Docker project +4%), and the 7-domain Radar Chart.',
    render: () => (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="font-mono text-xs font-bold text-indigo-600">PRIMARY DASHBOARD WIDGETS</div>
          <div className="space-y-2.5 text-xs">
            <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3">
              <div className="font-bold">Skill Renewal Reminder</div>
              <div className="text-muted-foreground">Flags expiring/expired skills (OOP, PyTest) with 1-click Quick Practice.</div>
            </div>
            <div className="rounded-lg border border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-3">
              <div className="font-bold">Readiness Ring (72%) + Pipeline Stepper</div>
              <div className="text-muted-foreground">Shows current tier (Junior Ready), points to next tier (3 pts), and 4-step pipeline.</div>
            </div>
            <div className="rounded-lg bg-indigo-700 text-white p-3">
              <div className="font-mono text-[10px] uppercase text-indigo-200">NEXT BEST STEP · RECOMMENDED ACTION</div>
              <div className="font-bold text-sm mt-0.5">Complete Your Docker Container Project (72% → 76%)</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="font-mono text-xs font-bold text-indigo-600">7-DOMAIN SKILL RADAR & GAP LIST</div>
          <div className="space-y-2 text-xs">
            {[
              ['Programming', '92% / 85%', 'Strongest Domain'],
              ['Architecture', '88% / 85%', 'Meets Benchmark'],
              ['Backend', '86% / 79%', '3/3 Verified'],
              ['Database', '62% / 77%', '1/2 Verified'],
              ['DevOps (Docker)', '35% / 68%', 'Critical Gap'],
              ['Cloud (AWS)', '28% / 68%', 'Focus Next'],
            ].map(([dom, sc, note]) => (
              <div key={dom} className="flex items-center justify-between rounded border border-border bg-surface px-3 py-2 font-mono">
                <span className="font-bold">{dom}</span>
                <span>{sc}</span>
                <span className="text-muted-foreground">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    tag: '06 · LEARNER CAPABILITIES',
    title: 'Onboarding, Gated Roadmaps, Quizzes & Certificates',
    subtitle: 'Every feature ties directly into measurable skill progression and verifiable credentials.',
    speakerNotes:
      'Highlight the timed quiz persistence (useTimer), Business Rule 4 on projects, and public certificate verification at /verify/:certificateId.',
    render: () => (
      <div className="grid gap-5 md:grid-cols-2">
        {[
          {
            tag: 'ONBOARDING & CAREER MAPPING',
            title: '4-Step Onboarding & Role Fit Scoring',
            desc: 'New accounts flow immediately into role selection, skill self-rating, and weekly study goals, calculating match percentages across target careers.',
          },
          {
            tag: 'TIMED ASSESSMENTS',
            title: 'Persistent Countdown Timer & >=70% Bar',
            desc: 'Objective technical quizzes persist answers locally, warn on low remaining time, and require at least 70% to unlock ASSESSED standing.',
          },
          {
            tag: 'CAPSTONE PROJECTS',
            title: 'GitHub Repo Submission + Mentor Lock',
            desc: 'Submissions enter UNDER_REVIEW immediately; learners cannot approve their own work until a mentor grades all 8 rubric criteria.',
          },
          {
            tag: 'CERTIFICATES & RENEWAL',
            title: 'Public Verification (/verify/:id)',
            desc: 'Earned only after >=80% courses, >=70% quizzes, and passing project review — verifiable publicly by recruiters.',
          },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="font-mono text-[10px] font-bold text-indigo-600">{c.tag}</div>
            <h3 className="text-base font-bold">{c.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 8,
    tag: '07 · AI CAREER MENTOR & PRACTICE',
    title: 'Context-Aware AI Study Guide & Practice Generator',
    subtitle: 'Available at /app/ai-mentor and via the persistent floating AI Mentor drawer across all learner screens.',
    speakerNotes:
      'Show how the AI Mentor reads the learner’s actual SkillForge readiness score, strengths, and gaps—returning structured Skill Analysis bars and interactive practice quizzes on demand.',
    render: () => (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-indigo-200 bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600">
            <Bot className="h-4 w-4" />
            <span>AI CAREER MENTOR CAPABILITIES</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="font-bold">Conversational Study Guidance</div>
              <div className="text-muted-foreground">Answers platform questions, next-step recommendations, readiness formula explanations, and gap strategies.</div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="font-bold">Visual Skill Analysis Cards</div>
              <div className="text-muted-foreground">Renders verified strengths (Python 92%, REST API 94%) alongside gaps (Docker 35%, AWS 25%) right inside chat.</div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="font-bold">Shared Floating Drawer (Zustand)</div>
              <div className="text-muted-foreground">Keeps chat history alive across Roadmap, Courses, Quizzes, and Projects.</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="font-mono text-xs font-bold text-indigo-600">AI PRACTICE QUESTION GENERATOR</div>
          <p className="text-xs text-muted-foreground">
            Generates topic-specific MCQs with difficulty targeting (Docker, FastAPI, PostgreSQL, AWS, PyTest) and instant explanations.
          </p>
          <div className="rounded-lg border border-border bg-slate-950 p-4 text-slate-200 font-mono text-xs space-y-2">
            <div className="text-indigo-400">Topic: Docker · Multi-stage builds</div>
            <div>Q: Why use a multi-stage Dockerfile for Python services?</div>
            <div className="text-emerald-400">✓ Separates build compilers from minimal runtime image</div>
            <div className="text-slate-400">→ Cuts image size from ~900MB to &lt;150MB &amp; reduces attack surface.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    tag: '08 · MENTOR & ADMIN PORTALS',
    title: 'Human Verification & Platform Governance',
    subtitle: 'Balancing automated assessment speed with human engineering judgment and full admin control.',
    speakerNotes:
      'Discuss the Mentor review workflow (Marcus Vance inspecting Rahul, Elena, and Marcus Chen) and Admin controls (Devon Brooks managing taxonomy, role weights, and audit logs).',
    render: () => (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-purple-200 bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-600">
            <ShieldCheck className="h-4 w-4" />
            <span>MENTOR PORTAL (/mentor/*)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li><strong className="text-foreground">Cohort KPIs:</strong> Tracks 3 assigned mentees, pending vs. completed reviews, and 74% avg cohort readiness.</li>
            <li><strong className="text-foreground">8-Point Rubric Evaluation:</strong> Grades API architecture, database transactions, tests, Dockerization, security & docs.</li>
            <li><strong className="text-foreground">Read-Only Dossiers:</strong> Reviews learner skill matrix, quiz attempts, and AI mentor activity before grading.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600">
            <Layers className="h-4 w-4" />
            <span>ADMIN CONSOLE (/admin/*)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li><strong className="text-foreground">Taxonomy & Role Weights:</strong> Defines skills catalog, career roles, and weighted proficiency thresholds.</li>
            <li><strong className="text-foreground">Content & Assessments:</strong> Publishes courses, lessons, timed quizzes, and project templates.</li>
            <li><strong className="text-foreground">Certificates & Audit Logs:</strong> Governs issuance rules, revocations, mentor assignments, and activity logs.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    tag: '09 · TECHNICAL ARCHITECTURE',
    title: 'Frontend Stack & Resilient Dual-Mode Data Layer',
    subtitle: 'Clean modular TypeScript architecture ready for backend integration and zero-downtime live demos.',
    speakerNotes:
      'Explain the 3 layers: React 19 + Tailwind UI, Zustand + Route Guard state layer, and Axios service layer with built-in demo/offline persistence.',
    render: () => (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['1. UI & Visualization', ['React 19 + TypeScript', 'Tailwind CSS v4', 'Recharts (Radar & Trends)', 'Lucide Icons + Motion']],
            ['2. State & Routing', ['Zustand (authStore, mentorStore)', 'AuthContext + RoleGate', 'Client SPA Router (35+ pages)', 'Persistent Quiz Timer']],
            ['3. Services & Resilience', ['Typed Axios + Bearer Interceptors', 'Zod Validation', 'REST API (VITE_API_BASE_URL)', 'LocalStorage Demo Persistence']],
          ].map(([h, list]) => (
            <div key={String(h)} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="text-sm font-bold text-indigo-600">{h}</div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {(list as string[]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-4 rounded-xl bg-slate-950 p-5 text-white">
          {[
            ['Vite 8 + Vercel', 'Production SPA Build'],
            ['35+ Pages', 'Public, Learner, Mentor & Admin'],
            ['Instant Auth', 'Demo + Fast Signup Flow'],
            ['tsc + vite build', 'Typechecked & Verified'],
          ].map(([big, small]) => (
            <div key={big}>
              <div className="font-bold text-indigo-300 text-base">{big}</div>
              <div className="text-xs text-slate-400 mt-0.5">{small}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 11,
    tag: '10 · LIVE DEMO SCRIPT & Q&A',
    title: '3-Minute Presentation Walkthrough Guide',
    subtitle: 'Use these three demo accounts tomorrow to showcase every role seamlessly.',
    speakerNotes:
      'Keep these credentials handy during the demo: Rahul for Learner, Marcus for Mentor, Devon for Admin, plus /register for instant new-user onboarding.',
    render: () => (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['STEP 1 · LEARNER', 'rahul.sharma@skillforge.io  /  skillforge123', 'Show Readiness Score (72%), Skill Radar, and ask AI Mentor "What should I do next?".'],
            ['STEP 2 · NEW SIGNUP', '/register  →  /app/onboarding', 'Create a fresh learner account to show instant registration & 4-step onboarding.'],
            ['STEP 3 · MENTOR', 'marcus.vance@skillforge.io  /  skillforge123', 'Open Pending Project Reviews and grade a submission on the 8-point rubric.'],
            ['STEP 4 · ADMIN & VERIFY', 'devon.h@skillforge.io  /  skillforge123  |  /verify', 'Inspect Platform Analytics, Skills Catalog, and verify a public certificate ID.'],
          ].map(([step, cred, desc]) => (
            <div key={step} className="rounded-xl border border-border bg-card p-4 space-y-1.5">
              <div className="font-mono text-[10px] font-bold text-indigo-600">{step}</div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <Terminal className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span>{cred}</span>
              </div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-indigo-600 p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold">Thank You! — Questions & Live Demo</div>
            <div className="text-xs text-indigo-100">SkillForge · AI-Powered Career Readiness Platform</div>
          </div>
          <span className="font-mono text-xs rounded-lg bg-white/15 px-3 py-1.5 font-semibold">
            Ready for Tomorrow&apos;s Presentation
          </span>
        </div>
      </div>
    ),
  },
];

export function PresentationPage({ onNavigate }: PresentationPageProps) {
  const [idx, setIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const current = SLIDES[idx];

  const goPrev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIdx((i) => Math.min(SLIDES.length - 1, i + 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const handleDownloadPptx = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/SkillForge_Presentation.pptx');
      if (!res.ok) throw new Error('Download failed');
      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SkillForge_Presentation.pptx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement('a');
      a.href = '/SkillForge_Presentation.pptx';
      a.download = 'SkillForge_Presentation.pptx';
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={cn('min-h-screen bg-background text-foreground flex flex-col', isFullscreen && 'fixed inset-0 z-50')}>
      {/* Top Toolbar */}
      <header className="border-b border-border bg-card px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to App</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <Presentation className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">SkillForge Presentation Deck</span>
            <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold">
              {idx + 1} / {SLIDES.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPptx}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloading ? 'Preparing .pptx...' : 'Download PowerPoint (.pptx)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Present'}</span>
          </button>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm min-h-[460px] flex flex-col justify-between gap-6">
          <div className="space-y-1 border-b border-border pb-4">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              {current.tag}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{current.title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{current.subtitle}</p>
          </div>

          <div className="flex-1">{current.render()}</div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={idx === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              Use ← / → arrow keys to navigate slides
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={idx === SLIDES.length - 1}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-foreground/90 transition-colors"
            >
              <span>Next Slide</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slide Strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SLIDES.map((s, sIdx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(sIdx)}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-2 text-left transition-all w-44',
                sIdx === idx
                  ? 'border-primary bg-primary/10 text-foreground font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:bg-surface'
              )}
            >
              <div className="font-mono text-[10px] font-bold text-primary">SLIDE {s.id}</div>
              <div className="text-xs truncate mt-0.5">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Speaker Notes */}
        {!isFullscreen && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
              Speaker Notes for Slide {current.id}
            </div>
            <p className="mt-1 text-xs text-foreground leading-relaxed">{current.speakerNotes}</p>
          </div>
        )}
      </main>
    </div>
  );
}
