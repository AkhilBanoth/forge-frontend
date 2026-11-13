import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('skillforge_theme');
  if (saved) {
    const isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return isDark;
  }
  const hasDarkClass = document.documentElement.classList.contains('dark');
  return hasDarkClass;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const next = !state.isDark;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('skillforge_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('skillforge_theme', 'light');
      }
      return { isDark: next };
    });
  },
  setTheme: (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillforge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillforge_theme', 'light');
    }
    set({ isDark: dark });
  },
}));
