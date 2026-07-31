'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

const INSIGHTS = [
  {
    id: '1',
    title: 'Cloud Infrastructure Reserved Node Savings',
    category: 'Finance Optimization',
    priority: 'HIGH',
    confidence: '98%',
    description: 'Switching GPU compute nodes to 1-year reserved instances will cut burn rate by $1,800/mo.',
    action: 'Apply Reserved Contract',
  },
  {
    id: '2',
    title: 'Customer Churn Risk Alert',
    category: 'Sales & Growth',
    priority: 'CRITICAL',
    confidence: '92%',
    description: 'Enterprise Client "Acme Bio" has not logged in for 14 days. Recommend CEO check-in call.',
    action: 'Schedule Founder Check-in',
  },
];

export function AiInsightsPanel() {
  return (
    <GlowCard glowColor="rgba(124, 92, 255, 0.2)" className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles size={18} className="text-[#7C5CFF]" />
          CEO Planner Executive Insights
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C5CFF]/20 text-[#7C5CFF] font-semibold border border-[#7C5CFF]/30">
          2 AI Insights
        </span>
      </div>

      <div className="space-y-3">
        {INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 hover:border-white/15 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">{item.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                  item.priority === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {item.priority}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-slate-400">Confidence: <strong className="text-emerald-400">{item.confidence}</strong></span>
              <button
                onClick={() => toast.success(`Executed: ${item.action}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6b49f3] text-white text-xs font-semibold transition-all shadow-md shadow-[#7C5CFF]/20"
              >
                <span>{item.action}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
