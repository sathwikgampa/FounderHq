'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Save, CheckCircle2, Building2, Sliders, Bell } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useWorkspaceSettings } from '@/hooks/use-workspace-settings';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const { settings, isLoaded, updateSettings } = useWorkspaceSettings(
    user?.email || undefined,
    user?.displayName || undefined,
  );

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    if (isLoaded) {
      setFormData(settings);
    }
  }, [isLoaded, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    toast.success('Workspace settings updated successfully!', { icon: '⚙️' });
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-[#ECECEC] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-semibold mb-2">
            <Settings size={14} />
            System Configuration
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Manage your real startup workspace configuration, founder profile, and executive AI
            operating mode.
          </p>
        </div>

        {user && (
          <div className="hidden sm:flex items-center gap-3 bg-white border border-[#ECECEC] px-3.5 py-2 rounded-2xl shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#6C63FF]/15 text-[#6C63FF] font-bold text-xs flex items-center justify-center">
              {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'GS'}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-[#0F172A]">
                {user.displayName || 'Authenticated User'}
              </div>
              <div className="text-[10px] text-[#475569]">{user.email || 'Google Auth Linked'}</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Founder Profile Settings */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3 border-b border-[#ECECEC] pb-3">
            <div className="p-2.5 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Founder Identity</h2>
              <p className="text-xs text-[#475569]">
                Personal details linked to your FounderHQ account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Full Name</label>
              <input
                type="text"
                value={formData.founderName}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                placeholder="e.g. Sathwik Gampa"
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Executive Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Founder & CEO"
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#0F172A]">Work Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. founder@company.com"
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Company & Startup Configuration */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3 border-b border-[#ECECEC] pb-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Startup Entity & Domain</h2>
              <p className="text-xs text-[#475569]">Company name, stage, and primary sector</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Startup / Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme AI Technologies"
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Industry Sector</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              >
                <option value="SaaS & Artificial Intelligence">
                  SaaS & Artificial Intelligence
                </option>
                <option value="EdTech & Education">EdTech & Education</option>
                <option value="FinTech & Crypto">FinTech & Crypto</option>
                <option value="E-Commerce & Marketplace">E-Commerce & Marketplace</option>
                <option value="HealthTech & Bio">HealthTech & Bio</option>
                <option value="Real Estate & PropTech">Real Estate & PropTech</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Current Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              >
                <option value="0-to-1 Incubator / MVP">0-to-1 Incubator / MVP</option>
                <option value="Pre-Seed / Ideation">Pre-Seed / Ideation</option>
                <option value="Seed / Initial Traction">Seed / Initial Traction</option>
                <option value="Series A / Scale">Series A / Scale</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A]">Primary Target Goal</label>
              <input
                type="text"
                value={formData.metricGoal}
                onChange={(e) => setFormData({ ...formData, metricGoal: e.target.value })}
                placeholder="e.g. Launch 30-Day MVP & Extend Runway"
                className="w-full border border-[#ECECEC] rounded-xl px-3.5 py-2.5 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Executive AI Operating Mode */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3 border-b border-[#ECECEC] pb-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-[#6C63FF]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">AI Executive Governance Mode</h2>
              <p className="text-xs text-[#475569]">
                Determine human-in-the-loop approval thresholds for AI execution
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                mode: 'Autonomous',
                title: 'Autonomous Execution',
                desc: 'Agents auto-execute product & GTM tasks without waiting for approval.',
              },
              {
                mode: 'Semi-Autonomous',
                title: 'Semi-Autonomous (Default)',
                desc: 'Auto-executes safe tasks, flags equity & offers >$100k for approval.',
              },
              {
                mode: 'Strict Approval',
                title: 'Strict Approval Mode',
                desc: 'Every single agent tool output requires manual founder review.',
              },
            ].map((item) => (
              <div
                key={item.mode}
                onClick={() =>
                  setFormData({
                    ...formData,
                    operatingMode: item.mode as
                      'Autonomous' | 'Semi-Autonomous' | 'Strict Approval',
                  })
                }
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.operatingMode === item.mode
                    ? 'border-[#6C63FF] bg-[#6C63FF]/5 ring-1 ring-[#6C63FF]'
                    : 'border-[#ECECEC] bg-white hover:border-[#6C63FF]/40'
                }`}
              >
                <div className="font-bold text-[#0F172A] flex items-center justify-between">
                  <span>{item.title}</span>
                  <input
                    type="radio"
                    name="operatingMode"
                    checked={formData.operatingMode === item.mode}
                    onChange={() => {}}
                    className="accent-[#6C63FF]"
                  />
                </div>
                <p className="text-[11px] text-[#475569] mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
            <input
              type="checkbox"
              checked={formData.notificationsEnabled}
              onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-[#6C63FF] focus:ring-[#6C63FF] accent-[#6C63FF]"
            />
            <Bell size={14} className="text-[#6C63FF]" />
            <span>Enable real-time executive agent alert notifications</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {saved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings saved to live state!</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#5b52e0] text-white font-bold text-xs px-7 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
