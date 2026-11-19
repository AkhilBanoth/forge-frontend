import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LearnerProfile, Role, Permission } from '../types';
import { ROLE_PERMISSIONS } from '../constants';
import { authService } from '../lib/api/services';
import { registerUnauthorizedHandler } from '../lib/api/client';
import { useMentorStore } from './mentorStore';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  profile: LearnerProfile | null;
  roles: Role[];
  isAuthenticated: boolean;
  hydrated: boolean;
  authError: string | null;

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password?: string; targetCareerId?: string }) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  setProfile: (profile: LearnerProfile) => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;

  // RBAC Helpers (Read-only checks derived from backend user state)
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  can: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      profile: null,
      roles: [],
      isAuthenticated: false,
      hydrated: false,
      authError: null,

      clearError: () => set({ authError: null }),

      login: async (email: string, password?: string) => {
        set({ authError: null });
        try {
          const res = await authService.login({ email, password });
          const { token, refreshToken, user, profile } = res.data;
          const userRoles: Role[] = user.roles?.length ? user.roles : ['LEARNER'];

          document.cookie = `skillforge_role=${userRoles.join(',')}; path=/; max-age=604800; SameSite=Lax;`;

          set({
            token,
            refreshToken: refreshToken || null,
            user,
            profile: profile || null,
            roles: userRoles,
            isAuthenticated: true,
            authError: null,
          });
          useMentorStore.getState().resetLocalState();
          return true;
        } catch (err: any) {
          const message = err?.message || 'Invalid email or password.';
          set({ authError: message });
          return false;
        }
      },

      register: async (payload) => {
        set({ authError: null });
        try {
          const res = await authService.register(payload);
          const { token, refreshToken, user, profile } = res.data;
          const userRoles: Role[] = ['LEARNER'];

          document.cookie = `skillforge_role=LEARNER; path=/; max-age=604800; SameSite=Lax;`;

          set({
            token,
            refreshToken: refreshToken || null,
            user: { ...user, roles: userRoles },
            profile: profile || null,
            roles: userRoles,
            isAuthenticated: true,
            authError: null,
          });
          useMentorStore.getState().resetLocalState();
          return true;
        } catch (err: any) {
          const message = err?.message || 'Unable to create account.';
          set({ authError: message });
          return false;
        }
      },

      refreshAuth: async () => {
        const currentRefresh = get().refreshToken;
        if (!currentRefresh) {
          get().logout();
          return false;
        }
        try {
          const res = await authService.refresh(currentRefresh);
          set({
            token: res.data.token,
            refreshToken: res.data.refreshToken || currentRefresh,
          });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      logout: () => {
        document.cookie = 'skillforge_role=; path=/; max-age=0;';
        useMentorStore.getState().resetLocalState();
        set({
          token: null,
          refreshToken: null,
          user: null,
          profile: null,
          roles: [],
          isAuthenticated: false,
          authError: null,
        });
      },

      setProfile: (profile: LearnerProfile) => {
        set({ profile });
      },

      fetchMe: async () => {
        const { token, isAuthenticated } = get();
        if (!isAuthenticated || !token) return;
        try {
          const res = await authService.getMe(token);
          const userRoles: Role[] = res.data.user.roles?.length
            ? res.data.user.roles
            : ['LEARNER'];
          set({
            user: res.data.user,
            profile: res.data.profile,
            roles: userRoles,
            isAuthenticated: true,
          });
        } catch {
          // Keep current state unless interceptor handles 401
        }
      },

      hasRole: (role: Role) => {
        const { roles, isAuthenticated } = get();
        return isAuthenticated && roles.includes(role);
      },

      hasAnyRole: (allowedRoles: Role[]) => {
        const { roles, isAuthenticated } = get();
        return isAuthenticated && allowedRoles.some((r) => roles.includes(r));
      },

      can: (permission: Permission) => {
        const { roles, isAuthenticated } = get();
        if (!isAuthenticated) return false;
        return roles.some((role) => {
          const perms = ROLE_PERMISSIONS[role] || [];
          return perms.includes(permission);
        });
      },
    }),
    {
      name: 'skillforge_auth',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          if (state.isAuthenticated && state.roles && state.roles.length > 0) {
            document.cookie = `skillforge_role=${state.roles.join(',')}; path=/; max-age=604800; SameSite=Lax;`;
          }
          registerUnauthorizedHandler(() => state.logout());
        }
      },
    }
  )
);
