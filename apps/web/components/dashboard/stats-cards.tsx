'use client';

import { motion } from 'framer-motion';
import { CircleDollarSign, Activity, Lock, Wallet, Clock } from 'lucide-react';

const stats = [
  {
    title: 'Startup Health',
    value: '--',
    helperText: 'Setup required',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Cash Runway',
    value: '--',
    helperText: 'Setup required',
    icon: Wallet,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Revenue',
    value: '--',
    helperText: 'Setup required',
    icon: CircleDollarSign,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Pending Approvals',
    value: '--',
    helperText: 'Setup required',
    icon: Clock,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => alert(`Connect an integration to view ${stat.title}.`)}
            className="glass-card p-5 flex flex-col justify-between h-32 group cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon size={16} className={stat.color} />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors block mb-1">
                {stat.title}
              </span>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </h3>
                  <span className="text-xs text-muted-foreground">{stat.helperText}</span>
                </div>
                <Lock size={14} className="text-muted-foreground/50" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
