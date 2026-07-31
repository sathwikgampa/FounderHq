'use client';

import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { MiddleRowCards } from '@/components/dashboard/middle-row-cards';
import { AiChatWidget } from '@/components/dashboard/ai-chat-widget';

export default function DashboardPage() {
  return (
    <div className="w-full relative pb-16">
      <WelcomeSection />
      <StatsCards />
      <MiddleRowCards />
      <AiChatWidget />
    </div>
  );
}
