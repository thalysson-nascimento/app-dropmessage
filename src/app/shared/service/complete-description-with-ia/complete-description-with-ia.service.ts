import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class CompleteDescriptionWithIA {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  complete(userDescription: string): Observable<{ userDescriprition: string }> {
    return this.httpClient
      .post<{ userDescriprition: string }>(
        `${this.baseURL}/user-description-complete`,
        {
          userDescription: userDescription,
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
