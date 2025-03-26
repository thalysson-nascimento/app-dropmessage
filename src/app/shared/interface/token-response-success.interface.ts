export interface TokenResponseSuccess {
  token: string;
  expiresIn: string;
  statusSignature?: boolean;
  userVerificationData: UserVerificationData;
  avatar: Avatar;
  goldFreeTrialData: {
    viewCardFreeTrial: boolean;
    firstPublicationPostMessage: boolean;
  };
}

export interface Avatar {
  image: string;
  createdAt: Date;
  user: User;
}

export interface User {
  name: string;
  email: string;
}

export interface UserVerificationData {
  userHashPublic: string;
  isUploadAvatar: boolean;
  verificationTokenEmail: boolean;
  validatorLocation: boolean;
}
