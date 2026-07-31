'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';

export function GrowthFunnel() {
  const funnelStages = [
    { label: 'Site Visitors', value: '48,205', percent: 100, dropoff: '12% conversion' },
    { label: 'Signups', value: '5,780', percent: 45, dropoff: '42% activated' },
    { label: 'Activated', value: '2,427', percent: 25, dropoff: '68% upgrade' },
    { label: 'Paying Customers', value: '1,650', percent: 15, dropoff: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6 mb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-semibold text-lg text-white">Growth Funnel (Trailing 30d)</h3>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0 justify-between items-start md:items-stretch py-4">
        {funnelStages.map((stage, i) => (
          <div
            key={i}
            className="flex-1 w-full flex flex-row md:flex-col items-center md:items-start group relative"
          >
            {/* Mobile layout: stack horizontally. Desktop: Column */}
            <div className="w-32 md:w-full shrink-0 md:pr-4 z-10 z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                {stage.label}
              </span>
              <span className="text-2xl font-bold text-white block">{stage.value}</span>
            </div>

            {/* Horizontal Bar (Desktop) */}
            <div className="hidden md:flex flex-col justify-end h-32 w-full pr-4 mt-6 relative">
              <div className="w-full h-8 bg-[var(--glass-bg)] rounded-sm relative overflow-hidden group-hover:bg-white/5 transition-colors">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.percent}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="absolute left-0 top-0 bottom-0 bg-primary opacity-80 rounded-sm"
                />
              </div>

              {stage.dropoff && (
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center">
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full p-2 text-muted-foreground mb-1">
                    <ArrowDownRight size={14} />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                    {stage.dropoff}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-bar Dropoff (Mobile) */}
            {stage.dropoff && (
              <div className="md:hidden ml-4 pl-4 border-l border-[var(--glass-border)] flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowDownRight size={14} className="text-primary" />
                {stage.dropoff}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
