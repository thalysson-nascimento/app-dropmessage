import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketRemovePostMessageService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  onPostExpired(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('post-expired', (data) => observer.next(data));
      return () => this.socket.off('post-expired');
    });
  }
}
