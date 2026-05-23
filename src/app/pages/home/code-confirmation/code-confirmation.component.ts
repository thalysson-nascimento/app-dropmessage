import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FeedbackOverlayComponent } from '../../../shared/component/feedback-overlay/feedback-overlay.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { SpinnerComponent } from '../../../shared/component/spinner/spinner.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { CodeConfirmationEmailService } from '../../../shared/service/code-confirmation-email/code-confirmation-email.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { ResendCodeConfirmationEmailService } from '../../../shared/service/resend-code-confirmation-email/resend-code-confirmation-email.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

@Component({
  selector: 'app-code-confirmation',
  templateUrl: './code-confirmation.component.html',
  styleUrls: ['./code-confirmation.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ButtonDirective,
    SpinnerComponent,
    ModalComponent,
    FeedbackOverlayComponent,
    SpinnerComponent,
  ],
})
export class CodeConfirmationComponent implements OnInit {
  public form!: FormGroup;
  public disabled: boolean = false;
  public loading: boolean = false;
  public invalidCode: boolean = false;
  public pageView: string = 'DatingMatch:VerifyTokenEmail';
  public destroy$: Subject<void> = new Subject<void>();
  public resending = false;

  public steps = [1, 2, 3];
  public currentStep = 0;

  public email = 'email';

  get otpControls(): FormArray {
    return this.form.get('otp') as FormArray;
  }

  @ViewChild('modal') modal!: ModalComponent;

  constructor(
    private fb: FormBuilder,
    private codeConfirmationEmailService: CodeConfirmationEmailService,
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private loggerService: LoggerService,
    private resendCodeConfirmationEmailService: ResendCodeConfirmationEmailService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      otp: this.fb.array(
        Array(6)
          .fill(0)
          .map(() =>
            this.fb.control('', [
              Validators.required,
              Validators.pattern('[0-9]'),
            ])
          )
      ),
    });
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    const value = rawValue.replace(/\D/g, '');

    if (rawValue !== value) {
      input.value = value;
    }

    if (value.length > 1) {
      input.value = value.charAt(0);
    }

    if (input.value && index < this.otpControls.length - 1) {
      const nextInput = document.querySelectorAll<HTMLInputElement>(
        '.code-confirmation__otp-input'
      )[index + 1];
      nextInput?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (
      event.key === 'Backspace' &&
      !this.otpControls.at(index).value &&
      index > 0
    ) {
      const prevInput = document.querySelectorAll<HTMLInputElement>(
        '.code-confirmation__otp-input'
      )[index - 1];
      prevInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') ?? '';

    if (!pasteData) return;

    const digits = pasteData.replace(/\D/g, '').split('');

    digits.slice(0, this.otpControls.length).forEach((digit, i) => {
      this.otpControls.at(i).setValue(digit);
    });

    event.preventDefault();
  }

  onVerify() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.disabled = true;
    this.loading = true;

    const code = this.otpControls.value.join('');
    console.log('OTP:', code);
    this.codeConfirmationEmailService.confirmation(code).subscribe({
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
        this.loading = false;
        this.disabled = false;
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
        this.modal.open();
      },
    });
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetAvatarCachePreferences();
    this.userHashPublicService.removeUserHashPublic();
    this.router.navigateByUrl('auth/sign');
  }

  onResend() {
    this.resending = true;
    this.form.reset();

    console.log('Resend OTP');
    this.resendCodeConfirmationEmailService.resendConfirmation().subscribe({
      next: (response) => {
        console.log('OTP resent:', response);
        const loggerGender: TrackAction = {
          pageView: this.pageView,
          category: 'user_resend_token_email',
          event: 'click',
          label: 'botao:Reenviar codigo email',
          message: 'codigo de email reenviado',
          statusCode: 200,
          level: 'info',
        };

        this.loggerService
          .info(loggerGender)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
        this.resending = false;
      },
      error: (error) => {
        const loggerGender: TrackAction = {
          pageView: this.pageView,
          category: 'user_resend_token_email',
          event: 'click',
          label: 'botao:Reenviar codigo email',
          message: error.message,
          statusCode: 402,
          level: 'error',
        };

        this.loggerService
          .info(loggerGender)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
        this.resending = false;
      },
    });
  }

  onBack() {
    console.log('Back');
  }

  tryAgain() {
    this.modal.close();
    this.onVerify();
  }

  closeModal() {
    this.modal.close();
  }
}
