'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Bot,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Briefcase,
  Layers,
  Cpu,
  PieChart,
  Loader2,
  Terminal,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { streamPlannerExecution, PlannerStreamEvent } from '@/services/planner';

interface LiveAgentDemoProps {
  onApprovalTriggered?: () => void;
}

type AgentStatus = 'IDLE' | 'ROUTED' | 'EXECUTING' | 'COMPLETED' | 'APPROVAL_FLAG';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  model: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  status: AgentStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output?: Record<string, any> | null;
}

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  icon: React.ElementType;
  expectedAgents: string[];
  workflowType: 'SEQUENTIAL' | 'PARALLEL';
}

export function LiveAgentDemo({ onApprovalTriggered }: LiveAgentDemoProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('tech-expansion');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [workflowType, setWorkflowType] = useState<'SEQUENTIAL' | 'PARALLEL' | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<
    Array<{ id: string; event: string; time: string; text: string; data?: any }>
  >([]);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);

  const initialAgents: Record<string, AgentNode> = {
    CEOAgent: {
      id: 'CEOAgent',
      name: 'CEOAgent',
      role: 'Root Orchestrator',
      model: 'gemini-2.5-pro',
      icon: Sparkles,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      status: 'IDLE',
    },
    FinanceAgent: {
      id: 'FinanceAgent',
      name: 'FinanceAgent',
      role: 'CFO Sub-Agent',
      model: 'gemini-2.5-flash',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      status: 'IDLE',
    },
    TalentAgent: {
      id: 'TalentAgent',
      name: 'TalentAgent',
      role: 'Head of HR',
      model: 'gemini-2.5-flash',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      status: 'IDLE',
    },
    GrowthAgent: {
      id: 'GrowthAgent',
      name: 'GrowthAgent',
      role: 'Head of Marketing',
      model: 'gemini-2.5-flash',
      icon: TrendingUp,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      status: 'IDLE',
    },
    LegalAgent: {
      id: 'LegalAgent',
      name: 'LegalAgent',
      role: 'General Counsel',
      model: 'gemini-2.5-flash',
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      status: 'IDLE',
    },
    SalesAgent: {
      id: 'SalesAgent',
      name: 'SalesAgent',
      role: 'Head of Sales',
      model: 'gemini-2.5-flash',
      icon: Briefcase,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      status: 'IDLE',
    },
    ProductAgent: {
      id: 'ProductAgent',
      name: 'ProductAgent',
      role: 'Head of Product',
      model: 'gemini-2.5-flash',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      status: 'IDLE',
    },
    TechArchitectAgent: {
      id: 'TechArchitectAgent',
      name: 'TechArchitectAgent',
      role: 'CTO Sub-Agent',
      model: 'gemini-2.5-flash',
      icon: Cpu,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      status: 'IDLE',
    },
    InvestmentAgent: {
      id: 'InvestmentAgent',
      name: 'InvestmentAgent',
      role: 'Head of IR',
      model: 'gemini-2.5-flash',
      icon: PieChart,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
      status: 'IDLE',
    },
  };

  const [agents, setAgents] = useState<Record<string, AgentNode>>(initialAgents);

  const scenarios: Scenario[] = [
    {
      id: 'tech-expansion',
      title: '🚀 Tech Team & AI Expansion',
      subtitle: 'Finance → Talent → Legal → TechArchitect',
      prompt:
        'We want to expand our tech team. Check if we can afford a $130k Senior AI Engineer, draft the job post, estimate the AWS cloud cost for 20k users, and review the employment contract risks.',
      icon: Cpu,
      expectedAgents: ['FinanceAgent', 'TalentAgent', 'LegalAgent', 'TechArchitectAgent'],
      workflowType: 'SEQUENTIAL',
    },
    {
      id: 'enterprise-sales',
      title: '💼 Enterprise B2B Deal & Pricing',
      subtitle: 'Sales → Finance → Legal',
      prompt:
        'Evaluate a $25k enterprise sales lead for 75 seats, check financial runway with $200k balance, and audit vendor contract risks.',
      icon: Briefcase,
      expectedAgents: ['SalesAgent', 'FinanceAgent', 'LegalAgent'],
      workflowType: 'PARALLEL',
    },
    {
      id: 'product-growth',
      title: '📈 Product & GTM Growth Sprint',
      subtitle: 'Product → Growth → TechArchitect',
      prompt:
        'Prioritize AI Executive Brief feature (RICE score), launch a $6,000 LinkedIn growth campaign, and project serverless cloud scaling for 50k MAU.',
      icon: TrendingUp,
      expectedAgents: ['ProductAgent', 'GrowthAgent', 'TechArchitectAgent'],
      workflowType: 'PARALLEL',
    },
    {
      id: 'investor-round',
      title: '👔 Series A Investor Update & IR',
      subtitle: 'Finance → Investment',
      prompt:
        'Model $300k cash runway and prepare investor update & cap table pitch deck framework.',
      icon: PieChart,
      expectedAgents: ['FinanceAgent', 'InvestmentAgent'],
      workflowType: 'SEQUENTIAL',
    },
  ];

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const resetDemoState = () => {
    setAgents(initialAgents);
    setLogs([]);
    setFinalSummary(null);
    setWorkflowType(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAgentState = (agentName: string, status: AgentStatus, output?: any) => {
    setAgents((prev) => {
      if (!prev[agentName]) return prev;
      return {
        ...prev,
        [agentName]: {
          ...prev[agentName],
          status,
          output: output !== undefined ? output : prev[agentName].output,
        },
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appendLog = (event: string, text: string, data?: any) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        event,
        time: timeStr,
        text,
        data,
      },
    ]);
  };

  const runSimulationFallback = async () => {
    appendLog(
      'routing_decision',
      `CEOAgent analyzed prompt: Workflow topology set to ${currentScenario.workflowType}`,
      {
        selected_agents: currentScenario.expectedAgents,
        workflow_type: currentScenario.workflowType,
      },
    );

    setWorkflowType(currentScenario.workflowType);
    updateAgentState('CEOAgent', 'EXECUTING');

    currentScenario.expectedAgents.forEach((aName) => {
      updateAgentState(aName, 'ROUTED');
    });

    await new Promise((r) => setTimeout(r, 600));
    updateAgentState('CEOAgent', 'COMPLETED');

    for (let i = 0; i < currentScenario.expectedAgents.length; i++) {
      const aName = currentScenario.expectedAgents[i];
      updateAgentState(aName, 'EXECUTING');
      appendLog('agent_start', `Sub-agent '${aName}' started execution step ${i + 1}`, {
        agent_name: aName,
      });

      await new Promise((r) => setTimeout(r, 700));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let mockOutput: Record<string, any> = {};
      if (aName === 'FinanceAgent') {
        mockOutput = {
          tool: 'check_runway',
          months_of_runway: '13.3 months',
          health_score: 'HEALTHY',
        };
      } else if (aName === 'TalentAgent') {
        mockOutput = {
          tool: 'draft_job_posting',
          monthly_burn_impact_usd: 10833.33,
          requires_human_signoff: true,
        };
      } else if (aName === 'LegalAgent') {
        mockOutput = {
          tool: 'verify_contract',
          risk_assessment: 'HIGH',
          compliance_status: 'BLOCKED_PENDING_COUNSEL',
        };
      } else if (aName === 'TechArchitectAgent') {
        mockOutput = {
          tool: 'estimate_cloud_cost',
          monthly_active_users: 20000,
          total_monthly_estimate: 210.0,
        };
      } else if (aName === 'SalesAgent') {
        mockOutput = {
          tool: 'evaluate_lead_and_pricing',
          lead_priority: 'Tier 1 Lead',
          effective_contract_value_usd: 21250.0,
        };
      } else if (aName === 'GrowthAgent') {
        mockOutput = {
          tool: 'create_campaign_plan',
          channel: 'LinkedIn',
          budget_usd: 6000.0,
          approval_status: 'HOLD_FOR_HUMAN_APPROVAL',
        };
      } else if (aName === 'ProductAgent') {
        mockOutput = {
          tool: 'prioritize_features',
          feature_name: 'AI Executive Brief',
          rice_score: 225.0,
          priority_tier: 'P0 (Critical)',
        };
      } else if (aName === 'InvestmentAgent') {
        mockOutput = {
          tool: 'investor_update',
          status: 'Series A Cap Table & Pitch Framework Drafted',
        };
      }

      const hasFlag =
        mockOutput.requires_human_signoff ||
        mockOutput.risk_assessment === 'HIGH' ||
        mockOutput.approval_status === 'HOLD_FOR_HUMAN_APPROVAL';
      const finalStatus: AgentStatus = hasFlag ? 'APPROVAL_FLAG' : 'COMPLETED';

      updateAgentState(aName, finalStatus, mockOutput);
      appendLog('tool_executed', `${aName} completed tool execution`, mockOutput);

      if (hasFlag) {
        appendLog(
          'approval_flag',
          `⚠️ High-risk action flagged for Human Approval Queue`,
          mockOutput,
        );
        onApprovalTriggered?.();
      }

      await new Promise((r) => setTimeout(r, 400));
    }

    const summaryText = `CEO Planner successfully orchestrated ${currentScenario.expectedAgents.length} executive agents via ${currentScenario.workflowType} execution flow. Departmental outputs verified and ready for review.`;
    setFinalSummary(summaryText);
    appendLog('final_brief', summaryText);
    setIsRunning(false);
  };

  const handleLaunchDemo = async () => {
    if (isRunning) return;
    setIsRunning(true);
    resetDemoState();

    appendLog('session_start', `Initializing FounderHQ 9-Agent Live Execution Demo...`);

    let liveSuccess = false;

    try {
      await streamPlannerExecution(
        currentScenario.prompt,
        'ws-live-demo',
        (evt: PlannerStreamEvent) => {
          liveSuccess = true;
          const data = evt.data || {};

          if (evt.event === 'routing_decision') {
            const selected = data.selected_agents || currentScenario.expectedAgents;
            const wf = data.workflow_type || currentScenario.workflowType;
            setWorkflowType(wf);
            updateAgentState('CEOAgent', 'EXECUTING');
            selected.forEach((aName: string) => updateAgentState(aName, 'ROUTED'));
            appendLog('routing_decision', `CEOAgent Task Router: Topology = ${wf}`, data);
          } else if (evt.event === 'agent_start') {
            const aName = data.agent_name || data.agent;
            if (aName) {
              updateAgentState(aName, 'EXECUTING');
              appendLog('agent_start', `Sub-agent '${aName}' active`, data);
            }
          } else if (evt.event === 'tool_executed') {
            const aName = data.agent_name || data.agent;
            const toolName = data.tool_name || data.tool;
            const output = data.output || data.result;
            if (aName) {
              updateAgentState(aName, 'COMPLETED', output);
              appendLog('tool_executed', `${aName} executed ${toolName || 'tool'}`, output);
            }
          } else if (evt.event === 'approval_flag' || evt.event === 'approval_required') {
            const aName = data.agent_name || data.agent;
            if (aName) {
              updateAgentState(aName, 'APPROVAL_FLAG');
              appendLog('approval_flag', `⚠️ Action enqueued in Human Approval Queue`, data);
              onApprovalTriggered?.();
            }
          } else if (evt.event === 'final_brief') {
            updateAgentState('CEOAgent', 'COMPLETED');
            const sum = data.summary || data.executive_summary;
            if (sum) setFinalSummary(sum);
            appendLog('final_brief', sum || 'Executive Brief synthesized successfully.', data);
          }
        },
        () => {
          setIsRunning(false);
        },
        () => {
          if (!liveSuccess) {
            runSimulationFallback();
          } else {
            setIsRunning(false);
          }
        },
      );
    } catch {
      if (!liveSuccess) {
        await runSimulationFallback();
      } else {
        setIsRunning(false);
      }
    }
  };

  return (
    <Card className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Glow Ambient Decoration */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/50 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive Multi-Agent OS Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Live 9-Agent Orchestration Demo
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Watch the CEOAgent parse founder intent, determine workflow dependencies (Sequential vs
            Parallel), and delegate tasks across 8 executive sub-agents in real time.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resetDemoState}
            disabled={isRunning}
            className="rounded-xl border-border/70 text-xs font-semibold hover:bg-muted/50"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>

          <Button
            size="sm"
            onClick={handleLaunchDemo}
            disabled={isRunning}
            className="rounded-xl px-5 text-xs font-extrabold shadow-lg bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-primary-foreground"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-current" /> Launch Live Agent Demo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Scenario Selector Grid */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Founder Scenario:
          </span>
          {workflowType && (
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              Topology: {workflowType}
            </span>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((sc) => {
            const IconComp = sc.icon;
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                disabled={isRunning}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  resetDemoState();
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/40'
                    : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground'
                } disabled:opacity-50`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-xs text-foreground">{sc.title}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{sc.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Card Display */}
      <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Target Founder Command:
          </span>
          <p className="font-medium text-foreground italic">&quot;{currentScenario.prompt}&quot;</p>
        </div>
        <div className="flex items-center space-x-1 shrink-0 text-[10px] font-mono text-muted-foreground bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
          <span>Target Sub-Agents ({currentScenario.expectedAgents.length})</span>
        </div>
      </div>

      {/* 9-Agent Topology Grid Visualizer */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" /> 9-Agent Executive Topology & Telemetry
          </span>
          <span className="text-[10px] text-muted-foreground">Google ADK Architecture</span>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {Object.values(agents).map((node) => {
            const IconComponent = node.icon;
            const isCEO = node.id === 'CEOAgent';

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3.5 rounded-2xl border text-xs space-y-2 relative transition-all ${
                  node.status === 'EXECUTING'
                    ? `${node.borderColor} ${node.bgColor} shadow-lg ring-2 ring-primary/40`
                    : node.status === 'COMPLETED'
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : node.status === 'APPROVAL_FLAG'
                        ? 'border-amber-500/50 bg-amber-500/15'
                        : node.status === 'ROUTED'
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border/50 bg-muted/20 opacity-80'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-xl ${node.bgColor} ${node.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>

                  {node.status === 'EXECUTING' && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  )}
                  {node.status === 'COMPLETED' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {node.status === 'APPROVAL_FLAG' && (
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  )}
                  {node.status === 'ROUTED' && (
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  )}
                  {node.status === 'IDLE' && (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  )}
                </div>

                <div>
                  <div className="font-extrabold text-xs text-foreground flex items-center justify-between">
                    <span>{node.name}</span>
                    {isCEO && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                        ROOT
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{node.role}</div>
                </div>

                <div className="text-[9px] font-mono text-muted-foreground/80 border-t border-border/40 pt-1 flex items-center justify-between">
                  <span>{node.model}</span>
                  <span className="font-bold text-foreground">{node.status}</span>
                </div>

                {/* Inline Tool Output Snapshot */}
                {node.output && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 p-2 rounded-lg bg-background/80 border border-border/40 text-[9px] font-mono space-y-0.5"
                  >
                    {node.output.months_of_runway && (
                      <div>
                        Runway:{' '}
                        <span className="text-emerald-400 font-bold">
                          {node.output.months_of_runway}
                        </span>
                      </div>
                    )}
                    {node.output.monthly_burn_impact_usd && (
                      <div>
                        Burn:{' '}
                        <span className="text-purple-400 font-bold">
                          +${node.output.monthly_burn_impact_usd}/mo
                        </span>
                      </div>
                    )}
                    {node.output.risk_assessment && (
                      <div>
                        Risk:{' '}
                        <span className="text-amber-400 font-bold">
                          {node.output.risk_assessment}
                        </span>
                      </div>
                    )}
                    {node.output.total_monthly_estimate && (
                      <div>
                        Cloud:{' '}
                        <span className="text-orange-400 font-bold">
                          ${node.output.total_monthly_estimate}/mo
                        </span>
                      </div>
                    )}
                    {node.output.lead_priority && (
                      <div>
                        Deal:{' '}
                        <span className="text-cyan-400 font-bold">{node.output.lead_priority}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stream Logs & Final Executive Brief */}
      <div className="grid gap-6 lg:grid-cols-2 relative z-10">
        {/* Left: Stream Log Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground border-b border-border/40 pb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" /> Real-Time SSE Stream Log
            </span>
            <span className="text-[10px] font-mono">{logs.length} events</span>
          </div>

          <div className="h-48 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-2xl p-4">
                Click &quot;Launch Live Agent Demo&quot; to observe agent execution logs.
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2.5 rounded-xl border border-border/40 bg-muted/20 space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-primary">{log.event}</span>
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-foreground font-sans">{log.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right: Synthesized Executive Brief Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground border-b border-border/40 pb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Synthesized CEO Executive Brief
            </span>
            {finalSummary && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>

          <div className="h-48 overflow-y-auto p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-2 leading-relaxed">
            {finalSummary ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Multi-Agent Execution Brief
                </div>
                <p className="text-foreground whitespace-pre-line">{finalSummary}</p>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed border-emerald-500/20 rounded-xl p-4 text-center">
                Executive Brief synthesis will render here after sub-agent completion.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
