import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';

import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function playerFactory() {
  return player;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideLottieOptions({ player: playerFactory }),
    provideRouter(routes),
    provideClientHydration(), provideAnimationsAsync(),
  ],
};
