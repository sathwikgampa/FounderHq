'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Lock,
  Heart,
  Wallet,
  TrendingUp,
  ClipboardList,
  CheckCircle2,
  FileText,
  Clock,
  Video,
  Landmark,
  UserPlus,
  ChevronRight,
  Sparkles,
  Mic,
  ArrowRight,
  Calculator,
  Target,
  Scale,
  X,
  Bot,
} from 'lucide-react';

export default function DashboardPage() {
  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Create Company Profile', completed: true },
    { id: 2, title: 'Add Team Members', completed: false },
    { id: 3, title: 'Connect Bank Account', completed: false },
    { id: 4, title: 'Set Initial Budget', completed: false },
  ]);

  // Orchestrator Chat State
  const [query, setQuery] = useState('');
  const [activeResponse, setActiveResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const suggestionAnswers: Record<string, string> = {
    'We are building a SaaS product for small businesses':
      'Awesome positioning! For SMB SaaS, your initial focus should be fast onboarding, transparent self-serve pricing ($29-$99/mo), and automated email sequences. Catalyst OS can track your customer retention and initial activation metrics as soon as you connect your analytics provider.',
    'Help me create a 12-month financial plan':
      'Here is your recommended 12-month financial allocation framework:\n- Engineering & Product: 45%\n- Go-to-Market & Sales: 35%\n- General & Legal Setup: 20%\nWe recommend maintaining at least 18 months of cash runway before your next capital raise.',
    'Suggest a go-to-market strategy':
      'Recommended GTM Playbook:\n1. Product-Led Growth (PLG) free 14-day trial.\n2. Target micro-influencers & LinkedIn founder posts for zero-cost customer acquisition.\n3. Implement in-app referral rewards for initial early adopters.',
    'What are the key legal things I should take care of?':
      'Top 4 Startup Legal Essentials:\n1. Delaware C-Corp Incorporation & Founder Stock Purchase Agreements (83b elections).\n2. IP Assignment Agreements for all founders and contractors.\n3. Privacy Policy & Terms of Service for web application compliance.\n4. Standard Mutual NDA templates for partner discussions.',
  };

  const handleAsk = (promptText?: string) => {
    const textToAsk = promptText || query;
    if (!textToAsk.trim()) return;

    setIsGenerating(true);
    setActiveResponse(null);

    setTimeout(() => {
      const matchedKey = Object.keys(suggestionAnswers).find((key) =>
        textToAsk.toLowerCase().includes(key.toLowerCase()),
      );
      if (matchedKey) {
        setActiveResponse(suggestionAnswers[matchedKey]);
      } else {
        setActiveResponse(
          `Analyzed: "${textToAsk}". CEO Orchestrator recommends prioritizing core customer feedback loop, locking down initial 10 pilot customers, and ensuring team milestone alignment for Q3.`,
        );
      }
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-[1320px] mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, Sathvika
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Let&apos;s set up your startup and build something amazing.
          </p>
        </div>

        {/* Date Picker Pill */}
        <div className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors w-fit">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>May 20, 2025</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>

      {/* KPI Card Row (4 equal cards, empty/locked state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Startup Health */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
              <Heart className="w-5 h-5 fill-emerald-500/20" />
            </div>
          </div>
          <div className="my-3 space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Startup Health</h3>
            <div className="text-2xl font-black text-slate-900 tracking-tight">--</div>
            <p className="text-[11px] text-slate-400 font-normal">
              Complete setup to see your score
            </p>
          </div>
          <div className="absolute bottom-4 right-4 text-slate-300">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Cash Runway */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-500 shrink-0">
              <Wallet className="w-5 h-5 fill-purple-500/20" />
            </div>
          </div>
          <div className="my-3 space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Cash Runway</h3>
            <div className="text-2xl font-black text-slate-900 tracking-tight">--</div>
            <p className="text-[11px] text-slate-400 font-normal">
              Add financial details to estimate runway
            </p>
          </div>
          <div className="absolute bottom-4 right-4 text-slate-300">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Revenue (MTD) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3 space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Revenue (MTD)</h3>
            <div className="text-2xl font-black text-slate-900 tracking-tight">--</div>
            <p className="text-[11px] text-slate-400 font-normal">Connect or add revenue details</p>
          </div>
          <div className="absolute bottom-4 right-4 text-slate-300">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500 shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3 space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Pending Approvals</h3>
            <div className="text-2xl font-black text-slate-900 tracking-tight">--</div>
            <p className="text-[11px] text-slate-400 font-normal">No approvals yet</p>
          </div>
          <div className="absolute bottom-4 right-4 text-slate-300">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Three-Column Panel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Startup Setup Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Startup Setup</h2>
            <div className="flex items-center space-x-2">
              {/* Circular Progress Ring */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-300"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-700">
                  {progressPercent}%
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 py-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                {item.completed ? (
                  <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-indigo-400 shrink-0 transition-colors" />
                )}
                <span
                  className={`text-xs font-medium transition-colors ${
                    item.completed
                      ? 'text-slate-800 font-semibold'
                      : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <div>
            <button
              onClick={() => {
                const nextIncomplete = checklist.find((c) => !c.completed);
                if (nextIncomplete) {
                  toggleChecklist(nextIncomplete.id);
                }
              }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <span>Continue Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-auto py-6 text-center space-y-2">
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl w-13 h-13 mx-auto flex items-center justify-center relative text-slate-400 mb-3 shadow-2xs">
              <FileText className="w-6 h-6 text-slate-300" />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 border border-slate-200" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">No activity yet</h3>
            <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
              Once you start using Catalyst OS, your activity will appear here.
            </p>
          </div>

          <div className="h-4" />
        </div>

        {/* Getting Started Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Getting Started</h2>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {/* Row 1 */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    Watch 2-min Overview
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Quick intro to Catalyst OS
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    Connect Bank Account
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Get real-time financial insights
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    Invite Your Team
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Add members and set roles
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>

          <div>
            <a
              href="#resources"
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs inline-flex items-center gap-1 transition-colors"
            >
              <span>View all resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Hero Panel — "CEO Orchestrator" */}
      <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
        {/* Header Block */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">CEO Orchestrator</h2>
            <p className="text-xs text-slate-500">Your co-pilot to manage and grow your startup.</p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-1.5 flex items-center gap-2 shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about your startup..."
            className="bg-transparent border-0 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none flex-1 px-3 py-2"
          />
          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Voice Command"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleAsk()}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            <span>{isGenerating ? 'Analyzing...' : 'Ask'}</span>
          </button>
        </div>

        {/* Dynamic AI Co-Pilot Response Box */}
        {activeResponse && (
          <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm animate-in fade-in duration-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  CEO Orchestrator Recommendation
                </span>
              </div>
              <button
                onClick={() => setActiveResponse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {activeResponse}
            </p>
          </div>
        )}

        {/* 4 Suggestion Chips Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Chip 1 */}
          <div
            onClick={() => {
              const text = 'We are building a SaaS product for small businesses';
              setQuery(text);
              handleAsk(text);
            }}
            className="bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer shadow-2xs transition-all group"
          >
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
              We are building a SaaS product for small businesses
            </span>
          </div>

          {/* Chip 2 */}
          <div
            onClick={() => {
              const text = 'Help me create a 12-month financial plan';
              setQuery(text);
              handleAsk(text);
            }}
            className="bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer shadow-2xs transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
              Help me create a 12-month financial plan
            </span>
          </div>

          {/* Chip 3 */}
          <div
            onClick={() => {
              const text = 'Suggest a go-to-market strategy';
              setQuery(text);
              handleAsk(text);
            }}
            className="bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer shadow-2xs transition-all group"
          >
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
              Suggest a go-to-market strategy
            </span>
          </div>

          {/* Chip 4 */}
          <div
            onClick={() => {
              const text = 'What are the key legal things I should take care of?';
              setQuery(text);
              handleAsk(text);
            }}
            className="bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer shadow-2xs transition-all group"
          >
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-700 leading-snug group-hover:text-slate-900">
              What are the key legal things I should take care of?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
