import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketSenMessageService {
  constructor(@Inject('SOCKET_IO') private socket: Socket) {}

  // ✅ CONEXÃO ÚNICA
  connect(token: string) {
    if (this.socket.connected) return;

    this.socket.auth = { token };
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('🟢 SOCKET CONECTADO:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 SOCKET DESCONECTADO');
    });
  }

  onConnect(callback: () => void) {
    if (this.socket.connected) {
      callback(); // 🔥 já conectado → executa direto
    } else {
      this.socket.once('connect', callback); // 🔥 garante execução única
    }
  }

  // ✅ ENTRAR NA SALA DO CHAT
  joinRoomSendMessage(matchId: string) {
    console.log('➡️ entrando na sala:', matchId);
    this.socket.emit('join-send-message', matchId);
  }

  // ✅ ESCUTAR MENSAGEM
  onSendMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('send-message', (data) => {
        console.log('📩 SOCKET RECEBIDO:', data);
        observer.next(data);
      });

      return () => this.socket.off('send-message');
    });
  }

  // ✅ STATUS ONLINE
  onUserOnline(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-online', (data) => {
        observer.next(data);
      });

      return () => this.socket.off('user-online');
    });
  }

  // ✅ STATUS OFFLINE
  onUserOffline(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-offline', (data) => {
        observer.next(data);
      });

      return () => this.socket.off('user-offline');
    });
  }

  // removeAllListeners() {
  //   this.socket.removeAllListeners();
  // }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
