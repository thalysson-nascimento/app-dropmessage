import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataConnectChatMessage } from '../../interface/data-connect-chat-message.interface';

@Injectable({
  providedIn: 'root',
})
export class DataConnectChatMessageService {
  private behaviorSubjectDataConnectChatMessage$: BehaviorSubject<DataConnectChatMessage> =
    new BehaviorSubject<DataConnectChatMessage>({} as DataConnectChatMessage);

  constructor() {}

  setDataConnectChatMessage(dataConnectChatMessage: DataConnectChatMessage) {
    this.behaviorSubjectDataConnectChatMessage$.next(dataConnectChatMessage);
  }

  getDataConnectChatMessage(): Observable<DataConnectChatMessage> {
    return this.behaviorSubjectDataConnectChatMessage$.asObservable();
  }
}
