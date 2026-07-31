'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { FloatingSidebar } from '@/components/layout/floating-sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { KnowledgeChatbot } from '@/components/rag/knowledge-chatbot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAFB] text-[#111827] w-full relative font-sans antialiased selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">
        {/* Clean Floating Sidebar */}
        <FloatingSidebar />

        {/* Main Content Container: max-w-1600px */}
        <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-6">
            <TopNavbar />
            <main className="flex-1 w-full">{children}</main>
          </div>
        </div>

        {/* Enterprise RAG Knowledge Chatbot */}
        <KnowledgeChatbot />
      </div>
    </ProtectedRoute>
  );
}
