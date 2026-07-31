'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StepVisionProps {
  data: { name: string; tagline: string };
  updateData: (data: Partial<{ name: string; tagline: string }>) => void;
  onNext: () => void;
}

export function StepVision({ data, updateData, onNext }: StepVisionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 text-indigo-400">
          <Sparkles size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">The Vision</h2>
        <p className="text-slate-400 text-sm">
          Let&apos;s start with the foundation of your startup.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Startup Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Tagline / Mission</label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => updateData({ tagline: e.target.value })}
            placeholder="e.g. We build the future of X"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!data.name.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 group"
      >
        Continue
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
