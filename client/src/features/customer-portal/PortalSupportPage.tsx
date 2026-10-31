import React from 'react';
import { Headphones, Mail, MessageSquare } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';

export const PortalSupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface-lowest border border-border-subtle p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              CUSTOMER ASSISTANCE &amp; TICKETS
            </div>
            <h1 className="text-xl font-bold text-text-primary font-sans mt-0.5">
              Support &amp; Account Governance
            </h1>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-bright font-mono text-xs text-status-cyan">
            Priority Tier Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-status-cyan" />
              <span className="font-bold text-text-primary text-sm">Dedicated Billing Rep</span>
            </div>
            <p className="text-text-secondary text-[11px] font-sans">
              Connect directly with Jordan Vance for volume seat quotes, contract extensions, or
              custom tax exemptions.
            </p>
            <SilverButton variant="primary" size="sm" className="mt-2">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Billing Rep</span>
            </SilverButton>
          </div>

          <div className="p-4 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-text-primary" />
              <span className="font-bold text-text-primary text-sm">Open Support Ticket</span>
            </div>
            <p className="text-text-secondary text-[11px] font-sans">
              Submit technical or invoice discrepancy reports directly into our high-priority
              customer queue.
            </p>
            <button className="px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary uppercase text-xs mt-2">
              Create New Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortalSupportPage;
