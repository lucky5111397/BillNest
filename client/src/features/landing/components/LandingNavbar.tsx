import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, LogIn } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 lg:px-8 pointer-events-none transition-all">
      {/* Floating Glass Pill Navbar */}
      <div className="pointer-events-auto w-full max-w-5xl h-14 sm:h-16 px-4 sm:px-6 md:px-8 rounded-full bg-black/60 sm:bg-black/70 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.14)] ring-1 ring-white/[0.05] flex items-center justify-between gap-4">

        {/* Left: Brand Identity */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded-full p-1 shrink-0"
          aria-label="Billit Home"
        >
          {/* Geometric Bird Logo */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex items-center justify-center bg-[#0D0F17] border border-white/10 shadow-md shadow-black/40 group-hover:scale-105 group-hover:border-white/20 transition-all shrink-0">
            <img
              src="/logo.jpg"
              alt="Billit logo"
              className="w-full h-full object-cover object-center"
              draggable="false"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#F5F5F7] group-hover:text-white transition-colors">
              Billit
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider font-semibold">
              Workspace
            </span>
          </div>
        </Link>

        {/* Center: Simple nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Pricing
          </Link>
          <Link
            to="/faq"
            className="px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            FAQ
          </Link>
        </nav>

        {/* Right: Login / Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login / Signup</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full md:hidden text-zinc-400 hover:text-white hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto w-full max-w-5xl mt-2 p-4 rounded-2xl border border-white/[0.14] bg-black/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-1">
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
          >
            <span>Pricing</span>
            <span className="text-[11px] font-mono text-emerald-400">Save 20%</span>
          </Link>

          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
          >
            <span>FAQ</span>
            <span className="text-[11px] font-mono text-orange-400">Knowledge Base</span>
          </Link>

          <div className="pt-2 border-t border-white/[0.08]">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Signup</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
