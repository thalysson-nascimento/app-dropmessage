export interface CreateAccount {
  name: string;
  email: string;
  password: string;

  language: string;
  codeLanguage: string;
  countryLanguage: string;
}

export interface CreateAccountWithGoogleOAuth {
  token: string;
  language: string;
  codeLanguage: string;
  countryLanguage: string;
}

export interface CreateAccountSuccess {
  name: string;
  email: string;
  createdAt: string;
  isUploadAvatar: boolean;
  verificationTokenEmail: boolean;
}
