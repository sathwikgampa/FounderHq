'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CircleDollarSign,
  Users,
  TrendingUp,
  Scale,
  Megaphone,
  Activity,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

type Department = {
  name: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  span: string;
  href?: '/marketing';
};

export function DepartmentGrid() {
  const departments: Department[] = [
    {
      name: 'Finance',
      desc: 'Runway, burn rate, accounting',
      icon: CircleDollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      span: 'lg:col-span-2',
    },
    {
      name: 'Growth',
      desc: 'Sales, MRR, retention',
      icon: TrendingUp,
      color: 'text-[#D4A24E]',
      bg: 'bg-[#D4A24E]/10',
      span: 'lg:col-span-1',
    },
    {
      name: 'Hiring',
      desc: 'Active pipelines, candidates',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      span: 'lg:col-span-1',
    },
    {
      name: 'Legal',
      desc: 'Contracts, compliance, IP',
      icon: Scale,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      span: 'lg:col-span-1',
    },
    {
      name: 'Marketing',
      desc: 'Campaigns, brand reach',
      icon: Megaphone,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      span: 'lg:col-span-1',
      href: '/marketing',
    },
    {
      name: 'Operations',
      desc: 'Internal tools, vendors',
      icon: Activity,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      span: 'lg:col-span-2',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-5">Command Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept, i) => {
          const Icon = dept.icon;
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className={`glass-card p-5 group cursor-pointer relative overflow-hidden flex flex-col justify-between ${dept.span}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-white">
                <ArrowUpRight size={18} />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${dept.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon size={24} className={dept.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-white transition-colors">
                      {dept.name}
                    </h3>
                    {/* Mini Sparkline SVG */}
                    <svg width="40" height="15" viewBox="0 0 40 15" className="opacity-50">
                      <path
                        d={`M0,10 L5,12 L10,8 L15,10 L20,5 L25,7 L30,2 L35,4 L40,0`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={dept.color}
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{dept.desc}</p>
                </div>
              </div>

              {dept.href ? (
                <Link
                  href={dept.href}
                  className="w-full py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-white/10 border border-[var(--glass-border)] text-sm font-medium text-foreground group-hover:text-white transition-colors mt-2 text-left px-4 flex items-center justify-between"
                >
                  Open Workspace{' '}
                  <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100" />
                </Link>
              ) : (
                <button className="w-full py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-white/10 border border-[var(--glass-border)] text-sm font-medium text-foreground group-hover:text-white transition-colors mt-2 text-left px-4 flex items-center justify-between">
                  Open Workspace{' '}
                  <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
