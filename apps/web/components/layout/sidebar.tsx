'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  BarChart3,
  Settings,
  CircleDollarSign,
  Users,
  Scale,
  Briefcase,
  User,
  ChevronRight,
} from 'lucide-react';

const mainNavItems = [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }];

const agentSubItems = [
  { name: 'Finance', href: '/finance', icon: CircleDollarSign },
  { name: 'Hiring', href: '/hiring', icon: Users },
  { name: 'Legal', href: '/legal', icon: Scale },
  { name: 'Investors', href: '/investors', icon: Briefcase },
];

const secondaryNavItems = [
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [agentsExpanded, setAgentsExpanded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NavItem = ({ item, isSub = false }: { item: any; isSub?: boolean }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isSub ? 'ml-6 text-sm' : ''
          } ${isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
      >
        <Icon
          size={isSub ? 16 : 18}
          className={
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground w-5'
          }
        />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r bg-card shrink-0 fixed left-0 top-0">
      <div className="flex items-center h-16 px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">FounderHQ</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}

        <div className="mb-1">
          <div className={`w-full flex items-center justify-between rounded-xl transition-all duration-200 group ${pathname.startsWith('/agents') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Link
              href="/agents"
              className="flex-1 flex items-center gap-3 px-3 py-2.5"
            >
              <Bot
                size={18}
                className={`transition-colors ${pathname.startsWith('/agents') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
              />
              <span>Agents</span>
            </Link>
            <button
              onClick={() => setAgentsExpanded(!agentsExpanded)}
              className="p-3 rounded-r-xl hover:bg-background/50 transition-colors"
            >
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${agentsExpanded || pathname.startsWith('/agents') ? 'rotate-90' : ''} ${pathname.startsWith('/agents') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
              />
            </button>
          </div>

          {(agentsExpanded || pathname.startsWith('/agents')) && (
            <div className="mt-1 space-y-1">
              {agentSubItems.map((item) => (
                <NavItem key={item.name} item={item} isSub />
              ))}
            </div>
          )}
        </div>

        {secondaryNavItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="mb-4 p-4 rounded-xl border bg-card">
          <h4 className="text-sm font-semibold text-foreground mb-1">Pro Plan</h4>
          <p className="text-xs text-muted-foreground mb-3">14 trial days remaining</p>
          <div className="w-full h-1.5 bg-muted rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-primary w-2/3" />
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">AI credits used</p>
          <button onClick={() => { console.log('Upgrade clicked'); alert('Plan upgrade flow coming soon!'); }} className="w-full py-1.5 px-3 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
            Upgrade Plan
          </button>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border group-hover:border-primary/50 transition-colors">
            <User
              size={16}
              className="text-muted-foreground group-hover:text-primary transition-colors"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Sarah Founder</p>
            <p className="text-xs text-muted-foreground truncate">CEO, Acme Inc</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
