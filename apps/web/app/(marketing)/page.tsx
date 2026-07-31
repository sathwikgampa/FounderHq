'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isInteractiveHovered, setIsInteractiveHovered] = useState(false);
  const [isTaskApplied, setIsTaskApplied] = useState(false);

  // Scroll Reveal Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Load Iconify & UnicornStudio Scripts Dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Iconify 3.1.0 Script
      if (!document.querySelector('script[src*="iconify"]')) {
        const iconifyScript = document.createElement('script');
        iconifyScript.src = 'https://code.iconify.design/3/3.1.0/iconify.min.js';
        iconifyScript.async = true;
        document.head.appendChild(iconifyScript);
      }

      // UnicornStudio Script
      if (!document.querySelector('script[src*="unicornStudio"]')) {
        const unicornScript = document.createElement('script');
        unicornScript.src =
          'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
        unicornScript.async = true;
        unicornScript.onload = () => {
          if (
            (window as any).UnicornStudio &&
            typeof (window as any).UnicornStudio.init === 'function'
          ) {
            (window as any).UnicornStudio.init();
          }
        };
        document.head.appendChild(unicornScript);
      }
    }
  }, []);

  return (
    <div className="bg-[#030304] text-slate-400 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden min-h-screen relative font-sans">
      {/* Custom Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
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

      {/* Background (component) added by Aura */}
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
            <Image
              src="/logo.svg"
              alt="FounderHQ"
              width={32}
              height={32}
              className="object-contain group-hover:opacity-80 transition-opacity"
            />
            <span className="text-white font-medium tracking-tight text-sm group-hover:opacity-80 transition-opacity">
              FOUNDERHQ
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
              onClick={() => router.push('/login')}
              className="hidden sm:block text-xs font-medium hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push('/login?mode=demo')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Try Demo
            </button>
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
              AI Operating System v1.0
            </div>

            <h1 className="reveal active delay-100 text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1] title-gradient">
              Your Startup&apos;s AI-Powered <br className="hidden md:block" /> Executive Team.
            </h1>

            <p className="reveal active delay-200 text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
              FounderHQ replaces fragmented startup tools with one unified operating system where AI
              executives collaborate under a CEO Planner — keeping you in complete control.
            </p>

            <div className="reveal active delay-300 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto group relative px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <span
                  className="iconify inline ml-1 group-hover:translate-x-0.5 transition-transform"
                  data-icon="lucide:arrow-right"
                  data-width="16"
                />
              </button>
              <button
                onClick={() => {
                  // Demo mode: bypass auth
                  router.push('/login?mode=demo');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="iconify" data-icon="lucide:sparkles" data-width="16" />
                <span>Try Demo</span>
              </button>
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
                      <span
                        className="iconify text-indigo-400"
                        data-icon="lucide:layout-dashboard"
                        data-width="16"
                      />
                      <span className="hidden md:block ml-3 text-xs text-white">Overview</span>
                    </div>
                    <div className="h-8 w-full rounded flex items-center px-3 hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                      <span className="iconify" data-icon="lucide:check-square" data-width="16" />
                      <span className="hidden md:block ml-3 text-xs">Tasks</span>
                    </div>
                    <div className="h-8 w-full rounded flex items-center px-3 hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                      <span className="iconify" data-icon="lucide:users" data-width="16" />
                      <span className="hidden md:block ml-3 text-xs">Team</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                      <div className="hidden md:block text-xs text-slate-400">
                        Jarvis (CEO Planner) Active
                      </div>
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
                          Ask Jarvis to plan your sprint...
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
                        <span
                          className="iconify text-slate-400"
                          data-icon="lucide:bell"
                          data-width="14"
                        />
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
                          <span
                            className="iconify text-indigo-400"
                            data-icon="lucide:sparkles"
                            data-width="14"
                          />
                          <span className="text-xs font-medium text-white">
                            CEO Planner Insight
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">Just now</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        Based on team velocity, moving &ldquo;MVP Launch&rdquo; to{' '}
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
                      <span className="text-xs text-slate-500">Startup Health Score</span>
                      <div className="text-3xl font-medium text-white tracking-tight mt-2">
                        {isTaskApplied ? '97.8' : '94.2'}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400">
                        <span className="iconify" data-icon="lucide:trending-up" data-width="12" />
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
                        <span
                          className="iconify text-slate-500 cursor-pointer hover:text-white"
                          data-icon="lucide:more-horizontal"
                          data-width="14"
                        />
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
            Trusted by forward-thinking startups
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
            {[1, 2, 3].flatMap((loopIdx) => (
              <React.Fragment key={loopIdx}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:hexagon" data-width="24" />
                  <span className="font-bold text-lg text-white tracking-tight">AcmeCorp</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:triangle" data-width="24" />
                  <span className="font-bold text-lg text-white tracking-tight">Vortex</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:circle" data-width="24" />
                  <span className="font-bold text-lg text-white tracking-tight">Sphere</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:square-stack" data-width="24" />
                  <span className="font-bold text-lg text-white tracking-tight">Layer</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:gem" data-width="24" />
                  <span className="font-bold text-lg text-white tracking-tight">Crystal</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="iconify" data-icon="lucide:boxes" data-width="24" />
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
              Stop managing tools and start managing your startup. FounderHQ&apos;s AI executive
              team handles the busy work so you can focus on building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden reveal active delay-100">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="iconify text-indigo-500" data-icon="lucide:zap" data-width="100" />
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                <span
                  className="iconify text-indigo-400"
                  data-icon="lucide:list-todo"
                  data-width="24"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">CEO Planner Orchestration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Speak to one AI executive that coordinates finance, talent, growth, and operations
                behind the scenes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 md:col-span-2 relative overflow-hidden reveal active delay-200">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center h-full">
                <div className="flex-1 z-10">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20">
                    <span
                      className="iconify text-purple-400"
                      data-icon="lucide:sparkles"
                      data-width="24"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Multi-Agent Collaboration</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                    Finance checks affordability, Talent creates hiring plans, Growth evaluates
                    launch impact — all coordinated by the CEO Planner.
                  </p>
                </div>
                {/* Micro visual */}
                <div className="flex-1 w-full bg-[#0A0A0C] border border-white/5 rounded-lg p-4 shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-500">
                  <div className="flex gap-2 items-center mb-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] text-purple-300">Agents Executing</span>
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
                <span
                  className="iconify text-blue-400"
                  data-icon="lucide:bar-chart-3"
                  data-width="24"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Startup Health Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track finance, hiring, growth, and operations health scores updated after every
                major decision.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 reveal active delay-200">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 border border-emerald-500/20">
                <span
                  className="iconify text-emerald-400"
                  data-icon="lucide:messages-square"
                  data-width="24"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Knowledge Engine (RAG)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload pitch decks, financials, and roadmaps. AI grounds every decision in your
                startup&apos;s actual context.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 glass-panel rounded-2xl hover:bg-white/[0.05] transition-all duration-300 reveal active delay-300">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 border border-orange-500/20">
                <span
                  className="iconify text-orange-400"
                  data-icon="lucide:puzzle"
                  data-width="24"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Approval &amp; Memory</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                High-risk actions require your approval. Every decision is logged in Startup Memory
                for full transparency.
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
              Watch AI Orchestrate Your Startup
            </h2>
            <p className="text-slate-400 text-lg">
              Hover over the task list to see how the CEO Planner analyzes complexity and suggests
              the optimal path forward.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <span
                  className="iconify text-emerald-400"
                  data-icon="lucide:check-circle-2"
                  data-width="18"
                />
                Real-time complexity analysis
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <span
                  className="iconify text-emerald-400"
                  data-icon="lucide:check-circle-2"
                  data-width="18"
                />
                Automated resource allocation
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <span
                  className="iconify text-emerald-400"
                  data-icon="lucide:check-circle-2"
                  data-width="18"
                />
                Multi-agent coordination
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
                        <span
                          className="iconify opacity-0 group-hover:opacity-100 text-indigo-400"
                          data-icon="lucide:check"
                          data-width="10"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-200 font-medium">Hire Backend Engineers</p>
                        <p className="text-xs text-slate-500 mt-1">Talent • Due Today</p>
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
                        <span className="iconify" data-icon="lucide:bot" data-width="12" />
                        CEO Planner:
                      </span>
                      <span className="text-slate-400">
                        Finance checked runway. Budget for 2 engineers approved. Talent drafting JD.
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
          Loved by founders worldwide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-100">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="iconify" data-icon="lucide:star" data-width="14" />
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &ldquo;FounderHQ totally changed how we run our startup. The CEO Planner orchestrates
              everything — finance, hiring, growth — feels like having a full executive team.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700" />
              <div>
                <p className="text-xs font-medium text-white">Alex Chen</p>
                <p className="text-[10px] text-slate-500">Founder, DevScale</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-200">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="iconify" data-icon="lucide:star" data-width="14" />
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &ldquo;The interface is stunning, but the multi-agent AI is where the magic happens.
              It feels like having a project manager who never sleeps.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700" />
              <div>
                <p className="text-xs font-medium text-white">Sarah Miller</p>
                <p className="text-[10px] text-slate-500">Product Lead, Streamline</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors reveal active delay-300">
            <div className="flex gap-1 mb-4 text-indigo-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="iconify" data-icon="lucide:star" data-width="14" />
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              &ldquo;We&apos;ve tried every tool out there. Nothing integrates this smoothly with
              our existing stack while adding actual intelligence.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700" />
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
              <p className="text-sm text-slate-500 mb-6">For solo founders</p>
              <div className="text-3xl font-medium text-white mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  1 Workspace
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  Basic AI suggestions
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
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
              <p className="text-sm text-slate-500 mb-6">For growing startups</p>
              <div className="text-3xl font-medium text-white mb-6">
                $12<span className="text-sm text-slate-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span
                    className="iconify text-indigo-400"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  Unlimited Workspaces
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span
                    className="iconify text-indigo-400"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  Full AI Executive Team
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span
                    className="iconify text-indigo-400"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  RAG &amp; Integrations
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
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  SSO &amp; Security
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  Dedicated Success Manager
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span
                    className="iconify text-slate-600"
                    data-icon="lucide:check"
                    data-width="14"
                  />{' '}
                  Custom AI Agents
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
            Ready to run your startup with AI?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join the waitlist today and get early access to the AI Operating System for startups.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/dashboard');
            }}
            className="max-w-md mx-auto relative flex items-center"
          >
            <span
              className="iconify absolute left-4 text-slate-500"
              data-icon="lucide:mail"
              data-width="16"
            />
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
                  FHQ
                </div>
                <span className="text-white font-medium tracking-tight">FOUNDERHQ</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                AI Operating System for Startups. Built for the future of founding.
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
            <p className="text-slate-600 text-xs">© 2026 FounderHQ. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <span className="iconify" data-icon="lucide:twitter" data-width="16" />
              </a>
              <a
                href="https://github.com/sathwikgampa/FounderHq"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <span className="iconify" data-icon="lucide:github" data-width="16" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <span className="iconify" data-icon="lucide:linkedin" data-width="16" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatbot />
    </div>
  );
}
