import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  connected: boolean = false;
  baseUrlSocket: string = currentEnvironment.baseUrlSocket;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
      this.socket = io(this.baseUrlSocket, {
        transports: ['websocket'],
      });
    }
  }

  private connect() {
    this.socket = io(this.baseUrlSocket);

    this.socket.on('connect', () => {
      console.log('Socket conectado com sucesso!');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro na conexão do socket', error.message);
      console.error('Error: ', error.cause);
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false; // Verifica se o socket está conectado
  }

  listenForUpdates(): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.socket) {
        observer.error('Socket não está inicializado.');
        return;
      }

      // Verificar se o socket está conectado
      this.socket.on('connect', () => {
        try {
          // Emitir evento para solicitar mensagens
          this.socket.emit('/api/response-message');

          // Ouvindo a resposta do servidor
          this.socket.on('/api/response-message', (data: any) => {
            observer.next(data);
          });

          // Tratando erro de conexão
          this.socket.on('connect_error', (error) => {
            observer.error(`Erro de conexão: ${error.message}`);
          });

          // Função de limpeza quando o Observable for cancelado
          return () => {
            this.socket.off('/api/response-message');
          };
        } catch (error) {
          observer.error(`Erro inesperado: ${error}`);
          return;
        }
      });

      // Caso o socket não se conecte após um tempo
      this.socket.on('connect_error', (error) => {
        observer.error(`Erro de conexão: ${error.message}`);
      });
    }).pipe(
      catchError((error) => {
        console.error('Erro capturado:', error);
        return throwError(() => new Error(`Erro ao receber dados: ${error}`));
      })
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
