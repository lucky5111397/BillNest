import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PortalNavbar } from './PortalNavbar';
import { PortalSubNavigation } from './PortalSubNavigation';
import { PortalFooter } from './PortalFooter';

export const PortalShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col font-sans selection:bg-surface-high selection:text-text-primary">
      {/* Horizontal Navbar (40px) */}
      <PortalNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Explicit Development Preview Disclaimer Banner */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-surface-variant border border-border-subtle text-xs text-text-secondary">
            <ShieldAlert className="h-4 w-4 text-status-cyan shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-text-primary">DEVELOPMENT PREVIEW:</span> Customer
              Portal is running in client layout preview mode. Production authentication, role
              isolation, and secure tenant boundaries will be implemented in the final
              authentication phase.
            </div>
          </div>

          {/* Sub-Navigation Bar */}
          <PortalSubNavigation />

          {/* Child Route Content */}
          <Outlet />
        </div>
      </main>

      {/* Portal Footer */}
      <PortalFooter />
    </div>
  );
};
