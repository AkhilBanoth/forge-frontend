import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { careerService, userService } from '../../lib/api/services';
import type { CareerRole, Skill, SkillLevel, UserSkill } from '../../types';
import { VerificationBadge } from '../shared/VerificationBadge';
import { ResumeUploadSection } from '../shared/ResumeUploadSection';
import { showToast } from '../shared/ToastNotification';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  Link as LinkIcon,
  Award,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../stores/themeStore';

interface OnboardingScreenProps {
  onNavigate: (path: string) => void;
}

export function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  const user = useAuthStore((state) => state.user);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { isDark, toggleTheme } = useThemeStore();

  const [step, setStep] = useState(1);
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [skillCatalog, setSkillCatalog] = useState<Skill[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@skillforge.io',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA',
    education: 'B.S. in Computer Science',
    currentJob: 'Junior Software Engineer Intern',
    yearsExperience: 1,
    resumeName: '',
    resumeSize: undefined as number | undefined,
    resumeUploadedAt: '',
    resumeUrl: '',
    githubUrl: 'https://github.com/rahulsharma-dev',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma-backend',
    portfolioUrl: 'https://rahulsharma.dev',
    targetCareerId: 'career_py_backend',
  });

  // Dynamic Skill Selector State
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ skill: Skill; level: SkillLevel }>
  >([
    {
      skill: {
        id: 'sk_py',
        name: 'Python Core & Advanced',
        category: 'Programming',
        description: 'Metaclasses, generators, async IO, memory management',
      },
      level: 'Advanced',
    },
    {
      skill: {
        id: 'sk_fastapi',
        name: 'FastAPI Framework',
        category: 'Backend',
        description: 'Pydantic schemas, dependency injection, async request handling',
      },
      level: 'Intermediate',
    },
    {
      skill: {
        id: 'sk_docker',
        name: 'Docker & Containerization',
        category: 'DevOps',
        description: 'Multi-stage builds, Docker Compose, container lifecycle',
      },
      level: 'Beginner',
    },
  ]);

  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [carRes, catRes] = await Promise.all([
          careerService.getCareers(),
          careerService.getSkillCatalog(),
        ]);
        setCareers(carRes.data);
        setSkillCatalog(catRes.data);
      } catch {
        // Fallback handled by mocks
      }
    }
    loadData();
  }, []);

  // Skill Selector Logic
  const handleAddSkill = (skill: Skill) => {
    // Prevent duplicates
    if (selectedSkills.some((s) => s.skill.id === skill.id)) {
      showToast('warning', `${skill.name} is already added to your skill list.`);
      return;
    }
    setSelectedSkills((prev) => [...prev, { skill, level: 'Intermediate' }]);
    setSkillSearchQuery('');
    showToast('info', `Added ${skill.name}. Defaulted to Intermediate.`);
  };

  const handleUpdateLevel = (skillId: string, level: SkillLevel) => {
    setSelectedSkills((prev) =>
      prev.map((item) => (item.skill.id === skillId ? { ...item, level } : item))
    );
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((item) => item.skill.id !== skillId));
  };

  // Group catalog by category
  const filteredCatalog = skillCatalog.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(filteredCatalog.map((s) => s.category)));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await userService.updateProfile({
        phone: formData.phone,
        location: formData.location,
        education: formData.education,
        currentJob: formData.currentJob,
        yearsExperience: Number(formData.yearsExperience),
        resumeUrl: formData.resumeUrl,
        resumeFileName: formData.resumeName || undefined,
        resumeFileSize: formData.resumeSize,
        resumeUploadedAt: formData.resumeUploadedAt || undefined,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        targetCareerId: formData.targetCareerId,
        isProfileComplete: true,
      });

      // Submit user skills
      for (const item of selectedSkills) {
        await userService.addSkill({
          skillId: item.skill.id,
          skill: item.skill,
          level: item.level,
          verificationStatus: 'SELF_DECLARED',
        });
      }

      setProfile({
        ...formData,
        resumeFileName: formData.resumeName || undefined,
        resumeFileSize: formData.resumeSize,
        resumeUploadedAt: formData.resumeUploadedAt || undefined,
        userId: user?.id || 'usr_01',
        isProfileComplete: true,
        yearsExperience: Number(formData.yearsExperience),
      });

      showToast('success', 'Profile and starting skills saved.');
      onNavigate('/dashboard');
    } catch {
      showToast('error', 'Could not save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Onboarding Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span>Profile Setup</span>
              <span>·</span>
              <span>Step {step} of 4</span>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
            </button>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Set Up Your Profile &amp; Skills
          </h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-xl">
            Tell us about your background and target job. Your starting skills build your learning plan, which you can later verify through quizzes and mentor-reviewed projects.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
            {['1. About You', '2. Links', '3. Target Job', '4. Your Skills'].map(
              (label, idx) => (
                <div
                  key={label}
                  className={cn(
                    'flex-1 text-center py-1 font-mono text-[11px] rounded border transition-colors',
                    step === idx + 1
                      ? 'border-2 border-foreground bg-card font-bold text-foreground'
                      : step > idx + 1
                      ? 'bg-secondary border-border text-foreground'
                      : 'border-border/40 text-muted-foreground opacity-60'
                  )}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold font-sans">Your Background</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded border border-border bg-secondary px-3 py-2 text-xs opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Highest Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground">Current Role</label>
                <input
                  type="text"
                  value={formData.currentJob}
                  onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                  placeholder="e.g. Student / Junior Intern"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Upload Resume (Optional)
                </label>
                <ResumeUploadSection
                  showUrlFallback={false}
                  value={{
                    fileName: formData.resumeName,
                    fileSize: formData.resumeSize,
                    uploadedAt: formData.resumeUploadedAt,
                    resumeUrl: formData.resumeUrl,
                  }}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      resumeName: next.fileName || '',
                      resumeSize: next.fileSize,
                      resumeUploadedAt: next.uploadedAt || '',
                      resumeUrl: next.resumeUrl || '',
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                <span>Continue to Links</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Portfolio & Code Links */}
        {step === 2 && (
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold font-sans">Portfolio &amp; Profile Links</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Public profile links let mentors and employers review your code and experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3" /> GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3" /> LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3" /> Portfolio or Personal Website
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourname.dev"
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                <span>Continue to Target Job</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Target Career Selection */}
        {step === 3 && (
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold font-sans">Pick Your Target Job Role</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your learning plan, skill gaps, and practice tests will match this role.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {careers.map((career) => {
                const isSelected = formData.targetCareerId === career.id;
                return (
                  <div
                    key={career.id}
                    onClick={() => setFormData({ ...formData, targetCareerId: career.id })}
                    className={cn(
                      'flex flex-col justify-between p-4 rounded-lg border cursor-pointer transition-all',
                      isSelected
                        ? 'border-2 border-foreground bg-surface shadow-none'
                        : 'border-border bg-card hover:border-foreground/50'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {career.category}
                        </span>
                        {isSelected && (
                          <span className="rounded bg-foreground text-background p-0.5">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm tracking-tight">{career.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {career.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] font-mono">
                      <span>Target Score: {career.targetScore}%</span>
                      <span className="text-muted-foreground">{career.averageSalary}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 rounded bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                <span>Continue to Your Skills</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Dynamic Skill Selector */}
        {step === 4 && (
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold font-sans">Add Your Current Skills</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Add skills you already know. You can verify them later through assessments and projects.
              </p>
            </div>

            {/* Selected Skills List */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Skills Added ({selectedSkills.length})
              </span>

              {selectedSkills.length === 0 ? (
                <div className="rounded border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No skills declared yet. Search the catalog below to add skills.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedSkills.map((item) => (
                    <div
                      key={item.skill.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border border-border bg-surface p-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">
                            {item.skill.name}
                          </span>
                          <VerificationBadge status="SELF_DECLARED" size="sm" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Category: {item.skill.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Level Control Selector */}
                        <div className="flex items-center gap-1 border border-border rounded p-0.5 bg-card">
                          {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map(
                            (lvl) => (
                              <button
                                key={lvl}
                                onClick={() => handleUpdateLevel(item.skill.id, lvl)}
                                className={cn(
                                  'px-2 py-1 text-[11px] font-mono rounded transition-colors',
                                  item.level === lvl
                                    ? 'bg-foreground text-background font-bold'
                                    : 'text-muted-foreground hover:text-foreground'
                                )}
                              >
                                {lvl.slice(0, 3)}
                              </button>
                            )
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveSkill(item.skill.id)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="Remove skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Searchable Skill Catalog Combobox */}
            <div className="border-t border-border pt-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Add More Skills from Catalog
              </span>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  placeholder="Search catalog by name or category (e.g. Python, Docker, Database)..."
                  className="w-full rounded border border-border bg-surface pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Grouped Skills by Category */}
              <div className="max-h-56 overflow-y-auto rounded border border-border bg-card p-3 space-y-4">
                {categories.map((cat) => {
                  const skillsInCat = filteredCatalog.filter((s) => s.category === cat);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                        {cat}
                      </span>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {skillsInCat.map((skill) => {
                          const isAlreadyAdded = selectedSkills.some((s) => s.skill.id === skill.id);
                          return (
                            <button
                              key={skill.id}
                              onClick={() => handleAddSkill(skill)}
                              disabled={isAlreadyAdded}
                              className={cn(
                                'flex items-center justify-between p-2 rounded border text-left text-xs transition-colors',
                                isAlreadyAdded
                                  ? 'border-border/40 bg-secondary/50 text-muted-foreground opacity-50 cursor-not-allowed'
                                  : 'border-border bg-card hover:bg-secondary text-foreground'
                              )}
                            >
                              <span className="truncate pr-2">{skill.name}</span>
                              {isAlreadyAdded ? (
                                <Check className="h-3.5 w-3.5 shrink-0" />
                              ) : (
                                <Plus className="h-3.5 w-3.5 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedSkills.length === 0}
                className="inline-flex items-center gap-2 rounded bg-foreground px-6 py-2.5 text-xs font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Profile...' : 'Finish Setup & Go to Dashboard'}
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
