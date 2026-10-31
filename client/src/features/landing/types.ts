export type SubscriptionCategory =
  | 'Entertainment'
  | 'Shopping & Entertainment'
  | 'Music'
  | 'Video'
  | 'Productivity'
  | 'Design'
  | 'Cloud Storage';

export interface SubscriptionItem {
  id: string;
  name: string;
  category: SubscriptionCategory;
  planName: string;
  price: string;
  billingInterval: 'Monthly' | 'Annual';
  billingCadenceText: string;
  status: 'ACTIVE' | 'TRIAL' | 'PAUSED';
  nextBillingDate: string;
  features: string[];
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  brandMark: {
    text: string;
    subtext?: string;
    style: 'text' | 'badge' | 'monogram';
  };
}
