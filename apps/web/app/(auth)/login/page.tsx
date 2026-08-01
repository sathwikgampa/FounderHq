'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loginAsDemo } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Validation
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Auth error:', err);
      // Fallback for demo environments if Firebase isn't configured
      if (errorObj.message && errorObj.message.includes('Firebase')) {
        loginAsDemo();
        router.push('/dashboard');
      } else {
        setError(errorObj.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully authenticated with Google!', { icon: '🌐' });
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Google Auth error:', err);
      if (errorObj.message && errorObj.message.includes('Firebase')) {
        loginAsDemo();
        router.push('/dashboard');
      } else {
        setError(errorObj.message || 'Google Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    loginAsDemo();
    router.push('/dashboard');
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL - Branded */}
      <div className="hidden md:flex md:w-1/2 bg-[#F5F5F0] p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-900/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center max-w-lg z-10">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#1A1F36] mb-6 leading-[1.1]">
            AI Executive
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
            A strategic, always-on AI partner that orchestrates company success through a unified
            CEO Planner.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 mt-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
            FH
          </div>
          <span className="font-bold tracking-tight text-[#1A1F36]">FOUNDERHQ</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-[#1A1F36]/5 text-[#1A1F36] text-[10px] font-bold tracking-wider uppercase border border-[#1A1F36]/10">
            v1.0 OS
          </span>
        </div>
      </div>

      {/* RIGHT PANEL - Authentication Form */}
      <div className="w-full md:w-1/2 bg-[#141414] min-h-screen flex items-center justify-center p-6 relative">
        {/* Mobile Logo */}
        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
            FH
          </div>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Workspace' : 'Welcome back'}
            </h2>
            <p className="text-sm text-slate-400">
              {isSignUp
                ? 'Sign up to start building your AI-driven company.'
                : 'Sign in to your FounderHQ workspace.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-white/5 rounded-full mb-8 relative border border-white/5">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 z-10 ${
                !isSignUp ? 'text-black bg-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 z-10 ${
                isSignUp ? 'text-black bg-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* OAuth */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full mb-6 flex items-center justify-center gap-3 py-3 px-4 bg-transparent border border-white/20 hover:bg-white/5 disabled:opacity-50 rounded-xl transition-colors group"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative bg-[#141414] px-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Or with Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-white/5 border ${
                      error && isSignUp && !name.trim() ? 'border-red-500/50' : 'border-white/10'
                    } focus:border-[#7C5CFF] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF]/50 transition-all`}
                    placeholder="Sarah Founder"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white/5 border ${
                    error && error.includes('email') ? 'border-red-500/50' : 'border-white/10'
                  } focus:border-[#7C5CFF] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF]/50 transition-all`}
                  placeholder="founder@startup.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/5 border ${
                    error && (error.includes('password') || error.includes('match'))
                      ? 'border-red-500/50'
                      : 'border-white/10'
                  } focus:border-[#7C5CFF] rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF]/50 transition-all`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/5 border ${
                      error && error.includes('match') ? 'border-red-500/50' : 'border-white/10'
                    } focus:border-[#7C5CFF] rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF]/50 transition-all`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#2C5FA8] hover:bg-[#255294] disabled:bg-[#2C5FA8]/50 text-white rounded-xl text-sm font-semibold transition-all group shadow-lg shadow-blue-900/20"
              >
                <span>
                  {isLoading
                    ? 'Processing...'
                    : isSignUp
                      ? 'Create Workspace'
                      : 'Sign in to Workspace'}
                </span>
                {!isLoading && (
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </div>
          </form>

          {/* Secondary Link */}
          <div className="mt-6 text-center">
            <button
              onClick={handleDemoAuth}
              disabled={isLoading}
              className="text-sm text-slate-400 hover:text-white font-medium transition-colors inline-block"
            >
              Try Demo Workspace →
            </button>
          </div>

          {/* Footer */}
          <div className="mt-20">
            <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-400 transition-colors">
                Back to FounderHQ
              </Link>
              <span>•</span>
              <button className="hover:text-slate-400 transition-colors">Security</button>
              <span>•</span>
              <button className="hover:text-slate-400 transition-colors">Terms</button>
            </div>
          </div>
        </div>

        {/* Decorative branding sparkle */}
        <div className="absolute bottom-6 right-6 text-white/5 pointer-events-none">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
