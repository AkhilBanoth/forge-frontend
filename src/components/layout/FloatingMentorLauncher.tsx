import React, { useState, useEffect, useRef } from 'react';
import { useMentorStore } from '../../stores/mentorStore';
import { Bot, X, Send, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FloatingMentorLauncher() {
  const {
    isOpen,
    toggleOpen,
    setOpen,
    messages,
    isTyping,
    sendMessage,
    fetchMessages,
    quickPrompts,
  } = useMentorStore();

  const [input, setInput] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="flex items-center gap-2.5 rounded-full bg-indigo-600 px-4 py-3 text-white font-mono text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all border border-indigo-500"
          aria-label="Open AI Career Mentor"
        >
          <Bot className="h-4 w-4" />
          <span>AI Mentor</span>
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col w-[380px] max-w-[calc(100vw-32px)] h-[520px] rounded-xl border-2 border-foreground bg-card text-foreground shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold leading-tight">AI Career Mentor</span>
                <span className="text-[10px] text-muted-foreground font-mono leading-tight">
                  Personal Study Guide
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close mentor chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-card p-2 scrollbar-none">
            {quickPrompts.map((qp) => (
              <button
                key={qp.id}
                onClick={() => sendMessage(qp.prompt)}
                disabled={isTyping}
                className="shrink-0 rounded border border-border px-2 py-1 text-[10px] font-mono hover:bg-secondary transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                <Bot className="h-8 w-8 mb-2 opacity-40" />
                <p className="font-medium text-foreground">How can I help with your progress?</p>
                <p className="mt-1 text-[11px] leading-relaxed">
                  Ask for study plans, practice questions, or help with your skill gaps.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col max-w-[88%] rounded-lg p-3 leading-relaxed',
                  msg.sender === 'user'
                    ? 'ml-auto bg-foreground text-background font-medium'
                    : 'mr-auto bg-surface border border-border text-foreground'
                )}
              >
                {msg.type === 'text' && <p className="whitespace-pre-wrap">{msg.content}</p>}

                {msg.type === 'learning_path' && (
                  <div className="space-y-2">
                    <p className="font-medium">{msg.content}</p>
                    <div className="space-y-1.5 pt-1">
                      {msg.steps.map((st) => (
                        <div key={st.step} className="rounded border border-border bg-card p-2 text-[11px]">
                          <div className="flex items-center justify-between font-mono font-bold">
                            <span>Step {st.step}: {st.title}</span>
                            <span className="text-[10px] opacity-70">{st.estimatedHours}h</span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === 'practice_questions' && (
                  <div className="space-y-2">
                    <p className="font-medium">{msg.content}</p>
                    <div className="space-y-2 pt-1">
                      {msg.questions.map((q, idx) => {
                        const key = `${msg.id}_${q.id}`;
                        const picked = selectedAnswers[key];
                        const answered = picked !== undefined;
                        return (
                          <div key={q.id} className="rounded border border-border bg-card p-2.5 text-[11px] space-y-1.5">
                            <p className="font-semibold">Q{idx + 1}. {q.prompt}</p>
                            <div className="space-y-1">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = optIdx === q.correctIndex;
                                const isPicked = picked === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setSelectedAnswers((prev) => ({ ...prev, [key]: optIdx }))}
                                    className={cn(
                                      'w-full text-left p-1.5 rounded border font-mono text-[10px] transition-colors flex items-center justify-between gap-1',
                                      answered && isCorrect
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 font-bold text-foreground'
                                        : isPicked
                                          ? 'border-foreground bg-secondary'
                                          : 'border-border hover:bg-secondary'
                                    )}
                                  >
                                    <span>{opt}</span>
                                    {answered && isCorrect && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                                    {answered && isPicked && !isCorrect && <XCircle className="h-3 w-3 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                            {answered && (
                              <p className="text-[10px] text-muted-foreground border-t border-border pt-1">
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {msg.type === 'skill_analysis' && (
                  <div className="space-y-2">
                    <p className="font-medium">{msg.content}</p>
                    <div className="space-y-1 pt-1">
                      {msg.weaknesses.map((w) => (
                        <div key={w.skill} className="flex items-center justify-between font-mono text-[11px]">
                          <span>{w.skill}</span>
                          <span className="font-bold">{w.score}% (Req: {w.benchmarkScore}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={cn(
                    'mt-1 text-[9px] font-mono',
                    msg.sender === 'user' ? 'text-background/60 text-right' : 'text-muted-foreground'
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="mr-auto flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground font-mono">
                <span>AI Mentor is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-border bg-surface p-2.5 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about roadmaps or gaps..."
              className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-md bg-foreground p-2 text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
