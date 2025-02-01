import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { currentEnvironment } from '../../../../environment.config';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CreateAccount } from '../../../shared/interface/create-account.interface';
import { CreateAccountWithGoogleOauthService } from '../../../shared/service/create-account-with-google-oauth/create-account-with-google-oauth.service';
import { CreateAccountService } from '../../../shared/service/create-account/create-account.service';
import { GoogleAuthService } from '../../../shared/service/google-auth/google-auth.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [InputCustomDirective, ButtonStyleDirective];

const CoreModule = [ReactiveFormsModule, CommonModule];

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
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl);
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
        this.createAccountWithGoogleOauthService
          .createAccount(token.authentication.idToken)
          .subscribe({
            next: (response) => {
              this.isLoadingButtonGoogleOAuth = false;
              this.tokenStorageSecurityRequestService.saveToken(response.token);
              this.preferencesUserAuthenticateService.savePreferences(response);
              this.userHashPublicService.setUserHashPublic(
                response.userVerificationData.userHashPublic
              );
              this.router.navigateByUrl('home/post-messages');
            },
            error: (error) => {
              this.isLoadingButtonGoogleOAuth = false;
            },
          });
      }
    } catch (error) {
      this.errorMessage = error;
      console.error('Erro ao fazer login:', error);
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

  createAccountUser() {
    if (this.createAccountFormGroup.valid) {
      this.isLoadingButton = true;
      this.buttonDisalbled = true;
      const dataCreateAccountUser =
        this.createAccountFormGroup.getRawValue() as CreateAccount;

      this.createAccountService.createAccount(dataCreateAccountUser).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.router.navigateByUrl('auth/information-user-registred');
        },
        error: (responseError) => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.openBottomSheet(
            'Ops, ocorreu um erro.',
            responseError.error.message.message
          );
          console.log(responseError);
        },
      });
    }
  }

  goToAuthSign() {
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
