import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-surface-lowest border border-border-subtle shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant border border-border-subtle font-mono text-xs text-status-danger">
            <span className="w-1.5 h-1.5 rounded-full bg-status-danger animate-pulse" />
            <span>ERROR 404: ROUTE NOT FOUND</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary font-mono">
            404
          </h1>
          <p className="text-sm text-text-secondary">
            The requested ledger resource or destination route does not exist in this deployment.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-4 py-2 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2"
              type="button"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Public Landing</span>
            </button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <SilverButton variant="primary" size="sm" className="w-full sm:w-auto justify-center">
              <Compass className="h-3.5 w-3.5" />
              <span>Revenue Dashboard</span>
            </SilverButton>
          </Link>
        </div>

        <div className="border-t border-border-subtle pt-4 font-mono text-[10px] text-text-secondary">
          <span>BillNest Revenue Infrastructure • Precision OS</span>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
