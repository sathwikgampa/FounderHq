'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isInteractiveHovered, setIsInteractiveHovered] = useState(false);
  const [isTaskApplied, setIsTaskApplied] = useState(false);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          } else {
            entry.target.classList.remove('active');
          }
        });
      },
      { threshold: 0.1 },
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Load UnicornStudio Script Dynamically
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
    <div className="bg-[#030304] text-slate-400 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden min-h-screen relative font-sans">
      {/* CSS Styles */}
      <style jsx global>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .text-gradient {
          background: linear-gradient(to right, #e2e8f0, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .title-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-glow {
          background: radial-gradient(
            circle at center,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(0, 0, 0, 0) 70%
          );
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          filter: blur(10px);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .delay-100 {
          transition-delay: 100ms;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-300 {
          transition-delay: 300ms;
        }
      `}</style>

      {/* Aura Background Component */}
      <div
        className="aura-background-component fixed top-0 w-full h-screen -z-10"
        data-alpha-mask="80"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        }}
      >
        <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
          <div
            data-us-project="ILgOO23w4wEyPQOKyLO4"
            className="absolute w-full h-full left-0 top-0 -z-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030304]/80 backdrop-blur-md transition-all duration-300 reveal active">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold tracking-tighter">
              N
            </div>
            <span className="text-white font-medium tracking-tight text-sm group-hover:opacity-80 transition-opacity">
              NEURALINK
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="hidden sm:block text-xs font-medium hover:text-white transition-colors"
            >
              Sign in
            </button>
            <a
              href="#join"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] hero-glow pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="reveal active inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              v2.0 Beta is live
            </div>

            <h1 className="reveal active delay-100 text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1] title-gradient">
              Supercharge Your Team’s <br className="hidden md:block" /> Productivity with AI.
            </h1>

            <p className="reveal active delay-200 text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
              NeuraLink seamlessly integrates with your workflow to make collaboration smarter,
              faster, and completely intuitive.
            </p>

            <div className="reveal active delay-300 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto group relative px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
              >
                <span>Get Early Access</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                <span>See How It Works</span>
              </a>
            </div>
          </div>

          {/* Abstract 3D Dashboard Mockup */}
          <div className="mt-20 relative perspective-[2000px] group reveal active delay-300">
            <div className="relative w-full max-w-5xl mx-auto glass-panel rounded-xl p-1 shadow-2xl transition-transform duration-700 ease-out transform rotate-x-12 group-hover:rotate-x-0 overflow-hidden border-t border-white/10">
              <div className="bg-[#0A0A0C] rounded-lg overflow-hidden border border-white/5 h-[400px] md:h-[600px] flex">
                {/* Sidebar */}
                <div className="w-16 md:w-64 border-r border-white/5 flex flex-col p-4 bg-[#050507]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-4 h-4 rounded bg-indigo-500/20 border border-indigo-500/50" />
                    <div className="hidden md:block h-2 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 w-full bg-white/5 rounded flex items-center px-3 border border-white/5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-indigo-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="7" height="9" />
                        <rect x="14" y="3" width="7" height="5" />
                        <rect x="14" y="12" width="7" height="9" />
                        <rect x="3" y="16" width="7" height="5" />
                      </svg>
                      <span className="hidden md:block ml-3 text-xs text-white">Overview</span>
                    </div>
                    <div className="h-8 w-full rounded flex items-center px-3 hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <span className="hidden md:block ml-3 text-xs">Tasks</span>
                    </div>
                    <div className="h-8 w-full rounded flex items-center px-3 hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="hidden md:block ml-3 text-xs">Team</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                      <div className="hidden md:block text-xs text-slate-400">Neura AI Active</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                      <div className="h-8 w-64 bg-white/5 rounded border border-white/5 flex items-center px-3">
                        <span className="text-xs text-slate-500">
                          Ask Neura AI to optimize schedule...
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 text-slate-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </div>
                      <div className="h-8 w-24 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-[10px] text-indigo-300 font-medium">
                        + New Project
                      </div>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* AI Insight Card */}
                    <div className="col-span-2 glass-panel rounded-lg p-5 relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 text-indigo-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span className="text-xs font-medium text-white">
                            Workflow Suggestion
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">Just now</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        Based on team velocity, moving &quot;Q4 Roadmap&quot; to{' '}
                        <span className="text-white border-b border-indigo-500/50">Sprint B</span>{' '}
                        will increase completion probability by {isTaskApplied ? '38%' : '24%'}.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsTaskApplied(true)}
                          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] rounded transition-colors"
                        >
                          {isTaskApplied ? 'Applied ✓' : 'Apply Change'}
                        </button>
                        <button
                          onClick={() => setIsTaskApplied(false)}
                          className="px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-400 text-[10px] rounded transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="glass-panel rounded-lg p-5 flex flex-col justify-between">
                      <span className="text-xs text-slate-500">Productivity Score</span>
                      <div className="text-3xl font-medium text-white tracking-tight mt-2">
                        {isTaskApplied ? '97.8' : '94.2'}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        <span>+12% this week</span>
                      </div>
                      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                          style={{ width: isTaskApplied ? '98%' : '94%' }}
                        />
                      </div>
                    </div>

                    {/* Task List */}
                    <div className="col-span-3 glass-panel rounded-lg p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-medium text-white">Prioritized Tasks</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group/task cursor-pointer">
                          <div className="w-4 h-4 rounded border border-indigo-500/50 flex items-center justify-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-[1px] opacity-0 group-hover/task:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-xs text-slate-300 flex-1">
                            Review API Documentation
                          </span>
                          <div className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
                            High
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group/task cursor-pointer">
                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center" />
                          <span className="text-xs text-slate-400 flex-1">
                            Update design system tokens
                          </span>
                          <div className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] border border-yellow-500/20">
                            Medium
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Reflection/Shadow */}
            <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-[#030304] to-transparent z-20" />
          </div>
        </div>
      </section>

      {/* Trust Signals (Marquee) */}
      <section className="py-10 border-y border-white/5 bg-white/[0.01] overflow-hidden reveal active">
        <div className="max-w-7xl mx-auto px-6 text-center mb-8">
          <p className="text-xs font-medium text-slate-500 tracking-wider uppercase">
            Trusted by forward-thinking teams
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="animate-marquee flex gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Original & Duplicated Items for Seamless Loop */}
            {[1, 2, 3].flatMap((loopIdx) => (
              <React.Fragment key={loopIdx}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">AcmeCorp</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">Vortex</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">Sphere</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">Layer</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">Crystal</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-tight">Block</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-2xl md:mx-auto reveal active">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight">
              Intelligence built into every step.
            </h2>
            <p className="text-slate-400 text-lg">
              Stop managing tools and start managing work. NeuraLink&apos;s AI handles the busy work
              so you can focus on shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden reveal active delay-100">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 text-indigo-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 12H3" />
                  <path d="M16 6H3" />
                  <path d="M16 18H3" />
                  <path d="M18 9l3 3-3 3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">AI Task Prioritization</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically sorts your daily tasks based on deadlines, complexity, and team
                availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 md:col-span-2 relative overflow-hidden reveal active delay-200">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center h-full">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-purple-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Smart Workflow Suggestions
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                    The AI analyzes bottlenecks in real-time and suggests instant optimizations to
                    clear blockers before they become problems.
                  </p>
                </div>
                {/* Micro visual */}
                <div className="flex-1 w-full bg-[#0A0A0C] border border-white/5 rounded-lg p-4 shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-500">
                  <div className="flex gap-2 items-center mb-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] text-purple-300">Suggestion Found</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-3/4 bg-white/10 rounded" />
                      <div className="h-2 w-1/2 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 reveal active delay-100">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 border border-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Data-Driven Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visual analytics that show you exactly where your team excels and where time is
                being wasted.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 reveal active delay-200">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 border border-emerald-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Integrated Chat</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Context-aware chat that links discussions directly to tasks, so no context is ever
                lost.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 reveal active delay-300">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 border border-orange-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-orange-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19.439 7.85c-.049-.322.059-.648.289-.878l1.568-1.568a2.41 2.41 0 0 0 0-3.408 2.41 2.41 0 0 0-3.408 0l-1.568 1.568c-.23.23-.556.338-.878.289a4.966 4.966 0 0 0-3.435 1.154 4.968 4.968 0 0 0-1.154 3.435c.049.322-.059.648-.289.878l-5.6 5.6a2.41 2.41 0 0 0 0 3.408 2.41 2.41 0 0 0 3.408 0l5.6-5.6c.23-.23.556-.338.878-.289a4.966 4.966 0 0 0 3.435-1.154 4.966 4.966 0 0 0 1.154-3.435z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Seamless Integrations</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Works with GitHub, Slack, Figma, and Notion out of the box. Connect in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section
        id="demo"
        className="py-24 bg-[#050507] border-y border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050507] to-[#050507]" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 space-y-6 reveal active">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              Live Demo
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
              Watch AI Optimize Your Day
            </h2>
            <p className="text-slate-400 text-lg">
              Hover over the task list to see how NeuraLink analyzes complexity and suggests the
              optimal path forward.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Real-time complexity analysis
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Automated resource allocation
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Drag-and-drop reordering
              </li>
            </ul>
          </div>

          {/* Interactive Component */}
          <div className="flex-1 w-full reveal active delay-200">
            <div className="bg-[#0e0e11] rounded-xl border border-white/10 p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <span className="text-sm font-medium text-white">Today&apos;s Sprint</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
              </div>

              <div className="space-y-3">
                {/* Task Item (Interactive) */}
                <div
                  onMouseEnter={() => setIsInteractiveHovered(true)}
                  onMouseLeave={() => setIsInteractiveHovered(false)}
                  className="group relative bg-[#18181b] rounded border border-white/5 p-4 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded border border-slate-600 flex items-center justify-center group-hover:border-indigo-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 h-2.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-200 font-medium">
                          Refactor Authentication Logic
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Backend • Due Today</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      High Priority
                    </span>
                  </div>

                  {/* Hover Reveal Content */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isInteractiveHovered ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 mt-0 opacity-0'
                    }`}
                  >
                    <div className="pt-3 border-t border-white/10 flex items-center gap-3 text-xs">
                      <span className="text-indigo-300 flex items-center gap-1 font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" />
                          <path d="M20 14h2" />
                          <path d="M15 13v2" />
                          <path d="M9 13v2" />
                        </svg>
                        AI Tip:
                      </span>
                      <span className="text-slate-400">
                        Similar task completed by Sarah in 2h. Assigning to her improves throughput.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Static Task */}
                <div className="bg-[#18181b] rounded border border-white/5 p-4 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded border border-slate-600" />
                      <div>
                        <p className="text-sm text-slate-300">Update User Documentation</p>
                        <p className="text-xs text-slate-500 mt-1">Design • Due Tomorrow</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-medium text-center text-white mb-16 tracking-tight reveal active">
          Loved by remote teams worldwide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-100">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &quot;NeuraLink totally changed how we handle sprints. The AI suggestions are
              surprisingly accurate and have saved us hours of planning time every week.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                AC
              </div>
              <div>
                <p className="text-xs font-medium text-white">Alex Chen</p>
                <p className="text-[10px] text-slate-500">CTO, DevScale</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-200">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &quot;The interface is stunning, but the backend AI is where the magic happens. It
              feels like having a project manager who never sleeps.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                SM
              </div>
              <div>
                <p className="text-xs font-medium text-white">Sarah Miller</p>
                <p className="text-[10px] text-slate-500">Product Lead, Streamline</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-300">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &quot;We&apos;ve tried every tool out there. Nothing integrates this smoothly with our
              existing stack while adding actual intelligence.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                JW
              </div>
              <div>
                <p className="text-xs font-medium text-white">James Wilson</p>
                <p className="text-[10px] text-slate-500">Founder, NextGen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Early Access */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active">
            <h2 className="text-3xl font-medium text-white mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400">Start for free, scale when you need to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-white/5 bg-[#0A0A0C] reveal active delay-100">
              <h3 className="text-lg font-medium text-white">Starter</h3>
              <p className="text-sm text-slate-500 mb-6">For individuals</p>
              <div className="text-3xl font-medium text-white mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  3 Projects
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Basic AI suggestions
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Community Support
                </li>
              </ul>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors"
              >
                Current Plan
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border border-indigo-500/30 bg-[#0E0E12] relative reveal active delay-200">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-[10px] text-white font-medium">
                Most Popular
              </div>
              <h3 className="text-lg font-medium text-white">Pro</h3>
              <p className="text-sm text-slate-500 mb-6">For small teams</p>
              <div className="text-3xl font-medium text-white mb-6">
                $12<span className="text-sm text-slate-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Unlimited Projects
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Advanced AI Insights
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Integrations
                </li>
              </ul>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors shadow-lg shadow-indigo-500/20"
              >
                Join Beta
              </button>
            </div>

            {/* Business */}
            <div className="p-8 rounded-2xl border border-white/5 bg-[#0A0A0C] reveal active delay-300">
              <h3 className="text-lg font-medium text-white">Business</h3>
              <p className="text-sm text-slate-500 mb-6">For organizations</p>
              <div className="text-3xl font-medium text-white mb-6">
                $29<span className="text-sm text-slate-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  SSO &amp; Security
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Dedicated Success Manager
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>{' '}
                  Custom AI Models
                </li>
              </ul>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture / CTA */}
      <section id="join" className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal active">
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">
            Ready to work smarter?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join the waiting list today and get our free guide on &quot;AI-First Productivity&quot;.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/dashboard');
            }}
            className="max-w-md mx-auto relative flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute left-4 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-11 pr-32 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-white text-black text-xs font-semibold rounded-full hover:bg-slate-200 transition-colors"
            >
              Claim Your Spot
            </button>
          </form>
          <p className="text-[10px] text-slate-600 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>

        {/* Background Accents */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020203] py-12 text-sm reveal active">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">
                  N
                </div>
                <span className="text-white font-medium tracking-tight">NEURALINK</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                AI That Connects Your Team Smarter. Built for the future of remote work.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
            <p className="text-slate-600 text-xs">
              © 2026 NeuraLink Solutions. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://github.com/sathwikgampa/FounderHq"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatbot />
    </div>
  );
}
