import React, { useEffect, useState } from 'react';
import { AdminMentorScreen } from '../../components/admin/AdminMentorScreen';
import { showToast } from '../../components/shared/ToastNotification';
import { adminService } from '../../lib/api/services';
import type { ManagedUserRecord, MentorDirectoryRecord } from '../../types';
import { UserCheck } from 'lucide-react';

export function AdminMentorsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [mentors, setMentors] = useState<MentorDirectoryRecord[]>([]);
  const [learners, setLearners] = useState<ManagedUserRecord[]>([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const loadDirectory = async () => {
    const [mRes, uRes] = await Promise.all([
      adminService.getMentors(),
      adminService.getUsers(),
    ]);
    setMentors(mRes.data);
    const learnerList = uRes.data.filter((u) => u.roles.includes('LEARNER'));
    setLearners(learnerList);
    if (!selectedLearnerId && learnerList.length > 0) setSelectedLearnerId(learnerList[0].id);
    if (!selectedMentorId && mRes.data.length > 0) setSelectedMentorId(mRes.data[0].id);
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearnerId || !selectedMentorId) return;
    setIsAssigning(true);
    try {
      await adminService.assignLearnerToMentor(selectedLearnerId, selectedMentorId);
      await loadDirectory();
      showToast('success', 'Learner successfully assigned to mentor.');
    } catch {
      showToast('error', 'Failed to assign learner.');
    } finally {
      setIsAssigning(false);
    }
  };

  const nav = (path: string) => {
    if (path === '/admin') onNavigate('/admin/dashboard');
    else if (path === '/mentor') onNavigate('/mentor/dashboard');
    else onNavigate(path);
  };

  return (
    <div className="space-y-8">
      {/* Live Learner-to-Mentor Assignment Bar */}
      <form
        onSubmit={handleAssign}
        className="rounded-xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <UserCheck className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-base font-bold text-foreground">Assign Learner to Mentor</h2>
            <p className="text-xs text-muted-foreground">
              Connect each learner to a mentor who will monitor their progress and review projects.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Learner</label>
            <select
              value={selectedLearnerId}
              onChange={(e) => setSelectedLearnerId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
            >
              {learners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.assignedMentorName ? `Current: ${l.assignedMentorName}` : 'Unassigned'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Assigned Mentor</label>
            <select
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
            >
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.assignedLearnerIds.length}/{m.maxCapacity} learners)
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isAssigning}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isAssigning ? 'Assigning...' : 'Assign Learner'}
          </button>
        </div>
      </form>

      <AdminMentorScreen onNavigate={nav} />
    </div>
  );
}
