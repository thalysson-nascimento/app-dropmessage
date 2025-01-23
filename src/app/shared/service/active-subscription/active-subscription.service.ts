import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { ActiveSubscription } from '../../interface/active-subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class ActiveSubscriptionService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  active(): Observable<ActiveSubscription> {
    return this.httpClient
      .get<ActiveSubscription>(`${this.baseURL}/active-subscription`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
