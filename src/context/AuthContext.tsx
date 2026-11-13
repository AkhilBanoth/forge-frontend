import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ROLE_HOME } from '../constants';
import type { User, LearnerProfile, Role, Permission } from '../types';

export interface AuthContextValue {
  user: User | null;
  role: Role | null;
  roles: Role[];
  token: string | null;
  profile: LearnerProfile | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  error: string | null;
  homePath: string;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password?: string; targetCareerId?: string }) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  setProfile: (profile: LearnerProfile) => void;
  clearError: () => void;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();
  const primaryRole: Role | null = store.roles[0] || null;
  const homePath = primaryRole ? ROLE_HOME[primaryRole] : '/';

  useEffect(() => {
    if (store.hydrated && store.isAuthenticated && store.token) {
      store.fetchMe();
    }
  }, [store.hydrated]);

  const value: AuthContextValue = {
    user: store.user,
    role: primaryRole,
    roles: store.roles,
    token: store.token,
    profile: store.profile,
    isAuthenticated: store.isAuthenticated,
    hydrated: store.hydrated,
    error: store.authError,
    homePath,
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshAuth: store.refreshAuth,
    setProfile: store.setProfile,
    clearError: store.clearError,
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,
    can: store.can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
