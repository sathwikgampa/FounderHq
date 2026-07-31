'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepDomainProps {
  data: { industry: string; targetMarket: string };
  updateData: (data: Partial<{ industry: string; targetMarket: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDUSTRIES = [
  'SaaS / Software',
  'Fintech',
  'E-commerce',
  'Healthcare / BioTech',
  'AI / Machine Learning',
  'Consumer App',
  'Other',
];

const MARKETS = ['B2B Enterprise', 'B2B SMB', 'B2C Consumer', 'B2B2C / Marketplace'];

export function StepDomain({ data, updateData, onNext, onBack }: StepDomainProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20 text-purple-400">
          <Target size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">The Domain</h2>
        <p className="text-slate-400 text-sm">
          Where are you operating and who are you building for?
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Industry</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => updateData({ industry: ind })}
                className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                  data.industry === ind
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Target Market</label>
          <div className="flex flex-wrap gap-2">
            {MARKETS.map((market) => (
              <button
                key={market}
                onClick={() => updateData({ targetMarket: market })}
                className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                  data.targetMarket === market
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {market}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={!data.industry || !data.targetMarket}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          Initialize AI Agents
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
