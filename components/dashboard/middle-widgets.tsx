'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Bot,
  Clock,
  CheckSquare,
  Plus,
  FilePlus,
  UserPlus,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function MiddleWidgets() {
  const router = useRouter();

  // Accordion state - only one accordion open at a time
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

  const INSIGHTS = [
    {
      id: '1',
      title: 'Optimize Cloud Infra Architecture',
      confidence: '98% Confidence',
      action: 'Migrate to Graviton3',
    },
    {
      id: '2',
      title: 'Accelerate Enterprise B2B Sales Cycle',
      confidence: '94% Confidence',
      action: 'Send SOC2 Audit Deck',
    },
  ];

  const ACTIVITIES = [
    { id: '1', title: 'Term sheet updated', agent: 'Investment Agent', time: '10m ago', dotColor: 'bg-[#6C63FF]' },
    { id: '2', title: 'Senior AI Engineer offer sent', agent: 'Talent Agent', time: '45m ago', dotColor: 'bg-blue-500' },
    { id: '3', title: 'Runway analysis completed', agent: 'Finance Agent', time: '2h ago', dotColor: 'bg-[#16A34A]' },
  ];

  const AGENTS = [
    { id: 'ceo', role: 'CEO Planner Agent', status: 'Running', action: 'Series A SAFE' },
    { id: 'cto', role: 'CTO Tech Agent', status: 'Running', action: 'API Gateway' },
    { id: 'cfo', role: 'CFO Finance Agent', status: 'Running', action: '16-mo Runway' },
    { id: 'cmo', role: 'CMO Growth Agent', status: 'Running', action: 'Product Hunt' },
    { id: 'coo', role: 'COO Operations Agent', status: 'Running', action: 'Linear Sync' },
    { id: 'legal', role: 'Legal & IP Agent', status: 'Running', action: '83b Filing' },
    { id: 'sales', role: 'Sales & CRM Agent', status: 'Running', action: 'B2B Pilots' },
    { id: 'hr', role: 'Talent & HR Agent', status: 'Running', action: 'Candidate Screen' },
    { id: 'design', role: 'Product Designer Agent', status: 'Running', action: 'UI Mockups' },
    { id: 'investor', role: 'Investment Agent', status: 'Running', action: 'Data Room' },
    { id: 'qa', role: 'QA & Security Agent', status: 'Running', action: 'Penetration Test' },
    { id: 'support', role: 'Customer Success Agent', status: 'Running', action: 'NPS Survey' },
  ];

  const TASKS = [
    { id: 't1', title: 'Execute Delaware 83(b) tax filing', assignee: 'Legal Agent' },
    { id: 't2', title: 'Deploy v2.4 API Rate Limiter', assignee: 'CTO Agent' },
    { id: 't3', title: 'Send Q3 Investor Update Deck', assignee: 'CEO Agent' },
    { id: 't4', title: 'Finalize B2B Pilot MSA Agreement', assignee: 'Sales Agent' },
  ];

  return (
    <div className="space-y-4 mb-12">
      {/* 1. Accordion: Priorities (2) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('priorities')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Priorities</h2>
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

      {/* 2. Accordion: AI Insights (3) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('insights')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">AI Insights</h2>
            <span className="text-xs text-[#6B7280] font-normal">(3)</span>
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
              <div key={ins.id} className="p-3.5 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">{ins.title}</h4>
                  <span className="text-[10px] font-semibold text-[#16A34A] block mt-0.5">{ins.confidence}</span>
                </div>
                <button
                  onClick={() => toast.success(`Executed: ${ins.action}`)}
                  className="px-3 py-1.5 rounded-xl bg-[#6C63FF] text-white text-[11px] font-semibold hover:bg-[#5b52e0] transition-colors shrink-0 shadow-sm"
                >
                  {ins.action}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Accordion: Recent Activity (5) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('activity')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Recent Activity</h2>
            <span className="text-xs text-[#6B7280] font-normal">(5)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'activity' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'activity' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 space-y-2.5">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="flex items-center justify-between text-xs py-1 border-b border-[#ECECEC]/50 last:border-none">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${act.dotColor} shrink-0`} />
                  <div>
                    <h4 className="font-bold text-[#111827] text-xs">{act.title}</h4>
                    <p className="text-[10px] text-[#6B7280]">{act.agent}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#6B7280]">{act.time}</span>
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

      {/* 4. Accordion: Executive Agents (12 Running) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('agents')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Executive Agents</h2>
            <span className="text-xs text-[#6B7280] font-normal">(12 Running)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'agents' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'agents' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => router.push('/agents' as any)}
                className="p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] cursor-pointer hover:border-[#6C63FF]/30 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111827] truncate">{agent.role}</h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A]">
                    {agent.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] truncate">{agent.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Accordion: Today's Tasks (4 Pending) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('tasks')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Today&apos;s Tasks</h2>
            <span className="text-xs text-[#6B7280] font-normal">(4 Pending)</span>
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
                <span className="text-[10px] text-[#6B7280] font-medium">{t.assignee}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Accordion: Investor Updates (1) */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('investor')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#111827]">Investor Updates</h2>
            <span className="text-xs text-[#6B7280] font-normal">(1)</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#6B7280] transition-transform duration-200 ${
              openSection === 'investor' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'investor' && (
          <div className="px-4 pb-4 border-t border-[#ECECEC] pt-3">
            <div className="p-3.5 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Q3 SAFE Funding Memo Prepared</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Sequoia & Index Ventures data room ready.</p>
              </div>
              <button
                onClick={() => router.push('/investors' as any)}
                className="px-3 py-1.5 rounded-xl bg-[#6C63FF] text-white text-[11px] font-semibold hover:bg-[#5b52e0] transition-colors"
              >
                Open Data Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Floating Row (4 Buttons Only) */}
      <div className="pt-4 border-t border-[#ECECEC]">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => router.push('/tasks' as any)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus size={14} className="text-[#6C63FF]" /> Create Task
          </button>

          <button
            onClick={() => router.push('/documents' as any)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <FilePlus size={14} className="text-[#6C63FF]" /> New Document
          </button>

          <button
            onClick={() => toast.info('Invite team member popup open')}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#ECECEC] hover:border-[#6C63FF]/40 text-[#111827] text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus size={14} className="text-[#6C63FF]" /> Invite Member
          </button>

          <button
            onClick={() => {
              const copilotInput = document.getElementById('copilot');
              copilotInput?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold shadow-md shadow-[#6C63FF]/20 hover:bg-[#5b52e0] transition-all flex items-center gap-2"
          >
            <MessageSquare size={14} /> Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
