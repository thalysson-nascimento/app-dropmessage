import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { ChatResponse } from '../../interface/chat-message.interface';

@Injectable({
  providedIn: 'root',
})
export class GetSendMessageService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  sendMessage(
    matchId: string,
    page: number = 1,
    limit: number = 15
  ): Observable<ChatResponse> {
    return this.httpCLient
      .get<ChatResponse>(
        `${this.baseURL}/send-message?matchId=${matchId}&page=${page}&limit=${limit}`
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
