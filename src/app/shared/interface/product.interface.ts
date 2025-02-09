export interface Product {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string;
  description: string;
  images: any[];
  livemode: boolean;
  marketing_features: any[];
  metadata: {
    ads?: string;
    likes?: string;
    location?: string;
    view?: string;
    'location-global'?: string;
    'assistant-ia'?: string;
  };
  name: string;
  package_dimensions: null;
  shippable: null;
  statement_descriptor: string;
  tax_code: null;
  type: string;
  unit_label: string;
  updated: number;
  url: null;
  prices: Price[];
}

export interface Price {
  priceId: string;
  currency: string;
  unitAmount: string;
  interval: string;
  intervalCount: number;
  logoPath: string;
  backgroundColor: {
    colorTop: string;
    colorBottom: string;
  };
}
