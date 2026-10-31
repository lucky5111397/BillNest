import React from 'react';
import { Download, FileText } from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">REPORTS &amp; FINANCIAL TELEMETRY</span>
          <span>• Revenue Recognition &amp; Cohort Analysis</span>
        </div>
        <span className="text-[10px] uppercase text-text-secondary">Visual Foundation Preview</span>
      </div>

      {/* Header Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-lowest p-6 shadow-2xl border border-border-subtle">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Reports &amp; Analytics
              </h1>
              <span className="px-2 py-0.5 rounded bg-surface-variant border border-border-subtle text-text-secondary font-mono text-[10px] uppercase">
                GAAP / IFRS-15
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-2xl">
              Real-time GAAP-compliant revenue recognition, cohort retention metrics, and churn
              forecasting reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <SilverButton variant="primary" size="sm">
              <Download className="h-3.5 w-3.5" />
              <span>Export Executive Pack</span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ANNUAL RECURRING REVENUE"
          value="$2.45M"
          trend="+18.2% YoY"
          trendDirection="up"
          footerLeft="Net New ARR"
          footerRight="+$380k"
        />
        <MetricCard
          title="MONTHLY RECURRING REVENUE"
          value="$204,166"
          trend="+3.8% MoM"
          trendDirection="up"
          footerLeft="Organic Expansion"
          footerRight="72%"
        />
        <MetricCard
          title="NET REVENUE RETENTION"
          value="118.4%"
          trend="Top Decile"
          trendDirection="up"
          footerLeft="Logo Churn"
          footerRight="0.8% / mo"
        />
        <MetricCard
          title="RECOGNIZED REVENUE (MTD)"
          value="$178,920"
          trend="ASC 606"
          trendDirection="up"
          footerLeft="Deferred Revenue"
          footerRight="$840,200"
        />
      </div>

      {/* Report Modules */}
      <div className="rounded-xl bg-surface-lowest border border-border-subtle shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary font-sans">
            Executive Financial Reports &amp; Exports
          </h2>
          <span className="font-mono text-xs text-text-secondary">4 Ready for Export</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-status-cyan" />
              <div>
                <div className="font-bold text-text-primary">
                  ASC 606 Revenue Recognition Ledger
                </div>
                <div className="text-[10px] text-text-secondary">
                  Monthly straight-line amortization schedule
                </div>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-[11px] uppercase">
              Download CSV
            </button>
          </div>

          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-status-cyan" />
              <div>
                <div className="font-bold text-text-primary">
                  Cohort Retention &amp; LTV Analysis
                </div>
                <div className="text-[10px] text-text-secondary">
                  Trailing 24-month customer lifetime value matrix
                </div>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-[11px] uppercase">
              Download CSV
            </button>
          </div>

          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-status-cyan" />
              <div>
                <div className="font-bold text-text-primary">
                  Tax &amp; VAT Multi-Jurisdiction Summary
                </div>
                <div className="text-[10px] text-text-secondary">
                  Filing-ready reports for EU OSS and US states
                </div>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-[11px] uppercase">
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
