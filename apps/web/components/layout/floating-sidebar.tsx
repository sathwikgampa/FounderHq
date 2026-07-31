'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Bot,
  Brain,
  CheckSquare,
  CircleDollarSign,
  Megaphone,
  TrendingUp,
  Scale,
  FileText,
  Plug,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspace', href: '/workspace', icon: Building2 },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Memory', href: '/memory', icon: Brain },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Finance', href: '/finance', icon: CircleDollarSign },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Legal', href: '/legal', icon: Scale },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Integrations', href: '/integrations', icon: Plug },
  { name: 'Analytics', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function FloatingSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-6 top-6 bottom-6 z-40 hidden lg:flex flex-col bg-[#0E1014]/90 backdrop-blur-2xl border border-white/[0.06] rounded-[28px] shadow-2xl transition-all duration-300 ${
        collapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* Brand & Workspace Switcher */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 group px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-indigo-500 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-[#7C5CFF]/20 group-hover:scale-105 transition-transform">
            <Image src="/logo.svg" alt="FounderHQ" width={20} height={20} className="object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white tracking-tight leading-none flex items-center gap-1.5">
                FounderHQ
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/30">
                  v1.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate mt-1 flex items-center gap-1">
                Acme Inc. <ChevronsUpDown size={10} className="text-slate-500" />
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* AI Quick Launcher Button */}
      {!collapsed ? (
        <button
          onClick={() => router.push('/dashboard#copilot')}
          className="mt-4 mb-2 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-[#7C5CFF]/25 hover:opacity-95 transition-all group"
        >
          <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
          <span>Launch AI Copilot</span>
        </button>
      ) : (
        <button
          onClick={() => router.push('/dashboard#copilot')}
          className="mt-4 mb-2 mx-auto w-10 h-10 rounded-2xl bg-[#7C5CFF] text-white flex items-center justify-center shadow-lg shadow-[#7C5CFF]/25"
          title="Launch AI Copilot"
        >
          <Sparkles size={16} />
        </button>
      )}

      {/* Navigation List */}
      <nav className="flex-1 my-2 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.name : undefined}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-[#7C5CFF]/15 border border-[#7C5CFF]/40 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#7C5CFF]' : 'text-slate-400 group-hover:text-white'
                }`}
              />

              {!collapsed && <span className="text-xs tracking-tight">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout Section */}
      <div className="pt-3 border-t border-white/[0.06] mt-auto">
        <div className={`flex items-center gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.displayName ? user.displayName.charAt(0) : <User size={14} />}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.displayName || 'Siddharth'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'founder@acme.com'}
              </p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
