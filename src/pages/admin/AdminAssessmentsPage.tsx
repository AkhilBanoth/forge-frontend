import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { assessmentService } from '../../lib/api/services';
import type { Assessment, Question, QuestionType } from '../../types';
import { CheckSquare, Plus, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const QUESTION_TYPES: QuestionType[] = [
  'MCQ',
  'MULTI_SELECT',
  'TRUE_FALSE',
  'CODING',
  'SCENARIO',
];

export function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [prompt, setPrompt] = useState('');
  const [qType, setQType] = useState<QuestionType>('MCQ');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    assessmentService.getAssessments().then((res) => {
      setAssessments(res.data);
      if (res.data.length > 0) {
        setSelectedId(res.data[1]?.id || res.data[0].id);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState message="Loading assessments and question bank..." />;
  }

  const activeAssessment = assessments.find((a) => a.id === selectedId) || assessments[0];
  const questions = activeAssessment?.questions || [];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssessment || !prompt.trim() || !optA.trim() || !optB.trim()) return;
    const options =
      qType === 'TRUE_FALSE'
        ? ['True', 'False']
        : [optA.trim(), optB.trim(), optC.trim()].filter(Boolean);

    const newQ: Question = {
      id: `q_${Date.now()}`,
      assessmentId: activeAssessment.id,
      prompt: prompt.trim(),
      type: qType,
      options,
      correctAnswers: [0],
      explanation: explanation.trim() || 'Reviewed against SkillForge technical rubric.',
    };

    setAssessments((prev) =>
      prev.map((a) =>
        a.id !== activeAssessment.id
          ? a
          : {
              ...a,
              questionCount: a.questionCount + 1,
              questions: [...(a.questions || []), newQ],
            }
      )
    );
    setPrompt('');
    setOptA('');
    setOptB('');
    setOptC('');
    setExplanation('');
    showToast('success', `Added ${qType} question to "${activeAssessment.title}".`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessments & Question Bank"
        description="Inspect timed assessments, passing scores (>= 70%), and manage questions across all 5 question types."
      />

      {/* Assessment Selector */}
      <div className="grid gap-4 md:grid-cols-3">
        {assessments.map((asmt) => (
          <button
            key={asmt.id}
            type="button"
            onClick={() => setSelectedId(asmt.id)}
            className={cn(
              'rounded-xl border p-5 text-left space-y-2 transition-colors',
              asmt.id === activeAssessment?.id
                ? 'border-2 border-primary bg-card'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{asmt.skill.name}</span>
              <span>Pass: {asmt.passingScorePercentage}%</span>
            </div>
            <div className="text-sm font-bold text-foreground">{asmt.title}</div>
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckSquare className="h-3.5 w-3.5" />
                {asmt.questions?.length ?? asmt.questionCount} questions
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {asmt.timeLimitMinutes} min
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeAssessment && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Question Bank List */}
          <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Questions in {activeAssessment.title} ({questions.length})
            </h2>

            {questions.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">
                No inline preview questions loaded for this assessment yet. Use the form on the right to add one.
              </p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-border bg-background p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Q{idx + 1}</span>
                      <span className="font-bold text-primary">{q.type}</span>
                    </div>
                    <div className="font-semibold text-foreground">{q.prompt}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Options: {q.options.join(' | ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Question Form */}
          <form
            onSubmit={handleAddQuestion}
            className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-4 self-start"
          >
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Add Question to Bank
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Question Type</label>
              <select
                value={qType}
                onChange={(e) => setQType(e.target.value as QuestionType)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Question Prompt</label>
              <textarea
                rows={3}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write a clear technical question..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>

            {qType !== 'TRUE_FALSE' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Answer Options</label>
                <input
                  type="text"
                  required
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  placeholder="Option A (Correct answer)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                />
                <input
                  type="text"
                  required
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  placeholder="Option B"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                />
                <input
                  type="text"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  placeholder="Option C (Optional)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Explanation</label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Why the correct answer works..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Question Bank</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
