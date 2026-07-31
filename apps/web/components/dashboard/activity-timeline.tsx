'use client';

import React from 'react';
import { GitCommit, FileCheck, Users, CircleDollarSign } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';

const ACTIVITIES = [
  { id: '1', title: 'Fundraising SAFE Term Sheet Updated', time: '10 min ago', agent: 'Investment Agent', type: 'finance', icon: CircleDollarSign, color: 'text-amber-400' },
  { id: '2', title: 'Senior AI Engineer Candidate Screened (96% Match)', time: '45 min ago', agent: 'Talent Agent', type: 'hiring', icon: Users, color: 'text-purple-400' },
  { id: '3', title: 'Delaware C-Corp Franchise Tax Verified', time: '2 hours ago', agent: 'Legal Agent', type: 'legal', icon: FileCheck, color: 'text-blue-400' },
  { id: '4', title: 'WebGL Shader Canvas Deployed to Production', time: '4 hours ago', agent: 'CTO Tech Agent', type: 'code', icon: GitCommit, color: 'text-emerald-400' },
];

export function ActivityTimeline() {
  return (
    <GlowCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <GitCommit size={18} className="text-[#7C5CFF]" />
          Startup Activity Feed
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
          Live Real-time Log
        </span>
      </div>

      <div className="relative pl-4 space-y-4 border-l border-white/10">
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative flex items-start gap-3 text-xs">
              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#0E1014] border border-white/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF]" />
              </span>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{act.title}</h4>
                  <span className="text-[10px] text-slate-500">{act.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className={`flex items-center gap-1 font-medium ${act.color}`}>
                    <Icon size={12} /> {act.agent}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}
