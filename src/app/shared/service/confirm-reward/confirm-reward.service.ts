import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class ConfirmRewardService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  confirmReward(): Observable<{ success: boolean }> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.baseURL}/update-admob-video-reward`,
        {}
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
