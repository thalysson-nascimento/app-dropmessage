export interface ActiveSubscription {
  activeSubscription: boolean;
  data?: Data;
}

export interface Data {
  cancelAt: null;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  status: string;
  subscription: string;
  priceId: string;
  plan: string;
  description?: string;
}
