'use client';

import { Search, Bell, Calendar, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-primary flex items-center justify-center border-2 border-background cursor-pointer hover:shadow-[0_0_12px_rgba(100,100,250,0.5)] transition-shadow">
          <span className="text-white text-xs font-bold">SF</span>
        </div>
      </div>
    </header>
  );
}
