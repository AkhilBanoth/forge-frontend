import React, { ReactNode } from 'react';
import type { Role, Permission } from '../../types';
import { useAuthStore } from '../../stores/authStore';

export interface RoleGateProps {
  allow: Role[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGate({ allow, fallback = null, children }: RoleGateProps) {
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);
  const isAllowed = hasAnyRole(allow);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export interface PermissionGateProps {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const can = useAuthStore((state) => state.can);
  const isAllowed = can(permission);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
