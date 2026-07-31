'use client';

import React from 'react';
import { Building2, Sparkles, Plus, Settings } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function WorkspacePage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] text-xs font-semibold mb-3">
            <Building2 size={14} />
            Startup Workspace
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Acme Inc. Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Manage team members, permissions, environment configs, and AI tokens.</p>
        </div>

        <button
          onClick={() => toast.success('New Team Member invite sent!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6b49f3] text-white text-xs font-semibold transition-all shadow-lg shadow-[#7C5CFF]/20"
        >
          <Plus size={16} />
          Invite Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Workspace Environment</h3>
          <p className="text-xs text-slate-400 mb-4">Production Environment Active</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Active & Healthy</span>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">AI Memory Limit</h3>
          <p className="text-xs text-slate-400 mb-4">Startup Memory Vector Database</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">4.2 GB / 50 GB Used</span>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Connected Services</h3>
          <p className="text-xs text-slate-400 mb-4">Google ADK, Firebase, Stripe, GitHub</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">4 Integrations Live</span>
        </GlowCard>
      </div>
    </div>
  );
}
