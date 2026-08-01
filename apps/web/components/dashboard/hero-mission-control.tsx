'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ArrowUpRight,
  TrendingDown,
  Pencil,
  X,
  Check,
  Sparkles,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUserStartupMetrics } from '@/hooks/use-user-startup-metrics';
import { toast } from 'sonner';

export function HeroMissionControl() {
  const { user } = useAuth();
  const { metrics, saveMetrics, loadDemoData, resetToNewUser } = useUserStartupMetrics();
  const [greeting, setGreeting] = useState('Good Morning');
  const [healthExpanded, setHealthExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State for Editing Metrics
  const [editForm, setEditForm] = useState({
    revenue: '',
    revenueTrend: '',
    runway: '',
    runwayTrend: '',
    burn: '',
    burnTrend: '',
    growth: '',
    growthTrend: '',
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const openModal = () => {
    setEditForm({
      revenue: metrics.revenue ?? '',
      revenueTrend: metrics.revenueTrend ?? '',
      runway: metrics.runway ?? '',
      runwayTrend: metrics.runwayTrend ?? '',
      burn: metrics.burn ?? '',
      burnTrend: metrics.burnTrend ?? '',
      growth: metrics.growth ?? '',
      growthTrend: metrics.growthTrend ?? '',
    });
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMetrics({
      revenue: editForm.revenue.trim() || null,
      revenueTrend: editForm.revenueTrend.trim() || null,
      runway: editForm.runway.trim() || null,
      runwayTrend: editForm.runwayTrend.trim() || null,
      burn: editForm.burn.trim() || null,
      burnTrend: editForm.burnTrend.trim() || null,
      growth: editForm.growth.trim() || null,
      growthTrend: editForm.growthTrend.trim() || null,
    });
    setIsEditModalOpen(false);
    toast.success('Startup metrics updated successfully!');
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setIsEditModalOpen(false);
    toast.success('Loaded sample startup metrics');
  };

  const handleResetToNull = () => {
    resetToNewUser();
    setIsEditModalOpen(false);
    toast.info('Metrics reset to new user state (null)');
  };

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Founder';

  return (
    <div className="space-y-6 mb-8">
      {/* Greeting Title & Compact Startup Health Indicator Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              {greeting}, {userName}
            </h1>
            <button
              onClick={openModal}
              className="px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20 transition-all text-xs font-bold flex items-center gap-1.5 border border-[#6C63FF]/20"
              title="Edit Startup Metrics"
            >
              <Pencil size={12} />
              <span>Edit Metrics</span>
            </button>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {metrics.isNewUser
              ? 'Welcome! Click "Edit Metrics" to set your revenue, runway & burn values.'
              : 'Everything looks healthy today.'}
          </p>
        </div>

        {/* Compact Circular Startup Health Indicator */}
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setHealthExpanded(!healthExpanded)}
              className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-[#ECECEC] shadow-sm hover:border-[#6C63FF]/30 transition-all text-left"
            >
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <svg className="w-9 h-9 transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#ECECEC"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke={metrics.isNewUser ? '#94A3B8' : '#16A34A'}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="88"
                    strokeDashoffset={metrics.isNewUser ? '44' : '7'}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#111827]">
                  {metrics.isNewUser ? '--' : '92%'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#111827] flex items-center gap-1">
                  {metrics.isNewUser ? 'New Account' : 'Healthy'}{' '}
                  <ChevronDown
                    size={12}
                    className={`text-[#6B7280] transition-transform ${healthExpanded ? 'rotate-180' : ''}`}
                  />
                </span>
                <span
                  className={`text-[10px] font-medium flex items-center gap-1 ${
                    metrics.isNewUser ? 'text-amber-600' : 'text-[#16A34A]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      metrics.isNewUser ? 'bg-amber-500' : 'bg-[#16A34A] animate-pulse'
                    }`}
                  />
                  {metrics.isNewUser ? 'Setup Required' : 'Optimal'}
                </span>
              </div>
            </button>

            {/* Expandable Health Breakdown Popup */}
            {healthExpanded && (
              <div className="absolute right-0 top-14 z-30 w-60 p-3.5 rounded-2xl bg-white border border-[#ECECEC] shadow-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-[#111827] border-b border-[#ECECEC] pb-1.5">
                  <span>Health Breakdown</span>
                  <span className={metrics.isNewUser ? 'text-amber-600' : 'text-[#16A34A]'}>
                    {metrics.isNewUser ? 'Pending Setup' : '92%'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[#6B7280]">
                  <div className="flex justify-between">
                    <span>Runway Buffer</span>
                    <span className="text-[#111827] font-semibold">
                      {metrics.runway ?? 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Target</span>
                    <span className="text-[#111827] font-semibold">
                      {metrics.revenue ?? 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Burn</span>
                    <span className="text-[#111827] font-semibold font-mono">
                      {metrics.burn ?? 'Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className="text-[#111827] font-semibold">
                      {metrics.growth ?? 'Not Set'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Clean KPI Cards Row (Revenue, Runway, Burn, Growth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div
          onClick={openModal}
          className="group relative p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1 cursor-pointer hover:border-[#6C63FF]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#6B7280]">Revenue</div>
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[#6C63FF] transition-opacity flex items-center gap-0.5">
              <Pencil size={10} /> Edit
            </span>
          </div>
          <div className="text-[38px] sm:text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">
            {metrics.revenue ? (
              metrics.revenue
            ) : (
              <span className="text-[#94A3B8] font-normal text-3xl">Not Set</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                metrics.revenueTrend ? 'text-[#16A34A]' : 'text-[#94A3B8]'
              }`}
            >
              <ArrowUpRight size={12} /> {metrics.revenueTrend ?? 'Set value'}
            </span>
            <svg className="w-14 h-4 text-[#6C63FF]" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 25 C 20 20, 40 10, 60 15 C 80 5, 90 2, 100 0"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Runway */}
        <div
          onClick={openModal}
          className="group relative p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1 cursor-pointer hover:border-[#16A34A]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#6B7280]">Runway</div>
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[#16A34A] transition-opacity flex items-center gap-0.5">
              <Pencil size={10} /> Edit
            </span>
          </div>
          <div className="text-[38px] sm:text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">
            {metrics.runway ? (
              metrics.runway
            ) : (
              <span className="text-[#94A3B8] font-normal text-3xl">Not Set</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                metrics.runwayTrend ? 'text-[#16A34A]' : 'text-[#94A3B8]'
              }`}
            >
              <ArrowUpRight size={12} /> {metrics.runwayTrend ?? 'Set value'}
            </span>
            <svg className="w-14 h-4 text-[#16A34A]" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 28 C 30 25, 50 15, 70 18 C 90 8, 95 5, 100 0"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Burn */}
        <div
          onClick={openModal}
          className="group relative p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1 cursor-pointer hover:border-amber-500/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#6B7280]">Burn</div>
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-amber-600 transition-opacity flex items-center gap-0.5">
              <Pencil size={10} /> Edit
            </span>
          </div>
          <div className="text-[38px] sm:text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">
            {metrics.burn ? (
              metrics.burn
            ) : (
              <span className="text-[#94A3B8] font-normal text-3xl">Not Set</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                metrics.burnTrend ? 'text-amber-600' : 'text-[#94A3B8]'
              }`}
            >
              <TrendingDown size={12} /> {metrics.burnTrend ?? 'Set value'}
            </span>
            <svg className="w-14 h-4 text-amber-500" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 10 C 20 15, 40 25, 60 20 C 80 28, 90 25, 100 30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Growth */}
        <div
          onClick={openModal}
          className="group relative p-4 rounded-[20px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1 cursor-pointer hover:border-blue-500/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#6B7280]">Growth</div>
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 transition-opacity flex items-center gap-0.5">
              <Pencil size={10} /> Edit
            </span>
          </div>
          <div className="text-[38px] sm:text-[40px] font-extrabold text-[#111827] tracking-tight leading-none">
            {metrics.growth ? (
              metrics.growth
            ) : (
              <span className="text-[#94A3B8] font-normal text-3xl">Not Set</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                metrics.growthTrend ? 'text-blue-600' : 'text-[#94A3B8]'
              }`}
            >
              <ArrowUpRight size={12} /> {metrics.growthTrend ?? 'Set value'}
            </span>
            <svg className="w-14 h-4 text-blue-500" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 20 C 25 18, 45 10, 65 12 C 85 4, 95 2, 100 0"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Edit Startup Metrics Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#ECECEC] shadow-2xl p-6 space-y-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">Edit Startup Metrics</h3>
                  <p className="text-xs text-[#6B7280]">
                    Customize your actual financial and growth KPIs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Revenue Value</label>
                  <input
                    type="text"
                    value={editForm.revenue}
                    onChange={(e) => setEditForm({ ...editForm, revenue: e.target.value })}
                    placeholder="e.g. $28,450"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Revenue Trend</label>
                  <input
                    type="text"
                    value={editForm.revenueTrend}
                    onChange={(e) => setEditForm({ ...editForm, revenueTrend: e.target.value })}
                    placeholder="e.g. +18%"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Runway Value</label>
                  <input
                    type="text"
                    value={editForm.runway}
                    onChange={(e) => setEditForm({ ...editForm, runway: e.target.value })}
                    placeholder="e.g. 16 Mo"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Runway Trend</label>
                  <input
                    type="text"
                    value={editForm.runwayTrend}
                    onChange={(e) => setEditForm({ ...editForm, runwayTrend: e.target.value })}
                    placeholder="e.g. +2 mo"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Monthly Burn Value</label>
                  <input
                    type="text"
                    value={editForm.burn}
                    onChange={(e) => setEditForm({ ...editForm, burn: e.target.value })}
                    placeholder="e.g. -$8.1k"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Burn Trend</label>
                  <input
                    type="text"
                    value={editForm.burnTrend}
                    onChange={(e) => setEditForm({ ...editForm, burnTrend: e.target.value })}
                    placeholder="e.g. -12%"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Growth Rate Value</label>
                  <input
                    type="text"
                    value={editForm.growth}
                    onChange={(e) => setEditForm({ ...editForm, growth: e.target.value })}
                    placeholder="e.g. +24%"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#374151]">Growth Trend</label>
                  <input
                    type="text"
                    value={editForm.growthTrend}
                    onChange={(e) => setEditForm({ ...editForm, growthTrend: e.target.value })}
                    placeholder="e.g. +4%"
                    className="w-full px-3 py-2 rounded-xl border border-[#ECECEC] bg-[#F8FAFC] focus:bg-white focus:border-[#6C63FF] focus:outline-none font-medium text-[#111827]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#ECECEC] flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-medium flex items-center gap-1 w-1/2 sm:w-auto justify-center"
                    title="Load sample demo values"
                  >
                    <Sparkles size={13} /> Load Demo
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToNull}
                    className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-medium flex items-center gap-1 w-1/2 sm:w-auto justify-center"
                    title="Clear metrics to new user null state"
                  >
                    <RotateCcw size={13} /> Reset Null
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#ECECEC] text-[#6B7280] hover:text-[#111827] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#6C63FF] text-white hover:bg-[#5b52e0] font-bold shadow-md shadow-[#6C63FF]/20 transition-all flex items-center gap-1.5"
                  >
                    <Check size={14} /> Save Metrics
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
