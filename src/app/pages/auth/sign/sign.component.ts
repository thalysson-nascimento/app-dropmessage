import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Sign } from '../../../shared/interface/sign.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { LoginService } from '../../../shared/service/sign/sign.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
  LoadingComponent,
  ModalComponent,
];

const CoreModule = [ReactiveFormsModule, NgIf];

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [
    ...SharedComponents,
    ...CoreModule,
    BottomSheetErrorRequestComponent,
  ],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit {
  buttonDisalbled: boolean = false;
  userLoginFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  errorMessage: string = 'error';
  @ViewChild('dialog') modal!: ModalComponent;
  isOpen: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private bottomSheet: MatBottomSheet,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnInit(): void {
    this.userLoginFormBuilder();
  }

  userLoginFormBuilder() {
    this.userLoginFormGroup = this.formBuilder.group({
      email: ['thalysson@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  navigateToSignup() {
    this.router.navigate(['auth/signup']); // Redireciona para a rota signup
  }

  userSign() {
    if (this.userLoginFormGroup.valid) {
      this.isLoadingButton = true;

      const login = this.userLoginFormGroup.getRawValue() as Sign;

      this.loginService.login(login).subscribe({
        next: (response) => {
          this.isLoadingButton = false;
          this.tokenStorageSecurityRequestService.saveToken(response.token);
          this.cacheAvatarService.setDataAvatarCache(response.avatar);

          if (!response.userVerificationData.isUploadAvatar) {
            return this.router.navigateByUrl('home/create-avatar');
          }

          if (!response.userVerificationData.validatorLocation) {
            return this.router.navigateByUrl('home/user-location');
          }

          return this.router.navigateByUrl('home/post-messages');
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
}
