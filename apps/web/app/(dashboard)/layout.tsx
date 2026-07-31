'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background w-full">
        <Sidebar />
        <div className="md:pl-64 flex flex-col flex-1 relative min-h-screen">
          <TopNavbar />
          <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
