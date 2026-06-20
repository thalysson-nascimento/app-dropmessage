import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeCircleComponent } from '../../../shared/component/badge-circle/badge-circle.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { UserPostMessageElement } from '../../../shared/interface/user-post-message.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { UserPostMessageService } from '../../../shared/service/user-post-message/user-post-message.service';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { FeedbackOverlayComponent } from '../../../shared/component/feedback-overlay/feedback-overlay.component';
import { SpinnerComponent } from '../../../shared/component/spinner/spinner.component';
import { DurationOptionComponent } from '../../../shared/component/duration-option/duration-option.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { CommonModule } from '@angular/common';

const SahredComponents = [SystemUnavailableComponent, LoadShimmerComponent];

const CoreModule = [CommonModule, TranslateModule];

@Component({
  selector: 'app-user-post-message',
  templateUrl: './user-post-message.component.html',
  styleUrls: ['./user-post-message.component.scss'],
  standalone: true,
  imports: [
    SahredComponents,
    CoreModule,
    BadgeCircleComponent,
    ModalComponent,
    FeedbackOverlayComponent,
    SpinnerComponent,
    DurationOptionComponent,
    ButtonDirective,
  ],
})
export class UserPostMessageComponent implements OnInit {
  @ViewChild('actionsModal') actionsModal!: ModalComponent;
  @ViewChild('updateDurationModal') updateDurationModal!: ModalComponent;
  @ViewChild('feedbackModal') feedbackModal!: ModalComponent;
  @ViewChild('requestErrorModal') requestErrorModal!: ModalComponent;

  isLoading: boolean = true;
  randomHeights = ['15rem'];
  listPostMessage!: UserPostMessageElement[];
  showSystemUnavailable: boolean = false;
  userName: string = '';

  selectedPost: UserPostMessageElement | null = null;
  isLoadingDeactivate: boolean = false;
  isLoadingDelete: boolean = false;
  isLoadingUpdate: boolean = false;
  lastAttemptedAction: 'deactivate' | 'delete' | 'update' | null = null;

  selectedDuration: string = 'addThirtyMin';
  durations = [
    {
      value: 'addThirtyMin',
      label: '30m',
      description: 'Quick',
      icon: 'bolt',
      color: '#facc15',
    },
    {
      value: 'addOneHour',
      label: '1 Hour',
      description: 'Casual',
      icon: 'hourglass_top',
      color: '#3b82f6',
    },
    {
      value: 'addOneday',
      label: '1 Day',
      description: 'Story',
      icon: 'history_toggle_off',
      color: '#8b5cf6',
    },
    {
      value: 'addOneWeek',
      label: '1 week',
      description: 'Destaque',
      icon: 'auto_awesome',
      color: '#f59e0b',
    },
  ];

  feedbackVariant: 'success' | 'error' = 'success';
  feedbackIcon: string = 'check_circle';
  feedbackTitle: string = '';
  feedbackDescription: string = '';

  constructor(
    private userPostMessageService: UserPostMessageService,
    private router: Router,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnInit() {
    this.loadUserName();
    this.loadUserPostMessage();
  }

  getRandomHeight(): string {
    const heights = ['15rem'];
    const index = Math.floor(Math.random() * heights.length);
    return heights[index];
  }

  loadUserName() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        this.userName = response.user.name;
      },
    });
  }

  loadUserPostMessage() {
    return this.userPostMessageService.userPostMessage().subscribe({
      next: (response) => {
        console.log('User Post Message API response:', response);
        this.listPostMessage = response.userPostMessages;
        this.listPostMessage.forEach(() => {
          this.randomHeights.push(this.getRandomHeight());
        });
      },
      error: () => {
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  tryAgain() {
    this.loadUserPostMessage();
  }

  goToProfile() {
    this.router.navigateByUrl('home/main/profile');
  }

  onPostClick(post: UserPostMessageElement) {
    this.selectedPost = post;
    this.actionsModal.open();
  }

  deactivatePost() {
    if (!this.selectedPost || this.isLoadingDeactivate) return;

    this.isLoadingDeactivate = true;
    console.log('Desativar postagem - ID:', this.selectedPost.id);

    // Simula a chamada da API (1.5 segundos)
    setTimeout(() => {
      this.isLoadingDeactivate = false;
      this.actionsModal.close();

      // 25% de chance de simular um erro de requisição
      const simulateError = Math.random() < 0.25;
      if (simulateError) {
        this.lastAttemptedAction = 'deactivate';
        this.requestErrorModal.open();
        return;
      }

      // Atualiza localmente
      const post = this.listPostMessage.find((p) => p.id === this.selectedPost?.id);
      if (post) {
        post.isExpired = true;
      }

      this.feedbackVariant = 'success';
      this.feedbackIcon = 'visibility_off';
      this.feedbackTitle = 'button.deactivatePost';
      this.feedbackDescription = 'text.postDeactivatedSuccess';
      this.feedbackModal.open();
    }, 1500);
  }

  deletePost() {
    if (!this.selectedPost || this.isLoadingDelete) return;

    this.isLoadingDelete = true;
    console.log('Deletar postagem - ID:', this.selectedPost.id);

    const targetPostId = this.selectedPost.id;

    this.userPostMessageService.deletePost(targetPostId).subscribe({
      next: (response) => {
        this.isLoadingDelete = false;
        this.actionsModal.close();

        // Remove da lista local
        this.listPostMessage = this.listPostMessage.filter((p) => p.id !== targetPostId);

        this.feedbackVariant = 'success';
        this.feedbackIcon = 'delete';
        this.feedbackTitle = 'button.deletePost';
        this.feedbackDescription = 'text.postDeletedSuccess';
        this.feedbackModal.open();
      },
      error: (err) => {
        this.isLoadingDelete = false;
        this.actionsModal.close();

        this.lastAttemptedAction = 'delete';
        this.requestErrorModal.open();
      },
    });
  }

  openUpdateDurationModal() {
    if (!this.selectedPost) return;
    this.actionsModal.close();

    const currentTimer = this.selectedPost.typeExpirationTimer;
    if (this.durations.some((d) => d.value === currentTimer)) {
      this.selectedDuration = currentTimer;
    } else {
      this.selectedDuration = 'addThirtyMin';
    }

    setTimeout(() => {
      this.updateDurationModal.open();
    }, 300);
  }

  selectDuration(option: any) {
    this.selectedDuration = option.value;
  }

  updatePostDuration() {
    if (!this.selectedPost || this.isLoadingUpdate) return;

    this.isLoadingUpdate = true;
    console.log('Atualizar postagem - ID:', this.selectedPost.id, 'Timer:', this.selectedDuration);

    const targetPostId = this.selectedPost.id;
    const targetDuration = this.selectedDuration;

    this.userPostMessageService.updatePostExpiration(targetPostId, targetDuration).subscribe({
      next: (response) => {
        this.isLoadingUpdate = false;
        this.updateDurationModal.close();

        // Atualiza os dados locais do post (renovando a expiração)
        const post = this.listPostMessage.find((p) => p.id === targetPostId);
        if (post) {
          post.typeExpirationTimer = targetDuration;
          post.isExpired = false; // Post renovado não está mais expirado
          post.updatedAt = 'Agora'; // Simulação visual de atualização
        }

        this.feedbackVariant = 'success';
        this.feedbackIcon = 'timer';
        this.feedbackTitle = 'button.updatePost';
        this.feedbackDescription = 'text.postUpdatedSuccess';
        this.feedbackModal.open();
      },
      error: (err) => {
        this.isLoadingUpdate = false;
        this.updateDurationModal.close();

        this.lastAttemptedAction = 'update';
        this.requestErrorModal.open();
      },
    });
  }

  closeFeedbackModal() {
    this.feedbackModal.close();
    this.selectedPost = null;
  }

  closeUpdateDurationModal() {
    this.updateDurationModal.close();
    this.selectedPost = null;
  }

  closeActionsModal() {
    this.actionsModal.close();
    this.selectedPost = null;
  }

  retryFailedAction() {
    this.requestErrorModal.close();

    if (this.lastAttemptedAction === 'deactivate') {
      setTimeout(() => this.deactivatePost(), 300);
    } else if (this.lastAttemptedAction === 'delete') {
      setTimeout(() => this.deletePost(), 300);
    } else if (this.lastAttemptedAction === 'update') {
      setTimeout(() => this.updatePostDuration(), 300);
    }
  }

  closeRequestErrorModal() {
    this.requestErrorModal.close();
    this.selectedPost = null;
    this.lastAttemptedAction = null;
  }
}
