import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
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
import { Device } from '@capacitor/device';
import { TranslateModule } from '@ngx-translate/core';
import { currentEnvironment } from '../../../../environment.config';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { ErrorModalComponent } from '../../../shared/component/error-modal/error-modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CreateAccount } from '../../../shared/interface/create-account.interface';
import { CreateAccountWithGoogleOauthService } from '../../../shared/service/create-account-with-google-oauth/create-account-with-google-oauth.service';
import { CreateAccountService } from '../../../shared/service/create-account/create-account.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

declare let gtag: Function;

const SharedComponents = [
  InputCustomDirective,
  ButtonStyleDirective,
  ErrorModalComponent,
];

const CoreModule = [ReactiveFormsModule, CommonModule, TranslateModule];

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private baseUrl: string = currentEnvironment.baseURL;
  buttonDisalbled: boolean = false;
  createAccountFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  user: any = null;
  errorMessage: unknown;
  isLoadingButtonGoogleOAuth: boolean = false;
  @ViewChild('modalErrorRequest') modalErrorRequest!: ErrorModalComponent;
  typeErrorModal: 'success' | 'warn' | 'error' = 'success';

  constructor(
    private router: Router,
    private createAccountService: CreateAccountService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet,
    @Inject(PLATFORM_ID) private platformId: Object,
    private googleAuthService: GoogleAuthService,
    private createAccountWithGoogleOauthService: CreateAccountWithGoogleOauthService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.createAccountFormBuilder();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('auth/sign');
      });
    }
  }

  async createAccountWithGoogle() {
    try {
      const token = await this.googleAuthService.signInWithGoogle();
      if (token.authentication.idToken) {
        this.isLoadingButtonGoogleOAuth = true;
        const device = await this.deviceInfor();

        this.createAccountWithGoogleOauthService
          .createAccount(token.authentication.idToken)
          .subscribe({
            next: (response) => {
              gtag('event', 'click', {
                page_title: 'Tela de Cadastro com Google', // Título que você quer identificar
                page_location: window.location.href,
                page_path: '/cadastro', // Defina o caminho conforme sua rota
                create_account: 'create_account_with_google',
              });
              gtag('device_infor', 'create_account', device);

              this.isLoadingButtonGoogleOAuth = false;
              this.tokenStorageSecurityRequestService.saveToken(response.token);
              this.preferencesUserAuthenticateService.savePreferences(response);
              this.userHashPublicService.setUserHashPublic(
                response.userVerificationData.userHashPublic
              );
              this.router.navigateByUrl('home/user-welcome');
            },
            error: (errorResponse: any) => {
              gtag('event', 'error_create_account_with_google', {
                page_title: 'Tela de Cadastro',
                page_location: window.location.href,
                page_path: '/cadastro',
                error_message:
                  errorResponse.error.message?.message || 'Erro desconhecido',
                error_code: errorResponse.status || 'sem código',
              });

              this.typeErrorModal = 'warn';
              this.errorMessage = errorResponse.error.message;
              this.isLoadingButtonGoogleOAuth = false;
              this.modalErrorRequest.openDialog();
            },
          });
      }
    } catch (errorResponse: any) {
      this.typeErrorModal = 'warn';
      this.errorMessage = errorResponse.error.message;
      this.isLoadingButtonGoogleOAuth = false;
      this.modalErrorRequest.openDialog();
    }
  }

  createAccountFormBuilder() {
    this.createAccountFormGroup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  async createAccountUser() {
    if (this.createAccountFormGroup.valid) {
      this.isLoadingButton = true;
      this.buttonDisalbled = true;
      const device = await this.deviceInfor();
      const dataCreateAccountUser =
        this.createAccountFormGroup.getRawValue() as CreateAccount;

      this.createAccountService.createAccount(dataCreateAccountUser).subscribe({
        next: () => {
          gtag('event', 'click', {
            page_title: 'Tela de Cadastro', // Título que você quer identificar
            page_location: window.location.href,
            page_path: '/cadastro', // Defina o caminho conforme sua rota
            create_account: 'create_account',
          });

          gtag('device_infor', 'create_account', device);

          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.router.navigateByUrl('auth/information-user-registred');
        },
        error: (responseError) => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;

          gtag('event', 'error_create_account', {
            page_title: 'Tela de Cadastro',
            page_location: window.location.href,
            page_path: '/cadastro',
            error_message:
              responseError.error.message?.message || 'Erro desconhecido',
            error_code: responseError.status || 'sem código',
          });

          this.openBottomSheet(
            'Ops, ocorreu um erro.',
            responseError.error.message.message
          );
        },
      });
    }
  }

  async deviceInfor() {
    const deviceInfor = await Device.getInfo();
    return {
      system_version: deviceInfor.operatingSystem,
      os_version: deviceInfor.osVersion,
      language: Device.getLanguageTag(),
      manufacturer: deviceInfor.manufacturer,
      model: deviceInfor.model,
    };
  }

  async goToAuthSign() {
    await this.googleAuthService.signOut();
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
    this.navigateBackUsingApp();
  }

  openBottomSheet(messageTitle: string, messageDescription: string) {
    this.bottomSheet.open(BottomSheetErrorRequestComponent, {
      data: {
        messageTitle: messageTitle,
        messageDescription: messageDescription,
      },
    });
  }

  goToPrivecePolice() {
    this.router.navigateByUrl('auth/privacy-police');
  }
}
