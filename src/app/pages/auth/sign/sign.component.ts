import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Sign } from '../../../shared/interface/sign.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { LoginService } from '../../../shared/service/sign/sign.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
  LoadingComponent,
  ModalComponent,
];

const CoreModule = [ReactiveFormsModule, CommonModule];

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Gerenciador de assinaturas

  buttonDisalbled: boolean = false;
  userLoginFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  errorMessage: string = 'error';
  @ViewChild('dialog') modal!: ModalComponent;
  isOpen: boolean = false;
  backButtonListener!: PluginListenerHandle;
  pageView: string = 'DatingMatch:Login';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private bottomSheet: MatBottomSheet,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private loggerService: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.userLoginFormBuilder();
    this.navigateBackUsingApp();
  }

  ngOnDestroy(): void {
    // Remove o listener do botão de voltar
    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }

    // Emite um valor para encerrar todas as assinaturas
    this.destroy$.next();
    this.destroy$.complete();
  }

  async navigateBackUsingApp() {
    this.backButtonListener = await App.addListener('backButton', () => {
      App.exitApp();
    });
  }

  userLoginFormBuilder() {
    this.userLoginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  navigateToSignup() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_login',
      event: 'click',
      label: 'link:Ainda nao possui uma conta?',
      message: 'does not have an account',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService
      .info(logger)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['auth/signup']);
        },
        error: (error) => console.error(error),
      });
  }

  userSign() {
    if (this.userLoginFormGroup.valid) {
      this.isLoadingButton = true;

      const login = this.userLoginFormGroup.getRawValue() as Sign;

      this.loginService
        .login(login)
        .pipe(takeUntil(this.destroy$)) // Garante que a assinatura será encerrada
        .subscribe({
          next: (response) => {
            this.isLoadingButton = false;
            this.tokenStorageSecurityRequestService.saveToken(response.token);
            this.preferencesUserAuthenticateService.savePreferences(response);

            this.cacheAvatarService.setAvatarCachePreferences(response.avatar);

            this.userHashPublicService.setUserHashPublic(
              response.userVerificationData.userHashPublic
            );

            const logger: TrackAction = {
              pageView: this.pageView,
              category: 'user_login',
              event: 'click',
              label: 'button:entrar',
              message: 'login success',
              statusCode: 200,
              level: 'info',
            };

            this.loggerService
              .info(logger)
              .pipe(takeUntil(this.destroy$))
              .subscribe();

            this.router.navigateByUrl('home/post-messages');
          },
          error: (responseError: HttpErrorResponse) => {
            this.isLoadingButton = false;
            this.tokenStorageSecurityRequestService.deleteToken();
            this.errorMessage = responseError.error.message.message;

            this.modal.openDialog();
          },
        });
    }
  }

  openBottomSheet(messageTitle: string, messageDescription: string) {
    this.bottomSheet.open(BottomSheetErrorRequestComponent, {
      data: {
        messageTitle: messageTitle,
        messageDescription: messageDescription,
      },
    });
  }

  closeDialog() {
    this.isOpen = false;
  }

  navigateToTest() {
    this.router.navigateByUrl('auth/teste');
  }
}
