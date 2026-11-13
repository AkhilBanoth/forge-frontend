import React from 'react';
import { AdminLearnerScreen } from '../../components/admin/AdminLearnerScreen';

export function AdminLearnersPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = (path: string) => {
    if (path === '/admin') onNavigate('/admin/dashboard');
    else if (path === '/mentor') onNavigate('/mentor/dashboard');
    else onNavigate(path);
  };
  return <AdminLearnerScreen onNavigate={nav} />;
}
