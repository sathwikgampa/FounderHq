'use client';

import React from 'react';
import { HeroMissionControl } from '@/components/dashboard/hero-mission-control';
import { MiddleWidgets } from '@/components/dashboard/middle-widgets';
import { ExecutiveAgentGrid } from '@/components/dashboard/executive-agent-grid';
import { KanbanTasks } from '@/components/dashboard/kanban-tasks';
import { AiInsightsPanel } from '@/components/dashboard/ai-insights-panel';

export default function DashboardPage() {
  return (
    <div className="w-full relative space-y-6 pb-20">
      {/* 1. Hero Greeting, Startup Health Widget, Command Box Right Below Name, & 4 Metric Cards */}
      <HeroMissionControl />

      {/* 2. Middle 3-Col Row: Today's Priorities, Recent Activity, AI Copilot */}
      <MiddleWidgets />

      {/* 3. Collapsible Executive Agents */}
      <ExecutiveAgentGrid />

      {/* 4. Collapsible Tasks */}
      <KanbanTasks />

      {/* 5. Collapsible Insights */}
      <AiInsightsPanel />

      {/* 6. Footer */}
      <footer className="pt-8 text-center text-xs text-slate-500 border-t border-white/5">
        FounderHQ OS · Built for ambitious founders
      </footer>
    </div>
  );
}
