import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  Repeat,
  Receipt,
  CreditCard,
  Percent,
  BarChart3,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  phase?: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Customers', href: '/customers', icon: Users, phase: 'P2' },
  { title: 'Products & Variants', href: '/products', icon: Package, phase: 'P2' },
  { title: 'Plans & Pricing', href: '/plans', icon: Layers, phase: 'P2' },
  { title: 'Quotations', href: '/quotations', icon: FileText, phase: 'P3' },
  { title: 'Subscriptions', href: '/subscriptions', icon: Repeat, phase: 'P3' },
  { title: 'Invoices', href: '/invoices', icon: Receipt, phase: 'P3' },
  { title: 'Payments & Ledger', href: '/payments', icon: CreditCard, phase: 'P3' },
  { title: 'Taxes & Discounts', href: '/discounts', icon: Percent, phase: 'P2' },
  { title: 'Reports & Analytics', href: '/reports', icon: BarChart3, phase: 'P4' },
  { title: 'Settings & Team', href: '/settings', icon: Settings, phase: 'P1' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border space-x-3">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
          BL
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-foreground">Brightloop</span>
          <span className="block text-xs text-muted-foreground font-medium">Subscription OS</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </div>
              {item.phase && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {item.phase}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-foreground">Phase 0 Foundation</span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            v0.1.0
          </Badge>
        </div>
      </div>
    </aside>
  );
}
