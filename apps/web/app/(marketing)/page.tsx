'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Bot,
  Cpu,
  FileText,
  ChevronDown,
  CheckCircle2,
  Activity,
  Layers,
  HelpCircle,
  Building2,
  DollarSign,
  Play,
  Brain,
  Database,
  Lock,
  GitBranch,
  Check,
  Workflow,
  Compass,
} from 'lucide-react';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';
import { useAuth } from '@/providers/auth-provider';

export default function LandingPage() {
  const router = useRouter();
  const { loginAsDemo } = useAuth();

  // State Management
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [activeAgent, setActiveAgent] = useState<
    'planner' | 'finance' | 'growth' | 'talent' | 'operations'
  >('planner');
  const [onboardingMode, setOnboardingMode] = useState<'existing' | 'new'>('existing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'pending',
  );

  const handleDemoClick = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  // Preset Commands for Interactive Jarvis Simulator
  const presetCommands = [
    {
      label: 'Launch SaaS Product',
      command: 'Launch our SaaS MVP next month and coordinate all departments.',
      details: {
        departments: ['Finance', 'Talent', 'Growth', 'Operations'],
        steps: [
          'Finance: Checked burn rate ($42k/mo). Verified $15k allocation for launch budget.',
          'Talent: Approved hiring 2 Senior Engineers on AFFORDABLE status.',
          'Growth: Built 30-day multi-channel acquisition campaign checklist.',
          'Operations: Updated sprint roadmap to lock MVP code freeze by Day 20.',
        ],
        healthImpact: '+4% Growth, +2% Operations',
        requiresApproval: true,
      },
    },
    {
      label: 'Hire 2 Engineers',
      command: 'Hire 2 Senior Full-Stack Engineers for core platform development.',
      details: {
        departments: ['Finance', 'Talent', 'Operations'],
        steps: [
          'Finance: Analyzed 18.4-month runway. Verified headcount affordability.',
          'Talent: Generated job description & scored 4 initial candidate profiles.',
          'Operations: Assigned sprint backlog items for new engineering hires.',
        ],
        healthImpact: '+6% Hiring Capacity',
        requiresApproval: true,
      },
    },
    {
      label: 'Runway & Burn Check',
      command: 'Analyze our current monthly cash burn and 18-month runway projection.',
      details: {
        departments: ['Finance'],
        steps: [
          'Finance: Current burn rate is $42,000/mo with $772,800 cash reserve.',
          'Finance: Remaining runway is 18.4 months. No urgent budget cuts needed.',
        ],
        healthImpact: 'Finance Health 94% Stable',
        requiresApproval: false,
      },
    },
  ];

  // Executive Agent Descriptions
  const agentDetails = {
    planner: {
      title: 'CEO Planner Agent (Jarvis)',
      role: 'Orchestrator & Single Interface',
      description:
        'Translates high-level founder intent into structured tasks, activates required executive agents, queries RAG knowledge bases, and merges recommendations into a single approval plan.',
      metrics: ['100% Intent Routing', 'Zero Direct Agent Overhead', 'Explainable RAG Context'],
      output:
        'Parsed Founder Intent: Launch SaaS MVP. Activating Finance, Talent, Growth, and Operations sub-agents. Grounding decisions in Startup Memory.',
    },
    finance: {
      title: 'Virtual CFO Agent',
      role: 'Financial Governance & Runway Analysis',
      description:
        'Monitors burn rate, forecasts cash flow, models hiring affordability, and ensures financial sustainability before any high-risk action is taken.',
      metrics: ['18.4 Months Runway', '$42,000/mo Burn Rate', '$772,800 Cash Reserve'],
      output:
        'Financial Assessment: Hiring 2 Senior Engineers reduces remaining runway from 18.4 to 16.8 months. Status: AFFORDABLE.',
    },
    talent: {
      title: 'Head of Talent Agent',
      role: 'Hiring Workflows & Candidate Evaluation',
      description:
        'Generates tailored job descriptions, ranks candidate resumes against technical requirements, structures interview loops, and proposes hiring plans.',
      metrics: ['4 Scored Candidates', 'JD Generated', 'Interview Pipeline Active'],
      output:
        'Talent Proposal: Senior Lead Engineer JD created. Scored 4 candidates with >90% match. Awaiting founder approval to issue technical assessments.',
    },
    growth: {
      title: 'Head of Growth Agent',
      role: 'GTM Strategy & Acquisition Loops',
      description:
        'Develops go-to-market strategies, plans multi-channel acquisition campaigns, tracks conversion funnels, and forecasts user acquisition.',
      metrics: ['+24% MoM Referral Conversion', 'GTM Checklist Active', '3 Launch Loops'],
      output:
        'Growth Strategy: Built 30-day multi-channel launch checklist. Referral loop optimization projected to increase acquisition by 28%.',
    },
    operations: {
      title: 'Head of Operations Agent',
      role: 'Sprint Execution & Roadmap Alignment',
      description:
        'Decomposes goals into sprint milestones, assigns execution tasks across team sub-systems, tracks progress, and updates company roadmaps.',
      metrics: ['14 Active Tasks', 'Sprint 14 in Progress', 'MVP Milestone Day 20'],
      output:
        'Operations Update: 14 backlog tasks categorized and assigned. MVP code freeze locked for Day 20. Execution timeline aligned.',
    },
  };

  // FAQ Items
  const faqs = [
    {
      question: 'What makes FounderHQ an AI Operating System rather than an AI chatbot?',
      answer:
        'Traditional AI assistants answer isolated prompts in silos. FounderHQ operates as an integrated operating system: founders communicate exclusively with a single CEO Planner Agent (Jarvis), which orchestrates specialized executive sub-agents (Finance, Talent, Growth, Operations), queries persistent Startup Memory, applies strict Human-in-the-Loop approval governance, and updates real-time Startup Health.',
    },
    {
      question: 'How does the single conversational interface model work?',
      answer:
        "You never manage multiple agent windows or fragmented AI interfaces. The CEO Planner Agent receives your command (e.g. 'Launch our SaaS next month'), identifies necessary departments, coordinates agent outputs internally, resolves trade-offs, and presents a single unified execution plan for your approval.",
    },
    {
      question: 'How does FounderHQ handle high-risk actions like spending or hiring?',
      answer:
        'FounderHQ enforces strict Human-in-the-Loop governance. Executive agents generate recommendations and execution plans, but high-risk actions (hiring candidates, modifying budgets, launching marketing spend, or updating public roadmaps) require your explicit approval in the Approval Center.',
    },
    {
      question: 'What is the technical architecture behind FounderHQ?',
      answer:
        'FounderHQ is built with a Clean Architecture foundation: FastAPI & Google Agent Development Kit (ADK) backend, Next.js 15 App Router frontend, Firebase Authentication, Firestore multi-tenant security rules, and multi-stage Docker containers ready for Google Cloud Run horizontal scaling.',
    },
    {
      question: 'How does Startup Memory and RAG document grounding work?',
      answer:
        "You can import existing business context (pitch decks, financial sheets, roadmaps, business plans). FounderHQ indexes these documents into a RAG Knowledge Engine and Startup Memory log, ensuring every recommendation is grounded in your company's actual historical context and metrics.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Ambient Grid Background & Glowing Radial Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-28 space-y-32">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="text-center space-y-8 pt-8 max-w-5xl mx-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md text-xs font-mono text-blue-400 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 fill-blue-400/20" />
            <span>FOUNDERHQ OS 1.0 — GOOGLE ADK + FASTAPI CLEAN ARCHITECTURE</span>
          </motion.div>

          {/* Headline (Inter 72px / -0.05em tracking) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-[-0.05em] bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent leading-[1.08] max-w-4xl mx-auto"
          >
            The AI Operating System for Startup Founders
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Stop managing fragmented AI assistants. Communicate with a single{' '}
            <span className="text-white font-semibold underline decoration-blue-500/50 underline-offset-4">
              CEO Planner Agent
            </span>{' '}
            that activates, coordinates, and governs specialized AI executives while keeping you in
            total control.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2.5 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-sm rounded-full px-8 py-3.5 shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Launch Instant Demo Mode</span>
              <ArrowRight className="h-4 w-4 text-neutral-950" />
            </button>

            <a
              href="#simulator"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-full px-7 py-3.5 border border-white/10 backdrop-blur-md transition-all"
            >
              <Play className="h-4 w-4 text-blue-400 fill-blue-400/20" />
              <span>Test Interactive Simulator</span>
            </a>
          </motion.div>

          {/* Key Value Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-6 text-xs text-neutral-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Single Conversational CEO Planner</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Human-in-the-Loop Risk Approvals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>RAG & Startup Memory Grounding</span>
            </div>
          </motion.div>
        </section>

        {/* ================= 2. INTERACTIVE JARVIS SIMULATOR ================= */}
        <section id="simulator" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <Brain className="h-3.5 w-3.5" />
              <span>JARVIS CEO PLANNER SIMULATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Experience the Executive Orchestration Engine
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
              Select a command below to watch how the CEO Planner Agent breaks down intent,
              activates required executive departments, and returns a unified approval request.
            </p>
          </div>

          <div className="fluxora-card p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-2xl">
            {/* Command Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pb-2">
              {presetCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCommandIndex(idx);
                    setApprovalStatus('pending');
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeCommandIndex === idx
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cmd.label}
                </button>
              ))}
            </div>

            {/* Simulated Command Box */}
            <div className="rounded-xl border border-white/10 bg-neutral-950/80 p-5 space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-neutral-400">
                    Founder Command Box v1.0
                  </span>
                </div>
                <span className="text-[10px] text-blue-400 uppercase font-mono">
                  Status: Active Orchestration
                </span>
              </div>

              <div className="flex items-start space-x-3 text-sm text-neutral-200">
                <span className="text-blue-400 font-bold select-none">&gt;</span>
                <p className="flex-1 text-white font-medium">
                  {presetCommands[activeCommandIndex].command}
                </p>
              </div>

              {/* Execution Pipeline Steps */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Workflow className="h-3.5 w-3.5 text-blue-400" />
                  <span>CEO Planner Decomposed Department Logs</span>
                </div>

                {presetCommands[activeCommandIndex].details.steps.map((step, sIdx) => (
                  <motion.div
                    key={sIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                    className="flex items-start space-x-2.5 text-xs text-neutral-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>

              {/* Approval Request Card */}
              {presetCommands[activeCommandIndex].details.requiresApproval && (
                <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-blue-400" /> Human Approval Required
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Impact: {presetCommands[activeCommandIndex].details.healthImpact}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300">
                    CEO Planner recommends executing this plan. High-risk actions will be queued
                    upon your approval.
                  </p>

                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => setApprovalStatus('approved')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        approvalStatus === 'approved'
                          ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {approvalStatus === 'approved' ? '✓ Plan Approved' : 'Approve Execution'}
                    </button>
                    <button
                      onClick={() => setApprovalStatus('rejected')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        approvalStatus === 'rejected'
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-400 border border-white/10'
                      }`}
                    >
                      {approvalStatus === 'rejected' ? 'Plan Rejected' : 'Reject Plan'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 3. PARTNER & ARCHITECTURE MARQUEE ================= */}
        <section className="space-y-6 overflow-hidden py-4 border-y border-white/10 bg-white/[0.01]">
          <div className="text-center text-xs font-mono uppercase tracking-widest text-neutral-500">
            Engineered on Enterprise Startup Architecture
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="animate-marquee space-x-12 items-center">
              {[
                'Google Agent Development Kit (ADK)',
                'FastAPI Clean Architecture',
                'Firebase Multi-Tenant Isolation',
                'Next.js 15 & React 19',
                'RAG Knowledge Engine',
                'Google Cloud Run Autoscaling',
                'Turborepo Monorepo Architecture',
                'Google Agent Development Kit (ADK)',
                'FastAPI Clean Architecture',
                'Firebase Multi-Tenant Isolation',
                'Next.js 15 & React 19',
                'RAG Knowledge Engine',
                'Google Cloud Run Autoscaling',
                'Turborepo Monorepo Architecture',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center space-x-3 text-xs font-mono text-neutral-400 shrink-0"
                >
                  <Cpu className="h-3.5 w-3.5 text-blue-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. CORE PLATFORM BENTO GRID ================= */}
        <section id="features" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <Layers className="h-3.5 w-3.5" />
              <span>PLATFORM ARCHITECTURE & FEATURES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Built for Scale, Precision, and Control
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
              FounderHQ solves the fragmented AI tool crisis by organizing company context,
              executive agents, and risk management into a unified system.
            </p>
          </div>

          {/* 12-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: CEO Planner (Span 8) */}
            <div className="md:col-span-8 fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="fluxora-pill bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Brain className="h-3.5 w-3.5" />
                  <span>SINGLE INTERACTION POINT</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  CEO Planner Agent (Jarvis)
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                  Instead of managing 10 different AI tools or pasting prompts across chat windows,
                  you communicate with Jarvis. The planner breaks down strategic goals, activates
                  department sub-systems, resolves conflicts, and prepares unified execution plans.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between items-center text-neutral-500 border-b border-white/10 pb-2">
                  <span>ORCHESTRATION PIPELINE</span>
                  <span className="text-emerald-400">STATUS: READY</span>
                </div>
                <div className="flex items-center justify-between text-neutral-200">
                  <span>1. Intent Analysis</span>
                  <span className="text-blue-400 font-bold">100% Confidence</span>
                </div>
                <div className="flex items-center justify-between text-neutral-200">
                  <span>2. RAG & Startup Memory Grounding</span>
                  <span className="text-blue-400 font-bold">Pitch Deck + Financials</span>
                </div>
                <div className="flex items-center justify-between text-neutral-200">
                  <span>3. Multi-Agent Synthesis</span>
                  <span className="text-blue-400 font-bold">Finance + Talent + Operations</span>
                </div>
              </div>
            </div>

            {/* Card 2: RAG & Startup Memory (Span 4) */}
            <div className="md:col-span-4 fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="fluxora-pill bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Database className="h-3.5 w-3.5" />
                  <span>CONTEXT PERSISTENCE</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  RAG & Startup Memory
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Import pitch decks, financial sheets, and roadmaps. Startup Memory indexes every
                  decision, command, approval, and health history so AI recommendations are grounded
                  in your real business metrics.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-400" /> Pitch Deck
                  </span>
                  <span className="text-emerald-400 font-mono">Indexed</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Financial Reports
                  </span>
                  <span className="text-emerald-400 font-mono">Indexed</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-indigo-400" /> Product Roadmap
                  </span>
                  <span className="text-emerald-400 font-mono">Indexed</span>
                </div>
              </div>
            </div>

            {/* Card 3: Human Approval Engine (Span 4) */}
            <div className="md:col-span-4 fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="fluxora-pill bg-rose-500/20 text-rose-300 border-rose-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>RISK GOVERNANCE</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Human-in-the-Loop Approvals
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  High-risk actions like spending marketing budget, extending job offers, or
                  altering launch timelines are never executed automatically. They require your
                  explicit approval in the Approval Center.
                </p>
              </div>

              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300 flex items-center justify-between">
                <span>Requires Approval: Spend $15k Marketing</span>
                <span className="font-bold uppercase tracking-wider text-[10px] bg-rose-500/20 px-2 py-0.5 rounded">
                  Queued
                </span>
              </div>
            </div>

            {/* Card 4: Multi-Tenant Security (Span 8) */}
            <div className="md:col-span-8 fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="fluxora-pill bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  <Lock className="h-3.5 w-3.5" />
                  <span>MULTI-TENANT ISOLATION</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Enterprise Tenant Isolation & RBAC
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                  Built with Firebase Authentication, FastAPI middleware token claim validation, and
                  strict Firestore security rules. Documents, memories, and workspace secrets remain
                  isolated across tenant boundaries.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-blue-400 font-bold text-sm">Firebase Auth</div>
                  <div className="text-[10px] text-neutral-400 mt-1">JWT Claim Scoping</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-emerald-400 font-bold text-sm">Firestore Rules</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Workspace Isolation</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-indigo-400 font-bold text-sm">Cloud Run</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Stateless Autoscaling</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. EXECUTIVE AGENT SANDBOX ================= */}
        <section id="agents" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <Users className="h-3.5 w-3.5" />
              <span>EXECUTIVE AGENT DEPARTMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Your Coordinated AI C-Suite
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
              Inspect the responsibilities, live output metrics, and data visualizations of each
              executive sub-system.
            </p>
          </div>

          <div className="fluxora-card p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
            {/* Agent Tabs */}
            <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-4">
              {(['planner', 'finance', 'growth', 'talent', 'operations'] as const).map(
                (agentKey) => (
                  <button
                    key={agentKey}
                    onClick={() => setActiveAgent(agentKey)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold capitalize transition-all ${
                      activeAgent === agentKey
                        ? 'bg-white text-neutral-950 shadow-lg shadow-white/10'
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {agentKey} Department
                  </button>
                ),
              )}
            </div>

            {/* Active Agent Details */}
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="fluxora-pill bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Bot className="h-3.5 w-3.5" />
                  <span>{agentDetails[activeAgent].role}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {agentDetails[activeAgent].title}
                </h3>

                <p className="text-sm text-neutral-300 leading-relaxed">
                  {agentDetails[activeAgent].description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Key Performance Indicators:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {agentDetails[activeAgent].metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="bg-white/5 border border-white/10 text-neutral-200 text-xs px-3 py-1 rounded-md font-mono"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Output Visualization Box */}
              <div className="md:col-span-5 rounded-2xl bg-neutral-950 border border-white/10 p-6 space-y-4 font-mono">
                <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/10 pb-3">
                  <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Activity className="h-3.5 w-3.5" /> Sub-Agent Console
                  </span>
                  <span className="text-[10px] text-emerald-400">LIVE</span>
                </div>

                <p className="text-xs text-neutral-200 leading-relaxed italic">
                  &quot;{agentDetails[activeAgent].output}&quot;
                </p>

                {/* Simulated Data Bar Visualization */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Department Alignment Score</span>
                    <span className="text-emerald-400 font-bold">96%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. STARTUP HEALTH MATRIX ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mx-auto">
              <Activity className="h-3.5 w-3.5" />
              <span>REAL-TIME GOVERNANCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Startup Health Matrix
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
              Every executive recommendation recalculates your startup health across four vital
              business dimensions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                label: 'Finance Dimension',
                score: 94,
                detail: '18.4 Mo Runway',
                color: 'from-blue-500 to-indigo-500',
                text: 'text-blue-400',
              },
              {
                label: 'Hiring Capacity',
                score: 88,
                detail: '2 Open Roles',
                color: 'from-emerald-500 to-teal-500',
                text: 'text-emerald-400',
              },
              {
                label: 'Growth Velocity',
                score: 95,
                detail: '+24% MoM Funnel',
                color: 'from-indigo-500 to-purple-500',
                text: 'text-indigo-400',
              },
              {
                label: 'Operations Alignment',
                score: 90,
                detail: 'Sprint 14 On Track',
                color: 'from-emerald-400 to-blue-500',
                text: 'text-emerald-400',
              },
            ].map((dimension, dIdx) => (
              <div key={dIdx} className="fluxora-card p-6 space-y-4 text-center">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  {dimension.label}
                </span>
                <div className={`text-4xl font-extrabold font-mono ${dimension.text}`}>
                  {dimension.score}%
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${dimension.color} h-full rounded-full`}
                    style={{ width: `${dimension.score}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">{dimension.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 7. SMART ONBOARDING DUAL PATH ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <Compass className="h-3.5 w-3.5" />
              <span>TAILORED ONBOARDING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Built for Every Stage of Your Journey
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
              Whether you are importing an active business or launching a brand-new idea, FounderHQ
              initializes company context in minutes.
            </p>
          </div>

          <div className="fluxora-card p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setOnboardingMode('existing')}
                className={`px-6 py-3 rounded-full text-xs font-bold transition-all ${
                  onboardingMode === 'existing'
                    ? 'bg-white text-neutral-950 shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                Existing Startup Path
              </button>
              <button
                onClick={() => setOnboardingMode('new')}
                className={`px-6 py-3 rounded-full text-xs font-bold transition-all ${
                  onboardingMode === 'new'
                    ? 'bg-white text-neutral-950 shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                New Startup Path
              </button>
            </div>

            <AnimatePresence mode="wait">
              {onboardingMode === 'existing' ? (
                <motion.div
                  key="existing"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid sm:grid-cols-2 gap-6"
                >
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <Building2 className="h-6 w-6 text-blue-400" />
                    <h4 className="font-bold text-white text-base">Import Existing Context</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Upload pitch decks, financial sheets, roadmaps, and business plans. Connect
                      integrations like GitHub, Google Drive, and Stripe.
                    </p>
                  </div>

                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <Database className="h-6 w-6 text-emerald-400" />
                    <h4 className="font-bold text-white text-base">Instant Startup Memory</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      FounderHQ indexes historical metrics, burn rates, and organizational
                      structures to initialize your executive agent team.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid sm:grid-cols-2 gap-6"
                >
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <Sparkles className="h-6 w-6 text-amber-400" />
                    <h4 className="font-bold text-white text-base">Interactive Guided Setup</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Provide your startup name, core idea, industry, business model, budget, and
                      timeline.
                    </p>
                  </div>

                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <Workflow className="h-6 w-6 text-indigo-400" />
                    <h4 className="font-bold text-white text-base">Zero to MVP Execution</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Jarvis constructs your initial GTM strategy, hiring roadmap, and sprint
                      milestones automatically.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ================= 8. PRICING TIERS ================= */}
        <section id="pricing" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-4">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <DollarSign className="h-3.5 w-3.5" />
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
              Scale Your Operating System
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
              Choose the tier that matches your startup stage.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex justify-center items-center space-x-3 pt-2">
              <span
                className={`text-xs font-mono ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-neutral-400'}`}
              >
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-12 h-6 rounded-full bg-white/10 border border-white/10 transition-colors p-1"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-blue-500 transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                className={`text-xs font-mono ${billingCycle === 'annual' ? 'text-white font-bold' : 'text-neutral-400'}`}
              >
                Annual Billing <span className="text-amber-400 font-normal">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
            {/* Tier 1: Free */}
            <div className="fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Free Founder Tier</h3>
                <div className="text-4xl font-extrabold font-mono text-white">
                  $0 <span className="text-xs text-neutral-400 font-normal">/month</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For early founders validating their MVP and exploring AI orchestration.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> CEO Planner Interface
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> RAG Document Upload (3
                    Docs)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Basic Startup Health Score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1 Workspace Admin
                  </li>
                </ul>
              </div>
              <button
                onClick={handleDemoClick}
                className="w-full py-3 rounded-full text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                Try Free Demo
              </button>
            </div>

            {/* Tier 2: Pro Startup (Featured) */}
            <div className="fluxora-card p-8 flex flex-col justify-between space-y-6 border-blue-500/50 bg-blue-950/20 relative shadow-2xl">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Pro Startup OS</h3>
                <div className="text-4xl font-extrabold font-mono text-white">
                  {billingCycle === 'annual' ? '$79' : '$99'}{' '}
                  <span className="text-xs text-neutral-400 font-normal">/month</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  For scaling startups requiring the full executive AI C-suite.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-200 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" /> Everything in Free Tier
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" /> All Executive Agents
                    (Finance, Talent, Growth, Ops)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" /> Human Approval Risk
                    Governance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" /> Unlimited RAG Knowledge
                    Uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" /> Up to 10 Team Members
                  </li>
                </ul>
              </div>
              <button
                onClick={handleDemoClick}
                className="w-full py-3 rounded-full text-xs font-bold bg-white text-neutral-950 hover:bg-neutral-200 shadow-xl transition-all"
              >
                Launch Pro Demo Mode
              </button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="fluxora-card p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Enterprise Tier</h3>
                <div className="text-4xl font-extrabold font-mono text-white">Custom</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For mature organizations, incubators, and accelerators.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Dedicated Google Cloud Run
                    Clusters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Custom Agent Tool Registry
                    Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Incubator Multi-Portfolio
                    Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Dedicated SLA & Priority
                    Support
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-3 rounded-full text-xs font-bold text-center border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* ================= 9. FAQ ACCORDION ================= */}
        <section id="faq" className="space-y-8 max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center space-y-3">
            <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="fluxora-card overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-400' : ''}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-neutral-300 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= 10. FINAL CTA BANNER ================= */}
        <section className="fluxora-card p-10 sm:p-16 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-blue-950/30 via-neutral-950 to-neutral-950 border-blue-500/30 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="fluxora-pill bg-blue-500/10 text-blue-400 border-blue-500/20 mx-auto">
            <Sparkles className="h-3.5 w-3.5 fill-blue-400/20" />
            <span>START YOUR OPERATING SYSTEM TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white max-w-2xl mx-auto leading-tight">
            Ready to Automate Your Startup Workflows?
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Experience how the CEO Planner Agent coordinates Finance, Talent, Growth, and Operations
            in real time.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2.5 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-sm rounded-full px-9 py-4 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Launch Demo Mode Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Floating Chatbot Assistant Component */}
      <FloatingChatbot />
    </div>
  );
}
