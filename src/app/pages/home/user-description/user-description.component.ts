import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
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
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { UserDescriptionService } from '../../../shared/service/user-description/user-description.service';

@Component({
  selector: 'app-user-description',
  templateUrl: './user-description.component.html',
  styleUrls: ['./user-description.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    ButtonDirective,
    ModalComponent,
    FeedbackOverlayComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class UserDescriptionComponent implements OnInit, OnDestroy {
  public descriptionFormGroup!: FormGroup;

  public bioLength: number = 0;
  public buttonDisalbled: boolean = false;
  public buttonLoading: boolean = false;
  public errorRequest: boolean = false;
  public pageView: string = 'DatingMatch:UserDescription';

  private destroy$ = new Subject<void>();

  @ViewChild('modalDescription') modalDescription!: ModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private userDescriptionService: UserDescriptionService,
    private router: Router,
    private loggerService: LoggerService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit(): void {
    this.createUserDescriptionFormBuilder();
    this.listenBioChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createUserDescriptionFormBuilder(): void {
    this.descriptionFormGroup = this.formBuilder.group({
      userDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(200),
        ],
      ],
    });
  }

  private listenBioChanges(): void {
    this.descriptionFormGroup
      .get('userDescription')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.bioLength = value?.length || 0;
      });
  }

  saveBio(): void {
    if (this.descriptionFormGroup.invalid) {
      this.descriptionFormGroup.markAllAsTouched();
      return;
    }

    this.buttonDisalbled = true;
    this.buttonLoading = true;
    this.errorRequest = false;

    const userDescription =
      this.descriptionFormGroup.get('userDescription')?.value;

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
          .subscribe();

        this.preferencesUserAuthenticateService.getToken().subscribe({
          next: (response) => {
            if (response) {
              const updatedData = {
                ...response,
                userVerificationData: {
                  ...response.userVerificationData,
                  bio: true,
                },
              };

              this.preferencesUserAuthenticateService
                .savePreferences(updatedData)
                .subscribe({
                  next: () => {
                    this.router.navigateByUrl('/home/main/post-message');
                  },
                });

              return;
            }

            this.router.navigateByUrl('/home/main/post-message');
          },
        });
      },
      error: (error) => {
        this.errorRequest = true;
        this.buttonDisalbled = false;
        this.buttonLoading = false;

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
      },
    });
  }

  closeModal() {
    this.modalDescription.close();
  }
}
