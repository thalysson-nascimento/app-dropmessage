import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';

import { isPlatformBrowser } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { getTranslation } from './app.config';
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  constructor(private translate: TranslateService) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.configureStatusBar();
      await this.initializationTranslateApp();

      setTimeout(async () => {
        await SplashScreen.hide();
      }, 3000);
    }
  }

  async initializationTranslateApp() {
    const info = await Device.getLanguageCode();
    const deviceLang = info.value.split('-')[0];
    const defaultLang = deviceLang.match(/en|pt/) ? deviceLang : 'pt';

    this.translate.setTranslation(defaultLang, getTranslation(defaultLang));
    this.translate.use(defaultLang);
  }

  async configureStatusBar() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setStyle({ style: Style.Light });
    }
  }
}
