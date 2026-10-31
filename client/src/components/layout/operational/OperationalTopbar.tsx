import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Inbox, User, Sparkles, LogOut, LogIn } from 'lucide-react';
import { SystemStatusIndicator } from '@/components/common/SystemStatusIndicator';
import { useAuth } from '@/features/auth/AuthContext';

export interface OperationalTopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const OperationalTopbar: React.FC<OperationalTopbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-10 bg-surface-lowest/95 backdrop-blur-xl border-b border-border-subtle flex items-center justify-between px-3 sm:px-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
      {/* Left: Hamburger + Brand + Environment */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1 rounded bg-surface-variant hover:bg-surface-bright text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-border-specular"
            aria-label={isSidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-b from-text-primary via-metallic-mid to-metallic-dark flex items-center justify-center shadow-[0_0_8px_rgba(226,232,240,0.25)] shrink-0">
            <Sparkles className="w-3 h-3 text-canvas-base font-bold" />
          </div>
          <span className="font-sans text-xs uppercase tracking-wider text-text-primary font-bold whitespace-nowrap">
            BILLNEST
            <span className="text-text-secondary font-normal ml-1 text-[10px] font-mono">OS</span>
          </span>
        </div>

        <div className="hidden sm:block h-3.5 w-px bg-border-subtle" />

        {/* Real Dynamic Telemetry Indicators */}
        <div className="hidden md:flex items-center gap-2">
          <SystemStatusIndicator />
        </div>
      </div>

      {/* Right: Outbox + Profile */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-variant border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-specular transition-colors"
          title="Outbox dispatch status"
        >
          <Inbox className="h-3.5 w-3.5 text-text-secondary" />
          <span className="font-mono text-[10px] hidden sm:inline uppercase">OUTBOX</span>
          <span className="px-1 rounded bg-surface-high text-text-primary font-mono text-[10px] leading-none py-0.5">
            0
          </span>
        </button>

        <div className="h-3.5 w-px bg-border-subtle" />

        {/* User Identity / Authentication State */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <div className="font-sans text-xs leading-tight text-text-primary font-semibold">
                  {user.name}
                </div>
                <div className="font-mono text-[9px] text-text-secondary uppercase tracking-wider">
                  {user.role}
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-variant border border-border-specular flex items-center justify-center text-text-primary shadow-inner">
                <User className="h-3.5 w-3.5" />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-lowest border border-border-subtle rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-border-subtle text-xs">
                  <p className="font-semibold text-text-primary truncate">{user.name}</p>
                  <p className="text-[10px] text-text-secondary font-mono truncate">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-status-danger hover:bg-surface-variant flex items-center gap-2 transition-colors font-mono"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth/login"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-xs font-mono text-text-primary hover:border-border-specular transition-colors"
          >
            <LogIn className="h-3.5 w-3.5 text-status-cyan" />
            <span>SIGN IN</span>
          </Link>
        )}
      </div>
    </header>
  );
};
