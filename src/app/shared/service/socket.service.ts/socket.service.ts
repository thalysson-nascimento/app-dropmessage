import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  onNotificationUnread(): Observable<{ count: number; hasUnread: boolean }> {
    return new Observable((observer) => {
      this.socket.on('notification:unread', (data) => {
        console.log('📩 socket notification:unread received:', data);
        observer.next(data);
      });
      return () => this.socket.off('notification:unread');
    });
  }

  authenticate(token: string) {
    console.log('🔐 Authenticating socket with token...');
    this.socket.auth = { token };
    if (this.socket.connected) {
      this.socket.disconnect().connect();
    } else {
      this.socket.connect();
    }
  }
}
