'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingDown, Clock, Sparkles, Mic, MicOff, Send, Volume2, Square, ChevronDown, CircleDollarSign, Flame } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { useAuth } from '@/providers/auth-provider';
import { useVoice } from '@/hooks/use-voice';
import { toast } from 'sonner';

export function HeroMissionControl() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Evening');
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const { isListening, isSpeaking, transcript, toggleListening, speak, stopSpeaking } = useVoice(
    (finalText) => {
      if (finalText) setQuery(finalText);
    }
  );

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    const userPrompt = query;

    setTimeout(async () => {
      setIsProcessing(false);
      const responseText = `CEO Planner evaluated: "${userPrompt}". All 10 executive agents dispatched parallel tasks. Runway buffer remains healthy at 16 months.`;
      setLastResponse(responseText);
      toast.success(`CEO Planner processed: "${userPrompt}"`, { icon: '✨' });
      setQuery('');
      await speak(responseText);
    }, 1000);
  };

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Siddharth';

  return (
    <div className="space-y-6">
      {/* 1. Header Row: Greeting Title (Left) + Startup Health Widget (Right) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {greeting}, {userName} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your startup is running smoothly.</p>
        </div>

        {/* Startup Health Widget */}
        <GlowCard glowColor="rgba(34, 197, 94, 0.15)" className="p-4 w-full md:w-64 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              Startup Health <ChevronDown size={12} className="text-slate-400" />
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Radial 92% Gauge */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="url(#healthGrad)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset="11"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-extrabold text-white">92%</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-white block">Optimal</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operating well
              </span>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 2. Hero Command Box Directly Below Name */}
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7C5CFF]/30 via-indigo-500/20 to-purple-500/30 rounded-[28px] blur-lg opacity-50 pointer-events-none" />

        <form
          onSubmit={handleSubmit}
          className="relative bg-[#0E1014]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] p-4 shadow-2xl space-y-3 z-10"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[#7C5CFF] shrink-0">
              <Sparkles size={16} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? 'Listening to voice input...' : 'Ask FounderHQ anything... (e.g. analyze runway, build MVP roadmap, review contracts)'}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={isListening ? 'Stop Voice Recording' : 'Voice Input (ElevenLabs STT & Groq Whisper)'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {isSpeaking ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse"
                  title="Stop AI Voice Playback"
                >
                  <Square size={14} />
                </button>
              ) : lastResponse ? (
                <button
                  type="button"
                  onClick={() => speak(lastResponse)}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#7C5CFF] hover:bg-white/5 transition-colors"
                  title="Replay ElevenLabs Voice Response"
                >
                  <Volume2 size={16} />
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isProcessing || !query.trim()}
                className="p-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6b49f3] text-white disabled:opacity-40 transition-all shadow-md shadow-[#7C5CFF]/30"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. 4 Key Metric Cards Row (Revenue, Burn Rate, Cash Runway, MRR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <GlowCard glowColor="rgba(124, 92, 255, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-[#7C5CFF]/20 text-[#7C5CFF]"><CircleDollarSign size={12} /></span>
              Revenue
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">$28,450</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight size={12} /> ↑ 18% vs last month
            </span>
            <svg className="w-16 h-6 text-[#7C5CFF]" viewBox="0 0 100 30" fill="none">
              <path d="M0 25 C 20 20, 40 10, 60 15 C 80 5, 90 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </GlowCard>

        {/* Card 2: Burn Rate */}
        <GlowCard glowColor="rgba(245, 158, 11, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400"><Flame size={12} /></span>
              Burn Rate
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">-$8,100</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <TrendingDown size={12} /> ↓ 12% vs last month
            </span>
            <svg className="w-16 h-6 text-amber-400" viewBox="0 0 100 30" fill="none">
              <path d="M0 10 C 20 15, 40 25, 60 20 C 80 28, 90 25, 100 30" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </GlowCard>

        {/* Card 3: Cash Runway */}
        <GlowCard glowColor="rgba(34, 197, 94, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400"><Clock size={12} /></span>
              Cash Runway
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">16 Months</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight size={12} /> ↑ 2 months vs last month
            </span>
            <svg className="w-16 h-6 text-emerald-400" viewBox="0 0 100 30" fill="none">
              <path d="M0 28 C 30 25, 50 15, 70 18 C 90 8, 95 5, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </GlowCard>

        {/* Card 4: MRR */}
        <GlowCard glowColor="rgba(59, 130, 246, 0.15)">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-blue-500/20 text-blue-400"><CircleDollarSign size={12} /></span>
              MRR
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">$42,680</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <ArrowUpRight size={12} /> ↑ 14% vs last month
            </span>
            <svg className="w-16 h-6 text-blue-400" viewBox="0 0 100 30" fill="none">
              <path d="M0 20 C 25 18, 45 10, 65 12 C 85 4, 95 2, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
