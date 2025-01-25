import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class SessionPaymentIntentService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  createSession(priceId: string): Observable<{ client_secret: string }> {
    return this.httpClient
      .post<{ client_secret: string }>(
        `${this.baseURL}/session/payment-intent`,
        {
          priceId,
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
