import React, { useEffect, useState } from 'react';
import { subscribeToApiNotifications } from '../../lib/api/client';
import { AlertCircle, AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastItem {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  text: string;
}

let toastDispatch: ((toast: Omit<ToastItem, 'id'>) => void) | null = null;

export function showToast(type: 'error' | 'warning' | 'info' | 'success', text: string) {
  if (toastDispatch) {
    toastDispatch({ type, text });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastDispatch = (item) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev, { ...item, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    const unsubscribe = subscribeToApiNotifications((msg) => {
      if (toastDispatch) {
        toastDispatch({ type: msg.type, text: msg.text });
      }
    });

    return () => {
      toastDispatch = null;
      unsubscribe();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-md border p-3.5 shadow-md bg-card text-foreground font-sans text-xs transition-all',
            toast.type === 'error'
              ? 'border-2 border-foreground'
              : toast.type === 'warning'
              ? 'border-foreground/80'
              : 'border-border'
          )}
          role="status"
        >
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
          {toast.type === 'success' && <Check className="h-4 w-4 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <span className="h-2 w-2 rounded-full bg-foreground shrink-0 mt-1" />}

          <div className="flex-1 leading-normal">{toast.text}</div>

          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-muted-foreground hover:text-foreground shrink-0 p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
