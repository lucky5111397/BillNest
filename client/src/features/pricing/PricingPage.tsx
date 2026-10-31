import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  Building2,
  HelpCircle,
  CheckCircle2,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { LandingNavbar } from '../landing/components/LandingNavbar';
import { LandingFooter } from '../landing/components/LandingFooter';

interface Plan {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  isPopular?: boolean;
  ctaText: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    badge: 'Early Stage',
    monthlyPrice: 49,
    annualPrice: 39,
    description:
      'Ideal for early-stage startups and creators launching recurring subscription models.',
    ctaText: 'Get Started with Starter',
    features: [
      'Up to 250 active subscriptions',
      'Daily, weekly, monthly & annual cadences',
      'Automated recurring invoices & PDFs',
      'Standard customer self-service portal',
      'Sub-2s standard operational queries',
      '1 Administrator seat',
      'Email & community support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    badge: 'Most Popular',
    monthlyPrice: 149,
    annualPrice: 119,
    description:
      'Built for scaling B2B & SaaS companies needing structured quotes and payment reconciliation.',
    isPopular: true,
    ctaText: 'Launch Growth Workspace',
    features: [
      'Up to 2,500 active subscriptions',
      'Everything in Starter, plus:',
      'Full Quote-to-Subscription pipeline',
      'Manual payment recording (wire, check, POS)',
      'Multi-variant pricing & discount matrices',
      'Tax calculation engine (inclusive / exclusive)',
      'Up to 5 seats with Role-Based Access Control',
      'Real-time MRR, ARR & churn cohorts',
      'Priority email & Slack support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    badge: 'Dedicated Scale',
    monthlyPrice: 399,
    annualPrice: 319,
    description:
      'Tailored for high-volume enterprise billing teams requiring auditability and custom SLAs.',
    ctaText: 'Deploy Enterprise Workspace',
    features: [
      'Unlimited active subscriptions',
      'Everything in Growth, plus:',
      'Unlimited team seats & custom RBAC roles',
      'Financial audit log exporter & compliance suite',
      'Dedicated PostgreSQL database persistence options',
      'Multi-currency & localized VAT/GST matrices',
      '99.99% uptime SLA with sub-2s query guarantee',
      'Dedicated FinOps technical onboarding manager',
      '24/7 emergency incident paging',
    ],
  },
];

interface ComparisonRow {
  category: string;
  feature: string;
  starter: string | boolean;
  growth: string | boolean;
  enterprise: string | boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    category: 'Subscription Engine',
    feature: 'Active Subscriptions',
    starter: 'Up to 250',
    growth: 'Up to 2,500',
    enterprise: 'Unlimited',
  },
  {
    category: 'Subscription Engine',
    feature: 'Billing Cadences (Daily, Weekly, Monthly, Annual)',
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Subscription Engine',
    feature: 'Automated Pro-Rata & Mid-Cycle Adjustments',
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Quoting & Invoicing',
    feature: 'Automated PDF Invoicing & Email Dispatch',
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Quoting & Invoicing',
    feature: 'Quotation-to-Subscription 1-Click Pipeline',
    starter: 'Basic',
    growth: true,
    enterprise: true,
  },
  {
    category: 'Quoting & Invoicing',
    feature: 'Multi-Variant Pricing & Discounts',
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Payment Reconciliation',
    feature: 'Wire Transfer & Check Ledger',
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Payment Reconciliation',
    feature: 'Split-Payment Invoicing Allocation',
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Security & Access',
    feature: 'Role-Based Access Control (RBAC)',
    starter: '1 Admin',
    growth: '5 Seats',
    enterprise: 'Unlimited Seats',
  },
  {
    category: 'Security & Access',
    feature: 'Query Latency Guarantee (< 2.0s SLA)',
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    category: 'Security & Access',
    feature: 'Financial Audit Logs & Export',
    starter: false,
    growth: '30-day retention',
    enterprise: 'Permanent & exportable',
  },
  {
    category: 'Infrastructure',
    feature: 'Dedicated PostgreSQL Isolation',
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    category: 'Support',
    feature: 'FinOps Onboarding & Architecture Review',
    starter: 'Documentation',
    growth: 'Email & Chat',
    enterprise: 'Dedicated Architect',
  },
];

const PRICING_FAQS = [
  {
    q: 'Can I upgrade or downgrade my tier at any time?',
    a: 'Yes. You can switch between Starter, Growth, and Enterprise plans at any moment. Billit automatically calculates precision pro-rata credits and adjustments for mid-cycle changes with zero billing friction.',
  },
  {
    q: 'Are there any hidden revenue percentage charges or platform fees?',
    a: 'No. Billit charges a flat, predictable subscription fee. We never take a percentage cut of your gross revenue or charge punitive overage fees.',
  },
  {
    q: 'How does manual payment reconciliation work on the Growth and Enterprise plans?',
    a: 'Our double-entry reconciliation ledger enables you to record incoming wire transfers, physical checks, ACH transfers, and POS transactions, allocate split payments to outstanding invoices, and log an audit-compliant paper trail.',
  },
  {
    q: 'What is the 20% annual discount policy?',
    a: 'Choosing annual billing grants an automatic 20% discount on all plans, billed once per calendar year with full annual billing reports provided for accounting.',
  },
];

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen w-full bg-black text-[#F5F5F7] flex flex-col selection:bg-orange-500/30 selection:text-white relative">
      <LandingNavbar />

      <main className="flex-1 w-full pt-28 sm:pt-36 pb-20 relative z-10 overflow-x-hidden">
        {/* Glow auroras in background */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(240,83,35,0.18),transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323] backdrop-blur-md">
            <DollarSign className="w-3.5 h-3.5" />
            <span>TRANSPARENT, FLAT-RATE BILLING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="block text-[#F05323] drop-shadow-[0_0_35px_rgba(240,83,35,0.45)]">
              Simple, Predictable
            </span>
            <span className="block font-serif italic font-normal text-white text-3xl sm:text-5xl md:text-6xl mt-2">
              Billing Plans for Scale.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Choose the tier tailored to your volume. All plans include sub-2-second query guarantees,
            automated cadences, and no punitive revenue percentage fees.
          </p>

          {/* Billing Cycle Switcher */}
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
              className="relative w-12 h-6 rounded-full bg-zinc-900 border border-white/15 p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-18">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan) => {
              const currentPrice =
                billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between p-8 sm:p-9 rounded-3xl transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-gradient-to-b from-[#1C120C] via-zinc-950 to-black border-2 border-[#F05323] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(240,83,35,0.22)] lg:-translate-y-2'
                      : 'bg-zinc-950/70 border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F05323] to-[#EA580C] text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-orange-500/25 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{plan.badge}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-[#F5F5F7]">{plan.name}</h3>
                      {!plan.isPopular && (
                        <span className="text-[10px] font-mono text-[#999EAB] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#999EAB] min-h-[40px] leading-relaxed mb-6">
                      {plan.description}
                    </p>

                    {/* Price Block */}
                    <div className="p-5 rounded-2xl bg-[#0D0F17]/80 border border-white/[0.06] mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl sm:text-5xl font-black text-[#F5F5F7] tracking-tight">
                          ${currentPrice}
                        </span>
                        <span className="text-xs text-[#999EAB] font-medium">/ month</span>
                      </div>
                      <span className="text-[11px] text-[#999EAB]/80 block mt-1.5 font-mono">
                        {billingCycle === 'annual'
                          ? `Billed annually ($${currentPrice * 12} / year)`
                          : 'Billed monthly without long-term commitment'}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                        Plan Features & Quotas:
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

                  {/* Card Button */}
                  <Link
                    to="/dashboard"
                    className={`w-full py-4 px-6 rounded-full text-center text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-[#F05323] hover:bg-[#E0481A] text-white shadow-[0_0_25px_rgba(240,83,35,0.4)] hover:scale-[1.02] active:scale-95'
                        : 'bg-zinc-900 hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Comparison Matrix Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F7]">
              Detailed Plan Feature{' '}
              <span className="font-serif italic font-normal text-white">Comparison</span>
            </h2>
            <p className="text-sm text-zinc-400">
              Side-by-side technical capabilities and operational limits.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#12151F] text-zinc-300 font-mono">
                    <th className="p-4 sm:p-5 pl-6 font-semibold">CAPABILITY / FEATURE</th>
                    <th className="p-4 sm:p-5 text-center font-semibold">STARTER</th>
                    <th className="p-4 sm:p-5 text-center font-semibold text-[#F05323]">GROWTH</th>
                    <th className="p-4 sm:p-5 pr-6 text-center font-semibold">ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {COMPARISON_DATA.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.02] transition-colors text-zinc-300"
                    >
                      <td className="p-4 sm:p-5 pl-6 font-medium text-white flex items-center gap-2">
                        <span>{row.feature}</span>
                      </td>

                      <td className="p-4 sm:p-5 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )
                        ) : (
                          <span className="font-mono text-xs">{row.starter}</span>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 text-center bg-orange-500/[0.02]">
                        {typeof row.growth === 'boolean' ? (
                          row.growth ? (
                            <CheckCircle2 className="w-4 h-4 text-[#F05323] mx-auto" />
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )
                        ) : (
                          <span className="font-mono text-xs font-semibold text-orange-300">
                            {row.growth}
                          </span>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 pr-6 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )
                        ) : (
                          <span className="font-mono text-xs font-bold text-white">
                            {row.enterprise}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enterprise Bespoke Solution Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18110B] to-zinc-950 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 font-semibold uppercase">
                <Building2 className="w-4 h-4" />
                <span>Custom High-Volume FinOps Deployments</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Need a Dedicated Billing Cluster?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                We support private VPC provisioning on AWS or GCP, localized currency tax
                calculators, and custom database replication targets with sub-2s latency.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-zinc-200 text-zinc-950 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg"
            >
              Talk to Solutions Architecture
            </Link>
          </div>
        </div>

        {/* Pricing FAQs Accordion */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>BILLING FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Pricing & Invoicing{' '}
              <span className="font-serif italic font-normal text-white">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {PRICING_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl bg-zinc-950/70 border transition-all ${
                    isOpen
                      ? 'border-orange-500/40 shadow-[0_0_20px_rgba(240,83,35,0.1)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-white"
                  >
                    <span>{faq.q}</span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-[#191D29] flex items-center justify-center shrink-0 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-orange-400' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Automate Recurring Subscriptions?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Experience the power of instant quoting, automated billing cadences, and manual wire
            reconciliation today.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-[#F05323] hover:bg-[#E0481A] text-white shadow-[0_0_30px_rgba(240,83,35,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Billit Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PricingPage;
