'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Command, Mic, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function TopNavbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'GS';

  return (
    <>
      <header className="w-full mb-8">
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#7C5CFF] flex items-center justify-center text-white font-bold text-xs">
              FH
            </div>
            <span className="font-bold text-sm text-white">FounderHQ</span>
          </div>

          {/* Top Center Search / Command Input */}
          <div className="hidden sm:flex items-center flex-1 max-w-2xl mx-auto">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl text-xs text-slate-400 hover:text-slate-200 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Sparkles size={14} className="text-[#7C5CFF] shrink-0" />
                <span className="truncate">Ask FounderHQ anything... (e.g. analyze runway, build MVP roadmap, review contracts)</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Mic size={14} className="text-slate-400 hover:text-white" />
                <kbd className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 text-[10px] text-slate-300 font-mono border border-white/10">
                  <Command size={10} /> K
                </kbd>
              </div>
            </button>
          </div>

          {/* Top Right Profile & Bell */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => toast.info('You have 2 pending notifications')}
              className="relative p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C5CFF]" />
            </button>

            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm">
              {userInitials}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <div onClick={() => setCommandPaletteOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-xl bg-[#0E1014] border border-white/10 rounded-2xl shadow-2xl p-4 z-10 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
              <Search size={18} className="text-[#7C5CFF]" />
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <kbd className="text-[10px] text-slate-500 uppercase">ESC to close</kbd>
            </div>
            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase font-semibold text-slate-500 px-3">Quick Actions</div>
              {[
                { name: 'Go to Financial Forecasts', action: () => router.push('/finance') },
                { name: 'View Active Candidates', action: () => router.push('/hiring') },
                { name: 'Check Legal Compliance', action: () => router.push('/legal') },
                { name: 'Open Investor CRM', action: () => router.push('/investors') },
                { name: 'Download Executive Audit Report', action: () => router.push('/reports') },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <Sparkles size={12} className="text-[#7C5CFF]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
