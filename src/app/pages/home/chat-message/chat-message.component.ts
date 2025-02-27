import { CommonModule } from '@angular/common';
import {
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
import { format, formatDistanceToNow, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Subject, takeUntil } from 'rxjs';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { Message } from '../../../shared/interface/get-send-message.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { GetSendMessageService } from '../../../shared/service/get-send-message/get-send-message.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { ReportProblemService } from '../../../shared/service/report-problem/report-problem.service';
import { SendMessageService } from '../../../shared/service/send-message/send-message.service';
import { SocketSenMessageService } from '../../../shared/service/socket-send-message/socket-sen-message.service';
import { GenerateTipsService } from '../../../shared/service/tips/generate-tips.service';
import { UnmatchService } from '../../../shared/service/unmatch/unmatch.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { noOnlySpacesValidator } from '../../../shared/validators/noOnlySpacesValidator.validator';

const CoreModule = [CommonModule, FormsModule, ReactiveFormsModule];
const SharedComponent = [
  SystemUnavailableComponent,
  ModalComponent,
  LoadShimmerComponent,
  ButtonStyleDirective,
];

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  imports: [...CoreModule, ...SharedComponent],
  standalone: true,
})
export class ChatMessageComponent implements OnInit, OnDestroy {
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
  tips: string[] = [];
  isInputFocused: boolean = false;

  @ViewChild('containMessages') containMessages?: ElementRef;
  @ViewChild('generateModalTips') generateModalTips!: ModalComponent;
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
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private getSendMessageService: GetSendMessageService,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private formBuilder: FormBuilder,
    private sendMessageService: SendMessageService,
    private socketSenMessageService: SocketSenMessageService,
    private userHashPublicService: UserHashPublicService,
    private zone: NgZone,
    private generateTipsService: GenerateTipsService,
    private reportProblemService: ReportProblemService,
    private loggerService: LoggerService,
    private unmatchService: UnmatchService
  ) {}

  ngOnInit() {
    this.onLoadUserHashPublic();
    this.createSendMessageFormBuilder();

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
          this.loadSendMessage();
        } else {
          console.error('matchId não foi definido');
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.destroy$.next();
    this.destroy$.complete();
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
          setTimeout(() => {
            this.initializeScrollEvent();
          }, 200);
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
            this.scrollToBottom();
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
  loadTips() {
    this.showOptionTips = true;
    this.isLoadingTips = true;
    this.generateTipsService.tips(this.matchId).subscribe({
      next: (response) => {
        this.tips = response;
      },
      error: (errorResponse) => {
        this.errorLoadTips = true;
        this.responseErrorTips = errorResponse.error.message.message;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.isLoadingTips = false;
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
      const messageContent = this.sendMessageFormGroup
        .get('sendMessage')
        ?.value.trim();
      const tempId = crypto.randomUUID();

      this.messages.push({
        id: tempId,
        createdAt: new Date(),
        content: messageContent,
        user: {
          userHashPublic: this.userHashPublic,
          name: 'Você',
          avatar: {
            image: 'path/to/default-avatar.png',
          },
        },
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

  onListenSocketSendMessage(matchId: string) {
    this.socketSenMessageService.joinRoomSendMessage(matchId);
    this.socketSenMessageService
      .onSendMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.zone.run(() => {
          // this.messages.push(response);
          if (response.user.userHashPublic !== this.userHashPublic) {
            this.messages.push(response);
          }
          this.scrollToBottom();
        });
      });
  }

  choseTipsSendMessage(tip: string): void {
    this.showOptionTips = false;

    this.messages.push({
      createdAt: new Date(),
      content: tip,
      user: {
        userHashPublic: this.userHashPublic,
        name: 'Você',
        avatar: {
          image: 'path/to/default-avatar.png',
        },
      },
    });

    this.generateModalTips.closeDialog();

    this.scrollToBottom();
    this.sendMessageService
      .sendMessage({
        matchId: this.matchId,
        userHashPublic: this.userHashPublic,
        content: tip,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: (error) => console.error(error),
      });
  }

  formatedCreatedAt(date: Date) {
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ptBR });
    } else {
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    }
  }

  openModalTips() {
    this.generateModalTips.openDialog();
    this.loadTips();
  }

  openModalChooseAction() {
    this.chooseAction.openDialog();
  }

  openModalReportProblem() {
    this.chooseAction.closeDialog();
    this.repostProblem.openDialog();
  }

  reportProblem(typeReportProblem: string) {
    this.showReportProblem = true;
    this.reportProblemService
      .report(this.matchId, typeReportProblem)
      .subscribe({
        next: () => {
          this.showSuccessMessageReportProblem = true;
          this.repostProblem.closeDialog();

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
