import React from 'react';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Reconciling large wire transfers and physical customer checks used to tie up our finance team for days at month-end. With Billit, manual payments are matched and allocated to invoices in seconds with a complete audit trail.',
    author: 'Elena Rostova',
    title: 'VP of Finance & Operations',
    company: 'HyperScale Cloud',
    avatar: 'ER',
    avatarBg: 'from-purple-500 to-indigo-600',
  },
  {
    quote:
      'Most billing tools force you into monthly or annual lock-in. Billit natively allowed us to offer weekly cluster billing and daily consumption cadences alongside our multi-year enterprise contracts with zero backend rewrites.',
    author: 'Marcus Vance',
    title: 'Chief Technology Officer',
    company: 'Synapse Data Networks',
    avatar: 'MV',
    avatarBg: 'from-blue-500 to-cyan-600',
  },
  {
    quote:
      'The sub-2-second query response time is truly remarkable. Generating aging receivables and cohort churn reports across tens of thousands of subscription cycles happens in the blink of an eye.',
    author: 'Sarah Chen',
    title: 'Head of Revenue Operations',
    company: 'Vanguard SaaS',
    avatar: 'SC',
    avatarBg: 'from-emerald-500 to-teal-600',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-black border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F05323]" />
            <span>TRUSTED BY FINOPS LEADERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
            Built for Modern Teams{' '}
            <span className="block font-serif italic font-normal text-white text-2xl sm:text-4xl md:text-5xl mt-1">
              Managing High-Velocity Recurring Revenue
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Discover why finance teams and engineering leaders rely on Billit for modular billing
            and payment reconciliation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between p-8 rounded-2xl bg-zinc-950/70 border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-md hover:shadow-[0_10px_35px_rgba(240,83,35,0.1)]"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-orange-500/25 mb-3" />

                <p className="text-sm text-[#F5F5F7]/90 leading-relaxed italic mb-8">"{t.quote}"</p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-inner`}
                >
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F7]">{t.author}</h4>
                  <p className="text-xs text-[#999EAB]">
                    {t.title} • <span className="text-orange-400">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

