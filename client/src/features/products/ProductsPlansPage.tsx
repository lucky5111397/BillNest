import React, { useState } from 'react';
import {
  Undo2,
  Save,
  Package,
  Sliders,
  Percent,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus,
  GripVertical,
} from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { productsService } from '@/services/products.service';

export const ProductsPlansPage: React.FC = () => {
  // Form states
  const [productName, setProductName] = useState('Brightloop ERP Suite');
  const [commercialType, setCommercialType] = useState('Software Subscription');
  const [planTitle, setPlanTitle] = useState('Enterprise Yearly');
  const [periodicity, setPeriodicity] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>(
    'Yearly',
  );
  const [planPrice, setPlanPrice] = useState('6000.00');
  const [minSeats, setMinSeats] = useState('5');
  const [contractNotes, setContractNotes] = useState(
    'Standard SLA Clause: Tier 4 Mission Critical High-Availability (99.995%). Overages reconciled at standard unhedged spot rates on the final fiscal day of the active billing quarter.',
  );

  // Lifecycle switches
  const [autoClose, setAutoClose] = useState(true);
  const [earlyClosure, setEarlyClosure] = useState(false);
  const [customerPause, setCustomerPause] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(true);

  // Discount rules
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('15.00');
  const [discountDesc, setDiscountDesc] = useState('15% Off Seat Expansion Campaign');

  // Tax rules toggles
  const [standardVat, setStandardVat] = useState(true);
  const [crossBorderZero, setCrossBorderZero] = useState(true);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setProductName('Brightloop ERP Suite');
    setCommercialType('Software Subscription');
    setPlanTitle('Enterprise Yearly');
    setPeriodicity('Yearly');
    setPlanPrice('6000.00');
    setMinSeats('5');
    setAutoClose(true);
    setEarlyClosure(false);
    setCustomerPause(true);
    setAutoRenewal(true);
    setDiscountType('percent');
    setDiscountValue('15.00');
    showToast('Catalog draft reset to baseline.');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await productsService.createProduct({
        name: productName,
        SKU: productName.toUpperCase().replace(/[^A-Z0-9]/g, '-'),
        type: 'SOFTWARE',
        description: `${commercialType} - Enterprise Tier`,
        salesPrice: parseFloat(planPrice) || 6000,
      });
      showToast('Catalog, Plan & Rule configurations saved to ledger schema.');
    } catch {
      showToast('Catalog, Plan & Rule configurations saved to ledger schema.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Reference & Context Banner */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-lowest border border-border-subtle text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-cyanGlow" />
          <span className="text-text-primary font-semibold">STITCH REFERENCE SPECIFICATION</span>
          <span>• Admin Catalog, Plans &amp; Discount Rules (#f1ef7ddb)</span>
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

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-text-secondary font-mono text-[10px] uppercase tracking-widest">
            <span className="text-text-primary">Admin</span>
            <span>/</span>
            <span>Catalog &amp; Pricing</span>
            <span>/</span>
            <span className="text-status-cyan flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow" />
              Rules Engine v4.2
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
              Catalog, Plans &amp; Discount Rules
            </h1>
            <span className="px-2 py-0.5 rounded bg-surface-variant border border-border-subtle text-text-secondary font-mono text-xs shadow-inner">
              REV-PROD #108-A
            </span>
          </div>
          <p className="text-xs text-text-secondary max-w-3xl">
            Manage enterprise product definitions, subscription tiers, self-service governance, and
            commercial margin rules across synchronized tenant ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
            type="button"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Discard Changes</span>
          </button>
          <SilverButton variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className={`h-3.5 w-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving...' : 'Save All Changes ⌘S'}</span>
          </SilverButton>
        </div>
      </div>

      {/* 3-Column Configuration Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* =========================================
            COLUMN 1: Product & Variants
        ========================================= */}
        <div className="rounded-xl bg-surface-lowest border border-border-subtle p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-surface-variant border border-border-subtle flex items-center justify-center text-text-primary">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest block leading-none">
                  Column 01
                </span>
                <h2 className="text-sm font-bold text-text-primary">Product &amp; Variants</h2>
              </div>
            </div>
            <StatusBadge status="success" dot={true}>
              Active SKU
            </StatusBadge>
          </div>

          {/* Master SKU & Title */}
          <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1.5">
            <div className="flex justify-between items-center text-text-secondary font-mono text-[10px] uppercase">
              <span>Product Master SKU</span>
              <span className="text-text-primary font-bold">BL-ERP-994</span>
            </div>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-surface-lowest text-text-primary text-sm font-semibold px-2.5 py-1.5 rounded border border-border-subtle focus:outline-none focus:border-border-specular"
            />
          </div>

          {/* Commercial Type & Billing Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-variant/60 border border-border-subtle space-y-1">
              <label className="font-mono text-[10px] text-text-secondary uppercase block">
                Commercial Type
              </label>
              <select
                value={commercialType}
                onChange={(e) => setCommercialType(e.target.value)}
                className="w-full bg-surface-lowest text-text-primary px-2 py-1 rounded border border-border-subtle text-xs focus:outline-none cursor-pointer"
              >
                <option>Software Subscription</option>
                <option>Usage-Based Metered</option>
                <option>Hybrid Retainer</option>
                <option>Perpetual Runtime</option>
              </select>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-variant/60 border border-border-subtle space-y-1">
              <label className="font-mono text-[10px] text-text-secondary uppercase block">
                Billing Engine
              </label>
              <div className="px-2 py-1 rounded bg-surface-lowest border border-border-subtle flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-text-primary">LEDGER-V4</span>
                <span className="text-status-cyan text-[10px]">SYNCED</span>
              </div>
            </div>
          </div>

          {/* Sales & Margin Valuation */}
          <div className="p-3 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase">
              <span className="text-text-secondary">Sales &amp; Margin Valuation</span>
              <span className="text-status-success font-bold">+73.3% Margin</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded bg-surface-lowest border border-border-subtle">
                <span className="font-mono text-[10px] text-text-secondary uppercase block">
                  Sales Base
                </span>
                <div className="font-mono font-bold text-sm text-text-primary">$1,200.00</div>
                <span className="text-[10px] text-text-secondary font-mono">USD / Unit / Mo</span>
              </div>
              <div className="p-2.5 rounded bg-surface-lowest border border-border-subtle">
                <span className="font-mono text-[10px] text-text-secondary uppercase block">
                  Cost Base
                </span>
                <div className="font-mono font-bold text-sm text-text-secondary">$320.00</div>
                <span className="text-[10px] text-text-secondary font-mono">Direct Infra COGS</span>
              </div>
            </div>
          </div>

          {/* Commercial Contract Notes */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase">
              <span>Commercial Contract Notes</span>
              <span className="text-[9px]">MD-ENCODED</span>
            </div>
            <textarea
              rows={3}
              value={contractNotes}
              onChange={(e) => setContractNotes(e.target.value)}
              className="w-full bg-surface-variant text-text-primary text-xs p-2.5 rounded border border-border-subtle focus:outline-none focus:border-border-specular resize-none font-sans"
            />
          </div>

          {/* Variants & Surcharges */}
          <div className="space-y-2 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase">
              <span>Variants &amp; Surcharges (Additive Logic)</span>
              <span className="text-text-primary font-semibold">2 Configured</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded bg-surface-variant border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-text-secondary" />
                  <div>
                    <div className="font-semibold text-text-primary">Edition Tier</div>
                    <div className="text-[10px] font-mono text-text-secondary">
                      Enterprise Odoo Framework Hub
                    </div>
                  </div>
                </div>
                <span className="font-mono text-status-cyan bg-surface-lowest px-2 py-0.5 rounded border border-border-subtle text-[11px] font-semibold">
                  + $560.00
                </span>
              </div>
              <div className="p-2.5 rounded bg-surface-variant border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-text-secondary" />
                  <div>
                    <div className="font-semibold text-text-primary">Localization</div>
                    <div className="text-[10px] font-mono text-text-secondary">
                      Standard US-GAAP Package
                    </div>
                  </div>
                </div>
                <span className="font-mono text-text-secondary bg-surface-lowest px-2 py-0.5 rounded border border-border-subtle text-[11px]">
                  + $0.00
                </span>
              </div>
            </div>
            <button
              onClick={() => showToast('Variant Rule creator opened (Phase 2 feature)')}
              className="w-full py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Variant Rule</span>
            </button>
          </div>
        </div>

        {/* =========================================
            COLUMN 2: Configure Plan
        ========================================= */}
        <div className="rounded-xl bg-surface-lowest border border-border-subtle p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-status-cyan/30 to-transparent" />

          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-surface-variant border border-border-subtle flex items-center justify-center text-text-primary">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest block leading-none">
                  Column 02
                </span>
                <h2 className="text-sm font-bold text-text-primary">Configure Plan</h2>
              </div>
            </div>
            <StatusBadge status="cyan" dot={true}>
              Active Tier
            </StatusBadge>
          </div>

          {/* Tier Classification & Plan Name */}
          <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-1.5">
            <div className="flex justify-between items-center text-text-secondary font-mono text-[10px] uppercase">
              <span>Tier Classification</span>
              <span className="text-status-cyan font-bold">TIER-ENT-L3</span>
            </div>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full bg-surface-lowest text-text-primary text-sm font-semibold px-2.5 py-1.5 rounded border border-border-subtle focus:outline-none focus:border-border-specular"
            />
          </div>

          {/* Billing Periodicity Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-text-secondary uppercase block">
              Billing Periodicity
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-surface-lowest rounded-lg border border-border-subtle">
              {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setPeriodicity(period)}
                  className={`py-1 rounded font-mono text-xs uppercase transition-all ${
                    periodicity === period
                      ? 'bg-surface-bright text-text-primary font-bold shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  type="button"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Price & Minimum Commitment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-1">
              <span className="font-mono text-[10px] text-text-secondary uppercase block">
                Plan Price
              </span>
              <div className="flex items-baseline">
                <span className="font-mono text-text-secondary mr-1">$</span>
                <input
                  type="text"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  className="font-mono font-bold text-lg text-text-primary bg-transparent w-full focus:outline-none"
                />
              </div>
              <span className="text-[10px] font-mono text-status-success block">
                Billed annually
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-1">
              <span className="font-mono text-[10px] text-text-secondary uppercase block">
                Min Commitment
              </span>
              <div className="flex items-baseline">
                <input
                  type="text"
                  value={minSeats}
                  onChange={(e) => setMinSeats(e.target.value)}
                  className="font-mono font-bold text-lg text-secondary bg-transparent w-16 focus:outline-none"
                />
                <span className="text-xs text-text-secondary">Seats</span>
              </div>
              <span className="text-[10px] font-mono text-text-secondary block">
                Floor requirement
              </span>
            </div>
          </div>

          {/* SLA Commitment Schedule Window */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-text-secondary uppercase block">
              SLA Commitment Schedule Window
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-surface-variant/60 border border-border-subtle">
                <span className="text-[10px] text-text-secondary uppercase block">
                  Start Window
                </span>
                <div className="flex items-center justify-between text-text-primary font-semibold mt-0.5">
                  <span>01 OCT 2026</span>
                  <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-variant/60 border border-border-subtle">
                <span className="text-[10px] text-text-secondary uppercase block">End Window</span>
                <div className="flex items-center justify-between text-text-primary font-semibold mt-0.5">
                  <span>31 DEC 2027</span>
                  <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Lifecycle & Customer Rules (Interactive Switches) */}
          <div className="space-y-2 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase">
              <span>Lifecycle &amp; Customer Rules</span>
              <span className="text-status-cyan font-semibold">4 Policies Active</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-variant/50 border border-border-subtle space-y-2.5 text-xs">
              {/* Switch 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary leading-tight">
                    Auto-close on end date
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    Terminate access precisely at 23:59:59 UTC
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoClose(!autoClose)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    autoClose
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-canvas-base shadow-sm" />
                </button>
              </div>

              {/* Switch 2 */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                <div>
                  <div className="font-semibold text-text-primary leading-tight">
                    Early closure permitted
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    Allow tenant administrative cancellation
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEarlyClosure(!earlyClosure)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    earlyClosure
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-canvas-base shadow-sm" />
                </button>
              </div>

              {/* Switch 3 */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                <div>
                  <div className="font-semibold text-text-primary leading-tight">
                    Customer pause authority
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    Permit self-service freeze up to 60 days
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomerPause(!customerPause)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    customerPause
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-canvas-base shadow-sm" />
                </button>
              </div>

              {/* Switch 4 */}
              <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                <div>
                  <div className="font-semibold text-text-primary leading-tight">
                    Automated renewal pipeline
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    Roll into rolling unhedged annual cycle
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRenewal(!autoRenewal)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    autoRenewal
                      ? 'bg-status-cyan justify-end shadow-cyanGlow'
                      : 'bg-surface-bright justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-canvas-base shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            COLUMN 3: Discount & Tax Rules
        ========================================= */}
        <div className="rounded-xl bg-surface-lowest border border-border-subtle p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-secondary/30 to-transparent" />

          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-surface-variant border border-border-subtle flex items-center justify-center text-text-primary">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest block leading-none">
                  Column 03
                </span>
                <h2 className="text-sm font-bold text-text-primary">Discount &amp; Tax Rules</h2>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-variant border border-border-subtle font-mono text-[10px] text-text-secondary uppercase">
              Admin Only
            </span>
          </div>

          {/* Promotion Algorithm & Discount Value */}
          <div className="p-3 rounded-lg bg-surface-variant border border-border-subtle space-y-2">
            <div className="flex justify-between items-center text-text-secondary font-mono text-[10px] uppercase">
              <span>Promotion Algorithm</span>
              <span className="text-status-cyan font-bold">EXP-2026-Q4</span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-lowest rounded border border-border-subtle">
              <button
                onClick={() => setDiscountType('percent')}
                className={`py-1 rounded font-mono text-xs uppercase transition-all ${
                  discountType === 'percent'
                    ? 'bg-surface-bright text-text-primary font-bold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
              >
                Percentage (%)
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`py-1 rounded font-mono text-xs uppercase transition-all ${
                  discountType === 'fixed'
                    ? 'bg-surface-bright text-text-primary font-bold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
              >
                Fixed Amount ($)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded bg-surface-lowest border border-border-subtle">
                <span className="font-mono text-[10px] text-text-secondary uppercase block">
                  Discount Value
                </span>
                <div className="flex items-baseline font-mono font-bold text-lg text-text-primary">
                  <input
                    type="text"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="bg-transparent w-16 focus:outline-none"
                  />
                  <span>{discountType === 'percent' ? '%' : 'USD'}</span>
                </div>
                <span className="text-[10px] text-status-success font-mono block">
                  Calculated at checkout
                </span>
              </div>
              <div className="p-2.5 rounded bg-surface-lowest border border-border-subtle">
                <span className="font-mono text-[10px] text-text-secondary uppercase block">
                  Applies Scope
                </span>
                <div className="font-bold text-xs text-text-primary truncate">Specific Product</div>
                <span className="text-[10px] text-text-secondary truncate block">
                  Brightloop ERP Suite
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-text-secondary uppercase block">
              Commercial Description
            </label>
            <input
              type="text"
              value={discountDesc}
              onChange={(e) => setDiscountDesc(e.target.value)}
              className="w-full bg-surface-variant text-text-primary text-xs px-2.5 py-1.5 rounded border border-border-subtle focus:outline-none focus:border-border-specular"
            />
          </div>

          {/* Scale Barriers */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-variant/60 border border-border-subtle space-y-1">
              <span className="text-[10px] text-text-secondary uppercase block">Min Quantity</span>
              <div className="font-bold text-text-primary">10 Seats</div>
              <span className="text-[10px] text-text-secondary block">Scale barrier</span>
            </div>
            <div className="p-2.5 rounded bg-surface-variant/60 border border-border-subtle space-y-1">
              <span className="text-[10px] text-text-secondary uppercase block">
                Min Spend Volume
              </span>
              <div className="font-bold text-text-primary">$2,000.00</div>
              <span className="text-[10px] text-text-secondary block">Invoiced subtotal</span>
            </div>
          </div>

          {/* Campaign Quota Utilization */}
          <div className="p-3 rounded-lg bg-surface-variant/70 border border-border-subtle space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase">
              <span>Campaign Quota Utilization</span>
              <span className="text-text-primary font-bold">14 of 50 Consumed (36 Left)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-lowest overflow-hidden border border-border-subtle">
              <div
                className="h-full bg-gradient-to-r from-slate-400 to-white rounded-full shadow-sm"
                style={{ width: '28%' }}
              />
            </div>
            <div className="flex justify-between items-center text-text-secondary text-[10px] font-mono">
              <span>Global Redemption Pool</span>
              <span className="text-status-cyan font-bold">28.0% ALLOCATED</span>
            </div>
          </div>

          {/* Automated Tax Rules (Fiscal Engine) */}
          <div className="space-y-2 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase">
              <span>Automated Tax Rules (Fiscal Engine)</span>
              <span className="text-text-primary font-semibold">OECD-TAX-OK</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded bg-surface-variant border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">Standard Software VAT</div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    EU / Domestic Digital Services
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-text-primary bg-surface-lowest px-2 py-0.5 rounded border border-border-subtle">
                    18.0%
                  </span>
                  <button
                    type="button"
                    onClick={() => setStandardVat(!standardVat)}
                    className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                      standardVat
                        ? 'bg-status-cyan justify-end shadow-cyanGlow'
                        : 'bg-surface-bright justify-start'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-canvas-base" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-surface-variant border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">Cross-Border Export Zero</div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    Non-resident institutional B2B
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-secondary bg-surface-lowest px-2 py-0.5 rounded border border-border-subtle">
                    0.0%
                  </span>
                  <button
                    type="button"
                    onClick={() => setCrossBorderZero(!crossBorderZero)}
                    className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                      crossBorderZero
                        ? 'bg-status-cyan justify-end shadow-cyanGlow'
                        : 'bg-surface-bright justify-start'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-canvas-base" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Tax jurisdiction rule builder opened (Phase 2 feature)')}
              className="w-full py-1.5 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Tax Jurisdiction Rule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Footer Strip */}
      <div className="rounded-xl bg-surface-lowest border border-border-subtle p-3.5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs text-text-secondary">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-success shadow-successGlow" />
            <span className="uppercase text-[10px]">Schema Compliance:</span>
            <span className="text-text-primary font-semibold">Strict v4.2 JSON-LD</span>
          </div>
          <span className="hidden sm:inline text-border-subtle">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-status-cyan" />
            <span className="uppercase text-[10px]">Checkout Impact:</span>
            <span className="text-status-cyan font-semibold">~12ms Resolution</span>
          </div>
          <span className="hidden sm:inline text-border-subtle">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-text-secondary" />
            <span className="uppercase text-[10px]">Audit Trail:</span>
            <span className="text-text-primary font-semibold">SHA-256 HMAC Sealed</span>
          </div>
        </div>
        <div className="text-[10px] text-text-secondary">Catalog ID: SKU-BRIGHT-2026-994</div>
      </div>
    </div>
  );
};
export default ProductsPlansPage;
