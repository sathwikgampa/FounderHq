'use client';

import { motion } from 'framer-motion';
import { Mail, Share2, MousePointerClick, ArrowRight } from 'lucide-react';

export function ActiveCampaigns() {
  const campaigns = [
    {
      name: 'Q3 Founder SaaS Launch',
      channel: 'Paid Ads',
      icon: MousePointerClick,
      status: 'Live',
      spend: '$4,200',
      result: '342 clicks',
    },
    {
      name: 'Newsletter Update #42',
      channel: 'Email',
      icon: Mail,
      status: 'Scheduled',
      spend: '$0',
      result: 'Sending Tom.',
    },
    {
      name: 'LinkedIn Series: UX Tips',
      channel: 'Social',
      icon: Share2,
      status: 'Live',
      spend: '$850',
      result: '12k impressions',
    },
    {
      name: 'Webinar Retargeting',
      channel: 'Paid Ads',
      icon: MousePointerClick,
      status: 'Draft',
      spend: '-',
      result: '-',
    },
    {
      name: 'Summer Promo Code',
      channel: 'Email',
      icon: Mail,
      status: 'Ended',
      spend: '$150',
      result: '28 conversions',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Scheduled':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Draft':
        return 'bg-[var(--glass-bg)] text-muted-foreground border-[var(--glass-border)]';
      case 'Ended':
        return 'bg-black/20 text-muted-foreground/60 border-transparent';
      default:
        return 'bg-[var(--glass-bg)] text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card flex flex-col h-full"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-lg text-white">Active Campaigns</h3>
        <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
          + New Campaign
        </button>
      </div>

      <div className="flex-1 p-2">
        {campaigns.map((camp, i) => {
          const Icon = camp.icon;
          return (
            <div
              key={i}
              className="group flex items-center justify-between p-4 hover:bg-[var(--glass-bg)] rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                  <Icon
                    size={18}
                    className="text-muted-foreground group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                    {camp.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{camp.channel}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyle(camp.status)}`}
                    >
                      {camp.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="hidden sm:block">
                  <div className="text-xs text-muted-foreground mb-1">Spend</div>
                  <div className="text-sm font-medium text-white">{camp.spend}</div>
                </div>
                <div className="hidden sm:block min-w-24">
                  <div className="text-xs text-muted-foreground mb-1">Result</div>
                  <div className="text-sm font-medium text-white">{camp.result}</div>
                </div>
                <button className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
