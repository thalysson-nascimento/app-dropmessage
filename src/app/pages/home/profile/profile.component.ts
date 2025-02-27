import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ActiveSignatureComponent } from '../../../shared/component/active-signature/active-signature.component';
import { CardSubscriptionComponent } from '../../../shared/component/card-subscription/card-subscription.component';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { ActiveSubscription } from '../../../shared/interface/active-subscription.interface';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { ActiveSubscriptionService } from '../../../shared/service/active-subscription/active-subscription.service';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { SignalService } from '../../../shared/service/signal/signal.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const CoreModule = [CommonModule, TranslateModule];
const SharedComponent = [
  CardSubscriptionComponent,
  LoadShimmerComponent,
  ActiveSignatureComponent,
  ErrorComponent,
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [...SharedComponent, ...CoreModule],
})
export class ProfileComponent implements OnInit {
  avatar!: AvatarSuccess;
  pageView: string = 'DatingMatch:Profile';
  private destroy$: Subject<void> = new Subject<void>();
  showCardSubscription: boolean = false;
  planSubscription: boolean = false;
  isLoadingCardSubscription: boolean = true;
  dataSubscription!: ActiveSubscription;
  labelTag: string = '';
  showError: boolean = false;

  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loggerService: LoggerService,
    private activeSubscriptionService: ActiveSubscriptionService,
    private signalService: SignalService<ActiveSubscription>,
    private googleAuthService: GoogleAuthService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit() {
    this.loadCacheAvatar();
    this.activeSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'profile:return_page',
          event: 'click',
          label: 'button:icon_back',
          message: 'Voltar para pagina de postagem',
          statusCode: 200,
          level: 'info',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        this.router.navigateByUrl('home/post-messages');
      });
    }
  }

  loadCacheAvatar() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        if (response) {
          this.avatar = response;
        }
      },

      error: (error) => {
        console.log('Erro ao carregar avatar do cache:', error);
      },
    });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
    this.navigateBackUsingApp();
  }

  logout() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:logout',
      event: 'click',
      label: 'button:encerrar_sessão',
      message: 'encerrar sessão',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService
      .info(logger)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.tokenStorageSecurityRequestService.deleteToken();
          this.cacheAvatarService.resetAvatarCachePreferences();
          this.userHashPublicService.removeUserHashPublic();
          this.googleAuthService.signOut();
          this.preferencesUserAuthenticateService.deleteToken();
          this.router.navigateByUrl('auth/sign');
        },
      });
  }

  goToPrivecePolice() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:privece_police',
      event: 'click',
      label: 'button:politica_de_privacidade',
      message: 'Politica de privacidade',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigateByUrl('home/privacy-police');
  }

  goToAppInfor() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:app_infor',
      event: 'click',
      label: 'button:app_infor',
      message: 'Informações do app',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();
    this.router.navigateByUrl('home/app-infor');
  }

  goToNotification() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:notification',
      event: 'click',
      label: 'button:notification',
      message: 'Notificação',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigateByUrl('home/notification');
  }

  goToUserPosts() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:user_post_message',
      event: 'click',
      label: 'button:user_posts',
      message: 'Posts compartilhados',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigateByUrl('home/user-post-message');
  }

  goToUserData() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:user_profile',
      event: 'click',
      label: 'button:user_profile',
      message: 'Perfil do usuário',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigateByUrl('home/user-data');
  }

  goToListChat() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:chat',
      event: 'click',
      label: 'button:chat',
      message: 'Chat',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigateByUrl('home/list-chat');
  }

  activeSubscription() {
    this.activeSubscriptionService
      .active()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoadingCardSubscription = false;
          if (
            !response.activeSubscription ||
            response.data?.status === 'canceled'
          ) {
            this.showCardSubscription = true;
          }
          this.planSubscription = true;
          this.dataSubscription = response;

          if (!response.data?.cancelAtPeriodEnd) {
            this.labelTag = 'assinatura ativa';
          } else {
            this.labelTag = 'assinatura cancelada';
          }
        },
        error: (errorResponse) => {
          this.isLoadingCardSubscription = false;
          this.showError = true;
        },
      });
  }

  goToPlanActiveSignature(activeSubscription?: ActiveSubscription) {
    if (activeSubscription) {
      this.signalService.set(activeSubscription);
      this.router.navigate(['home', 'plan-active-signature']);
    }
  }

  goToListSignature() {
    this.router.navigateByUrl('home/list-subscription');
  }
}
