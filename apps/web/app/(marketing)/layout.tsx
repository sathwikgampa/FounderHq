'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowUpRight, Activity } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loginAsDemo, isAuthenticated, user } = useAuth();

  const handleDemoClick = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-400 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                FounderHQ{' '}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  OS
                </span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-neutral-300">
            <a href="#features" className="hover:text-white transition-colors">
              Platform Features
            </a>
            <a href="#simulator" className="hover:text-white transition-colors">
              Jarvis Simulator
            </a>
            <a href="#agents" className="hover:text-white transition-colors">
              Executive Agents
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-neutral-950 hover:bg-neutral-200 font-semibold rounded-full px-5 py-1.5 text-xs shadow-md"
              >
                Go to Dashboard ({user?.displayName || 'Founder'})
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleDemoClick}
                  className="inline-flex items-center gap-2 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold rounded-full px-5 py-2 text-xs transition-all shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                  <span>Launch Demo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-16 px-6 relative z-10 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4 pb-12 border-b border-white/10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                F
              </div>
              <span className="text-sm font-bold text-white tracking-tight">FounderHQ OS</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              The AI Operating System for Startups. Orchestrating executive AI agents under a
              unified CEO Planner.
            </p>
            <div className="fluxora-pill bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Product
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">
                  Jarvis CEO Planner
                </a>
              </li>
              <li>
                <a href="#agents" className="hover:text-white transition-colors">
                  Executive Sub-Systems
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Startup Memory & RAG
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing & Plans
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Architecture
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Google ADK Backend <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  FastAPI Clean Architecture <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Next.js 15 & React 19 <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Firebase Multi-Tenancy <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Repository & Docs
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq/tree/main/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  System Documentation <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sathwikgampa/FounderHq/blob/main/docs/01_PROJECT_BRIEF.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Project Brief <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px]">
          <p>
            © {new Date().getFullYear()} FounderHQ Inc. All rights reserved. Built with Fluxora
            Design System.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Specification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
