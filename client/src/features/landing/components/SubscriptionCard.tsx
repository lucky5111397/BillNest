import React from 'react';
import { Calendar, CheckCircle2, Cpu } from 'lucide-react';
import { SubscriptionItem } from '../types';

interface SubscriptionCardProps {
  subscription: SubscriptionItem;
  isFront?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  isFront = false,
  style,
  className = '',
}) => {
  return (
    <article
      tabIndex={0}
      aria-label={`${subscription.name} subscription, ${subscription.category}, ${subscription.price} ${subscription.billingCadenceText}, Status ${subscription.status}`}
      style={style}
      className={`
        relative flex flex-col justify-between
        w-[260px] sm:w-[280px] md:w-[300px] h-[370px] sm:h-[390px]
        rounded-2xl p-5 select-none
        bg-gradient-to-b from-[#161A26] via-[#131620] to-[#0E1017]
        border transition-all duration-300
        ${
          isFront
            ? 'border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,124,255,0.15)] ring-1 ring-white/10'
            : 'border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }
        hover:border-white/30 focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none
        overflow-hidden
        ${className}
      `}
    >
      {/* Subtle top specular highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient background brand tint (very restrained, cinematic) */}
      <div
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: subscription.accentColor }}
        aria-hidden="true"
      />

      {/* TOP HEADER: Brand Mark + Category Badge */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2.5">
          {/* Brand Mark Emblem */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shadow-inner border"
            style={{
              backgroundColor: subscription.badgeBg,
              borderColor: subscription.badgeBorder,
              color: subscription.badgeText,
            }}
          >
            {subscription.brandMark.style === 'monogram' ? (
              <div className="flex flex-col items-center leading-none">
                <span className="text-sm font-black">{subscription.brandMark.text}</span>
                {subscription.brandMark.subtext && (
                  <span className="text-[7px] font-semibold tracking-tighter opacity-80">
                    {subscription.brandMark.subtext}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] font-black tracking-tight px-1">
                {subscription.brandMark.text}
              </span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-tight text-[#F5F5F7] leading-snug">
              {subscription.name}
            </h3>
            <span className="text-[11px] text-[#999EAB] block truncate max-w-[110px]">
              {subscription.planName}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <span
          className="text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border bg-white/[0.04] text-[#999EAB] border-white/[0.08] whitespace-nowrap"
          title={subscription.category}
        >
          {subscription.category.length > 13
            ? subscription.category.split(' ')[0]
            : subscription.category}
        </span>
      </div>

      {/* MIDDLE SECTION: Price & Interval */}
      <div className="my-auto py-2 z-10 space-y-2">
        <div className="p-3.5 rounded-xl bg-[#191D29]/70 border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-[#999EAB]">
              {subscription.billingCadenceText}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>{subscription.status}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F7]">
              {subscription.price}
            </span>
            <span className="text-xs text-[#999EAB] font-medium">
              /{subscription.billingInterval === 'Monthly' ? 'month' : 'year'}
            </span>
          </div>

          {/* Micro Chip Graphic */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/[0.05] text-[10px] text-[#999EAB]">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-white/30" />
              <span className="font-mono text-[9px] tracking-wider text-white/40">
                AUTOPAY ACTIVE
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#8B7CFF]/80">BILLNEST SECURED</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-1.5 px-1">
          {subscription.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#999EAB]">
              <CheckCircle2 className="w-3 h-3 text-[#8B7CFF] shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER: Renewal Cycle */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#999EAB] z-10">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-white/40" />
          <span>Next: {subscription.nextBillingDate}</span>
        </div>
        <span className="text-[10px] font-mono uppercase text-[#8B7CFF] px-1.5 py-0.5 rounded bg-[#8B7CFF]/10 border border-[#8B7CFF]/20">
          RECURRING
        </span>
      </div>
    </article>
  );
};
