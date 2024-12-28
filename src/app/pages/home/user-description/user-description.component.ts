import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CompleteDescriptionWithIA } from '../../../shared/service/complete-description-with-ia/complete-description-with-ia.service';
import { UserDescriptionService } from '../../../shared/service/user-description/user-description.service';
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
  buttonDisalbled: boolean = false;
  isLoadingButton: boolean = false;
  errorRequest: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private completeDescriptionWithIA: CompleteDescriptionWithIA,
    private userDescriptionService: UserDescriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createUserDescriptionFormBuilder();
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value: string) => {
        if (value.length === 0) {
          this.showUserDescriptionComplete = false;
          this.showAlertUserDescription = false;
          return;
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
          this.completeDescriptionWithIA.complete(value).subscribe({
            next: (response) => {
              this.showUserDescriptionComplete = true;
              this.showAlertUserDescription = false;
              this.userDescriptionCompleted = response.userDescriprition;
            },
            error: (error) => {
              this.erroCompletedUserDescription = true;
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
      const userDescription =
        this.userDescriptionFormGroup.get('userDescription')?.value;
      this.userDescriptionService.description(userDescription).subscribe({
        next: () => {
          this.buttonDisalbled = true;
          this.isLoadingButton = true;
          this.router.navigateByUrl('home/post-messages');
        },
        error: () => {
          this.errorRequest = true;
        },
      });
    }
  }

  applyDescriptionForm() {
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.setValue(this.userDescriptionCompleted);
    this.aplicationUserDescriptionCompleted = true;
  }
}
