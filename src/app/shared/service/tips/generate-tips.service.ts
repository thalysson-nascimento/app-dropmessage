import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class GenerateTipsService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  tips(matchId: string): Observable<string[]> {
    return this.httpClient
      .get<string[]>(`${this.baseURL}/generate-tips?matchId=${matchId}`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
