'use client';

import React, { useEffect, useRef } from 'react';

interface AuraBackgroundProps {
  projectId?: string;
  className?: string;
}

export function AuraBackground({
  projectId = 'ILgOO23w4wEyPQOKyLO4',
  className = '',
}: AuraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Canvas Fallback Aurora & Mouse Reaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Particle Setup
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Base background
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, width, height);

      // 1. Primary Indigo Glow Blob
      const grad1X = width * 0.5 + Math.sin(time * 0.6) * 120 + (mouseX - width / 2) * 0.1;
      const grad1Y = height * 0.35 + Math.cos(time * 0.4) * 80 + (mouseY - height / 2) * 0.1;
      const grad1 = ctx.createRadialGradient(grad1X, grad1Y, 10, grad1X, grad1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
      grad1.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      grad1.addColorStop(1, 'rgba(3, 3, 4, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Secondary Purple Aurora Blob
      const grad2X = width * 0.65 + Math.cos(time * 0.5) * 150 - (mouseX - width / 2) * 0.08;
      const grad2Y = height * 0.55 + Math.sin(time * 0.7) * 100 - (mouseY - height / 2) * 0.08;
      const grad2 = ctx.createRadialGradient(grad2X, grad2Y, 10, grad2X, grad2Y, width * 0.4);
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.18)');
      grad2.addColorStop(0.6, 'rgba(139, 92, 246, 0.04)');
      grad2.addColorStop(1, 'rgba(3, 3, 4, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Interactive Mouse Glow Highlight
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 350);
      mouseGrad.addColorStop(0, 'rgba(165, 180, 252, 0.12)');
      mouseGrad.addColorStop(1, 'rgba(3, 3, 4, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Floating Aurora Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(time * 2 + p.x) * 0.15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${Math.max(0.05, Math.min(0.7, currentAlpha))})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load Unicorn Studio Script for exact asset ILgOO23w4wEyPQOKyLO4
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptId = 'unicorn-studio-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initUnicorn = () => {
      if (
        (window as any).UnicornStudio &&
        typeof (window as any).UnicornStudio.init === 'function'
      ) {
        try {
          (window as any).UnicornStudio.init();
        } catch (e) {
          console.warn('UnicornStudio initialization caught error:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        initUnicorn();
      };
      document.head.appendChild(script);
    } else {
      initUnicorn();
    }
  }, [projectId]);

  return (
    <div
      className={`aura-background-component fixed top-0 left-0 w-full h-screen -z-10 pointer-events-none overflow-hidden ${className}`}
      data-alpha-mask="80"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
      }}
    >
      {/* 1. Canvas Shader / Aurora Fallback */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-20 pointer-events-none"
      />

      {/* 2. Unicorn Studio Live Project Layer */}
      <div className="aura-background-component top-0 w-full -z-10 absolute h-full pointer-events-none">
        <div data-us-project={projectId} className="absolute w-full h-full left-0 top-0 -z-10" />
      </div>
    </div>
  );
}
