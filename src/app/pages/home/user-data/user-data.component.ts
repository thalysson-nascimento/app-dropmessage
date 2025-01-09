import { NgIf, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Subject, takeUntil } from 'rxjs';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { ListStyleDirective } from '../../../shared/directives/list-style/list-style.directive';
import { MyProfile } from '../../../shared/interface/my-profile.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { DeleteAccountService } from '../../../shared/service/delete-account/delete-account.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { MyProfileService } from '../../../shared/service/my-profile/my-profile.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  SystemUnavailableComponent,
  ListStyleDirective,
  ButtonStyleDirective,
  ModalComponent,
];
const CoreModule = [NgIf];

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class UserDataComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;
  myProfile!: MyProfile;
  buttonDisalbled: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild('dialog') modal!: ModalComponent;
  pageView: string = 'DatingMatch:UserData';

  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private myProfileService: MyProfileService,
    private lottieAnimationIconService: LottieAnimationIconService,
    private deleteAccountService: DeleteAccountService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loggerService: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.loadMyProfile();
  }

  ngAfterViewInit(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
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

        this.router.navigateByUrl('home/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
    this.navigateBackUsingApp();
  }

  tryAgain() {}

  loadMyProfile() {
    this.myProfileService.myProfile().subscribe({
      next: (response) => {
        console.log('===>', response);
        this.myProfile = response;
      },
      error: (error) => {
        console.log(error);
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.showSystemUnavailable = false;
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

    this.modal.openDialog();
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
      error: (error) => {
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

        console.log(error);
      },
    });
  }
}
