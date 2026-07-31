'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Bot,
  Terminal,
  CheckCircle2,
  ShieldAlert,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { streamPlannerExecution, PlannerStreamEvent } from '@/services/planner';

interface CEOPlannerStreamProps {
  workspaceId?: string;
  onApprovalEnqueued?: () => void;
}

interface ExecutionLog {
  id: string;
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

export function CEOPlannerStream({
  workspaceId = 'ws-dashboard',
  onApprovalEnqueued,
}: CEOPlannerStreamProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [finalBrief, setFinalBrief] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePrompts = [
    'We have $150,000 balance and $20,000 monthly burn. Hire a Senior AI Engineer at $120,000/yr and run a $6,000 LinkedIn campaign.',
    'Evaluate our legal risk for a new SAFE agreement with $5M valuation cap.',
    'Check our runway with $80,000 cash balance and $18,000 burn rate.',
  ];

  const handleStream = async (promptToRun?: string) => {
    const textToSubmit = promptToRun || prompt;
    if (!textToSubmit.trim() || isStreaming) return;

    setIsStreaming(true);
    setLogs([]);
    setActiveAgents([]);
    setFinalBrief(null);
    setErrorMsg(null);

    await streamPlannerExecution(
      textToSubmit,
      workspaceId,
      (evt: PlannerStreamEvent) => {
        const timeStr = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const newLog: ExecutionLog = {
          id: Math.random().toString(36).substr(2, 9),
          event: evt.event,
          timestamp: timeStr,
          data: evt.data,
        };

        setLogs((prev) => [...prev, newLog]);

        if (
          (evt.event === 'agent_started' || evt.event === 'agent_start') &&
          (evt.data?.agent || evt.data?.agent_name)
        ) {
          const agentName = String(evt.data.agent ?? evt.data.agent_name ?? '');
          setActiveAgents((prev) => (prev.includes(agentName) ? prev : [...prev, agentName]));
        }

        if (evt.event === 'routing_decision' && Array.isArray(evt.data?.selected_agents)) {
          setActiveAgents((evt.data.selected_agents as string[]).filter((a) => typeof a === 'string'));
        }

        if (evt.event === 'approval_required' || evt.event === 'approval_flag') {
          onApprovalEnqueued?.();
        }

        if (evt.event === 'final_brief' && (evt.data?.executive_summary || evt.data?.summary)) {
          setFinalBrief(String(evt.data.executive_summary ?? evt.data.summary ?? ''));
        }

        if (evt.event === 'error' && evt.data?.error) {
          setErrorMsg(String(evt.data.error));
        }
      },
      () => {
        setIsStreaming(false);
      },
      (err) => {
        setErrorMsg(err.message || 'Failed to execute CEO Planner agent stream.');
        setIsStreaming(false);
      },
    );
  };

  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">CEO Planner Agent Stream</h2>
            <p className="text-xs text-muted-foreground">
              Google ADK Multi-Agent Orchestration & Real-Time Execution
            </p>
          </div>
        </div>

        {activeAgents.length > 0 && (
          <div className="flex items-center space-x-1.5">
            {activeAgents.map((agent) => (
              <span
                key={agent}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30"
              >
                {agent}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Sample Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground">Quick Founder Prompts:</span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              disabled={isStreaming}
              onClick={() => {
                setPrompt(sample);
                handleStream(sample);
              }}
              className="text-[11px] text-left px-3 py-1.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-accent/40 text-foreground transition-colors disabled:opacity-50"
            >
              {sample.length > 70 ? `${sample.slice(0, 70)}...` : sample}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStream();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask CEO Agent to analyze burn rate, draft hiring posting, or plan marketing campaign..."
          disabled={isStreaming}
          className="flex-1 rounded-xl border border-border/70 bg-background/80 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isStreaming || !prompt.trim()}
          className="rounded-xl px-5 text-xs font-semibold shadow-sm"
        >
          {isStreaming ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Streaming...
            </>
          ) : (
            <>
              <Send className="mr-1.5 h-3.5 w-3.5" /> Execute
            </>
          )}
        </Button>
      </form>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stream Output Log */}
      {logs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b border-border/40 pb-1">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" /> Live SSE Execution Log
            </span>
            <span className="text-[10px] font-mono">{logs.length} event(s)</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-primary flex items-center gap-1">
                      {log.event === 'agent_started' && <Bot className="h-3 w-3" />}
                      {log.event === 'tool_executed' && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      )}
                      {log.event === 'approval_required' && (
                        <ShieldAlert className="h-3 w-3 text-amber-500" />
                      )}
                      {log.event}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                  </div>

                  {log.data?.agent && (
                    <div className="text-[11px] text-muted-foreground">
                      Agent: <span className="text-foreground font-semibold">{log.data.agent}</span>
                    </div>
                  )}

                  {log.data?.tool && (
                    <div className="text-[11px] text-muted-foreground">
                      Tool: <span className="text-emerald-400 font-semibold">{log.data.tool}</span>
                    </div>
                  )}

                  {log.data?.result && (
                    <pre className="text-[10px] text-muted-foreground bg-background/50 p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(log.data.result, null, 2)}
                    </pre>
                  )}

                  {log.event === 'approval_required' && (
                    <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
                      <ShieldAlert className="h-3.5 w-3.5" /> High-risk action enqueued in Human
                      Approval Queue
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Final Executive Brief */}
      {finalBrief && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> CEO Executive Brief Synthesized
            </span>
          </div>
          <div className="text-xs leading-relaxed text-foreground whitespace-pre-line">
            {finalBrief}
          </div>
        </motion.div>
      )}
    </Card>
  );
}
