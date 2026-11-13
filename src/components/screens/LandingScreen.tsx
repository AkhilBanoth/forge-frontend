import React, { useState } from 'react';
import { SkillForgeLogo } from '../shared/SkillForgeLogo';
import {
  ArrowRight,
  PlayCircle,
  Star,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Code2,
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  ChevronRight,
  Check,
  X,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { showToast } from '../shared/ToastNotification';
import { useThemeStore } from '../../stores/themeStore';

interface LandingScreenProps {
  onNavigate: (path: string) => void;
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [certInput, setCertInput] = useState('');
  const { isDark, toggleTheme } = useThemeStore();

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    showToast('success', `Certificate ${certInput} is valid and verified on SkillForge.`);
    onNavigate('/certificates');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background transition-colors duration-200">
      {/* Top Navigation Bar - Exact layout from screenshot in monochrome */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('/')}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-lg"
            >
              <SkillForgeLogo size="md" />
            </button>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a
                href="#how-it-works"
                className="hover:text-foreground transition-colors"
              >
                How it works
              </a>
              <button
                onClick={() => onNavigate('/roadmap')}
                className="hover:text-foreground transition-colors"
              >
                Career paths
              </button>
              <button
                onClick={() => onNavigate('/certificates')}
                className="hover:text-foreground transition-colors"
              >
                Verify certificate
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
            </button>

            <button
              onClick={() => onNavigate('/login')}
              className="text-sm font-semibold text-foreground hover:opacity-80 transition-opacity"
            >
              Log in
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2.5 text-sm font-semibold shadow-sm shadow-indigo-500/25 transition-all border border-transparent"
            >
              <span>Get started</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-8">
              {/* Kicker badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-surface px-3.5 py-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  The Career Growth Platform
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                SkillForge for<br />
                your <span className="text-indigo-600 dark:text-indigo-400">next<br />chapter.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                A clearer path from where you are to where you want to be. Build real skills, earn proof, and move forward with confidence.
              </p>

              {/* CTA Action Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 text-base font-semibold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-transparent"
                >
                  <span>Start building</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card px-5 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs"
                >
                  <PlayCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>See how it works</span>
                </button>
              </div>

              {/* Social Proof Row */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* Avatar stack in reference colors */}
                <div className="flex items-center -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-slate-800 text-[11px] font-mono font-bold text-white shadow-xs">
                    AK
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-amber-600 text-[11px] font-mono font-bold text-white shadow-xs">
                    JM
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-indigo-600 text-[11px] font-mono font-bold text-white shadow-xs">
                    RT
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-indigo-100 dark:bg-indigo-950/80 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 shadow-xs">
                    +
                  </div>
                </div>

                {/* Built around goals */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Built around your goals
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-mono">
                    Learning that leads somewhere.
                  </span>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

                {/* Star rating in amber gold */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    4.9 / learner rating
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Pixel-Accurate Interactive Mockup matching Reference Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                {/* Floating Card 1: Top-Right "New Certificate" with Mint Green Check */}
                <div className="absolute -top-4 -right-2 sm:-right-4 z-20 flex items-center gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl shadow-slate-900/5 backdrop-blur-md animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col font-mono">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">New certificate</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">UX Foundations</span>
                  </div>
                </div>

                {/* Main Card Container */}
                <div className="relative z-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-indigo-500/5">
                  {/* Card Header: mini logo + 3 dots */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <SkillForgeLogo size="sm" />
                    <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                    </div>
                  </div>

                  {/* Greeting & Date */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Monday, October 12
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Your next move is taking shape.
                    </h3>
                  </div>

                  {/* 2-Column KPI Widgets */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {/* Career Readiness Widget */}
                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5 space-y-2">
                      <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 block">
                        Career readiness
                      </span>
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">78</span>
                        <span className="text-xs text-slate-400 font-semibold">/100</span>
                      </div>
                      {/* Gradient Indigo Progress Bar */}
                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-full w-[78%]" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        <span>+12 this month</span>
                      </span>
                    </div>

                    {/* Streak Widget */}
                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>12 day streak</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        You're on a roll.
                      </span>
                      {/* 7 Streak dots: 5 solid gold/amber dots, 2 muted gray dots */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-2xs shadow-amber-400/40" />
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-2xs shadow-amber-400/40" />
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-2xs shadow-amber-400/40" />
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-2xs shadow-amber-400/40" />
                        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-2xs shadow-amber-400/40" />
                        <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Learning Momentum with Royal Indigo Sparkline Wave */}
                  <div className="mt-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Your Learning Momentum
                      </span>
                      <span className="rounded-full border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        +18%
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Steady progress, real skills
                    </span>

                    {/* Indigo Wave Curve Chart matching reference image */}
                    <div className="pt-2">
                      <svg viewBox="0 0 400 60" className="w-full h-14 overflow-visible">
                        <defs>
                          <linearGradient id="indigoWaveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area fill */}
                        <path
                          d="M 0 45 Q 60 25, 120 40 T 240 30 T 340 18 T 400 12 L 400 60 L 0 60 Z"
                          fill="url(#indigoWaveGradient)"
                        />
                        {/* Smooth Line stroke */}
                        <path
                          d="M 0 45 Q 60 25, 120 40 T 240 30 T 340 18 T 400 12"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="dark:stroke-indigo-400"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Continue Learning Row */}
                  <div
                    onClick={() => onNavigate('/roadmap')}
                    className="mt-4 flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Continue Learning
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Frontend engineering
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          Module 4 · Component systems
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Floating Card 2: Bottom-Right "Career Match" with Violet & Teal */}
                <div className="absolute -bottom-4 right-2 sm:right-6 z-20 flex items-center gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl shadow-slate-900/5 backdrop-blur-md animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col font-mono">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Career Match
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Product designer</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">86%</span>
                      <ExternalLink className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
              The SkillForge Method
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Proof beats promises. How SkillForge verifies your readiness.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Employers don't want certificates of completion; they want proof of production ability. SkillForge bridges the gap with an objective 3-step verification loop.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold text-base shadow-sm shadow-indigo-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Identify Real Skill Gaps</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Declare your baseline skills and benchmark against target job roles. Our diagnostic engine ranks your critical vs. secondary gaps.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold text-base shadow-sm shadow-indigo-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Prerequisite Roadmaps</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Structured dependency timeline where advanced milestones only unlock when foundations are verified through timed objective tests.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold text-base shadow-sm shadow-indigo-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Mentor-Reviewed Capstones</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit production codebases to our senior engineering review queue. Receive rigorous rubric scoring on code quality, testing, and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verify Certificate Quick Tool */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-1 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
            <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Cryptographic Credential Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Verify a Candidate's SkillForge Certificate
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto font-mono">
            Enter any Certificate ID (e.g. <span className="font-bold text-indigo-600 dark:text-indigo-400">SKF-PY-2026-8941</span>) to inspect verified rubric scores.
          </p>

          <form
            onSubmit={handleVerifyCert}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="e.g. SKF-PY-2026-8941"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-mono font-bold shadow-sm shadow-indigo-500/20 transition-all shrink-0"
            >
              Verify Now
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground font-mono">
          <SkillForgeLogo size="sm" />
          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-foreground">
              Dashboard
            </button>
            <button onClick={() => onNavigate('/roadmap')} className="hover:text-foreground">
              Roadmap
            </button>
            <button onClick={() => onNavigate('/assessments')} className="hover:text-foreground">
              Assessments
            </button>
            <button onClick={() => onNavigate('/projects')} className="hover:text-foreground">
              Projects
            </button>
            <button onClick={() => onNavigate('/admin')} className="hover:text-foreground font-bold underline">
              Admin Console
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors"
              title="Toggle dark / light theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span className="font-mono">{isDark ? 'Dark theme' : 'Light theme'}</span>
            </button>
            <span>© 2026 SkillForge Inc.</span>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border-2 border-foreground bg-card p-6 space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base">How SkillForge Works</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video rounded-xl bg-surface border border-border flex flex-col items-center justify-center p-6 text-center">
              <PlayCircle className="h-12 w-12 text-foreground mb-2" />
              <span className="font-semibold text-sm">Product Overview & Verification Walkthrough</span>
              <span className="text-xs text-muted-foreground mt-1 font-mono">
                Demonstrating career readiness scoring, assessments, and mentor rubric evaluations.
              </span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  onNavigate('/dashboard');
                }}
                className="rounded-xl bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90"
              >
                Enter Platform Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
