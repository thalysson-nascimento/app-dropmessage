export interface TokenResponseSuccess {
  token: string;
  expiresIn: string;
  userData: {
    name: string;
    email: string;
    isUploadAvatar: boolean;
    verificationTokenEmail: boolean;
  };
}
