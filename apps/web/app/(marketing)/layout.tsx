'use client';

import React from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-blue-500/30 selection:text-blue-200">
      <main className="flex-1">{children}</main>
    </div>
  );
}
