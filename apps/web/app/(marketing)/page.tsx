'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive C-Suite Simulator State
  const [activeTab, setActiveTab] = useState<'finance' | 'talent' | 'growth' | 'ops'>('finance');

  const agentSimulatorData = {
    finance: {
      role: 'Finance & Investment Agent',
      prompt: 'Model 18-month runway & cap table dilution for $2.5M Seed Round',
      output:
        'Generated cap table model: Post-money valuation $12.5M. Investor dilution: 20.0%. Runway extended by 18.4 months at $85k/mo burn rate.',
      kpis: [
        { label: 'Post-Money Valuation', value: '$12.5M' },
        { label: 'Runway Extension', value: '18.4 Mo' },
        { label: 'Dilution Impact', value: '20.0%' },
      ],
      badge: 'CFO Sub-Agent',
      badgeColor: 'bg-blue-400/20 text-blue-300 border-blue-500/30',
    },
    talent: {
      role: 'Talent & Hiring Agent',
      prompt: 'Draft Principal AI Engineer JD & automated technical interview scorecard',
      output:
        'Job description published to LinkedIn & Wellfound. 42 candidate resumes parsed. Top 3 matched with 94%+ skill alignment score.',
      kpis: [
        { label: 'Parsed Resumes', value: '42' },
        { label: 'Top Matches', value: '3 Candidates' },
        { label: 'Sourcing Time', value: '4.2 Hours' },
      ],
      badge: 'VP Talent Sub-Agent',
      badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-500/30',
    },
    growth: {
      role: 'Growth & GTM Agent',
      prompt: 'Conduct competitor benchmarking & draft Product Hunt launch campaign',
      output:
        'Analyzed 12 direct competitors. Formulated multi-channel launch playbook across PH, X, and Hacker News. Projected 1.4k signups day 1.',
      kpis: [
        { label: 'Competitors Analyzed', value: '12' },
        { label: 'Launch Channels', value: '4 Active' },
        { label: 'Target Signups', value: '1.4k' },
      ],
      badge: 'CMO Sub-Agent',
      badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-500/30',
    },
    ops: {
      role: 'Operations & Legal Agent',
      prompt: 'Review enterprise B2B SaaS agreement & flag indemnification clauses',
      output:
        'Audit complete: Flagged 2 non-standard liability terms in Section 8.4. Auto-generated redline amendment with standard 1x cap clause.',
      kpis: [
        { label: 'Clause Risks Flagged', value: '2 Items' },
        { label: 'Legal Audit Time', value: '45 Sec' },
        { label: 'Compliance Score', value: '99.2%' },
      ],
      badge: 'COO/Legal Sub-Agent',
      badgeColor: 'bg-rose-400/20 text-rose-300 border-rose-500/30',
    },
  };

  // Native HTML5 Canvas 2D Bar Chart Drawing for Department Alignment SLA
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = [94, 96, 98, 97, 99, 98, 99];
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 214;
    const height = rect.height || 112;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = 14;
    const gap = (width - data.length * barWidth) / (data.length + 1);

    data.forEach((val, i) => {
      const x = gap + i * (barWidth + gap);
      const normVal = (val - 80) / 20;
      const barHeight = Math.max(10, normVal * (height - 20));
      const y = height - barHeight - 4;

      ctx.fillStyle = '#60a5fa';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 6);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    });
  }, []);

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Load UnicornStudio script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        if (
          (window as any).UnicornStudio &&
          typeof (window as any).UnicornStudio.init === 'function'
        ) {
          (window as any).UnicornStudio.init();
        }
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-blue-500/30 selection:text-blue-200 font-sans relative overflow-x-hidden">
      {/* Background Aura Component */}
      <div
        className="aura-background-component top-0 w-full h-screen z-0 brightness-50 saturate-50 fixed blur-sm pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        }}
      >
        <div className="fixed inset-0 -z-10 bg-black">
          <div
            className="aura-background-component absolute inset-0 w-full h-full"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          >
            <div
              data-us-project="XxCmD31vVBmiINgvYCho"
              className="absolute inset-0 w-full h-full bg-neutral-950"
            />
          </div>
        </div>
      </div>

      {/* SVG Grid Overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0v64" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* STICKY GLASS NAVIGATION */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.811 6.727C12.825 4.909 13.331 4 14.09 4c.757 0 1.264.909 2.277 2.727l.262.47c.288.517.432.775.657.945c.224.17.504.234 1.063.36l.51.116c1.967.445 2.95.667 3.185 1.42s-.437 1.537-1.778 3.106l-.347.406c-.381.445-.572.668-.658.944s-.057.573 0 1.168l.053.541c.203 2.094.305 3.14-.308 3.605s-1.534.041-3.377-.807l-.476-.22c-.524-.24-.786-.361-1.063-.361c-.278 0-.54.12-1.063.361l-.477.22c-1.842.848-2.763 1.272-3.376.807s-.511-1.511-.309-3.605l.053-.541c.057-.595.086-.892 0-1.168s-.276-.498-.657-.944l-.347-.406C6.57 11.575 5.9 10.79 6.135 10.038s1.218-.975 3.185-1.42l.51-.116c.559-.126.838-.19 1.063-.36s.368-.428.656-.945z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Founder<span className="text-blue-400">HQ</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v2.0
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-300">
            <a href="#platform" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#c-suite" className="hover:text-white transition-colors">
              AI C-Suite
            </a>
            <a href="#governance" className="hover:text-white transition-colors">
              Governance & Memory
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Founders
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>System Online</span>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold rounded-full px-5 py-2.5 text-xs backdrop-blur-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10 active:scale-95"
            >
              <span>Launch Dashboard</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:pb-28 lg:pt-20">
          {/* Pill Badge */}
          <div className="mx-auto w-fit mb-6 [animation:fadeSlideIn_0.8s_ease-out_0.1s_both] animate-on-scroll animate">
            <div
              className="inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 px-4 py-2 text-xs text-neutral-300 backdrop-blur-xl"
              style={{ borderRadius: '9999px' }}
            >
              <span className="inline-flex items-center justify-center rounded-full bg-blue-400/20 text-blue-300 px-2.5 py-0.5 font-medium font-mono">
                FounderHQ v2.0
              </span>
              <span className="font-medium">Autonomous Executive Suite for Startups</span>
            </div>
          </div>

          {/* Headline & Subheadline */}
          <div className="[animation:fadeSlideIn_0.8s_ease-out_0.2s_both] animate-on-scroll text-center animate">
            <h1 className="mx-auto max-w-5xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.08]">
              Your AI C-Suite. One CEO Planner. Zero Friction.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-xl text-neutral-300 leading-relaxed font-normal">
              FounderHQ empowers startup founders with an autonomous executive team—Finance, Talent,
              Growth, and Operations—orchestrated by a single intelligent CEO Planner with built-in
              risk governance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2.5 rounded-full bg-white text-neutral-950 px-8 py-3.5 text-sm font-semibold shadow-xl shadow-white/10 hover:-translate-y-0.5 transition-all active:scale-95"
                style={{ borderRadius: '9999px' }}
              >
                <span>Deploy Your AI C-Suite</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <a
                href="#c-suite"
                className="inline-flex items-center gap-2 border-gradient hover:text-white transition-all hover:-translate-y-0.5 text-sm font-medium text-white/80 bg-white/5 rounded-full px-7 py-3.5 backdrop-blur-xl"
                style={{ borderRadius: '9999px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                    opacity=".5"
                  />
                  <path d="m15.414 13.059l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059l4.72 2.787c.781.462.781 1.656 0 2.118" />
                </svg>
                <span>Try Interactive Simulator</span>
              </a>
            </div>
          </div>

          {/* BENTO GRID (12 COLUMNS, FIXED H-[800PX]) */}
          <div
            id="platform"
            className="grid grid-cols-1 auto-rows-[200px] md:mt-16 md:grid-cols-6 md:gap-6 lg:grid-cols-12 lg:mt-24 overflow-hidden h-[800px] mt-16 gap-4"
            style={{
              maskImage: 'linear-gradient(180deg, transparent, black 0%, black 65%, transparent)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent, black 0%, black 65%, transparent)',
            }}
          >
            {/* CARD 1: FounderHQ Executive Team Image Card */}
            <div
              className="relative overflow-hidden rounded-3xl border-gradient md:col-span-3 lg:col-span-6 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.3s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <img
                className="h-full w-full object-cover opacity-90"
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/357cb3d1-9f65-4810-884b-f0072a65193d_1600w.webp"
                alt="FounderHQ Executive C-Suite AI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
              <div className="absolute left-4 top-4">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] border-gradient text-slate-200 bg-white/10 rounded-full px-3 py-1 backdrop-blur-xl font-mono font-medium"
                  style={{ borderRadius: '9999px' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  CEO Planner & C-Suite Sync Active
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full ring-2 ring-blue-400 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                      alt="CFO Agent"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full ring-2 ring-purple-400 overflow-hidden -ml-2">
                    <img
                      className="h-full w-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2f999a94-4340-424d-b6bd-1e2df830c25a_100w.webp"
                      alt="VP Growth Agent"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full ring-2 ring-emerald-400 overflow-hidden -ml-2">
                    <img
                      className="w-full h-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/08b00610-8646-44ce-a131-48226b9e2898_100w.webp"
                      alt="Talent Agent"
                    />
                  </div>
                </div>
                <span className="text-xs text-neutral-200 font-medium font-mono">
                  Autonomous Goal Resolution: 99.4%
                </span>
              </div>
            </div>

            {/* CARD 2: Founder Acceleration Stat Card */}
            <div
              className="rounded-3xl bg-white text-neutral-900 p-6 border-gradient md:col-span-3 lg:col-span-3 [animation:fadeSlideIn_0.8s_ease-out_0.4s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0.95) 100%)',
                borderRadius: '24px',
              }}
            >
              <div>
                <p className="text-4xl tracking-tighter font-extrabold text-neutral-950 font-mono">
                  140+
                </p>
                <p className="mt-2 text-xs text-neutral-600 font-medium">
                  Active Startups Operating with FounderHQ AI
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs font-mono">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12"
                    opacity=".5"
                  />
                  <path d="M14.5 10.75a.75.75 0 0 1 0-1.5H17a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-.69l-2.013 2.013a1.75 1.75 0 0 1-2.474 0l-1.586-1.586a.25.25 0 0 0-.354 0L7.53 14.53a.75.75 0 0 1-1.06-1.06l2.293-2.293a1.75 1.75 0 0 1 2.474 0l1.586 1.586a.25.25 0 0 0 .354 0l2.012-2.013z" />
                </svg>
                <span>80% Executive Overhead Saved</span>
              </div>
            </div>

            {/* CARD 3: CEO Planner Agent Code Snippet */}
            <article
              className="overflow-hidden border-gradient rounded-3xl relative md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.5s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="h-full p-6 relative flex flex-col justify-between">
                <div className="relative mx-auto h-full w-full flex items-center justify-center flex-1">
                  <div className="scale-[0.85] w-full">
                    <div className="backdrop-blur-[2px] bg-white/[0.03] border-gradient rounded-2xl">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-blue-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16.443 7.328a.75.75 0 0 1 1.059-.056l1.737 1.564c.737.663 1.347 1.212 1.767 1.71c.44.525.754 1.088.754 1.784c0 .695-.313 1.258-.754 1.782c-.42.499-1.03 1.049-1.767 1.711l-1.737 1.564a.75.75 0 1 1-1.004-1.115l1.697-1.527c.788-.709 1.319-1.19 1.663-1.598c.33-.393.402-.622.402-.817c0-.196-.072-.425-.402-.818c-.344-.409-.875-.889-1.663-1.598l-1.697-1.527a.75.75 0 0 1-.056-1.06m-8.94 1.06a.75.75 0 0 0-1.004-1.115L4.761 8.836c-.737.663-1.347 1.212-1.767 1.71c-.44.525-.754 1.088-.754 1.784c0 .695.313 1.258.754 1.782c.42.499 1.03 1.049 1.767 1.711l1.737 1.564a.75.75 0 1 0 1.004-1.115l-1.697-1.527c-.788-.709-1.319-1.19-1.663-1.598c-.33-.393-.402-.622-.402-.817c0-.196.072-.425.402-.818c.344-.409.875-.889 1.663-1.598z" />
                        </svg>
                        <span className="text-[11px] font-medium text-white/80 font-mono">
                          ceo_planner.ts
                        </span>
                        <span className="ml-auto text-[10px] text-emerald-400 font-mono">
                          ACTIVE
                        </span>
                      </div>
                      <pre className="text-[11px] font-mono leading-relaxed text-white/80 p-4">
                        {`const planner = new CEOPlannerAgent({
  memory: "VectorStore_RAG",
  riskThreshold: 0.85
});

await planner.orchestrateGoal({
  objective: "Launch Series A Strategy",
  subAgents: ["Finance", "Talent", "Growth"]
});`}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="relative pt-2">
                  <h3 className="text-base font-semibold tracking-tight text-white/95">
                    Decompose Complex Startup Goals
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    Single CEO prompt automatically translates strategy into sub-agent execution.
                  </p>
                </div>
              </div>
            </article>

            {/* CARD 4: Department Alignment SLA Chart Card */}
            <div
              className="rounded-3xl border-gradient p-6 md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.6s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div>
                <h3 className="text-base font-semibold tracking-tight">Department Alignment</h3>
                <p className="mt-1 text-xs text-neutral-300">Cross-functional SLA</p>
              </div>
              <div className="mt-4 rounded-xl bg-black/40 p-3 border-gradient">
                <div className="relative w-full h-[120px]">
                  <canvas ref={canvasRef} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-sm font-semibold tracking-tight">98.4%</span>
                </div>
                <span className="text-xs text-neutral-300 font-medium font-mono">SLA Achieved</span>
              </div>
            </div>

            {/* CARD 5: Global Deployment Mesh Card */}
            <div
              className="relative overflow-hidden rounded-3xl border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.7s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="p-6">
                <p className="text-3xl font-extrabold tracking-tighter font-mono">35+</p>
                <p className="mt-1 text-xs text-neutral-300">Global Startup Hubs</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    San Francisco
                  </span>
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    London
                  </span>
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    Singapore
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-2xl border-gradient">
                  <img
                    className="h-36 w-full object-cover"
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d25a1767-0ea8-4aac-b981-6afd67dc79a6_800w.webp"
                    alt="Globe Mesh"
                  />
                </div>
              </div>
            </div>

            {/* CARD 6: Autonomous Agent Execution Card */}
            <article
              className="relative overflow-hidden hover:bg-white/[0.08] transition-all group rounded-3xl border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.8s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="flex p-6 items-center justify-between">
                <h4 className="text-base font-semibold tracking-tight">Executive Sub-Agents</h4>
                <span
                  className="inline-flex items-center gap-1 text-[11px] border-gradient text-slate-300 bg-white/5 rounded-full px-2.5 py-1"
                  style={{ borderRadius: '9999px' }}
                >
                  ADK Framework
                </span>
              </div>
              <div className="flex-1 flex p-6 pt-0 items-center">
                <div className="relative w-full">
                  <div className="hover:bg-black/50 transition-all bg-black/60 border-gradient rounded-xl p-3 backdrop-blur">
                    <div className="flex gap-1 mb-2 items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-400/80" />
                    </div>
                    <div className="overflow-x-auto">
                      <pre className="text-[10px] font-mono leading-tight min-w-max text-slate-300">
                        <code>{`# Finance & Investment Sub-Agent
class FinanceAgent:
  def model_cap_table(self):
    return runway_insights`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* CARD 7: Human Risk & Governance Orbit Card */}
            <section
              className="group relative overflow-hidden border-gradient rounded-3xl md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.9s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="relative h-full overflow-hidden flex flex-col justify-between">
                <div className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '.6s' }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '1.2s' }}
                    />
                  </div>
                  <div className="relative z-10">
                    <div
                      className="relative flex h-20 w-20 items-center justify-center rounded-full border-gradient bg-neutral-900/70 backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
                      style={{ borderRadius: '9999px' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-9 h-9 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="relative border-t border-white/10 p-5">
                  <h3 className="text-base font-semibold tracking-tight text-slate-100">
                    Human-in-the-Loop Governance
                  </h3>
                  <p className="leading-relaxed text-slate-400 mt-1 text-xs">
                    Real-time risk scoring and approval gates for critical actions.
                  </p>
                </div>
              </div>
            </section>

            {/* CARD 8: Founder Testimonial Card */}
            <div
              className="flex flex-col justify-between rounded-3xl border-gradient p-6 backdrop-blur-md transition md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_1s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                    alt="Serena Cardenas"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">Serena Cardenas</p>
                    <p className="text-[10px] text-white/60">Founder @ ScaleFlow (YC W24)</p>
                  </div>
                </div>
              </div>
              <p className="leading-snug text-xs font-medium text-white mb-3">
                &quot;FounderHQ feels like having a seasoned CFO, CMO, and COO working 24/7. It
                transformed our operational velocity.&quot;
              </p>
              <div className="rounded-lg border-gradient p-3 bg-white/5">
                <p className="text-[11px] text-white/90 mb-1.5 font-semibold">
                  Key Milestones Achieved:
                </p>
                <ul className="text-[11px] text-white/70 space-y-1 font-mono">
                  <li>• $2.5M Seed Round Closed</li>
                  <li>• 4x Faster Candidate Sourcing</li>
                  <li>• 100% Audit Compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE EXECUTIVE C-SUITE SIMULATOR SECTION */}
        <section id="c-suite" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
              <span>INTERACTIVE C-SUITE SANDBOX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white">
              Experience the Autonomous Executive Suite
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto">
              Select an executive sub-agent below to see how FounderHQ decomposes complex strategic
              goals into real-time operational execution.
            </p>
          </div>

          {/* Sub-Agent Tab Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            {(['finance', 'talent', 'growth', 'ops'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab} Agent
              </button>
            ))}
          </div>

          {/* Interactive Agent Box */}
          <div className="glass-card border-gradient rounded-[28px] p-8 sm:p-12 relative overflow-hidden space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">
                  {agentSimulatorData[activeTab].role}
                </h3>
              </div>
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full border ${agentSimulatorData[activeTab].badgeColor}`}
              >
                {agentSimulatorData[activeTab].badge}
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                CEO Strategic Directive:
              </span>
              <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-4 text-sm font-mono text-blue-300">
                &quot;{agentSimulatorData[activeTab].prompt}&quot;
              </div>
            </div>

            {/* Output */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Autonomous Execution Log:
              </span>
              <div className="bg-neutral-950 border border-emerald-500/20 rounded-2xl p-4 text-xs font-mono text-neutral-200 leading-relaxed">
                {agentSimulatorData[activeTab].output}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {agentSimulatorData[activeTab].kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1 text-center"
                >
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">
                    {kpi.label}
                  </div>
                  <div className="text-xl font-bold font-mono text-white">{kpi.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE TESTIMONIALS SECTION */}
        <section
          id="testimonials"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative"
        >
          <div
            className="overflow-hidden rounded-3xl ring-white/10 ring-1 p-6 sm:p-8 relative backdrop-blur border-gradient"
            style={{
              background:
                'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
              borderRadius: '24px',
            }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="[animation:fadeSlideIn_0.8s_ease-out_0.1s_both] animate-on-scroll text-center mb-10 animate">
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-blue-400">
                  <span>FOUNDER STORIES</span>
                  <span>(02)</span>
                </div>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl sm:text-4xl md:text-5xl text-white text-left font-extrabold tracking-tighter">
                  What startup founders say
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 text-left max-w-[42ch] mt-2 sm:mt-0">
                  Real feedback from founders using FounderHQ to build better, ship faster, and
                  scale smarter.
                </p>
              </div>
            </div>

            {/* Marquee Row */}
            <div
              className="relative overflow-hidden rounded-3xl ring-white/10 ring-1 border-gradient [animation:fadeSlideIn_0.8s_ease-out_0.2s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

              <div className="relative py-6 sm:py-8">
                <div className="animate-marquee-ltr space-x-6">
                  {/* Testimonial 1 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4c9aa348-ff35-430c-abeb-a6b169fb665d_100w.webp"
                        alt="Michael Chen"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">Michael Chen</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">CEO @ TechFlow (YC S23)</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      The Finance & Investment sub-agent in FounderHQ{' '}
                      <span className="text-blue-400">saved us $40k in legal fees</span> during our
                      Seed round modeling. Essential tool for any founder.
                    </p>
                  </article>

                  {/* Testimonial 2 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/67ea0bb9-c020-4357-bb6a-54070a7b9ce7_100w.webp"
                        alt="Emily Rodriguez"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">Emily Rodriguez</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">Co-Founder @ Innovate AI</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      Switching to FounderHQ was the{' '}
                      <span className="text-blue-400">best decision</span> we made. One CEO prompt
                      coordinates our entire hiring and launch schedule.
                    </p>
                  </article>

                  {/* Testimonial 3 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                        alt="David Kim"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">David Kim</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">Solo Founder @ CloudBase</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      The risk governance approval engine allows me to{' '}
                      <span className="text-blue-400">delegate with confidence</span>. Full human
                      control over high-stakes financial decisions.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white">
              Accelerate your operational velocity today
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto">
              Simple, transparent plans designed for early-stage & growth startups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="glass-card border-gradient rounded-[28px] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Free Starter</h3>
                <p className="text-xs text-neutral-400">
                  Ideal for solo founders prototyping initial idea.
                </p>
                <div className="text-4xl font-extrabold font-mono text-white">
                  $0 <span className="text-xs text-neutral-400 font-normal">/mo</span>
                </div>
                <ul className="text-xs text-neutral-300 space-y-2 pt-2 border-t border-white/10 font-mono">
                  <li>• CEO Planner Agent (100 Prompts/mo)</li>
                  <li>• 1 Sub-Agent (Finance or Growth)</li>
                  <li>• Basic Pitch Deck RAG Memory</li>
                </ul>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Founder Plan (Featured) */}
            <div className="glass-card border-gradient rounded-[28px] p-8 flex flex-col justify-between space-y-6 relative ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                MOST POPULAR FOR STARTUPS
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Pro Founder</h3>
                <p className="text-xs text-neutral-400">
                  Complete AI C-Suite for scaling Seed & Series A teams.
                </p>
                <div className="text-4xl font-extrabold font-mono text-white">
                  $79 <span className="text-xs text-neutral-400 font-normal">/mo</span>
                </div>
                <ul className="text-xs text-neutral-300 space-y-2 pt-2 border-t border-white/10 font-mono">
                  <li>• Unlimited CEO Planner Orchestration</li>
                  <li>• All 4 Sub-Agents (Finance, Talent, Growth, Ops)</li>
                  <li>• Human-in-the-Loop Risk Governance</li>
                  <li>• Vector Memory (RAG) + Unlimited Storage</li>
                  <li>• Slack & Notion Integrations</li>
                </ul>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-full text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 shadow-lg transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise C-Suite Plan */}
            <div className="glass-card border-gradient rounded-[28px] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Enterprise C-Suite</h3>
                <p className="text-xs text-neutral-400">
                  Dedicated hardware & custom fine-tuned agents for venture studios.
                </p>
                <div className="text-4xl font-extrabold font-mono text-white">Custom</div>
                <ul className="text-xs text-neutral-300 space-y-2 pt-2 border-t border-white/10 font-mono">
                  <li>• Dedicated ADK Cluster & Custom LLM Fine-Tuning</li>
                  <li>• Single-Tenant Isolation & SOC2 Compliance</li>
                  <li>• 24/7 Dedicated AI Solutions Engineer</li>
                  <li>• Unlimited Custom Executive Agents</li>
                </ul>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-neutral-950 py-16 px-6 relative z-10 text-neutral-400 text-xs">
          <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4 pb-12 border-b border-white/10">
            {/* Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.811 6.727C12.825 4.909 13.331 4 14.09 4c.757 0 1.264.909 2.277 2.727l.262.47c.288.517.432.775.657.945c.224.17.504.234 1.063.36l.51.116c1.967.445 2.95.667 3.185 1.42s-.437 1.537-1.778 3.106l-.347.406c-.381.445-.572.668-.658.944s-.057.573 0 1.168l.053.541c.203 2.094.305 3.14-.308 3.605s-1.534.041-3.377-.807l-.476-.22c-.524-.24-.786-.361-1.063-.361c-.278 0-.54.12-1.063.361l-.477.22c-1.842.848-2.763 1.272-3.376.807s-.511-1.511-.309-3.605l.053-.541c.057-.595.086-.892 0-1.168s-.276-.498-.657-.944l-.347-.406C6.57 11.575 5.9 10.79 6.135 10.038s1.218-.975 3.185-1.42l.51-.116c.559-.126.838-.19 1.063-.36s.368-.428.656-.945z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white tracking-tight">FounderHQ Inc.</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-xs">
                The Autonomous AI Executive Suite for Startup Founders.
              </p>
            </div>

            {/* Architecture Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Platform Architecture
              </h4>
              <ul className="space-y-2 text-neutral-400 font-mono">
                <li>
                  <a href="#platform" className="hover:text-white transition-colors">
                    CEO Planner Agent
                  </a>
                </li>
                <li>
                  <a href="#c-suite" className="hover:text-white transition-colors">
                    Executive Sub-Agents
                  </a>
                </li>
                <li>
                  <a href="#governance" className="hover:text-white transition-colors">
                    Human Risk Scoring
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Vector Memory (RAG)
                  </a>
                </li>
              </ul>
            </div>

            {/* Executive Sub-Agents */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Executive Suite
              </h4>
              <ul className="space-y-2 text-neutral-400 font-mono">
                <li>
                  <a href="#c-suite" className="hover:text-white transition-colors">
                    Finance & Cap Table
                  </a>
                </li>
                <li>
                  <a href="#c-suite" className="hover:text-white transition-colors">
                    Talent & Hiring
                  </a>
                </li>
                <li>
                  <a href="#c-suite" className="hover:text-white transition-colors">
                    Growth & GTM Playbook
                  </a>
                </li>
                <li>
                  <a href="#c-suite" className="hover:text-white transition-colors">
                    Operations & Legal Audit
                  </a>
                </li>
              </ul>
            </div>

            {/* Security & Docs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Resources
              </h4>
              <ul className="space-y-2 text-neutral-400 font-mono">
                <li>
                  <a href="/docs" className="hover:text-white transition-colors">
                    System Architecture Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Multi-Tenant Isolation
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing Tiers
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sathwikgampa/FounderHq"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px]">
            <p>© 2026 FounderHQ Inc. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0 font-mono">
              <a href="#" className="hover:text-neutral-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-neutral-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-neutral-300">
                Security Policy
              </a>
            </div>
          </div>
        </footer>
      </main>

      <FloatingChatbot />
    </div>
  );
}
