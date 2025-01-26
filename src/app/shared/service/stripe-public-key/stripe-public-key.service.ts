import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class StripePublicKeyService {
  constructor(private httpClient: HttpClient) {}

  stripePublicKey(): Observable<{ publicKey: string }> {
    return this.httpClient
      .get<{ publicKey: string }>(
        `${currentEnvironment.baseURL}/stripe/public-key`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
