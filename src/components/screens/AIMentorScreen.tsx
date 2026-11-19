import React, { useState, useEffect, useRef } from 'react';
import { useMentorStore } from '../../stores/mentorStore';
import { useAuthStore } from '../../stores/authStore';
import { PageHeader } from '../shared/PageHeader';
import {
  Send,
  Trash2,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function AIMentorScreen({ onNavigate }: { onNavigate: (path: string) => void }) {
  const userId = useAuthStore((s) => s.user?.id);
  const {
    messages,
    isTyping,
    error,
    sendMessage,
    fetchMessages,
    clearHistory,
    quickPrompts,
  } = useMentorStore();

  const [input, setInput] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [genSkill, setGenSkill] = useState('Docker');
  const [genLevel, setGenLevel] = useState('Intermediate');
  const [genTopic, setGenTopic] = useState('Multi-stage builds & Volumes');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleGeneratePractice = () => {
    if (isTyping) return;
    sendMessage(
      `Generate practice questions for ${genSkill} (${genLevel} level) focusing on ${genTopic}.`
    );
  };

  return (
    <div className="space-y-5 select-none max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="AI Learning Assistant"
        description="Get personalized study tips, targeted practice questions, and clear next steps based on your current progress."
        actions={
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Trash2 size={13} />
            <span>Clear Chat</span>
          </button>
        }
      />

      {/* Practice Question Generator Bar (PDF Section 22) */}
      <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-bold text-foreground flex items-center gap-1.5 mr-1">
            <Sparkles size={13} />
            <span>Practice Generator:</span>
          </span>
          <select
            value={genSkill}
            onChange={(e) => setGenSkill(e.target.value)}
            className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground"
          >
            <option value="Docker">Docker</option>
            <option value="FastAPI">FastAPI</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="Python">Python</option>
            <option value="AWS">AWS</option>
          </select>
          <select
            value={genLevel}
            onChange={(e) => setGenLevel(e.target.value)}
            className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            type="text"
            value={genTopic}
            onChange={(e) => setGenTopic(e.target.value)}
            placeholder="Weak topic..."
            className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground w-48"
          />
        </div>
        <button
          type="button"
          onClick={handleGeneratePractice}
          disabled={isTyping}
          className="rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 shrink-0"
        >
          Generate Practice Questions
        </button>
      </div>

      {/* Helpful Note Banner */}
      <div className="flex items-center gap-2 rounded border border-dashed border-border bg-surface p-2.5 text-xs text-muted-foreground font-mono">
        <Info size={14} className="shrink-0 text-foreground" />
        <span>
          Note: Suggestions are based on your SkillForge test scores and project progress to help guide your learning.
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-xs text-destructive"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchMessages}
            className="rounded border border-destructive/40 bg-card px-2.5 py-1 font-semibold text-foreground hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col max-w-[85%] rounded-lg p-4 leading-relaxed transition-all',
              msg.sender === 'user'
                ? 'ml-auto bg-foreground text-background font-medium'
                : 'mr-auto bg-surface border border-border text-foreground'
            )}
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-[10px] font-mono opacity-70 mb-1.5">
              <span>{msg.sender === 'user' ? 'YOU' : 'SKILLFORGE AI ASSISTANT'}</span>
              <span>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Standard Text */}
            {msg.type === 'text' && (
              <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            )}

            {/* Discriminated Renderer: learning_path */}
            {msg.type === 'learning_path' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold">{msg.content}</p>
                <div className="space-y-2">
                  {msg.steps.map((st) => (
                    <div
                      key={st.step}
                      className="rounded border border-border bg-card p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span>Step {st.step}: {st.title}</span>
                        <span className="text-[10px] text-muted-foreground">{st.estimatedHours}h est.</span>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {st.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono uppercase font-semibold">
                          Unlocks: {st.skillUnlocked}
                        </span>
                        {st.isUnlocked && (
                          <button
                            onClick={() => onNavigate('/roadmap')}
                            className="inline-flex items-center gap-1 text-[11px] font-mono underline hover:text-foreground"
                          >
                            <span>Open Course</span>
                            <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discriminated Renderer: practice_questions (Inline Feedback - No window.alert) */}
            {msg.type === 'practice_questions' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold">{msg.content}</p>
                <div className="space-y-3">
                  {msg.questions.map((q, idx) => {
                    const key = `${msg.id}_${q.id}`;
                    const pickedIdx = selectedAnswers[key];
                    const hasAnswered = pickedIdx !== undefined;
                    const isCorrect = pickedIdx === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="rounded border border-border bg-card p-3 text-xs space-y-2"
                      >
                        <p className="font-semibold text-foreground">
                          Q{idx + 1}. {q.prompt}
                        </p>
                        <div className="space-y-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = pickedIdx === optIdx;
                            const isOptionCorrect = optIdx === q.correctIndex;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [key]: optIdx }))
                                }
                                className={cn(
                                  'w-full text-left p-2 rounded border font-mono text-[11px] transition-colors flex items-center justify-between gap-2',
                                  hasAnswered && isOptionCorrect
                                    ? 'border-foreground bg-surface font-bold text-foreground'
                                    : isSelected
                                      ? 'border-foreground/60 bg-secondary text-foreground'
                                      : 'border-border hover:bg-secondary'
                                )}
                              >
                                <span>{opt}</span>
                                {hasAnswered && isOptionCorrect && (
                                  <CheckCircle2 size={13} className="shrink-0 text-foreground" />
                                )}
                                {hasAnswered && isSelected && !isOptionCorrect && (
                                  <XCircle size={13} className="shrink-0 text-muted-foreground" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {hasAnswered && (
                          <div className="rounded border border-border/70 bg-surface p-2.5 text-[11px] space-y-1">
                            <p className="font-mono font-bold text-foreground">
                              {isCorrect
                                ? 'Correct!'
                                : `Not quite — Correct answer: ${q.options[q.correctIndex]}`}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Discriminated Renderer: skill_analysis */}
            {msg.type === 'skill_analysis' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold">{msg.content}</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                      Verified Strengths:
                    </span>
                    {msg.strengths.map((s) => (
                      <div
                        key={s.skill}
                        className="flex items-center justify-between p-2 rounded border border-border bg-card text-xs font-mono"
                      >
                        <span>{s.skill}</span>
                        <span className="font-bold">{s.score}% (Target: {s.benchmarkScore}%)</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                      Skills to Improve:
                    </span>
                    {msg.weaknesses.map((w) => (
                      <div
                        key={w.skill}
                        className="flex items-center justify-between p-2 rounded border-2 border-foreground bg-card text-xs font-mono"
                      >
                        <span className="font-semibold">{w.skill}</span>
                        <span className="font-bold underline">{w.score}% (Target: {w.benchmarkScore}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-xs text-muted-foreground font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.4s]" />
            <span>Checking your latest scores and progress...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0 font-bold">
          Quick Questions:
        </span>
        {quickPrompts.map((qp) => (
          <button
            key={qp.id}
            onClick={() => sendMessage(qp.prompt)}
            disabled={isTyping}
            className="shrink-0 rounded border border-border px-3 py-1 text-xs font-mono hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a study plan, help with a weak skill, or practice questions..."
          className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-foreground"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="rounded-lg bg-foreground px-6 py-3 font-mono text-xs font-bold text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
