'use client';

import { motion } from 'framer-motion';

export function MarketingHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Marketing</h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          3 campaigns live, CAC trending down 8% this month.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full px-4 py-1.5 backdrop-blur-md"
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Marketing Health
          </span>
          <span className="text-lg font-bold text-primary leading-none">
            88<span className="text-xs text-muted-foreground">/100</span>
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(212,162,78,0.4)]" />
        </div>
      </motion.div>
    </div>
  );
}
