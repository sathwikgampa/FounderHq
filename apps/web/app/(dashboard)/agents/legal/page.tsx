'use client';

import React, { useState } from 'react';
import { Scale, AlertOctagon, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function LegalPage() {
  const [ndaParty, setNdaParty] = useState('');

  const handleGenerateNDA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaParty.trim()) return;
    toast.success(`Standard Mutual NDA generated for ${ndaParty}! Download ready.`, { icon: '⚖️' });
    setNdaParty('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Scale size={14} />
            Legal & Compliance Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Legal & Governance</h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated contract review, mutual NDAs, and corporate compliance audit.
          </p>
        </div>

        <button
          onClick={() => {
            toast.info('Legal Agent scanning all uploaded corporate documents...');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-500/20 self-start md:self-auto"
        >
          <Sparkles size={14} />
          Scan Compliance Status
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlowCard glowColor="rgba(59, 130, 246, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Incorporation</div>
          <div className="text-2xl font-extrabold text-white">Delaware C-Corp</div>
          <div className="text-xs text-blue-300 mt-2">Good Standing (83b Filed)</div>
        </GlowCard>

        <GlowCard glowColor="rgba(16, 185, 129, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Contracts Reviewed</div>
          <div className="text-2xl font-extrabold text-white">14 Contracts</div>
          <div className="text-xs text-emerald-300 mt-2">0 High Risk Clauses</div>
        </GlowCard>

        <GlowCard glowColor="rgba(245, 158, 11, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">Active NDAs</div>
          <div className="text-2xl font-extrabold text-white">8 Executed</div>
          <div className="text-xs text-amber-300 mt-2">All stored in Startup Memory</div>
        </GlowCard>

        <GlowCard glowColor="rgba(99, 102, 241, 0.15)">
          <div className="text-xs text-slate-400 font-medium mb-2">IP Protection</div>
          <div className="text-2xl font-extrabold text-white">100% Assigned</div>
          <div className="text-xs text-indigo-300 mt-2">Proprietary IP Assignment signed</div>
        </GlowCard>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Compliance Checklist & Contract Audits */}
        <div className="lg:col-span-2 space-y-6">
          <GlowCard>
            <h3 className="text-base font-bold text-white mb-4">Corporate Compliance Checklist</h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Delaware Annual Franchise Tax',
                  status: 'Completed',
                  date: 'March 2026',
                  icon: CheckCircle2,
                  color: 'text-emerald-400',
                },
                {
                  title: '83(b) Election Filings for Founders',
                  status: 'Verified',
                  date: 'IRS Stamp Confirmed',
                  icon: CheckCircle2,
                  color: 'text-emerald-400',
                },
                {
                  title: 'Employee IP Assignment Agreements',
                  status: 'Active (4/4 signed)',
                  date: 'Updated',
                  icon: CheckCircle2,
                  color: 'text-emerald-400',
                },
                {
                  title: 'GDPR / CCPA Privacy Policy Audit',
                  status: 'In Review',
                  date: 'Pending Legal Agent Check',
                  icon: AlertOctagon,
                  color: 'text-amber-400',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={item.color} size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </div>

        {/* Right 1 Col: Quick NDA Generator */}
        <div>
          <GlowCard glowColor="rgba(59, 130, 246, 0.2)">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Sparkles size={18} />
              <h3 className="text-base font-bold text-white">Instant NDA Generator</h3>
            </div>
            <form onSubmit={handleGenerateNDA} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Counterparty Name / Company
                </label>
                <input
                  type="text"
                  required
                  value={ndaParty}
                  onChange={(e) => setNdaParty(e.target.value)}
                  placeholder="e.g. Sequoia Capital or Acme Corp"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                <Download size={14} />
                Generate Standard Mutual NDA
              </button>
            </form>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
