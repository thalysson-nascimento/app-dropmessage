import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { CodeConfirmationEmailService } from '../../../shared/service/code-confirmation-email/code-confirmation-email.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  ButtonStyleDirective,
  LoadingComponent,
  InputCustomDirective,
];

const CoreModule = [CommonModule, ReactiveFormsModule];

@Component({
  selector: 'app-verify-token-email',
  templateUrl: './verify-token-email.component.html',
  styleUrls: ['./verify-token-email.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class VerifyTokenEmailComponent implements OnInit {
  buttonDisalbled: boolean = false;
  isLoadingButton: boolean = false;
  codeConfirmationEmailFormGroup!: FormGroup;
  invalidCode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private codeConfirmationEmailService: CodeConfirmationEmailService,
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService
  ) {}

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
          this.router.navigateByUrl('home/create-avatar');
        },
        error: () => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.invalidCode = true;
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
