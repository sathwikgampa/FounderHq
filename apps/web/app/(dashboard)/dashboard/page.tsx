'use client';

import React, { useState, useCallback } from 'react';
import {
  Activity,
  TrendingUp,
  Bot,
  CheckCircle2,
  DollarSign,
  FileText,
  Clock,
  Database,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ApprovalQueue } from '@/features/approvals/components/approval-queue';
import { CEOPlannerStream } from '@/features/planner/components/ceo-planner-stream';

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleApprovalEnqueued = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const [decisions] = useState([
    {
      id: 'dec-1',
      title: 'Approved Q3 Infrastructure Migration to Cloud Run',
      agent: 'CEO Planner',
      date: 'Today, 10:42 AM',
    },
    {
      id: 'dec-2',
      title: 'Optimized SaaS Subscription Costs (Saved $1,200/mo)',
      agent: 'Finance Agent',
      date: 'Yesterday, 3:15 PM',
    },
    {
      id: 'dec-3',
      title: 'Indexed 14 Product Spec PDFs in RAG Knowledge Engine',
      agent: 'RAG Engine',
      date: 'Jul 29, 2026',
    },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Executive Startup OS Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time multi-agent execution status, health metrics, and human approval queue.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Status: Healthy</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Remaining Runway</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">18.4 Months</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" /> Burn rate: $42,000 / mo
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Executive Sub-Agents</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">5 Active</div>
          <div className="text-[11px] text-muted-foreground font-medium">
            CEO, Finance, Growth, Talent, Legal
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">RAG Documents</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">47 Indexed</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Grounded retrieval ready
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Startup Health Score</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight text-emerald-500">92 / 100</div>
          <div className="text-[11px] text-muted-foreground font-medium">
            Top 5% percentile for growth stage
          </div>
        </Card>
      </div>

      {/* CEO Planner Live Agent Streaming Component */}
      <CEOPlannerStream onApprovalEnqueued={handleApprovalEnqueued} />

      {/* Main Grid: Approvals Queue & Decision Logs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Approval Queue & Agent Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dynamic Human Approval Queue Widget */}
          <ApprovalQueue key={refreshTrigger} />

          {/* Departmental Status Grid */}
          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="text-lg font-bold">Executive Sub-Agent Status</h2>
              <span className="text-xs text-muted-foreground">Google ADK + Featherless AI</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  name: 'CEO Planner Agent',
                  status: 'ONLINE',
                  tasks: 'Root Orchestrator (Qwen3-235B)',
                },
                { name: 'Finance Agent', status: 'ONLINE', tasks: 'CFO Runway & Burn (Qwen3-32B)' },
                {
                  name: 'Talent Agent',
                  status: 'ONLINE',
                  tasks: 'Head of HR & Hiring (Qwen3-32B)',
                },
                {
                  name: 'Growth Agent',
                  status: 'ONLINE',
                  tasks: 'Marketing & Sales GTM (Qwen3-32B)',
                },
                { name: 'Legal Agent', status: 'ONLINE', tasks: 'General Counsel (Qwen3-32B)' },
              ].map((agent, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs">{agent.name}</div>
                    <div className="text-[10px] text-muted-foreground">{agent.tasks}</div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Recent Decision Log */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="text-lg font-bold">Startup Decision Log</h2>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              {decisions.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/40 bg-muted/20 space-y-1 text-xs"
                >
                  <div className="font-medium text-foreground">{item.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                    <span className="text-primary font-semibold">{item.agent}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
