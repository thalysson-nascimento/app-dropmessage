import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { UserDescriptionCompletedService } from '../../../shared/service/user-description-complete/user-description-completed.service';
import { noOnlySpacesValidator } from '../../../shared/validators/noOnlySpacesValidator.validator';

const SharedComponent = [ButtonStyleDirective, InputCustomDirective];
const CoreModule = [ReactiveFormsModule, CommonModule];

@Component({
  selector: 'app-user-description',
  templateUrl: './user-description.component.html',
  styleUrls: ['./user-description.component.scss'],
  standalone: true,
  imports: [...SharedComponent, ...CoreModule],
})
export class UserDescriptionComponent implements OnInit {
  userDescriptionFormGroup!: FormGroup;
  showAlertUserDescription: boolean = false;
  showUserDescriptionComplete: boolean = false;
  userDescriptionCompleted: string = '';
  erroCompletedUserDescription: boolean = false;
  aplicationUserDescriptionCompleted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userDescriptionCompletedService: UserDescriptionCompletedService
  ) {}

  ngOnInit() {
    this.createUserDescriptionFormBuilder();
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value: string) => {
        console.log('---<', value.length);

        if (value.length === 0) {
          this.showUserDescriptionComplete = false;
          this.showAlertUserDescription = false;
          return; // Interrompe o processamento para evitar reescrever o estado
        }

        if (value.length > 80) {
          this.showAlertUserDescription = false;
        }

        if (value.length < 80) {
          this.showAlertUserDescription = true;
          this.showUserDescriptionComplete = false;
        } else if (
          value.length > 80 &&
          !this.aplicationUserDescriptionCompleted
        ) {
          this.userDescriptionCompletedService.complete(value).subscribe({
            next: (response) => {
              this.showUserDescriptionComplete = true;
              this.showAlertUserDescription = false;
              this.userDescriptionCompleted = response.userDescriprition;
            },
            error: (error) => {
              this.erroCompletedUserDescription = true;
              console.log('===>', error);
            },
          });
        }
      });
  }

  createUserDescriptionFormBuilder() {
    this.userDescriptionFormGroup = this.formBuilder.group({
      userDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(200),
          noOnlySpacesValidator(),
        ],
      ],
    });
  }

  saveUserDescription() {
    if (this.userDescriptionFormGroup.valid) {
      console.log('===>', this.userDescriptionFormGroup.value);
    }
  }

  applyDescriptionForm() {
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.setValue(this.userDescriptionCompleted);
    this.aplicationUserDescriptionCompleted = true;
  }
}
