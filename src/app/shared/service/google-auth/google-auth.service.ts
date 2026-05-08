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
      console.log('START GOOGLE SIGNIN');

      // const signInPromise = GoogleAuth.signIn();

      // const timeoutPromise = new Promise((_, reject) => {
      //   setTimeout(() => reject(new Error('Google SignIn timeout')), 10000);
      // });

      // const user = await Promise.race([
      //   signInPromise,
      //   timeoutPromise
      // ]);
      const user = await GoogleAuth.signIn();

      console.log('USER', user);

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
