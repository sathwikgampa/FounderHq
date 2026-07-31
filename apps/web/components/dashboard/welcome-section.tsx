'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export function WelcomeSection() {
  return (
    <div className="flex flex-col gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Let&apos;s set up your startup and build something amazing.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full px-5 py-2 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Health Score
            </span>
            <span className="text-xl font-bold text-primary">
              92<span className="text-sm text-muted-foreground">/100</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(212,162,78,0.4)]" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-primary"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <FileText className="text-primary" size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white mb-1">Today&apos;s Briefing</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Your startup is growing steadily. Burn rate is healthy with{' '}
            <span className="text-white font-medium">18.4 months</span> runway. Two important tasks
            require attention today regarding investor follow-ups and cloud infrastructure costs.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
