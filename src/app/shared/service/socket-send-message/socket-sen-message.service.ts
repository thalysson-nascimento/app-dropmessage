import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ResponseSuccessSendMessage } from '../../interface/send-message';

@Injectable({
  providedIn: 'root',
})
export class SocketSenMessageService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  joinRoomSendMessage(matchId: string) {
    this.socket.emit('join-send-message', matchId);
  }

  onSendMessage(): Observable<ResponseSuccessSendMessage> {
    return new Observable((observer) => {
      this.socket.on('send-message', (data) => observer.next(data));
      return () => this.socket.off('send-message');
    });
  }
}
