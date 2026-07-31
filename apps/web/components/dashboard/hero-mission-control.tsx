'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, TrendingDown, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { useAuth } from '@/providers/auth-provider';

export function HeroMissionControl() {
  const { user } = useAuth();
  const orbCanvasRef = useRef<HTMLCanvasElement>(null);
  const [orbHovered, setOrbHovered] = useState(false);

  // Time of day greeting
  const [greeting, setGreeting] = useState('Good Evening');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // 3D Canvas Radial Health Orb Animation
  useEffect(() => {
    const canvas = orbCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;
    const size = (canvas.width = canvas.height = 240);

    const renderOrb = () => {
      time += 0.02;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const radius = 75;

      // Outer Glowing Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + Math.sin(time) * 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124, 92, 255, 0.3)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Pulsing Core Gradient
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
      grad.addColorStop(0, 'rgba(124, 92, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.4)');
      grad.addColorStop(1, 'rgba(124, 92, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Accent Arcs
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 12, time, time + Math.PI * 1.2);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Secondary Arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 18, -time * 0.8, -time * 0.8 + Math.PI * 0.8);
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      frameId = requestAnimationFrame(renderOrb);
    };

    renderOrb();
    return () => cancelAnimationFrame(frameId);
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Siddharth';

  return (
    <div className="space-y-6">
      {/* Hero Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mission Control Greeting & Core Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <GlowCard glowColor="rgba(124, 92, 255, 0.15)">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] text-xs font-semibold">
                <Sparkles size={14} />
                <span>CEO Planner Mission Control</span>
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {greeting}, {userName}
                </h1>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Your AI executive team is running 10 parallel workflows. 2 items require your
                  approval today.
                </p>
              </div>

              {/* Today's Priorities */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Today&apos;s Focus
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>Approve Series A SAFE Term Sheet ($1.7M)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                    <span>Review Senior AI Engineer Offer ($165k)</span>
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlowCard glowColor="rgba(34, 197, 94, 0.15)">
              <div className="text-xs text-slate-400 font-medium mb-1">Monthly Revenue</div>
              <div className="text-2xl font-extrabold text-white tracking-tight">$28,450</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ArrowUpRight size={14} />
                <span>+18% vs last mo</span>
              </div>
            </GlowCard>

            <GlowCard glowColor="rgba(245, 158, 11, 0.15)">
              <div className="text-xs text-slate-400 font-medium mb-1">Monthly Net Burn</div>
              <div className="text-2xl font-extrabold text-white tracking-tight">-$8,100</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <TrendingDown size={14} />
                <span>Improving (Extended 2.5 mo)</span>
              </div>
            </GlowCard>

            <GlowCard glowColor="rgba(124, 92, 255, 0.15)">
              <div className="text-xs text-slate-400 font-medium mb-1">Cash Runway</div>
              <div className="text-2xl font-extrabold text-white tracking-tight">16 Months</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                <Clock size={14} />
                <span>Healthy Buffer</span>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Right 1 Col: Animated Startup Health Orb */}
        <div className="relative">
          <GlowCard
            onMouseEnter={() => setOrbHovered(true)}
            onMouseLeave={() => setOrbHovered(false)}
            className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-400" />
              Startup Health Index
            </div>

            {/* Canvas Orb */}
            <div className="relative my-2 flex items-center justify-center">
              <canvas ref={orbCanvasRef} className="w-[180px] h-[180px] pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-white tracking-tight">92%</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mt-0.5">
                  Optimal
                </span>
              </div>
            </div>

            {/* Hover Expansion Metrics */}
            {orbHovered ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-xs space-y-1.5 pt-2 border-t border-white/10"
              >
                <div className="flex justify-between text-slate-300">
                  <span>Finance: 95%</span>
                  <span>Product: 94%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Marketing: 92%</span>
                  <span>Legal: 88%</span>
                </div>
              </motion.div>
            ) : (
              <p className="text-[11px] text-slate-400 mt-2">Hover to view domain breakdown</p>
            )}
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
