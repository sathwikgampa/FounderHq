'use client';

import { motion } from 'framer-motion';
import { Calendar, FileText, Mail, Share2, Video, ArrowRight } from 'lucide-react';

const items = [
  {
    month: 'Aug',
    day: '3',
    weekday: 'Mon',
    title: 'How AI copilots change the founder workflow',
    type: 'Blog',
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    channel: 'Company Blog',
  },
  {
    month: 'Aug',
    day: '5',
    weekday: 'Wed',
    title: 'Weekly Digest #43 — Metrics that matter',
    type: 'Newsletter',
    icon: Mail,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    channel: 'Email',
  },
  {
    month: 'Aug',
    day: '7',
    weekday: 'Fri',
    title: "Customer story: Acme's 40% MRR jump",
    type: 'Social',
    icon: Share2,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    channel: 'X',
  },
  {
    month: 'Aug',
    day: '10',
    weekday: 'Mon',
    title: 'Product walkthrough: Budgeting 101',
    type: 'Video',
    icon: Video,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    channel: 'YouTube',
  },
  {
    month: 'Aug',
    day: '12',
    weekday: 'Wed',
    title: 'Q3 Platform Update — recap & next steps',
    type: 'Newsletter',
    icon: Mail,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    channel: 'Email',
  },
];

export function ContentCalendar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card flex flex-col h-96 overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 pb-5 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-lg text-white flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          Content Calendar
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {items.length} upcoming
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto flex flex-col">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-[var(--glass-bg)] transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center w-10 shrink-0 rounded-lg border border-[var(--glass-border)] py-1.5 group-hover:border-primary/40 transition-colors">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  {item.month}
                </span>
                <span className="text-base font-bold text-white leading-tight">{item.day}</span>
              </div>

              <div
                className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={16} className={item.color} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-white transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.weekday}, {item.month} {item.day}
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-muted-foreground hidden sm:inline-block shrink-0">
                {item.channel}
              </span>

              <ArrowRight
                size={16}
                className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
              />
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[var(--glass-border)] text-center">
        <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          View Full Calendar
        </button>
      </div>
    </motion.div>
  );
}
