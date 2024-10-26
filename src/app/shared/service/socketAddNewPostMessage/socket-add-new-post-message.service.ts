import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketAddNewPostMessageService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  onNewPostMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('add-new-post-message', (data) => observer.next(data));
      // Certifique-se de limpar o evento para evitar vazamento de memória
      return () => this.socket.off('add-new-post-message');
    });
  }
}
