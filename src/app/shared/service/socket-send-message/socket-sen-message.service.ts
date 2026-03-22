// import { Inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Socket } from 'socket.io-client';

// @Injectable({
//   providedIn: 'root',
// })
// export class SocketSenMessageService {
//   constructor(@Inject('SOCKET_IO') private socket: Socket) {}

//   joinRoomSendMessage(matchId: string) {
//     this.socket.emit('join-send-message', matchId);
//   }

//   connect(token: string) {
//     // 🔥 seta o token corretamente
//     this.socket.auth = { token };

//     // 🔥 conecta explicitamente
//     this.socket.connect();

//     // 🔥 debug essencial
//     this.socket.on('connect', () => {
//       console.log('🟢 SOCKET MENSAGEM CONECTADO:', this.socket.id);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('🔴 SOCKET MENSAGEM DESCONECTADO');
//     });
//   }

//   onConnect(callback: () => void) {
//     this.socket.on('connect', callback);
//   }

//   onSendMessage(): Observable<any> {
//     return new Observable((observer) => {
//       this.socket.on('send-message', (data) => {
//         console.log('📩 SOCKET RECEBIDO:', data); // 🔥 DEBUG
//         observer.next(data);
//       });

//       return () => this.socket.off('send-message');
//     });
//   }
// }
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

  removeAllListeners() {
    this.socket.removeAllListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
