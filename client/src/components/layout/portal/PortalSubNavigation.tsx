import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Receipt,
  HelpCircle,
  ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PortalSubNavigationProps {
  tenantName?: string;
  quoteCount?: number;
}

export const PortalSubNavigation: React.FC<PortalSubNavigationProps> = ({
  tenantName = 'Acme Logistics Ltd.',
  quoteCount = 1,
}) => {
  const tabs = [
    { label: 'Overview', href: '/portal/overview', icon: LayoutDashboard },
    { label: 'My Subscription', href: '/portal/subscriptions', icon: CreditCard },
    { label: 'Quotations', href: '/portal/quotations', icon: FileText, badge: quoteCount },
    { label: 'Invoices', href: '/portal/invoices', icon: Receipt },
    { label: 'Help & Support', href: '/portal/support', icon: HelpCircle },
  ];

  return (
    <div className="w-full bg-surface-lowest rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-3 shadow-panel border border-border-subtle">
      {/* Tab Pills */}
      <nav className="flex items-center gap-1 overflow-x-auto py-0.5" aria-label="Portal tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) =>
                cn(
                  'px-3.5 py-1.5 rounded-lg font-mono text-[11px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-all select-none shrink-0',
                  isActive
                    ? 'bg-metallic-light text-canvas-base shadow-sm font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant',
                )
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-surface-bright text-text-primary rounded font-mono text-[10px]">
                  {tab.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Tenant Context Selector */}
      <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface-variant border border-border-subtle shrink-0">
        <div className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
        <div className="flex flex-col">
          <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest leading-none">
            ACTIVE TENANT
          </span>
          <span className="font-sans text-xs text-text-primary font-semibold leading-tight mt-0.5">
            {tenantName}
          </span>
        </div>
        <ArrowLeftRight className="h-3.5 w-3.5 text-text-secondary ml-1" />
      </div>
    </div>
  );
};
