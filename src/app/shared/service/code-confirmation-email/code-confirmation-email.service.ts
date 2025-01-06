import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class CodeConfirmationEmailService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  confirmation(code: number): Observable<{ userDescriprition: string }> {
    const params = new HttpParams().set(
      'codeConfirmationEmail',
      code.toString()
    );

    return this.httpClient
      .get<{ userDescriprition: string }>(
        `${this.baseURL}/code-confirmation-email`,
        { params }
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
