'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Wrench,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  CircleDollarSign,
  TrendingUp,
  Scale,
  Users,
  Handshake,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface AgentDetails {
  id: string;
  name: string;
  role: string;
  model: string;
  tool: string;
  description: string;
  capabilities: string[];
  defaultPrompt?: string;
}

const AGENTS_REGISTRY: Record<string, AgentDetails> = {
  ceo: {
    id: 'ceo',
    name: 'CEO Agent',
    role: 'Root Orchestrator & Strategy Synthesizer',
    model: 'gemini-2.5-pro',
    tool: 'analyze_and_route_workflow',
    description:
      'Serves as your primary AI Co-Founder interface. Parses raw commands, delegates tasks across all departments, and synthesizes outputs into clean execution plans.',
    capabilities: [
      '30-Day Launch Blueprint Generation',
      'Multi-Agent Workflow Delegation',
      'Strategic Alignment & Executive Syntheses',
    ],
    defaultPrompt: 'Create a 30-day 0-to-1 incubator launch plan for my B2B AI startup idea.',
  },
  product: {
    id: 'product',
    name: 'Product Agent',
    role: 'Head of MVP & Architecture',
    model: 'gemini-2.5-flash',
    tool: 'generate_mvp_spec',
    description:
      'Trims product scope down to essential V1 features so you can ship an MVP in 14 days without wasting development cycles.',
    capabilities: [
      '14-Day MVP Tech Stack Selection',
      'Scope Trimming & Feature Prioritization',
      'Feature Backlog Generation',
    ],
    defaultPrompt: 'Trim feature scope and recommend a 14-day tech stack for our MVP.',
  },
  growth: {
    id: 'growth',
    name: 'Growth Agent',
    role: 'Head of GTM & Marketing',
    model: 'gemini-2.5-flash',
    tool: 'build_gtm_launch_plan',
    description:
      'Designs pre-launch waitlist campaigns, drafts cold email/LinkedIn outreach templates, and projects initial monthly sales targets.',
    capabilities: [
      'Ideal Customer Profile (ICP) Targeting',
      'Cold Email & Copy Generation',
      'Pre-Launch Sales Forecasting',
    ],
    defaultPrompt: 'Build a pre-launch GTM campaign with ICP targets and cold email scripts.',
  },
  finance: {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Virtual CFO & Runway Optimization',
    model: 'gemini-2.5-flash',
    tool: 'calculate_bootstrap_runway',
    description:
      'Calculates zero-revenue capital runway, enforces safe monthly software expenditure limits, and protects bootstrap cash flow.',
    capabilities: [
      'Burn Rate & Runway Calculation',
      'Software Tool Budgeting',
      'Cash Safety & Financial Risk Warnings',
    ],
    defaultPrompt: 'Calculate runway with $250,000 capital and $15,000 monthly burn.',
  },
  legal: {
    id: 'legal',
    name: 'Legal & Governance Agent',
    role: 'General Counsel & Risk Audit',
    model: 'gemini-2.5-flash',
    tool: 'generate_incorporation_checklist',
    description:
      'Generates standard founder equity vesting terms (4-year / 1-year cliff), Mutual NDAs, IP assignment agreements, and incorporation checklists.',
    capabilities: [
      'Founder Equity Vesting Setup',
      'IP Protection & Mutual NDA Generation',
      'Human Approval Queue Flagging',
    ],
    defaultPrompt: 'Generate incorporation checklist and equity vesting terms for Delaware C-Corp.',
  },
  sales: {
    id: 'sales',
    name: 'Sales Agent',
    role: 'Head of B2B Sales & Lead Scoring',
    model: 'gemini-2.5-flash',
    tool: 'evaluate_lead_and_pricing',
    description:
      'Scores enterprise B2B sales leads, calculates tiered seat volume discounts, and flags high-value deals.',
    capabilities: [
      'Lead Tier Priority Scoring',
      'Volume Discount Modeling',
      'Deal Approval Gatekeeping',
    ],
    defaultPrompt: 'Score B2B sales lead for 60 seats at $20,000 contract value.',
  },
  hr: {
    id: 'hr',
    name: 'Talent & HR Agent',
    role: 'Head of People & Hiring',
    model: 'gemini-2.5-flash',
    tool: 'draft_job_posting',
    description:
      'Drafts structured job descriptions for technical hires and evaluates monthly burn impacts prior to human approval.',
    capabilities: [
      'Technical Role Description Drafting',
      'Salary Burn Impact Analysis',
      'Approval Queue Routing',
    ],
    defaultPrompt:
      'Draft job description and evaluate monthly burn impact for a $140,000 Senior AI Engineer.',
  },
};

const AGENT_ICON_MAP: Record<string, React.ElementType> = {
  ceo: Bot,
  product: Layers,
  growth: TrendingUp,
  finance: CircleDollarSign,
  legal: Scale,
  sales: Handshake,
  hr: Users,
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
    sales: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      glow: 'rgba(236, 72, 153, 0.25)',
    },
    hr: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'rgba(244, 63, 94, 0.25)',
    },
  };

export function AgentOverviewBanner({ agentId }: { agentId: string }) {
  const router = useRouter();
  const key = (agentId || 'ceo').toLowerCase();
  const details = AGENTS_REGISTRY[key] || AGENTS_REGISTRY.ceo;
  const Icon = AGENT_ICON_MAP[key] || Bot;
  const colors = AGENT_COLOR_MAP[key] || AGENT_COLOR_MAP.ceo;

  const handleRunQuery = () => {
    if (!details.defaultPrompt) return;
    toast.success(`Launching query for ${details.name}`, { icon: '⚡' });
    const promptText = encodeURIComponent(details.defaultPrompt);
    router.push(`/dashboard?prompt=${promptText}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <GlowCard glowColor={colors.glow} className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0 shadow-lg`}
              >
                <Icon size={32} className={colors.text} />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {details.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
                    <Cpu size={13} />
                    {details.model}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-300">{details.role}</p>
              </div>
            </div>

            <button
              onClick={handleRunQuery}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-indigo-600 hover:from-[#6b49f3] hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-[#7C5CFF]/20 transition-all shrink-0"
            >
              <Zap size={14} className="text-amber-300" />
              <span>Query Agent in Copilot</span>
            </button>
          </div>

          {/* Description & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                <Sparkles size={14} className="text-[#9D85FF]" />
                <span>Agent Mission & Responsibilities</span>
              </div>
              <p className="text-slate-100 text-sm leading-relaxed font-sans bg-white/5 p-4 rounded-xl border border-white/10 shadow-inner">
                {details.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pt-1 flex-wrap">
                <Wrench size={14} className="text-indigo-400" />
                <span className="font-semibold">Deterministic Engine Tool:</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-semibold shadow-sm">
                  {details.tool}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Key Competencies</span>
              </div>
              <ul className="space-y-2">
                {details.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-100 font-medium flex items-start gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10 shadow-sm"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
