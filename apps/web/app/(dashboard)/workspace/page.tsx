'use client';

import React from 'react';
import { Building2, Plus, ShieldCheck, Layers, Cpu } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { useAuth } from '@/providers/auth-provider';
import { useWorkspaceSettings } from '@/hooks/use-workspace-settings';
import { toast } from 'sonner';

export default function WorkspacePage() {
  const { user } = useAuth();
  const { settings } = useWorkspaceSettings(
    user?.email || undefined,
    user?.displayName || undefined,
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#ECECEC] pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-semibold mb-3">
            <Building2 size={14} />
            Live Startup Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {settings.companyName} Workspace
          </h1>
          <p className="text-[#475569] text-xs sm:text-sm mt-1">
            Active Stage: <span className="font-semibold text-[#0F172A]">{settings.stage}</span> ·
            Industry: <span className="font-semibold text-[#0F172A]">{settings.industry}</span>
          </p>
        </div>

        <button
          onClick={() => toast.success('Team Member invitation sent!', { icon: '📩' })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5b52e0] text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus size={16} />
          Invite Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <div className="flex items-center gap-2 mb-2 text-[#6C63FF]">
            <Cpu size={18} />
            <h3 className="text-base font-bold text-[#0F172A]">AI Governance Mode</h3>
          </div>
          <p className="text-xs text-[#475569] mb-4">Configured via System Settings</p>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            {settings.operatingMode} Mode Active
          </span>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-2 mb-2 text-[#6C63FF]">
            <Layers size={18} />
            <h3 className="text-base font-bold text-[#0F172A]">AI Memory & Vector Store</h3>
          </div>
          <p className="text-xs text-[#475569] mb-4">RAG Knowledge Base & Artifact Storage</p>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
            4.2 GB / 50 GB Indexed
          </span>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-2 mb-2 text-[#6C63FF]">
            <ShieldCheck size={18} />
            <h3 className="text-base font-bold text-[#0F172A]">Connected Integrations</h3>
          </div>
          <p className="text-xs text-[#475569] mb-4">Google ADK, Firebase, FastAPI, GitHub</p>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
            4 Integrations Operational
          </span>
        </GlowCard>
      </div>
    </div>
  );
}
