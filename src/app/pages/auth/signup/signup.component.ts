import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { currentEnvironment } from '../../../../environment.config';
import { BottomSheetErrorRequestComponent } from '../../../shared/component/bottom-sheet/bottom-sheet-error-request.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CreateAccount } from '../../../shared/interface/create-account.interface';
import { CreateAccountService } from '../../../shared/service/create-account/create-account.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
];

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

  constructor(
    private router: Router,
    private createAccountService: CreateAccountService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl);
    this.createAccountFormBuilder();
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

      console.log(dataCreateAccountUser);

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
