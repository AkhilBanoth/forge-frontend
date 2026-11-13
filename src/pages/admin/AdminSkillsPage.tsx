import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { careerService } from '../../lib/api/services';
import type { Skill, SkillCategory } from '../../types';
import { SKILL_LEVEL_ORDER } from '../../constants/readiness';
import { Plus, Sliders } from 'lucide-react';

const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming',
  'Backend',
  'Database',
  'DevOps',
  'Cloud',
  'Testing',
  'Architecture',
];

export function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Backend');
  const [description, setDescription] = useState('');

  useEffect(() => {
    careerService.getSkillCatalog().then((res) => {
      setSkills(res.data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await careerService.createSkill({
      name: name.trim(),
      category,
      description: description.trim() || 'Core technical competency',
    });
    setSkills((prev) => [...prev, res.data]);
    setName('');
    setDescription('');
    showToast('success', `Added "${res.data.name}" to the skill catalog.`);
  };

  if (loading) {
    return <LoadingState message="Loading skill catalog..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Catalog & Proficiency Levels"
        description="Manage the standardized skills used across careers, courses, quizzes, and readiness calculations."
      />

      {/* Proficiency Levels Reference */}
      <div className="grid gap-3 sm:grid-cols-4">
        {Object.entries(SKILL_LEVEL_ORDER).map(([level, rank]) => (
          <div key={level} className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="font-mono text-xs text-muted-foreground">Level {rank}</div>
            <div className="text-sm font-bold text-foreground">{level}</div>
          </div>
        ))}
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAdd} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground">Add New Catalog Skill</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skill name (e.g., Redis Caching)"
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description..."
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      </form>

      {/* Catalog Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((sk) => (
          <div key={sk.id} className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">{sk.category}</span>
              <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="text-sm font-bold text-foreground">{sk.name}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{sk.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
