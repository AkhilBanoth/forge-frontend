import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { showToast } from '../../components/shared/ToastNotification';
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function ContactPage({ currentPath, onNavigate }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Learner Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('warning', 'Please fill out your name, email, and message.');
      return;
    }
    setSubmitted(true);
    showToast('success', 'Thank you! Your message has been received by our team.');
  };

  return (
    <PublicLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Contact Us
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Questions about SkillForge or certificate checks?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Reach our learner support, mentor onboarding, or verification team directly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>Direct Email</span>
              </div>
              <p className="text-xs text-muted-foreground">General inquiries: support@skillforge.io</p>
              <p className="text-xs text-muted-foreground">Certificate checks: verify@skillforge.io</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Mentor & Admin Accounts</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Learner accounts can be registered publicly. Mentor and Admin accounts are provisioned by an organization Administrator.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 rounded-xl border border-border bg-card p-6">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h2 className="text-lg font-bold text-foreground">Message Sent</h2>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thanks for contacting SkillForge, {name}. We will reply to {email} within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Learner Support">Learner Support</option>
                    <option value="Certificate Verification">Certificate Verification</option>
                    <option value="Team & Bootcamp Plans">Team & Bootcamp Plans</option>
                    <option value="Become a Mentor">Become a Mentor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
