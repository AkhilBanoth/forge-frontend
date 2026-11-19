import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { SkillForgeLogo } from '../components/shared/SkillForgeLogo';
import { ToastContainer } from '../components/shared/ToastNotification';
import { useThemeStore } from '../stores/themeStore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface PublicLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

const PUBLIC_NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Careers', href: '/careers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Verify', href: '/verify' },
  { label: 'Contact', href: '/contact' },
  { label: 'PPT Deck', href: '/presentation' },
];

export function PublicLayout({ currentPath, onNavigate, children }: PublicLayoutProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const { isAuthenticated, homePath, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Shared Public Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="whitespace-nowrap shrink-0 focus-visible:outline-none"
            aria-label="SkillForge home"
          >
            <SkillForgeLogo size="md" />
          </button>

          <nav className="hidden md:flex items-center gap-6" aria-label="Public navigation">
            {PUBLIC_NAV_LINKS.map((item) => {
              const active =
                currentPath === item.href ||
                (item.href === '/verify' && currentPath.startsWith('/verify/'));
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    'text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2',
                    active
                      ? 'text-primary border-primary font-semibold'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => handleNav(homePath)}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNav('/login')}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap shrink-0"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/register')}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
                >
                  Get Started
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card px-4 py-4 md:hidden space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {PUBLIC_NAV_LINKS.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                    currentPath === item.href
                      ? 'bg-secondary text-primary font-semibold'
                      : 'text-foreground hover:bg-surface'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => handleNav(homePath)}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  Open {user?.name?.split(' ')[0] || 'My'} Dashboard
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleNav('/login')}
                    className="flex-1 rounded-lg border border-border py-2.5 text-xs font-semibold text-foreground"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('/register')}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-1">{children}</main>

      {/* Minimalist Public Footer */}
      <footer className="public-footer border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <SkillForgeLogo size="sm" />
              <p className="text-xs text-muted-foreground max-w-md">
                Honest career readiness measured through verified skills, assessments, and mentor reviews.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              <button
                type="button"
                onClick={() => handleNav('/terms')}
                className="hover:text-foreground transition-colors"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => handleNav('/privacy')}
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                className="hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <span className="text-border hidden sm:inline">|</span>
              <span>support@skillforge.io</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} SkillForge. All rights reserved.</span>
            <span>Readiness scores reflect SkillForge data and mentor reviews, not job guarantees.</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
