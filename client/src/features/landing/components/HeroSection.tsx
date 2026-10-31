import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, LayoutDashboard, Sparkles } from 'lucide-react';
import { SubscriptionCarousel } from './SubscriptionCarousel';

export const HeroSection: React.FC = () => {
  const scrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('showcase');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-x-hidden pt-8 sm:pt-12 md:pt-14 pb-12 flex flex-col items-center text-center">
      {/* Top Accent Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[320px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,124,255,0.15),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative subtle grid background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Subtle Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131620] border border-white/[0.08] text-xs font-medium text-[#8B7CFF] shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
          <span>Unified Subscription Management Platform</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F7] leading-[1.08] max-w-4xl mx-auto">
          Your Subscriptions.{' '}
          <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B7CFF] to-[#B3A8FF]">
            One Powerful Workspace.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-[#999EAB] max-w-2xl mx-auto leading-relaxed font-normal">
          Manage plans, customers, recurring invoices and payments — all in one place. Simplify your
          subscription business with BillNest.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#showcase"
            onClick={scrollToExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#8B7CFF] hover:bg-[#7867F5] text-white shadow-[0_0_25px_rgba(139,124,255,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none"
          >
            <span>Explore BillNest</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm bg-[#131620] hover:bg-[#191D29] text-[#F5F5F7] border border-white/[0.08] hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none"
          >
            <LayoutDashboard className="w-4 h-4 text-[#999EAB]" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>

      {/* 3D Showcase Container - Generously Spaced */}
      <div className="relative w-full mt-8 sm:mt-12">
        <SubscriptionCarousel />
      </div>
    </section>
  );
};
