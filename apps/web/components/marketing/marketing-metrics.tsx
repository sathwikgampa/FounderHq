'use client';

import { motion } from 'framer-motion';
import { Megaphone, DollarSign, Target, TrendingUp } from 'lucide-react';

export function MarketingMetrics() {
  const metrics = [
    {
      label: 'Active Campaigns',
      value: '8',
      change: '+2',
      icon: Megaphone,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      isCost: false,
    },
    {
      label: 'Total Spend (This Month)',
      value: '$12,450',
      change: '-4%',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      isCost: true,
    },
    {
      label: 'Avg. CAC',
      value: '$48.50',
      change: '-8%',
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      isCost: true,
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: '+0.4%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      isCost: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        const isBetter = m.isCost ? m.change.startsWith('-') : !m.change.startsWith('-');

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
            className="glass-card p-5 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                <Icon size={18} className={m.color} />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">{m.value}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isBetter
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {m.change}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
