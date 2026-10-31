import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  PlusCircle,
  FileText,
  Search,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  RotateCw,
  Building2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { subscriptionsService } from '@/services/subscriptions.service';

interface ContractRecord {
  id: string;
  type: 'subscription' | 'quote';
  customerName: string;
  customerDomain: string;
  avatarLetter: string;
  planTier: string;
  cycle: 'Annual' | 'Monthly' | 'Quarterly';
  contractValue: string;
  periodLabel: string;
  status: 'active' | 'expiring' | 'paused' | 'quoted';
  renewalDate: string;
  daysRemaining?: string;
  settlementMethod: string;
  settlementIcon: 'wire' | 'card' | 'sepa' | 'invoice';
}

const MOCK_CONTRACTS: ContractRecord[] = [
  {
    id: 'SUB-2026-8841',
    type: 'subscription',
    customerName: 'Acme Technologies Inc.',
    customerDomain: 'acme-core.corp',
    avatarLetter: 'A',
    planTier: 'Enterprise Annual',
    cycle: 'Annual',
    contractValue: '$2,400.00',
    periodLabel: '/yr',
    status: 'active',
    renewalDate: 'Nov 14, 2026',
    settlementMethod: 'Wire Transfer',
    settlementIcon: 'wire',
  },
  {
    id: 'SUB-2026-8842',
    type: 'subscription',
    customerName: 'Stratos Dynamics',
    customerDomain: 'stratos.io',
    avatarLetter: 'S',
    planTier: 'Pro Scale Monthly',
    cycle: 'Monthly',
    contractValue: '$450.00',
    periodLabel: '/mo',
    status: 'active',
    renewalDate: 'Oct 31, 2026',
    settlementMethod: 'Visa •••• 4019',
    settlementIcon: 'card',
  },
  {
    id: 'SUB-2026-8843',
    type: 'subscription',
    customerName: 'Cloudnest Ltd',
    customerDomain: 'cloudnest-systems.eu',
    avatarLetter: 'C',
    planTier: 'Enterprise Annual',
    cycle: 'Annual',
    contractValue: '$3,800.00',
    periodLabel: '/yr',
    status: 'expiring',
    renewalDate: 'Oct 25, 2026',
    daysRemaining: '6d',
    settlementMethod: 'SEPA Direct Debit',
    settlementIcon: 'sepa',
  },
  {
    id: 'SUB-2026-8844',
    type: 'subscription',
    customerName: 'Lumina Media',
    customerDomain: 'lumina.studio',
    avatarLetter: 'L',
    planTier: 'Pro Scale Monthly',
    cycle: 'Monthly',
    contractValue: '$350.00',
    periodLabel: '/mo',
    status: 'paused',
    renewalDate: 'Dec 01, 2026',
    settlementMethod: 'Mastercard •••• 9921',
    settlementIcon: 'card',
  },
  {
    id: 'QUO-2026-0412',
    type: 'quote',
    customerName: 'Hyperion Robotics',
    customerDomain: 'hyperion.ai',
    avatarLetter: 'H',
    planTier: 'Enterprise Custom',
    cycle: 'Annual',
    contractValue: '$12,000.00',
    periodLabel: '/yr',
    status: 'quoted',
    renewalDate: 'Awaiting Sign-off',
    settlementMethod: 'Net 30 Invoicing',
    settlementIcon: 'invoice',
  },
  {
    id: 'SUB-2026-8845',
    type: 'subscription',
    customerName: 'Vertex AI Labs',
    customerDomain: 'vertexlabs.tech',
    avatarLetter: 'V',
    planTier: 'Pro Scale Annual',
    cycle: 'Annual',
    contractValue: '$5,400.00',
    periodLabel: '/yr',
    status: 'active',
    renewalDate: 'Dec 15, 2026',
    settlementMethod: 'Wire Transfer',
    settlementIcon: 'wire',
  },
];

export const SubscriptionsQuotesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'quotes' | 'renewals' | 'paused'>(
    'all',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCycle, setSelectedCycle] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ContractRecord | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const { data: serverSubscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsService.getSubscriptions(),
  });

  const showTemporaryNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const allContracts = useMemo(() => {
    if (!serverSubscriptions || serverSubscriptions.length === 0) {
      return MOCK_CONTRACTS;
    }
    const mapped: ContractRecord[] = serverSubscriptions.map((sub) => ({
      id: sub.subscriptionNumber,
      type: 'subscription',
      customerName: sub.customerId?.businessName || 'Acme Logistics Ltd.',
      customerDomain: 'acme.enterprise',
      avatarLetter: (sub.customerId?.businessName || 'A')[0].toUpperCase(),
      planTier: sub.planId?.name || 'Enterprise Scale',
      cycle: sub.billingInterval === 'YEARLY' ? 'Annual' : 'Monthly',
      contractValue: `$${((sub.unitPrice * sub.quantity) / 100).toFixed(2)}`,
      periodLabel: sub.billingInterval === 'YEARLY' ? '/yr' : '/mo',
      status:
        sub.status.toLowerCase() === 'active'
          ? 'active'
          : sub.status.toLowerCase() === 'paused'
            ? 'paused'
            : 'active',
      renewalDate: new Date(sub.nextBillingAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      settlementMethod: 'Wire / Card',
      settlementIcon: 'wire' as const,
    }));
    const existingIds = new Set(mapped.map((m) => m.id));
    const uniqueMocks = MOCK_CONTRACTS.filter((m) => !existingIds.has(m.id));
    return [...mapped, ...uniqueMocks];
  }, [serverSubscriptions]);

  // Filter records based on active criteria
  const filteredContracts = useMemo(() => {
    return allContracts.filter((record) => {
      // Tab filter
      if (activeTab === 'active' && record.status !== 'active') return false;
      if (activeTab === 'quotes' && record.status !== 'quoted') return false;
      if (activeTab === 'renewals' && record.status !== 'expiring') return false;
      if (activeTab === 'paused' && record.status !== 'paused') return false;

      // Status dropdown filter
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'ACTIVE' && record.status !== 'active') return false;
        if (selectedStatus === 'EXPIRING' && record.status !== 'expiring') return false;
        if (selectedStatus === 'QUOTED' && record.status !== 'quoted') return false;
        if (selectedStatus === 'PAUSED' && record.status !== 'paused') return false;
      }

      // Cycle dropdown filter
      if (selectedCycle !== 'ALL' && record.cycle !== selectedCycle) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = record.id.toLowerCase().includes(query);
        const matchesName = record.customerName.toLowerCase().includes(query);
        const matchesPlan = record.planTier.toLowerCase().includes(query);
        const matchesDomain = record.customerDomain.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesPlan && !matchesDomain) return false;
      }

      return true;
    });
  }, [allContracts, activeTab, selectedStatus, selectedCycle, searchQuery]);

  const handleExportCsv = () => {
    const rows = [
      ['Contract ID', 'Customer', 'Plan Tier', 'Cycle', 'Value', 'Status', 'Renewal Date'],
      ...filteredContracts.map((c) => [
        c.id,
        `"${c.customerName.replace(/"/g, '""')}"`,
        `"${c.planTier.replace(/"/g, '""')}"`,
        c.cycle,
        c.contractValue,
        c.status,
        c.renewalDate,
      ]),
    ];
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `billnest-contracts-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showTemporaryNotice('Contracts ledger exported to CSV successfully.');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredContracts.map((c) => c.id));
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
          <span>• Subscriptions &amp; Quotes Management (#175ac2b4)</span>
        </div>
        <span className="text-[10px] uppercase text-text-secondary">Visual Foundation Preview</span>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-12 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-bright border border-border-specular shadow-2xl text-xs font-mono text-text-primary animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Action Header Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-lowest p-6 shadow-2xl border border-border-subtle">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Subscriptions &amp; Quotes
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-variant border border-border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow animate-pulse" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-text-primary">
                  LIVE LEDGER
                </span>
              </div>
              <div className="px-2 py-0.5 rounded bg-surface-variant text-[11px] font-mono text-text-secondary border border-border-subtle">
                SYNC: T-0.12s
              </div>
            </div>
            <p className="text-xs text-text-secondary max-w-2xl">
              Manage customer recurring contracts, draft quotes, renewal schedules, and lifecycle
              status across unified enterprise billing ledgers.
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
              onClick={() =>
                showTemporaryNotice('Initiating quote creation wizard (Phase 2 feature)...')
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
              type="button"
            >
              <FileText className="h-3.5 w-3.5 text-text-secondary" />
              <span>Create Quote</span>
            </button>
            <SilverButton
              variant="primary"
              size="sm"
              onClick={() =>
                showTemporaryNotice('New Subscription draft modal (Phase 2 feature)...')
              }
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Subscription</span>
            </SilverButton>
          </div>
        </div>
      </div>

      {/* Telemetry 4-Pack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL SUBSCRIPTIONS"
          value="2,450"
          trend="+98.4% uptime"
          trendDirection="up"
          footerLeft="ACT 1,842 • PAUSE 48"
          footerRight="TRIAL 160"
        />
        <MetricCard
          title="AVG CONTRACT VALUE (ACV)"
          value="$1,820"
          valueSubtext="/yr"
          trend="+4.2% MoM"
          trendDirection="up"
          footerLeft="Target: $1,750/yr"
          footerRight="+$70 Alpha"
        />
        <MetricCard
          title="RENEWAL WINDOW (30D)"
          value="128"
          valueSubtext="Contracts"
          trend="$46,200 ARR"
          trendDirection="neutral"
          footerLeft="At Risk Window"
          footerRight="Next 26 days"
        />
        <MetricCard
          title="OPEN QUOTATIONS"
          value="19"
          valueSubtext="Pending"
          trend="87% Win-Rate"
          trendDirection="up"
          footerLeft="Pipeline ARR"
          footerRight="$38,400"
        />
      </div>

      {/* Operational Filter Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface-lowest p-3 rounded-xl border border-border-subtle shadow-lg">
        {/* Tab Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            ALL <span className="ml-1 opacity-80">(2,450)</span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'active'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            ACTIVE <span className="ml-1 opacity-80">(1,842)</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'quotes'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            QUOTES &amp; DRAFTS <span className="ml-1 opacity-80">(19)</span>
          </button>
          <button
            onClick={() => setActiveTab('renewals')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'renewals'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            RENEWALS <span className="ml-1 opacity-80">(128)</span>
          </button>
          <button
            onClick={() => setActiveTab('paused')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'paused'
                ? 'bg-surface-bright text-text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
            }`}
            type="button"
          >
            PAUSED <span className="ml-1 opacity-80">(48)</span>
          </button>
        </div>

        {/* Filter Fields */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Search Input */}
          <div className="relative flex items-center min-w-[220px]">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, ID, plan..."
              className="w-full h-8 pl-8 pr-3 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs placeholder:text-text-secondary/60 focus:outline-none focus:border-border-specular"
            />
          </div>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2.5 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs font-mono uppercase tracking-wider cursor-pointer focus:outline-none focus:border-border-specular"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active Only</option>
            <option value="EXPIRING">Expiring Soon</option>
            <option value="QUOTED">Quoted</option>
            <option value="PAUSED">Paused</option>
          </select>

          {/* Cycle Select */}
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="h-8 px-2.5 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs font-mono uppercase tracking-wider cursor-pointer focus:outline-none focus:border-border-specular"
          >
            <option value="ALL">Cycle: All Cycles</option>
            <option value="Annual">Annual Only</option>
            <option value="Monthly">Monthly Only</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('ALL');
              setSelectedCycle('ALL');
              setActiveTab('all');
            }}
            title="Reset Filters"
            className="w-8 h-8 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            type="button"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Master Contracts Ledger Table */}
      <div className="rounded-xl bg-surface-lowest border border-border-subtle shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant font-mono text-[11px] uppercase tracking-wider text-text-secondary select-none border-b border-border-subtle">
                <th className="py-3 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredContracts.length &&
                      filteredContracts.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-surface-variant accent-silver hover:cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">RECORD ID</th>
                <th className="py-3 px-3">CUSTOMER &amp; ACCOUNT</th>
                <th className="py-3 px-3">PLAN TIER</th>
                <th className="py-3 px-3 text-right">CONTRACT VALUE</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">RENEWAL / EXPIRY</th>
                <th className="py-3 px-3">SETTLEMENT METHOD</th>
                <th className="py-3 pr-4 pl-2 text-right">COMMAND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs text-text-primary">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-secondary font-mono">
                    No contracts or quotations match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => {
                  const isSelected = selectedIds.includes(contract.id);
                  return (
                    <tr
                      key={contract.id}
                      className={`hover:bg-surface-variant/70 transition-colors group ${
                        isSelected ? 'bg-surface-variant/40' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(contract.id, e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-surface-variant accent-silver hover:cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-text-secondary group-hover:text-text-primary font-semibold">
                        {contract.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-surface-bright border border-border-subtle flex items-center justify-center font-mono text-xs font-bold text-text-primary">
                            {contract.avatarLetter}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary leading-tight">
                              {contract.customerName}
                            </span>
                            <span className="text-[10px] font-mono text-text-secondary">
                              {contract.customerDomain}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-surface-variant border border-border-subtle text-[11px] font-mono text-text-secondary uppercase">
                          {contract.planTier}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                        {contract.contractValue}
                        <span className="text-text-secondary font-normal text-[10px]">
                          {contract.periodLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {contract.status === 'active' && (
                          <StatusBadge status="success" dot={true}>
                            ACTIVE
                          </StatusBadge>
                        )}
                        {contract.status === 'expiring' && (
                          <StatusBadge status="cyan" dot={true}>
                            EXPIRING SOON
                          </StatusBadge>
                        )}
                        {contract.status === 'paused' && (
                          <StatusBadge status="neutral" dot={false}>
                            PAUSED
                          </StatusBadge>
                        )}
                        {contract.status === 'quoted' && (
                          <StatusBadge status="warning" dot={true}>
                            QUOTED
                          </StatusBadge>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">
                        {contract.renewalDate}
                        {contract.daysRemaining && (
                          <span className="ml-1 text-status-cyan font-bold">
                            ({contract.daysRemaining})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-text-secondary flex items-center gap-1.5 font-sans">
                        {contract.settlementIcon === 'wire' && (
                          <Building2 className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        {contract.settlementIcon === 'card' && (
                          <CreditCard className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        {contract.settlementIcon === 'sepa' && (
                          <RotateCw className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        {contract.settlementIcon === 'invoice' && (
                          <FileText className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        )}
                        <span className="truncate">{contract.settlementMethod}</span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedRecord(contract)}
                            className="w-7 h-7 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                            title="View Contract Telemetry"
                            type="button"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              showTemporaryNotice(
                                `Contract actions for ${contract.id} (Phase 2 feature)`,
                              )
                            }
                            className="w-7 h-7 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
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

        {/* Ledger Footer & Pagination Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-variant/40 border-t border-border-subtle text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredContracts.length} of {MOCK_CONTRACTS.length} active ledger records
            </span>
            {selectedIds.length > 0 && (
              <span className="text-status-cyan font-semibold">
                ({selectedIds.length} contracts selected)
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

      {/* Contract Detail Drawer / Modal Preview */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-surface-lowest border-l border-border-specular p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                  CONTRACT TELEMETRY INSPECTOR
                </span>
                <h3 className="text-lg font-bold text-text-primary font-mono">
                  {selectedRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded bg-surface-variant hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-2">
                <div className="text-text-secondary uppercase text-[10px]">Customer Profile</div>
                <div className="text-sm font-sans font-bold text-text-primary">
                  {selectedRecord.customerName}
                </div>
                <div className="text-text-secondary">{selectedRecord.customerDomain}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1">
                  <div className="text-text-secondary uppercase text-[10px]">Plan Tier</div>
                  <div className="font-semibold text-text-primary">{selectedRecord.planTier}</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1">
                  <div className="text-text-secondary uppercase text-[10px]">Contract Value</div>
                  <div className="font-semibold text-status-cyan">
                    {selectedRecord.contractValue}
                    {selectedRecord.periodLabel}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1">
                  <div className="text-text-secondary uppercase text-[10px]">Settlement Method</div>
                  <div className="font-semibold text-text-primary">
                    {selectedRecord.settlementMethod}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1">
                  <div className="text-text-secondary uppercase text-[10px]">Renewal Date</div>
                  <div className="font-semibold text-text-primary">
                    {selectedRecord.renewalDate}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-2">
                <div className="text-text-secondary uppercase text-[10px]">Ledger Status</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-success shadow-successGlow" />
                  <span className="text-text-primary font-semibold uppercase">
                    {selectedRecord.status}
                  </span>
                  <span className="text-text-secondary">• Auto-Dunning Protocol Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center gap-2">
              <button
                onClick={() => {
                  showTemporaryNotice(`Initiated contract amendment for ${selectedRecord.id}`);
                  setSelectedRecord(null);
                }}
                className="flex-1 py-2 rounded bg-surface-bright hover:bg-surface-high border border-border-subtle text-text-primary text-xs font-mono uppercase tracking-wider transition-colors"
                type="button"
              >
                Amend Contract
              </button>
              <SilverButton
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  showTemporaryNotice(`Executed early renewal for ${selectedRecord.id}`);
                  setSelectedRecord(null);
                }}
              >
                Renew Contract
              </SilverButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubscriptionsQuotesPage;
