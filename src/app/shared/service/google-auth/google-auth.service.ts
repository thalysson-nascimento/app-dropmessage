import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId:
          '999388705991-k8nj0pm920domilt0mtoedfqefgqvf0f.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }

  async signInWithGoogle() {
    try {
      const user = await GoogleAuth.signIn();
      return user;
    } catch (error) {
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
