import React, { useState, useEffect } from 'react';
import { assessmentService } from '../../lib/api/services';
import type { Assessment, AssessmentResult, Question } from '../../types';
import { useTimer } from '../../hooks/useTimer';
import { VerificationBadge } from '../shared/VerificationBadge';
import { PageHeader } from '../shared/PageHeader';
import { showToast } from '../shared/ToastNotification';
import {
  Clock,
  Flag,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Screen 1: Assessment Catalog List
export function AssessmentsListScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    async function load() {
      const res = await assessmentService.getAssessments();
      setAssessments(res.data);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 select-none">
      <PageHeader
        title="Timed Technical Assessments"
        description="Objective evaluations measuring production engineering competencies. Passing an assessment upgrades skill status from Self-Declared to ASSESSED."
        badge={
          <span className="font-mono text-xs border border-foreground bg-card px-2 py-0.5 rounded font-bold">
            Passing Benchmark: &ge;70%
          </span>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((asmt) => (
          <div
            key={asmt.id}
            className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-foreground/50 transition-all space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{asmt.skill.name}</span>
                <span className="uppercase font-semibold">{asmt.targetLevel}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">{asmt.title}</h3>
            </div>

            <div className="space-y-2 border-t border-border/60 pt-3 text-xs font-mono text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Questions:</span>
                <span className="font-bold text-foreground">{asmt.questionCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Limit:</span>
                <span className="font-bold text-foreground">{asmt.timeLimitMinutes} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Passing Threshold:</span>
                <span className="font-bold text-foreground">{asmt.passingScorePercentage}%</span>
              </div>
              {asmt.previousScore && (
                <div className="flex items-center justify-between border-t border-border/40 pt-2 font-bold text-foreground">
                  <span>Previous Score:</span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={12} /> {asmt.previousScore}% (PASSED)
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate(`/assessments/${asmt.id}`)}
              className="w-full rounded bg-foreground py-2.5 font-mono text-xs font-bold text-background hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>{asmt.previousScore ? 'Retake Assessment' : 'Start Assessment'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 2: Assessment Taking Screen with Timer, Navigation Grid, and Warning Styling
export function AssessmentTakingScreen({
  assessmentId,
  onNavigate,
}: {
  assessmentId: string;
  onNavigate: (path: string) => void;
}) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await assessmentService.getAssessmentById(assessmentId);
      setAssessment(res.data);
      // Restore cached local answers
      const cached = localStorage.getItem(`asmt_answers_${assessmentId}`);
      if (cached) {
        setAnswers(JSON.parse(cached));
      }
    }
    load();
  }, [assessmentId]);

  // Handle auto-submit at 0:
  const handleAutoSubmit = async () => {
    showToast('warning', 'Time has expired. Submitting your assessment automatically.');
    await executeSubmission();
  };

  const { formattedTime, isLowTime, timeTakenSeconds } = useTimer({
    durationSeconds: (assessment?.timeLimitMinutes || 20) * 60,
    storageKey: `timer_${assessmentId}`,
    onExpire: handleAutoSubmit,
  });

  // Protect against accidental refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const questions = assessment?.questions || [];
  const currentQuestion: Question | undefined = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    let next: number[];

    if (currentQuestion.type === 'MULTI_SELECT') {
      const current = answers[qId] || [];
      next = current.includes(optionIndex)
        ? current.filter((idx) => idx !== optionIndex)
        : [...current, optionIndex];
    } else {
      next = [optionIndex];
    }

    const updated = { ...answers, [qId]: next };
    setAnswers(updated);
    localStorage.setItem(`asmt_answers_${assessmentId}`, JSON.stringify(updated));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    setFlaggedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      localStorage.removeItem(`asmt_answers_${assessmentId}`);
      localStorage.removeItem(`timer_${assessmentId}`);
      await assessmentService.submitAssessment(assessmentId, answers, timeTakenSeconds);
      onNavigate(`/assessments/${assessmentId}/results`);
    } catch {
      showToast('error', 'Error submitting assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessment || !currentQuestion) {
    return (
      <div className="flex min-h-[300px] items-center justify-center font-mono text-xs">
        Loading assessment runtime...
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Sticky Header with Timer & Low-Time Warning (Inverted Styling, NO color) */}
      <div
        className={cn(
          'sticky top-16 z-20 flex items-center justify-between rounded-lg border p-4 transition-all duration-200 shadow-sm',
          isLowTime
            ? 'bg-foreground text-background border-foreground font-black'
            : 'bg-card text-foreground border-border'
        )}
      >
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
            {assessment.title}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="opacity-60 text-xs font-mono">({progressPercent}% complete)</span>
          </div>
        </div>

        {/* Timer display */}
        <div
          className={cn(
            'flex items-center gap-2 rounded px-3 py-1.5 font-mono text-sm tracking-widest',
            isLowTime
              ? 'border-2 border-background bg-background text-foreground font-extrabold animate-pulse'
              : 'border border-border bg-surface text-foreground font-bold'
          )}
        >
          <Clock size={16} />
          <span>{formattedTime}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Question Interface (8 Cols) */}
        <div className="md:col-span-8 rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Format: {currentQuestion.type}
            </span>
            <button
              onClick={toggleFlag}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors',
                flaggedIds.includes(currentQuestion.id)
                  ? 'bg-foreground text-background font-bold border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              <Flag size={12} />
              <span>{flaggedIds.includes(currentQuestion.id) ? 'Flagged' : 'Flag Question'}</span>
            </button>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground leading-relaxed sm:text-base">
              {currentQuestion.prompt}
            </h2>

            {currentQuestion.codeSnippet && (
              <pre className="rounded border border-border bg-surface p-3 font-mono text-xs overflow-x-auto">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQuestion.options.map((opt, optIndex) => {
              const selected = (answers[currentQuestion.id] || []).includes(optIndex);
              return (
                <div
                  key={optIndex}
                  onClick={() => handleSelectOption(optIndex)}
                  className={cn(
                    'flex items-center justify-between p-3.5 rounded-lg border text-xs cursor-pointer transition-all',
                    selected
                      ? 'border-2 border-foreground bg-surface font-semibold text-foreground'
                      : 'border-border bg-card hover:bg-secondary/40 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded font-mono text-[11px] border',
                        selected
                          ? 'bg-foreground text-background border-foreground font-bold'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {selected && <Check size={14} strokeWidth={2.5} />}
                </div>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 rounded border border-border px-3.5 py-1.5 text-xs font-mono hover:bg-secondary transition-colors disabled:opacity-40"
            >
              <ArrowLeft size={13} />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 rounded bg-foreground px-4 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
              >
                <span>Next</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="inline-flex items-center gap-1.5 rounded bg-foreground px-5 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
              >
                <Check size={14} />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator Grid (4 Cols) */}
        <div className="md:col-span-4 rounded-xl border border-border bg-card p-5 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-muted-foreground block">
            Question Navigator
          </span>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = (answers[q.id] || []).length > 0;
              const isFlagged = flaggedIds.includes(q.id);
              const isCurrent = currentIndex === i;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    'flex h-9 items-center justify-center rounded font-mono text-xs transition-all relative',
                    isCurrent
                      ? 'border-2 border-foreground font-black'
                      : 'border border-border',
                    isAnswered
                      ? 'bg-foreground text-background font-bold'
                      : isFlagged
                      ? 'bg-secondary font-bold text-foreground border-dashed border-foreground'
                      : 'bg-card text-muted-foreground'
                  )}
                  title={`Question ${i + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                >
                  <span>{i + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-foreground" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 border-t border-border/60 pt-3 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-foreground" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-dashed border-foreground bg-secondary" />
              <span>Flagged for Review ({flaggedIds.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-border bg-card" />
              <span>Unanswered ({questions.length - answeredCount})</span>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="w-full mt-2 rounded border border-foreground py-2 text-xs font-mono font-semibold hover:bg-foreground hover:text-background transition-colors"
          >
            Review & Finalize
          </button>
        </div>
      </div>

      {/* Confirm Submission Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border-2 border-foreground bg-card p-6 text-foreground space-y-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-foreground" />
              <h3 className="font-bold text-base">Submit Assessment for Evaluation?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have answered <span className="font-bold text-foreground font-mono">{answeredCount} of {questions.length}</span> questions. Once submitted, answers are final and will determine your verified skill standing.
            </p>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="rounded border border-border px-4 py-2 text-xs font-mono hover:bg-secondary"
              >
                Return to Test
              </button>
              <button
                onClick={executeSubmission}
                disabled={isSubmitting}
                className="rounded bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Screen 3: Assessment Results Screen
export function AssessmentResultsScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  const result: AssessmentResult = {
    id: 'asmt_res_dock_01',
    assessmentId: 'asmt_docker_01',
    assessmentTitle: 'Docker Containers & Production Architecture',
    skill: {
      id: 'sk_docker',
      name: 'Docker & Containerization',
      category: 'DevOps',
      description: 'Multi-stage builds, Docker Compose, container lifecycle',
    },
    score: 14,
    totalQuestions: 15,
    percentage: 93,
    passed: true,
    passingScorePercentage: 70,
    timeTakenSeconds: 780,
    completedAt: '2026-11-12T01:15:00Z',
    previousSkillLevel: 'Beginner',
    newVerifiedLevel: 'Intermediate',
    newVerificationStatus: 'ASSESSED',
    nextRecommendedStep: 'Build and submit the Distributed Task Queue project to reach PROJECT_VERIFIED status.',
    questionReviews: [
      {
        question: {
          id: 'q1',
          assessmentId: 'asmt_docker_01',
          prompt: 'In a multi-stage Docker build for a Python backend, which stage should contain compilers such as gcc and build-essential?',
          type: 'MCQ',
          options: [
            'The final runtime stage only to enable dynamic C extensions',
            'The builder stage only, copying compiled artifacts to the slim runner stage',
            'Both stages equally to preserve header symbol tables',
            'Compilers should never be installed in Docker containers',
          ],
          correctAnswers: [1],
          explanation: 'Compilers belong strictly in the builder stage to keep the final runner image minimal, light, and secure from binary exploitation.',
        },
        selectedAnswers: [1],
        isCorrect: true,
      },
      {
        question: {
          id: 'q2',
          assessmentId: 'asmt_docker_01',
          prompt: 'What happens when a container processes exit code 1 inside an environment with restart: on-failure and max-retries: 3?',
          type: 'MCQ',
          options: [
            'Docker terminates the daemon process immediately',
            'The container restarts up to 3 times before staying in a stopped state',
            'The container ignores the exit code and remains running in zombie mode',
            'Docker recreates the container with a new network IP',
          ],
          correctAnswers: [1],
          explanation: 'The on-failure policy restarts the container only when the process exits with a non-zero code, up to the configured limit.',
        },
        selectedAnswers: [1],
        isCorrect: true,
      },
      {
        question: {
          id: 'q3',
          assessmentId: 'asmt_docker_01',
          prompt: 'True or False: Running a production web container as the default root user is recommended because it simplifies port binding below 1024.',
          type: 'TRUE_FALSE',
          options: ['True', 'False'],
          correctAnswers: [1],
          explanation: 'False. Containers should always specify a non-root user (e.g. USER appuser) to enforce least privilege principles and mitigate container escape vectors.',
        },
        selectedAnswers: [1],
        isCorrect: true,
      },
    ],
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      {/* PASS / FAIL Hero Banner */}
      <div className="rounded-xl border-2 border-foreground bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-foreground px-2.5 py-1 text-xs font-mono font-extrabold text-background uppercase tracking-widest">
              {result.passed ? 'ASSESSMENT PASSED' : 'REVISION REQUIRED'}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Threshold: &ge;{result.passingScorePercentage}%
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {result.assessmentTitle}
          </h1>
          <p className="text-xs text-muted-foreground">
            Completed on {new Date(result.completedAt).toLocaleDateString()} · Time taken: {Math.floor(result.timeTakenSeconds / 60)} min {result.timeTakenSeconds % 60} sec
          </p>
        </div>

        {/* Score Stamp */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center sm:text-right">
            <span className="font-mono text-4xl font-extrabold text-foreground tabular-nums">
              {result.percentage}%
            </span>
            <span className="block text-[11px] font-mono text-muted-foreground">
              {result.score} of {result.totalQuestions} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Verified Skill Upgrade Confirmation */}
      <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
              Updated Verified Skill Standing
            </span>
            <h3 className="text-sm font-bold text-foreground">{result.skill.name}</h3>
          </div>
          <VerificationBadge status={result.newVerificationStatus} size="md" />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono border-t border-border/60 pt-3">
          <div>
            <span className="text-muted-foreground block text-[10px]">PREVIOUS LEVEL</span>
            <span className="line-through">{result.previousSkillLevel || 'Self-Declared'}</span>
          </div>
          <ArrowRight size={14} className="text-muted-foreground shrink-0" />
          <div>
            <span className="text-muted-foreground block text-[10px]">NEW VERIFIED LEVEL</span>
            <span className="font-bold text-foreground underline">{result.newVerifiedLevel}</span>
          </div>
        </div>

        <div className="rounded border border-dashed border-border bg-card p-3 text-xs font-mono text-muted-foreground">
          <span className="font-bold text-foreground">Next Recommended Step: </span>
          {result.nextRecommendedStep}
        </div>
      </div>

      {/* Per-Question Detailed Review */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase font-mono tracking-wider">
          Question-by-Question Technical Review
        </h3>

        <div className="divide-y divide-border/60 space-y-6">
          {result.questionReviews.map((rev, idx) => (
            <div key={idx} className="pt-4 first:pt-0 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-xs leading-relaxed text-foreground">
                  Q{idx + 1}. {rev.question.prompt}
                </span>
                <span
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold',
                    rev.isCorrect
                      ? 'bg-foreground text-background'
                      : 'border border-foreground text-foreground'
                  )}
                >
                  {rev.isCorrect ? <Check size={10} /> : <AlertTriangle size={10} />}
                  <span>{rev.isCorrect ? 'CORRECT' : 'INCORRECT'}</span>
                </span>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-2 border-l-2 border-border">
                {rev.question.options.map((opt, optIdx) => {
                  const isCorrectAnswer = rev.question.correctAnswers.includes(optIdx);
                  const isUserSelection = rev.selectedAnswers.includes(optIdx);

                  return (
                    <div
                      key={optIdx}
                      className={cn(
                        'p-2 rounded text-xs font-mono flex items-center justify-between',
                        isCorrectAnswer
                          ? 'bg-surface font-semibold text-foreground border border-border'
                          : isUserSelection
                          ? 'line-through text-muted-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <span>{opt}</span>
                      {isCorrectAnswer && <Check size={12} className="text-foreground" />}
                    </div>
                  );
                })}
              </div>

              {/* Rationale explanation */}
              <div className="rounded bg-surface p-3 text-[11px] font-mono text-muted-foreground">
                <span className="font-bold text-foreground">Architectural Explanation: </span>
                {rev.question.explanation}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex justify-between">
          <button
            onClick={() => onNavigate('/assessments')}
            className="rounded border border-border px-4 py-2 text-xs font-mono hover:bg-secondary"
          >
            ← Back to Assessments
          </button>
          <button
            onClick={() => onNavigate('/projects')}
            className="rounded bg-foreground px-5 py-2 text-xs font-mono font-bold text-background hover:bg-foreground/90"
          >
            Go to Projects Pipeline →
          </button>
        </div>
      </div>
    </div>
  );
}
