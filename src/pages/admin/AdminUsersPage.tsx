import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { showToast } from '../../components/shared/ToastNotification';
import { adminService } from '../../lib/api/services';
import type { ManagedUserRecord } from '../../types';
import { Search, UserPlus, X, ShieldCheck, Ban, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'LEARNER' | 'MENTOR' | 'ADMIN'>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'LEARNER' | 'MENTOR' | 'ADMIN'>('MENTOR');
  const [newCareer, setNewCareer] = useState('Python Backend Developer');

  useEffect(() => {
    adminService
      .getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    try {
      const res = await adminService.createUser({
        name: newName.trim(),
        email: newEmail.trim(),
        roles: [newRole],
        targetCareer: newCareer,
      });
      setUsers((prev) => [res.data, ...prev]);
      setNewName('');
      setNewEmail('');
      setIsCreateOpen(false);
      showToast('success', `Created ${newRole} account for ${res.data.name}.`);
    } catch {
      showToast('error', 'Could not create user account.');
    }
  };

  const handleRoleChange = async (userId: string, nextRole: 'LEARNER' | 'MENTOR' | 'ADMIN') => {
    try {
      const res = await adminService.updateUser(userId, { roles: [nextRole] });
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
      showToast('success', `Updated role for ${res.data.name} to ${nextRole}.`);
    } catch {
      showToast('error', 'Failed to update user role.');
    }
  };

  const handleToggleActive = async (userRec: ManagedUserRecord) => {
    try {
      const res = await adminService.updateUser(userRec.id, { isActive: !userRec.isActive });
      setUsers((prev) => prev.map((u) => (u.id === userRec.id ? res.data : u)));
      showToast(
        'success',
        `${res.data.name} is now ${res.data.isActive ? 'active' : 'disabled'}.`
      );
    } catch {
      showToast('error', 'Failed to update account status.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading users directory..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Role Management"
        description="Create Learner, Mentor, or Admin accounts, change user roles, and enable or disable account access."
        actions={
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Account</span>
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="LEARNER">Learners</option>
          <option value="MENTOR">Mentors</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching users"
          description="Try changing your search query or role filter."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Target / Assignment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.roles[0] || 'LEARNER'}
                        onChange={(e) =>
                          handleRoleChange(
                            u.id,
                            e.target.value as 'LEARNER' | 'MENTOR' | 'ADMIN'
                          )
                        }
                        className="rounded border border-border bg-background px-2.5 py-1 text-xs font-mono font-semibold text-foreground"
                      >
                        <option value="LEARNER">LEARNER</option>
                        <option value="MENTOR">MENTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      <div>{u.targetCareer}</div>
                      {u.assignedMentorName && (
                        <div className="text-[11px] text-primary">
                          Mentor: {u.assignedMentorName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold',
                          u.isActive
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-destructive/15 text-destructive'
                        )}
                      >
                        {u.isActive ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Ban className="h-3 w-3" />
                        )}
                        {u.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                          u.isActive
                            ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                            : 'border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                        )}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Create User Account</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Priya Nair"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="priya@skillforge.io"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as typeof newRole)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="LEARNER">LEARNER</option>
                  <option value="MENTOR">MENTOR (Admin-created only)</option>
                  <option value="ADMIN">ADMIN (Admin-created only)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Primary Career / Specialty</label>
                <input
                  type="text"
                  value={newCareer}
                  onChange={(e) => setNewCareer(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
