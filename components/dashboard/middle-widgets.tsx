'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, Circle, ArrowRight, Sparkles, Bot, Clock, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MiddleWidgets() {
  const router = useRouter();

  // Accordion state - default open for Priorities, collapsed for rest
  const [openSection, setOpenSection] = useState<string | null>('priorities');

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const [priorities, setPriorities] = useState([
    { id: '1', title: 'Review Senior AI Engineer offer', due: 'Due today', checked: true },
    { id: '2', title: 'Approve Series A term sheet', due: 'Due tomorrow', checked: false },
  ]);

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const ACTIVITIES = [
    { id: '1', title: 'Term sheet updated', agent: 'Investment Agent', time: '10m ago', dotColor: 'bg-purple-500' },
    { id: '2', title: 'Senior AI Engineer offer sent', agent: 'Talent Agent', time: '45m ago', dotColor: 'bg-blue-500' },
    { id: '3', title: 'Runway analysis completed', agent: 'Finance Agent', time: '2h ago', dotColor: 'bg-emerald-500' },
  ];

  const INSIGHTS = [
    {
      id: '1',
      title: 'Optimize Cloud Server Architecture',
      desc: 'Migrating 3 microservices to AWS Graviton3 will reduce monthly infra burn by $1,850.',
      impact: 'High Impact',
      impactColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200',
    },
    {
      id: '2',
      title: 'Accelerate Enterprise Sales Cycle',
      desc: 'Sending SOC2 compliance deck directly in email follow-up reduces deal latency by 6 days.',
      impact: 'Medium Impact',
      impactColor: 'text-[#6C63FF] bg-purple-50 border-purple-200',
    },
  ];

  const AGENTS = [
    { id: 'ceo', role: 'CEO Planner Agent', status: 'Working', lastAction: 'Orchestrating Series A SAFE' },
    { id: 'cto', role: 'CTO Tech Agent', status: 'Working', lastAction: 'Auditing API Gateway latency' },
    { id: 'cfo', role: 'CFO Finance Agent', status: 'Thinking', lastAction: '16-month runway calculation' },
    { id: 'cmo', role: 'CMO Growth Agent', status: 'Working', lastAction: 'Product Hunt GTM campaign' },
    { id: 'coo', role: 'COO Operations Agent', status: 'Idle', lastAction: 'Linear board synchronization' },
    { id: 'legal', role: 'Legal & IP Agent', status: 'Idle', lastAction: 'Delaware 83b election verified' },
    { id: 'sales', role: 'Sales & CRM Agent', status: 'Working', lastAction: '4 enterprise B2B pilots' },
    { id: 'hr', role: 'Talent & HR Agent', status: 'Working', lastAction: '128 AI engineer applicants' },
    { id: 'design', role: 'Product Designer Agent', status: 'Thinking', lastAction: 'Generating glass UI mockups' },
    { id: 'investor', role: 'Investment Agent', status: 'Working', lastAction: 'Data Room Sequoia & Index' },
  ];

  const TASKS = [
    { id: 't1', title: 'Execute Delaware 83(b) tax filing', assignee: 'Legal Agent', priority: 'Urgent' },
    { id: 't2', title: 'Deploy v2.4 API Rate Limiter', assignee: 'CTO Agent', priority: 'High' },
    { id: 't3', title: 'Send Q3 Investor Update Deck', assignee: 'CEO Agent', priority: 'Normal' },
  ];

  return (
    <div className="space-y-4 mb-12">
      {/* 1. Accordion: Today's Priorities (2) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('priorities')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Today&apos;s Priorities</h2>
            <span className="text-xs text-[#6B7280] font-normal">(2)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'priorities' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'priorities' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 space-y-2">
            {priorities.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePriority(item.id)}
                className="p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between cursor-pointer hover:border-[#6C63FF]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  {item.checked ? (
                    <CheckCircle2 size={16} className="text-[#6C63FF] shrink-0" />
                  ) : (
                    <Circle size={16} className="text-[#6B7280] shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${item.checked ? 'text-[#111827] font-semibold' : 'text-[#6B7280]'}`}>
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#6C63FF] px-2.5 py-0.5 rounded-full bg-[#6C63FF]/10 shrink-0">
                  {item.due}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Accordion: Recent Activity (3) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('activity')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Recent Activity</h2>
            <span className="text-xs text-[#6B7280] font-normal">(3)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'activity' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'activity' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 space-y-3">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${act.dotColor} shrink-0`} />
                  <div>
                    <h4 className="font-bold text-[#111827] text-xs">{act.title}</h4>
                    <p className="text-[11px] text-[#6B7280]">{act.agent}</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#6B7280]">{act.time}</span>
              </div>
            ))}
            <div className="pt-2 text-right">
              <button
                onClick={() => router.push('/activity' as any)}
                className="text-xs font-semibold text-[#6C63FF] hover:underline inline-flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Accordion: AI Insights (2) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('insights')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">AI Insights</h2>
            <span className="text-xs text-[#6B7280] font-normal">(2)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'insights' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'insights' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {INSIGHTS.map((ins) => (
              <div key={ins.id} className="p-3.5 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111827]">{ins.title}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ins.impactColor}`}>
                    {ins.impact}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">{ins.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Accordion: Executive Agents (10 Active) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('agents')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Executive Agents</h2>
            <span className="text-xs text-[#6B7280] font-normal">(10 Active)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'agents' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'agents' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => router.push('/agents' as any)}
                className="p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] cursor-pointer hover:border-[#6C63FF]/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                    {agent.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] truncate">{agent.role}</h4>
                  <p className="text-[10px] text-[#6B7280] line-clamp-1 mt-0.5">{agent.lastAction}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Accordion: Tasks (3 Pending) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('tasks')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Today&apos;s Tasks</h2>
            <span className="text-xs text-[#6B7280] font-normal">(3 Pending)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'tasks' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'tasks' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 space-y-2">
            {TASKS.map((t) => (
              <div
                key={t.id}
                onClick={() => router.push('/tasks' as any)}
                className="p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between cursor-pointer hover:border-[#6C63FF]/30 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <Circle size={14} className="text-[#6B7280]" />
                  <span className="font-semibold text-[#111827]">{t.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6B7280]">{t.assignee}</span>
                  <span className="text-[10px] font-bold text-rose-600 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                    {t.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
