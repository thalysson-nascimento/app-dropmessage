import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import {
  ResponseSuccessSendMessage,
  SendMessage,
} from '../../interface/send-message';

@Injectable({
  providedIn: 'root',
})
export class SendMessageService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  sendMessage(
    sendMessage: SendMessage
  ): Observable<ResponseSuccessSendMessage> {
    return this.httpClient.post<ResponseSuccessSendMessage>(
      `${this.baseURL}/send-message`,
      sendMessage
    );
  }
}
