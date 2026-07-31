"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Globe,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loginAsDemo, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Signed in successfully!");
      } else {
        await signUpWithEmail(email, password, workspaceName || "Founder");
        toast.success("Workspace created successfully!");
      }
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Authentication error. Switched to Demo Mode.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    toast.success("Logged in as Demo Founder!");
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Google Authentication successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Google login failed. Switched to Demo Mode.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 space-y-4"
      >
        {/* Quick Demo Mode Banner Card */}
        <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between shadow-lg backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-foreground">Explore Instant Demo Mode</div>
              <div className="text-[11px] text-muted-foreground">Skip authentication & test the OS</div>
            </div>
          </div>
          <Button size="sm" onClick={handleDemoLogin} className="rounded-xl text-xs font-semibold shadow-sm">
            Try Demo
          </Button>
        </Card>

        <Card className="rounded-2xl border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-4 border-b border-border/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              {mode === "signin" ? "Sign In to FounderHQ" : "Create Founder Workspace"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {mode === "signin"
                ? "Access your AI Operating System dashboard & tools"
                : "Initialize your startup engineering foundation"}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 mt-4">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full text-xs rounded-xl h-10 gap-2"
              >
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleDemoLogin}
                className="w-full text-xs rounded-xl h-10 gap-2"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Demo User</span>
              </Button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border/60" />
              <span className="absolute bg-card px-2 text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                Or with email
              </span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Startup / Workspace Name</label>
                  <input
                    type="text"
                    required
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-foreground">Password</label>
                  {mode === "signin" && (
                    <a href="#forgot" onClick={handleDemoLogin} className="text-[11px] text-primary hover:underline">
                      Use Demo Login?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-9 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter for Signup */}
                {mode === "signup" && password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength < 50 ? "bg-red-500" : strength < 100 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right">
                      Password Security Strength: {strength}%
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl h-10 shadow-md font-semibold text-xs mt-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In to Workspace" : "Create Workspace"}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← Return to FounderHQ Landing Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
