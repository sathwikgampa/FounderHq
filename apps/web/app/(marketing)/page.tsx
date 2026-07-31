"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  Bot,
  Cpu,
  LineChart,
  FileText,
  ChevronDown,
  CheckCircle2,
  Activity,
  Layers,
  HelpCircle,
  Building2,
  DollarSign,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FloatingChatbot } from "@/components/chatbot/FloatingChatbot";
import { useAuth } from "@/providers/auth-provider";

export default function LandingPage() {
  const router = useRouter();
  const { loginAsDemo } = useAuth();

  const [activeAgent, setActiveAgent] = useState<"planner" | "finance" | "growth" | "talent" | "operations">("planner");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleDemoClick = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  const agentMessages = {
    planner:
      "Analyzed 3 quarterly startup goals. Recommend prioritizing backend API scaling and customer acquisition workflows for Q3.",
    finance:
      "Reviewed runway projections: Current burn rate is $42,000/mo. You have 18.4 months of remaining runway.",
    growth:
      "Synthesized GTM campaign metrics: Referral loop conversion is up +24% MoM following the recent onboarding update.",
    talent:
      "Found 4 candidates matching Senior Lead Engineer criteria. Human approval required before sending technical assessment.",
    operations:
      "Sprint planning completed: 14 backlog tasks categorized and assigned across executive agent sub-systems.",
  };

  const faqs = [
    {
      question: "What is FounderHQ AI Operating System?",
      answer:
        "FounderHQ is an enterprise-grade AI Operating System for startups. It provides a single public interface — the CEO Planner — which orchestrates specialized executive sub-systems (Finance, Growth, Talent, Operations) while maintaining strict human-in-the-loop approvals for high-risk actions.",
    },
    {
      question: "How does the single conversational interface work?",
      answer:
        "Founders communicate exclusively with the CEO Planner Agent. The Planner breaks down objectives, queries Startup Memory and RAG knowledge bases, and delegates sub-tasks to relevant executive agents without exposing fragmented agent UIs.",
    },
    {
      question: "What is the security & multi-tenant isolation model?",
      answer:
        "FounderHQ enforces strict workspace isolation via middleware JWT token claims, Firebase Auth, and Firestore security rules. Secrets and documents never leak across tenant boundaries.",
    },
    {
      question: "Can I deploy FounderHQ to Google Cloud Run and Vercel?",
      answer:
        "Yes. The Next.js 15 frontend is optimized for Vercel, and the FastAPI backend is packaged with multi-stage Dockerfiles designed for Google Cloud Run horizontal autoscaling.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>FounderHQ OS — Enterprise Architecture Foundation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent max-w-4xl mx-auto leading-tight"
          >
            The AI Operating System for Startup Founders
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Orchestrate executive intelligence, automate startup governance, and maintain total control with a production-grade Clean Architecture foundation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button size="lg" onClick={handleDemoClick} className="rounded-xl px-8 shadow-lg shadow-primary/20 gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Try Instant Demo Mode</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl px-8" asChild>
              <Link href="/login">Sign In / Register</Link>
            </Button>
          </motion.div>
        </section>

        {/* Executive Agent Showcase */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Executive Sub-System Showcase</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Simulate CEO Planner delegation across specialized executive departments.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-xl space-y-6">
            {/* Agent Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {(["planner", "finance", "growth", "talent", "operations"] as const).map((agent) => (
                <button
                  key={agent}
                  onClick={() => setActiveAgent(agent)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
                    activeAgent === agent
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {agent} Department
                </button>
              ))}
            </div>

            {/* Simulated Output Card */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-6 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-medium text-primary">
                <Bot className="h-4 w-4" />
                <span className="capitalize">{activeAgent} Agent Active Output</span>
              </div>
              <p className="text-sm font-mono text-foreground leading-relaxed">
                "{agentMessages[activeAgent]}"
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader>
              <Cpu className="h-6 w-6 text-primary mb-2" />
              <CardTitle>FastAPI & Google ADK</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Clean Architecture with Repository Pattern, Pydantic v2 schemas, Dependency Injection, and versioned REST endpoints under `/api/v1`.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Firebase Multi-Tenancy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Strongly-typed SDK wrappers for Firebase Authentication, Firestore database collections, and Cloud Storage asset buckets.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader>
              <Layers className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Next.js 15 & React 19</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Modern App Router with route groups `(dashboard)`, `(marketing)`, `(auth)`, theme providers, global error boundaries, and skeleton UI.
            </CardContent>
          </Card>
        </section>

        {/* Pricing Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-sm text-muted-foreground">Select your startup tier to scale with FounderHQ OS.</p>
          </div>

          <div className="flex justify-center items-center space-x-3">
            <span className={`text-xs ${billingCycle === "monthly" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative w-12 h-6 rounded-full bg-muted border border-border transition-colors p-1"
            >
              <div
                className={`w-4 h-4 rounded-full bg-primary transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs ${billingCycle === "annual" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
              Annual <span className="text-amber-500 font-normal">(Save 20%)</span>
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            <Card className="rounded-2xl border-border p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Free Tier</h3>
                <div className="text-3xl font-extrabold">$0 <span className="text-xs text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground">For early-stage founders building their MVP foundation.</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> CEO Planner Interface</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Firebase Auth & Firestore Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 1 Workspace Member</li>
                </ul>
              </div>
              <Button className="w-full mt-6 rounded-xl" variant="outline" onClick={handleDemoClick}>
                Try Demo Free
              </Button>
            </Card>

            <Card className="rounded-2xl border-primary bg-primary/5 p-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3 right-6 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Pro Startup</h3>
                <div className="text-3xl font-extrabold">
                  {billingCycle === "annual" ? "$79" : "$99"} <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground">For scaling startups requiring executive AI sub-systems.</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All Free Features</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Finance, Growth & Talent Sub-Agents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Human Approval Queues</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Up to 10 Team Members</li>
                </ul>
              </div>
              <Button className="w-full mt-6 rounded-xl shadow-md" onClick={handleDemoClick}>
                Launch Pro Demo
              </Button>
            </Card>

            <Card className="rounded-2xl border-border p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="text-3xl font-extrabold">Custom</div>
                <p className="text-xs text-muted-foreground">For mature companies needing custom Cloud Run deployments.</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Dedicated Google Cloud Run Instances</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Custom Tool Registry Integrations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Unlimited Workspaces & SLA Support</li>
                </ul>
              </div>
              <Button className="w-full mt-6 rounded-xl" variant="outline" asChild>
                <Link href="/login">Contact Sales</Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card/60 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm font-semibold hover:bg-accent/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Chatbot Assistant Component */}
      <FloatingChatbot />
    </div>
  );
}
