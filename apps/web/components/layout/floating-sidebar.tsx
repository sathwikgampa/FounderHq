'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  Database,
  CheckSquare,
  CircleDollarSign,
  Megaphone,
  ShoppingCart,
  FileText,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspace', href: '/workspace', icon: Building2 },
  { name: 'AI Agents', href: '/agents', icon: Cpu },
  { name: 'Memory', href: '/memory', icon: Database },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Finance', href: '/finance', icon: CircleDollarSign },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function FloatingSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'GS';

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-4 top-4 bottom-4 z-40 bg-white border border-[#ECECEC] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col p-4 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-[#6C63FF] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-[#6C63FF]/20">
            FH
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-[#111827] tracking-tight leading-none">
                FounderHQ
              </span>
              <span className="text-[11px] text-[#6B7280] truncate mt-1 flex items-center gap-1">
                Acme Inc. <ChevronsUpDown size={10} />
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl bg-[#FAFAFB] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] transition-colors border border-[#ECECEC] shrink-0"
          aria-label="Toggle collapse"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 my-3 space-y-1 overflow-y-auto custom-scrollbar pr-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#6C63FF]/10 text-[#6C63FF] font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFB]'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#6C63FF]' : 'text-[#6B7280] group-hover:text-[#111827]'
                }`}
              />
              {!collapsed && <span className="tracking-tight">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Pro Plan Card */}
      {!collapsed && (
        <div className="p-3.5 my-2 rounded-2xl bg-[#FAFAFB] border border-[#ECECEC] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#111827]">Pro Plan</span>
            <span className="text-[10px] text-[#6B7280]">14 trial days left</span>
          </div>
          <div className="w-full bg-[#ECECEC] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#6C63FF] h-full w-[65%]" />
          </div>
          <button
            onClick={() => toast.info('Upgrade to FounderHQ Pro Plan')}
            className="w-full py-1.5 text-center text-xs font-semibold text-[#6C63FF] bg-[#6C63FF]/10 hover:bg-[#6C63FF]/20 border border-[#6C63FF]/20 rounded-xl transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* User Profile Section */}
      <div className="pt-3 border-t border-[#ECECEC] mt-auto">
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl bg-[#FAFAFB] border border-[#ECECEC] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[#6C63FF] font-bold text-xs flex items-center justify-center shrink-0">
            {userInitials}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#111827] truncate">
                {user?.displayName || 'Gilakethi Siddhartha'}
              </p>
              <p className="text-[10px] text-[#6B7280] truncate">
                {user?.email || 'gilasidh@gmail.com'}
              </p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="p-1.5 text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
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
