import { AiChatWidget } from '@/components/dashboard/ai-chat-widget';
import { AgentsGrid } from '@/components/agents/agents-grid';

export default function AgentsPage() {
  return (
    <div className="w-full relative pb-16">
      <div className="flex flex-col gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Agents</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Your AI department team — each agent specializes in one area of your startup.
          </p>
        </div>
      </div>

      <AgentsGrid />

      <AiChatWidget />
    </div>
  );
}
