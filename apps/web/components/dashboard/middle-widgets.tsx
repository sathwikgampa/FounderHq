import React from 'react';
import Link from 'next/link';
import { CheckSquare, Sparkles, Bot, Clock, ArrowRight, TrendingUp, Circle } from 'lucide-react';
import { WidgetAccordionGroup, WidgetAccordionItem } from './widget-accordion';
import { PrioritiesList, AiInsightAction, QuickActionButtons } from './interactive-widgets';

export function MiddleWidgets() {
  const priorities = [
    { id: '1', title: 'Review Senior AI Engineer offer', due: 'Due today', checked: true },
    { id: '2', title: 'Approve Series A term sheet', due: 'Due tomorrow', checked: false },
  ];

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
    {
      id: '1',
      title: 'Term sheet updated',
      agent: 'Investment Agent',
      time: '10m ago',
      dotColor: 'bg-[#6C63FF]',
    },
    {
      id: '2',
      title: 'Senior AI Engineer offer sent',
      agent: 'Talent Agent',
      time: '45m ago',
      dotColor: 'bg-blue-500',
    },
    {
      id: '3',
      title: 'Runway analysis completed',
      agent: 'Finance Agent',
      time: '2h ago',
      dotColor: 'bg-[#16A34A]',
    },
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
    <WidgetAccordionGroup defaultOpen="priorities">
      {/* 1. Accordion: Priorities (2) */}
      <WidgetAccordionItem id="priorities" icon={CheckSquare} title="Priorities" count="(2)">
        <PrioritiesList initialItems={priorities} />
      </WidgetAccordionItem>

      {/* 2. Accordion: AI Insights (3) */}
      <WidgetAccordionItem id="insights" icon={Sparkles} title="AI Insights" count="(3)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INSIGHTS.map((ins) => (
            <div
              key={ins.id}
              className="p-3.5 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-[#111827]">{ins.title}</h4>
                <span className="text-[10px] font-semibold text-[#16A34A] block mt-0.5">
                  {ins.confidence}
                </span>
              </div>
              <AiInsightAction actionName={ins.action} />
            </div>
          ))}
        </div>
      </WidgetAccordionItem>

      {/* 3. Accordion: Recent Activity (5) */}
      <WidgetAccordionItem id="activity" icon={Clock} title="Recent Activity" count="(5)">
        <div className="space-y-2.5">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between text-xs py-1 border-b border-[#ECECEC]/50 last:border-none"
            >
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
            <Link
              href="/activity"
              className="text-xs font-semibold text-[#6C63FF] hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </WidgetAccordionItem>

      {/* 4. Accordion: Executive Agents (12 Running) */}
      <WidgetAccordionItem id="agents" icon={Bot} title="Executive Agents" count="(12 Running)">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent) => (
            <Link
              href="/agents"
              key={agent.id}
              className="block p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] cursor-pointer hover:border-[#6C63FF]/30 transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#111827] truncate">{agent.role}</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A]">
                  {agent.status}
                </span>
              </div>
              <p className="text-[10px] text-[#6B7280] truncate">{agent.action}</p>
            </Link>
          ))}
        </div>
      </WidgetAccordionItem>

      {/* 5. Accordion: Today's Tasks (4 Pending) */}
      <WidgetAccordionItem id="tasks" icon={CheckSquare} title="Today's Tasks" count="(4 Pending)">
        <div className="space-y-2">
          {TASKS.map((t) => (
            <Link
              href="/tasks"
              key={t.id}
              className="block p-3 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between cursor-pointer hover:border-[#6C63FF]/30 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <Circle size={14} className="text-[#6B7280]" />
                <span className="font-semibold text-[#111827]">{t.title}</span>
              </div>
              <span className="text-[10px] text-[#6B7280] font-medium">{t.assignee}</span>
            </Link>
          ))}
        </div>
      </WidgetAccordionItem>

      {/* 6. Accordion: Investor Updates (1) */}
      <WidgetAccordionItem id="investor" icon={TrendingUp} title="Investor Updates" count="(1)">
        <div className="p-3.5 rounded-xl bg-[#FAFAFB] border border-[#ECECEC] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#111827]">Q3 SAFE Funding Memo Prepared</h4>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Sequoia & Index Ventures data room ready.
            </p>
          </div>
          <Link
            href="/investors"
            className="px-3 py-1.5 rounded-xl bg-[#6C63FF] text-white text-[11px] font-semibold hover:bg-[#5b52e0] transition-colors inline-block"
          >
            Open Data Room
          </Link>
        </div>
      </WidgetAccordionItem>

      {/* Quick Actions */}
      <QuickActionButtons />
    </WidgetAccordionGroup>
  );
}
