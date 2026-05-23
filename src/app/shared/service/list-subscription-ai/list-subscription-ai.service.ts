import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { SubscriptionAIResponse } from '../../interface/subscription-ai.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ListSubscriptionAiService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  subscriptions(): Observable<SubscriptionAIResponse> {
    return this.httpCLient
      .get<SubscriptionAIResponse>(`${this.baseURL}/stripe/subscription-ai`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
