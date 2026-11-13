import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { showToast } from './ToastNotification';

export interface TechieInventoryWorkspaceProps {
  mode?: 'learner' | 'admin';
  onNavigate?: (path: string) => void;
  className?: string;
}

interface InventorySlot {
  id: string;
  name: string;
  tag: string;
  status: 'ONLINE' | 'ACTIVE' | 'STANDBY' | 'SYNCED';
  metric: string;
  metricLabel: string;
  desc: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'INFRASTRUCTURE' | 'SECURITY';
  color: string;
}

export function TechieInventoryWorkspace({
  className,
}: TechieInventoryWorkspaceProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-rack');
  const [diagnosticLogs] = useState<string[]>([
    '[READY] Workspace services synced and ready.',
    '[OK] FastAPI web server running on port 8000.',
    '[OK] PostgreSQL database connected (24 idle slots).',
    '[OK] Docker build runner v24.0.7 is online.',
  ]);

  const inventorySlots: InventorySlot[] = [
    {
      id: 'slot-rack',
      name: 'Server Cluster · 4 Nodes',
      tag: 'SERVERS',
      status: 'ONLINE',
      metric: '99.98% Uptime',
      metricLabel: 'SYSTEM UPTIME',
      desc: 'Fast backend servers running 4 container nodes for Python web services.',
      category: 'HARDWARE',
      color: 'indigo',
    },
    {
      id: 'slot-code',
      name: 'Source Code · Git Branch',
      tag: 'CODEBASE',
      status: 'SYNCED',
      metric: '14 Endpoints',
      metricLabel: 'FASTAPI ROUTES',
      desc: 'Clean REST API codebase with input validation and async database queries.',
      category: 'SOFTWARE',
      color: 'slate',
    },
    {
      id: 'slot-db',
      name: 'PostgreSQL Database',
      tag: 'DATABASE',
      status: 'ONLINE',
      metric: '4.2 ms avg',
      metricLabel: 'QUERY SPEED',
      desc: 'Fast PostgreSQL database with safe transactions, indexes, and automatic backups.',
      category: 'INFRASTRUCTURE',
      color: 'indigo',
    },
    {
      id: 'slot-docker',
      name: 'Docker Build Container',
      tag: 'CONTAINERS',
      status: 'ACTIVE',
      metric: '42.8 MB',
      metricLabel: 'IMAGE SIZE',
      desc: 'Lightweight multi-stage Docker container built for fast and safe deployment.',
      category: 'SOFTWARE',
      color: 'slate',
    },
    {
      id: 'slot-sec',
      name: 'Login & Certificate Security',
      tag: 'SECURITY',
      status: 'ONLINE',
      metric: '256-bit Key',
      metricLabel: 'TOKEN SECURITY',
      desc: 'Protects user logins and ensures issued certificates can always be verified.',
      category: 'SECURITY',
      color: 'indigo',
    },
    {
      id: 'slot-test',
      name: 'PyTest Test Suite',
      tag: 'TESTING',
      status: 'SYNCED',
      metric: '88% Coverage',
      metricLabel: 'TEST COVERAGE',
      desc: 'Automated unit and API tests that check every route before code is approved.',
      category: 'SOFTWARE',
      color: 'slate',
    },
  ];

  const activeSlot = inventorySlots.find((s) => s.id === selectedSlotId) || inventorySlots[0];

  const handleBenchmark = () => {
    showToast('info', 'Speed test finished: fast response time of 3.8ms.');
  };

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-foreground/80 bg-card overflow-hidden shadow-xl text-foreground transition-all duration-200',
        className
      )}
    >
      {/* Selected Component Detailed Telemetry & Controls */}
      <div className="border-b border-border">
        <div className="p-5 flex flex-col justify-between bg-surface/30 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  SELECTED COMPONENT
                </span>
                <h4 className="text-base font-extrabold text-foreground">{activeSlot.name}</h4>
              </div>
              <span className="rounded bg-foreground text-background px-2 py-0.5 font-mono text-[10px] font-bold">
                {activeSlot.status}
              </span>
            </div>

            {/* Main Metric Spotlight Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                {activeSlot.metricLabel}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono tracking-tight text-foreground">
                  {activeSlot.metric}
                </span>
                <span className="text-xs font-mono text-muted-foreground">Healthy</span>
              </div>
              <p className="text-xs text-muted-foreground font-sans pt-2 border-t border-border/60">
                {activeSlot.desc}
              </p>
            </div>

            {/* Action Buttons for Selected Node */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={handleBenchmark}
                className="rounded-lg border border-border bg-card py-2 px-3 font-bold hover:bg-secondary transition-colors text-center"
              >
                Test Speed
              </button>
              <button
                onClick={() => {
                  showToast('success', `${activeSlot.name} is working properly.`);
                }}
                className="rounded-lg bg-foreground py-2 px-3 font-bold text-background hover:bg-foreground/90 transition-colors text-center"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Terminal Activity Stream */}
          <div className="rounded-xl border border-border bg-slate-950 p-3 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[10px] text-slate-500 uppercase">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3 text-slate-400" />
                Recent System Activity
              </span>
              <span>DEV-CLUSTER</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-none text-[11px] font-mono leading-tight">
              {diagnosticLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="text-slate-300 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Inventory Rack Slots (Interactive 6-Card Grid) */}
      <div className="p-5 space-y-3 bg-surface/50">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            EXPLORE COMPONENTS (CLICK TO VIEW)
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Click any component to inspect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {inventorySlots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={cn(
                  'rounded-xl border p-3 text-left transition-all font-mono space-y-2 group cursor-pointer select-none',
                  isSelected
                    ? 'border-foreground bg-foreground text-background shadow-md scale-[1.02]'
                    : 'border-border bg-card text-foreground hover:border-foreground/40 hover:bg-secondary/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[9px] uppercase font-bold tracking-wider',
                      isSelected ? 'text-background/80' : 'text-muted-foreground'
                    )}
                  >
                    {slot.tag}
                  </span>
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      isSelected ? 'bg-background' : 'bg-foreground'
                    )}
                  />
                </div>

                <div className="font-bold text-xs font-sans line-clamp-2 leading-tight">
                  {slot.name}
                </div>

                <div className="pt-1 border-t border-border/40">
                  <span
                    className={cn(
                      'text-[10px] block font-extrabold',
                      isSelected ? 'text-background' : 'text-foreground'
                    )}
                  >
                    {slot.metric}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
