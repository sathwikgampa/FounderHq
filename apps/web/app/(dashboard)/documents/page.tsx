'use client';

import React from 'react';
import { FileText, Upload, Sparkles } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

export default function DocumentsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <FileText size={14} />
            Document Vault & RAG Scanner
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Documents & Vault</h1>
          <p className="text-slate-400 text-sm mt-1">Upload pitch decks, NDAs, and financials for automated vector indexing.</p>
        </div>

        <button
          onClick={() => toast.success('Document upload scanner initialized!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Upload size={16} />
          Upload New Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Seed_Pitch_Deck_v4.pdf</h3>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Indexed in RAG</span>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">SAFE_Term_Sheet_Index.pdf</h3>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Indexed in RAG</span>
        </GlowCard>

        <GlowCard>
          <h3 className="text-base font-bold text-white mb-2">Delaware_83b_Election.pdf</h3>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Indexed in RAG</span>
        </GlowCard>
      </div>
    </div>
  );
}
