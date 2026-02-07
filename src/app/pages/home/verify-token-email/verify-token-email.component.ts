import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { CodeConfirmationEmailService } from '../../../shared/service/code-confirmation-email/code-confirmation-email.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  ButtonStyleDirective,
  LoadingComponent,
  InputCustomDirective,
];

const CoreModule = [CommonModule, ReactiveFormsModule, TranslateModule];

@Component({
  selector: 'app-verify-token-email',
  templateUrl: './verify-token-email.component.html',
  styleUrls: ['./verify-token-email.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class VerifyTokenEmailComponent implements OnInit, OnDestroy {
  buttonDisalbled: boolean = false;
  isLoadingButton: boolean = false;
  codeConfirmationEmailFormGroup!: FormGroup;
  invalidCode: boolean = false;
  pageView: string = 'DatingMatch:VerifyTokenEmail';
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private codeConfirmationEmailService: CodeConfirmationEmailService,
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private loggerService: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.codeConfirmationEmailFormBuilder();
  }

  codeConfirmationEmailFormBuilder() {
    this.codeConfirmationEmailFormGroup = this.formBuilder.group({
      codeConfirmationEmail: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  onInputChange(event: any): void {
    const input = event.target;
    const maxLength = 6;

    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  sendCodeEmailConfirmation() {
    this.isLoadingButton = true;
    this.buttonDisalbled = true;

    this.codeConfirmationEmailService
      .confirmation(
        this.codeConfirmationEmailFormGroup.value.codeConfirmationEmail
      )
      .subscribe({
        next: () => {
          this.preferencesUserAuthenticateService.getToken().subscribe({
            next: (response) => {
              if (response) {
                const updatedData = {
                  ...response,
                  userVerificationData: {
                    ...response.userVerificationData,
                    verificationTokenEmail: true,
                  },
                };
                this.preferencesUserAuthenticateService
                  .savePreferences(updatedData)
                  .subscribe({
                    next: () => {
                      const loggerGender: TrackAction = {
                        pageView: this.pageView,
                        category: 'user_verify_token_email',
                        event: 'click',
                        label: 'botao:Confirmar codigo email',
                        message: 'email verificado',
                        statusCode: 200,
                        level: 'info',
                      };

                      this.loggerService
                        .info(loggerGender)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                      this.router.navigateByUrl('home/main/post-message');
                    },
                  });
              }
            },
          });
        },
        error: (error) => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.invalidCode = true;

          const loggerGender: TrackAction = {
            pageView: this.pageView,
            category: 'user_verify_token_email',
            event: 'view',
            message: error.message,
            statusCode: 402,
            level: 'error',
          };

          this.loggerService
            .info(loggerGender)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        },
      });
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetAvatarCachePreferences();
    this.userHashPublicService.removeUserHashPublic();
    this.router.navigateByUrl('auth/sign');
  }
}
