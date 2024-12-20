import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
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
import { Subject, takeUntil } from 'rxjs';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Message } from '../../../shared/interface/get-send-message.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { GetSendMessageService } from '../../../shared/service/get-send-message/get-send-message.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { SendMessageService } from '../../../shared/service/send-message/send-message.service';
import { SocketSenMessageService } from '../../../shared/service/socket-send-message/socket-sen-message.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
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
export class ChatMessageComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;
  isLoadingMore: boolean = false;
  newMessage: string = '';
  userHashPublic: string = '';
  messages: Message[] = [];
  currentPage: number = 1;
  totalPage: number = 0;
  matchId: string = '';
  sendMessageFormGroup!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  @ViewChild('containMessages') containMessages?: ElementRef;
  userMatchName!: string;
  userMatchLocation!: { stateCode: string; city: string };
  userMatchAvatar!: string;

  constructor(
    private router: Router,
    private getSendMessageService: GetSendMessageService,
    private lottieAnimationIconService: LottieAnimationIconService,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private formBuilder: FormBuilder,
    private sendMessageService: SendMessageService,
    private socketSenMessageService: SocketSenMessageService,
    private userHashPublicService: UserHashPublicService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.onLoadUserHashPublic();
    this.createSendMessageFormBuilder();

    // Obtenha o `matchId` antes de inicializar a escuta do socket ou carregar mensagens
    this.dataConnectChatMessageService
      .getDataConnectChatMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.userMatchAvatar = data.avatar;
        this.userMatchName = data.name;
        this.userMatchLocation = data.userLocation;

        this.matchId = data.mathId;

        if (this.matchId) {
          this.onListenSocketSendMessage(this.matchId);
          this.loadSendMessage(); // Carrega mensagens apenas após definir `matchId`
        } else {
          console.error('matchId não foi definido');
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeLottieAnimation();
    this.initializeScrollEvent();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoadUserHashPublic() {
    this.userHashPublicService.getUserHashPublic().subscribe((result) => {
      if (result) {
        this.userHashPublic = result;
      }
    });
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

    this.getSendMessageService
      .sendMessage(this.matchId, page, limit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.totalPage = response.pagination.totalPages;
          const newMessages = response.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          if (prepend) {
            this.messages = [...newMessages, ...this.messages];
            this.adjustScrollPosition(element, previousHeight);
          } else {
            this.messages = [...this.messages, ...newMessages];
            this.scrollToBottom(); // Garante que vá para o final ao carregar
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

  adjustScrollPosition(
    element: HTMLElement | undefined,
    previousHeight: number
  ): void {
    if (element) {
      const newHeight = element.scrollHeight;
      element.scrollTop = newHeight - previousHeight;
    }
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
    setTimeout(() => {
      const element = this.containMessages?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  goToListChat(): void {
    this.router.navigateByUrl('home/list-chat');
  }

  getAlignment(messageId: string): boolean {
    return messageId === this.userHashPublic;
  }

  tryAgain(): void {
    this.loadSendMessage();
  }

  sendMessage() {
    if (this.sendMessageFormGroup.valid) {
      const message = this.sendMessageFormGroup
        .get('sendMessage')
        ?.value.trim();
      this.sendMessageService
        .sendMessage({
          matchId: this.matchId,
          userHashPublic: this.userHashPublic,
          content: message,
        })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => this.scrollToBottom(),
          error: (error) => console.error(error),
        });

      this.sendMessageFormGroup.reset();
    }
  }

  onListenSocketSendMessage(matchId: string) {
    this.socketSenMessageService.joinRoomSendMessage(matchId);
    this.socketSenMessageService
      .onSendMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.zone.run(() => {
          this.messages.push(response);
          this.scrollToBottom(); // Vai para o final ao receber nova mensagem
        });
      });
  }
}
