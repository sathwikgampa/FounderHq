'use client';

import React from 'react';
import { Bot, Cpu, CheckCircle2, Loader2 } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { useRouter } from 'next/navigation';

const AGENTS = [
  {
    id: 'ceo',
    role: 'CEO Planner Agent',
    status: 'Working',
    lastAction: 'Orchestrating Series A SAFE & Q3 Hiring',
    successRate: '99.4%',
    memory: '1.2 GB',
    href: '/agents',
  },
  {
    id: 'cto',
    role: 'CTO Tech Agent',
    status: 'Working',
    lastAction: 'Auditing API Gateway latency & Docker builds',
    successRate: '98.8%',
    memory: '940 MB',
    href: '/agents',
  },
  {
    id: 'cfo',
    role: 'CFO Finance Agent',
    status: 'Thinking',
    lastAction: 'Calculating 16-month runway & burn optimization',
    successRate: '99.1%',
    memory: '680 MB',
    href: '/finance',
  },
  {
    id: 'cmo',
    role: 'CMO Growth Agent',
    status: 'Working',
    lastAction: 'Launching Product Hunt & LinkedIn GTM',
    successRate: '96.5%',
    memory: '520 MB',
    href: '/marketing',
  },
  {
    id: 'coo',
    role: 'COO Operations Agent',
    status: 'Idle',
    lastAction: 'Sprint planning & linear board synchronization',
    successRate: '97.9%',
    memory: '410 MB',
    href: '/tasks',
  },
  {
    id: 'legal',
    role: 'Legal & IP Agent',
    status: 'Idle',
    lastAction: 'Verified Delaware 83b election & NDAs',
    successRate: '100%',
    memory: '350 MB',
    href: '/legal',
  },
  {
    id: 'sales',
    role: 'Sales & CRM Agent',
    status: 'Working',
    lastAction: 'Following up on 4 enterprise B2B pilots',
    successRate: '95.2%',
    memory: '480 MB',
    href: '/sales',
  },
  {
    id: 'hr',
    role: 'Talent & HR Agent',
    status: 'Working',
    lastAction: 'Screening 128 AI engineer applicants',
    successRate: '98.0%',
    memory: '590 MB',
    href: '/hiring',
  },
  {
    id: 'design',
    role: 'Product Designer Agent',
    status: 'Thinking',
    lastAction: 'Generating 21st.dev glass UI mockups',
    successRate: '97.4%',
    memory: '720 MB',
    href: '/workspace',
  },
  {
    id: 'investor',
    role: 'Investment Agent',
    status: 'Working',
    lastAction: 'Updated Data Room for Sequoia & Index',
    successRate: '99.0%',
    memory: '610 MB',
    href: '/investors',
  },
];

export function ExecutiveAgentGrid() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="space-y-4 my-6">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 rounded-2xl bg-[#0E1014] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-all"
      >
        <div className="flex items-center gap-2">
          <Cpu className="text-[#7C5CFF]" size={18} />
          <h2 className="text-sm font-bold text-white tracking-tight">Executive Agents</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">10 Agents Active</span>
          <span
            className={`text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS.map((agent) => {
            const isWorking = agent.status === 'Working';
            const isThinking = agent.status === 'Thinking';

            return (
              <GlowCard
                key={agent.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => router.push(agent.href as any)}
                className="cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7C5CFF]">
                      <Bot size={16} />
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                        isWorking
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isThinking
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isWorking ? (
                        <CheckCircle2 size={10} />
                      ) : isThinking ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      )}
                      {agent.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white truncate">{agent.role}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 h-8 leading-relaxed">
                      {agent.lastAction}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Success: <strong className="text-white">{agent.successRate}</strong>
                    </span>
                    <span>
                      Mem: <strong className="text-slate-300">{agent.memory}</strong>
                    </span>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
