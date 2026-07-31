'use client';

import React from 'react';
import { Layers, CheckCircle2, Plug } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

const INTEGRATIONS = [
  { name: 'Google ADK', status: 'Connected', desc: 'Multi-agent orchestration and Gemini AI models' },
  { name: 'Firebase & Supabase', status: 'Connected', desc: 'Authentication, Firestore DB, & Storage' },
  { name: 'Stripe Corporate', status: 'Connected', desc: 'Financial balance, burn metrics, & payouts' },
  { name: 'GitHub Monorepo', status: 'Connected', desc: 'CI/CD pipeline, PR reviews, & activity stream' },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Layers size={14} />
            Ecosystem Integrations
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Connected Ecosystem</h1>
          <p className="text-slate-400 text-sm mt-1">API connections powering CEO Planner and 10 executive agents.</p>
        </div>

        <button
          onClick={() => toast.success('New API Key generated for Google ADK!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plug size={16} />
          Add New Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INTEGRATIONS.map((item) => (
          <GlowCard key={item.name}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 size={12} /> {item.status}
              </span>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
