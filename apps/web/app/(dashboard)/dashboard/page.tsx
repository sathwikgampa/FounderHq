'use client';

import React from 'react';
import { AiCopilot } from '@/components/dashboard/ai-copilot';
import { HeroMissionControl } from '@/components/dashboard/hero-mission-control';
import { MiddleWidgets } from '@/components/dashboard/middle-widgets';

export default function DashboardPage() {
  return (
    <div className="w-full relative space-y-6 pb-20">
      {/* 1. Top Primary AI Command Center */}
      <AiCopilot />

      {/* 2. Greeting Header, Startup Health Ring, & 4 KPI Cards */}
      <HeroMissionControl />

      {/* 3. Collapsible Accordion Sections (Priorities, Activity, Insights, Agents, Tasks) */}
      <MiddleWidgets />

      {/* 4. Minimal Footer */}
      <footer className="pt-8 text-center text-xs text-[#6B7280] border-t border-[#ECECEC]">
        FounderHQ OS · Built for ambitious founders
      </footer>
    </div>
  );
}
