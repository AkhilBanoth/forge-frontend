import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  Terminal,
  Activity,
  Award,
  Layers,
  Check,
} from 'lucide-react';
import { showToast } from '../shared/ToastNotification';
import { SkillForgeLogo } from '../shared/SkillForgeLogo';
import techieImage from '../../assets/images/techie_dev_inventory_1794496224694.jpg';
import { cn } from '../../lib/utils';

interface LoginScreenProps {
  onNavigate: (path: string) => void;
}

type RolePersona = 'LEARNER' | 'MENTOR' | 'ADMIN';

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [selectedPersona, setSelectedPersona] = useState<RolePersona>('LEARNER');
  const [email, setEmail] = useState('rahul.sharma@skillforge.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const { isDark, toggleTheme } = useThemeStore();

  // Persona configurations
  const personas: Record<
    RolePersona,
    {
      name: string;
      email: string;
      roleLabel: string;
      icon: React.ElementType;
      destination: string;
      destinationLabel: string;
      description: string;
      highlight: string;
    }
  > = {
    LEARNER: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@skillforge.io',
      roleLabel: 'Student / Learner',
      icon: GraduationCap,
      destination: '/dashboard',
      destinationLabel: 'Learner Dashboard',
      description: 'Take skill quizzes, complete coding projects, and track your job readiness score.',
      highlight: 'Can switch between Learner, Mentor, and Admin anytime',
    },
    MENTOR: {
      name: 'Marcus Vance',
      email: 'marcus.vance@skillforge.io',
      roleLabel: 'Mentor & Project Reviewer',
      icon: ShieldCheck,
      destination: '/mentor',
      destinationLabel: 'Mentor Review Portal',
      description: 'Review student code submissions, give helpful feedback, and grade projects.',
      highlight: 'Fast 24-hour review turnaround',
    },
    ADMIN: {
      name: 'Devon Hayes',
      email: 'devon.h@skillforge.io',
      roleLabel: 'Platform Administrator',
      icon: Shield,
      destination: '/admin',
      destinationLabel: 'Admin Dashboard',
      description: 'Manage platform settings, student accounts, mentors, and issued certificates.',
      highlight: 'Full access to platform controls',
    },
  };

  const handleSelectPersona = (p: RolePersona) => {
    setSelectedPersona(p);
    setEmail(personas[p].email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      showToast('success', `Signed in as ${personas[selectedPersona]?.name || email}.`);
      const lower = email.toLowerCase();
      if (lower.includes('admin') || lower.includes('devon')) {
        onNavigate('/admin');
      } else if (lower.includes('mentor') || lower.includes('marcus')) {
        onNavigate('/mentor');
      } else {
        onNavigate('/dashboard');
      }
    } else {
      showToast('error', 'Invalid email or password.');
    }
  };

  const handle1ClickLogin = async (p: RolePersona) => {
    handleSelectPersona(p);
    setIsLoading(true);
    const cfg = personas[p];
    await login(cfg.email);
    setIsLoading(false);
    showToast('success', `Signed in! Opening ${cfg.destinationLabel}...`);
    onNavigate(cfg.destination);
  };

  const activeConfig = personas[selectedPersona];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground select-none">
      {/* LEFT COLUMN: Clean Platform Highlights & System Status */}
      <div className="relative lg:w-5/12 xl:w-1/2 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border/40">
        {/* Background 3D Developer Workspace Image with Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <img
            src={techieImage}
            alt="SkillForge Workspace"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Top Header on Left Side */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            title="Go to Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black font-mono font-black text-xs">
              SF
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-sm font-black tracking-tight leading-none">SKILLFORGE</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">CAREER PLATFORM</span>
            </div>
          </button>

          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-mono font-semibold text-slate-300">
            Secure Sign In
          </span>
        </div>

        {/* Center Technical Hero Info */}
        <div className="relative z-10 my-8 sm:my-12 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-950/60 px-3 py-0.5 text-[11px] font-mono text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Job Readiness &amp; Real Skills</span>
            </span>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight font-sans leading-tight text-white">
              Prove your skills.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                Get ready for the job.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md leading-relaxed">
              SkillForge tests what you can actually build using timed quizzes, real coding projects, and honest feedback from senior mentors.
            </p>
          </div>

          {/* Clean System Status Card */}
          <div className="rounded-xl border border-white/15 bg-slate-900/90 backdrop-blur-md p-4 text-xs font-mono space-y-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-slate-400 uppercase">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                <span>ACTIVE LOGIN DETAILS</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM READY
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-300 leading-relaxed pt-1">
              <div>&gt; Role: <span className="text-white font-bold">{activeConfig.roleLabel}</span></div>
              <div>&gt; Account: <span className="text-indigo-300">{activeConfig.name} ({activeConfig.email})</span></div>
              <div>&gt; Opening: <span className="text-white">{activeConfig.destinationLabel}</span></div>
              <div className="text-emerald-400 font-semibold">&gt; Status: Ready to Sign In</div>
            </div>
          </div>

          {/* Three Simple Standards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule 1</span>
              <span className="text-white font-bold text-xs block">Real Skills</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule 2</span>
              <span className="text-white font-bold text-xs block">Fair Reviews</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule 3</span>
              <span className="text-white font-bold text-xs block">Real Proof</span>
            </div>
          </div>
        </div>

        {/* Bottom Candidate Advisory Notice */}
        <div className="relative z-10 border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
          <p className="text-[11px] leading-relaxed">
            We provide honest feedback based on your actual performance. We never make unrealistic job promises.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Role Selector & Authentication Gateway (7/12 width) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background">
        {/* Top Action Nav: Home link + Theme Switcher */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>SkillForge Home</span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
          </button>
        </div>

        {/* Center Main Login Container */}
        <div className="mx-auto w-full max-w-lg my-auto py-8 space-y-7">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
              SIGN IN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-sans">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose your role below for instant sign-in, or type your email and password.
            </p>
          </div>

          {/* 3-Role Persona Segmented Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                CHOOSE YOUR ROLE:
              </span>
              <span className="text-[10px] text-muted-foreground">Quick Select</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl border border-border bg-surface font-mono text-xs">
              {(['LEARNER', 'MENTOR', 'ADMIN'] as RolePersona[]).map((role) => {
                const isSelected = selectedPersona === role;
                const p = personas[role];
                const Icon = p.icon;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectPersona(role)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg font-bold transition-all text-center',
                      isSelected
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px] truncate">
                      {role === 'LEARNER' ? 'Learner' : role === 'MENTOR' ? 'Mentor' : 'Admin'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Detail Banner */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs font-mono shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActiveIcon className="h-4 w-4 text-foreground" />
                  <span className="font-bold text-foreground text-sm">{activeConfig.name}</span>
                </div>
                <span className="rounded bg-surface border border-border px-2 py-0.5 text-[10px] text-muted-foreground font-semibold">
                  {activeConfig.destination}
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                {activeConfig.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {activeConfig.highlight}
                </span>
                <button
                  type="button"
                  onClick={() => handle1ClickLogin(selectedPersona)}
                  disabled={isLoading}
                  className="rounded-md bg-foreground px-3 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : `Sign in as ${selectedPersona === 'LEARNER' ? 'Learner' : selectedPersona === 'MENTOR' ? 'Mentor' : 'Admin'} →`}
                </button>
              </div>
            </div>
          </div>

          {/* Form Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-background px-3 font-mono text-[10px] uppercase text-muted-foreground tracking-wider shrink-0">
              OR SIGN IN WITH YOUR EMAIL
            </span>
            <div className="border-t border-border w-full" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-muted-foreground">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2.5 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-muted-foreground">
                  PASSWORD
                </label>
                <span
                  onClick={() => showToast('info', 'Demo password is pre-filled. Click Sign In.')}
                  className="text-[11px] font-mono text-muted-foreground cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-10 py-2.5 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges & Register Link */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground border-t border-border pt-4">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Protected Account</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Role-Based Access</span>
              </span>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="font-bold text-foreground underline hover:opacity-80"
              >
                Sign up for free
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="text-center text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-4">
          SkillForge Career Readiness Engine · Verified Skill Proof &copy; 2026
        </div>
      </div>
    </div>
  );
}

export function RegisterScreen({ onNavigate }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const { isDark, toggleTheme } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsLoading(true);
    const success = await register({
      name,
      email,
      password,
      targetCareerId: 'career_py_backend',
    });
    setIsLoading(false);
    if (success) {
      showToast('success', 'Account created! Starting onboarding profile.');
      onNavigate('/onboarding');
    } else {
      showToast('error', 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground select-none">
      {/* Left Column: Platform Promise */}
      <div className="relative lg:w-5/12 xl:w-1/2 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border/40">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src={techieImage}
            alt="SkillForge"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <button onClick={() => onNavigate('/')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black font-mono font-black text-xs">
              SF
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-sm font-black tracking-tight leading-none text-white">SKILLFORGE</span>
              <span className="text-[10px] text-slate-400 font-mono">LEARNER ONBOARDING</span>
            </div>
          </button>
        </div>

        <div className="relative z-10 my-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-950/60 px-3 py-0.5 text-[11px] font-mono text-indigo-300">
            <Award className="h-3 w-3 text-indigo-400" />
            <span>Verified Skill Record</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Build real technical skills that employers can trust.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
            Join students closing their skill gaps with timed quizzes, mentor-reviewed projects, and clear job readiness scores.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-white font-bold underline hover:opacity-80"
          >
            Sign In here
          </button>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>SkillForge Home</span>
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <div className="mx-auto w-full max-w-md my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
              GET STARTED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Create Your Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Start your learning path toward junior and mid-level software engineering jobs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-muted-foreground">FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Priya Patel"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-muted-foreground">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="priya@example.com"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-muted-foreground">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Start Setup'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-xs text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="font-bold text-foreground underline hover:opacity-80"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-4">
          SkillForge &copy; 2026 · Job Readiness &amp; Skill Verification
        </div>
      </div>
    </div>
  );
}
