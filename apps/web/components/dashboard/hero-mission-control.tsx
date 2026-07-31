'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight, TrendingDown, Clock, CircleDollarSign, Flame, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function HeroMissionControl() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning');
  const [healthExpanded, setHealthExpanded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Siddhartha';

  return (
    <div className="space-y-6 mb-8">
      {/* Greeting Title & Compact Startup Health Indicator Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Everything looks healthy today.</p>
        </div>

        {/* Compact Circular Startup Health Indicator */}
        <div className="relative">
          <button
            onClick={() => setHealthExpanded(!healthExpanded)}
            className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-[#ECECEC] shadow-sm hover:border-[#6C63FF]/30 transition-all text-left"
          >
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <svg className="w-9 h-9 transform -rotate-90">
                <circle cx="18" cy="18" r="14" stroke="#ECECEC" strokeWidth="3" fill="transparent" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#16A34A"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="88"
                  strokeDashoffset="7"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#111827]">92%</span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1">
                Healthy <ChevronDown size={12} className={`text-[#6B7280] transition-transform ${healthExpanded ? 'rotate-180' : ''}`} />
              </span>
              <span className="text-[10px] text-[#16A34A] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Optimal
              </span>
            </div>
          </button>

          {/* Expandable Health Breakdown Popup */}
          {healthExpanded && (
            <div className="absolute right-0 top-14 z-30 w-60 p-3.5 rounded-2xl bg-white border border-[#ECECEC] shadow-xl text-xs space-y-2">
              <div className="flex justify-between font-bold text-[#111827] border-b border-[#ECECEC] pb-1.5">
                <span>Health Breakdown</span>
                <span className="text-[#16A34A]">92%</span>
              </div>
              <div className="space-y-1.5 text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Runway Buffer</span>
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

      {/* 4 Clean KPI Cards Row (Revenue, Runway, Burn, Growth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
          <div className="text-xs font-semibold text-[#6B7280]">Revenue</div>
          <div className="text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">$28,450</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#16A34A] font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +18%
            </span>
            <svg className="w-14 h-4 text-[#6C63FF]" viewBox="0 0 100 30" fill="none">
              <path d="M0 25 C 20 20, 40 10, 60 15 C 80 5, 90 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 2: Runway */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
          <div className="text-xs font-semibold text-[#6B7280]">Runway</div>
          <div className="text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">16 Mo</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#16A34A] font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +2 mo
            </span>
            <svg className="w-14 h-4 text-[#16A34A]" viewBox="0 0 100 30" fill="none">
              <path d="M0 28 C 30 25, 50 15, 70 18 C 90 8, 95 5, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 3: Burn */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
          <div className="text-xs font-semibold text-[#6B7280]">Burn</div>
          <div className="text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">-$8.1k</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-amber-600 font-semibold flex items-center gap-0.5">
              <TrendingDown size={12} /> -12%
            </span>
            <svg className="w-14 h-4 text-amber-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 10 C 20 15, 40 25, 60 20 C 80 28, 90 25, 100 30" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card 4: Growth */}
        <div className="p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
          <div className="text-xs font-semibold text-[#6B7280]">Growth</div>
          <div className="text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">+24%</div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +4%
            </span>
            <svg className="w-14 h-4 text-blue-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 20 C 25 18, 45 10, 65 12 C 85 4, 95 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
