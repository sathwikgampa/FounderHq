'use client';

import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingBriefing } from '@/components/marketing/marketing-briefing';
import { MarketingMetrics } from '@/components/marketing/marketing-metrics';
import { ActiveCampaigns } from '@/components/marketing/active-campaigns';
import { AiSuggestions } from '@/components/marketing/ai-suggestions';
import { GrowthFunnel } from '@/components/marketing/growth-funnel';
import { ChannelPerformance } from '@/components/marketing/channel-performance';
import { ContentCalendar } from '@/components/marketing/content-calendar';
import { AiChatWidget } from '@/components/dashboard/ai-chat-widget';

export default function MarketingPage() {
  return (
    <div className="w-full relative pb-16">
      <MarketingHeader />

      <MarketingBriefing />

      <MarketingMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <ActiveCampaigns />
        <AiSuggestions />
      </div>

      <GrowthFunnel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <ChannelPerformance />
        <ContentCalendar />
      </div>

      <AiChatWidget />
    </div>
  );
}
