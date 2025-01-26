import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { LastLikePostMessage } from '../../interface/last-like-post-message.interface';

@Injectable({
  providedIn: 'root',
})
export class LastLikePostMessageService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  lastLike(): Observable<LastLikePostMessage> {
    return this.httpCLient
      .get<LastLikePostMessage>(`${this.baseURL}/last-like-post-message`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
