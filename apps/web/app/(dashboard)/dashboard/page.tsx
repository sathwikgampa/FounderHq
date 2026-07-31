'use client';

import React, { useState, useCallback } from 'react';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { MiddleRowCards } from '@/components/dashboard/middle-row-cards';
import { AiChatWidget } from '@/components/dashboard/ai-chat-widget';
import { ApprovalQueue } from '@/features/approvals/components/approval-queue';
import { CEOPlannerStream } from '@/features/planner/components/ceo-planner-stream';

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleApprovalEnqueued = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full relative pb-16 space-y-8">
      <WelcomeSection />
      <StatsCards />

      {/* CEO Planner Live Agent Streaming Component */}
      <CEOPlannerStream onApprovalEnqueued={handleApprovalEnqueued} />

      {/* Dynamic Human Approval Queue Widget */}
      <ApprovalQueue key={refreshTrigger} />

      <MiddleRowCards />
      <AiChatWidget />
    </div>
  );
}
