import React from 'react';
import { ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CtaSection: React.FC = () => {
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-black border-t border-white/[0.08]">
      {/* Background radial dramatic glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(240,83,35,0.22),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-orange-500/30 text-xs font-semibold text-[#F05323] shadow-lg shadow-orange-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START SCALING RECURRING REVENUE TODAY</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F5F7] max-w-3xl mx-auto leading-tight">
          Modernize Your Recurring Billing{' '}
          <span className="block font-serif italic font-normal text-white text-3xl sm:text-5xl md:text-6xl mt-2">
            Without Analytical Lag.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Unify structured quoting, multi-cadence subscription automation, and manual payment
          reconciliation in one fast, modular platform.
        </p>

        {/* Buttons in rounded-full pill shape */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-[#F05323] hover:bg-[#E0481A] text-white shadow-[0_0_35px_rgba(240,83,35,0.45)] transition-all hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          >
            <span>Launch Billit Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-medium text-sm sm:text-base bg-black/60 hover:bg-white/[0.08] text-[#F5F5F7] border border-white/15 hover:border-orange-500/40 transition-all focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-[#F05323]" />
            <span>View 3D Subscription Gallery</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

