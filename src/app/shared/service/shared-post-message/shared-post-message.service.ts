import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { SharedPostMessage } from '../../interface/shared-post-message.interface';
import { SharedPostMessageBase } from './shared-post-message.base';

interface DataPostMessage {
  file: Blob;
  expirationTimer: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedPostMessageService extends SharedPostMessageBase {
  baseURL: string = currentEnvironment.baseURL;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  postMessage({
    file,
    expirationTimer,
  }: DataPostMessage): Observable<SharedPostMessage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expirationTimer', expirationTimer);

    return this.httpClient
      .post<SharedPostMessage>(`${this.baseURL}/api/posts-message`, formData)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(() => errorResponse);
        })
      );
  }
}
