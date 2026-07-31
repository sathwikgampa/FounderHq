'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { FloatingSidebar } from '@/components/layout/floating-sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { AuraBackground } from '@/components/ui/aura-background';
import { KnowledgeChatbot } from '@/components/rag/knowledge-chatbot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#030304] text-white w-full relative selection:bg-[#7C5CFF]/30 selection:text-[#7C5CFF]">
        <AuraBackground />
        
        {/* Floating Sidebar */}
        <FloatingSidebar />

        {/* Main Content Area: 12-column grid container */}
        <div className="lg:pl-80 flex flex-col flex-1 min-h-screen">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-6">
            <TopNavbar />
            <main className="flex-1 w-full">{children}</main>
          </div>
        </div>

        {/* Enterprise RAG Knowledge Chatbot Drawer */}
        <KnowledgeChatbot />
      </div>
    </ProtectedRoute>
  );
}
