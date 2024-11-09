import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map } from 'rxjs';

interface JwtPayload {
  iat: number;
  exp: number;
  sub: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenStorageSecurityRequestService {
  private tokenKey = 'authTokenPreferences';

  constructor() {}

  saveToken(token: string) {
    const setPreference = Preferences.set({
      key: this.tokenKey,
      value: JSON.stringify(token),
    });

    return from(setPreference);
  }

  getToken(): Observable<string | null> {
    return from(Preferences.get({ key: this.tokenKey })).pipe(
      map((result) => {
        return result.value ? JSON.parse(result.value) : null;
      })
    );
  }

  deleteToken(): Observable<void> {
    return from(Preferences.remove({ key: this.tokenKey }));
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(
      map((token) => token !== null && !this.isTokenExpired(token))
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; // Se o token não estiver em um formato válido
    }
  }

  // returnJWTToken() {
  //   return localStorage.getItem(this.tokenKey) ?? '';
  // }

  // saveToken(token: string) {
  //   localStorage.setItem(this.tokenKey, token);
  // }

  // deleteToken() {
  //   localStorage.removeItem(this.tokenKey);
  // }

  // getToken(): string | null {
  //   const token = localStorage.getItem(this.tokenKey);
  //   return token ? token : null;
  // }

  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return token !== null && !this.isTokenExpired(token);
  // }

  // private isTokenExpired(token: string): boolean {
  //   try {
  //     const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
  //     return payload.exp * 1000 < Date.now();
  //   } catch (e) {
  //     return true; // Se o token não estiver em um formato válido
  //   }
  // }
}
