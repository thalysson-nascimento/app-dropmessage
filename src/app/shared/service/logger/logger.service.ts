import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { TrackAction } from '../../interface/track-action.interface';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  info(logger: TrackAction): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseURL}/logger/track-action/info`,
      logger
    );
  }
}
