import React from 'react';
import { Check, Calendar } from 'lucide-react';
import { SubscriptionItem } from '../types';
import { BrandIcon } from './BrandLogos';

interface SubscriptionCardProps {
  subscription: SubscriptionItem;
  isFront?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  isFront = false,
}) => {
  // Stable 4-digit mock card digits based on subscription id
  const mockDigits = (
    subscription.id
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 1337) % 9000 + 1000
  ).toString();

  return (
    <div
      className={`relative w-full h-full rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-300 select-none overflow-hidden ${
        isFront
          ? 'bg-gradient-to-b from-[#1C1F2E] via-[#131520] to-[#0D0F17] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(240,83,35,0.22)] ring-1 ring-white/10'
          : 'bg-[#12141D]/90 border border-white/[0.08] shadow-lg opacity-85'
      }`}
    >
      {/* Top subtle gloss highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Ambient brand color illumination flare */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-25"
        style={{ backgroundColor: subscription.accentColor }}
      />

      {/* Top Card Bar: Brand Logo & Metallic Chip + NFC */}
      <div>
        <div className="flex items-center justify-between mb-3">
          {/* Authentic Brand Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shadow-md border border-white/10 relative overflow-hidden shrink-0"
            style={{
              backgroundColor: `${subscription.accentColor}22`,
            }}
          >
            <BrandIcon id={subscription.id} className="w-full h-full object-contain" />
          </div>

          {/* Right Header: Contactless NFC & Golden EMV Chip */}
          <div className="flex items-center gap-2">
            {/* NFC Waves */}
            <svg
              className="w-3.5 h-3.5 text-white/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8.5 16.5C9.5 15.2 10.1 13.7 10.1 12s-.6-3.2-1.6-4.5" />
              <path d="M12.5 19.5C14.3 17.4 15.4 14.8 15.4 12s-1.1-5.4-2.9-7.5" />
              <path d="M16.5 22.5C19.1 19.6 20.7 15.9 20.7 12s-1.6-7.6-4.2-10.5" />
            </svg>

            {/* Realistic Golden EMV Chip */}
            <div
              className="w-7 h-5 rounded-[4px] p-[1px] shadow-sm relative overflow-hidden border border-amber-600/40 bg-gradient-to-br from-[#E2B755] via-[#FCE49E] to-[#B38728]"
              title="EMV Chip"
              aria-hidden="true"
            >
              <div className="w-full h-full rounded-[3px] bg-gradient-to-tr from-[#C59B3F] to-[#E5C16C] relative">
                {/* Chip micro-grid contacts */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] opacity-40">
                  <div className="border-r border-b border-black/50" />
                  <div className="border-b border-black/50" />
                  <div className="border-r border-black/50" />
                  <div />
                </div>
                {/* Center contact node */}
                <div className="absolute inset-x-1 inset-y-0.5 rounded-[1px] border border-black/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name & Virtual Card Details */}
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-bold text-sm text-[#F5F5F7] tracking-tight leading-snug truncate">
              {subscription.name}
            </h3>
            <span
              className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-full border shrink-0 flex items-center gap-1"
              style={{
                backgroundColor: subscription.badgeBg,
                borderColor: subscription.badgeBorder,
                color: subscription.badgeText,
              }}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {subscription.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#999EAB] font-mono mt-0.5">
            <span className="truncate max-w-[120px]">{subscription.category}</span>
            <span className="tracking-wider text-white/50">•••• {mockDigits}</span>
          </div>
        </div>

        {/* Plan & Price Module */}
        <div className="mt-3 p-2.5 rounded-xl bg-black/45 border border-white/[0.06] backdrop-blur-sm">
          <div className="text-[10px] text-[#999EAB] font-medium truncate">
            {subscription.planName}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-[#F5F5F7] tracking-tight">
              {subscription.price}
            </span>
            <span className="text-[10px] text-[#999EAB] font-mono">
              / {subscription.billingInterval.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Features Checklist (Compact 2 Key Features) */}
        <div className="mt-2.5 space-y-1.5">
          {subscription.features.slice(0, 2).map((feat, fIdx) => (
            <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-[#999EAB]">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info: Renewal Date & Verified Pass */}
      <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-[#999EAB]">
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <Calendar className="w-3 h-3 text-orange-400 shrink-0" />
          <span className="truncate">Renews {subscription.nextBillingDate}</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
          BILL-PASS
        </span>
      </div>
    </div>
  );
};

export default SubscriptionCard;
