'use client';

import { useEffect, useRef } from 'react';

const PARTNERS = [
  { icon: 'simple-icons:coinbase', hoverColor: '#1652F0', label: 'Coinbase' },
  { icon: 'simple-icons:binance', hoverColor: '#F0B90B', label: 'Binance' },
  { icon: 'simple-icons:metamask', hoverColor: '#E2761B', label: 'MetaMask' },
  { icon: 'simple-icons:ethereum', hoverColor: '#627EEA', label: 'Ethereum' },
  { icon: 'simple-icons:polygon', hoverColor: '#8247E5', label: 'Polygon' },
  { icon: 'simple-icons:chainlink', hoverColor: '#375BD2', label: 'Chainlink' },
  { icon: 'simple-icons:solana', hoverColor: '#9945FF', label: 'Solana' },
  { icon: 'simple-icons:uniswap', hoverColor: '#FF007A', label: 'Uniswap' },
];

const STATS = [
  {
    icon: 'solar:users-group-rounded-linear',
    iconColor: 'text-purple-400',
    iconBg: 'rgba(147,51,234,0.12)',
    iconBorder: 'rgba(168,85,247,0.2)',
    val: 120000,
    suffix: 'K+',
    label: 'Active Developers',
    sub: 'building on BlockNest',
    divider: true,
  },
  {
    icon: 'solar:chart-square-linear',
    iconColor: 'text-indigo-400',
    iconBg: 'rgba(79,70,229,0.12)',
    iconBorder: 'rgba(99,102,241,0.2)',
    val: 4.8,
    suffix: 'B+',
    label: 'Transactions Processed',
    sub: 'across all chains',
    divider: true,
  },
  {
    icon: 'solar:shield-check-linear',
    iconColor: 'text-emerald-400',
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.2)',
    val: 99.9,
    suffix: '%',
    label: 'Uptime Guaranteed',
    sub: 'enterprise-grade SLA',
    divider: false,
  },
];

function animateValue(el: HTMLElement, target: number, suffix: string, duration = 2000) {
  const isFloat = !Number.isInteger(target);
  const isLarge = target >= 1000;
  let startTime: number | null = null;

  function step(ts: number) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    if (isFloat) {
      el.textContent = current.toFixed(1) + suffix;
    } else if (isLarge) {
      el.textContent = Math.floor(current / 1000) + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function BlockNestPartners() {
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            STATS.forEach((s, i) => {
              const el = statRefs.current[i];
              if (el) animateValue(el, s.val, s.suffix);
            });
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 px-6" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <p className="reveal text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
          Trusted by leading Web3 companies
        </p>

        {/* Marquee */}
        <div
          className="overflow-hidden mb-24"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex gap-16 items-center bn-marquee" style={{ width: 'max-content' }}>
            {[0, 1].flatMap((loop) =>
              PARTNERS.map((p) => (
                <span
                  key={`${p.label}-${loop}`}
                  className="iconify flex-shrink-0 text-slate-600 cursor-pointer transition-colors duration-300"
                  data-icon={p.icon}
                  data-width="32"
                  style={{ '--hover-color': p.hoverColor } as React.CSSProperties}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = p.hoverColor)
                  }
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '')}
                />
              )),
            )}
          </div>
        </div>

        {/* Stats */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-0 reveal">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center px-8 py-8 relative"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: s.iconBg, border: `1px solid ${s.iconBorder}` }}
              >
                <span className={`iconify ${s.iconColor}`} data-icon={s.icon} data-width="24" />
              </div>
              <span
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
                className="bn-stat-number bn-gradient-stat mb-1"
              >
                0
              </span>
              <div className="text-sm text-slate-400 font-medium">{s.label}</div>
              <div className="text-xs text-slate-600 mt-1">{s.sub}</div>
              {s.divider && (
                <div
                  className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent, rgba(168,85,247,0.25), transparent)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
