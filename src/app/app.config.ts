import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Socket, io } from 'socket.io-client';
import { routes } from './app.routes';

export const SOCKET_IO_URL = 'http://localhost:3000';
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
    provideRouter(routes),
    { provide: 'SOCKET_IO', useValue: socket },
    provideClientHydration(),
    provideAnimationsAsync(),
    // porque habilitar essa função? Como estamos trabalhando com renderização no lado do servidor,
    // o servidor nao tem as apis do browser, caso nao habilite ele irá usar o XMLHttpRequest, tornando menos
    // eficiente ok
    provideHttpClient(withFetch()), // habilitando a função fatch nativa do navegador para integrar com o httpClient.
  ],
};
