'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
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
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'GS';

  return (
    <>
      <header className="w-full mb-6">
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#6C63FF] flex items-center justify-center text-white font-bold text-xs">
              FH
            </div>
            <span className="font-bold text-sm text-[#111827]">FounderHQ</span>
          </div>

          {/* Top Right Profile & Notifications */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => toast.info('You have 2 pending notifications')}
              className="relative p-2.5 rounded-full bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#111827] shadow-sm transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6C63FF]" />
            </button>

            <div className="w-9 h-9 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[#6C63FF] font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm">
              {userInitials}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <div
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl bg-white border border-[#ECECEC] rounded-2xl shadow-2xl p-4 z-10 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-[#ECECEC]">
              <Search size={18} className="text-[#6C63FF]" />
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#6B7280] focus:outline-none"
              />
              <kbd className="text-[10px] text-[#6B7280] uppercase">ESC to close</kbd>
            </div>
            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase font-semibold text-[#6B7280] px-3">
                Quick Navigation
              </div>
              {[
                { name: 'Go to Financial Forecasts', action: () => router.push('/finance') },
                { name: 'View Active Candidates', action: () => router.push('/hiring') },
                { name: 'Check Legal & Documents', action: () => router.push('/documents') },
                { name: 'Open Investor CRM', action: () => router.push('/investors') },
                { name: 'Download Executive Audit Report', action: () => router.push('/reports') },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[#111827] hover:bg-[#FAFAFB] transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <Sparkles size={12} className="text-[#6C63FF]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
