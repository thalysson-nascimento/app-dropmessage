import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';
import { DataConnectChatMessage } from '../../../../shared/interface/data-connect-chat-message.interface';
import { ListChat } from '../../../../shared/interface/list-chat.interface';
import { DataConnectChatMessageService } from '../../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { ListChatService } from '../../../../shared/service/list-chat/list-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    LogoDropmessageComponent,
    ErrorRequestComponent,
    ButtonDirective,
    TranslateModule,
  ],
  standalone: true,
})
export class ChatComponent implements OnInit {
  public loading = true;
  public error = false;
  listChat: ListChat[] = [];

  constructor(
    private router: Router,
    private listChatService: ListChatService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataConnectChatMessageService: DataConnectChatMessageService
  ) {}

  ngOnInit() {
    this.loadListChat();
  }

  loadListChat() {
    this.listChatService.listChat().subscribe({
      next: (response) => {
        this.listChat = response;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.error = false;
      },
    });
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/main/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/main/profile');
    this.navigateBackUsingApp();
  }

  goToChat(userSelectForChat: DataConnectChatMessage) {
    this.dataConnectChatMessageService.setDataConnectChatMessage(
      userSelectForChat
    );
    this.router.navigateByUrl('home/chat-message');
  }
}
