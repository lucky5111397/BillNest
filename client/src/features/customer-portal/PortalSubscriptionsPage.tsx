import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const PortalSubscriptionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface-lowest border border-border-subtle p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              SELF-SERVICE SUBSCRIPTION MANAGEMENT
            </div>
            <h1 className="text-xl font-bold text-text-primary font-sans mt-0.5">
              Active Recurring Plans &amp; Licenses
            </h1>
          </div>
          <StatusBadge status="success" dot={true}>
            1 Active Subscription
          </StatusBadge>
        </div>

        <div className="p-4 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-3 font-mono text-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-sans font-bold text-text-primary">Monthly Pro Plan</div>
              <div className="text-text-secondary text-[11px]">
                ID: SUB-2026-0084 • Standard Core
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-text-primary">$19,598.00</div>
              <div className="text-[10px] text-text-secondary uppercase">per billing cycle</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border-subtle text-[11px]">
            <div>
              <span className="text-text-secondary block">Start Date:</span>
              <span className="text-text-primary font-semibold">01 Oct 2026</span>
            </div>
            <div>
              <span className="text-text-secondary block">Next Renewal:</span>
              <span className="text-text-primary font-semibold">01 Nov 2026</span>
            </div>
            <div>
              <span className="text-text-secondary block">Active Seats:</span>
              <span className="text-text-primary font-semibold">10 Deployed</span>
            </div>
            <div>
              <span className="text-text-secondary block">Auto-Debit:</span>
              <span className="text-text-primary font-semibold">Enabled (ACH)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortalSubscriptionsPage;
