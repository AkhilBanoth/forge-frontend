import { useAuthStore } from '../stores/authStore';
import type { Role, Permission } from '../types';

export function useRole() {
  const roles = useAuthStore((state) => state.roles);
  const hasRole = useAuthStore((state) => state.hasRole);
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);

  return {
    roles,
    hasRole: (role: Role) => hasRole(role),
    hasAnyRole: (allowed: Role[]) => hasAnyRole(allowed),
  };
}

export function usePermission() {
  const can = useAuthStore((state) => state.can);

  return {
    can: (perm: Permission) => can(perm),
  };
}
