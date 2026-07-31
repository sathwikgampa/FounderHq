'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CircleDollarSign,
  Users,
  TrendingUp,
  Scale,
  Handshake,
  Grip,
  ChevronRight,
  Lock,
} from 'lucide-react';

const agents = [
  {
    name: 'Finance',
    desc: 'Runway, budgeting, and financial reports',
    icon: CircleDollarSign,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    borderHover: 'hover:border-blue-500/50',
    path: '/agents/finance',
    active: true,
  },
  {
    name: 'HR',
    desc: 'Hiring, onboarding, and team management',
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    borderHover: 'hover:border-purple-500/50',
    path: '/agents/hr',
    active: true,
  },
  {
    name: 'Growth',
    desc: 'Marketing, campaigns, and customer acquisition',
    icon: TrendingUp,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    borderHover: 'hover:border-green-500/50',
    path: '/agents/growth',
    active: true,
  },
  {
    name: 'Legal',
    desc: 'Contracts, compliance, and policy generation',
    icon: Scale,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    borderHover: 'hover:border-orange-500/50',
    path: '/agents/legal',
    active: false,
  },
  {
    name: 'Sales',
    desc: 'Pipeline, deals, and revenue tracking',
    icon: Handshake,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    borderHover: 'hover:border-pink-500/50',
    path: '/agents/sales',
    active: false,
  },
  {
    name: 'Other',
    desc: 'Custom workflows and miscellaneous tasks',
    icon: Grip,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    borderHover: 'hover:border-gray-500/50',
    path: '/agents/other',
    active: false,
  },
];

export function AgentsGrid() {
  const router = useRouter();

  const handleAgentClick = (agent: (typeof agents)[0]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(agent.path as any);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {agents.map((agent, i) => {
        const Icon = agent.icon;

        return (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => handleAgentClick(agent)}
            className={`glass-card p-6 flex flex-col justify-between h-48 cursor-pointer relative transition-all group ${agent.borderHover} ${agent.active ? 'opacity-100 shadow-sm hover:shadow-md' : 'opacity-60 hover:opacity-100 bg-muted/30'}`}
          >
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center`}>
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
        );
      })}
    </div>
  );
}
