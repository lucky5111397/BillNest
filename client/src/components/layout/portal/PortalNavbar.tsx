import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, ChevronDown, User, Menu, X, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

export interface PortalNavbarProps {
  clientName?: string;
  userName?: string;
  userRole?: string;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  clientName = 'Acme Logistics Ltd.',
  userName = 'Marcus Vance',
  userRole = 'Billing Admin',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Portal Overview', href: '/portal/overview' },
    { label: 'Invoices & Receipts', href: '/portal/invoices' },
    { label: 'Quotations', href: '/portal/quotations' },
    { label: 'Subscriptions', href: '/portal/subscriptions' },
    { label: 'Support & Tickets', href: '/portal/support' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-10 bg-surface-lowest/95 backdrop-blur-xl border-b border-border-subtle">
      <div className="w-full px-4 sm:px-6 h-10 flex items-center justify-between">
        {/* Left: Brand + Customer Portal Badge + Client Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1 rounded bg-surface-variant text-text-secondary hover:text-text-primary focus:outline-none"
            aria-label="Toggle Portal Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-b from-text-primary via-metallic-mid to-metallic-dark flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(226,232,240,0.25)]">
              <Sparkles className="w-3 h-3 text-canvas-base" />
            </div>
            <span className="font-sans text-xs uppercase tracking-wider text-text-primary font-bold">
              BILLNEST
            </span>
            <StatusBadge variant="cyan" className="text-[9px]">
              CUSTOMER PORTAL
            </StatusBadge>
          </div>

          <div className="h-3.5 w-px bg-border-subtle hidden md:block" />

          {/* Client Selector Dropdown trigger */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-variant border border-border-subtle text-xs font-sans text-text-primary cursor-pointer hover:border-border-specular transition-colors">
            <span className="font-mono text-[9px] text-text-secondary uppercase">CLIENT:</span>
            <span className="font-semibold">{clientName}</span>
            <ChevronDown className="h-3 w-3 text-text-secondary" />
          </div>
        </div>

        {/* Center: Desktop Top Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-6 h-full text-xs font-sans"
          aria-label="Customer Portal Navigation"
        >
          {navLinks.slice(0, 4).map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'h-full flex items-center transition-colors border-b-2 font-medium',
                  isActive
                    ? 'text-text-primary border-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary border-transparent',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Switch to Admin / Landing + User Profile */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-status-cyan hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Admin Console</span>
          </NavLink>

          <div className="h-3.5 w-px bg-border-subtle hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="font-sans text-xs leading-tight text-text-primary font-semibold">
                {userName}
              </div>
              <div className="font-mono text-[9px] text-text-secondary uppercase tracking-wider">
                {userRole}
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-variant border border-border-specular flex items-center justify-center text-text-primary shadow-inner">
              <User className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-10 left-0 right-0 bg-surface-lowest border-b border-border-subtle p-4 shadow-2xl flex flex-col gap-2 z-50">
          <div className="px-2 py-1 text-xs font-mono text-text-secondary uppercase">
            CLIENT: <strong className="text-text-primary">{clientName}</strong>
          </div>
          <div className="h-px bg-border-subtle my-1" />
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded text-xs transition-colors',
                  isActive
                    ? 'bg-surface-variant text-text-primary font-semibold border-l-2 border-primary'
                    : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="h-px bg-border-subtle my-1" />
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-xs font-mono text-status-cyan hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Admin Console</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
