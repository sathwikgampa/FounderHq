'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight, TrendingDown, Clock, CircleDollarSign, Flame } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function HeroMissionControl() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Evening');
  const [healthExpanded, setHealthExpanded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Siddharth';

  return (
    <div className="space-y-6 mb-8">
      {/* Greeting Title & Compact Startup Health Indicator Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            {greeting}, {userName} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Compact Circular Startup Health Indicator */}
        <div className="relative">
          <button
            onClick={() => setHealthExpanded(!healthExpanded)}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#ECECEC] shadow-sm hover:border-[#6C63FF]/30 transition-all text-left"
          >
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="#ECECEC" strokeWidth="3" fill="transparent" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#16A34A"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="100"
                  strokeDashoffset="8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#111827]">92%</span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#111827] block flex items-center gap-1">
                Healthy <ChevronDown size={12} className={`text-[#6B7280] transition-transform ${healthExpanded ? 'rotate-180' : ''}`} />
              </span>
              <span className="text-[10px] text-[#16A34A] font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Optimal
              </span>
            </div>
          </button>

          {/* Expandable Health Breakdown Popup */}
          {healthExpanded && (
            <div className="absolute right-0 top-14 z-30 w-64 p-4 rounded-2xl bg-white border border-[#ECECEC] shadow-xl text-xs space-y-3">
              <div className="flex justify-between font-bold text-[#111827] border-b border-[#ECECEC] pb-2">
                <span>Startup Health Breakdown</span>
                <span className="text-[#16A34A]">92%</span>
              </div>
              <div className="space-y-2 text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Finance & Runway</span>
                  <span className="text-[#111827] font-semibold">96%</span>
                </div>
                <div className="flex justify-between">
                  <span>Talent & Hiring</span>
                  <span className="text-[#111827] font-semibold">90%</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Compliance</span>
                  <span className="text-[#111827] font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Traction</span>
                  <span className="text-[#111827] font-semibold">82%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Clean KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#6C63FF]/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-[#6B7280] text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-[#6C63FF]/10 text-[#6C63FF]"><CircleDollarSign size={12} /></span>
              Revenue
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#111827] tracking-tight">$28,450</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#16A34A] font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +18% vs last month
            </span>
            <svg className="w-14 h-5 text-[#6C63FF]" viewBox="0 0 100 30" fill="none">
              <path d="M0 25 C 20 20, 40 10, 60 15 C 80 5, 90 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 2: Burn Rate */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#6C63FF]/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-[#6B7280] text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600"><Flame size={12} /></span>
              Burn Rate
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#111827] tracking-tight">-$8,100</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
              <TrendingDown size={12} /> -12% vs last month
            </span>
            <svg className="w-14 h-5 text-amber-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 10 C 20 15, 40 25, 60 20 C 80 28, 90 25, 100 30" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 3: Runway */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#6C63FF]/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-[#6B7280] text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-50 text-[#16A34A]"><Clock size={12} /></span>
              Runway
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#111827] tracking-tight">16 Months</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#16A34A] font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +2 months vs last month
            </span>
            <svg className="w-14 h-5 text-[#16A34A]" viewBox="0 0 100 30" fill="none">
              <path d="M0 28 C 30 25, 50 15, 70 18 C 90 8, 95 5, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 4: MRR */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#6C63FF]/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-[#6B7280] text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-blue-50 text-blue-600"><CircleDollarSign size={12} /></span>
              MRR
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#111827] tracking-tight">$42,680</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +14% vs last month
            </span>
            <svg className="w-14 h-5 text-blue-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 20 C 25 18, 45 10, 65 12 C 85 4, 95 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
