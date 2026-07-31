'use client';

import { Sparkles, Mic, Lightbulb, TrendingUp, Users, FileText } from 'lucide-react';

export function AiChatWidget() {
  const suggestions = [
    { text: 'Analyze runway', icon: TrendingUp },
    { text: 'Draft offer letter', icon: Users },
    { text: 'Review term sheet', icon: FileText },
    { text: 'Brainstorm ideas', icon: Lightbulb },
  ];

  return (
    <div className="w-full mt-12 mb-8">
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={24} className="text-white" />
          </div>

          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Ask anything about your startup..."
              className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-base shadow-sm"
            />
            <button onClick={() => { console.log('Mic clicked'); alert('Voice input coming soon!'); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
          </div>

          <button onClick={() => { console.log('Ask clicked'); alert('Orchestrator prompt received.'); }} className="w-full md:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
            Ask
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-2 pl-0 md:pl-16">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                onClick={() => { console.log('Suggestion clicked:', s.text); alert(`Selected suggestion: ${s.text}`); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-sm text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <Icon size={14} className="text-primary" />
                {s.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
