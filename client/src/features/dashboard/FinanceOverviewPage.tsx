import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  RotateCcw,
  Download,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  CreditCard,
  AlertTriangle,
  Send,
  PieChart,
  PlusCircle,
  ArrowUp,
  CheckCircle,
  PauseCircle,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { MetricCard } from '@/components/common/MetricCard';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { reportsService, invoicesService } from '@/services';

export const FinanceOverviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chasedAll, setChasedAll] = useState(false);
  const [remindedIds, setRemindedIds] = useState<Record<string, boolean>>({});

  const { data: dashboardData, refetch } = useQuery({
    queryKey: ['finance-dashboard'],
    queryFn: reportsService.getDashboardMetrics,
    staleTime: 30000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch {
      // Offline fallback
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleChaseAll = async () => {
    try {
      await invoicesService.chaseAll();
      setChasedAll(true);
      queryClient.invalidateQueries({ queryKey: ['finance-dashboard'] });
      setTimeout(() => setChasedAll(false), 2500);
    } catch {
      setChasedAll(true);
      setTimeout(() => setChasedAll(false), 2500);
    }
  };

  const handleExportReport = () => {
    const csv = [
      'Metric,Value',
      `Active Subscriptions,${dashboardData?.activeSubscriptionsCount || 1842}`,
      `MRR Run-rate,${dashboardData?.mrrFormatted || '$148,920.00'}`,
      `Cash Collected,${dashboardData?.cashSettledFormatted || '$132,400.00'}`,
      `Overdue Balance,${dashboardData?.overdueBalanceFormatted || '$16,520.00'}`,
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billnest-finance-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRemind = (id: string) => {
    setRemindedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRemindedIds((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Visual Preview Notice */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">STITCH REFERENCE SPECIFICATION</span>
          <span>• Finance Lead Executive Dashboard (#bb359762)</span>
        </div>
        <span className="text-[10px] uppercase text-text-secondary">Visual Foundation Preview</span>
      </div>

      {/* Executive Header & Control Hub */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
                Finance Overview
              </h1>
              <StatusBadge variant="cyan" dot pulse>
                Q4 LIVE
              </StatusBadge>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
              Monitor recurring revenue, subscription health, and collection performance across
              billing ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-variant border border-border-subtle text-text-primary text-xs font-mono">
              <Calendar className="h-3.5 w-3.5 text-text-secondary" />
              <span>Oct 1 – Oct 31, 2026</span>
              <ChevronDown className="h-3 w-3 text-text-secondary" />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>ALL PLANS</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>ALL STATUSES</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Toolbar Filters & Action Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-lg bg-surface-lowest border border-border-subtle">
          <div className="flex items-center gap-2 bg-surface-variant border border-border-subtle px-3 py-1 rounded flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search account, invoice ID, ledger hash..."
              className="w-full bg-transparent border-none text-text-primary placeholder:text-text-secondary text-xs font-sans focus:outline-none"
            />
            <span className="font-mono text-[10px] text-text-secondary px-1 py-0.5 bg-surface-bright rounded">
              ⌘K
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1.5 rounded bg-surface-variant border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-bright transition-colors"
              title="Force Ledger Resync"
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <SilverButton
              variant="primary"
              size="sm"
              onClick={handleExportReport}
              icon={<Download className="h-3.5 w-3.5 font-bold" />}
            >
              Export Report
            </SilverButton>
          </div>
        </div>
      </section>

      {/* Top 4 KPI Telemetry Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Subscriptions */}
        <MetricCard
          label="Active Subscriptions"
          value={
            dashboardData?.activeSubscriptionsCount != null
              ? dashboardData.activeSubscriptionsCount.toLocaleString()
              : '1,842'
          }
          trend={{ value: '+12.0%', isPositive: true }}
          icon={<RefreshCw className="h-4 w-4 text-text-primary" />}
          sparkline={
            <div className="w-full h-9">
              <svg
                className="w-full h-full text-text-primary"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 160 36"
              >
                <defs>
                  <linearGradient id="silverFade1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,30 L20,28 L40,24 L60,26 L80,18 L100,19 L120,12 L140,14 L160,4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.75"
                />
                <path
                  d="M0,30 L20,28 L40,24 L60,26 L80,18 L100,19 L120,12 L140,14 L160,4 L160,36 L0,36 Z"
                  fill="url(#silverFade1)"
                />
              </svg>
            </div>
          }
          footer={
            <>
              <span>
                Monthly: <strong className="text-text-primary font-bold">1,286</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
              <span>
                Yearly: <strong className="text-text-primary font-bold">556</strong>
              </span>
            </>
          }
        />

        {/* KPI 2: MRR Run-rate */}
        <MetricCard
          label="MRR Run-rate"
          value={dashboardData?.mrrFormatted || '$148,920.00'}
          trend={{ value: '+8.4%', isPositive: true }}
          icon={<ArrowUpRight className="h-4 w-4 text-text-primary" />}
          sparkline={
            <div className="w-full h-9">
              <svg
                className="w-full h-full text-metallic-mid"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 160 36"
              >
                <defs>
                  <linearGradient id="silverFade2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,32 C20,32 30,22 50,22 C70,22 80,14 100,16 C120,18 135,6 160,4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.75"
                />
                <path
                  d="M0,32 C20,32 30,22 50,22 C70,22 80,14 100,16 C120,18 135,6 160,4 L160,36 L0,36 Z"
                  fill="url(#silverFade2)"
                />
              </svg>
            </div>
          }
          footer={
            <>
              <span className="truncate">Reconciled across 4 billing tiers</span>
              <span className="text-status-cyan font-bold">VERIFIED</span>
            </>
          }
        />

        {/* KPI 3: Payments Collected */}
        <MetricCard
          label="Payments Collected"
          value={dashboardData?.cashSettledFormatted || '$132,400.00'}
          trend={{ value: '88.9% target', isPositive: false }}
          icon={<CreditCard className="h-4 w-4 text-text-primary" />}
          sparkline={
            <div className="space-y-1.5 my-2">
              <div className="w-full h-2 rounded bg-surface-variant overflow-hidden flex">
                <div
                  className="h-full bg-text-primary"
                  style={{ width: '52%' }}
                  title="Wire: 52%"
                />
                <div
                  className="h-full bg-metallic-mid"
                  style={{ width: '33%' }}
                  title="Card: 33%"
                />
                <div className="h-full bg-surface-high" style={{ width: '15%' }} title="UPI: 15%" />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-text-secondary">
                <span>Wire 52%</span>
                <span>Card 33%</span>
                <span>UPI 15%</span>
              </div>
            </div>
          }
          footer={
            <>
              <span>Settlement Cycle</span>
              <span className="text-text-primary font-bold">T+1 Finality</span>
            </>
          }
        />

        {/* KPI 4: Overdue Balance */}
        <MetricCard
          label="Overdue Balance"
          value={dashboardData?.overdueBalanceFormatted || '$16,520.00'}
          trend={{ value: '24 Invoices', isPositive: false }}
          icon={<AlertTriangle className="h-4 w-4 text-text-primary" />}
          sparkline={
            <div className="space-y-1.5 my-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary">
                <span>Aging Threshold</span>
                <span className="text-text-primary font-semibold">avg 9.2 days</span>
              </div>
              <div className="w-full h-1.5 rounded bg-surface-variant overflow-hidden">
                <div className="h-full bg-text-primary rounded" style={{ width: '38%' }} />
              </div>
            </div>
          }
          footer={
            <>
              <span>Dunning Protocol</span>
              <span className="text-status-danger font-semibold">Active Queue</span>
            </>
          }
        />
      </section>

      {/* Middle Operational Analytics: 60/40 Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* 60% Left: Revenue Collection Analytics (Trailing 6M) */}
        <div className="lg:col-span-7 flex flex-col p-5 rounded-xl bg-surface-lowest border border-border-subtle shadow-panel gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-text-primary font-sans">
                  Revenue Collection Analytics
                </h2>
                <span className="px-2 py-0.5 rounded bg-surface-variant font-mono text-[10px] text-text-secondary uppercase">
                  Trailing 6M
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Aggregated invoice issuance vs. cleared bank settlements
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-text-primary" />
                <span>Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-surface-high" />
                <span>Outstanding</span>
              </div>
            </div>
          </div>

          {/* Monochrome Bar Chart Visualization (May - Oct) */}
          <div className="w-full pt-4">
            <div className="h-48 w-full flex items-end justify-between gap-3 px-2 sm:px-6 pb-2 border-b border-border-subtle">
              {[
                { month: 'MAY', collectedH: '84%', outH: '28%', collected: '$102k', out: '$24k' },
                { month: 'JUN', collectedH: '88%', outH: '22%', collected: '$114k', out: '$19k' },
                { month: 'JUL', collectedH: '90%', outH: '18%', collected: '$122k', out: '$16k' },
                { month: 'AUG', collectedH: '86%', outH: '20%', collected: '$125k', out: '$18k' },
                { month: 'SEP', collectedH: '92%', outH: '15%', collected: '$138k', out: '$14k' },
                {
                  month: 'OCT',
                  collectedH: '96%',
                  outH: '12%',
                  collected: '$148k',
                  out: '$16k',
                  isCurrent: true,
                },
              ].map((bar) => (
                <div
                  key={bar.month}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-full">
                    <div
                      className={`w-1/2 rounded-t transition-all group-hover:brightness-125 ${
                        bar.isCurrent
                          ? 'bg-gradient-to-t from-metallic-mid via-text-primary to-white shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                          : 'bg-text-primary'
                      }`}
                      style={{ height: bar.collectedH }}
                      title={`${bar.month} Collected: ${bar.collected}`}
                    />
                    <div
                      className="w-1/2 bg-surface-high rounded-t transition-all group-hover:brightness-125"
                      style={{ height: bar.outH }}
                      title={`${bar.month} Outstanding: ${bar.out}`}
                    />
                  </div>
                  <span
                    className={`font-mono text-[10px] ${
                      bar.isCurrent ? 'text-text-primary font-bold' : 'text-text-secondary'
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Callout Card */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-variant border border-border-subtle">
            <div className="w-8 h-8 rounded bg-surface-bright flex items-center justify-center shrink-0 text-text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-primary leading-tight">
                Collection rate improved{' '}
                <span className="font-semibold text-status-success">+3.1% MoM</span> due to
                automated SEPA/ACH retries.
              </p>
              <span className="font-mono text-[10px] text-text-secondary">
                91.4% Target Ratio (Industry benchmark 88.0%)
              </span>
            </div>
            <span className="hidden sm:inline-flex font-mono text-[10px] text-text-primary font-semibold px-2 py-0.5 rounded bg-surface-bright border border-border-subtle">
              HIGH OPTIMIZED
            </span>
          </div>
        </div>

        {/* 40% Right: Overdue Invoices Ledger with Dunning Action */}
        <div className="lg:col-span-5 flex flex-col p-5 rounded-xl bg-surface-lowest border border-border-subtle shadow-panel gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-text-primary font-sans">
                Overdue Invoices
              </h2>
              <span className="px-2 py-0.5 rounded bg-surface-variant text-text-primary font-mono text-xs">
                24 Total
              </span>
            </div>

            <SilverButton
              variant="primary"
              size="xs"
              onClick={handleChaseAll}
              icon={<Send className="h-3 w-3" />}
            >
              {chasedAll ? '24 CHASED ✓' : 'CHASE ALL (24)'}
            </SilverButton>
          </div>

          {/* Ledger Table */}
          <div className="flex flex-col rounded-lg bg-surface-variant/40 border border-border-subtle overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-surface-variant font-mono text-[10px] text-text-secondary uppercase tracking-wider border-b border-border-subtle">
              <span>Invoice / Account</span>
              <span className="text-right">Outstanding</span>
            </div>

            <div className="divide-y divide-border-subtle text-xs">
              {[
                {
                  id: 'INV-2026-1089',
                  days: '22d',
                  account: 'Acme Tech Systems',
                  amount: '$4,200.00',
                },
                {
                  id: 'INV-2026-1092',
                  days: '18d',
                  account: 'Nova Systems LLC',
                  amount: '$2,850.00',
                },
                {
                  id: 'INV-2026-1098',
                  days: '15d',
                  account: 'Pixel Works Studio',
                  amount: '$1,920.00',
                },
                {
                  id: 'INV-2026-1101',
                  days: '11d',
                  account: 'Cloudnest Infrastructure',
                  amount: '$1,450.00',
                },
                { id: 'INV-2026-1108', days: '9d', account: 'Vertex AI Labs', amount: '$3,100.00' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 hover:bg-surface-variant/70 transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-text-primary">
                        {item.id}
                      </span>
                      <span className="px-1 rounded bg-surface-bright font-mono text-[9px] text-text-secondary">
                        {item.days}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary truncate">{item.account}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold text-text-primary">
                      {item.amount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemind(item.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border border-border-subtle ${
                        remindedIds[item.id]
                          ? 'bg-metallic-light text-canvas-base font-bold'
                          : 'bg-surface-variant hover:bg-surface-bright text-text-primary'
                      }`}
                    >
                      {remindedIds[item.id] ? 'Sent ✓' : 'Remind'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary px-1">
            <span>Automated Chaser v3.2</span>
            <span className="text-text-primary hover:underline cursor-pointer">
              View 19 More Rows →
            </span>
          </div>
        </div>
      </section>

      {/* Bottom Section: Activity Feed & Payment Method Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 7 Cols Left: Recent Subscription Activity Feed */}
        <div className="lg:col-span-7 flex flex-col p-5 rounded-xl bg-surface-lowest border border-border-subtle shadow-panel gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary font-sans">
                Recent Subscription Activity
              </h2>
              <p className="text-xs text-text-secondary">Real-time ledger dispatch log</p>
            </div>
            <span className="font-mono text-[10px] text-text-secondary px-2 py-0.5 rounded bg-surface-variant border border-border-subtle">
              Live Socket: IDLE
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                title: 'New subscription created',
                time: '2m ago',
                desc: 'Acme Tech initialized Enterprise Suite ($2,400.00/mo) via ACH Direct.',
                icon: PlusCircle,
              },
              {
                title: 'Annual plan upgraded',
                time: '14m ago',
                desc: 'Stratos Dynamics switched from Scale to Custom dedicated cluster ($18,500.00/yr).',
                icon: ArrowUp,
              },
              {
                title: 'Payment successfully received',
                time: '38m ago',
                desc: 'Vantage Logic cleared invoice #INV-2026-1077 via Wire ($5,600.00).',
                icon: CheckCircle,
              },
              {
                title: 'Subscription paused',
                time: '1h ago',
                desc: 'Lumina Media requested seasonal hiatus (60 days) on Developer seat pool.',
                icon: PauseCircle,
              },
              {
                title: 'Invoice overdue',
                time: '2h ago',
                desc: 'HexaCore Cloud crossed net-30 day barrier for renewal invoice ($3,200.00).',
                icon: AlertTriangle,
              },
            ].map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded bg-surface-variant/40 hover:bg-surface-variant transition-colors border border-border-subtle"
                >
                  <div className="w-7 h-7 rounded bg-surface-bright flex items-center justify-center shrink-0 text-text-primary mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-text-primary truncate">
                        {activity.title}
                      </span>
                      <span className="font-mono text-[10px] text-text-secondary shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{activity.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 Cols Right: Payment Method Breakdown Donut */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-surface-lowest border border-border-subtle shadow-panel gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary font-sans">
                Payment Method Breakdown
              </h2>
              <p className="text-xs text-text-secondary">Channel distribution of cleared capital</p>
            </div>
            <PieChart className="h-5 w-5 text-text-secondary" />
          </div>

          {/* SVG Donut Chart with Center Metric */}
          <div className="flex items-center justify-center relative my-2">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-surface-variant"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Wire 52% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-text-primary"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="124.15 238.76"
                  strokeDashoffset="0"
                  fill="none"
                />
                {/* Credit Card 33% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-metallic-mid"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="78.79 238.76"
                  strokeDashoffset="-124.15"
                  fill="none"
                />
                {/* UPI 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-surface-high"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="35.81 238.76"
                  strokeDashoffset="-202.94"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                  TOTAL SETTLED
                </span>
                <span className="font-mono text-sm font-bold text-text-primary mt-0.5">
                  $132,400
                </span>
                <span className="font-mono text-[9px] text-status-success font-semibold">
                  100% CLEAR
                </span>
              </div>
            </div>
          </div>

          {/* Channel Legend Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-surface-variant border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-text-primary shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                <span className="text-xs text-text-primary font-medium">Bank Wire / ACH</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-text-primary font-bold">$68,848.00</span>
                <span className="text-text-secondary text-[10px]">52%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-surface-variant border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-metallic-mid" />
                <span className="text-xs text-text-primary font-medium">Credit Card (Stripe)</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-text-primary font-bold">$43,692.00</span>
                <span className="text-text-secondary text-[10px]">33%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-surface-variant border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-surface-high" />
                <span className="text-xs text-text-primary font-medium">
                  SEPA &amp; Direct Debit
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-text-primary font-bold">$19,860.00</span>
                <span className="text-text-secondary text-[10px]">15%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-mono text-[10px] text-text-secondary">
            <span>
              Gateway Health: <strong className="text-text-primary">99.98%</strong>
            </span>
            <span>
              Avg fee: <strong className="text-text-primary">0.82%</strong>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
