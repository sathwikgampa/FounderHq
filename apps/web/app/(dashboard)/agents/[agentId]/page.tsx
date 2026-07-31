'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Wrench,
  CheckCircle2,
  ArrowLeft,
  Send,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  CircleDollarSign,
  TrendingUp,
  Scale,
  Users,
  Handshake,
  Loader2,
  Terminal,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { fetchApi } from '@/services/api-client';
import { toast } from 'sonner';

interface AgentInfo {
  id: string;
  title: string;
  role: string;
  model: string;
  tool_used: string;
  description: string;
  key_capabilities: string[];
  status: string;
  default_prompt: string;
}

// Client-side fallback dictionary for offline/instant rendering
const LOCAL_AGENTS_FALLBACK: Record<string, AgentInfo> = {
  ceo: {
    id: 'ceo',
    title: 'CEO Agent (Incubator Lead)',
    role: 'Root Orchestrator & Strategy Synthesizer',
    model: 'gemini-2.5-pro',
    tool_used: 'analyze_and_route_workflow',
    description:
      'Serves as your primary AI Co-Founder interface. Parses raw commands, delegates tasks across all departments, and synthesizes outputs into clean execution plans.',
    key_capabilities: [
      '30-Day Launch Blueprint Generation',
      'Multi-Agent Workflow Delegation',
      'Strategic Alignment',
    ],
    status: 'ACTIVE',
    default_prompt: 'Create a 30-day 0-to-1 incubator launch plan for my B2B AI startup idea.',
  },
  product: {
    id: 'product',
    title: 'Product Agent (Head of MVP)',
    role: 'MVP Scoping & Technical Architecture',
    model: 'gemini-2.5-flash',
    tool_used: 'generate_mvp_spec',
    description:
      'Trims product scope down to essential V1 features so you can ship an MVP in 14 days without wasting development cycles.',
    key_capabilities: [
      '14-Day MVP Tech Stack Selection',
      'Scope Trimming',
      'Feature Prioritization',
    ],
    status: 'ACTIVE',
    default_prompt: 'Trim feature scope and recommend a 14-day tech stack for our MVP.',
  },
  growth: {
    id: 'growth',
    title: 'Growth Agent (Head of GTM & Sales)',
    role: 'Customer Acquisition & Outreach',
    model: 'gemini-2.5-flash',
    tool_used: 'build_gtm_launch_plan',
    description:
      'Designs pre-launch waitlist campaigns, drafts cold email/LinkedIn outreach templates, and projects initial monthly sales targets.',
    key_capabilities: [
      'Ideal Customer Profile (ICP) Targeting',
      'Cold Email Generation',
      'Pre-Launch Sales Forecasting',
    ],
    status: 'ACTIVE',
    default_prompt: 'Build a pre-launch GTM campaign with ICP targets and cold email scripts.',
  },
  finance: {
    id: 'finance',
    title: 'Finance Agent (CFO)',
    role: 'Lean Budgeting & Runway Management',
    model: 'gemini-2.5-flash',
    tool_used: 'calculate_bootstrap_runway',
    description:
      'Calculates zero-revenue capital runway, enforces safe monthly software expenditure limits, and protects bootstrap cash flow.',
    key_capabilities: [
      'Burn Rate & Runway Calculation',
      'Software Tool Budgeting',
      'Cash Safety Warnings',
    ],
    status: 'ACTIVE',
    default_prompt: 'Calculate runway with $250,000 capital and $15,000 monthly burn.',
  },
  legal: {
    id: 'legal',
    title: 'Legal & HR Agent (General Counsel)',
    role: 'Equity Vesting & Contract Risk Audit',
    model: 'gemini-2.5-flash',
    tool_used: 'generate_incorporation_checklist',
    description:
      'Generates standard founder equity vesting terms (4-year / 1-year cliff), NDA templates, IP assignment agreements, and incorporation checklists.',
    key_capabilities: [
      'Founder Equity Vesting Setup',
      'IP Protection',
      'Human Approval Queue Flagging',
    ],
    status: 'ACTIVE',
    default_prompt:
      'Generate incorporation checklist and equity vesting terms for Delaware C-Corp.',
  },
  hr: {
    id: 'hr',
    title: 'Talent & HR Agent (Head of People)',
    role: 'Headcount Planning & Compensation',
    model: 'gemini-2.5-flash',
    tool_used: 'draft_job_posting',
    description:
      'Drafts structured job descriptions for technical hires and evaluates monthly burn impacts prior to human approval.',
    key_capabilities: [
      'Technical Role Description Drafting',
      'Salary Burn Impact Analysis',
      'Approval Queue Routing',
    ],
    status: 'ACTIVE',
    default_prompt:
      'Draft job description and evaluate monthly burn impact for a $140,000 Senior AI Engineer.',
  },
  talent: {
    id: 'talent',
    title: 'Talent Agent (Head of HR)',
    role: 'Headcount Planning & Job Specifications',
    model: 'gemini-2.5-flash',
    tool_used: 'draft_job_posting',
    description:
      'Drafts structured job descriptions for technical hires and evaluates monthly burn impacts prior to human approval.',
    key_capabilities: [
      'Technical Role Description Drafting',
      'Salary Burn Impact Analysis',
      'Approval Queue Routing',
    ],
    status: 'ACTIVE',
    default_prompt:
      'Draft job description and evaluate monthly burn impact for a $140,000 Senior AI Engineer.',
  },
  sales: {
    id: 'sales',
    title: 'Sales Agent (Head of Sales)',
    role: 'B2B Deal Scoring & Pricing Strategy',
    model: 'gemini-2.5-flash',
    tool_used: 'evaluate_lead_and_pricing',
    description:
      'Scores enterprise B2B sales leads, calculates tiered seat volume discounts, and flags high-value deals.',
    key_capabilities: [
      'Lead Tier Priority Scoring',
      'Volume Discount Modeling',
      'Deal Approval Gatekeeping',
    ],
    status: 'ACTIVE',
    default_prompt: 'Score B2B sales lead for 60 seats at $20,000 contract value.',
  },
};

const AGENT_ICON_MAP: Record<string, React.ElementType> = {
  ceo: Bot,
  product: Layers,
  growth: TrendingUp,
  finance: CircleDollarSign,
  legal: Scale,
  hr: Users,
  talent: Users,
  sales: Handshake,
};

const AGENT_COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> =
  {
    ceo: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'rgba(168, 85, 247, 0.25)',
    },
    product: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'rgba(99, 102, 241, 0.25)',
    },
    growth: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    finance: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'rgba(59, 130, 246, 0.25)',
    },
    legal: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    hr: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'rgba(244, 63, 94, 0.25)',
    },
    talent: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'rgba(244, 63, 94, 0.25)',
    },
    sales: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      glow: 'rgba(236, 72, 153, 0.25)',
    },
  };

export default function AgentInfoScreen({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const router = useRouter();
  const slug = (agentId || 'ceo').toLowerCase();

  const [agent, setAgent] = useState<AgentInfo | null>(LOCAL_AGENTS_FALLBACK[slug] || null);
  const [loading, setLoading] = useState<boolean>(!LOCAL_AGENTS_FALLBACK[slug]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAgentMetadata() {
      try {
        const data = await fetchApi<AgentInfo>(`/api/v1/agents/${slug}`);
        if (isMounted && data) {
          setAgent(data);
          setError(null);
        }
      } catch (err: unknown) {
        console.warn(`Could not fetch remote metadata for agent '${slug}':`, err);
        if (isMounted) {
          if (LOCAL_AGENTS_FALLBACK[slug]) {
            setAgent(LOCAL_AGENTS_FALLBACK[slug]);
          } else {
            setError(`Agent '${slug}' not found in FounderHQ registry.`);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAgentMetadata();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleRunDepartmentCheck = () => {
    if (!agent) return;
    toast.success(`Initializing Department Check for ${agent.title}`, { icon: '⚡' });
    const promptText = encodeURIComponent(
      agent.default_prompt || `Run department check for ${agent.title}`,
    );
    router.push(`/dashboard?prompt=${promptText}`);
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-24 text-center">
        <Loader2 size={32} className="text-[#7C5CFF] animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Fetching agent specs & model parameters...</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-24 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
          <Bot size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white">Agent Not Found</h1>
        <p className="text-slate-400 text-sm max-w-md">{error || `Invalid agent ID '${slug}'`}</p>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all"
        >
          <ArrowLeft size={14} /> Back to Agents Directory
        </Link>
      </div>
    );
  }

  const IconComponent = AGENT_ICON_MAP[slug] || Bot;
  const themeColors = AGENT_COLOR_MAP[slug] || AGENT_COLOR_MAP.ceo;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb / Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Executive Agents
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            {agent.status || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Header Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlowCard glowColor={themeColors.glow} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${themeColors.bg} border ${themeColors.border} flex items-center justify-center shrink-0 shadow-lg`}
              >
                <IconComponent size={30} className={themeColors.text} />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {agent.title}
                  </h1>
                  {/* Gemini Model Badge Tag */}
                  <span className="px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
                    <Cpu size={13} />
                    {agent.model}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-300">{agent.role}</p>
              </div>
            </div>

            {/* Run Department Check CTA Button */}
            <button
              onClick={handleRunDepartmentCheck}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-indigo-600 hover:from-[#6b49f3] hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-[#7C5CFF]/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Zap size={16} className="text-amber-300" />
              <span>Run Department Check</span>
            </button>
          </div>
        </GlowCard>
      </motion.div>

      {/* Overview Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: What I Do (Overview) & Connected Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: What I Do */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <GlowCard className="p-6">
              <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">What I Do</h3>
                  <p className="text-xs text-slate-400">Core executive responsibilities</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                {agent.description}
              </p>
            </GlowCard>
          </motion.div>

          {/* Card 2: Connected Tools & Automation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlowCard glowColor="rgba(124, 92, 255, 0.15)" className="p-6">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Connected Tools & Automation</h3>
                    <p className="text-xs text-slate-400">
                      Deterministic engine functions executed by this agent
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
                  AUTOMATED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Terminal size={14} className="text-[#7C5CFF]" />
                    Primary Tool Function:
                  </span>
                  <span className="text-xs font-semibold text-[#7C5CFF] bg-[#7C5CFF]/10 px-2.5 py-1 rounded-md border border-[#7C5CFF]/30">
                    {agent.tool_used || 'analyze_and_route_workflow'}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs text-slate-400 space-y-1 font-sans">
                  <p>
                    <strong className="text-slate-200">Execution Mode:</strong> Standardized
                    single-call tool with validated JSON schemas and guardrail enforcement.
                  </p>
                  <p>
                    <strong className="text-slate-200">Approval Queue Integration:</strong> Direct
                    telemetry hooks into human-in-the-loop review for critical actions.
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Right Column: Key Capabilities & Prompt Template */}
        <div className="space-y-6">
          {/* Card 3: Key Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <GlowCard glowColor={themeColors.glow} className="p-6">
              <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Key Capabilities</h3>
                  <p className="text-xs text-slate-400">Specialized startup competencies</p>
                </div>
              </div>

              <ul className="space-y-3">
                {agent.key_capabilities.map((capability, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-200 leading-relaxed">
                      {capability}
                    </span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </motion.div>

          {/* Quick Query Launch Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <GlowCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Send size={14} className="text-[#7C5CFF]" />
                  Pre-Configured Department Query
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/10">
                &quot;{agent.default_prompt}&quot;
              </p>

              <button
                onClick={handleRunDepartmentCheck}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all border border-white/10"
              >
                <Zap size={14} className="text-amber-400" />
                Launch Query in Copilot
              </button>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
