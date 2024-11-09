import { Injectable } from '@angular/core';

interface JwtPayload {
  iat: number;
  exp: number;
  sub: string;
}

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

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; // Se o token não estiver em um formato válido
    }
  }
}
