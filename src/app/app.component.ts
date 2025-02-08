import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

import { register } from 'swiper/element/bundle';
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

  constructor() {
    // this.showSplashscree();
    this.configureStatusBar();
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
