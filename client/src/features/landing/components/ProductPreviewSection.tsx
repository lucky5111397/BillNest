import React, { useState } from 'react';
import {
  TrendingUp,
  FileCheck2,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  DollarSign,
  Users,
  Building2,
  BadgeCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'reconciliation'>('overview');
  const [isConverted, setIsConverted] = useState(false);
  const [isAchAllocated, setIsAchAllocated] = useState(false);

  return (
    <section
      id="preview"
      className="relative w-full py-20 sm:py-28 bg-black border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#F05323]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F05323]" />
            <span>LIVE INTERACTIVE PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
            Inside the Billit{' '}
            <span className="block font-serif italic font-normal text-white text-2xl sm:text-4xl md:text-5xl mt-1">
              Financial Console
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Explore how the system unifies revenue operations, quote lifecycles, and manual payment
            reconciliation into a single high-speed dashboard.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex justify-center mb-8 px-2 overflow-x-auto">
          <div className="inline-flex p-1.5 rounded-full bg-zinc-950 border border-white/[0.1] backdrop-blur-md shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#F05323] text-white shadow-[0_0_20px_rgba(240,83,35,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Financial Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'quotes'
                  ? 'bg-[#F05323] text-white shadow-[0_0_20px_rgba(240,83,35,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Quote-to-Subscription</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reconciliation')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'reconciliation'
                  ? 'bg-[#F05323] text-white shadow-[0_0_20px_rgba(240,83,35,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Manual Reconciliation</span>
            </button>
          </div>
        </div>

        {/* Interactive Workspace Window Mockup */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0D0F17] border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(240,83,35,0.08)] overflow-hidden">
          {/* Window Titlebar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#131620] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-[#999EAB] hidden sm:inline-block">
                billit.app/dashboard/{activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACID LIVE
              </span>
              <span className="text-xs font-mono text-white/40 hidden md:inline-block">
                LATENCY: 42ms
              </span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-8 min-h-[440px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#999EAB]">
                      <span>Monthly Recurring Rev (MRR)</span>
                      <DollarSign className="w-4 h-4 text-[#F05323]" />
                    </div>
                    <div className="text-2xl font-black text-[#F5F5F7] mt-2">$128,450</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+14.2% vs last month</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#999EAB]">
                      <span>Active Subscriptions</span>
                      <Users className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-2xl font-black text-[#F5F5F7] mt-2">1,842</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+86 this week</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#999EAB]">
                      <span>Average Revenue / Account</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-[#F5F5F7] mt-2">$69.75</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Steady expansion
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#999EAB]">
                      <span>Net Collection Rate</span>
                      <BadgeCheck className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-[#F5F5F7] mt-2">99.4%</div>
                    <div className="text-[11px] text-[#999EAB] mt-1">Auto-dunning active</div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F7]">
                      Enterprise Proposal #QT-2026-089
                    </h4>
                    <p className="text-xs text-[#999EAB]">
                      Prospect: Meridian Health Networks • Terms: Net 30 • Cadence: Annual Recurring
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConverted ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Subscription #SUB-2026-9021</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsConverted(false)}
                          className="text-[11px] text-zinc-400 hover:text-white underline ml-1"
                        >
                          Reset
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Accepted by Client
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsConverted(true)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#F05323] hover:bg-[#E0481A] text-white shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Convert to Active Subscription</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#131620] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#999EAB]">
                      <span>STAGE 1</span>
                      <span className="text-emerald-400">DONE</span>
                    </div>
                    <div className="font-bold text-sm text-[#F5F5F7]">Quote Created</div>
                    <p className="text-xs text-[#999EAB]">
                      Catalog line items & 15% discount applied.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#131620] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#999EAB]">
                      <span>STAGE 2</span>
                      <span className="text-emerald-400">DONE</span>
                    </div>
                    <div className="font-bold text-sm text-[#F5F5F7]">Sent to Prospect</div>
                    <p className="text-xs text-[#999EAB]">Tracked link opened by decision maker.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#131620] border border-emerald-500/30 bg-emerald-500/[0.03] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                      <span>STAGE 3</span>
                      <span className="font-bold">READY</span>
                    </div>
                    <div className="font-bold text-sm text-[#F5F5F7]">Accepted Terms</div>
                    <p className="text-xs text-[#999EAB]">Digital signature authenticated.</p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-2 transition-all ${
                      isConverted
                        ? 'border-emerald-500/40 bg-emerald-500/[0.08]'
                        : 'border-orange-500/30 bg-orange-500/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-orange-400">STAGE 4</span>
                      <span
                        className={
                          isConverted ? 'text-emerald-400 font-bold' : 'text-orange-400 font-bold'
                        }
                      >
                        {isConverted ? 'ACTIVATED' : '1-CLICK'}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-[#F5F5F7]">
                      {isConverted ? 'Active Subscription' : 'Auto-Subscription'}
                    </div>
                    <p className="text-xs text-zinc-400">
                      {isConverted
                        ? 'Schedule active • First cycle billed.'
                        : 'Instant billing schedule initiation.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06] text-xs text-[#999EAB] flex items-center justify-between">
                  <span>Calculated Annual Subtotal: $48,000.00 • Taxes (Inclusive): $0.00</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    Total: $48,000.00 / year
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'reconciliation' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#161A26] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F7]">
                      Manual Payment Reconciliation Ledger
                    </h4>
                    <p className="text-xs text-[#999EAB]">
                      Match bank wire transfers, checks, ACH, and POS receipts against outstanding
                      invoices.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded border border-emerald-400/20">
                    Ledger Balanced: $0.00 Discrepancy
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#131620] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono text-[#999EAB] uppercase">
                      WIRE TRANSFER #TX-9041
                    </span>
                    <div className="text-lg font-bold text-[#F5F5F7]">$25,000.00</div>
                    <p className="text-xs text-[#999EAB]">PNC Bank Wire • From: Vertex Cloud Inc</p>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-semibold">
                        Matched to INV-2026-441
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#131620] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono text-[#999EAB] uppercase">
                      CHECK DEPOSIT #CHK-8812
                    </span>
                    <div className="text-lg font-bold text-[#F5F5F7]">$8,500.00</div>
                    <p className="text-xs text-[#999EAB]">
                      Physical Check #4102 • Silicon Valley Branch
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-semibold">
                        Matched to INV-2026-442
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-2 transition-all ${
                      isAchAllocated
                        ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                        : 'border-amber-500/20 bg-amber-500/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400 uppercase">
                        DIRECT ACH #ACH-1099
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAchAllocated(!isAchAllocated)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        {isAchAllocated ? 'Undo' : 'Allocate $3,200'}
                      </button>
                    </div>
                    <div className="text-lg font-bold text-[#F5F5F7]">$3,200.00</div>
                    <p className="text-xs text-[#999EAB]">
                      Incoming Chase ACH • Vertex Cloud Solutions
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span
                        className={
                          isAchAllocated
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        {isAchAllocated ? 'Matched to INV-2026-443' : 'Pending split allocation'}
                      </span>
                      {isAchAllocated ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#161A26] border border-white/[0.06] flex items-center justify-between text-xs text-[#999EAB]">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-400" />
                    <span>
                      Audit compliance: Every manual entry records operator ID, timestamp, and memo.
                    </span>
                  </span>
                  <Link to="/dashboard" className="text-orange-400 hover:underline font-semibold">
                    Open Reconciliation View →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;

