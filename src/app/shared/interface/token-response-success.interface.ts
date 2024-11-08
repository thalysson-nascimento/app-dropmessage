export interface TokenResponseSuccess {
  token: string;
  expiresIn: string;
  userVerificationData: UserVerificationData;
  avatar: Avatar;
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
  isUploadAvatar: boolean;
  verificationTokenEmail: boolean;
  validatorLocation: boolean;
}
