'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  Activity,
  Calendar,
  PiggyBank,
  Briefcase,
} from 'lucide-react';

export function InsightsInbox() {
  const insights = [
    { title: 'Reduce cloud spending by 12%', type: 'finance' },
    { title: 'Follow up with Investor Alpha Ventures', type: 'growth' },
    { title: 'Hire one Backend Engineer', type: 'hiring' },
    { title: 'Launch Product Hunt campaign next week', type: 'marketing' },
  ];

  const inbox = [
    {
      title: 'Investor meeting scheduled for tomorrow',
      icon: Calendar,
      color: 'text-blue-400',
      time: '2h ago',
    },
    {
      title: 'Quarterly GST filing is due in 3 days',
      icon: Activity,
      color: 'text-orange-400',
      time: '5h ago',
    },
    {
      title: 'Monthly payroll pending approval',
      icon: PiggyBank,
      color: 'text-emerald-400',
      time: '1d ago',
    },
    {
      title: 'New Senior Engineer candidate applied',
      icon: Briefcase,
      color: 'text-purple-400',
      time: '1d ago',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card flex flex-col h-full"
      >
        <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            AI Insights
          </h3>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        <div className="p-3 flex-1 flex flex-col gap-2">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--glass-bg)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {insight.title}
                </span>
              </div>
              <ArrowRight
                size={14}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Executive Inbox */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card flex flex-col h-full"
      >
        <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-400" />
            Executive Inbox
          </h3>
          <button className="text-xs text-blue-400 hover:text-blue-400/80 transition-colors flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">
              3
            </span>
            Unread
          </button>
        </div>
        <div className="p-2 flex-1 flex flex-col divide-y divide-[var(--glass-border)]">
          {inbox.map((msg, i) => {
            const Icon = msg.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-3 hover:bg-[var(--glass-bg)] transition-colors group cursor-pointer first:rounded-t-lg last:rounded-b-lg"
              >
                <div className={`mt-0.5 shrink-0 ${msg.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate group-hover:text-white transition-colors">
                    {msg.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
