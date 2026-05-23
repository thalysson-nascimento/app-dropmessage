import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { AIProfileInterface } from '../../interface/ai-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class AiProfilesService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  profiles(): Observable<AIProfileInterface[]> {
    return this.httpCLient
      .get<AIProfileInterface[]>(`${this.baseURL}/ai-profiles`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
