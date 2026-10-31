import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Download,
  Zap,
  CheckCircle2,
  CreditCard,
  Plus,
  Minus,
  Award,
  Clock,
  FileText,
  Mail,
  ArrowRight,
  ShieldCheck,
  Bot,
  Headphones,
} from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { portalService } from '@/services/portal.service';

export const CustomerPortalOverviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  // Seat and add-on interactive state
  const [seats, setSeats] = useState(10);
  const [hasAiAddon, setHasAiAddon] = useState(true);
  const [hasSupportAddon, setHasSupportAddon] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: overviewData } = useQuery({
    queryKey: ['portal-overview'],
    queryFn: portalService.getOverview,
  });

  const activeSubId = overviewData?.subscriptions?.[0]?._id;
  const pendingQuoteId = overviewData?.quotations?.[0]?._id;

  const seatPrice = 1760;
  const basePlatformPrice = 1998;
  const aiAddonPrice = hasAiAddon ? 50 : 0;
  const supportAddonPrice = hasSupportAddon ? 120 : 0;

  const seatSubtotal = seats * seatPrice;
  const totalMonthly = basePlatformPrice + seatSubtotal + aiAddonPrice + supportAddonPrice;

  // Format currency
  const formatUSD = (val: number) => {
    return (
      '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSeatDec = async () => {
    if (seats > 1) {
      const newSeats = seats - 1;
      setSeats(newSeats);
      if (activeSubId) {
        try {
          await portalService.updateSeats(activeSubId, newSeats);
        } catch {
          // Keep local state
        }
      }
    }
  };

  const handleSeatInc = async () => {
    const newSeats = seats + 1;
    setSeats(newSeats);
    if (activeSubId) {
      try {
        await portalService.updateSeats(activeSubId, newSeats);
      } catch {
        // Keep local state
      }
    }
  };

  const handleConfirmQuote = async () => {
    if (pendingQuoteId) {
      try {
        await portalService.acceptQuotation(pendingQuoteId);
        queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      } catch {
        // Fallback
      }
    }
    showToast('Quote confirmed and converted to active enterprise subscription!');
  };

  const handleExportInvoicesCsv = () => {
    const sampleRows = [
      ['Invoice', 'Date', 'Amount', 'Status'],
      ['INV-2026-1089', '01 Oct 2026', '$19,598.00', 'PAID'],
      ['INV-2026-1025', '01 Sep 2026', '$590.00', 'PAID'],
    ];
    const csvContent = sampleRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `acme-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Tenant invoice records exported to CSV.');
  };

  const discountPercent = Math.min(100, Math.round((seats / 15) * 100));
  const seatsToTier2 = Math.max(0, 15 - seats);

  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">STITCH REFERENCE SPECIFICATION</span>
          <span>• Customer Self-Service Portal (#9d6640cb)</span>
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

      {/* Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-variant via-surface-bright to-surface-variant p-6 shadow-2xl border border-border-subtle">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-white/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-surface-lowest text-[10px] font-mono text-text-secondary uppercase tracking-widest border border-border-subtle">
                ENTERPRISE TENANT #ACM-8812
              </span>
              <span className="text-xs font-mono text-status-cyan tracking-wider flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-status-cyan" />
                LEDGER VERIFIED
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
              Welcome back, Acme Logistics 🤝
            </h1>
            <p className="text-xs text-text-secondary max-w-xl">
              Manage your subscriptions, add-ons, and billing — all in one centralized
              high-precision workspace.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => showToast('Downloading historical tax statement bundle...')}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-surface-high hover:bg-surface-bright border border-border-subtle text-text-primary text-xs font-mono uppercase tracking-wider transition-colors shadow-sm"
              type="button"
            >
              <Download className="h-3.5 w-3.5 text-text-secondary" />
              <span>Tax Statements</span>
            </button>
            <SilverButton
              variant="primary"
              size="sm"
              onClick={() => showToast('Quick pay run initiated (Phase 2 feature)')}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Quick Pay Run</span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Status Card */}
        <div className="bg-surface-lowest rounded-xl p-5 border border-border-subtle shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
              Active Status
            </span>
            <StatusBadge status="cyan" dot={true}>
              Live Silver Pill
            </StatusBadge>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-text-primary">
              1 Active Subscription
            </div>
            <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
              <span>Monthly Pro Plan</span>
              <span>•</span>
              <span>Standard Core</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-mono text-[11px] text-text-secondary">
            <span>Capacity Deployed:</span>
            <span className="text-text-primary font-semibold">{seats} Core Seats</span>
          </div>
        </div>

        {/* Next Auto-Invoice Card */}
        <div className="bg-surface-lowest rounded-xl p-5 border border-border-subtle shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
              Next Auto-Invoice
            </span>
            <span className="text-xs font-mono text-status-cyan flex items-center gap-1">
              <Clock className="h-3 w-3" />
              In 22 days
            </span>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-text-primary">01 Nov 2026</div>
            <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
              <CreditCard className="h-3 w-3 text-text-secondary" />
              <span>Primary: Stripe ACH ••••4092</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-mono text-[11px] text-text-secondary">
            <span>Est. Cycle Total:</span>
            <span className="text-text-primary font-bold">{formatUSD(totalMonthly)}</span>
          </div>
        </div>

        {/* Outstanding Balance Card */}
        <div className="bg-surface-lowest rounded-xl p-5 border border-border-subtle shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
              Outstanding Balance
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-bright text-text-primary font-mono text-[10px] uppercase">
              Health: 100%
            </span>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-text-primary">
              $0.00{' '}
              <span className="text-[11px] text-status-cyan font-normal tracking-wider">
                PAID / UP TO DATE
              </span>
            </div>
            <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-status-success" />
              <span>All historical invoices settled</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-mono text-[11px] text-text-secondary">
            <span>Credit Balance:</span>
            <span className="text-text-primary font-semibold">$0.00 USD</span>
          </div>
        </div>
      </div>

      {/* Two-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================
            LEFT COLUMN: Subscription Management (7 Cols)
        ========================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Monthly Pro Plan Master Card */}
          <div className="bg-surface-lowest rounded-xl p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-text-primary" />
                  <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                    PRIMARY SUITE
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text-primary font-sans mt-0.5">
                  Monthly Pro Plan
                </h2>
                <div className="font-mono text-[10px] text-text-secondary tracking-wider mt-0.5">
                  SUBSCRIPTION ID: <span className="text-text-primary">SUB-2026-0084</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl font-mono font-bold text-text-primary">
                  {formatUSD(totalMonthly)}
                </div>
                <div className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                  per billing cycle
                </div>
              </div>
            </div>

            {/* Ledger Parameter Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-variant/70 p-3.5 rounded-lg border border-border-subtle text-xs font-mono">
              <div>
                <div className="text-[10px] text-text-secondary uppercase">Start Date</div>
                <div className="font-semibold text-text-primary mt-0.5">01 Oct 2026</div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase">Next Billing</div>
                <div className="font-semibold text-text-primary mt-0.5">01 Nov 2026</div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase">Allocated Seats</div>
                <div className="font-semibold text-text-primary mt-0.5">{seats} Seats</div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase">Payment Rail</div>
                <div className="font-semibold text-text-primary mt-0.5">Stripe ACH Auto</div>
              </div>
            </div>

            {/* Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Subscription paused request submitted.')}
                  className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono uppercase tracking-wider transition-colors"
                  type="button"
                >
                  Pause Subscription
                </button>
                <button
                  onClick={() => showToast('Cancellation flow initiated (requires confirmation).')}
                  className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-status-danger text-xs font-mono uppercase tracking-wider transition-colors"
                  type="button"
                >
                  Close Subscription
                </button>
              </div>
              <SilverButton
                variant="primary"
                size="sm"
                onClick={() => showToast('Renewed early for 1 additional annual cycle.')}
              >
                Renew Early
              </SilverButton>
            </div>
          </div>

          {/* 2. Customize Your Subscription (Add-ons) */}
          <div className="bg-surface-lowest rounded-xl p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-primary font-sans">
                Customize Your Subscription
              </h3>
              <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                REVENUE ADD-ONS
              </span>
            </div>

            <div className="space-y-3">
              {/* Add-on 1: AI Analytics */}
              <div className="p-3.5 rounded-lg bg-surface-variant/70 border border-border-subtle flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-surface-bright border border-border-subtle flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        AI Analytics Add-on
                      </span>
                      {hasAiAddon ? (
                        <span className="px-1.5 py-0.2 rounded bg-surface-bright text-status-cyan font-mono text-[10px] font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-surface-lowest text-text-secondary font-mono text-[10px]">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      +$50.00 / month • High throughput streaming ML inference on financial
                      telemetry.
                    </div>
                  </div>
                </div>

                {/* Interactive Toggle */}
                <button
                  type="button"
                  onClick={() => setHasAiAddon(!hasAiAddon)}
                  className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
                    hasAiAddon
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-canvas-base shadow-md" />
                </button>
              </div>

              {/* Add-on 2: Dedicated Support */}
              <div className="p-3.5 rounded-lg bg-surface-variant/70 border border-border-subtle flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-surface-bright border border-border-subtle flex items-center justify-center shrink-0">
                    <Headphones className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        Dedicated Priority Support
                      </span>
                      {hasSupportAddon ? (
                        <span className="px-1.5 py-0.2 rounded bg-surface-bright text-status-cyan font-mono text-[10px] font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-surface-lowest text-text-secondary font-mono text-[10px]">
                          STANDBY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      +$120.00 / month • 24/7 designated Slack channel with assigned billing
                      engineer.
                    </div>
                  </div>
                </div>

                {/* Interactive Toggle */}
                <button
                  type="button"
                  onClick={() => setHasSupportAddon(!hasSupportAddon)}
                  className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
                    hasSupportAddon
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-canvas-base shadow-md" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Manage Team Seats (Interactive Allocation) */}
          <div className="bg-surface-lowest rounded-xl p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary font-sans">Manage Team Seats</h3>
                <div className="text-xs text-text-secondary">
                  Provision or de-provision verified corporate ledger seats instantly.
                </div>
              </div>
              <span className="font-mono text-xs text-status-cyan uppercase font-bold">
                $1,760.00 / SEAT / MO
              </span>
            </div>

            {/* Counter & Math Display */}
            <div className="p-4 rounded-lg bg-surface-variant/80 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSeatDec}
                  disabled={seats <= 1}
                  className="w-9 h-9 rounded bg-surface-bright hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed border border-border-subtle text-text-primary flex items-center justify-center font-bold transition-all active:scale-95"
                  type="button"
                  title="Remove Seat"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="text-center min-w-[80px]">
                  <span className="font-mono text-2xl font-bold text-text-primary block">
                    {seats}
                  </span>
                  <span className="font-mono text-[10px] text-text-secondary uppercase">
                    Seats Active
                  </span>
                </div>
                <button
                  onClick={handleSeatInc}
                  className="w-9 h-9 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary flex items-center justify-center font-bold transition-all active:scale-95"
                  type="button"
                  title="Add Seat"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="text-left sm:text-right font-mono">
                <div className="text-[10px] text-text-secondary uppercase tracking-widest">
                  Seat Subtotal Calculation
                </div>
                <div className="text-xs font-bold text-text-primary mt-0.5">
                  {seats} seats × {formatUSD(seatPrice)} = {formatUSD(seatSubtotal)} / mo
                </div>
              </div>
            </div>

            {/* Volume Discount Tier Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-text-primary font-semibold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-status-cyan" />
                  TIER 2 MILESTONE
                </span>
                <span className="text-text-secondary text-[11px]">
                  {seatsToTier2 > 0
                    ? `Add ${seatsToTier2} more seat${seatsToTier2 > 1 ? 's' : ''} to unlock 15% Admin Volume Discount!`
                    : 'TIER 2 REACHED: 15% Admin Volume Discount applied!'}
                </span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden border border-border-subtle">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-white rounded-full transition-all duration-300"
                  style={{ width: `${discountPercent}%` }}
                />
              </div>
            </div>

            {/* Live Estimated Monthly Total Card Inset */}
            <div className="p-3.5 rounded-lg bg-surface-bright border border-border-specular flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                  Live Estimated Monthly Total
                </div>
                <div className="text-xs text-text-secondary">
                  Base Core Platform + Seats + Active Add-ons
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-lg font-bold text-text-primary">{formatUSD(totalMonthly)}</div>
                <div className="text-[10px] text-status-cyan uppercase font-semibold">
                  NEXT CHARGE 01 NOV 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: Quotations, Invoices, Account Executive (5 Cols)
        ========================================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Pending Quote Card */}
          <div className="bg-surface-lowest rounded-xl p-6 border border-border-subtle shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-surface-bright font-mono text-[10px] uppercase font-semibold text-text-primary border border-border-subtle">
                QUOTE #SUB-2026-0099
              </span>
              <span className="font-mono text-[10px] text-status-danger flex items-center gap-1 font-semibold">
                <Clock className="h-3 w-3" />
                Expires in 4 days
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-primary font-sans">
                Enterprise Seat Expansion &amp; Multi-Region VAT Pack
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Includes automated compliance reporting across EMEA, APAC, and North American tax
                districts.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-variant/80 border border-border-subtle flex items-baseline justify-between font-mono">
              <div>
                <div className="text-[10px] text-text-secondary uppercase">Quoted Amount</div>
                <div className="text-lg font-bold text-text-primary">
                  $22,450.00 <span className="text-xs text-text-secondary font-normal">/ yr</span>
                </div>
              </div>
              <div className="text-right text-[10px] text-text-secondary">
                <div>Annual commitment</div>
                <div className="text-text-primary font-semibold">Net 15 Days payment terms</div>
              </div>
            </div>

            <SilverButton
              variant="primary"
              size="sm"
              className="w-full justify-center"
              onClick={handleConfirmQuote}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Accept &amp; Confirm Quote</span>
            </SilverButton>

            <div className="text-center pt-1">
              <button
                onClick={() => showToast('Displaying quotation breakdown PDF...')}
                className="text-[11px] font-mono text-text-secondary hover:text-text-primary uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                type="button"
              >
                <span>View Quotation PDF &amp; Line Items</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 2. Invoice History Table */}
          <div className="bg-surface-lowest rounded-xl p-6 border border-border-subtle shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <h3 className="text-sm font-bold text-text-primary font-sans">Invoice History</h3>
              <button
                onClick={handleExportInvoicesCsv}
                className="text-[10px] font-mono text-text-secondary hover:text-text-primary uppercase tracking-wider flex items-center gap-1 transition-colors"
                type="button"
              >
                <Download className="h-3 w-3" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-surface-variant text-[10px] uppercase text-text-secondary border-b border-border-subtle">
                    <th className="py-2 px-2.5">Invoice</th>
                    <th className="py-2 px-2.5">Date</th>
                    <th className="py-2 px-2.5 text-right">Amount</th>
                    <th className="py-2 px-2.5 text-center">Status</th>
                    <th className="py-2 px-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr className="hover:bg-surface-variant/40 transition-colors">
                    <td className="py-2 px-2.5 font-bold text-text-primary">INV-2026-1089</td>
                    <td className="py-2 px-2.5 text-text-secondary text-[11px]">01 Oct 2026</td>
                    <td className="py-2 px-2.5 text-right font-bold text-text-primary">
                      $19,598.00
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span className="px-1.5 py-0.2 rounded bg-surface-bright text-text-primary text-[9px] uppercase">
                        PAID
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right">
                      <button
                        onClick={() => showToast('Downloaded invoice PDF INV-2026-1089')}
                        className="text-text-secondary hover:text-text-primary"
                        title="Download PDF"
                        type="button"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-variant/40 transition-colors">
                    <td className="py-2 px-2.5 font-bold text-text-primary">INV-2026-1025</td>
                    <td className="py-2 px-2.5 text-text-secondary text-[11px]">01 Sep 2026</td>
                    <td className="py-2 px-2.5 text-right font-bold text-text-primary">$590.00</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className="px-1.5 py-0.2 rounded bg-surface-bright text-text-primary text-[9px] uppercase">
                        PAID
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right">
                      <button
                        onClick={() => showToast('Downloaded invoice PDF INV-2026-1025')}
                        className="text-text-secondary hover:text-text-primary"
                        title="Download PDF"
                        type="button"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-variant/40 transition-colors">
                    <td className="py-2 px-2.5 font-bold text-text-primary">INV-2026-0982</td>
                    <td className="py-2 px-2.5 text-text-secondary text-[11px]">01 Aug 2026</td>
                    <td className="py-2 px-2.5 text-right font-bold text-text-primary">$590.00</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className="px-1.5 py-0.2 rounded bg-surface-bright text-status-danger text-[9px] uppercase font-bold">
                        DUE NOW
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right">
                      <button
                        onClick={() =>
                          showToast(
                            'Settled overdue invoice INV-2026-0982 via saved payment method.',
                          )
                        }
                        className="px-2 py-0.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-[10px] font-bold uppercase text-text-primary"
                        type="button"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-center border-t border-border-subtle">
              <button
                onClick={() => showToast('Navigating to full invoice ledger')}
                className="font-mono text-[10px] text-text-secondary hover:text-text-primary uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                type="button"
              >
                <span>View All Invoices &amp; Receipts (8)</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 3. Dedicated Account Executive Card */}
          <div className="bg-surface-lowest rounded-xl p-5 border border-border-subtle shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-bright border border-border-subtle flex items-center justify-center shrink-0">
                <span className="font-mono text-sm font-bold text-text-primary">JV</span>
              </div>
              <div>
                <div className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                  DEDICATED ACCOUNT EXECUTIVE
                </div>
                <div className="text-sm font-bold text-text-primary">Jordan Vance</div>
                <div className="text-[11px] text-text-secondary">
                  Need a custom contract amendment?
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('Contact modal opened. Account rep notified.')}
              className="px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary font-mono text-xs uppercase font-semibold tracking-wider transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              type="button"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Rep</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerPortalOverviewPage;
