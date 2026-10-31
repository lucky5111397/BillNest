import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, LayoutDashboard, ShieldCheck, Zap, Layers } from 'lucide-react';
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
    <section className="relative w-full overflow-hidden pt-28 sm:pt-32 md:pt-36 pb-12 flex flex-col items-center text-center">
      {/* 1. Left Fluted Orange Aurora Curtain */}
      <div
        className="absolute top-0 -left-6 sm:left-0 w-[220px] sm:w-[320px] md:w-[420px] lg:w-[480px] h-[700px] sm:h-[850px] pointer-events-none z-0 overflow-hidden opacity-90 select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(240,83,35,0.65),rgba(234,88,12,0.3)_45%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,rgba(240,83,35,0.8)_0px,rgba(240,83,35,0.8)_16px,transparent_16px,transparent_36px)] opacity-70 mix-blend-screen blur-[5px] [mask-image:linear-gradient(to_right,black_25%,transparent_85%)]" />
      </div>

      {/* 2. Right Fluted Orange Aurora Curtain */}
      <div
        className="absolute top-0 -right-6 sm:right-0 w-[220px] sm:w-[320px] md:w-[420px] lg:w-[480px] h-[700px] sm:h-[850px] pointer-events-none z-0 overflow-hidden opacity-90 select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(240,83,35,0.65),rgba(234,88,12,0.3)_45%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_left,rgba(240,83,35,0.8)_0px,rgba(240,83,35,0.8)_16px,transparent_16px,transparent_36px)] opacity-70 mix-blend-screen blur-[5px] [mask-image:linear-gradient(to_left,black_25%,transparent_85%)]" />
      </div>

      {/* 3. Subtle grid background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_15%,#000_70%,transparent_100%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-300 shadow-sm backdrop-blur-md hover:border-orange-500/40 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F05323] shadow-[0_0_8px_#F05323] animate-pulse" />
          <span>Unified Subscription Management Platform</span>
          <span className="hidden sm:inline-block text-white/20">•</span>
          <span className="hidden sm:inline-block text-zinc-400 font-mono text-[11px]">
            Sub-2s Query Engine
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.06] max-w-5xl mx-auto">
          <span className="block text-[#F05323] drop-shadow-[0_0_35px_rgba(240,83,35,0.45)]">
            Your Subscriptions.
          </span>
          <span className="block font-serif italic font-normal text-white text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] tracking-normal mt-2 sm:mt-3 drop-shadow-lg">
            One Powerful Workspace.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Manage plans, customers, recurring invoices and payments — all in one place. Simplify your
          subscription business with Billit.
        </p>

        {/* Action Buttons: Solid White Pill & Dark Glass Pill */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#showcase"
            onClick={scrollToExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm bg-white hover:bg-zinc-200 text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          >
            <span>Explore Billit</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-medium text-sm bg-black/50 hover:bg-white/[0.08] text-white border border-white/15 hover:border-orange-500/50 transition-all focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none shadow-sm backdrop-blur-md"
          >
            <LayoutDashboard className="w-4 h-4 text-[#F05323]" />
            <span>Open Dashboard</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-zinc-400/80">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#F05323]" />
            <span>Sub-2s Query Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ACID Transactional Guarantees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FFA940]" />
            <span>Daily to Annual Billing Cadences</span>
          </div>
        </div>
      </div>

      {/* 3D Showcase Container */}
      <div className="relative w-full mt-10 sm:mt-14 z-10">
        <SubscriptionCarousel />
      </div>
    </section>
  );
};

export default HeroSection;
