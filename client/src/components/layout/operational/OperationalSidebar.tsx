import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Repeat,
  Receipt,
  Landmark,
  Package,
  Percent,
  Users,
  BarChart3,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { WorkspaceIndicator } from '@/components/common/WorkspaceIndicator';
import { NavigationItem } from './NavigationItem';
import { cn } from '@/lib/utils';

export interface OperationalSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const OperationalSidebar: React.FC<OperationalSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed left-0 top-10 bottom-0 w-60 z-40 bg-surface-lowest border-r border-border-subtle flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Operational Navigation"
      >
        <div className="p-3 flex flex-col gap-4">
          {/* Workspace Switcher */}
          <WorkspaceIndicator />

          {/* Revenue Core Nav Section */}
          <div className="flex flex-col gap-1">
            <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
              REVENUE CORE
            </span>
            <nav className="flex flex-col gap-0.5">
              <NavigationItem
                title="Finance Overview"
                href="/dashboard"
                icon={LayoutDashboard}
                exact
                onClick={onClose}
              />
              <NavigationItem
                title="Subscriptions & Quotes"
                href="/dashboard/subscriptions-and-quotes"
                icon={Repeat}
                onClick={onClose}
              />
              <NavigationItem
                title="Billing & Invoices"
                href="/dashboard/billing-and-invoices"
                icon={Receipt}
                onClick={onClose}
              />
              <NavigationItem
                title="Payments & Bank Matcher"
                href="/dashboard/payments-and-bank-matcher"
                icon={Landmark}
                onClick={onClose}
              />
            </nav>
          </div>

          {/* Administration Nav Section */}
          <div className="flex flex-col gap-1">
            <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
              ADMINISTRATION
            </span>
            <nav className="flex flex-col gap-0.5">
              <NavigationItem
                title="Products & Plans"
                href="/dashboard/products-and-plans"
                icon={Package}
                onClick={onClose}
              />
              <NavigationItem
                title="Taxes & Discounts"
                href="/dashboard/taxes-and-discounts"
                icon={Percent}
                onClick={onClose}
              />
              <NavigationItem
                title="Staff & Roles"
                href="/dashboard/staff-and-roles"
                icon={Users}
                onClick={onClose}
              />
              <NavigationItem
                title="Reports & Analytics"
                href="/dashboard/reports"
                icon={BarChart3}
                onClick={onClose}
              />
            </nav>
          </div>

          {/* Customer Portal Shortcut */}
          <div className="flex flex-col gap-1 pt-1 border-t border-border-subtle">
            <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
              SELF-SERVICE
            </span>
            <NavLink
              to="/portal/overview"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-1.5 rounded text-xs font-sans text-status-cyan hover:bg-surface-variant transition-colors group"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span>Customer Portal</span>
              </div>
              <span className="px-1 rounded bg-surface-variant text-[9px] font-mono text-status-cyan">
                DEMO
              </span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border-subtle bg-surface-lowest flex flex-col gap-2">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 px-2 py-1 rounded text-xs font-sans text-text-secondary hover:text-text-primary hover:bg-surface-variant transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Back to Landing Page</span>
          </NavLink>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-surface-variant/40 border border-border-subtle text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span className="text-[10px] uppercase text-text-secondary">SYNC IDLE</span>
            </div>
            <span className="text-[10px] text-text-secondary">v0.1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
