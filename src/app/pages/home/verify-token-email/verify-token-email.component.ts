import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';

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

  constructor(private formBuilder: FormBuilder) {}

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
    console.log('clicado');
  }
}
