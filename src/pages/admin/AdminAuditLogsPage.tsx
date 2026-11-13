import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingState, EmptyState } from '../../components/shared/States';
import { adminService } from '../../lib/api/services';
import type { AuditLogEntry } from '../../types';
import { Search, FileText } from 'lucide-react';

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'MENTOR' | 'LEARNER'>('ALL');

  useEffect(() => {
    adminService
      .getAuditLogs()
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.targetId.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || log.actorRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <LoadingState message="Loading audit logs..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Audit Logs"
        description="Chronological record of role changes, mentor assignments, project reviews, career weight edits, and certificate actions."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by actor, action, target ID, or details..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground"
        >
          <option value="ALL">All Actor Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MENTOR">Mentor</option>
          <option value="LEARNER">Learner</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching audit events"
          description="Try clearing your search or actor role filter."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor &amp; Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-secondary/20">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{entry.actorName}</div>
                      <div className="font-mono text-[10px] text-primary">{entry.actorRole}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {entry.targetType}: {entry.targetId}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-md">
                      {entry.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
