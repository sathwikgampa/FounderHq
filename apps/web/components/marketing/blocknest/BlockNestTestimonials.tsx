'use client';

function Stars() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="iconify text-amber-400"
          data-icon="solar:star-bold"
          data-width="14"
        />
      ))}
    </div>
  );
}

function VerifiedBadge({ color = 'text-blue-400' }: { color?: string }) {
  return (
    <span className={`iconify ${color}`} data-icon="solar:verified-check-bold" data-width="13" />
  );
}

export function BlockNestTestimonials() {
  return (
    <section className="relative py-24 px-6" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
            Community
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-white tracking-tight"
            style={{ letterSpacing: '-0.025em' }}
          >
            Loved by builders
            <br />
            <span className="bn-gradient-text">around the world</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Uniswap */}
          <div className="bn-glass rounded-3xl p-6 bn-hover-lift reveal delay-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,0,122,0.15)' }}
              >
                <span
                  className="iconify text-[#FF007A]"
                  data-icon="simple-icons:uniswap"
                  data-width="20"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Uniswap Labs</div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <VerifiedBadge color="text-blue-400" />
                  Official Partner
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              &ldquo;BlockNest gave us the infrastructure to launch our v3 pools in half the time.
              The no-code tooling is genuinely best-in-class for DeFi.&rdquo;
            </p>
            <div className="mt-auto">
              <Stars />
            </div>
          </div>

          {/* James Dupont — gradient card */}
          <div
            className="rounded-3xl p-6 bn-hover-lift reveal delay-200 flex flex-col gap-4"
            style={{
              background: 'linear-gradient(160deg,#13141F,#0A0B10)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1)' }}
              >
                JD
              </div>
              <div>
                <div className="text-sm font-semibold text-white">James Dupont</div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <VerifiedBadge color="text-purple-400" />
                  Senior Solidity Engineer
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              &ldquo;I shipped a full staking protocol in 3 days using BlockNest. What used to take
              months of boilerplate is now drag-and-drop.&rdquo;
            </p>
            <div className="mt-auto">
              <Stars />
            </div>
          </div>

          {/* Polygon */}
          <div className="bn-glass rounded-3xl p-6 bn-hover-lift reveal delay-300 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(130,71,229,0.15)' }}
              >
                <span
                  className="iconify text-[#8247E5]"
                  data-icon="simple-icons:polygon"
                  data-width="20"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Polygon</div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <VerifiedBadge color="text-blue-400" />
                  Ecosystem Partner
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              &ldquo;We integrated BlockNest into our zkEVM developer portal and saw a 3× increase
              in new dApp launches within the first quarter.&rdquo;
            </p>
            <div
              className="rounded-2xl p-3 flex items-center justify-between"
              style={{
                background: 'rgba(130,71,229,0.08)',
                border: '1px solid rgba(130,71,229,0.15)',
              }}
            >
              <span className="text-xs text-slate-400">New dApps Q1</span>
              <span className="text-sm font-semibold text-purple-300">+312% ↑</span>
            </div>
            <Stars />
          </div>

          {/* Anna Silva — spans 2 cols */}
          <div
            className="rounded-3xl p-6 bn-hover-lift reveal delay-100 md:col-span-2 flex flex-col gap-4"
            style={{
              background: 'linear-gradient(160deg,#13141F,#0A0B10)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#f472b6,#a855f7)' }}
              >
                AS
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Anna Silva</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <VerifiedBadge color="text-purple-400" />
                      Web3 Product Lead, Binance
                    </div>
                  </div>
                  <Stars />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mt-3">
                  &ldquo;As someone who bridges product and engineering, BlockNest speaks both
                  languages fluently. Our non-technical PMs can now prototype on-chain flows that
                  devs take straight to production. We cut our time-to-launch by 60%.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Chainlink */}
          <div className="bn-glass rounded-3xl p-6 bn-hover-lift reveal delay-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(55,91,210,0.15)' }}
              >
                <span
                  className="iconify text-[#375BD2]"
                  data-icon="simple-icons:chainlink"
                  data-width="20"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Chainlink</div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <VerifiedBadge color="text-blue-400" />
                  Oracle Partner
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              &ldquo;BlockNest&apos;s oracle integration layer made wiring up Chainlink price feeds
              completely seamless — no ABI fumbling required.&rdquo;
            </p>
            <div className="mt-auto">
              <Stars />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
