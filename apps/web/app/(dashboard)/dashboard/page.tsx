"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  Sparkles,
  Layers,
  ArrowUpRight,
  Database,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [approvals, setApprovals] = useState([
    {
      id: "app-1",
      title: "Approve Senior Backend Engineer Offer",
      department: "Talent",
      risk: "HIGH",
      details: "Base salary $145,000/yr + 0.25% equity grant.",
    },
    {
      id: "app-2",
      title: "Adjust Marketing Spend Limit",
      department: "Finance",
      risk: "MEDIUM",
      details: "Increase Google Ads monthly budget from $5,000 to $8,500.",
    },
  ]);

  const [decisions, setDecisions] = useState([
    {
      id: "dec-1",
      title: "Approved Q3 Infrastructure Migration to Cloud Run",
      agent: "CEO Planner",
      date: "Today, 10:42 AM",
    },
    {
      id: "dec-2",
      title: "Optimized SaaS Subscription Costs (Saved $1,200/mo)",
      agent: "Finance Agent",
      date: "Yesterday, 3:15 PM",
    },
    {
      id: "dec-3",
      title: "Indexed 14 Product Spec PDFs in RAG Knowledge Engine",
      agent: "RAG Engine",
      date: "Jul 29, 2026",
    },
  ]);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Executive Startup OS Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time status, health metrics, and human approval queue.
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
            Finance, Growth, Talent, Operations, CEO
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

      {/* Main Grid: Approvals & Decision Logs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Approval Queue & Agent Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approval Queue Widget */}
          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold">Human Approval Queue</h2>
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
                {approvals.length} Pending
              </span>
            </div>

            {approvals.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                No pending approval actions required. All executive tasks cleared.
              </div>
            ) : (
              <div className="space-y-3">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-accent/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {item.department}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => handleAction(item.id, "reject")}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs rounded-lg shadow-sm"
                        onClick={() => handleAction(item.id, "approve")}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Departmental Status Grid */}
          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="text-lg font-bold">Executive Sub-Agent Status</h2>
              <span className="text-xs text-muted-foreground">Google ADK Architecture</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "CEO Planner Agent", status: "ONLINE", tasks: "Orchestrating workflows" },
                { name: "Finance Agent", status: "ONLINE", tasks: "Monitoring burn rate" },
                { name: "Growth Agent", status: "ONLINE", tasks: "Tracking acquisition metrics" },
                { name: "Talent Agent", status: "IDLE", tasks: "Awaiting approval action" },
              ].map((agent, i) => (
                <div key={i} className="p-3 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between">
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
                <div key={item.id} className="p-3 rounded-xl border border-border/40 bg-muted/20 space-y-1 text-xs">
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
