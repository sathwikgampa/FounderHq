"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loginAsDemo, isAuthenticated, user } = useAuth();

  const handleDemoClick = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border py-4 px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center space-x-2">
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-black">
            F
          </div>
          <span>FounderHQ</span>
        </Link>
        <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#docs" className="hover:text-foreground">Docs</a>
          {isAuthenticated ? (
            <Link href="/dashboard" className="text-foreground hover:underline font-semibold">
              Dashboard ({user?.displayName || "Founder"})
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-foreground hover:underline">Sign In</Link>
              <Button
                size="sm"
                onClick={handleDemoClick}
                className="rounded-xl text-xs gap-1.5 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Try Demo</span>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FounderHQ Inc. Production-Grade Foundation.
      </footer>
    </div>
  );
}
