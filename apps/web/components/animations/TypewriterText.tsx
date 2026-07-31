'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  lines: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  cursorClassName?: string;
  loop?: boolean;
}

export function TypewriterText({
  lines,
  className = '',
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2200,
  cursorClassName = '',
  loop = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentLine = lines[lineIndex] ?? '';

    const tick = () => {
      if (phase === 'typing') {
        if (charIndex < currentLine.length) {
          setDisplayText(currentLine.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          setPhase('pausing');
          timeoutRef.current = setTimeout(() => setPhase('deleting'), pauseDuration);
        }
      } else if (phase === 'deleting') {
        if (charIndex > 0) {
          setDisplayText(currentLine.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
          timeoutRef.current = setTimeout(tick, deletingSpeed);
        } else {
          const nextIndex = (lineIndex + 1) % lines.length;
          if (!loop && nextIndex === 0) return;
          setLineIndex(nextIndex);
          setPhase('typing');
        }
      }
    };

    timeoutRef.current = setTimeout(tick, phase === 'typing' ? typingSpeed : deletingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, charIndex, lineIndex, lines, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {displayText}
      <span
        className={`inline-block w-[2px] h-[1em] ml-1 align-middle animate-blink bg-current ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
}
