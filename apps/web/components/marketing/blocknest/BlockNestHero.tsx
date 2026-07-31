'use client';

import { useEffect, useRef, useState } from 'react';

export function BlockNestHero() {
  const [email, setEmail] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 3D tilt on mouse move
  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rotX = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * -6;
      const rotY = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 4;
      grid.style.transform = `perspective(1000px) rotateX(${6 + rotX}deg) rotateY(${rotY}deg)`;
      grid.style.transition = 'transform 100ms linear';
    };
    const onLeave = () => {
      grid.style.transform = 'perspective(1000px) rotateX(6deg) rotateY(0deg)';
      grid.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="pt-20 pb-32 px-6 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8 reveal">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium text-purple-300"
            style={{ background: 'rgba(147,51,234,0.1)', borderColor: 'rgba(168,85,247,0.25)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live — v2.0 Beta is live
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1
            className="reveal font-semibold tracking-tight text-white mb-4"
            style={{
              fontSize: 'clamp(2.8rem,6vw,4.75rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
            }}
          >
            Launch Web3 Products
            <br />
            <span className="bn-gradient-text bn-glow-text">Without Coding</span>
          </h1>
          <p className="reveal delay-100 text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            BlockNest seamlessly integrates with your workflow to make
            <br className="hidden md:block" />
            collaboration smarter, faster, and completely intuitive.
          </p>
        </div>

        {/* CTA row */}
        <div className="reveal delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          {/* Glass pill input */}
          <div
            className="flex items-center rounded-full px-4 py-2 w-full max-w-sm gap-3"
            style={{
              background: 'rgba(11,12,21,0.8)',
              border: '1px solid rgba(168,85,247,0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="iconify text-slate-500 flex-shrink-0"
              data-icon="solar:mailbox-linear"
              data-width="18"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none min-w-0"
            />
            <button
              className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg,#9333ea,#4f46e5)',
                boxShadow: '0 0 20px rgba(147,51,234,0.4)',
              }}
            >
              Get Access
            </button>
          </div>
          {/* Secondary CTA */}
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-slate-300 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <span className="iconify" data-icon="solar:play-circle-linear" data-width="18" />
            See How It Works
          </a>
        </div>

        {/* Dashboard Grid — perspective wrapper */}
        <div ref={containerRef} className="reveal delay-300">
          <div
            ref={gridRef}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
            style={{
              transform: 'perspective(1000px) rotateX(6deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* LEFT — Balance */}
            <BalanceCard />
            {/* CENTER — Swap */}
            <SwapCard />
            {/* RIGHT — Markets */}
            <MarketsCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function BalanceCard() {
  return (
    <div className="bn-glass rounded-3xl p-6 bn-hover-lift flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          Total Balance
        </span>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-semibold text-emerald-400"
          style={{ background: 'rgba(16,185,129,0.12)' }}
        >
          +14.2%
        </span>
      </div>
      <div>
        <div className="text-3xl font-semibold text-white tracking-tight">$84,291.50</div>
        <div className="text-slate-500 text-sm mt-1">↑ $4,812 this month</div>
      </div>
      {/* Sparkline */}
      <svg viewBox="0 0 120 36" className="w-full h-9" fill="none">
        <defs>
          <linearGradient id="sparkGradBn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M2 28L22 18L42 22L72 10L102 14L118 4"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2 28L22 18L42 22L72 10L102 14L118 4 L118 36 L2 36 Z" fill="url(#sparkGradBn)" />
      </svg>
      {/* Wallet stack */}
      <div>
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-medium">
          Connected Wallets
        </div>
        <div className="flex items-center" style={{ gap: 0 }}>
          {[
            { icon: 'simple-icons:ethereum', bg: 'linear-gradient(135deg,#9333ea,#6366f1)', z: 30 },
            { icon: 'simple-icons:metamask', bg: 'linear-gradient(135deg,#f97316,#ef4444)', z: 20 },
            { icon: 'simple-icons:coinbase', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', z: 10 },
          ].map((w, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              style={{
                background: w.bg,
                borderColor: '#0B0C15',
                marginLeft: i === 0 ? 0 : -12,
                zIndex: w.z,
              }}
            >
              <span className="iconify text-white" data-icon={w.icon} data-width="14" />
            </div>
          ))}
          <div
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold text-slate-400"
            style={{ background: '#13141F', borderColor: '#0B0C15', marginLeft: -12, zIndex: 0 }}
          >
            +4
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapCard() {
  return (
    <div className="bn-glass rounded-3xl p-5 bn-hover-lift flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          Swap Tokens
        </span>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="iconify" data-icon="solar:settings-linear" data-width="14" />
        </button>
      </div>

      {/* From */}
      <SwapRow
        direction="From"
        symbol="ETH"
        amount="2.450"
        usd="$4,812.50"
        iconBg="linear-gradient(135deg,#9333ea,#6366f1)"
        icon="simple-icons:ethereum"
      />

      {/* Transfer pill */}
      <div className="flex justify-center my-1">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border text-purple-300 hover:text-white hover:border-purple-500/60 cursor-pointer transition-colors"
          style={{ background: 'rgba(147,51,234,0.2)', borderColor: 'rgba(168,85,247,0.35)' }}
        >
          <span className="iconify" data-icon="solar:transfer-vertical-bold" data-width="16" />
        </div>
      </div>

      {/* To */}
      <SwapRow
        direction="To"
        symbol="MATIC"
        amount="7,320"
        usd="$4,796.88"
        iconBg="linear-gradient(135deg,#7c3aed,#8b5cf6)"
        icon="simple-icons:polygon"
      />

      <button
        className="w-full mt-1 py-3 rounded-2xl font-semibold text-sm text-white hover:brightness-110 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg,#9333ea,#4f46e5)',
          boxShadow: '0 0 20px rgba(147,51,234,0.35)',
        }}
      >
        Confirm Swap
      </button>
    </div>
  );
}

function SwapRow({
  direction,
  symbol,
  amount,
  usd,
  iconBg,
  icon,
}: {
  direction: string;
  symbol: string;
  amount: string;
  usd: string;
  iconBg: string;
  icon: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between"
      style={{ background: 'rgba(11,12,21,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <span className="iconify text-white" data-icon={icon} data-width="14" />
        </div>
        <div>
          <div className="text-xs text-slate-500">{direction}</div>
          <div className="text-sm font-semibold text-white">{symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-white">{amount}</div>
        <div className="text-xs text-slate-500">≈ {usd}</div>
      </div>
    </div>
  );
}

const MARKETS = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$62,480',
    change: '+3.24%',
    up: true,
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: 'text-amber-400',
    icon: 'simple-icons:bitcoin',
    spark: 'M1 15L15 8L30 12L45 5L59 1',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$1,968',
    change: '+1.87%',
    up: true,
    iconBg: 'rgba(99,102,241,0.15)',
    iconColor: 'text-indigo-400',
    icon: 'simple-icons:ethereum',
    spark: 'M1 12L15 7L30 10L45 4L59 2',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$142.30',
    change: '-0.91%',
    up: false,
    iconBg: 'rgba(147,51,234,0.15)',
    iconColor: 'text-purple-400',
    icon: 'simple-icons:solana',
    spark: 'M1 5L15 12L30 8L45 15L59 18',
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    price: '$13.72',
    change: '+5.61%',
    up: true,
    iconBg: 'rgba(59,130,246,0.15)',
    iconColor: 'text-blue-400',
    icon: 'simple-icons:chainlink',
    spark: 'M1 16L15 9L30 13L45 6L59 2',
  },
];

function MarketsCard() {
  return (
    <div className="bn-glass rounded-3xl p-6 bn-hover-lift flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          Markets
        </span>
        <span className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">
          View all →
        </span>
      </div>
      {MARKETS.map((m) => (
        <div key={m.symbol} className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${m.iconColor}`}
            style={{ background: m.iconBg }}
          >
            <span className="iconify" data-icon={m.icon} data-width="16" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{m.name}</span>
              <span className="text-sm font-semibold text-white">{m.price}</span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-slate-500">{m.symbol}</span>
              <span
                className={`text-xs font-medium ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {m.change}
              </span>
            </div>
          </div>
          <svg viewBox="0 0 60 20" className="w-14 h-5 flex-shrink-0" fill="none">
            <path
              d={m.spark}
              stroke={m.up ? '#10B981' : '#EF4444'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
