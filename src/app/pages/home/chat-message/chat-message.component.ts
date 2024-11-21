import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Message } from '../../../shared/interface/send-message.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { GetSendMessageService } from '../../../shared/service/get-send-message/get-send-message.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { noOnlySpacesValidator } from '../../../shared/validators/noOnlySpacesValidator.validator';

const CoreModule = [CommonModule, FormsModule, ReactiveFormsModule];
const SharedComponent = [SystemUnavailableComponent, InputCustomDirective];

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
  isLoadingMore: boolean = false;
  newMessage: string = '';
  userHashPublic: string = 'bb49a0f902';
  messages: Message[] = [];
  currentPage: number = 1;
  totalPage: number = 0;
  matchId: string = '';
  disabledButton: boolean = false;
  sendMessageFormGroup!: FormGroup;

  @ViewChild('containMessages') containMessages?: ElementRef;

  constructor(
    private router: Router,
    private getSendMessageService: GetSendMessageService,
    private lottieAnimationIconService: LottieAnimationIconService,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadSendMessage();
    this.createSendMessageFormBuilder();
  }

  ngAfterViewInit(): void {
    this.initializeLottieAnimation();
    this.initializeScrollEvent();
  }

  ngOnChanges(): void {
    this.initializeScrollEvent();
  }

  createSendMessageFormBuilder() {
    this.sendMessageFormGroup = this.formBuilder.group({
      sendMessage: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
          noOnlySpacesValidator(),
        ],
      ],
    });
  }

  initializeLottieAnimation(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
  }

  initializeScrollEvent(): void {
    if (this.containMessages?.nativeElement) {
      console.log('Registrando scroll');
      const element = this.containMessages.nativeElement;
      element.addEventListener('scroll', () => this.onScroll(element));
    } else {
      console.error('Elemento #containMessages não encontrado');
    }
  }

  loadSendMessage(
    page: number = 1,
    limit: number = 10,
    prepend: boolean = false
  ) {
    const element = this.containMessages?.nativeElement;
    const previousHeight = prepend ? element?.scrollHeight : 0;

    this.dataConnectChatMessageService
      .getDataConnectChatMessage()
      .subscribe((dataConnectChatMessage) => {
        this.matchId = dataConnectChatMessage.mathId;
      });

    this.getSendMessageService
      .sendMessage('aae92ffd-7101-4702-877f-5fd8d4b85704', page, limit)
      .subscribe({
        next: (response) => {
          this.totalPage = response.pagination.totalPages;
          const newMessages = response.messages.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          this.initializeScrollEvent();

          if (prepend) {
            this.messages = [...newMessages, ...this.messages];
            setTimeout(() => {
              const newHeight = element?.scrollHeight || 0;
              if (element) element.scrollTop = newHeight - previousHeight;
            }, 0);
          } else {
            this.messages = [...this.messages, ...newMessages];
            setTimeout(() => this.scrollToBottom(), 0);
          }
        },
        error: () => {
          this.showSystemUnavailable = true;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.isLoadingMore = false;
        },
      });
  }

  onScroll(element: HTMLElement): void {
    if (element.scrollTop === 0 && !this.isLoadingMore) {
      if (this.totalPage > this.currentPage) {
        this.isLoadingMore = true;
        this.currentPage++;
        this.loadSendMessage(this.currentPage, 10, true);
      }
    }
  }

  scrollToBottom(): void {
    const element = this.containMessages?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  goToListChat(): void {
    this.router.navigateByUrl('home/list-chat');
  }

  getAlignment(messageId: string): boolean {
    return messageId !== this.userHashPublic;
  }

  tryAgain(): void {
    this.loadSendMessage();
  }

  sendMessage() {
    console.log('enviando mensagem');
    console.log(this.sendMessageFormGroup.get('sendMessage')?.value.trim());
    this.sendMessageFormGroup.reset();
  }
}
