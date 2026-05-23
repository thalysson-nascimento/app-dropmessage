import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AdmobService } from '../../../shared/service/ad-mob/ad-mob.service';

@Component({
  selector: 'app-admob-intertistial',
  templateUrl: './admob-intertistial.component.html',
  styleUrls: ['./admob-intertistial.component.scss'],
  standalone: true,
})
export class AdmobIntertistialComponent implements OnInit {
  isLoading = true;

  statusMessage = 'Preparing advertisement...';

  mockStep: 'loading' | 'playing' | 'finished' = 'loading';

  progress = 0;

  constructor(private admobService: AdmobService, private router: Router) {}

  async ngOnInit() {
    console.log('[Interstitial Component] Starting flow');

    const isNative = Capacitor.isNativePlatform();

    console.log('[Platform]', {
      platform: Capacitor.getPlatform(),
      isNative,
    });

    try {
      this.statusMessage = 'Loading advertisement...';

      // MOCK ONLY IN REAL BROWSER
      if (!isNative) {
        this.startMockFlow();
      }

      await this.admobService.showInterstitial();

      console.log('[Interstitial Component] Ad finished');
    } catch (e) {
      console.error('[Interstitial Component] Error', e);

      this.statusMessage = 'Failed to load advertisement';
    } finally {
      this.isLoading = false;

      console.log('[Interstitial Component] Redirecting...');

      this.router.navigateByUrl('home/main/post-message');
    }
  }

  private startMockFlow() {
    console.log('[MOCK] Starting visual simulation');

    this.mockStep = 'loading';

    setTimeout(() => {
      this.mockStep = 'playing';

      this.statusMessage = 'Watching advertisement...';

      const interval = setInterval(() => {
        this.progress += 10;

        console.log('[MOCK] Progress:', this.progress);

        if (this.progress >= 100) {
          clearInterval(interval);

          this.mockStep = 'finished';

          this.statusMessage = 'Advertisement completed';
        }
      }, 300);
    }, 800);
  }
}
