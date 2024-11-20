import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { Message } from '../../../shared/interface/send-message.interface';
import { GetSendMessageService } from '../../../shared/service/get-send-message/get-send-message.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';

const CoreModule = [CommonModule, FormsModule];
const SharedComponent = [SystemUnavailableComponent];
@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  imports: [...CoreModule, ...SharedComponent],
  standalone: true,
})
export class ChatMessageComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;
  isRightAligned: boolean = false;
  newMessage = '';
  userHashPublic: string = 'bb49a0f902';
  messages: Message[] = [];

  @ViewChild('containMessages') containMessages!: ElementRef;

  constructor(
    private router: Router,
    private getSendMessageService: GetSendMessageService,
    private lottieAnimationIconService: LottieAnimationIconService
  ) {}

  ngOnInit() {
    this.isRightAligned = !this.isRightAligned;
    this.loadSendMessage();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();

    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
  }

  loadSendMessage() {
    this.getSendMessageService
      .sendMessage('aae92ffd-7101-4702-877f-5fd8d4b85704')
      .subscribe({
        next: (response) => {
          this.messages = response.messages.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });

          setTimeout(() => this.scrollToBottom(), 0);

          console.log(response);
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

  scrollToBottom(): void {
    if (this.containMessages) {
      const element = this.containMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  goToListChat() {
    this.router.navigateByUrl('home/list-chat');
  }

  getAlignment(messageId: string): boolean {
    return messageId !== this.userHashPublic;
  }

  tryAgain() {
    this.loadSendMessage();
  }
}
