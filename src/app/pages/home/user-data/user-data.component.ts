import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ErrorRequestComponent } from '../../../shared/component/error-request/error-request.component';
import { FeedbackOverlayComponent } from '../../../shared/component/feedback-overlay/feedback-overlay.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { MyProfile } from '../../../shared/interface/my-profile.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { UserDataInterface } from '../../../shared/interface/user-data-profile.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { DeleteAccountService } from '../../../shared/service/delete-account/delete-account.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserDataService } from '../../../shared/service/user-data/user-data.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { UserDataLoadingComponent } from './user-data-loading/user-data-loading.component';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    UserDataLoadingComponent,
    ButtonDirective,
    ModalComponent,
    FeedbackOverlayComponent,
    CommonModule,
    ErrorRequestComponent,
  ],
})
export class UserDataComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public isLoading: boolean = true;
  public error: boolean = false;
  public myProfile!: MyProfile;
  public buttonDisalbled: boolean = false;
  public pageView: string = 'DatingMatch:UserData';
  public avatar!: AvatarSuccess;
  public user!: UserDataInterface;

  @ViewChild('modalDeleteAccount') modalDeleteAccount!: ModalComponent;
  @ViewChild('modalRequesteError') modalRequesteError!: ModalComponent;

  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private userData: UserDataService,
    private deleteAccountService: DeleteAccountService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loggerService: LoggerService,
    private googleAuthService: GoogleAuthService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCacheAvatar();
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
          message: 'Voltar para pagina de settings',
          statusCode: 200,
          level: 'info',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        this.router.navigateByUrl('home/main/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/main/profile');
    this.navigateBackUsingApp();
  }

  loadUserData() {
    this.userData.userData().subscribe({
      next: (response) => {
        this.user = response;
        this.isLoading = false;
        this.error = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  openModal() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'profile:open_modal_delete_account',
      event: 'click',
      label: 'button:deletar_conta',
      message: 'Abrir modal deletar conta',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.modalDeleteAccount.open();
  }

  deleteAccount() {
    this.buttonDisalbled = true;
    this.deleteAccountService.deleteAccount().subscribe({
      next: () => {
        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'user_data:confirmation_delete_account',
          event: 'click',
          label: 'button:deletar_conta',
          message: 'Deletar conta',
          statusCode: 200,
          level: 'info',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        this.tokenStorageSecurityRequestService.deleteToken();
        this.cacheAvatarService.resetAvatarCachePreferences();
        this.userHashPublicService.removeUserHashPublic();
        this.buttonDisalbled = false;
        this.router.navigateByUrl('auth/sign');
      },
      error: () => {
        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'user_data:error_delete_account',
          event: 'view',
          message: 'Erro ao deletar a conta',
          statusCode: 500,
          level: 'error',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        this.buttonDisalbled = false;
        this.modalDeleteAccount.close();
        this.modalRequesteError.open();
      },
    });
  }

  loadCacheAvatar() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        if (response) {
          // debugger;
          this.avatar = response;
        }
      },

      error: (error) => {
        console.log('Erro ao carregar avatar do cache:', error);
      },
    });
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

    Preferences.set({
      key: 'preferencesWatchedVideoRewardAdmob',
      value: JSON.stringify(false),
    });

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

  closeModalRequesteError() {
    this.modalRequesteError.close();
  }

  closeModalDeleteAccount() {
    this.modalDeleteAccount.close();
  }
}
