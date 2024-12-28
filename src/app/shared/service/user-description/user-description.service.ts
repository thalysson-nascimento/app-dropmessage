import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class UserDescriptionService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  description(
    userDescription: string
  ): Observable<{ userDescriprition: string }> {
    return this.httpClient
      .post<{ userDescriprition: string }>(`${this.baseURL}/user-description`, {
        userDescription: userDescription,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
