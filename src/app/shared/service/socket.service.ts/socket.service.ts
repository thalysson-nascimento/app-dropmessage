import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  connect(userId: string) {
    if (!userId) return;

    if (this.socket?.connected) return;

    this.socket = io('http://localhost:3000', {
      auth: {
        userId,
      },
      transports: ['websocket'],
    });

    this.socket.emit('join', userId);
  }

  joinMatch(matchId: string) {
    this.socket.emit('join-send-message', matchId);
  }

  onUserOnline(): Observable<{ userId: string; userHashPublic: string }> {
    return new Observable((observer) => {
      this.socket.on('user-online', (data) => observer.next(data));
    });
  }

  onUserOffline(): Observable<{ userId: string; userHashPublic: string }> {
    return new Observable((observer) => {
      this.socket.on('user-offline', (data) => observer.next(data));
    });
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
