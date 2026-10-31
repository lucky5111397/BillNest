import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Starter',
      badge: 'Early Stage',
      price: billingCycle === 'annual' ? 39 : 49,
      description:
        'Ideal for early-stage startups and creators launching recurring subscription models.',
      features: [
        'Up to 250 active subscriptions',
        'Daily, weekly, monthly & annual cadences',
        'Automated recurring invoices & PDFs',
        'Standard customer portal access',
        'Sub-2s standard operational queries',
        '1 Administrator seat',
      ],
      isPopular: false,
      ctaText: 'Start with Starter',
    },
    {
      name: 'Growth',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? 119 : 149,
      description:
        'Built for scaling B2B & SaaS companies needing structured quotes and payment reconciliation.',
      features: [
        'Up to 2,500 active subscriptions',
        'Everything in Starter, plus:',
        'Full Quote-to-Subscription conversion pipeline',
        'Manual payment recording (wire, check, POS)',
        'Multi-variant pricing & custom discount rules',
        'Tax calculation engine (inclusive / exclusive)',
        'Up to 5 seats with Role-Based Access Control',
        'Real-time MRR, ARR & churn cohorts',
      ],
      isPopular: true,
      ctaText: 'Launch Growth Workspace',
    },
    {
      name: 'Enterprise',
      badge: 'Dedicated Scale',
      price: billingCycle === 'annual' ? 319 : 399,
      description:
        'Tailored for high-volume enterprise billing teams requiring auditability and custom SLAs.',
      features: [
        'Unlimited active subscriptions',
        'Everything in Growth, plus:',
        'Unlimited team seats & custom RBAC roles',
        'Financial audit log exporter & compliance suite',
        'Dedicated PostgreSQL database persistence options',
        'Multi-currency & localized VAT/GST matrices',
        '99.99% uptime SLA with sub-2s query guarantee',
        'Dedicated FinOps technical onboarding',
      ],
      isPopular: false,
      ctaText: 'Deploy Enterprise',
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full py-20 sm:py-28 bg-black border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F05323]" />
            <span>TRANSPARENT VALUE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
            Simple, Predictable{' '}
            <span className="block font-serif italic font-normal text-white text-2xl sm:text-4xl md:text-5xl mt-1">
              Billing Plans
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Choose the tier that matches your subscription volume. No hidden processing surcharges
            or punitive revenue tax.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs sm:text-sm font-medium ${
                billingCycle === 'monthly' ? 'text-white' : 'text-zinc-400'
              }`}
            >
              Monthly billing
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === 'annual'}
              aria-label="Toggle annual billing discount"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-zinc-900 border border-white/10 p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#F05323] transition-transform shadow-md ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  billingCycle === 'annual' ? 'text-white' : 'text-zinc-400'
                }`}
              >
                Annual billing
              </span>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#1C120C] via-zinc-950 to-black border-2 border-[#F05323] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(240,83,35,0.22)] lg:-translate-y-2'
                  : 'bg-zinc-950/70 border border-white/[0.08] hover:border-white/20'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F05323] to-[#EA580C] text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-orange-500/25 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#F5F5F7]">{plan.name}</h3>
                  {!plan.isPopular && (
                    <span className="text-[10px] font-mono text-[#999EAB] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#999EAB] min-h-[36px] leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-[#0D0F17]/70 border border-white/[0.06] mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-[#F5F5F7] tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-[#999EAB] font-medium">/ month</span>
                  </div>
                  <span className="text-[11px] text-[#999EAB]/80 block mt-1 font-mono">
                    {billingCycle === 'annual'
                      ? 'Billed annually ($' + plan.price * 12 + '/yr)'
                      : 'Billed monthly'}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                    Includes:
                  </div>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#999EAB]">
                      <div className="w-4 h-4 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-orange-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action Button */}
              <Link
                to="/dashboard"
                className={`w-full py-3.5 px-4 rounded-full text-center text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-[#F05323] hover:bg-[#E0481A] text-white shadow-[0_0_25px_rgba(240,83,35,0.4)]'
                    : 'bg-zinc-900 hover:bg-white/[0.08] text-white border border-white/10'
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Link to dedicated pricing page */}
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-white transition-colors group"
          >
            <span>View complete plan feature comparison matrix</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

