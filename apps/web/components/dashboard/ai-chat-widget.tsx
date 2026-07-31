'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  Lightbulb,
  TrendingUp,
  Users,
  FileText,
  Send,
  Loader2,
  ShieldAlert,
  Bot,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { streamPlannerExecution, PlannerStreamEvent } from '@/services/planner';

interface ExecutionLog {
  id: string;
  event: string;
  time: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export function AiChatWidget() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [workflowType, setWorkflowType] = useState<string | null>(null);
  const [finalBrief, setFinalBrief] = useState<string | null>(null);
  const [hasApprovalFlag, setHasApprovalFlag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: 'Analyze runway with $10k savings and 2 founders', icon: TrendingUp },
    { text: 'Draft offer letter & equity vesting for CTO', icon: Users },
    { text: 'Review term sheet & incorporation checklist', icon: FileText },
    { text: 'Brainstorm 14-day MVP spec for EdTech app', icon: Lightbulb },
  ];

  useEffect(() => {
    if (isLoading && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, finalBrief, isLoading]);

  const handleRunPrompt = (promptText?: string) => {
    const query = (promptText || input).trim();
    if (!query || isLoading) return;

    setInput(query);
    setIsLoading(true);
    setLogs([]);
    setSelectedAgents([]);
    setWorkflowType(null);
    setFinalBrief(null);
    setHasApprovalFlag(false);
    setError(null);

    const nowStr = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    streamPlannerExecution(
      query,
      'ws-default',
      (evt: PlannerStreamEvent) => {
        const time = nowStr();
        const eventType = evt.event;
        const payload = evt.data || {};

        if (eventType === 'session_start') {
          const agents = payload.selected_agents || ['CEOAgent'];
          const wf = payload.workflow_type || 'SEQUENTIAL';
          setSelectedAgents(agents);
          setWorkflowType(wf);
          setLogs((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              event: 'session_start',
              time,
              text: `Routed intent to ${agents.length} specialized sub-agent(s) [${wf} topology]`,
              data: payload,
            },
          ]);
        } else if (eventType === 'agent_started') {
          setLogs((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              event: 'agent_started',
              time,
              text: `⚡ ${payload.agent_name || 'Agent'} activated and analyzing requirements...`,
              data: payload,
            },
          ]);
        } else if (eventType === 'tool_executed') {
          const toolName = payload.tool_name || 'tool';
          const isApproval =
            payload.result?.approval_status === 'HOLD_FOR_HUMAN_APPROVAL' ||
            payload.result?.requires_human_signoff;
          if (isApproval) {
            setHasApprovalFlag(true);
          }
          setLogs((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              event: 'tool_executed',
              time,
              text: `🔧 Tool Executed: ${toolName} ${isApproval ? '⚠️ (Requires Human Sign-off)' : '✅'}`,
              data: payload,
            },
          ]);
        } else if (eventType === 'approval_required') {
          setHasApprovalFlag(true);
          setLogs((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              event: 'approval_required',
              time,
              text: `🛑 Approval Enqueued: ${payload.action || 'High-risk decision'}`,
              data: payload,
            },
          ]);
        } else if (eventType === 'final_brief') {
          const brief =
            payload.synthesis ||
            payload.executive_summary ||
            payload.raw_brief ||
            'Launch plan synthesized successfully.';
          setFinalBrief(brief);
        }
      },
      () => {
        setIsLoading(false);
      },
      (err: Error) => {
        setIsLoading(false);
        setError(err.message || 'Failed to stream multi-agent execution response');
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunPrompt();
    }
  };

  return (
    <div className="w-full mt-12 mb-8">
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={24} className="text-white animate-pulse" />
          </div>

          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your startup (e.g. 'I need an edutech platform to implement studies...')"
              className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-base shadow-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mic size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleRunPrompt()}
            disabled={isLoading || !input.trim()}
            className="w-full md:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-3 mt-2 pl-0 md:pl-16">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleRunPrompt(s.text)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground hover:bg-muted disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                <Icon size={14} className="text-primary" />
                {s.text}
              </button>
            );
          })}
        </div>

        {/* Streaming & Results Panel */}
        {(isLoading || logs.length > 0 || finalBrief || error) && (
          <div ref={outputRef} className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
            {/* Header Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Bot size={16} className="text-primary" />
                <span>Hierarchical Multi-Agent Execution</span>
                {workflowType && (
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-mono">
                    {workflowType}
                  </span>
                )}
              </div>
              {selectedAgents.length > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <span>Active Agents:</span>
                  {selectedAgents.map((ag) => (
                    <span
                      key={ag}
                      className="px-1.5 py-0.5 rounded bg-card border border-border text-foreground font-mono"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Human Approval Alert Flag */}
            {hasApprovalFlag && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-600 dark:text-amber-400">
                <ShieldAlert size={18} className="shrink-0 text-amber-500" />
                <span>
                  <strong>Human Approval Enqueued:</strong> One or more legal/equity/budget actions
                  require human sign-off before final execution.
                </span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Live Streaming Execution Log */}
            {logs.length > 0 && (
              <div className="bg-background/80 border border-border rounded-xl p-3.5 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 text-muted-foreground leading-relaxed"
                  >
                    <span className="text-[10px] text-muted text-foreground/50 shrink-0 mt-0.5 font-sans">
                      {log.time}
                    </span>
                    <span className="text-foreground">{log.text}</span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary text-xs font-sans pt-1 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>
                      Sub-agents executing tools & synthesizing 30-Day Launch Blueprint...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Synthesized Final 30-Day Blueprint */}
            {finalBrief && (
              <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-md flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Zap size={18} />
                    <span>30-Day Founder Launch Blueprint</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFinalBrief(null);
                      setLogs([]);
                    }}
                    className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={12} /> Clear Output
                  </button>
                </div>

                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans prose dark:prose-invert max-w-none">
                  {finalBrief}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
