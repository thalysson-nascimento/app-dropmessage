import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { SendMessage } from '../../interface/send-message.interface';

@Injectable({
  providedIn: 'root',
})
export class GetSendMessageService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  sendMessage(
    matchId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<SendMessage> {
    return this.httpCLient
      .get<SendMessage>(
        `${this.baseURL}/send-message?matchId=${matchId}&page=${page}&limit=${limit}`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
