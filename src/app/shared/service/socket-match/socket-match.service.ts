import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketMatchService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  // Entra na sala com o ID do usuário
  joinRoom(userId: string | undefined) {
    this.socket.emit('join', userId);
  }

  onMatchNotification(): Observable<any> {
    return new Observable((observer) => {
      console.log('match ===>', observer);
      this.socket.on('match', (data) => observer.next(data));

      return () => this.socket.off('match');
    });
  }
}
