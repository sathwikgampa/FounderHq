'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Plus, Search } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

const CANDIDATES = [
  { id: '1', name: 'Marcus Vance', role: 'Senior AI Systems Engineer', stage: 'Technical Interview', match: 96, status: 'Top Pick' },
  { id: '2', name: 'Elena Rostova', role: 'Full Stack Tech Lead', stage: 'Founder Final', match: 92, status: 'Offer Ready' },
  { id: '3', name: 'David Kim', role: 'Growth Marketing Lead', stage: 'Resume Screened', match: 88, status: 'In Review' },
  { id: '4', name: 'Sophia Chen', role: 'Product Designer', stage: 'Design Challenge', match: 94, status: 'Interviewing' },
];

export default function HiringPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATES[0] | null>(null);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Users size={14} />
            Talent & HR Agent Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hiring & Talent Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">AI candidate scoring, JD generation, and interview workflows.</p>
        </div>

        <button
          onClick={() => toast.success('Talent Agent generated new Job Description template!', { icon: '📄' })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus size={16} />
          Create New Job Requisition
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">Active Candidates</h3>
          </div>

          <div className="space-y-3">
            {CANDIDATES.map((candidate) => (
              <GlowCard key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="cursor-pointer hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{candidate.name}</h4>
                      <p className="text-xs text-slate-400">{candidate.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 block mb-1">{candidate.stage}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">{candidate.match}% AI Match</span>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        <div>
          <GlowCard glowColor="rgba(168, 85, 247, 0.2)">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Sparkles size={18} />
              <h3 className="text-base font-bold text-white">Talent AI Intelligence</h3>
            </div>
            {selectedCandidate ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between font-bold text-white text-sm">
                    <span>{selectedCandidate.name}</span>
                    <span className="text-purple-400">{selectedCandidate.match}% Score</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">Distributed systems & WebGL specialist. Proceed to offer stage.</p>
                </div>
                <button
                  onClick={() => toast.success(`Drafted offer letter for ${selectedCandidate.name}!`)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg hover:from-purple-500 transition-all"
                >
                  Generate Offer Letter ($165k + 0.5%)
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">Select a candidate to view AI evaluation.</p>
            )}
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
