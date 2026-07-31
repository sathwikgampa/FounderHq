'use client';

import { useEffect } from 'react';
import { BlockNestBackground } from '@/components/marketing/blocknest/BlockNestBackground';
import { BlockNestNavbar } from '@/components/marketing/blocknest/BlockNestNavbar';
import { BlockNestHero } from '@/components/marketing/blocknest/BlockNestHero';
import { BlockNestPartners } from '@/components/marketing/blocknest/BlockNestPartners';
import { BlockNestTestimonials } from '@/components/marketing/blocknest/BlockNestTestimonials';
import { BlockNestCTA } from '@/components/marketing/blocknest/BlockNestCTA';

export default function BlockNestPage() {
  // Load Iconify
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!document.querySelector('script[src*="iconify-icon"]')) {
      const s = document.createElement('script');
      s.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
          else entry.target.classList.remove('active');
        });
      },
      { threshold: 0.12 },
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Page-scoped styles */}
      <style>{`
        .bn-page {
          font-family: 'Inter', sans-serif;
          background: #05060E;
          color: #CBD5E1;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .bn-page ::-webkit-scrollbar { width: 0px; }

        /* Glass card */
        .bn-glass {
          background: rgba(19, 20, 31, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 30px rgba(0,0,0,0.25);
        }

        /* Glow text */
        .bn-glow-text {
          text-shadow: 0 0 20px rgba(168,85,247,0.5);
        }

        /* Gradient text */
        .bn-gradient-text {
          background: linear-gradient(135deg, #c084fc, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .bn-gradient-stat {
          background: linear-gradient(135deg, #d8b4fe, #f472b6, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Stat number */
        .bn-stat-number {
          font-size: 4.5rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1;
          display: block;
        }

        /* Hover lift */
        .bn-hover-lift {
          transition: transform 500ms cubic-bezier(0.16,1,0.3,1),
                      border-color 500ms cubic-bezier(0.16,1,0.3,1),
                      box-shadow 500ms cubic-bezier(0.16,1,0.3,1);
        }
        .bn-hover-lift:hover {
          transform: translateY(-4px);
          border-color: rgba(168,85,247,0.3);
          box-shadow: 0 8px 40px rgba(147,51,234,0.2);
        }

        /* Scroll reveal */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1000ms cubic-bezier(0.16,1,0.3,1),
                      transform 1000ms cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal.delay-100 { transition-delay: 100ms; }
        .reveal.delay-200 { transition-delay: 200ms; }
        .reveal.delay-300 { transition-delay: 300ms; }
        .reveal.delay-400 { transition-delay: 400ms; }

        /* Marquee */
        @keyframes bn-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bn-marquee {
          animation: bn-marquee 28s linear infinite;
        }
        .bn-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="bn-page relative">
        {/* Background layers */}
        <BlockNestBackground />

        {/* Navbar */}
        <BlockNestNavbar />

        {/* Main content */}
        <main>
          <BlockNestHero />
          <BlockNestPartners />
          <BlockNestTestimonials />
          <BlockNestCTA />
        </main>

        {/* Footer bar */}
        <footer
          className="relative py-8 px-6"
          style={{
            zIndex: 20,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#030408',
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#9333ea,#4f46e5)' }}
              >
                <span
                  className="iconify text-white"
                  data-icon="solar:layers-minimalistic-bold-duotone"
                  data-width="14"
                />
              </div>
              <span className="text-white font-semibold text-sm">BlockNest</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-slate-500">
              {['Privacy', 'Terms', 'Security', 'Docs'].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-600">© 2026 BlockNest. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
