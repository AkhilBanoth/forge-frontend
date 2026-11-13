import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { careerService, userService } from '../../lib/api/services';
import type { CareerRole, Skill, SkillLevel, UserSkill } from '../../types';
import { PageHeader } from '../shared/PageHeader';
import { VerificationBadge } from '../shared/VerificationBadge';
import { ResumeUploadSection } from '../shared/ResumeUploadSection';
import { showToast } from '../shared/ToastNotification';
import {
  User,
  Link as LinkIcon,
  Target,
  Sliders,
  Plus,
  Trash2,
  Save,
  Sun,
  Moon,
  Bell,
  Calendar,
  FileText,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingsScreenProps {
  onNavigate: (path: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { isDark, toggleTheme } = useThemeStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'preferences'>('profile');
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [skillCatalog, setSkillCatalog] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state (PDF Section 6 fields)
  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@skillforge.io',
    phone: profile?.phone || '+1 (555) 234-8901',
    location: profile?.location || 'San Francisco, CA',
    education: profile?.education || 'B.S. in Computer Science',
    experienceSummary: '1 year building Python REST APIs, database schemas, and test suites.',
    currentJob: profile?.currentJob || 'Junior Software Engineer Intern',
    yearsExperience: profile?.yearsExperience ?? 1,
    resumeUrl: profile?.resumeUrl || '',
    resumeFileName: profile?.resumeFileName || '',
    resumeFileSize: profile?.resumeFileSize,
    resumeUploadedAt: profile?.resumeUploadedAt || '',
    githubUrl: profile?.githubUrl || 'https://github.com/rahulsharma-dev',
    linkedinUrl: profile?.linkedinUrl || 'https://linkedin.com/in/rahulsharma-backend',
    portfolioUrl: profile?.portfolioUrl || 'https://rahulsharma.dev',
    targetCareerId: profile?.targetCareerId || 'career_py_backend',
  });

  // Add skill inline state
  const [newSkillId, setNewSkillId] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  // Notification preferences
  const [prefs, setPrefs] = useState({
    expiryReminders: true,
    mentorReviewAlerts: true,
    weeklyReadinessDigest: true,
    recruiterVisibility: true,
  });

  useEffect(() => {
    async function load() {
      const [carRes, catRes, skRes] = await Promise.all([
        careerService.getCareers(),
        careerService.getSkillCatalog(),
        userService.getUserSkills(),
      ]);
      setCareers(carRes.data);
      setSkillCatalog(catRes.data);
      setUserSkills(skRes.data);
      if (catRes.data.length > 0) {
        setNewSkillId(catRes.data[0].id);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        phone: formData.phone,
        location: formData.location,
        education: formData.education,
        currentJob: formData.currentJob,
        yearsExperience: Number(formData.yearsExperience),
        resumeUrl: formData.resumeUrl,
        resumeFileName: formData.resumeFileName,
        resumeFileSize: formData.resumeFileSize,
        resumeUploadedAt: formData.resumeUploadedAt,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        targetCareerId: formData.targetCareerId,
        isProfileComplete: true,
      });
      setProfile(updated.data);
      showToast('success', 'Your profile and career goal have been saved.');
    } catch {
      showToast('error', 'Could not save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async () => {
    const skillObj = skillCatalog.find((s) => s.id === newSkillId);
    if (!skillObj) return;
    if (userSkills.some((us) => us.skillId === skillObj.id)) {
      showToast('warning', `${skillObj.name} is already in your skill list.`);
      return;
    }
    const res = await userService.addSkill({
      skillId: skillObj.id,
      skill: skillObj,
      level: newSkillLevel,
      verificationStatus: 'SELF_DECLARED',
    });
    setUserSkills((prev) => [...prev, res.data]);
    showToast('success', `Added ${skillObj.name} (${newSkillLevel}). Take a quiz or build a project to verify it.`);
  };

  const handleUpdateSkillLevel = (id: string, level: SkillLevel) => {
    setUserSkills((prev) =>
      prev.map((us) =>
        us.id === id
          ? {
              ...us,
              level,
              verificationStatus: 'SELF_DECLARED',
            }
          : us
      )
    );
    showToast('info', 'Skill level updated. Status reset to Self-Declared until verified.');
  };

  const handleRemoveSkill = (id: string) => {
    setUserSkills((prev) => prev.filter((us) => us.id !== id));
    showToast('info', 'Skill removed from your profile.');
  };

  return (
    <div className="space-y-8 select-none max-w-5xl mx-auto">
      <PageHeader
        title="Profile & Account Settings"
        description="Update your personal details, portfolio links, target job role, current skills, and display preferences."
        actions={
          <button
            onClick={() => onNavigate('/dashboard')}
            className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Back to Dashboard
          </button>
        }
      />

      {/* Settings Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 font-mono text-xs">
        {[
          { id: 'profile', label: 'Personal Details & Links', icon: User },
          { id: 'skills', label: `My Skills (${userSkills.length})`, icon: Sliders },
          { id: 'preferences', label: 'Display & Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-t-md transition-all whitespace-nowrap shrink-0',
                isActive
                  ? 'border-b-2 border-foreground bg-surface text-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Profile, Links & Target Career */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Basic Information</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keep your contact details, education, and work background up to date.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Education
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Current Job Title
                </label>
                <input
                  type="text"
                  value={formData.currentJob}
                  onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={formData.yearsExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, yearsExperience: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Target Job Role
                </label>
                <select
                  value={formData.targetCareerId}
                  onChange={(e) => setFormData({ ...formData, targetCareerId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono font-semibold text-muted-foreground">
                  Experience Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.experienceSummary}
                  onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload & Public Links */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Resume Upload &amp; Public Links</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your resume (PDF or Word) and add your GitHub, LinkedIn, and portfolio links so mentors can review your background.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Resume Document
              </label>
              <ResumeUploadSection
                value={{
                  fileName: formData.resumeFileName,
                  fileSize: formData.resumeFileSize,
                  uploadedAt: formData.resumeUploadedAt,
                  resumeUrl: formData.resumeUrl,
                }}
                onChange={(next) =>
                  setFormData((prev) => ({
                    ...prev,
                    resumeFileName: next.fileName || '',
                    resumeFileSize: next.fileSize,
                    resumeUploadedAt: next.uploadedAt || '',
                    resumeUrl: next.resumeUrl ?? prev.resumeUrl,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" /> Portfolio Website
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Current Skills & Expiry Tracking */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Add a Skill</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Skills you add yourself start as &ldquo;Self-Declared&rdquo;. Pass an assessment or get a project approved to verify them.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newSkillId}
                onChange={(e) => setNewSkillId(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                {skillCatalog.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>

              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                className="sm:w-44 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Your Listed Skills</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review your current skill levels, verification status, and validity dates.
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {userSkills.filter((s) => s.verificationStatus !== 'SELF_DECLARED').length} verified
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {userSkills.map((us) => (
                <div
                  key={us.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{us.skill.name}</span>
                      <VerificationBadge status={us.verificationStatus} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span>{us.skill.category}</span>
                      {us.assessedScore && (
                        <>
                          <span>·</span>
                          <span>Score: {us.assessedScore}%</span>
                        </>
                      )}
                      {us.expiresAt && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-foreground">
                            <Calendar className="h-3 w-3" />
                            Valid until {us.expiresAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={us.level}
                      onChange={(e) => handleUpdateSkillLevel(us.id, e.target.value as SkillLevel)}
                      className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-mono text-foreground"
                    >
                      {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map(
                        (lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(us.id)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Display & Notification Preferences */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the color theme that works best for you.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Theme Mode</p>
                <p className="text-xs text-muted-foreground">
                  Currently using {isDark ? 'Dark Mode' : 'Light Mode'}.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-mono font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Switch to {isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Email & Reminder Settings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose which updates and reminders you want to receive.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: 'expiryReminders' as const,
                  title: 'Skill Renewal Reminders',
                  desc: 'Notify me 30 days before a verified skill or certificate expires.',
                },
                {
                  key: 'mentorReviewAlerts' as const,
                  title: 'Project Review Updates',
                  desc: 'Send an alert as soon as a mentor grades my submitted project.',
                },
                {
                  key: 'weeklyReadinessDigest' as const,
                  title: 'Weekly Progress Summary',
                  desc: 'Send a weekly summary of my readiness score and next recommended step.',
                },
                {
                  key: 'recruiterVisibility' as const,
                  title: 'Show Verified Profile to Recruiters',
                  desc: 'Allow hiring teams on SkillForge to see my verified skills and projects.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPrefs((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                      showToast('success', 'Preference updated.');
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono font-bold border transition-colors shrink-0',
                      prefs[item.key]
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card text-muted-foreground border-border'
                    )}
                  >
                    {prefs[item.key] && <Check className="h-3.5 w-3.5" />}
                    <span>{prefs[item.key] ? 'On' : 'Off'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
