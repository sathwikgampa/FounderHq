'use client';

import React, { useState } from 'react';
import { Sparkles, Mic, Paperclip, Send, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const PROMPT_CHIPS = [
  'Analyze runway & burn',
  'Build MVP roadmap',
  'Generate pitch deck',
  'Review SAFE contracts',
  'Draft senior AI engineer job description',
  'Calculate customer LTV/CAC',
];

export function AiCopilot() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`CEO Planner processed: "${query}"`, { icon: '✨' });
      setQuery('');
    }, 1200);
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
  };

  return (
    <div id="copilot" className="w-full my-8">
      <div className="relative max-w-4xl mx-auto">
        {/* Glow halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7C5CFF]/30 via-indigo-500/20 to-purple-500/30 rounded-[32px] blur-xl opacity-60 pointer-events-none" />

        <form
          onSubmit={handleSubmit}
          className="relative bg-[#0E1014]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-4 shadow-2xl space-y-3"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[#7C5CFF] shrink-0">
              <Sparkles size={16} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask FounderHQ anything... (e.g. /runway, /mvp, /hiring)"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info('Voice command active. Listening...')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Voice Command"
              >
                <Mic size={16} />
              </button>

              <button
                type="button"
                onClick={() => toast.info('Document attachment scanner ready')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Attach file / pitch deck"
              >
                <Paperclip size={16} />
              </button>

              <button
                type="submit"
                disabled={isProcessing || !query.trim()}
                className="p-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6b49f3] text-white disabled:opacity-40 transition-all shadow-md shadow-[#7C5CFF]/30"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-2 border-t border-white/[0.06] text-xs">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Terminal size={10} /> Suggestions:
            </span>
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-slate-300 hover:text-white hover:bg-white/10 hover:border-[#7C5CFF]/40 transition-all shrink-0 text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
