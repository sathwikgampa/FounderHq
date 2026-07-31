'use client';

import React from 'react';
import { FileBarChart, ArrowUpRight, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            <FileBarChart className="text-[#6C63FF]" size={24} />
            Reports & Analytics
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Executive audit reports, cashflow analytics, and investor performance metrics.
          </p>
        </div>

        <button
          onClick={() => toast.success('Exporting Q3 Analytics Audit PDF...')}
          className="px-4 py-2 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold hover:bg-[#5b52e0] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download size={14} /> Export Report PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#ECECEC] space-y-2 shadow-sm">
          <span className="text-xs font-medium text-[#6B7280]">Total Revenue Growth</span>
          <div className="text-2xl font-bold text-[#111827]">$28,450</div>
          <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
            <ArrowUpRight size={12} /> +18% vs last month
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#ECECEC] space-y-2 shadow-sm">
          <span className="text-xs font-medium text-[#6B7280]">Customer LTV / CAC</span>
          <div className="text-2xl font-bold text-[#111827]">4.8x</div>
          <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
            <ArrowUpRight size={12} /> +0.4x efficiency score
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#ECECEC] space-y-2 shadow-sm">
          <span className="text-xs font-medium text-[#6B7280]">Gross Margin Ratio</span>
          <div className="text-2xl font-bold text-[#111827]">84.2%</div>
          <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
            <ArrowUpRight size={12} /> Top 5% SaaS Benchmark
          </span>
        </div>
      </div>
    </div>
  );
}
