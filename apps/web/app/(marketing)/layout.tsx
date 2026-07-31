'use client';

import React from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-slate-400 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <main className="flex-1">{children}</main>
    </div>
  );
}
