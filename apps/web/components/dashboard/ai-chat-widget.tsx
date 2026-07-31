'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Lightbulb,
  TrendingUp,
  Users,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { streamPlannerExecution } from '@/services/planner';

interface AiChatWidgetProps {
  onApprovalTriggered?: () => void;
}

export function AiChatWidget({ onApprovalTriggered }: AiChatWidgetProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);

  const suggestions = [
    { text: 'Check runway with $200k balance and $20k burn', icon: TrendingUp },
    { text: 'Draft job post for Senior AI Engineer at $130k', icon: Users },
    { text: 'Review employment contract legal risks', icon: FileText },
    { text: 'Estimate AWS cloud cost for 50k users', icon: Lightbulb },
  ];

  const handleExecute = async (inputToRun?: string) => {
    const query = inputToRun || prompt;
    if (!query.trim() || isStreaming) return;

    setIsStreaming(true);
    setResponse(null);

    await streamPlannerExecution(
      query,
      'ws-ai-widget',
      (evt) => {
        if (evt.event === 'approval_flag' || evt.event === 'approval_required') {
          onApprovalTriggered?.();
        }
        if (evt.event === 'final_brief' && (evt.data?.summary || evt.data?.executive_summary)) {
          setResponse(evt.data.summary || evt.data.executive_summary);
        }
      },
      () => setIsStreaming(false),
      (err) => {
        setResponse(`Execution error: ${err.message}`);
        setIsStreaming(false);
      },
    );
  };

  return (
    <div className="w-full mt-12 mb-8">
      <div className="glass-card p-6 flex flex-col gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="flex flex-col md:flex-row items-center gap-4 w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={24} className="text-white" />
          </div>

          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isStreaming}
              placeholder="Type any custom founder prompt (e.g. 'Hire AI Engineer at $140k', 'Audit SAFE agreement')..."
              className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-base shadow-sm disabled:opacity-50"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mic size={20} />
            </button>
          </div>

          <button
            type="submit"
            disabled={isStreaming || !prompt.trim()}
            className="w-full md:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isStreaming ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Asking Agents...
              </>
            ) : (
              <>
                <Send size={18} /> Ask Agents
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap gap-3 mt-2 pl-0 md:pl-16">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                disabled={isStreaming}
                onClick={() => {
                  setPrompt(s.text);
                  handleExecute(s.text);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
              >
                <Icon size={14} className="text-primary" />
                {s.text}
              </button>
            );
          })}
        </div>

        {response && (
          <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-foreground space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> CEO Agent Response:
            </div>
            <p className="leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
