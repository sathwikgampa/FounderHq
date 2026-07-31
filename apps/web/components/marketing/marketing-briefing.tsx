'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export function MarketingBriefing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-primary mb-12"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <FileText className="text-primary" size={18} />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white mb-1">Marketing Briefing</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Paid social ROAS continues to out-perform targets. A highly engaged segment was identified
          from the recent &apos;Q3 Platform Update&apos; newsletter.{' '}
          <span className="text-white font-medium">Consider re-allocating $1,500</span> from search
          ads to LinkedIn retargeting today.
        </p>
      </div>
    </motion.div>
  );
}
