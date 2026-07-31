'use client';

import { Search, Bell, Calendar, Moon, Sun, Settings, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      if (logout) {
        await logout();
      }
      console.log('User logged out');
    } finally {
      // Small timeout for user state to clear 
      setTimeout(() => {
        router.push('/login');
      }, 100);
    }
  };

  return (
    <header className="h-16 w-full sticky top-0 z-40 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl flex items-center justify-between px-6 md:pl-70 transition-all">
      <div className="flex items-center md:hidden">
        <span className="font-bold text-lg">FounderHQ</span>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background/50 focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm placeholder:text-muted-foreground"
            placeholder="Search FounderHQ (Press '/' to focus)"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <button
          className="p-2 rounded-full text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground transition-colors relative group"
          aria-label="Calendar"
        >
          <Calendar size={18} />
        </button>

        <button
          className="p-2 rounded-full text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground transition-colors relative group"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_var(--destructive)]"></span>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {!mounted ? null : theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-primary flex items-center justify-center border-2 border-background cursor-pointer hover:shadow-[0_0_12px_rgba(100,100,250,0.5)] transition-all"
          >
            <span className="text-white text-xs font-bold uppercase">
              {user?.displayName ? user.displayName.substring(0, 2) : 'SF'}
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.displayName || 'Sarah Founder'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'CEO, Acme Inc'}
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push('/settings');
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
              >
                <Settings size={16} className="text-muted-foreground" />
                <span>Settings</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} className="text-destructive/80" />
                )}
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
