'use client';

import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { AgentOverviewBanner } from '@/components/agents/agent-overview-banner';
import { toast } from 'sonner';

const INVESTORS = [
  {
    name: 'Founders Fund',
    contact: 'Brian Singerman',
    stage: 'Partner Meeting Scheduled',
    commitment: '$500,000',
    probability: 85,
  },
  {
    name: 'Index Ventures',
    contact: 'Nina Achadjian',
    stage: 'Term Sheet Received',
    commitment: '$1,200,000',
    probability: 95,
  },
  {
    name: 'Accel Partners',
    contact: 'Vas Natarajan',
    stage: 'First Call Done',
    commitment: '$300,000',
    probability: 50,
  },
  {
    name: 'Sequoia Capital',
    contact: 'Alfred Lin',
    stage: 'Data Room Shared',
    commitment: '$750,000',
    probability: 70,
  },
];

export default function InvestorsPage() {
  return (
    <div className="space-y-8 pb-12">
      <AgentOverviewBanner agentId="growth" />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Briefcase size={14} />
            Investment & Fundraising Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Fundraising & Investor CRM
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Cap table management, pitch deck readiness scoring, and data room automation.
          </p>
        </div>

        <button
          onClick={() => {
            toast.success('Pitch Deck analyzed by Investment Agent! Readiness Score: 92/100', {
              icon: '📊',
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-all shadow-lg shadow-amber-500/20 self-start md:self-auto"
        >
          <Sparkles size={14} />
          Evaluate Pitch Deck Readiness
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlowCard glowColor="rgba(245, 158, 11, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Fundraising Target</div>
          <div className="text-3xl font-extrabold text-white">$2,500,000</div>
          <div className="text-xs text-amber-300 mt-2">Seed Round (SAFE $15M Cap)</div>
        </GlowCard>

        <GlowCard glowColor="rgba(16, 185, 129, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Soft Committed</div>
          <div className="text-3xl font-extrabold text-white">$1,700,000</div>
          <div className="text-xs text-emerald-300 mt-2">68% of total round goal</div>
        </GlowCard>

        <GlowCard glowColor="rgba(99, 102, 241, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Active Investor Pipeline</div>
          <div className="text-3xl font-extrabold text-white">12 Funds</div>
          <div className="text-xs text-indigo-300 mt-2">4 Partner Meetings booked</div>
        </GlowCard>

        <GlowCard glowColor="rgba(168, 85, 247, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Data Room Status</div>
          <div className="text-3xl font-extrabold text-white">100% Ready</div>
          <div className="text-xs text-purple-300 mt-2">Financials, Cap Table, IP Vault</div>
        </GlowCard>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Investor Pipeline (CRM)</h3>
        <div className="grid grid-cols-1 gap-3">
          {INVESTORS.map((inv) => (
            <GlowCard key={inv.name} className="hover:bg-white/5 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {inv.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{inv.name}</h4>
                    <p className="text-xs text-slate-400">Partner Contact: {inv.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Stage</span>
                    <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {inv.stage}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Commitment</span>
                    <span className="text-xs font-bold text-amber-400">{inv.commitment}</span>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <span className="text-[11px] text-slate-400 block">Probability</span>
                    <span className="text-xs font-bold text-emerald-400">{inv.probability}%</span>
                  </div>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
}
