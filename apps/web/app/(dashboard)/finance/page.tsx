'use client';

import React, { useState } from 'react';
import {
  CircleDollarSign,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  Send,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function FinancePage() {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAskCFO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('Finance Agent analyzed your request and updated forecasts!', { icon: '💰' });
      setPrompt('');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CircleDollarSign size={14} />
            Virtual CFO Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Finance & Runway</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time burn rate, cash flow projection, and AI-driven runway optimization.
          </p>
        </div>

        <button
          onClick={() => toast.info('CEO Planner requested a full audit from Finance Agent...')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Sparkles size={14} className="text-indigo-400" />
          Run Financial Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlowCard glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Total Cash Balance</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CircleDollarSign size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$420,000</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            <span>+$35k from Q2 seed grant</span>
          </div>
        </GlowCard>

        <GlowCard glowColor="rgba(239, 68, 68, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Monthly Net Burn</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$28,500</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Payroll: $18k · Server: $6.5k</span>
          </div>
        </GlowCard>

        <GlowCard glowColor="rgba(99, 102, 241, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Estimated Runway</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">14.7 Mo</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-indigo-300">
            <span>Safe zone (&gt; 12 months)</span>
          </div>
        </GlowCard>

        <GlowCard glowColor="rgba(168, 85, 247, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>MRR Growth</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <PieIcon size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$14,200</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-purple-300">
            <span>+18.4% vs last month</span>
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlowCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Cash Flow & Burn Forecast</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  12-month projections calculated by Finance Agent
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                Confidence: 94%
              </span>
            </div>

            <div className="h-48 flex items-end gap-3 pt-6 border-b border-white/5 pb-4">
              {[65, 70, 60, 80, 85, 75, 90, 95, 88, 100, 110, 120].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600/40 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-400"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[10px] text-slate-500">M{idx + 1}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        <div className="space-y-6">
          <GlowCard glowColor="rgba(99, 102, 241, 0.2)">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Sparkles size={18} />
              <h3 className="text-base font-bold text-white">Ask Finance Agent</h3>
            </div>
            <form onSubmit={handleAskCFO} className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Can we afford hiring 2 senior engineers next month?"
                className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span>Analyzing Financial Model...</span>
                ) : (
                  <>
                    <span>Query CFO Agent</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
