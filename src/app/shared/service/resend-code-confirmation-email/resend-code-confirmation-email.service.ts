import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class ResendCodeConfirmationEmailService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  resendConfirmation(): Observable<{ success: boolean }> {
    return this.httpClient
      .get<{ success: boolean }>(
        `${this.baseURL}/resend-code-confirmation-email`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
