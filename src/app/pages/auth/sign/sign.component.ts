import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { Sign } from '../../../shared/interface/sign.interface';
import { LoginService } from '../../../shared/service/sign/sign.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
  LoadingComponent,
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.userLoginFormBuilder();
  }

  userLoginFormBuilder() {
    this.userLoginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
          console.log(response);
        },
        error: (responseError: HttpErrorResponse) => {
          this.isLoadingButton = false;
          console.log(responseError.error.message.message);
          this.openBottomSheet(
            'Ops, ocorreu um erro.',
            responseError.error.message.message
          );
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
}
