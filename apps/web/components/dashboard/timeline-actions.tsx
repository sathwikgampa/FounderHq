'use client';

import { motion } from 'framer-motion';
import { Plus, Bot, FileSignature, Share2, ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export function TimelineActions() {
  const actions = [
    { label: 'Create Task', icon: Plus, highlight: true },
    { label: 'Ask Assistant', icon: Bot },
    { label: 'Hire Employee', icon: Share2 },
    { label: 'Generate Investor Report', icon: FileSignature },
    { label: 'Create Campaign', icon: ClipboardList },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
      {/* Task Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="lg:col-span-2 px-2"
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--glass-border)]">
          <h3 className="font-semibold text-xl text-white">Task Timeline</h3>
          <div className="flex gap-2">
            <button className="text-xs px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-sm">
              All
            </button>
            <button className="text-xs px-4 py-1.5 rounded-full text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-white transition-colors">
              Today
            </button>
            <button className="text-xs px-4 py-1.5 rounded-full text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-white transition-colors">
              Upcoming
            </button>
          </div>
        </div>

        <div className="relative border-l-2 border-[var(--glass-border)] ml-4 space-y-10">
          <div className="relative pl-8">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0 shadow-[0_0_10px_rgba(239,68,68,0.3)] border-4 border-background"></div>
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium text-lg">Finalize Term Sheet</h4>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 flex items-center gap-1">
                <Clock size={12} /> Due Today
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-lg">
              Review legal obligations with external counsel. Ensure IP assignment clauses are
              clearly defined.
            </p>
          </div>

          <div className="relative pl-8">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0 shadow-[0_0_10px_rgba(212,162,78,0.3)] border-4 border-background"></div>
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium text-lg">Interview VP of Engineering</h4>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--glass-bg)] text-primary flex items-center gap-1">
                <Clock size={12} /> Tomorrow, 10:00 AM
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-lg">
              Discuss architectural roadmap and team scaling strategies. Focus on past experience
              with microservices.
            </p>
          </div>

          <div className="relative pl-8">
            <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-0 border-4 border-background opacity-50"></div>
            <div className="flex flex-row items-center gap-3 opacity-40 hover:opacity-75 transition-opacity">
              <h4 className="text-white font-medium text-lg line-through">
                Approve Marketing Copy
              </h4>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Completed
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="px-2"
      >
        <h3 className="font-semibold text-xl text-white mb-8 pb-4 border-b border-[var(--glass-border)]">
          Quick Actions
        </h3>
        <div className="flex flex-col gap-4">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                className={`flex items-center gap-4 py-3.5 px-5 btn-rounded transition-all text-sm font-medium ${
                  action.highlight
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                    : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-muted-foreground hover:text-white hover:border-white/20 shadow-sm'
                }`}
              >
                <Icon
                  size={18}
                  className={action.highlight ? 'text-primary-foreground' : 'text-primary'}
                />
                {action.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
