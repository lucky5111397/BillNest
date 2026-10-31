import React from 'react';
import { PlusCircle } from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const TaxesDiscountsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">TAX &amp; DISCOUNT GOVERNANCE</span>
          <span>• Fiscal Rules &amp; Multi-Jurisdiction Rate Engine</span>
        </div>
        <span className="text-[10px] uppercase text-text-secondary">Visual Foundation Preview</span>
      </div>

      {/* Header Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-lowest p-6 shadow-2xl border border-border-subtle">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Taxes &amp; Discounts
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-variant border border-border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-text-primary">
                  OECD FISCAL ENGINE
                </span>
              </div>
            </div>
            <p className="text-xs text-text-secondary max-w-2xl">
              Configure cross-border VAT/GST thresholds, automated reverse charge rules, and
              promotional discount campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <SilverButton variant="primary" size="sm">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Tax Jurisdiction</span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE TAX JURISDICTIONS"
          value="42"
          trend="OECD Compliant"
          trendDirection="up"
          footerLeft="Intra-EU Reverse Charge"
          footerRight="Automated"
        />
        <MetricCard
          title="EFFECTIVE TAX COLLECTED"
          value="$28,450.00"
          valueSubtext="MTD"
          trend="+5.4% MoM"
          trendDirection="up"
          footerLeft="EU VAT: €14,200"
          footerRight="US Sales: $12.8k"
        />
        <MetricCard
          title="ACTIVE DISCOUNT RULES"
          value="8"
          trend="2 Expedited"
          trendDirection="neutral"
          footerLeft="Redemption Rate"
          footerRight="28.0% Pool"
        />
        <MetricCard
          title="EXEMPTION CERTIFICATES"
          value="114"
          trend="100% Verified"
          trendDirection="up"
          footerLeft="Annual Re-audit"
          footerRight="Next: Q1 2027"
        />
      </div>

      {/* Rules Registry Table */}
      <div className="rounded-xl bg-surface-lowest border border-border-subtle shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary font-sans">
            Configured Fiscal &amp; Tax Jurisdictions
          </h2>
          <span className="font-mono text-xs text-text-secondary">4 Rules Active</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div>
              <div className="font-bold text-text-primary">EU Standard Digital VAT</div>
              <div className="text-[10px] text-text-secondary">
                Directive 2006/112/EC • Destination Principle
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-status-cyan">18.0% - 27.0% (Varying)</span>
              <StatusBadge status="success">Active</StatusBadge>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div>
              <div className="font-bold text-text-primary">Intra-EU B2B Reverse Charge</div>
              <div className="text-[10px] text-text-secondary">
                VIES Real-Time EIN Validation Required
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-text-primary">0.0% (Reverse Charge)</span>
              <StatusBadge status="success">Active</StatusBadge>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-variant/60 border border-border-subtle flex items-center justify-between">
            <div>
              <div className="font-bold text-text-primary">United States Nexus (Wayfair Rule)</div>
              <div className="text-[10px] text-text-secondary">
                State-level economic nexus thresholds
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-text-primary">State Dynamic Rate</span>
              <StatusBadge status="cyan">Monitored</StatusBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaxesDiscountsPage;
