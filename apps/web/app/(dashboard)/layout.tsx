'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import {
  LayoutGrid,
  DollarSign,
  Users,
  Scale,
  Megaphone,
  Briefcase,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Finance', href: '/dashboard?tab=finance', icon: DollarSign },
    { name: 'Hiring', href: '/dashboard?tab=hiring', icon: Users },
    { name: 'Legal', href: '/dashboard?tab=legal', icon: Scale },
    { name: 'Marketing', href: '/dashboard?tab=marketing', icon: Megaphone },
    { name: 'Investors', href: '/dashboard?tab=investors', icon: Briefcase },
    { name: 'Reports', href: '/dashboard?tab=reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const notifications = [
    { id: 1, title: 'Company Profile Created', time: '10 mins ago', unread: true },
    { id: 2, title: 'Welcome to Catalyst OS!', time: '1 hour ago', unread: true },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-[#FAFAFB] text-slate-900 overflow-hidden font-sans antialiased">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Component */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between transform transition-transform duration-200 ease-in-out shrink-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="flex items-center justify-between px-1">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                  {/* Hexagon & Star Graphic */}
                  <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
                    <polygon
                      points="12 2 22 7.5 22 17.5 12 23 2 17.5 2 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="12 6.5 13.8 10.1 17.8 10.7 14.9 13.5 15.6 17.5 12 15.6 8.4 17.5 9.1 13.5 6.2 10.7 10.2 10.1"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                    Catalyst OS
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 leading-tight">
                    Startup Operating System
                  </span>
                </div>
              </Link>
              <button
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.name === 'Dashboard' && pathname === '/dashboard');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Pro Plan Card Widget */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-3 mt-auto">
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 fill-indigo-600/20" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Pro Plan</div>
                <div className="text-[11px] text-slate-400 leading-tight">12 days free trial</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[30%]" />
              </div>
              <div className="text-[11px] font-semibold text-slate-500">3 / 10 AI Credits used</div>
            </div>

            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="w-full border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold text-xs py-2 rounded-lg transition-colors shadow-2xs text-center"
            >
              Upgrade Plan
            </button>
          </div>
        </aside>

        {/* Main Content Outer Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar Header */}
          <header className="h-16 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 shadow-2xs z-30">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Right Side Header Items */}
            <div className="flex items-center space-x-4">
              {/* Notification Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    2
                  </span>
                </button>

                {/* Notifications Popup Drawer */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-xs text-slate-900">Notifications</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                        2 New
                      </span>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-lg hover:bg-slate-50 text-xs space-y-0.5 cursor-pointer"
                        >
                          <div className="font-semibold text-slate-800">{n.title}</div>
                          <div className="text-[10px] text-slate-400">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
                    S
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-900 leading-tight">
                      Sathvika
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 leading-tight">
                      Founder
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Popup Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Sathvika</p>
                      <p className="text-[11px] text-slate-400">Founder & CEO</p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#FAFAFB]">{children}</main>
        </div>

        {/* Upgrade Plan Modal */}
        {upgradeModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Upgrade to Catalyst Pro
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unlock unlimited AI credits & executive agents
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited AI Credits for CEO Orchestrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated Cash Runway & Financial Modeling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Multi-team Member Collaboration & Approvals</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Thank you for upgrading to Catalyst Pro!');
                    setUpgradeModalOpen(false);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Upgrade Now ($49/mo)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
