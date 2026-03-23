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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ChatMessageAdapter } from '../../../shared/adapter/chat-message.adapter';
import { statusIndicatorAnimation } from '../../../shared/animation/status-indicator.animation';
import { ErrorRequestComponent } from '../../../shared/component/error-request/error-request.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { ChatMessageUI } from '../../../shared/interface/chat-message-ui.interface';
import { Message } from '../../../shared/interface/get-send-message.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { GetSendMessageService } from '../../../shared/service/get-send-message/get-send-message.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { ReportProblemService } from '../../../shared/service/report-problem/report-problem.service';
import { SendMessageService } from '../../../shared/service/send-message/send-message.service';
import { SocketSenMessageService } from '../../../shared/service/socket-send-message/socket-sen-message.service';
import { UnmatchService } from '../../../shared/service/unmatch/unmatch.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { noOnlySpacesValidator } from '../../../shared/validators/noOnlySpacesValidator.validator';
import { ChatMessageLoadingComponent } from './chat-message-loading/chat-message-loading.component';

const CoreModule = [CommonModule, FormsModule, ReactiveFormsModule];
const SharedComponent = [
  ModalComponent,
  ButtonStyleDirective,
  ChatMessageLoadingComponent,
  ErrorRequestComponent,
  TranslateModule,
  ButtonDirective,
];

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  imports: [...CoreModule, ...SharedComponent],
  animations: [...statusIndicatorAnimation],
  standalone: true,
})
export class ChatMessageComponent implements OnInit, OnDestroy, AfterViewInit {
  loading: boolean = false;
  error: boolean = false;
  isLoadingMore: boolean = false;
  newMessage: string = '';
  userHashPublic: string = '';
  messages: Message[] = [];
  currentPage: number = 1;
  totalPage: number = 0;
  matchId: string = '';
  sendMessageFormGroup!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  tips: string[] = [];
  isInputFocused: boolean = false;
  private socketInitialized = false;

  @ViewChild('containMessages') containMessages?: ElementRef;
  @ViewChild('chooseAction') chooseAction!: ModalComponent;
  @ViewChild('repostProblem') repostProblem!: ModalComponent;

  userMatchName!: string;
  userMatchLocation!: { stateCode: string; city: string };
  userMatchAvatar!: string;
  isLoadingTips: boolean = false;
  showOptionTips: boolean = false;
  showAlertError: boolean = false;
  responseErrorTips: string = '';
  errorLoadTips: boolean = false;
  showReportProblem: boolean = false;
  errorReportProblem: boolean = false;
  showSuccessMessageReportProblem: boolean = false;
  pageView: string = 'DatingMatch:ChatMessage';
  public matchUserId!: string;
  private destroy$: Subject<void> = new Subject<void>();

  public newAppMessage = '';

  public messagesChate: ChatMessageUI[] = [];
  public isUserOnline: boolean = false;

  constructor(
    private router: Router,
    private getSendMessageService: GetSendMessageService,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private formBuilder: FormBuilder,
    private sendMessageService: SendMessageService,
    private socketSenMessageService: SocketSenMessageService,
    private userHashPublicService: UserHashPublicService,
    private zone: NgZone,
    private reportProblemService: ReportProblemService,
    private loggerService: LoggerService,
    private unmatchService: UnmatchService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.createSendMessageFormBuilder();

    combineLatest([
      this.userHashPublicService.getUserHashPublic(),
      this.dataConnectChatMessageService.getDataConnectChatMessage(),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([userHash, chatData]) => {
        if (userHash) {
          this.userHashPublic = userHash;
        }

        if (chatData) {
          this.userMatchAvatar = chatData.avatar;
          this.userMatchName = chatData.name;
          this.userMatchLocation = chatData.userLocation;
          this.matchId = chatData.mathId;
        }

        if (this.userHashPublic && this.matchId && !this.socketInitialized) {
          this.socketInitialized = true;

          this.loadSendMessage();
          this.loadSocketUserStatus();
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeScrollEvent();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSocketUserStatus() {
    this.preferencesUserAuthenticateService.getToken().subscribe({
      next: (response) => {
        if (response) {
          this.socketSenMessageService.connect(response.token);

          this.socketSenMessageService.onConnect(() => {
            console.log('🚀 SOCKET PRONTO');

            this.socketSenMessageService.joinRoomSendMessage(this.matchId);
          });
        }
      },
    });

    // ✅ ONLINE
    this.socketSenMessageService
      .onUserOnline()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!this.matchUserId) return;

        if (data.userHashPublic === this.matchUserId) {
          this.isUserOnline = true;
        }
      });

    // ✅ OFFLINE
    this.socketSenMessageService
      .onUserOffline()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!this.matchUserId) return;

        if (data.userHashPublic === this.matchUserId) {
          this.isUserOnline = false;
        }
      });

    // ✅ MENSAGENS
    this.socketSenMessageService
      .onSendMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.zone.run(() => {
          const isOwn = response.user.userHashPublic === this.userHashPublic;
          if (isOwn) return;

          this.messagesChate.push({
            id: response.id,
            content: response.content,
            isOwnMessage: isOwn,
            time: format(new Date(response.createdAt), 'HH:mm'),
            dateLabel: format(new Date(response.createdAt), 'dd/MM/yyyy'),
          });

          this.scrollToBottom();
        });
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
    limit: number = 15,
    prepend: boolean = false
  ) {
    const element = this.containMessages?.nativeElement;
    const previousHeight = prepend ? element?.scrollHeight : 0;
    console.log('====>>>', previousHeight);

    this.getSendMessageService
      .sendMessage(this.matchId, page, limit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API:', response); // Log da resposta completa para depuração

          this.totalPage = response.pagination.totalPages;

          // 🔥 dados do usuário (header)
          this.userMatchName = response.match.otherUser.name;
          this.userMatchAvatar = response.match.otherUser.avatar;

          // 🔥 status online
          this.isUserOnline = response.match.otherUser.isOnline;
          this.matchUserId = response.match.otherUser.userHashPublic;

          // 🔥 ADAPTER
          const newMessages = ChatMessageAdapter.fromApi(
            response.messages.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
          );

          if (prepend) {
            this.messagesChate = [...newMessages, ...this.messagesChate];
            this.adjustScrollPosition(element, previousHeight);
          } else {
            this.messagesChate = [...this.messagesChate, ...newMessages];
            this.scrollToBottom();
          }

          setTimeout(() => this.initializeScrollEvent(), 200);
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
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
    this.router.navigateByUrl('home/main/chat');
  }

  tryAgain(): void {
    this.loadSendMessage();
  }

  sendMessage() {
    if (this.sendMessageFormGroup.valid) {
      const messageContent = this.sendMessageFormGroup
        .get('sendMessage')
        ?.value.trim();
      const tempId = crypto.randomUUID();

      this.messagesChate.push({
        id: tempId,
        content: messageContent,
        isOwnMessage: true,
        time: format(new Date(), 'HH:mm'),
        dateLabel: format(
          new Date(),
          this.translate.currentLang === 'pt' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'
        ),
      });

      this.scrollToBottom();

      this.sendMessageService
        .sendMessage({
          matchId: this.matchId,
          userHashPublic: this.userHashPublic,
          content: messageContent,
        })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.scrollToBottom();
          },
          error: () => {
            this.showAlertError = true;
            this.messages = this.messages.filter((msg) => msg.id !== tempId);
          },
        });

      this.sendMessageFormGroup.reset();
    }
  }

  openModalChooseAction() {
    this.chooseAction.open();
  }

  openModalReportProblem() {
    this.chooseAction.close();
    this.repostProblem.open();
  }

  reportProblem(typeReportProblem: string) {
    this.showReportProblem = true;
    this.reportProblemService
      .report(this.matchId, typeReportProblem)
      .subscribe({
        next: () => {
          this.showSuccessMessageReportProblem = true;
          this.repostProblem.close();

          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_chat_message:report_problem',
            event: 'click',
            message: typeReportProblem,
            statusCode: 200,
            level: 'info',
          };

          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        },
        error: (error) => {
          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_chat_message:report_problem',
            event: 'view',
            message: error.message,
            statusCode: error.status,
            level: 'error',
          };

          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          this.errorReportProblem = true;
          this.showReportProblem = false;
        },
      });
  }

  unmatch() {
    this.unmatchService.report(this.matchId).subscribe({
      next: () => {
        this.showSuccessMessageReportProblem = true;
      },
    });
  }
}
