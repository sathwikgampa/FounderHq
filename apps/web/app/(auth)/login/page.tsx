'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Loader2,
  BarChart3,
  Users,
  Zap,
  Shield,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';
import { OrbitBackground } from '@/components/ui/orbit-background';

// ── Password strength ────────────────────────────────────────────────────────
function getPasswordStrength(pass: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pass.length >= 8) score += 25;
  if (/[A-Z]/.test(pass)) score += 25;
  if (/[0-9]/.test(pass)) score += 25;
  if (/[^A-Za-z0-9]/.test(pass)) score += 25;

  if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 50) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 75) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

// ── Left panel feature card ──────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
    >
      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loginAsDemo, isAuthenticated } =
    useAuth();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = getPasswordStrength(password);

  // Handle ?mode=demo query param
  useEffect(() => {
    if (searchParams?.get('mode') === 'demo') {
      loginAsDemo();
      toast.success('Welcome to Demo Mode! Explore FounderHQ.', { icon: '✨' });
      router.push('/dashboard');
    }
  }, [searchParams, loginAsDemo, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
        toast.success('Welcome back! 🚀');
        router.push('/dashboard');
      } else {
        await signUpWithEmail(email, password, displayName || 'Founder');
        toast.success('Workspace created! Starting onboarding...');
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google! 🎉');
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-in failed. Try email & password.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemo = useCallback(() => {
    loginAsDemo();
    toast.success('Welcome to Demo Mode! ✨ Explore FounderHQ.');
    router.push('/dashboard');
  }, [loginAsDemo, router]);

  const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030304] text-white">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d0d22] to-[#030304] border-r border-white/5 p-12 relative overflow-hidden">
        <OrbitBackground />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 relative z-10"
        >
          <Image
            src="/logo.png"
            alt="FounderHQ"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-white font-semibold tracking-tight text-lg">FOUNDERHQ</span>
        </motion.div>

        {/* Hero Copy */}
        <div className="space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              AI Operating System v1.0
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.15] text-white mb-4">
              Your AI Executive{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Team, Ready
              </span>
              <br />
              to Run Your Startup.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              FounderHQ orchestrates Finance, Talent, Growth, and Operations through a unified CEO
              Planner — so you stay in complete control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3">
            <FeatureCard
              icon={Zap}
              title="CEO Planner Orchestration"
              description="One AI executive that coordinates all departments behind the scenes."
              delay={0.3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Startup Health Dashboard"
              description="Finance, hiring, growth, and operations scores updated in real-time."
              delay={0.4}
            />
            <FeatureCard
              icon={Shield}
              title="Approval & Memory Engine"
              description="Every decision logged, every risky action awaiting your approval."
              delay={0.5}
            />
            <FeatureCard
              icon={Users}
              title="Multi-Agent Collaboration"
              description="AI agents work together — finance checks, talent hires, growth launches."
              delay={0.6}
            />
          </div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative z-10"
        >
          <div className="glass-panel p-4 rounded-2xl border border-white/8">
            <p className="text-sm text-slate-300 leading-relaxed mb-3 italic">
              &ldquo;FounderHQ feels like having a full executive team. The CEO Planner orchestrates
              everything — finance, hiring, growth — from one conversation.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Alex Chen</p>
                <p className="text-[10px] text-slate-500">Founder, DevScale</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-amber-400 text-xs">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FounderHQ"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-white font-semibold text-sm tracking-tight">FOUNDERHQ</span>
        </div>

        <div className="w-full max-w-[400px] space-y-6">
          {/* Header */}
          <motion.div key={tab + '-header'} {...pageTransition} className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {tab === 'signin' ? 'Welcome back' : 'Start building'}
            </h2>
            <p className="text-sm text-slate-400">
              {tab === 'signin'
                ? 'Sign in to your FounderHQ workspace.'
                : 'Create your AI-powered founder workspace.'}
            </p>
          </motion.div>

          {/* Tab switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/8">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tab === t
                    ? 'bg-white text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              or with email
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Display name (signup only) */}
              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Chen"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="founder@startup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={handleDemo}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Use Demo instead?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength (signup only) */}
                {tab === 'signup' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1.5 pt-1"
                  >
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.score}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full ${strength.color}`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {[
                          { label: '8+ chars', met: password.length >= 8 },
                          { label: 'Uppercase', met: /[A-Z]/.test(password) },
                          { label: 'Number', met: /[0-9]/.test(password) },
                        ].map((req) => (
                          <span
                            key={req.label}
                            className={`text-[9px] flex items-center gap-0.5 ${req.met ? 'text-emerald-400' : 'text-slate-600'}`}
                          >
                            {req.met && <Check className="w-2.5 h-2.5" />}
                            {req.label}
                          </span>
                        ))}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          strength.score <= 25
                            ? 'text-red-400'
                            : strength.score <= 50
                              ? 'text-amber-400'
                              : strength.score <= 75
                                ? 'text-blue-400'
                                : 'text-emerald-400'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{tab === 'signin' ? 'Sign In to Workspace' : 'Create Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Demo shortcut card */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Try without signing up</p>
                <p className="text-[11px] text-slate-500">Explore FounderHQ instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemo}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-[11px] font-semibold transition-all flex items-center gap-1"
            >
              Demo
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Back to landing */}
          <p className="text-center text-xs text-slate-600">
            <Link href="/" className="hover:text-slate-400 transition-colors">
              ← Back to FounderHQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
