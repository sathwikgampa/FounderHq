'use client';

import Link from 'next/link';

const NAV_LINKS = ['Platform', 'Integration', 'Resources', 'Pricing'] as const;

export function BlockNestNavbar() {
  return (
    <header className="relative w-full py-6" style={{ zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/blocknest" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#9333ea,#4f46e5)' }}
          >
            <span
              className="iconify text-white"
              data-icon="solar:layers-minimalistic-bold-duotone"
              data-width="18"
            />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">BlockNest</span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden sm:block text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            Sign in
          </a>
          <a
            href="#"
            className="px-5 py-2.5 rounded-full text-sm font-medium text-purple-300 border transition-all duration-300 hover:text-white"
            style={{
              background: 'rgba(147,51,234,0.15)',
              borderColor: 'rgba(168,85,247,0.4)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(147,51,234,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(147,51,234,0.15)')}
          >
            Start Building
          </a>
        </div>
      </div>
    </header>
  );
}
