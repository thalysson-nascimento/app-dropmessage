import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environmentConfig } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private initialized = false;
  
  constructor() {}

  async initializeApp() {
    if (this.initialized) return;

    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.initialize({
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });

      this.initialized = true;
    }
  }

  async signInWithGoogle() {
    try {
      const user = await GoogleAuth.signIn();

      return user;
    } catch (error) {
      console.error('GOOGLE SIGNIN ERROR:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await GoogleAuth.signOut();
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
}
