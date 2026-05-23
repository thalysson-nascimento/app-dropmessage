// 🔥 RESPONSE ROOT
export interface SubscriptionAIResponse {
  basic: StripeProduct[];
  pro: StripeProduct[];
  premium: StripeProduct[];
}

// 🔥 PRODUCT
export interface StripeProduct {
  id: string;
  name: string;
  metadata: StripeMetadata;
  prices: StripePrice[];
}

// 🔥 METADATA (tudo string como você pediu)
export interface StripeMetadata {
  ammount?: string;
  discountLabel?: string;
  durationLabel: string;
  originalPrice?: string;
  pricePerMonth: string;
  isBestValue?: string;
  tier: 'basic' | 'pro' | 'premium';
  type: string;
}

// 🔥 PRICE
export interface StripePrice {
  priceId: string;
  currency: string;
  unitAmount: string;
  interval: string;
  intervalCount: number;
  logoPath: string | null;
  backgroundColor: {
    colorTop: string;
    colorBottom: string;
  } | null;
}

export interface PlanOption {
  id: string;
  type: 'basic' | 'pro' | 'premium';
  metadata: {
    id: string;
    ammount?: string;
    discountLabel?: string;
    durationLabel: string;
    isBestValue?: string;
    originalPrice?: string;
    pricePerMonth: string;
  };
}
