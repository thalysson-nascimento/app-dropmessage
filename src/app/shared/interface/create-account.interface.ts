export interface CreateAccount {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
}

export interface CreateAccountSuccess {
  name: string;
  email: string;
  createdAt: string;
  isUploadAvatar: boolean;
  verificationTokenEmail: boolean;
}
