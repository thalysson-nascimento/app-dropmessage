import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Notification } from '../../interface/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  notification(): Observable<Notification[]> {
    return this.httpClient
      .get<Notification[]>(`${this.baseURL}/notification`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
