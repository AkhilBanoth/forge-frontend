import React, { useState, useEffect, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { FloatingMentorLauncher } from './FloatingMentorLauncher';
import { ToastContainer } from '../shared/ToastNotification';
import { CommandPalette } from './CommandPalette';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

import { useThemeStore } from '../../stores/themeStore';

export interface DashboardLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  pageTitle: string;
  children: ReactNode;
}

export function DashboardLayout({
  currentPath,
  onNavigate,
  pageTitle,
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isDark: isDarkMode, toggleTheme } = useThemeStore();

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMobileNavigate = (path: string) => {
    setIsMobileOpen(false);
    onNavigate(path);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Sidebar Sheet Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-[85vw] flex-col bg-card border-r border-border shadow-2xl">
            <div className="absolute top-4 right-3">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close mobile menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar
              currentPath={currentPath}
              onNavigate={handleMobileNavigate}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              className="w-full border-r-0 h-full"
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          pageTitle={pageTitle}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          readinessScore={72}
          onNavigate={onNavigate}
          currentPath={currentPath}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Cmd+K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Floating AI Mentor Launcher (on every dashboard page) */}
      <FloatingMentorLauncher />

      {/* Monochrome Global Toasts */}
      <ToastContainer />
    </div>
  );
}
