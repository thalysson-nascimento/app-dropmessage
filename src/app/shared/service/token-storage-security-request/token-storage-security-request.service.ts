import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageSecurityRequestService {
  private tokenKey = 'authToken';

  constructor() {}

  returnJWTToken() {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  deleteToken() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token ? token : null;
  }
}
