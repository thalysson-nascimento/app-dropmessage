import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Product } from '../../interface/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ListSubscriptionService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  subscriptions(): Observable<Product[]> {
    return this.httpCLient
      .get<Product[]>(`${this.baseURL}/stripe/list-subscription`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
