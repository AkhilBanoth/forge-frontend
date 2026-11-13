/**
 * Maps legacy single-level routes (used inside reused existing screens)
 * to the clean /app/* Learner namespace without touching unrelated code.
 */
export function toAppRoute(path: string): string {
  if (!path) return '/app/dashboard';
  if (path.startsWith('/app/') || path.startsWith('/verify')) return path;
  if (path === '/dashboard') return '/app/dashboard';
  if (path === '/roadmap') return '/app/roadmap';
  if (path.startsWith('/roadmap/')) return `/app${path}`;
  if (path === '/assessments') return '/app/quizzes';
  if (path.startsWith('/assessments/')) {
    return `/app/quizzes${path.slice('/assessments'.length)}`;
  }
  if (path === '/projects') return '/app/projects';
  if (path === '/skill-gap') return '/app/career';
  if (path === '/certificates') return '/app/certificates';
  if (path === '/ai-mentor') return '/app/ai-mentor';
  if (path === '/analytics') return '/app/analytics';
  if (path === '/settings') return '/app/profile';
  if (path === '/onboarding') return '/app/onboarding';
  return path;
}

export function createLearnerNavigator(onNavigate: (path: string) => void) {
  return (path: string) => onNavigate(toAppRoute(path));
}
