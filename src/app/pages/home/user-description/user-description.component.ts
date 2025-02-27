import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CompleteDescriptionWithIA } from '../../../shared/service/complete-description-with-ia/complete-description-with-ia.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
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
export class UserDescriptionComponent implements OnInit, OnDestroy {
  userDescriptionFormGroup!: FormGroup;
  showAlertUserDescription: boolean = false;
  showUserDescriptionComplete: boolean = false;
  userDescriptionCompleted: string = '';
  erroCompletedUserDescription: boolean = false;
  aplicationUserDescriptionCompleted: boolean = false;
  buttonDisalbled: boolean = false;
  isLoadingButton: boolean = false;
  errorRequest: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  pageView: string = 'DatingMatch:UserDescription';

  constructor(
    private formBuilder: FormBuilder,
    private completeDescriptionWithIA: CompleteDescriptionWithIA,
    private userDescriptionService: UserDescriptionService,
    private router: Router,
    private loggerService: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.createUserDescriptionFormBuilder();
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.errorRequest = false;
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

  applyDescriptionForm() {
    this.userDescriptionFormGroup
      .get('userDescription')
      ?.setValue(this.userDescriptionCompleted);
    this.aplicationUserDescriptionCompleted = true;

    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_description',
      event: 'click',
      label: 'button:usar descrição',
      message: 'Usar descrição com IA',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();
  }

  saveUserDescription() {
    if (this.userDescriptionFormGroup.valid) {
      this.buttonDisalbled = true;
      this.isLoadingButton = true;
      const userDescription =
        this.userDescriptionFormGroup.get('userDescription')?.value;

      this.userDescriptionService.description(userDescription).subscribe({
        next: () => {
          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_description',
            event: 'click',
            label: 'button:Salvar descrição',
            message: 'Salvar descrição',
            statusCode: 200,
            level: 'info',
          };

          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.router.navigateByUrl('home/post-messages');
              },
            });
        },
        error: (error) => {
          this.errorRequest = true;
          this.showUserDescriptionComplete = false;
          this.showAlertUserDescription = false;

          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_description',
            event: 'click',
            label: 'button:Salvar descrição',
            message: error.message,
            statusCode: 200,
            level: 'error',
          };

          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          this.buttonDisalbled = false;
          this.isLoadingButton = false;
        },
      });
    }
  }
}
