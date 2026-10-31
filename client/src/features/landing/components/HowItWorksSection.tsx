import React from 'react';
import { Sliders, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Model Products, Variants & Cadences',
    description:
      'Configure products, seat-based add-ons, and pricing tiers across Daily, Weekly, Monthly, and Annual frequencies with custom trial and grace periods.',
    icon: Sliders,
    badge: 'Catalog Setup',
    details: [
      'Multi-currency and localized price overrides',
      'Configurable setup fees and trial lengths',
      'Dynamic usage tiers and seat adjustments',
    ],
  },
  {
    step: '02',
    title: 'Issue Structured Quotes with 1-Click Conversion',
    description:
      'Draft standardized proposals with product catalog items, custom customer discounts, and automated tax calculations. Convert accepted quotes directly into active subscriptions without re-entering data.',
    icon: FileText,
    badge: 'Sales Acceleration',
    details: [
      'Integrated quotation lifecycle states',
      'Custom discount codes and tax rules',
      'Instant conversion to active subscription schedules',
    ],
  },
  {
    step: '03',
    title: 'Automate Invoicing & Reconcile All Payments',
    description:
      'Let the billing engine generate recurring invoices and track incoming receipts. Log manual wire transfers, physical checks, and bank deposits directly into an audit-proof double-entry ledger.',
    icon: CheckCircle,
    badge: 'Revenue Realization',
    details: [
      'Automated recurring invoice generation',
      'Wire transfer and check reconciliation ledger',
      'Sub-2-second financial analytics & MRR tracking',
    ],
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative w-full py-20 sm:py-28 overflow-hidden bg-black border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F05323]" />
            <span>SEAMLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
            How Billit Powers Your{' '}
            <span className="block font-serif italic font-normal text-white text-2xl sm:text-4xl md:text-5xl mt-1">
              Billing Operations
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Three unified stages that bridge customer acquisition, quoting, recurring billing, and
            reconciliation.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div
            className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500/30 via-amber-400/20 to-orange-500/30 -translate-y-12 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-b from-[#131620] to-[#0A0C12] border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F05323] group-hover:bg-[#F05323] group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white/20 group-hover:text-orange-500/40 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-orange-400 font-semibold mb-3">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-bold text-[#F5F5F7] group-hover:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#999EAB] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-[#999EAB]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F05323]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F05323] hover:text-white transition-colors group"
          >
            <span>Learn more about Billit modular architecture</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F05323]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

