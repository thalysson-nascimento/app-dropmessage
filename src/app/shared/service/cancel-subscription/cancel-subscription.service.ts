import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class CancelSubscriptionService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  cancel(subscription: string): Observable<{ canceled: boolean }> {
    console.log('===>', subscription);
    return this.httpClient.post<{ canceled: boolean }>(
      `${this.baseURL}/stripe/cancel-subscripton`,
      {
        subscriptionId: subscription,
      }
    );
  }
}
