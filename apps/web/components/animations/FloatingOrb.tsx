'use client';

import { motion } from 'framer-motion';

interface FloatingOrbProps {
  className?: string;
  size?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  blur?: number;
  duration?: number;
}

export function FloatingOrb({
  className = '',
  size = 600,
  color1 = '#6366f1',
  color2 = '#8b5cf6',
  color3 = '#06b6d4',
  blur = 80,
  duration = 8,
}: FloatingOrbProps) {
  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer breathing ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${color1}22, ${color2}11, transparent 70%)`,
          border: `1px solid ${color1}22`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: duration * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '10%',
          background: `radial-gradient(circle at 60% 35%, ${color2}33, ${color1}22, transparent 65%)`,
          border: `1px solid ${color2}30`,
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.7, 1, 0.7],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '25%',
          background: `radial-gradient(circle at 45% 35%, ${color3}55, ${color1}66, ${color2}44, transparent 70%)`,
          filter: `blur(${blur * 0.3}px)`,
          boxShadow: `0 0 ${blur}px ${color1}44, 0 0 ${blur * 2}px ${color2}22`,
        }}
        animate={{
          scale: [1, 1.18, 0.95, 1],
          opacity: [0.8, 1, 0.75, 0.8],
        }}
        transition={{
          duration: duration * 0.9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '38%',
          background: `radial-gradient(circle at 50% 40%, white, ${color3}cc, ${color1}88)`,
          filter: `blur(${blur * 0.15}px)`,
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: duration * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />

      {/* Floating drift — whole orb gently moves */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -20, 8, -12, 0],
          x: [0, 10, -8, 5, 0],
        }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
