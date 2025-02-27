import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateModule } from '@ngx-translate/core';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { DataConnectChatMessage } from '../../../shared/interface/data-connect-chat-message.interface';
import { ListChat } from '../../../shared/interface/list-chat.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { ListChatService } from '../../../shared/service/list-chat/list-chat.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const CoreModule = [NgIf, NgFor, TranslateModule];
const SharedComponent = [SystemUnavailableComponent, LoadShimmerComponent];

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss'],
  standalone: true,
  imports: [...CoreModule, ...SharedComponent],
})
export class ListChatComponent implements OnInit {
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;
  listChat: ListChat[] = [];

  constructor(
    private router: Router,
    private listChatService: ListChatService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private userHashPublicService: UserHashPublicService
  ) {}

  ngOnInit() {
    this.loadListChat();
  }

  tryAgain() {
    this.isLoading = true;
    this.showSystemUnavailable = false;
    this.loadListChat();
  }

  loadListChat() {
    this.listChatService.listChat().subscribe({
      next: (response) => {
        this.listChat = response;
      },
      error: () => {
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.showSystemUnavailable = false;
      },
    });
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
    this.navigateBackUsingApp();
  }

  goToChat(userSelectForChat: DataConnectChatMessage) {
    this.dataConnectChatMessageService.setDataConnectChatMessage(
      userSelectForChat
    );
    this.router.navigateByUrl('home/chat-message');
  }
}
