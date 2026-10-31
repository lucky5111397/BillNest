import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Shield,
  Zap,
  FileText,
  RefreshCw,
  Receipt,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { LandingNavbar } from '../landing/components/LandingNavbar';
import { LandingFooter } from '../landing/components/LandingFooter';

interface FaqEntry {
  id: string;
  category: 'cadences' | 'quotes' | 'reconciliation' | 'architecture' | 'security';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATABASE: FaqEntry[] = [
  {
    id: 'cadences-1',
    category: 'cadences',
    question: 'What recurring billing cadences does Billit support natively?',
    answer:
      'Billit natively supports Daily, Weekly, Monthly, and Annual recurring billing cadences out of the box. Each cadence can be configured with distinct trial lengths, renewal grace periods, automated invoice generation schedules, and mid-cycle pro-rata calculation rules.',
    tags: ['cadences', 'recurring', 'daily', 'weekly', 'monthly', 'annual', 'schedules'],
  },
  {
    id: 'cadences-2',
    category: 'cadences',
    question: 'How does Billit calculate pro-rata charges for mid-cycle plan changes?',
    answer:
      'When a customer upgrades, downgrades, or adds seats in the middle of a billing cycle, Billit computes precise second-by-second fractional pro-rata adjustments. Unused credits from the existing plan are credited against the newly configured plan, producing an accurate balance on the immediate or subsequent invoice.',
    tags: ['proration', 'pro-rata', 'upgrades', 'downgrades', 'adjustments'],
  },
  {
    id: 'cadences-3',
    category: 'cadences',
    question: 'Can subscriptions have customized trial and grace periods?',
    answer:
      'Yes. Every subscription plan supports customizable trial durations (e.g. 7-day, 14-day, 30-day free access) and automatic dunning grace periods that keep services active while retry schedules attempt payment resolution.',
    tags: ['trials', 'grace period', 'dunning', 'retries'],
  },
  {
    id: 'quotes-1',
    category: 'quotes',
    question: 'How does the Quotation-to-Subscription pipeline function?',
    answer:
      'Sales teams create structured proposals directly inside Billit drawing from your synchronized product and variant catalog. Custom line discounts, custom taxes, and terms are bound to the quote. Once the customer reviews and accepts the proposal, a single click converts the quotation into an active subscription and kicks off automated recurring invoicing.',
    tags: ['quotes', 'quotation', 'pipeline', 'conversion', 'sales'],
  },
  {
    id: 'quotes-2',
    category: 'quotes',
    question: 'Can quotes include custom discounts and localized tax rules?',
    answer:
      'Yes. Billit supports both percentage-based and fixed-amount promotional discounts, coupon codes, and localized tax rules (inclusive or exclusive GST/VAT matrices) applied per quote line item or to the subtotal.',
    tags: ['discounts', 'taxes', 'vat', 'gst', 'coupons'],
  },
  {
    id: 'quotes-3',
    category: 'quotes',
    question: 'Does converting a quote require re-entering customer information?',
    answer:
      'No. The Quote-to-Subscription engine automatically binds customer entity IDs, billing addresses, contact details, and catalog line items to the created subscription schedule, completely eliminating double-entry clerical errors.',
    tags: ['quotes', 'zero error', 'automation', 'customer entity'],
  },
  {
    id: 'reconciliation-1',
    category: 'reconciliation',
    question: 'How does manual payment recording and bank wire reconciliation work?',
    answer:
      'Unlike traditional credit-card-only gateways, Billit features a built-in double-entry manual payment reconciliation ledger. Operations and finance teams record incoming wire transfers, physical checks, direct bank deposits, ACH transfers, and POS receipts, matching each transaction against outstanding invoices.',
    tags: ['reconciliation', 'wire transfer', 'check', 'ach', 'ledger', 'manual payment'],
  },
  {
    id: 'reconciliation-2',
    category: 'reconciliation',
    question: 'Can a single wire transfer be split across multiple invoices?',
    answer:
      'Yes. Billit supports split-payment allocation. A single incoming bulk wire transfer (e.g., $50,000) can be portioned across multiple separate invoice line items or multiple subsidiary accounts with instant ledger balancing and zero unaccounted discrepancies.',
    tags: ['split payment', 'wire', 'multi invoice', 'allocation'],
  },
  {
    id: 'reconciliation-3',
    category: 'reconciliation',
    question: 'Is an audit trail maintained for manual ledger entries?',
    answer:
      'Every manual payment entry records the operator ID, precise UTC timestamp, incoming financial reference (e.g. check number, bank trace ID), and optional notes for immutable accounting compliance.',
    tags: ['audit trail', 'compliance', 'operator id', 'ledger'],
  },
  {
    id: 'architecture-1',
    category: 'architecture',
    question: 'What is the sub-two-second (< 2.0s) query response time guarantee?',
    answer:
      'All primary financial dashboards, MRR summaries, cohort churn computations, and invoice list endpoints are strictly engineered and benchmarked to execute in under two seconds. We achieve this via PostgreSQL 16 index optimization, Prisma ORM query tuning, and modular monolith architecture.',
    tags: ['query speed', 'sub-2s', 'latency', 'sla', 'performance', 'postgresql'],
  },
  {
    id: 'architecture-2',
    category: 'architecture',
    question: 'Can Billit be deployed on-premise or in private cloud VPCs?',
    answer:
      'Yes. Billit is packaged with standard Docker containerization, Node.js/TypeScript runtime, and relational PostgreSQL. It can be deployed to Docker Compose, Kubernetes, AWS ECS, Google Cloud Run, or secure on-premises bare-metal servers without vendor lock-in.',
    tags: ['deployment', 'docker', 'kubernetes', 'aws', 'gcp', 'on-premise', 'vpc'],
  },
  {
    id: 'security-1',
    category: 'security',
    question: 'What roles are supported in Role-Based Access Control (RBAC)?',
    answer:
      'Billit provides 5 pre-configured roles: Super Admin (complete system authority), Billing Manager (financial approvals, refunds & ledger reconciliation), Sales Representative (proposal creation & customer views), Support Agent (read-only subscription queries), and Customer Viewer (isolated self-service portal).',
    tags: ['rbac', 'roles', 'permissions', 'super admin', 'billing manager', 'security'],
  },
  {
    id: 'security-2',
    category: 'security',
    question: 'How is customer financial data encrypted and backed up?',
    answer:
      'All data in transit is encrypted using modern TLS 1.3 encryption. At rest, database persistence layers utilize AES-256 block-level encryption. Automated point-in-time recovery (PITR) backups run continuously to prevent catastrophic data loss.',
    tags: ['encryption', 'tls', 'aes-256', 'backups', 'security'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'cadences', label: 'Billing & Cadences', icon: RefreshCw },
  { id: 'quotes', label: 'Quotes & Invoices', icon: FileText },
  { id: 'reconciliation', label: 'Payment Reconciliation', icon: Receipt },
  { id: 'architecture', label: 'Database & SLA', icon: Zap },
  { id: 'security', label: 'Security & RBAC', icon: Shield },
];

export const FaqPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'cadences-1': true });

  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((entry) => {
      const matchesCategory =
        selectedCategory === 'all' || entry.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.question.toLowerCase().includes(q) ||
        entry.answer.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323] backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE REPOSITORY • SYSTEM ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="block text-[#F05323] drop-shadow-[0_0_35px_rgba(240,83,35,0.45)]">
              Frequently Asked
            </span>
            <span className="block font-serif italic font-normal text-white text-3xl sm:text-5xl md:text-6xl mt-2">
              Questions & Architecture.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Find technical answers regarding multi-cadence billing engines, quotation-to-cash workflows,
            wire/check reconciliation, and sub-2-second latency guarantees.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by topic, keyword, or feature..."
                className="w-full bg-[#11131A] border border-white/[0.12] hover:border-orange-500/40 focus:border-orange-500 rounded-full pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#F05323] text-white shadow-md shadow-orange-500/30'
                      : 'bg-zinc-950/70 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-18 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-3">
              <HelpCircle className="w-8 h-8 text-zinc-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Matching Questions Found</h3>
              <p className="text-sm text-zinc-400">
                Try refining your search keyword or clearing the active category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-semibold text-orange-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl bg-zinc-950/70 border transition-all duration-200 ${
                    isOpen
                      ? 'border-orange-500/40 shadow-[0_0_25px_rgba(240,83,35,0.12)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#F5F5F7] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-2xl"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-[#191D29] flex items-center justify-center shrink-0 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-orange-400' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.04] space-y-3">
                      <p>{faq.answer}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {faq.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono text-zinc-500 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Live Concierge & Assistance Card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18110B] to-zinc-950 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 font-semibold uppercase">
                <MessageSquare className="w-4 h-4" />
                <span>Need Personalized Guidance?</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Have a Unique Billing Requirement?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
                Our solutions engineering team can review your quote-to-cash workflow, audit requirements,
                and custom billing schedules.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-zinc-200 text-zinc-950 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg"
            >
              Open Interactive Console
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Experience the Future of Recurring Billing
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Test the live quote generator, automated cadence engine, and manual wire ledger in our workspace.
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

export default FaqPage;
