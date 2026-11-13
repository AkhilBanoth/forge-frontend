export function normalizePath(path: string): string {
  const [pathname] = path.split('?');
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

export function matchRoute(
  pattern: string,
  actualPath: string
): Record<string, string> | null {
  const normPattern = normalizePath(pattern);
  const normActual = normalizePath(actualPath);

  const patternParts = normPattern.split('/').filter(Boolean);
  const actualParts = normActual.split('/').filter(Boolean);

  if (patternParts.length !== actualParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    const ap = actualParts[i];
    if (pp.startsWith(':')) {
      params[pp.slice(1)] = decodeURIComponent(ap);
    } else if (pp !== ap) {
      return null;
    }
  }
  return params;
}

export function getQueryParam(key: string): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  } catch {
    return null;
  }
}

export function isPathAllowedForRoles(path: string, roles: string[]): boolean {
  const norm = normalizePath(path);
  if (norm === '/app' || norm.startsWith('/app/')) {
    return roles.includes('LEARNER');
  }
  if (norm === '/mentor' || norm.startsWith('/mentor/')) {
    return roles.includes('MENTOR') || roles.includes('ADMIN');
  }
  if (norm === '/admin' || norm.startsWith('/admin/')) {
    return roles.includes('ADMIN');
  }
  return false;
}

