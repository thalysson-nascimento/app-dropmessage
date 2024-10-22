import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../shared/service/socket/socket.service';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TesteComponent implements OnInit, OnDestroy {
  posts!: any; // Variável que armazenará os dados recebidos
  private subscription!: Subscription; // Armazena a inscrição

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.subscription = this.socketService.listenForUpdates().subscribe({
      next: (data) => {
        if (this.posts !== data) {
          this.posts = data;
          console.log('===>', this.posts);
        }
      },
      error: (error) => {
        console.error('Erro ao receber dados: ===>', error);
      },
    });
  }

  ngOnDestroy() {
    // Cancelar a inscrição para evitar vazamentos de memória
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Desconectar o WebSocket ao sair do componente
    this.socketService.disconnect();
  }
}
