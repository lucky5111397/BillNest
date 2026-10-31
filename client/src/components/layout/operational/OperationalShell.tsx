import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { OperationalTopbar } from './OperationalTopbar';
import { OperationalSidebar } from './OperationalSidebar';

export const OperationalShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col font-sans selection:bg-surface-high selection:text-text-primary">
      {/* Pinned Operational Topbar (40px) */}
      <OperationalTopbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        {/* Persistent Operational Sidebar (240px) */}
        <OperationalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Scrollable Main Ledger Canvas with 240px (w-60) desktop offset */}
        <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
          <main className="flex-1 w-full pt-10 px-4 sm:px-6 lg:px-8 py-6 bg-canvas-base overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
