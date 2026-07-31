'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bot,
  Layers,
  CircleDollarSign,
  TrendingUp,
  Scale,
  Handshake,
  ChevronRight,
  Lock,
} from 'lucide-react';

const agents = [
  {
    name: 'CEO Agent',
    desc: 'Root orchestrator, strategy synthesizer, and incubator lead',
    icon: Bot,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    borderHover: 'hover:border-purple-500/50',
    path: '/agents/ceo',
    active: true,
  },
  {
    name: 'Product Agent',
    desc: 'MVP scoping, scope trimming, and 14-day tech stack selection',
    icon: Layers,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    borderHover: 'hover:border-indigo-500/50',
    path: '/agents/product',
    active: true,
  },
  {
    name: 'Growth Agent',
    desc: 'Pre-launch waitlist campaigns, cold outreach, and sales projections',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/50',
    path: '/agents/growth',
    active: true,
  },
  {
    name: 'Finance Agent',
    desc: 'Zero-revenue runway calculation, software budgeting, and burn rate audit',
    icon: CircleDollarSign,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    borderHover: 'hover:border-blue-500/50',
    path: '/agents/finance',
    active: true,
  },
  {
    name: 'Legal & HR Agent',
    desc: 'Founder equity vesting, contract risk audit, NDA, and incorporation',
    icon: Scale,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    borderHover: 'hover:border-amber-500/50',
    path: '/agents/legal',
    active: true,
  },
  {
    name: 'Sales Agent',
    desc: 'B2B lead scoring, volume discount modeling, and pipeline tracking',
    icon: Handshake,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    borderHover: 'hover:border-pink-500/50',
    path: '/agents/sales',
    active: true,
  },
];

export function AgentsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {agents.map((agent, i) => {
        const Icon = agent.icon;

        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Link href={agent.path as any} key={agent.name} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`glass-card p-6 flex flex-col justify-between h-48 relative transition-all ${agent.borderHover} ${agent.active ? 'opacity-100 shadow-sm hover:shadow-md' : 'opacity-60 hover:opacity-100 bg-muted/30'}`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center`}
                >
                  <Icon size={20} className={agent.color} />
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">
                  {agent.name}
                </h3>
                <p className="text-[13px] text-muted-foreground mr-4 leading-relaxed mb-4">
                  {agent.desc}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${agent.active ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {agent.active ? 'Active' : 'Setup Required'}
                    </span>
                  </div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                    {agent.active ? (
                      <ChevronRight size={18} />
                    ) : (
                      <Lock size={16} className="text-muted-foreground/60" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
