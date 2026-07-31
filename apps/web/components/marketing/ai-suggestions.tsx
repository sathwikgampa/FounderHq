'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

export function AiSuggestions() {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      text: "Double ad spend on 'UX Tips' LinkedIn series.",
      reason: 'Based on: high CTR + $48 CAC outperforming all other channels.',
      confidence: '94%',
    },
    {
      id: 2,
      text: "Pause 'Webinar' search campaign.",
      reason: 'Based on: conversion rate dropped below 0.5% over the last 72 hours.',
      confidence: '87%',
    },
    {
      id: 3,
      text: 'Draft follow-up email sequence for Summer Promo.',
      reason: 'Based on: 215 abandoned carts matching this campaign segment.',
      confidence: '79%',
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (id: number, action: 'approve' | 'dismiss') => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));

    if (action === 'approve') {
      setToastMessage('Campaign drafted & passed to approval queue.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card flex flex-col h-full relative overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-lg text-white flex items-center gap-2">
          <Sparkles size={18} className="text-primary" /> AI Campaign Suggestions
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-muted-foreground">
          {suggestions.length} pending
        </span>
      </div>

      <div className="flex-1 p-4 relative">
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-4">
                <Check className="text-emerald-400" size={24} />
              </div>
              <p className="text-sm text-muted-foreground">
                All suggestions reviewed. Your marketing strategy is fully optimized!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-white leading-relaxed">{s.text}</p>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                      {s.confidence} match
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground/80">{s.reason}</p>

                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--glass-border)]">
                    <button
                      onClick={() => handleAction(s.id, 'approve')}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(s.id, 'dismiss')}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-muted-foreground hover:text-white transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--glass-border)] shadow-xl px-4 py-3 rounded-xl flex items-center gap-3 z-10 w-[90%]"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check size={16} />
            </div>
            <p className="text-sm text-white font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
