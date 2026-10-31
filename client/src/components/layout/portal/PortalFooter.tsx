import React from 'react';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-lowest border-t border-border-subtle py-4 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-secondary">
        <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
          <span>© 2026 BillNest OS Inc. Ledger Infrastructure</span>
          <span className="text-border-subtle hidden sm:inline">|</span>
          <span className="text-status-cyan font-semibold">TLS 1.3 256-BIT ENCRYPTION</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#security" className="hover:text-text-primary transition-colors">
            Security Policy
          </a>
          <a href="#terms" className="hover:text-text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#status" className="hover:text-text-primary transition-colors">
            Status Page
          </a>
        </div>
      </div>
    </footer>
  );
};
