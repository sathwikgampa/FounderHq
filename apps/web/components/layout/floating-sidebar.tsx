'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Building2,
  Bot,
  Layers,
  Brain,
  Scale,
  TrendingUp,
  Users,
  Handshake,
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
  {
    name: 'AI Agents',
    href: '/agents',
    icon: Bot,
    subItems: [
      { name: 'CEO', href: '/agents/ceo', icon: Bot },
      { name: 'Product', href: '/agents/product', icon: Layers },
      { name: 'Growth', href: '/agents/growth', icon: TrendingUp },
      { name: 'Finance', href: '/agents/finance', icon: CircleDollarSign },
      { name: 'Legal', href: '/agents/legal', icon: Scale },
      { name: 'Sales', href: '/agents/sales', icon: Handshake },
      { name: 'HR', href: '/agents/hr', icon: Users },
    ],
  },
  { name: 'Memory', href: '/memory', icon: Brain },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Finance', href: '/finance', icon: CircleDollarSign },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const AgentNavGroup = ({ item, collapsed, pathname }: any) => {
  const isActive = pathname.startsWith(item.href);
  const [expanded, setExpanded] = useState(isActive);

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl transition-all group ${
          isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
        title={collapsed ? item.name : undefined}
      >
        {isActive && (
          <motion.div
            layoutId="activePill"
            className="absolute inset-0 bg-[#7C5CFF]/15 border border-[#7C5CFF]/40 rounded-2xl -z-10"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <div className="flex items-center gap-3">
          <item.icon
            size={18}
            className={`shrink-0 transition-transform group-hover:scale-110 ${
              isActive ? 'text-[#7C5CFF]' : 'text-slate-400 group-hover:text-white'
            }`}
          />
          {!collapsed && <span className="text-xs tracking-tight">{item.name}</span>}
        </div>
        {!collapsed && (
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      {expanded && !collapsed && (
        <div className="mt-1 space-y-1">
          {item.subItems.map((sub: any) => {
            const isSubActive = pathname === sub.href;
            return (
              <Link
                key={sub.name}
                href={sub.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group ml-6 text-sm ${
                  isSubActive
                    ? 'text-white font-semibold bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <sub.icon
                  size={16}
                  className={
                    isSubActive ? 'text-[#7C5CFF]' : 'text-slate-400 group-hover:text-white'
                  }
                />
                <span className="text-[11px] tracking-tight">{sub.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
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
<<<<<<< HEAD
      className={`fixed left-4 top-4 bottom-4 z-40 bg-white border border-[#ECECEC] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col p-4 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
=======
      className={`fixed left-6 top-6 bottom-6 z-40 hidden lg:flex flex-col bg-[#0E1014]/90 backdrop-blur-2xl border border-white/[0.06] rounded-[28px] shadow-2xl transition-all duration-300 ${
        collapsed ? 'w-20 p-3' : 'w-64 p-4'
>>>>>>> c76691c (feat(agents): add Agent Metadata & Info Screen API and frontend UI linkage)
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
<<<<<<< HEAD
      <nav className="flex-1 my-3 space-y-1 overflow-y-auto custom-scrollbar pr-0.5">
        {NAV_ITEMS.map((item) => {
=======
      <nav className="flex-1 my-2 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {NAV_ITEMS.map((item: any) => {
          if (item.subItems) {
            return (
              <AgentNavGroup
                key={item.name}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
              />
            );
          }

          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#7C5CFF]' : 'text-slate-400 group-hover:text-white'
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
<<<<<<< HEAD
          <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[#6C63FF] font-bold text-xs flex items-center justify-center shrink-0">
            {userInitials}
=======
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.displayName
              ? user.displayName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'GS'}
>>>>>>> c76691c (feat(agents): add Agent Metadata & Info Screen API and frontend UI linkage)
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
