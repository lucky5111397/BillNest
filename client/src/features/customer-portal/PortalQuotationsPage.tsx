import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';

export const PortalQuotationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface-lowest border border-border-subtle p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              OUTSTANDING COMMERCIAL PROPOSALS
            </div>
            <h1 className="text-xl font-bold text-text-primary font-sans mt-0.5">
              Quotations &amp; Addenda
            </h1>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-bright font-mono text-xs text-text-primary">
            1 Pending Sign-off
          </span>
        </div>

        <div className="p-4 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-3 font-mono text-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-sans font-bold text-text-primary">
                Enterprise Seat Expansion &amp; Multi-Region VAT Pack
              </div>
              <div className="text-text-secondary text-[11px]">
                QUOTE #SUB-2026-0099 • Net 15 Days
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-text-primary">$22,450.00 / yr</div>
              <div className="text-[10px] text-status-danger font-semibold">Expires in 4 days</div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <span className="text-text-secondary">
              Includes 5 additional enterprise seats &amp; EMEA tax pack
            </span>
            <SilverButton variant="primary" size="sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Accept Proposal</span>
            </SilverButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortalQuotationsPage;
