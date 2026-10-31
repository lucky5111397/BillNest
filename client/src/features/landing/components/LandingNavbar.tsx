import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090D]/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none rounded-lg p-1 shrink-0"
          aria-label="BillNest Home"
        >
          {/* Logo Icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#8B7CFF] to-[#6355E6] flex items-center justify-center text-white shadow-lg shadow-[#8B7CFF]/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#F5F5F7] group-hover:text-white transition-colors">
              BillNest
            </span>
            <span className="hidden xs:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#8B7CFF]/10 text-[#8B7CFF] border border-[#8B7CFF]/20 uppercase tracking-wider font-semibold">
              Workspace
            </span>
          </div>
        </Link>

        {/* Right: Minimal Navigation */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <a
            href="#showcase"
            className="text-xs sm:text-sm font-medium text-[#999EAB] hover:text-[#F5F5F7] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none rounded px-2 py-1 hidden sm:inline-block"
          >
            Subscriptions
          </a>

          <Link
            to="/dashboard"
            className="text-xs sm:text-sm font-medium text-[#999EAB] hover:text-[#F5F5F7] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none rounded px-2 py-1 hidden md:inline-block"
          >
            Dashboard
          </Link>

          {/* Functional CTA */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#191D29] hover:bg-[#8B7CFF] text-[#F5F5F7] hover:text-white border border-white/10 hover:border-[#8B7CFF] transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none active:scale-95"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 hidden xs:inline-block" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
