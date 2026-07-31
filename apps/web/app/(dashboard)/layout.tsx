"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { LayoutDashboard, Settings, User, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 px-2">
              <div className="h-6 w-6 rounded-md bg-primary" />
              <span className="font-bold text-lg tracking-tight">FounderHQ OS</span>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground bg-accent"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between px-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-xs">Founder</span>
              </div>
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
