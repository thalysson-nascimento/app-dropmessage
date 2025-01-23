export interface ActiveSubscription {
  activeSubscription: boolean;
  data?: Data;
}

export interface Data {
  amountPaid: number;
  cancelAt: null;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  status: string;
  subscription: string;
  priceId: string;
  plan: string;
  description?: string;
  colorTop: string;
  colorBottom: string;
  currency: string;
  logoPath: string;
}
