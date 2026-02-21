export interface SharedPostMessage {
  expirationDate: string;
  expirationTimer: string;
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    path: string;
    size: number;
    filename: string;
  };
  expirationInSeconds: number;
  expirationAmount: number;
  expirationUnit: string;
  sharedPostSuccess?: boolean;
  planGoldFreeTrialCongratulations?: boolean;
  showADS?: boolean;
  listActivePost?: {
    image: string;
    fileName: string;
    expirationTimer: Date;
  }[];
}
