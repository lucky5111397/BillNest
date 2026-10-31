import React from 'react';
import { Download, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const PortalInvoicesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface-lowest border border-border-subtle p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              HISTORICAL BILLING &amp; RECEIPTS
            </div>
            <h1 className="text-xl font-bold text-text-primary font-sans mt-0.5">
              Invoices &amp; Tax Documents
            </h1>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-xs font-mono uppercase text-text-secondary hover:text-text-primary">
            <Download className="h-3.5 w-3.5" />
            <span>Download All ZIP</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-variant text-[10px] uppercase text-text-secondary border-b border-border-subtle">
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Plan / Description</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              <tr className="hover:bg-surface-variant/40 transition-colors">
                <td className="py-3 px-3 font-bold text-text-primary">INV-2026-1089</td>
                <td className="py-3 px-3 text-text-secondary">01 Oct 2026</td>
                <td className="py-3 px-3 text-text-primary">Monthly Pro Plan (10 seats)</td>
                <td className="py-3 px-3 text-right font-bold text-text-primary">$19,598.00</td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge status="success">PAID</StatusBadge>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="text-text-secondary hover:text-text-primary">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-variant/40 transition-colors">
                <td className="py-3 px-3 font-bold text-text-primary">INV-2026-1025</td>
                <td className="py-3 px-3 text-text-secondary">01 Sep 2026</td>
                <td className="py-3 px-3 text-text-primary">Starter Monthly Core</td>
                <td className="py-3 px-3 text-right font-bold text-text-primary">$590.00</td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge status="success">PAID</StatusBadge>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="text-text-secondary hover:text-text-primary">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PortalInvoicesPage;
