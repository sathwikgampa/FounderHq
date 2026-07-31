'use client';

import React from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function MemoryPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Database size={14} />
            Startup Memory Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Startup Vector Knowledge Base
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Context stored by CEO Planner across all past decisions, pitch decks, and financial
            models.
          </p>
        </div>

        <button
          onClick={() => toast.success('Startup Memory re-indexed with latest documents!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-lg shadow-cyan-500/20"
        >
          <RefreshCw size={14} />
          Re-Index Memory Context
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Indexed Context Chunks</h3>
          <p className="text-xs text-slate-400">
            1,280 indexed RAG vector nodes from pitch decks, NDAs, and financial reports.
          </p>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Executive Memory Sync</h3>
          <p className="text-xs text-slate-400">
            10 AI Executive Agents synced with latest founder preferences.
          </p>
        </GlowCard>
      </div>
    </div>
  );
}
