import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ListChat } from '../../../shared/interface/list-chat.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { ListChatService } from '../../../shared/service/list-chat/list-chat.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';

const CoreModule = [NgIf, NgFor];
const SharedComponent = [SystemUnavailableComponent];

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
    private lottieAnimationIconService: LottieAnimationIconService
  ) {}

  ngOnInit() {
    this.loadListChat();
  }

  tryAgain() {
    this.isLoading = true;
    this.showSystemUnavailable = false;
    this.loadListChat();
  }

  ngAfterViewInit(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
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

  goToChat(mathId: string, hashPublicId: string) {
    this.dataConnectChatMessageService.setDataConnectChatMessage({
      mathId,
      hashPublicId,
    });
    this.router.navigateByUrl('home/chat-message');
  }
}
