'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Native HTML5 Canvas 2D Bar Chart Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = [92, 96, 98, 97, 99, 98, 97];
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 214;
    const height = rect.height || 112;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = 14;
    const gap = (width - data.length * barWidth) / (data.length + 1);

    data.forEach((val, i) => {
      const x = gap + i * (barWidth + gap);
      const normVal = (val - 80) / 20;
      const barHeight = Math.max(10, normVal * (height - 20));
      const y = height - barHeight - 4;

      ctx.fillStyle = '#60a5fa';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 6);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    });
  }, []);

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Load UnicornStudio script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        if (
          (window as any).UnicornStudio &&
          typeof (window as any).UnicornStudio.init === 'function'
        ) {
          (window as any).UnicornStudio.init();
        }
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-blue-500/30 selection:text-blue-200 font-sans relative overflow-x-hidden">
      {/* Background Aura Component */}
      <div
        className="aura-background-component top-0 w-full h-screen z-0 brightness-50 saturate-50 fixed blur-sm pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        }}
      >
        <div className="fixed inset-0 -z-10 bg-black">
          <div
            className="aura-background-component absolute inset-0 w-full h-full"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          >
            <div
              data-us-project="XxCmD31vVBmiINgvYCho"
              className="absolute inset-0 w-full h-full bg-neutral-950"
            />
          </div>
        </div>
      </div>

      {/* SVG Grid Overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M64 0H0v64" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Hero Section */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pb-24 lg:pt-24">
          {/* Pill Badge */}
          <div className="mx-auto w-fit mb-6 [animation:fadeSlideIn_0.8s_ease-out_0.1s_both] animate-on-scroll animate">
            <div
              className="inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 px-3 py-1.5 text-xs text-neutral-300"
              style={{ borderRadius: '9999px' }}
            >
              <span className="inline-flex items-center justify-center rounded-full bg-blue-400/20 text-blue-300 px-2 py-0.5 font-medium">
                New
              </span>
              <span className="font-medium">Simple pricing</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                style={{ color: 'rgb(96, 165, 250)' }}
              >
                <path
                  fill="currentColor"
                  d="M11.811 6.727C12.825 4.909 13.331 4 14.09 4c.757 0 1.264.909 2.277 2.727l.262.47c.288.517.432.775.657.945c.224.17.504.234 1.063.36l.51.116c1.967.445 2.95.667 3.185 1.42s-.437 1.537-1.778 3.106l-.347.406c-.381.445-.572.668-.658.944s-.057.573 0 1.168l.053.541c.203 2.094.305 3.14-.308 3.605s-1.534.041-3.377-.807l-.476-.22c-.524-.24-.786-.361-1.063-.361c-.278 0-.54.12-1.063.361l-.477.22c-1.842.848-2.763 1.272-3.376.807s-.511-1.511-.309-3.605l.053-.541c.057-.595.086-.892 0-1.168s-.276-.498-.657-.944l-.347-.406C6.57 11.575 5.9 10.79 6.135 10.038s1.218-.975 3.185-1.42l.51-.116c.559-.126.838-.19 1.063-.36s.368-.428.656-.945z"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8.745 5.202c-1.981-.57-4.107-.269-6.158.932l-.208.122a.75.75 0 0 1-.758-1.294l.208-.122C4.19 3.457 6.737 3.063 9.161 3.76l.208.06a.75.75 0 0 1-.416 1.441zM4.836 9.936a.75.75 0 0 1-.683.811c-.154.014-.27.02-.37.027a3 3 0 0 0-.444.048c-.196.038-.452.117-.915.349a.75.75 0 1 1-.67-1.342c.537-.268.926-.408 1.302-.48c.247-.048.502-.064.731-.08l.238-.016a.75.75 0 0 1 .811.683m1.082 5.92a3.99 3.99 0 0 0-3.365.733a.75.75 0 1 1-.928-1.178a5.49 5.49 0 0 1 4.635-1.015a.75.75 0 0 1-.342 1.46"
                  clipRule="evenodd"
                  opacity=".5"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="[animation:fadeSlideIn_0.8s_ease-out_0.2s_both] animate-on-scroll text-center animate">
            <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white">
              Powering the next wave of AI‑driven products
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-neutral-300">
              Fluxora helps ambitious teams prototype, launch, and scale with reliable
              infrastructure and human‑centered design.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 items-center justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_1px_2px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all"
                style={{ borderRadius: '9999px' }}
              >
                Start Free
              </button>

              <div className="inline-block group relative">
                <button
                  className="inline-flex gap-2 border-gradient hover:text-white transition-all hover:-translate-y-0.5 text-sm font-medium text-white/80 bg-white/5 rounded-full pt-3 pr-5 pb-3 pl-5 backdrop-blur-xl items-center"
                  style={{ borderRadius: '9999px' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                      clipRule="evenodd"
                      opacity=".5"
                    />
                    <path
                      fill="currentColor"
                      d="m15.414 13.059l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059l4.72 2.787c.781.462.781 1.656 0 2.118"
                    />
                  </svg>
                  Watch demo
                </button>
                <span
                  className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(60% 100% at 50% 50%, rgba(59,130,246,.55), rgba(59,130,246,.28) 35%, transparent 70%)',
                    filter: 'blur(10px) saturate(120%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Bento Grid (Fixed h-[800px]) */}
          <div
            id="platform"
            className="grid grid-cols-1 auto-rows-[200px] md:mt-16 md:grid-cols-6 md:gap-6 lg:grid-cols-12 lg:mt-32 overflow-hidden h-[800px] mt-16 gap-4"
            style={{
              maskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
            }}
          >
            {/* Card 1: Product Team Image Card */}
            <div
              className="relative overflow-hidden rounded-3xl border-gradient md:col-span-3 lg:col-span-6 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.3s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <img
                className="h-full w-full object-cover opacity-90"
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/357cb3d1-9f65-4810-884b-f0072a65193d_1600w.webp"
                alt="Product team"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
              <div className="absolute left-4 top-4">
                <span
                  className="inline-flex items-center gap-1 text-[11px] border-gradient text-slate-300 bg-white/5 rounded-full px-2.5 py-1 backdrop-blur"
                  style={{ borderRadius: '9999px' }}
                >
                  Product Team
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full ring-2 ring-white/20 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                      alt="avatar"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full ring-2 ring-white/20 overflow-hidden -ml-2">
                    <img
                      className="h-full w-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2f999a94-4340-424d-b6bd-1e2df830c25a_100w.webp"
                      alt="avatar"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full ring-2 ring-white/20 overflow-hidden -ml-2">
                    <img
                      className="w-full h-full object-cover"
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/08b00610-8646-44ce-a131-48226b9e2898_100w.webp"
                      alt="avatar"
                    />
                  </div>
                </div>
                <span className="text-xs text-neutral-200 font-medium">Design sync at 10:00</span>
              </div>
            </div>

            {/* Card 2: Stat Card (140+ Active customers) */}
            <div
              className="rounded-3xl bg-white text-neutral-900 p-6 border-gradient md:col-span-3 lg:col-span-3 [animation:fadeSlideIn_0.8s_ease-out_0.4s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0.95) 100%)',
                borderRadius: '24px',
              }}
            >
              <p className="text-4xl tracking-tighter font-extrabold text-neutral-950 font-mono">
                140+
              </p>
              <p className="mt-2 text-sm text-neutral-600 font-medium">Active customers</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12"
                    opacity=".5"
                  />
                  <path
                    fill="currentColor"
                    d="M14.5 10.75a.75.75 0 0 1 0-1.5H17a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-.69l-2.013 2.013a1.75 1.75 0 0 1-2.474 0l-1.586-1.586a.25.25 0 0 0-.354 0L7.53 14.53a.75.75 0 0 1-1.06-1.06l2.293-2.293a1.75 1.75 0 0 1 2.474 0l1.586 1.586a.25.25 0 0 0 .354 0l2.012-2.013z"
                  />
                </svg>
                <span>Q4 growth 23%</span>
              </div>
            </div>

            {/* Card 3: Code Snippet Card */}
            <article
              className="overflow-hidden border-gradient rounded-3xl relative md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.5s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="h-full p-6 relative flex flex-col justify-between">
                <div className="relative mx-auto h-full w-full flex items-center justify-center flex-1">
                  <div className="scale-[0.85] w-full">
                    <div className="backdrop-blur-[2px] bg-white/[0.03] border-gradient rounded-2xl">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          <path
                            fill="currentColor"
                            d="M16.443 7.328a.75.75 0 0 1 1.059-.056l1.737 1.564c.737.663 1.347 1.212 1.767 1.71c.44.525.754 1.088.754 1.784c0 .695-.313 1.258-.754 1.782c-.42.499-1.03 1.049-1.767 1.711l-1.737 1.564a.75.75 0 1 1-1.004-1.115l1.697-1.527c.788-.709 1.319-1.19 1.663-1.598c.33-.393.402-.622.402-.817c0-.196-.072-.425-.402-.818c-.344-.409-.875-.889-1.663-1.598l-1.697-1.527a.75.75 0 0 1-.056-1.06m-8.94 1.06a.75.75 0 0 0-1.004-1.115L4.761 8.836c-.737.663-1.347 1.212-1.767 1.71c-.44.525-.754 1.088-.754 1.784c0 .695.313 1.258.754 1.782c.42.499 1.03 1.049 1.767 1.711l1.737 1.564a.75.75 0 1 0 1.004-1.115l-1.697-1.527c-.788-.709-1.319-1.19-1.663-1.598c-.33-.393-.402-.622-.402-.817c0-.196.072-.425.402-.818c.344-.409.875-.889 1.663-1.598z"
                          />
                          <path
                            fill="currentColor"
                            d="M14.182 4.276a.75.75 0 0 1 .53.918l-3.974 14.83a.75.75 0 1 1-1.449-.389l3.974-14.83a.75.75 0 0 1 .919-.53"
                            opacity=".5"
                          />
                        </svg>
                        <span className="text-[11px] font-medium text-white/80">config.tsx</span>
                        <span className="ml-auto text-[10px] text-white/50 font-mono">
                          modified
                        </span>
                      </div>
                      <pre className="text-[11px] font-mono leading-relaxed text-white/80 p-4">
                        {`export const appConfig = {
  framework: "next",
  runtime: "edge",
  regions: ["sfo1", "iad1"],
  env: {
    DATABASE_URL: process.env.DB,
    REDIS_TOKEN: process.env.CACHE
  }
}

deploy(appConfig)`}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="relative pt-2">
                  <h3 className="text-base font-semibold tracking-tight text-white/95">
                    Deploy instantly
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    Push to production in seconds with zero configuration.
                  </p>
                </div>
              </div>
            </article>

            {/* Card 4: Chart Card */}
            <div
              className="rounded-3xl border-gradient p-6 md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.6s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div>
                <h3 className="text-base font-semibold tracking-tight">Delivery success</h3>
                <p className="mt-1 text-xs text-neutral-300">Last 30 days</p>
              </div>
              <div className="mt-4 rounded-xl bg-black/40 p-3 border-gradient">
                <div className="relative w-full h-[120px]">
                  <canvas ref={canvasRef} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-sm font-semibold tracking-tight">97.8%</span>
                </div>
                <span className="text-xs text-neutral-300 font-medium">SLA met</span>
              </div>
            </div>

            {/* Card 5: Global Mesh Card */}
            <div
              className="relative overflow-hidden rounded-3xl border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.7s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="p-6">
                <p className="text-3xl font-extrabold tracking-tighter font-mono">35+</p>
                <p className="mt-1 text-xs text-neutral-300">Global launches this year</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    Japan
                  </span>
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    Canada
                  </span>
                  <span
                    className="inline-flex items-center rounded-full bg-blue-400/15 text-blue-300 px-2.5 py-0.5 text-[11px] font-medium border-gradient"
                    style={{ borderRadius: '9999px' }}
                  >
                    Portugal
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-2xl border-gradient">
                  <img
                    className="h-36 w-full object-cover"
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d25a1767-0ea8-4aac-b981-6afd67dc79a6_800w.webp"
                    alt="Globe"
                  />
                </div>
              </div>
            </div>

            {/* Card 6: AI Agent Card */}
            <article
              className="relative overflow-hidden hover:bg-white/[0.08] transition-all group rounded-3xl border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.8s_both] animate-on-scroll animate flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="flex p-6 items-center justify-between">
                <h4 className="text-base font-semibold tracking-tight">Custom AI Agents</h4>
                <span
                  className="inline-flex items-center gap-1 text-[11px] border-gradient text-slate-300 bg-white/5 rounded-full px-2.5 py-1"
                  style={{ borderRadius: '9999px' }}
                >
                  AI-Powered
                </span>
              </div>
              <div className="flex-1 flex p-6 pt-0 items-center">
                <div className="relative w-full">
                  <div className="hover:bg-black/50 transition-all bg-black/60 border-gradient rounded-xl p-3 backdrop-blur">
                    <div className="flex gap-1 mb-2 items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-400/80" />
                    </div>
                    <div className="overflow-x-auto">
                      <pre className="text-[10px] font-mono leading-tight min-w-max text-slate-300">
                        <code>{`# AI Agent
class BusinessAgent:
  def __init__(self):
    self.mode = "adaptive"

  def analyze(self):
    return insights`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 7: Orbit Automations Card */}
            <section
              className="group relative overflow-hidden border-gradient rounded-3xl md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_0.9s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="relative h-full overflow-hidden flex flex-col justify-between">
                <div className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[140px]">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '.6s' }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-pulse"
                      style={{ animationDelay: '1.2s' }}
                    />
                  </div>
                  <div className="relative z-10">
                    <div
                      className="relative flex h-20 w-20 items-center justify-center rounded-full border-gradient bg-neutral-900/70 backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
                      style={{ borderRadius: '9999px' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M2 17.5A4.5 4.5 0 0 1 6.5 13h2.7c.63 0 .945 0 1.186.123c.211.107.384.28.491.491c.123.24.123.556.123 1.186v2.7a4.5 4.5 0 1 1-9 0m11-11a4.5 4.5 0 1 1 4.5 4.5h-3.214c-.15 0-.224 0-.287-.007a1.125 1.125 0 0 1-.992-.992C13 9.938 13 9.864 13 9.714z"
                        />
                        <path
                          fill="currentColor"
                          d="M2 6.5a4.5 4.5 0 0 1 9 0v3c0 .349 0 .523-.038.666a1.13 1.13 0 0 1-.796.796C10.023 11 9.85 11 9.5 11h-3A4.5 4.5 0 0 1 2 6.5m11 8c0-.349 0-.523.038-.666c.104-.388.408-.692.796-.796c.143-.038.317-.038.666-.038h3a4.5 4.5 0 1 1-4.5 4.5z"
                          opacity=".5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="relative border-t border-white/10 p-5">
                  <h3 className="text-base font-semibold tracking-tight text-slate-100">
                    Adaptive Automations
                  </h3>
                  <p className="leading-relaxed text-slate-400 mt-1 text-xs">
                    Event‑driven flows across your stack.
                  </p>
                </div>
              </div>
            </section>

            {/* Card 8: Testimonial Card */}
            <div
              className="flex flex-col justify-between rounded-3xl border-gradient p-6 backdrop-blur-md transition md:col-span-3 lg:col-span-3 md:row-span-2 [animation:fadeSlideIn_0.8s_ease-out_1s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                    alt="Serena Cardenas"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">Serena Cardenas</p>
                    <p className="text-[10px] text-white/60">Design Ops</p>
                  </div>
                </div>
              </div>
              <p className="leading-snug text-xs font-medium text-white mb-3">
                &quot;Animations feel organic, copy is on point, and accessibility is baked in from
                day one.&quot;
              </p>
              <div className="rounded-lg border-gradient p-3 bg-white/5">
                <p className="text-[11px] text-white/90 mb-1.5 font-semibold">Key Results:</p>
                <ul className="text-[11px] text-white/70 space-y-1 font-mono">
                  <li>• 127% user engagement</li>
                  <li>• 43% fewer tickets</li>
                  <li>• 98% compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Marquee Section */}
        <section
          id="testimonials"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative"
        >
          <div
            className="overflow-hidden rounded-3xl ring-white/10 ring-1 p-6 sm:p-8 relative backdrop-blur border-gradient"
            style={{
              background:
                'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
              borderRadius: '24px',
            }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="[animation:fadeSlideIn_0.8s_ease-out_0.1s_both] animate-on-scroll text-center mb-10 animate">
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-blue-400">
                  <span>TESTIMONIALS</span>
                  <span>(02)</span>
                </div>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl sm:text-4xl md:text-5xl text-white text-left font-extrabold tracking-tighter">
                  What our customers say
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 text-left max-w-[42ch] mt-2 sm:mt-0">
                  Real feedback from teams using Fluxora to build better, ship faster, and scale
                  smarter.
                </p>
              </div>
            </div>

            {/* Marquee Row */}
            <div
              className="relative overflow-hidden rounded-3xl ring-white/10 ring-1 border-gradient [animation:fadeSlideIn_0.8s_ease-out_0.2s_both] animate-on-scroll animate"
              style={{
                background:
                  'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
                borderRadius: '24px',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

              <div className="relative py-6 sm:py-8">
                <div className="animate-marquee-ltr space-x-6">
                  {/* Testimonial 1 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4c9aa348-ff35-430c-abeb-a6b169fb665d_100w.webp"
                        alt="Michael Chen"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">Michael Chen</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">CEO, TechFlow</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      The AI automation in Fluxora has{' '}
                      <span className="text-blue-400">saved us countless hours</span> every week.
                      Our team is more productive than ever.
                    </p>
                  </article>

                  {/* Testimonial 2 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/67ea0bb9-c020-4357-bb6a-54070a7b9ce7_100w.webp"
                        alt="Emily Rodriguez"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">Emily Rodriguez</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">Product Lead, Innovate Labs</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      Switching to Fluxora was the{' '}
                      <span className="text-blue-400">best decision</span> we made this year. The
                      integrations are seamless.
                    </p>
                  </article>

                  {/* Testimonial 3 */}
                  <article
                    className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border-gradient bg-white/5 ring-1 ring-white/10 p-5"
                    style={{ borderRadius: '16px' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61cab6ed-972d-4d76-8094-1a3b9bbab509_100w.webp"
                        alt="David Kim"
                        className="h-9 w-9 object-cover rounded-full ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">David Kim</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            style={{ color: 'rgb(52, 211, 153)' }}
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-400">Engineering Manager, CloudBase</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 tracking-tight">
                      Fluxora&apos;s intelligent task prioritization helps us{' '}
                      <span className="text-blue-400">ship features faster</span> and with more
                      confidence.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingChatbot />
    </div>
  );
}
