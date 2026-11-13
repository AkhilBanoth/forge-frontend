import React, { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  currentPath: string;
  onNavigate: (path: string) => void;
  renderForbidden: () => ReactNode;
  children: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  currentPath,
  onNavigate,
  renderForbidden,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, hydrated, hasAnyRole } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const loginBase = currentPath.startsWith('/admin')
        ? '/admin/login'
        : currentPath.startsWith('/mentor')
          ? '/mentor/login'
          : '/login';
      const target = `${loginBase}?redirect=${encodeURIComponent(currentPath)}`;
      onNavigate(target);
    }
  }, [hydrated, isAuthenticated, currentPath, onNavigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <>{renderForbidden()}</>;
  }

  return <>{children}</>;
}
