import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class DeepLinkService {
  constructor(private router: Router) {
    this.setupDeepLinkListener();
  }

  setupDeepLinkListener() {
    App.addListener('appUrlOpen', (event: any) => {
      try {
        const url = new URL(event.url);
        const pathname = url.pathname;
        const searchParams = url.searchParams;

        if (pathname.includes('verify')) {
          const token = searchParams.get('token');

          if (token) {
            this.router.navigate(['/verify-email'], {
              queryParams: { token: token },
            });
          } else {
            console.warn('No token found in deep link');
          }
        }
      } catch (error) {
        console.error('Error processing deep link:', error);
      }
    });
  }

  isDeepLink(url: string): boolean {
    return url.startsWith('datingmatch://');
  }
}
