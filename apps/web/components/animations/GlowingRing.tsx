'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingRingProps {
  children?: ReactNode;
  className?: string;
  ringColor?: string;
  glowColor?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: string;
}

export function GlowingRing({
  children,
  className = '',
  ringColor = 'rgba(99,102,241,0.6)',
  glowColor = 'rgba(99,102,241,0.25)',
  duration = 3,
  borderWidth = 1,
  borderRadius = '9999px',
}: GlowingRingProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Animated ring */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          border: `${borderWidth}px solid ${ringColor}`,
          boxShadow: `0 0 12px 2px ${glowColor}, inset 0 0 8px 1px ${glowColor}`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          boxShadow: [
            `0 0 8px 1px ${glowColor}, inset 0 0 4px 0px ${glowColor}`,
            `0 0 22px 6px ${glowColor}, inset 0 0 14px 3px ${glowColor}`,
            `0 0 8px 1px ${glowColor}, inset 0 0 4px 0px ${glowColor}`,
          ],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating highlight arc */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
        animate={{ rotate: 360 }}
        transition={{ duration: duration * 4, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute"
          style={{
            top: -borderWidth,
            left: '15%',
            width: '30%',
            height: borderWidth * 2,
            background: `linear-gradient(90deg, transparent, white, transparent)`,
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
      </motion.span>

      {children}
    </div>
  );
}
