import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What recurring billing cadences does Billit support natively?',
    answer:
      'Billit natively supports Daily, Weekly, Monthly, and Annual recurring billing cadences. Each plan supports customizable trial periods, automated renewal grace periods, setup fees, and precise pro-rata calculations for mid-cycle upgrades or downgrades.',
  },
  {
    question: 'How does manual payment recording and bank wire reconciliation work?',
    answer:
      'Unlike traditional gateways that only handle automated credit cards, Billit includes a built-in manual payment reconciliation ledger. Operations and finance teams can log wire transfers, physical checks, direct bank deposits, and POS receipts, allocate split payments across multiple open invoices, and maintain an immutable audit trail with user accountability.',
  },
  {
    question: 'How does the Quotation-to-Subscription pipeline function?',
    answer:
      'Sales teams create structured proposals drawing directly from your product and variant catalog, with custom discounts and automated tax calculations. Once a prospect accepts the quote, a single click automatically activates the subscription and initiates the recurring billing schedule without duplicate data entry.',
  },
  {
    question: 'What is the sub-two-second query response time guarantee?',
    answer:
      'All core operational queries, financial dashboard summaries (MRR, ARR, churn rate, ARPU), and report generation in Billit are strictly benchmarked to execute in under two (2.0) seconds. We achieve this through optimized relational database indexing, Prisma query caching, and modular service isolation.',
  },
  {
    question: 'What roles are supported in Role-Based Access Control (RBAC)?',
    answer:
      'Billit includes 5 purpose-built roles out of the box: Super Admin (complete system control), Billing Manager (financial edits & ledger reconciliations), Sales Representative (quotes & customer viewing), Support Agent (read-only billing inquiries & assistance), and Customer Viewer (portal-only access).',
  },
  {
    question: 'Can Billit run on-premises or in private cloud VPCs?',
    answer:
      'Yes. Because Billit is architected as a modular monolith with standard Node.js/TypeScript and PostgreSQL 16, it can be deployed via Docker Compose, Kubernetes, AWS ECS, Google Cloud Run, or on-premises servers without proprietary external cloud lock-in.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative w-full py-20 sm:py-28 bg-black border-t border-white/[0.08]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
            Everything You Need{' '}
            <span className="block font-serif italic font-normal text-white text-2xl sm:text-4xl md:text-5xl mt-1">
              to Know
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Answers to common questions regarding Billit billing capabilities, architecture, and
            reconciliation workflows.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-zinc-950/70 border transition-all ${
                  isOpen
                    ? 'border-orange-500/40 shadow-[0_0_25px_rgba(240,83,35,0.1)]'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#F5F5F7] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#191D29] flex items-center justify-center shrink-0 text-[#999EAB] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#999EAB] leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Link to dedicated FAQ page */}
        <div className="mt-12 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-white transition-colors group"
          >
            <span>Explore full Knowledge Base & Architecture FAQs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

