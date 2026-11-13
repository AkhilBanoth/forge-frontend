import React, { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface PublicOnlyRouteProps {
  onNavigate: (path: string) => void;
  children: ReactNode;
}

export function PublicOnlyRoute({ onNavigate, children }: PublicOnlyRouteProps) {
  const { isAuthenticated, homePath } = useAuth();

  useEffect(() => {
    if (isAuthenticated && homePath && homePath !== '/') {
      onNavigate(homePath);
    }
  }, [isAuthenticated, homePath, onNavigate]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
