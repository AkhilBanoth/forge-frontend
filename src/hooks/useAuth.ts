import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    profile: store.profile,
    roles: store.roles,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    hydrated: store.hydrated,
    login: store.login,
    register: store.register,
    logout: store.logout,
    setProfile: store.setProfile,
    fetchMe: store.fetchMe,
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,
    can: store.can,
  };
}
