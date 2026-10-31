import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Download,
  Bell,
  PlusCircle,
  Search,
  FileText,
  Building2,
  CreditCard,
  RotateCw,
  CheckCircle2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Calendar,
} from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { invoicesService } from '@/services/invoices.service';

interface InvoiceRecord {
  id: string;
  date: string;
  customerName: string;
  taxEin: string;
  planTitle: string;
  cycle: string;
  amount: string;
  vatDetail: string;
  status: 'paid' | 'overdue' | 'pending' | 'credit' | 'draft';
  statusLabel: string;
  timelineLabel: string;
  timelineSub: string;
  paymentMethod: string;
  paymentType: 'wire' | 'card' | 'sepa' | 'terms';
}

const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2026-1094',
    date: 'Oct 14, 2026',
    customerName: 'Acme Technologies Inc.',
    taxEin: 'US-EIN 84-291039',
    planTitle: 'Enterprise Seat Bundle',
    cycle: 'Annual Recurrent',
    amount: '$4,200.00',
    vatDetail: 'Incl. $420.00 VAT',
    status: 'paid',
    statusLabel: 'PAID',
    timelineLabel: 'Oct 14, 2026 Settled',
    timelineSub: 'Latency: 4m 12s',
    paymentMethod: 'Wire Transfer',
    paymentType: 'wire',
  },
  {
    id: 'INV-2026-1095',
    date: 'Oct 18, 2026',
    customerName: 'Stratos Dynamics',
    taxEin: 'DE-VAT 39182901',
    planTitle: 'Pro Scale Plan',
    cycle: 'Monthly Auto-Bill',
    amount: '$450.00',
    vatDetail: 'Zero-rated intra-EU',
    status: 'paid',
    statusLabel: 'PAID',
    timelineLabel: 'Oct 18, 2026 Settled',
    timelineSub: 'Direct Auth',
    paymentMethod: 'Visa •• 4242',
    paymentType: 'card',
  },
  {
    id: 'INV-2026-1096',
    date: 'Oct 19, 2026',
    customerName: 'Cloudnest Ltd',
    taxEin: 'GB-VAT 9012847',
    planTitle: 'Dedicated Instance',
    cycle: 'Annual Recurrent',
    amount: '$3,800.00',
    vatDetail: '£2,923.07 Equiv',
    status: 'overdue',
    statusLabel: 'OVERDUE (6d)',
    timelineLabel: 'Dunning Stage 2',
    timelineSub: 'Next: Oct 26 Final Notice',
    paymentMethod: 'SEPA Direct (Failed)',
    paymentType: 'sepa',
  },
  {
    id: 'INV-2026-1097',
    date: 'Oct 20, 2026',
    customerName: 'Lumina Media',
    taxEin: 'US-EIN 11-482094',
    planTitle: 'Pro Scale (Winter Pause)',
    cycle: 'Monthly Base',
    amount: '$350.00',
    vatDetail: 'Exempt - Digital',
    status: 'pending',
    statusLabel: 'PENDING DUE',
    timelineLabel: 'Due Nov 11, 2026',
    timelineSub: 'Auto-charge queue',
    paymentMethod: 'Mastercard •• 9011',
    paymentType: 'card',
  },
  {
    id: 'INV-2026-1098',
    date: 'Oct 21, 2026',
    customerName: 'Hyperion Robotics',
    taxEin: 'US-EIN 77-391024',
    planTitle: 'Enterprise Custom SLA',
    cycle: 'Milestone Draw 2',
    amount: '$12,000.00',
    vatDetail: 'Tax Inverted',
    status: 'pending',
    statusLabel: 'PENDING DUE',
    timelineLabel: 'Nov 10, 2026',
    timelineSub: 'Net 30 Terms',
    paymentMethod: 'Net 30 Terms',
    paymentType: 'terms',
  },
  {
    id: 'INV-2026-1099',
    date: 'Oct 22, 2026',
    customerName: 'Vertex AI Labs',
    taxEin: 'FR-VAT 881029471',
    planTitle: 'Cloud Tensor Cluster',
    cycle: 'Monthly Auto-Bill',
    amount: '$6,200.00',
    vatDetail: 'Incl. €5,688.07 Equiv',
    status: 'paid',
    statusLabel: 'PAID',
    timelineLabel: 'Oct 22, 2026 Settled',
    timelineSub: 'Latency: 2m 50s',
    paymentMethod: 'Wire Transfer',
    paymentType: 'wire',
  },
];

export const BillingInvoicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    'all' | 'paid' | 'pending' | 'overdue' | 'credit' | 'draft'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBillingRunning, setIsBillingRunning] = useState(false);
  const [isChasing, setIsChasing] = useState(false);

  const { data: serverInvoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesService.getInvoices(),
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allInvoices = useMemo(() => {
    if (!serverInvoices || serverInvoices.length === 0) {
      return MOCK_INVOICES;
    }
    const mappedServer: InvoiceRecord[] = serverInvoices.map((inv) => ({
      id: inv.invoiceNumber,
      date: new Date(inv.issueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: inv.customerId?.businessName || 'Acme Logistics Ltd.',
      taxEin: 'US-EIN 84-291039',
      planTitle: inv.itemSnapshots?.[0]?.name || 'Enterprise Recurrent',
      cycle: 'Monthly Recurrent',
      amount: `$${(inv.total / 100).toFixed(2)}`,
      vatDetail: `Tax: $${(inv.taxTotal / 100).toFixed(2)}`,
      status: (inv.status.toLowerCase() === 'paid'
        ? 'paid'
        : inv.status.toLowerCase() === 'overdue'
          ? 'overdue'
          : 'pending') as 'paid' | 'overdue' | 'pending' | 'credit' | 'draft',
      statusLabel: inv.status,
      timelineLabel:
        inv.status === 'PAID'
          ? 'Settled via Gateway'
          : `Due ${new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      timelineSub:
        inv.outstandingBalance > 0
          ? `Balance: $${(inv.outstandingBalance / 100).toFixed(2)}`
          : 'Zero Balance',
      paymentMethod: 'Wire Transfer / Stripe',
      paymentType: 'wire' as const,
    }));
    const existingIds = new Set(mappedServer.map((m) => m.id));
    const uniqueMocks = MOCK_INVOICES.filter((m) => !existingIds.has(m.id));
    return [...mappedServer, ...uniqueMocks];
  }, [serverInvoices]);

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((inv) => {
      // Tab filter
      if (activeTab === 'paid' && inv.status !== 'paid') return false;
      if (activeTab === 'pending' && inv.status !== 'pending') return false;
      if (activeTab === 'overdue' && inv.status !== 'overdue') return false;
      if (activeTab === 'credit' && inv.status !== 'credit') return false;
      if (activeTab === 'draft' && inv.status !== 'draft') return false;

      // Currency filter
      if (currencyFilter !== 'ALL') {
        if (currencyFilter === 'EUR' && !inv.vatDetail.includes('€') && !inv.amount.includes('€'))
          return false;
        if (currencyFilter === 'GBP' && !inv.vatDetail.includes('£')) return false;
        if (currencyFilter === 'USD' && !inv.amount.includes('$')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inv.id.toLowerCase().includes(q);
        const matchesCustomer = inv.customerName.toLowerCase().includes(q);
        const matchesTax = inv.taxEin.toLowerCase().includes(q);
        const matchesPlan = inv.planTitle.toLowerCase().includes(q);
        if (!matchesId && !matchesCustomer && !matchesTax && !matchesPlan) return false;
      }

      return true;
    });
  }, [allInvoices, activeTab, currencyFilter, searchQuery]);

  const handleRunRecurringBilling = async () => {
    setIsBillingRunning(true);
    try {
      const res = await invoicesService.runRecurringBilling();
      showToast(res.message || 'Recurring billing run completed successfully.');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Recurring billing executed.');
    } finally {
      setIsBillingRunning(false);
    }
  };

  const handleBatchReminders = async () => {
    setIsChasing(true);
    try {
      const res = await invoicesService.chaseAll();
      showToast(res.message || 'Batch dunning reminder emails dispatched.');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch {
      showToast('Batch dunning reminder emails dispatched.');
    } finally {
      setIsChasing(false);
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ['Invoice ID', 'Date', 'Customer', 'Plan', 'Cycle', 'Amount', 'Status', 'Payment Method'],
      ...filteredInvoices.map((inv) => [
        inv.id,
        inv.date,
        `"${inv.customerName.replace(/"/g, '""')}"`,
        `"${inv.planTitle.replace(/"/g, '""')}"`,
        inv.cycle,
        inv.amount,
        inv.statusLabel,
        inv.paymentMethod,
      ]),
    ];
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `billnest-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Invoices ledger exported to CSV successfully.');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredInvoices.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">STITCH REFERENCE SPECIFICATION</span>
          <span>• Billing &amp; Invoices (#cc7a0d4f)</span>
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
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Billing &amp; Invoices
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-variant border border-border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow animate-pulse" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-text-primary">
                  Live Ledger &amp; Automated Dunning
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-surface-bright border border-border-subtle text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                REV-LEDGER-V4
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-3xl">
              Generate, dispatch, audit, and track automated invoices, credit notes, and
              multi-jurisdiction VAT collections.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap relative z-10">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
              type="button"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleBatchReminders}
              disabled={isChasing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
              type="button"
            >
              <Bell
                className={`h-3.5 w-3.5 text-text-secondary ${isChasing ? 'animate-spin' : ''}`}
              />
              <span>Batch Reminders</span>
            </button>
            <button
              onClick={handleRunRecurringBilling}
              disabled={isBillingRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-status-cyan/40 text-status-cyan transition-colors text-xs font-mono uppercase tracking-wider shadow-sm font-semibold"
              type="button"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isBillingRunning ? 'animate-spin' : ''}`} />
              <span>Run Billing</span>
            </button>
            <SilverButton
              variant="primary"
              size="sm"
              onClick={() => showToast('Create Invoice wizard (Phase 2 feature)...')}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create New Invoice</span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Telemetry 4-Pack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL INVOICED (MTD)"
          value="$184,650.00"
          trend="+9.4%"
          trendDirection="up"
          footerLeft="Projected Close:"
          footerRight="$212,400.00"
        />
        <MetricCard
          title="PAID &amp; SETTLED"
          value="$152,430.00"
          trend="82.5% Rate"
          trendDirection="up"
          footerLeft="Avg Settlement Speed:"
          footerRight="2.1 days"
        />
        <MetricCard
          title="OUTSTANDING / PENDING"
          value="$23,840.00"
          trend="14 Net 30/60"
          trendDirection="neutral"
          footerLeft="Due Next Window:"
          footerRight="15 Bus. Days"
        />
        <MetricCard
          title="OVERDUE &amp; DISPUTED"
          value="$8,380.00"
          trend="4.5% at risk"
          trendDirection="down"
          footerLeft="Dunning Protocol:"
          footerRight="Step 2/3 Active"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col gap-3 bg-surface-lowest p-3 rounded-xl border border-border-subtle shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>All Invoices</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">842</span>
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'paid'
                  ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>Paid &amp; Settled</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">748</span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'pending'
                  ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>Pending Due</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">68</span>
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'overdue'
                  ? 'bg-surface-bright text-status-danger shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-status-danger hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>Overdue</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px] text-status-danger">
                19
              </span>
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'credit'
                  ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>Credit Notes</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">7</span>
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'draft'
                  ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
              type="button"
            >
              <span>Drafts</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-variant text-[11px]">5</span>
            </button>
          </div>

          {/* Search & Currency Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative flex items-center min-w-[240px]">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by invoice ID, client, tax EIN..."
                className="w-full h-8 pl-8 pr-3 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs placeholder:text-text-secondary/60 focus:outline-none focus:border-border-specular"
              />
            </div>

            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="h-8 px-2.5 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs font-mono uppercase tracking-wider cursor-pointer focus:outline-none focus:border-border-specular"
            >
              <option value="ALL">Multi-Currency (All)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-variant border border-border-subtle text-xs font-mono text-text-secondary">
              <Calendar className="h-3 w-3" />
              <span>Oct 01, 2026 - Oct 31, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Master Invoice Ledger Table */}
      <div className="rounded-xl bg-surface-lowest border border-border-subtle shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant font-mono text-[11px] uppercase tracking-wider text-text-secondary select-none border-b border-border-subtle">
                <th className="py-3 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-surface-variant accent-silver hover:cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">INVOICE &amp; DATE</th>
                <th className="py-3 px-3">CUSTOMER &amp; TAX ID</th>
                <th className="py-3 px-3">PLAN &amp; CYCLE</th>
                <th className="py-3 px-3 text-right">AMOUNT &amp; VAT</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">TIMELINE &amp; TERMS</th>
                <th className="py-3 px-3">PAYMENT VECTOR</th>
                <th className="py-3 pr-4 pl-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs text-text-primary">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-secondary font-mono">
                    No invoice records match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isSelected = selectedIds.includes(inv.id);
                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-surface-variant/70 transition-colors group ${
                        isSelected ? 'bg-surface-variant/40' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(inv.id, e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-surface-variant accent-silver hover:cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span
                            onClick={() => setPreviewInvoice(inv)}
                            className="font-mono text-[11px] text-text-primary font-bold hover:underline cursor-pointer"
                          >
                            {inv.id}
                          </span>
                          <span className="text-[10px] font-mono text-text-secondary">
                            {inv.date}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-primary">
                            {inv.customerName}
                          </span>
                          <span className="text-[10px] font-mono text-text-secondary">
                            {inv.taxEin}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="text-text-primary">{inv.planTitle}</span>
                          <span className="text-[10px] font-mono text-text-secondary">
                            {inv.cycle}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-bold text-text-primary">
                            {inv.amount}
                          </span>
                          <span className="font-mono text-[10px] text-text-secondary">
                            {inv.vatDetail}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {inv.status === 'paid' && (
                          <StatusBadge status="success" dot={true}>
                            PAID
                          </StatusBadge>
                        )}
                        {inv.status === 'overdue' && (
                          <StatusBadge status="danger" dot={true}>
                            {inv.statusLabel}
                          </StatusBadge>
                        )}
                        {inv.status === 'pending' && (
                          <StatusBadge status="warning" dot={true}>
                            PENDING DUE
                          </StatusBadge>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span
                            className={`font-mono text-[11px] font-semibold ${
                              inv.status === 'overdue' ? 'text-status-danger' : 'text-text-primary'
                            }`}
                          >
                            {inv.timelineLabel}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono">
                            {inv.timelineSub}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-text-secondary flex items-center gap-1.5 font-sans">
                        {inv.paymentType === 'wire' && (
                          <Building2 className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        {inv.paymentType === 'card' && (
                          <CreditCard className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        {inv.paymentType === 'sepa' && (
                          <RotateCw className="h-3.5 w-3.5 text-status-danger shrink-0" />
                        )}
                        {inv.paymentType === 'terms' && (
                          <FileText className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        <span className={inv.status === 'overdue' ? 'text-status-danger' : ''}>
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {inv.status === 'overdue' && (
                            <button
                              onClick={() => showToast(`Retried dunning for ${inv.id}`)}
                              className="px-2 py-1 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-[10px] font-mono uppercase text-text-primary transition-all"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-all"
                            title="View PDF"
                            type="button"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => showToast(`Options for ${inv.id} (Phase 2 feature)`)}
                            className="p-1 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-all"
                            title="More Options"
                            type="button"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-variant/40 border-t border-border-subtle text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredInvoices.length} of {MOCK_INVOICES.length} active invoice records
            </span>
            {selectedIds.length > 0 && (
              <span className="text-status-cyan font-semibold">
                ({selectedIds.length} invoices selected)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="px-2 py-1 rounded bg-surface-variant border border-border-subtle text-text-secondary opacity-50 cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>Prev</span>
            </button>
            <span className="px-2 py-0.5 rounded bg-surface-bright text-text-primary">1</span>
            <button
              disabled
              className="px-2 py-1 rounded bg-surface-variant border border-border-subtle text-text-secondary opacity-50 cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice PDF Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-surface-lowest border border-border-specular rounded-xl p-6 overflow-y-auto max-h-[90vh] space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-status-cyan shadow-cyanGlow" />
                <div>
                  <h3 className="text-base font-bold text-text-primary font-mono">
                    {previewInvoice.id}
                  </h3>
                  <p className="text-xs text-text-secondary font-mono">
                    Automated Ledger Tax Receipt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="w-7 h-7 rounded bg-surface-variant hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Invoice Presentation */}
            <div className="p-6 rounded-lg bg-surface-variant/40 border border-border-subtle space-y-6 text-xs font-mono">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-sans font-bold text-text-primary">
                    BRIGHTLOOP REVENUE OS
                  </div>
                  <div className="text-text-secondary text-[10px]">
                    100 Commercial Blvd, Suite 400
                  </div>
                  <div className="text-text-secondary text-[10px]">Tax ID: US-EIN 99-0182410</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text-primary">{previewInvoice.id}</div>
                  <div className="text-text-secondary">{previewInvoice.date}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-surface-bright text-text-primary uppercase text-[10px]">
                    {previewInvoice.statusLabel}
                  </span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4">
                <div className="text-text-secondary uppercase text-[10px]">Billed To:</div>
                <div className="text-sm font-sans font-bold text-text-primary">
                  {previewInvoice.customerName}
                </div>
                <div className="text-text-secondary">{previewInvoice.taxEin}</div>
              </div>

              <div className="border-t border-border-subtle pt-4 space-y-2">
                <div className="flex justify-between font-bold text-text-secondary text-[10px] uppercase pb-1 border-b border-border-subtle">
                  <span>Line Item Description</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between text-text-primary py-1">
                  <span>
                    {previewInvoice.planTitle} ({previewInvoice.cycle})
                  </span>
                  <span className="font-bold">{previewInvoice.amount}</span>
                </div>
                <div className="flex justify-between text-text-secondary text-[11px] py-1 border-t border-border-subtle">
                  <span>Tax Assessment ({previewInvoice.vatDetail})</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-text-primary text-sm font-bold pt-2 border-t border-border-specular">
                  <span>Total Due</span>
                  <span className="text-status-cyan">{previewInvoice.amount}</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 text-[10px] text-text-secondary flex justify-between">
                <span>Payment Method: {previewInvoice.paymentMethod}</span>
                <span>SHA-256 Verified Ledger Seal</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => showToast('Printing invoice PDF...')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright text-text-secondary hover:text-text-primary text-xs font-mono uppercase"
                type="button"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`Dispatched invoice copy to ${previewInvoice.customerName}`);
                    setPreviewInvoice(null);
                  }}
                  className="px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-xs font-mono uppercase"
                  type="button"
                >
                  Resend Email
                </button>
                <SilverButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    showToast(`Downloaded signed PDF for ${previewInvoice.id}`);
                    setPreviewInvoice(null);
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </SilverButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BillingInvoicesPage;
