import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketAddNewPostMessageService } from '../../../shared/service/socketAddNewPostMessage/socket-add-new-post-message.service';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TesteComponent implements OnInit, OnDestroy {
  posts!: any; // Variável que armazenará os dados recebidos
  socketSubscription!: Subscription;

  constructor(
    private socketAddNewPostMessageService: SocketAddNewPostMessageService
  ) {}

  ngOnInit(): void {
    this.socketSubscription = this.socketAddNewPostMessageService
      .onNewPostMessage()
      .subscribe({
        next: (data) => console.log('Novo post:', data),
        error: (err) => console.error('Erro ao receber post:', err),
      });
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
