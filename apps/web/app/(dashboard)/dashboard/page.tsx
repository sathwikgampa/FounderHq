'use client';

import React from 'react';
import { HeroMissionControl } from '@/components/dashboard/hero-mission-control';
import { AiCopilot } from '@/components/dashboard/ai-copilot';
import { ExecutiveAgentGrid } from '@/components/dashboard/executive-agent-grid';
import { KanbanTasks } from '@/components/dashboard/kanban-tasks';
import { AiInsightsPanel } from '@/components/dashboard/ai-insights-panel';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';

export default function DashboardPage() {
  return (
    <div className="w-full relative space-y-8 pb-20">
      {/* 1. Hero Mission Control Panel & Animated Health Orb */}
      <HeroMissionControl />

      {/* 2. Perplexity-style Center Stage AI Copilot Input */}
      <AiCopilot />

      {/* 3. Executive Agent Network Grid (10 Agents) */}
      <ExecutiveAgentGrid />

      {/* 4. Execution Tasks (Kanban Board) */}
      <KanbanTasks />

      {/* 5. Split Row: Executive AI Insights & GitHub-style Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiInsightsPanel />
        <ActivityTimeline />
      </div>

      {/* 6. Financial & Growth Analytics Charts */}
      <AnalyticsCharts />
    </div>
  );
}
