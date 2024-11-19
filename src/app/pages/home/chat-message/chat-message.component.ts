import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const CoreModule = [CommonModule, FormsModule];

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  imports: [...CoreModule],
  standalone: true,
})
export class ChatMessageComponent implements OnInit {
  isRightAligned: boolean = false;
  newMessage = '';
  meuId = '11111111';
  messages = [
    {
      id: '11111111',
      userName: 'Thalysson',
      text: 'Olá, tudo bem?',
      time: '12:00',
      avatar: 'assets/jo.jpeg',
      alignRight: false, // Mensagem recebida
    },
    {
      id: '22222222',
      userName: 'Joyce Diana',
      text: 'Oi, tudo ótimo e você?',
      time: '12:01',
      avatar: 'assets/jo.jpeg',
      alignRight: true, // Mensagem enviada
    },
    {
      id: '11111111',
      userName: 'Thalysson',
      text: 'Tudo ótimo, adorei a foto do perfil. Ja que nao rolou o match no tinder, rolou por aqui kkkkkk',
      time: '12:00',
      avatar: 'assets/jo.jpeg',
      alignRight: false, // Mensagem recebida
    },
    {
      id: '22222222',
      userName: 'Joyce Diana',
      text: 'Oi, tudo ótimo e você?',
      time: '12:01',
      avatar: 'assets/jo.jpeg',
      alignRight: true, // Mensagem enviada
    },
    {
      id: '11111111',
      userName: 'Thalysson',
      text: 'Tudo ótimo, adorei a foto do perfil. Ja que nao rolou o match no tinder, rolou por aqui kkkkkk',
      time: '12:00',
      avatar: 'assets/jo.jpeg',
      alignRight: false, // Mensagem recebida
    },
  ];

  constructor(private router: Router) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: this.meuId,
        userName: 'Você',
        text: this.newMessage,
        time: new Date().toLocaleTimeString(),
        avatar: 'assets/my-avatar.png',
        alignRight: true,
      });
      this.newMessage = '';
    }
  }

  ngOnInit() {
    this.isRightAligned = !this.isRightAligned;
  }

  goToListChat() {
    this.router.navigateByUrl('home/list-chat');
  }

  getAlignment(messageId: string): boolean {
    return messageId === this.meuId;
  }
}
