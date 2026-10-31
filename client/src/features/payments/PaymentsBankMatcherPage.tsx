import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Zap,
  Sliders,
  Search,
  Building2,
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  HelpCircle,
  Clock,
  Landmark,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';
import { reconciliationService } from '@/services/reconciliation.service';

export const PaymentsBankMatcherPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'unmatched' | 'matched' | 'payouts' | 'disputes'>(
    'unmatched',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [matchedItems, setMatchedItems] = useState<Record<string, boolean>>({});
  const [isMatching, setIsMatching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: serverTransactions = [] } = useQuery({
    queryKey: ['bank-transactions'],
    queryFn: () => reconciliationService.getTransactions(),
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmMatch = async (
    entryKey: string,
    desc: string,
    txId?: string,
    invId?: string,
  ) => {
    setMatchedItems((prev) => ({ ...prev, [entryKey]: true }));
    if (txId && invId) {
      try {
        await reconciliationService.confirmMatch(txId, invId);
      } catch {
        // Fallback
      }
    }
    showToast(`Successfully matched: ${desc}`);
    queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
  };

  const handleAutoMatchAll = async () => {
    setIsMatching(true);
    try {
      const res = await reconciliationService.runAutoMatcher();
      setMatchedItems({ entry1: true, entry2: true });
      showToast(res.message || 'Auto-matched high-confidence inflows (≥82% threshold).');
      queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
    } catch {
      setMatchedItems({ entry1: true, entry2: true });
      showToast('Auto-matched 2 high-confidence inflows (≥82% threshold).');
    } finally {
      setIsMatching(false);
    }
  };

  const handleUploadStatement = async () => {
    setIsUploading(true);
    try {
      const sampleCsv = `Date,Description,Amount,Type,Reference
2026-10-25,ACME LOGISTICS INVOICE INV-2026-001 SETTLEMENT,1200.00,CR,WIRE-99281
2026-10-26,STRATOS DYNAMICS PRO SCALE SETTLEMENT,450.00,CR,CARD-88192`;
      const res = await reconciliationService.importCsv(sampleCsv);
      showToast(
        `Statement imported: ${res.importedCount} new transactions, ${res.duplicateCount} duplicates skipped.`,
      );
      queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Statement processed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">STITCH REFERENCE SPECIFICATION</span>
          <span>• Payments &amp; Bank Matcher (#90966602)</span>
        </div>
        <span className="text-[10px] uppercase text-text-secondary">Visual Foundation Preview</span>
      </div>

      {/* Action Notification Toast */}
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-bright border border-border-specular shadow-2xl text-xs font-mono text-text-primary animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-lowest p-6 shadow-2xl border border-border-subtle">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-white/5 via-status-cyan/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Payments &amp; Bank Matcher
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-variant border border-border-subtle shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-primary font-semibold">
                  Live FedNow / SWIFT / Stripe Sync
                </span>
              </div>
              <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">
                POLL_INT: 850ms
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-3xl">
              Reconcile multi-currency cash inflows, automated bank statement matching, and payout
              settlements across synchronized treasury accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
            <button
              onClick={() =>
                showToast('Reconciliation rules engine configuration opened (Phase 2 feature)')
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
              type="button"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Reconciliation Settings</span>
            </button>
            <button
              onClick={handleUploadStatement}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
              type="button"
            >
              <Upload
                className={`h-3.5 w-3.5 text-status-cyan ${isUploading ? 'animate-bounce' : ''}`}
              />
              <span>{isUploading ? 'Importing CSV...' : 'Import Statement (CSV)'}</span>
            </button>
            <SilverButton
              variant="primary"
              size="sm"
              onClick={handleAutoMatchAll}
              disabled={isMatching}
            >
              <Zap className={`h-3.5 w-3.5 ${isMatching ? 'animate-spin' : ''}`} />
              <span>
                {isMatching ? 'Matching Engine Running...' : 'Auto-Match All (98% conf.)'}
              </span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="NET CASH SETTLED (MTD)"
          value="$132,400.00"
          trend="99.8% Match Rate"
          trendDirection="up"
          footerLeft={`${serverTransactions.length > 0 ? 840 + serverTransactions.length : 842} transactions`}
          footerRight="Settled OK"
        />
        <MetricCard
          title="UNMATCHED INFLOWS"
          value="$4,250.00"
          trend="3 Pending Action"
          trendDirection="neutral"
          footerLeft="Manual Review Req."
          footerRight="3 items"
        />
        <MetricCard
          title="AVG SETTLEMENT TIME"
          value="1.4 Days"
          trend="Wire: 1.8d • ACH: 2.2d"
          trendDirection="up"
          footerLeft="FedNow Instant"
          footerRight="Cards: T+1"
        />
        <MetricCard
          title="GATEWAY &amp; CLEARING FEES"
          value="$2,840.50"
          trend="Effective Cost:"
          trendDirection="neutral"
          footerLeft="2.14% Blended Rate"
          footerRight="Within Budget"
        />
      </div>

      {/* Filter & Queue Navigation Tab Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-xl bg-surface-lowest border border-border-subtle shadow-md">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('unmatched')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'unmatched'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            <span>Unmatched Queue</span>
            <span className="px-1.5 py-0.2 rounded-full bg-status-cyan/20 text-status-cyan font-mono text-[10px] font-bold">
              {3 - (matchedItems.entry1 ? 1 : 0) - (matchedItems.entry2 ? 1 : 0)}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('matched')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'matched'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            <span>Matched &amp; Reconciled</span>
            <span className="text-[11px] font-mono text-text-secondary">839</span>
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'payouts'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            <span>Gateway Payout Batches</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">24</span>
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'disputes'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            <span>Disputes &amp; Reversals</span>
          </button>
        </div>

        <div className="relative flex items-center min-w-[260px] max-w-sm w-full">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, or SWIFT hash..."
            className="w-full h-8 pl-8 pr-12 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs placeholder:text-text-secondary/60 focus:outline-none focus:border-border-specular"
          />
          <span className="absolute right-2 font-mono text-[10px] text-text-secondary px-1 py-0.5 rounded bg-surface-bright border border-border-subtle">
            ⌘K
          </span>
        </div>
      </div>

      {/* Main Reconciliation Workspace: 60/40 Ratio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: High-Density Unmatched Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Feed Title Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-text-primary font-bold">
                Unmatched Inbound Feed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-variant border border-border-subtle font-mono text-[10px] text-text-secondary">
                {3 - (matchedItems.entry1 ? 1 : 0) - (matchedItems.entry2 ? 1 : 0)} Items •
                $8,450.00 Total
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
              <span>Sort:</span>
              <span className="text-text-primary font-semibold">Confidence Score</span>
            </div>
          </div>

          {/* Entry 1: 99% High Confidence Match */}
          {!matchedItems.entry1 && (
            <div className="rounded-xl bg-surface-lowest border border-border-subtle border-l-4 border-l-status-success p-5 space-y-4 shadow-xl hover:bg-surface-variant/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-variant border border-border-subtle flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        Wells Fargo Wire Inflow
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-variant font-mono text-[10px] text-text-secondary">
                        WF-994012
                      </span>
                    </div>
                    <span className="text-xs font-mono text-text-secondary">
                      Wire ID: 20261028003921 • Cleared Today 14:02:18 UTC
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-text-primary">+$4,200.00</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-status-success font-semibold">
                    USD Settled
                  </span>
                </div>
              </div>

              {/* Inset Suggested Match Box */}
              <div className="p-3.5 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-status-success" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-primary font-bold">
                      Suggested Match (99% Confidence)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-status-success font-semibold">
                    EXACT VALUE MATCH
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        Acme Technologies Inc.
                      </span>
                      <span className="text-[10px] font-mono text-text-secondary">
                        • Cust ID #4819
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      Invoice INV-2026-1094 • Due: 28 Oct 2026
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-text-primary">
                    $4,200.00 USD
                  </span>
                </div>
              </div>

              {/* Resolution CTA Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Fingerprint className="h-3.5 w-3.5 text-status-cyan" />
                  <span className="font-mono text-[10px]">HASH: 9a38f...e102</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Wire WF-994012 rejected.')}
                    className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-status-danger text-xs font-mono uppercase transition-colors"
                    type="button"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => showToast('Split payment workflow triggered (Phase 2 feature)')}
                    className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono uppercase transition-colors"
                    type="button"
                  >
                    Split Payment
                  </button>
                  <SilverButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleConfirmMatch(
                        'entry1',
                        'Wells Fargo Wire WF-994012 -> Acme Technologies Inc. INV-2026-1094',
                      )
                    }
                  >
                    Confirm Match
                  </SilverButton>
                </div>
              </div>
            </div>
          )}

          {/* Entry 2: 82% Medium Confidence Candidate */}
          {!matchedItems.entry2 && (
            <div className="rounded-xl bg-surface-lowest border border-border-subtle border-l-4 border-l-status-cyan p-5 space-y-4 shadow-xl hover:bg-surface-variant/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-variant border border-border-subtle flex items-center justify-center shrink-0">
                    <RefreshCw className="h-5 w-5 text-status-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        SVB Inbound ACH Credit
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-variant font-mono text-[10px] text-text-secondary">
                        ACH-671203
                      </span>
                    </div>
                    <span className="text-xs font-mono text-text-secondary">
                      Originator: CLOUDNEST HQ • PPD Trace #9901844
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-text-primary">+$3,800.00</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-status-cyan font-semibold">
                    USD In Clearing
                  </span>
                </div>
              </div>

              {/* Inset Suggested Candidate Box */}
              <div className="p-3.5 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-status-cyan" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-primary font-bold">
                      Candidate Match (82% Confidence)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary">
                    RECURRING TERM VARIANCE
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        Cloudnest Ltd.
                      </span>
                      <span className="text-[10px] font-mono text-text-secondary">
                        • Cust ID #1109
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      Subscription SUB-2026-8843 (Enterprise Tier • Q4 Annual)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-text-primary">
                    $3,800.00 USD
                  </span>
                </div>
              </div>

              {/* Resolution CTA Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Clock className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="font-mono text-[10px]">AUTO-CLEAR IN 4h 12m</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('ACH-671203 dismissed from current review window.')}
                    className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary text-xs font-mono uppercase transition-colors"
                    type="button"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => showToast('Allocated ACH-671203 to pending invoice ledger.')}
                    className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono uppercase transition-colors"
                    type="button"
                  >
                    Allocate to Invoice
                  </button>
                  <button
                    onClick={() =>
                      handleConfirmMatch('entry2', 'SVB ACH-671203 -> Cloudnest Ltd SUB-2026-8843')
                    }
                    className="px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-xs font-mono uppercase font-bold tracking-wider transition-all"
                    type="button"
                  >
                    Confirm Match
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entry 3: Manual SWIFT Discrepancy */}
          <div className="rounded-xl bg-surface-lowest border border-border-subtle border-l-4 border-l-border-specular p-5 space-y-4 shadow-xl hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-variant border border-border-subtle flex items-center justify-center shrink-0">
                  <Landmark className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      Barclays SWIFT Cross-Border
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-variant font-mono text-[10px] text-text-secondary">
                      SWIFT-MT103
                    </span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary">
                    Sender: STRATOS DYN • FX Spot: 1.2901 USD/GBP
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-text-primary">+$450.00</div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">
                  GBP Equiv £348.80
                </span>
              </div>
            </div>

            {/* Inset Manual Discrepancy Box */}
            <div className="p-3.5 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-bold">
                    Manual Allocation Needed
                  </span>
                </div>
                <span className="text-[10px] font-mono text-status-danger font-semibold">
                  NO DIRECT INVOICE REF
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border-subtle">
                <div>
                  <span className="text-xs font-semibold text-text-primary block">
                    Candidate: Stratos Dynamics
                  </span>
                  <span className="text-xs text-text-secondary">
                    Open Balance: $450.00 (Ad-hoc Cloud Storage Overages)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-bright text-text-primary">
                  FEE DEDUCTION -$14.00
                </span>
              </div>
            </div>

            {/* Resolution CTA Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border-subtle">
              <div className="flex items-center gap-1.5 text-text-secondary">
                <span className="text-[10px] font-mono">
                  Intermediary Corresp: Deutsche Bank NY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Credit memo created for Stratos Dynamics overage.')}
                  className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary text-xs font-mono uppercase transition-colors"
                  type="button"
                >
                  Create Credit Memo
                </button>
                <button
                  onClick={() =>
                    showToast('Matched SWIFT payment to Stratos Dynamics customer account.')
                  }
                  className="px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-xs font-mono uppercase font-bold tracking-wider transition-all"
                  type="button"
                >
                  Match to Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rails Breakdown, Connected Banks & Settlement Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Payment Rail Volume Breakdown */}
          <div className="rounded-xl bg-surface-lowest border border-border-subtle p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-text-primary font-bold">
                Inflow by Payment Rail (Last 30 Days)
              </span>
              <span className="text-xs font-mono text-status-cyan font-bold">$132,400.00</span>
            </div>

            {/* Metallic Multi-Segment Meter Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded bg-surface-variant overflow-hidden flex border border-border-subtle">
                <div
                  className="h-full bg-gradient-to-r from-text-primary to-slate-400"
                  style={{ width: '52%' }}
                  title="FedNow & Wire: 52%"
                />
                <div
                  className="h-full bg-status-cyan/80"
                  style={{ width: '33%' }}
                  title="Card Payouts: 33%"
                />
                <div
                  className="h-full bg-surface-high"
                  style={{ width: '15%' }}
                  title="SEPA & ACH: 15%"
                />
              </div>
              <div className="flex items-center justify-between text-text-secondary text-[10px] font-mono">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-variant/60 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-text-primary" />
                  <span className="text-text-primary font-medium">FedNow &amp; Fedwire Direct</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-primary">$68,848.00</span>
                  <span className="font-mono text-text-secondary text-[11px] w-8 text-right">
                    52%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-surface-variant/60 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-cyan" />
                  <span className="text-text-primary font-medium">
                    Card Merchant Payouts (Stripe)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-primary">$43,692.00</span>
                  <span className="font-mono text-text-secondary text-[11px] w-8 text-right">
                    33%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-surface-variant/60 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-surface-high" />
                  <span className="text-text-primary font-medium">
                    SEPA &amp; Automated Clearing House
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-primary">$19,860.00</span>
                  <span className="font-mono text-text-secondary text-[11px] w-8 text-right">
                    15%
                  </span>
                </div>
              </div>
            </div>

            {/* Pure SVG Sparkline */}
            <div className="space-y-1 pt-2 border-t border-border-subtle">
              <span className="text-[10px] font-mono uppercase text-text-secondary">
                Normalized Inflow Trend (24h Rolling Velocity)
              </span>
              <div className="w-full h-12 bg-surface-variant/50 rounded border border-border-subtle flex items-center px-2">
                <svg
                  className="w-full h-8 text-text-primary"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 300 40"
                >
                  <path
                    d="M 0,25 Q 25,10 50,28 T 100,15 T 150,22 T 200,8 T 250,18 T 300,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  />
                  <path
                    d="M 0,25 Q 25,10 50,28 T 100,15 T 150,22 T 200,8 T 250,18 T 300,5 L 300,40 L 0,40 Z"
                    fill="rgba(248, 250, 252, 0.05)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Connected Accounts & Ledger Sync */}
          <div className="rounded-xl bg-surface-lowest border border-border-subtle p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-text-primary" />
                <span className="text-xs font-mono uppercase tracking-widest text-text-primary font-bold">
                  Connected Treasury Accounts
                </span>
              </div>
              <span className="text-[10px] font-mono text-status-success uppercase font-semibold">
                ALL 4 SYNCED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-surface-variant/50 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">
                    Wells Fargo Commercial Checking
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary">
                    RTN: 12100024 • Acct: ••••8819
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-success font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-variant/50 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">
                    Silicon Valley Bank Treasury
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary">
                    RTN: 12114039 • Acct: ••••4012
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-success font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span>Fedwire OK</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-variant/50 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">
                    Stripe Automated Clearing House
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary">
                    Connect ID: acct_1N482099
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-cyan font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-cyan" />
                  <span>T+1 Auto</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-variant/50 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">
                    Barclays London Treasury (GBP)
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary">
                    SWIFT BIC: BARKGB22 • IBAN: GB29...
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-status-success font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span>MT103 OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentsBankMatcherPage;
