'use client';

import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useId } from 'react';

// ─── Streak definitions ────────────────────────────────────────────────────────
// Each streak has a fixed angle, a random starting X offset (as % of viewport),
// a speed (vw per second), width, and colour stop brightnesses.
const STREAK_DEFS = [
  { angle: 38, startX: -20, speed: 9, thickness: 1.8, bright: 0.9, mid: 0.3, len: 55 },
  { angle: 35, startX: 10, speed: 7, thickness: 1.2, bright: 0.7, mid: 0.22, len: 48 },
  { angle: 40, startX: 35, speed: 11, thickness: 2.2, bright: 1.0, mid: 0.35, len: 60 },
  { angle: 33, startX: 55, speed: 8, thickness: 1.0, bright: 0.55, mid: 0.18, len: 42 },
  { angle: 37, startX: 70, speed: 10, thickness: 1.6, bright: 0.8, mid: 0.28, len: 52 },
  { angle: 42, startX: -35, speed: 6, thickness: 0.9, bright: 0.45, mid: 0.14, len: 38 },
  { angle: 36, startX: 85, speed: 12, thickness: 2.0, bright: 0.85, mid: 0.32, len: 58 },
  { angle: 34, startX: 20, speed: 5, thickness: 0.8, bright: 0.4, mid: 0.12, len: 35 },
  { angle: 39, startX: 45, speed: 13, thickness: 1.4, bright: 0.75, mid: 0.25, len: 50 },
  { angle: 41, startX: -10, speed: 9, thickness: 1.1, bright: 0.6, mid: 0.2, len: 44 },
];

// How far a streak travels before it wraps (in vw units)
const WRAP_AT = 160;

interface StreakState {
  x: number; // current left position in vw
}

function AnimatedStreaks() {
  // Track each streak's x position
  const stateRef = useRef<StreakState[]>(STREAK_DEFS.map((d) => ({ x: d.startX })));
  const [, forceRender] = useState(0);
  const lastTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    const now = time / 1000; // seconds
    const dt = lastTimeRef.current === null ? 0 : now - lastTimeRef.current;
    lastTimeRef.current = now;

    let changed = false;
    stateRef.current = stateRef.current.map((s, i) => {
      const newX = s.x + STREAK_DEFS[i].speed * dt;
      const wrapped = newX > WRAP_AT ? newX - WRAP_AT - 60 : newX;
      if (Math.abs(wrapped - s.x) > 0.01) changed = true;
      return { x: wrapped };
    });

    if (changed) forceRender((n) => n + 1);
  });

  return (
    <>
      {STREAK_DEFS.map((def, i) => {
        const x = stateRef.current[i]?.x ?? def.startX;
        return (
          <div
            key={i}
            className="absolute top-0 h-full pointer-events-none"
            style={{
              left: `${x}vw`,
              width: `${def.len}vw`,
              // Each streak spans full height as a rotated band
              transform: `rotate(${def.angle}deg)`,
              transformOrigin: 'top left',
            }}
          >
            {/* Core bright line */}
            <div
              style={{
                position: 'absolute',
                top: '-20vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${def.thickness}px`,
                height: '140vh',
                background: `linear-gradient(
                  to bottom,
                  transparent 0%,
                  rgba(200,170,255,${def.bright * 0.15}) 10%,
                  rgba(220,190,255,${def.bright}) 40%,
                  rgba(240,210,255,${def.bright}) 50%,
                  rgba(200,160,255,${def.bright}) 60%,
                  rgba(160,120,240,${def.mid}) 75%,
                  transparent 100%
                )`,
                filter: 'blur(0.4px)',
              }}
            />
            {/* Wide soft glow around the core */}
            <div
              style={{
                position: 'absolute',
                top: '-20vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${def.thickness * 12}px`,
                height: '140vh',
                background: `linear-gradient(
                  to bottom,
                  transparent 0%,
                  rgba(140,80,255,${def.mid * 0.3}) 15%,
                  rgba(160,100,255,${def.mid * 0.7}) 42%,
                  rgba(160,100,255,${def.mid * 0.7}) 58%,
                  rgba(120,70,220,${def.mid * 0.3}) 75%,
                  transparent 100%
                )`,
                filter: 'blur(4px)',
              }}
            />
          </div>
        );
      })}
    </>
  );
}

// ─── Film grain (animated SVG noise) ─────────────────────────────────────────
function FilmGrain() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '160px 160px',
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
      animate={{
        backgroundPosition: ['0px 0px', '30px 15px', '-20px 40px', '10px -30px', '0px 0px'],
      }}
      transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function HeroBackground() {
  const uid = useId().replace(/:/g, '');

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -10, background: '#08060f' }}
    >
      {/* SVG blur filter for the bloom */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={`bloom-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" result="blur" />
          </filter>
        </defs>
      </svg>

      {/* ── 1. Outer dark purple ambient fill ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 48% -10%, rgba(72,20,120,0.55) 0%, rgba(30,8,60,0.35) 40%, transparent 70%)',
        }}
      />

      {/* ── 2. Main purple bloom — intense bright core ── */}
      <div
        className="absolute"
        style={{
          top: '-15%',
          left: '50%',
          transform: 'translateX(-52%)',
          width: '70vw',
          height: '80vh',
          background:
            'radial-gradient(ellipse 65% 55% at 50% 20%, rgba(160,60,255,0.75) 0%, rgba(120,40,220,0.50) 22%, rgba(90,20,180,0.28) 42%, rgba(60,10,120,0.10) 60%, transparent 78%)',
          filter: 'blur(28px)',
        }}
      />
      {/* Bright hot core — small intense oval */}
      <motion.div
        className="absolute"
        style={{
          top: '-8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '28vw',
          height: '40vh',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 15%, rgba(210,130,255,0.65) 0%, rgba(170,80,255,0.40) 30%, rgba(130,50,220,0.15) 55%, transparent 75%)',
          filter: 'blur(12px)',
        }}
        animate={{ opacity: [0.85, 1, 0.88, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Extra specular highlight — tiny bright spot */}
      <motion.div
        className="absolute"
        style={{
          top: '-4%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10vw',
          height: '18vh',
          background:
            'radial-gradient(ellipse 55% 45% at 50% 10%, rgba(240,210,255,0.55) 0%, rgba(200,150,255,0.25) 40%, transparent 70%)',
          filter: 'blur(6px)',
        }}
        animate={{ opacity: [0.7, 1, 0.75, 1, 0.7], scaleX: [1, 1.06, 0.97, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 3. Diagonal light streaks (canvas-less, CSS + rAF) ── */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedStreaks />
      </div>

      {/* ── 4. Film grain ── */}
      <FilmGrain />

      {/* ── 5. Bottom vignette so sections below blend in ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #08060f)' }}
      />
      {/* Side vignettes to keep edges dark */}
      <div
        className="absolute inset-y-0 left-0 w-[20vw] pointer-events-none"
        style={{ background: 'linear-gradient(to right, #08060f, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[20vw] pointer-events-none"
        style={{ background: 'linear-gradient(to left, #08060f, transparent)' }}
      />
    </div>
  );
}
