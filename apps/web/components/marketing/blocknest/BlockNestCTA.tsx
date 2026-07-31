'use client';

export function BlockNestCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ zIndex: 20 }}>
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Bottom purple blur */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 300,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(147,51,234,0.35) 0%, transparent 70%)',
          filter: 'blur(130px)',
        }}
      />
      {/* Top border line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="reveal text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4">
          Get Started Today
        </p>
        <h2
          className="reveal delay-100 text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight"
          style={{ letterSpacing: '-0.025em' }}
        >
          Build the future
          <br />
          of <span className="bn-gradient-text bn-glow-text">Web3</span>
        </h2>
        <p className="reveal delay-200 text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join 120,000+ developers who ship faster with BlockNest. No smart contract experience
          required.
        </p>

        <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="px-8 py-4 rounded-full font-semibold text-black bg-white text-sm transition-all duration-300 hover:bg-slate-100"
            style={{ boxShadow: '0 0 20px rgba(255,255,255,0.25)' }}
          >
            Access Platform →
          </a>
          <a
            href="#"
            className="px-8 py-4 rounded-full font-medium text-slate-300 border border-white/10 text-sm hover:border-white/20 hover:text-white transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            View Documentation
          </a>
        </div>

        {/* Trust row */}
        <div className="reveal delay-400 flex items-center justify-center gap-6 mt-10 text-xs text-slate-600 flex-wrap">
          {[
            {
              icon: 'solar:shield-check-linear',
              label: 'SOC 2 Certified',
              color: 'text-emerald-500',
            },
            { icon: 'solar:lock-linear', label: 'Non-custodial', color: 'text-emerald-500' },
            { icon: 'solar:code-linear', label: 'Open Source', color: 'text-emerald-500' },
          ].map((t, i) => (
            <span key={t.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="w-px h-3 mr-6" style={{ background: 'rgba(255,255,255,0.1)' }} />
              )}
              <span className={`iconify ${t.color}`} data-icon={t.icon} data-width="14" />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
