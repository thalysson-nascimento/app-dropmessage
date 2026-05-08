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
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { FeedbackOverlayComponent } from '../../../shared/component/feedback-overlay/feedback-overlay.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CreateAccount } from '../../../shared/interface/create-account.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { CreateAccountService } from '../../../shared/service/create-account/create-account.service';
import { DeviceLanguageService } from '../../../shared/service/device-language/device-language.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { SignWithGoogleService } from '../../../shared/service/sign-with-google/sign-with-google.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { SpinnerComponent } from '../../../shared/component/spinner/spinner.component';

declare let gtag: Function;

const SharedComponents = [
  InputCustomDirective,
  ButtonDirective,
  ModalComponent,
  FeedbackOverlayComponent,
  SpinnerComponent,
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
  buttonDisalbled: boolean = false;
  createAccountFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  user: any = null;
  errorMessage!: string;
  isLoadingButtonGoogleOAuth: boolean = false;
  typeErrorModal: 'success' | 'warn' | 'error' = 'success';

  @ViewChild('modalError') modalError!: ModalComponent;
  @ViewChild('modalSuccess') modalSuccess!: ModalComponent;

  constructor(
    private router: Router,
    private createAccountService: CreateAccountService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet,
    @Inject(PLATFORM_ID) private platformId: Object,
    private googleAuthService: GoogleAuthService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private loggerService: LoggerService,
    private deviceLanguageService: DeviceLanguageService,
    private signWithGoogleService: SignWithGoogleService,
    private cacheAvatarService: CacheAvatarService
  ) {}

  async ngOnInit(): Promise<void> {
    this.createAccountFormBuilder();
    await this.googleAuthService.initializeApp();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('auth/sign');
      });
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

  async createAccountWithGoogle() {
    console.log('Iniciando autenticação com Google...');
    this.isLoadingButtonGoogleOAuth = true;
    try {
      const languageInfo = await this.deviceLanguageService.getLanguage();

      const token = await this.googleAuthService.signInWithGoogle();

      if (!token?.authentication?.idToken) {
        throw new Error('Token Google inválido');
      }

      const payload = {
        token: token.authentication.idToken,
        ...languageInfo,
      };

      this.signWithGoogleService.sign(payload).subscribe({
        next: (response) => {
          console.log('GOOGLE SIGNIN RESPONSE:', response);
          this.isLoadingButtonGoogleOAuth = false;

          this.tokenStorageSecurityRequestService.saveToken(response.token);

          this.preferencesUserAuthenticateService.savePreferences(response);

          this.cacheAvatarService.setAvatarCachePreferences(response.avatar);

          this.userHashPublicService.setUserHashPublic(
            response.userVerificationData.userHashPublic
          );

          gtag('event', 'google_auth_success', {
            page_path: '/cadastro',
          });

          this.router.navigateByUrl('home/main/post-message');
        },

        error: (errorResponse: any) => {
          console.error('GOOGLE SIGNIN ERROR RESPONSE:', errorResponse);
          console.error(errorResponse);

          this.typeErrorModal = 'warn';

          this.errorMessage =
            errorResponse?.error?.message || 'Erro ao autenticar com Google';

          this.isLoadingButtonGoogleOAuth = false;

          this.modalError.open();
        },
      });
    } catch (error: any) {
      console.error('GOOGLE SIGNIN ERROR:', error);
      console.error(error);

      this.typeErrorModal = 'warn';

      this.errorMessage = error?.message || 'Erro ao autenticar com Google';

      this.isLoadingButtonGoogleOAuth = false;

      this.modalError.open();
    }
  }

  async createAccountUser() {
    if (!this.createAccountFormGroup.valid) return;

    this.isLoadingButton = true;
    this.buttonDisalbled = true;

    try {
      const formData = this.createAccountFormGroup.getRawValue();

      const languageInfo = await this.deviceLanguageService.getLanguage();

      const payload: CreateAccount = {
        ...formData,
        ...languageInfo,
      };

      this.createAccountService.createAccount(payload).subscribe({
        next: () => {
          gtag('event', 'create_account', {
            page_path: '/cadastro',
          });
          this.buttonDisalbled = false;
          this.isLoadingButton = false;
          this.createAccountFormGroup.reset();
          this.modalSuccess.open();
        },

        error: (errorResponse) => {
          // this.openBottomSheet('Ops, ocorreu um erro.', error.error.message);
          this.modalError.open();
          this.buttonDisalbled = false;
          this.isLoadingButton = false;
          this.errorMessage = errorResponse.error.message;
        },
      });
    } catch (error) {
      console.error(error);
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

  tryAgain() {
    this.modalError.close();
    this.createAccountUser();
  }

  closeModal() {
    this.modalError.close();
  }
}
