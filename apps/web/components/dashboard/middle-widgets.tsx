'use client';

import React, { useState } from 'react';
import { Sparkles, Mic, Send, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from 'sonner';

const PRIORITIES = [
  { id: '1', title: 'Review Senior AI Engineer offer', due: 'Due today', checked: true },
  { id: '2', title: 'Approve Series A term sheet', due: 'Due tomorrow', checked: false },
];

const ACTIVITIES = [
  { id: '1', title: 'Term sheet updated', agent: 'Investment Agent', time: '10m ago', dotColor: 'bg-purple-500' },
  { id: '2', title: 'Senior AI Engineer offer sent', agent: 'Talent Agent', time: '45m ago', dotColor: 'bg-blue-500' },
  { id: '3', title: 'Runway analysis completed', agent: 'Finance Agent', time: '2h ago', dotColor: 'bg-emerald-500' },
  { id: '4', title: 'Marketing budget approved', agent: 'Marketing Agent', time: '3h ago', dotColor: 'bg-rose-500' },
  { id: '5', title: 'New investor meeting scheduled', agent: 'CEO Planner Agent', time: '5h ago', dotColor: 'bg-blue-400' },
];

const TRY_THESE_CHIPS = [
  { id: '1', text: 'Analyze runway', icon: '🔍' },
  { id: '2', text: 'Build MVP roadmap', icon: '🛠️' },
  { id: '3', text: 'Generate pitch deck', icon: '📊' },
  { id: '4', text: 'Review contracts', icon: '⚖️' },
  { id: '5', text: 'Hire engineers', icon: '👤' },
  { id: '6', text: 'Market analysis', icon: '📈' },
];

export function MiddleWidgets() {
  const [prioritiesState, setPrioritiesState] = useState(PRIORITIES);
  const [copilotQuery, setCopilotQuery] = useState('');

  const toggleCheck = (id: string) => {
    setPrioritiesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    toast.success(`AI Copilot executed: "${copilotQuery}"`, { icon: '✨' });
    setCopilotQuery('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* Col 1: Today's Priorities */}
      <GlowCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Today&apos;s Priorities</h3>
          <ChevronDown size={14} className="text-slate-400 cursor-pointer" />
        </div>

        <div className="space-y-3">
          {prioritiesState.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-3">
                {item.checked ? (
                  <CheckCircle2 size={16} className="text-[#7C5CFF] shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-500 shrink-0" />
                )}
                <span className={`text-xs font-medium ${item.checked ? 'text-white font-semibold' : 'text-slate-300'}`}>
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 shrink-0">
                {item.due}
              </span>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Col 2: Recent Activity */}
      <GlowCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer">
            All <ChevronDown size={12} />
          </span>
        </div>

        <div className="space-y-3">
          {ACTIVITIES.map((act) => (
            <div key={act.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${act.dotColor} shrink-0`} />
                <div>
                  <h4 className="font-bold text-white text-xs">{act.title}</h4>
                  <p className="text-[10px] text-slate-400">{act.agent}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Col 3: AI Copilot Assistant */}
      <GlowCard glowColor="rgba(124, 92, 255, 0.2)" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sparkles size={16} className="text-[#7C5CFF]" />
          <h3 className="text-sm font-bold text-white tracking-tight">AI Copilot</h3>
        </div>

        <form onSubmit={handleCopilotSubmit} className="relative">
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            placeholder="Ask FounderHQ anything..."
            className="w-full pl-3 pr-16 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7C5CFF]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="button" onClick={() => toast.info('Mic active')} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <Mic size={14} />
            </button>
            <button type="submit" className="p-1.5 rounded-lg bg-[#7C5CFF] text-white hover:bg-[#6b49f3]">
              <Send size={12} />
            </button>
          </div>
        </form>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">Try these</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {TRY_THESE_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCopilotQuery(chip.text)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 hover:text-white text-[11px] text-left truncate flex items-center gap-1.5 transition-all"
              >
                <span>{chip.icon}</span>
                <span className="truncate">{chip.text}</span>
              </button>
            ))}
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
