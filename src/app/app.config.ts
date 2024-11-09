import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxMask } from 'ngx-mask';
import { Socket, io } from 'socket.io-client';
import { currentEnvironment } from '../environment.config';
import { routes } from './app.routes';
import { tokenStorageSecurityInterceptor } from './shared/interceptors/token-storage-security-interceptor/token-storage-security.interceptor';

export const SOCKET_IO_URL = currentEnvironment.baseUrlSocket;
export const socket: Socket = io(SOCKET_IO_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
});

export function playerFactory() {
  return player;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideLottieOptions({ player: playerFactory }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    { provide: 'SOCKET_IO', useValue: socket },
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNgxMask({
      dropSpecialCharacters: false,
    }),
    // porque habilitar essa função? Como estamos trabalhando com renderização no lado do servidor,
    // o servidor nao tem as apis do browser, caso nao habilite ele irá usar o XMLHttpRequest, tornando menos
    // eficiente ok
    provideHttpClient(withFetch()), // habilitando a função fatch nativa do navegador para integrar com o httpClient.
    provideHttpClient(withInterceptors([tokenStorageSecurityInterceptor])),
  ],
};
