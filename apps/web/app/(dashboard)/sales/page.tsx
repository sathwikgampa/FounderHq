'use client';

import React from 'react';
import { ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function SalesPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
            <ShoppingCart size={14} />
            Sales & Revenue Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales & Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Lead scoring, automated B2B outreach, and customer LTV optimization.</p>
        </div>

        <button
          onClick={() => toast.success('Sales Agent dispatched follow-ups to 4 enterprise leads!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-lg shadow-rose-500/20"
        >
          <Sparkles size={14} />
          Auto-Followup Leads
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Active B2B Pilots</h3>
          <div className="text-2xl font-extrabold text-white">4 Accounts</div>
          <p className="text-xs text-rose-400 mt-2 flex items-center gap-1"><TrendingUp size={14} /> $48,000 ARR Pipeline</p>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Average ACV</h3>
          <div className="text-2xl font-extrabold text-white">$12,000 / yr</div>
          <p className="text-xs text-slate-400 mt-2">Conversion Rate: 34%</p>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Sales Agent Status</h3>
          <div className="text-2xl font-extrabold text-emerald-400">95.2% Win Rate</div>
          <p className="text-xs text-slate-400 mt-2">Active in 12 email threads</p>
        </GlowCard>
      </div>
    </div>
  );
}
