import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';

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
  title = 'DatingMatch';

  constructor(private translate: TranslateService) {
    // this.showSplashscree();
    this.configureStatusBar();
    this.initializationTranslateApp();
  }

  async initializationTranslateApp() {
    const info = await Device.getLanguageCode();
    const deviceLang = info.value.split('-')[0];
    const defaultLang = deviceLang.match(/en|pt/) ? deviceLang : 'pt';
    this.translate.setTranslation(defaultLang, getTranslation(defaultLang));
    this.translate.use(defaultLang);
  }

  async ngOnInit() {
    setTimeout(async () => {
      await SplashScreen.hide(); // Oculta a splash screen após 3 segundos
    }, 3000);
  }

  async showSplashscree() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000,
    });
  }

  async configureStatusBar() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setStyle({ style: Style.Light });
    }
  }
}
