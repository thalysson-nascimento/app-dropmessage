import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { TrackAction } from '../../interface/track-action.interface';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  baseURL: string = currentEnvironment.baseURL;

  constructor() {}

  // info(logger: TrackAction): Observable<any> {
  //   return this.httpClient.post<any>(
  //     `${this.baseURL}/logger/track-action/info`,
  //     logger
  //   );
  // }

  info(track: TrackAction): Observable<any> {
    return new Observable((observer) => {
      try {
        // Verifica se a função gtag está disponível (inserida no index.html)
        if (typeof gtag === 'function') {
          let params: any = {};

          if (track.event === 'view') {
            // Mapeamento para visualização de página
            params = {
              page_title: track.pageView, // Título da página (ex: 'Tela de Login')
              page_location: window.location.href, // URL atual
              page_path: track.message, // Caminho da rota (ex: '/login')
            };
          } else {
            // Mapeamento para outros eventos
            params = {
              event_category: track.category,
              event_label: track.label,
              value: track.statusCode,
            };
          }

          // Chama o gtag passando o tipo de evento e os parâmetros configurados
          gtag('event', track.event, params);

          // Emite um objeto de sucesso e completa o Observable
          observer.next({ status: 'success' });
          observer.complete();
        } else {
          observer.error(new Error('gtag function is not available'));
        }
      } catch (err) {
        observer.error(err);
      }
    });
  }
}
