import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { ErrorModalComponent } from '../../../shared/component/error-modal/error-modal.component';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Sign } from '../../../shared/interface/sign.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { SignWithGoogleService } from '../../../shared/service/sign-with-google/sign-with-google.service';
import { LoginService } from '../../../shared/service/sign/sign.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
  LoadingComponent,
  ModalComponent,
  ErrorModalComponent,
];

const CoreModule = [
  ReactiveFormsModule,
  CommonModule,
  FormsModule,
  TranslateModule,
];

declare let gtag: Function;

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  buttonDisalbled: boolean = false;
  userLoginFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  errorMessage: string = 'error';
  @ViewChild('dialog') modal!: ModalComponent;
  isOpen: boolean = false;
  backButtonListener!: PluginListenerHandle;
  pageView: string = 'DatingMatch:Login';
  isLoadingButtonGoogleOAuth: boolean = false;
  @ViewChild('modalErrorRequest') modalErrorRequest!: ErrorModalComponent;
  typeErrorModal: 'success' | 'warn' | 'error' = 'success';
  testeToken: string = '';
  showPassword: boolean = false;

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
    private googleAuthService: GoogleAuthService,
    private signWithGoogleService: SignWithGoogleService
  ) {}

  ngOnInit(): void {
    this.userLoginFormBuilder();
    this.navigateBackUsingApp();

    gtag('event', 'page_view', {
      page_title: 'Tela de Login', // Título que você quer identificar
      page_location: window.location.href,
      page_path: '/login', // Defina o caminho conforme sua rota
    });
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
    this.router.navigate(['auth/signup']);
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

  async userAuthenticatorWithGoogle() {
    try {
      const token = await this.googleAuthService.signInWithGoogle();

      console.log(token);

      if (token.authentication.idToken) {
        this.isLoadingButtonGoogleOAuth = true;
        this.signWithGoogleService
          .sign(token.authentication.idToken)
          .subscribe({
            next: (response) => {
              this.isLoadingButtonGoogleOAuth = false;
              this.tokenStorageSecurityRequestService.saveToken(response.token);
              this.preferencesUserAuthenticateService.savePreferences(response);
              this.cacheAvatarService.setAvatarCachePreferences(
                response.avatar
              );
              this.userHashPublicService.setUserHashPublic(
                response.userVerificationData.userHashPublic
              );
              this.router.navigateByUrl('home/post-messages');
            },
            error: (errorResponse: any) => {
              this.typeErrorModal = 'warn';
              this.errorMessage = errorResponse.error.message;
              this.isLoadingButtonGoogleOAuth = false;
              this.modalErrorRequest.openDialog();
            },
          });
      }
    } catch (error) {
      gtag('event', 'error', {
        page_title: 'Tela de Login - google auth', // Título que você quer identificar
        page_location: window.location.href,
        page_path: '/login', // Defina o caminho conforme sua rota
        message: error,
      });
    }
  }
}
