import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Dialog } from '@capacitor/dialog';
import DOMPurify from 'dompurify';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, delay, takeUntil, timer } from 'rxjs';
import { ChoosePhotoGalleryOrCameraComponent } from '../../../shared/component/choose-photo-gallery-or-camera/choose-photo-gallery-or-camera.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { AboutMe } from '../../../shared/interface/about-me.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { CreateAvatarService } from '../../../shared/service/create-avatar/create-avatar.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { dateOfBirthValidator } from '../../../shared/validators/dateOfBirthValidator.validator';

const SharedComponents = [
  InputCustomDirective,
  ButtonStyleDirective,
  ModalComponent,
  NgxMaskDirective,
];

const CoreModules = [CommonModule, ReactiveFormsModule];

@Component({
  selector: 'app-create-avatar',
  templateUrl: './create-avatar.component.html',
  styleUrls: ['./create-avatar.component.scss'],
  standalone: true,
  imports: [...CoreModules, ...SharedComponents],
  animations: [
    trigger('fadeInOut', [
      state('out', style({ opacity: 0, display: 'none' })),
      transition('out => in', [animate('0.2s ease-in')]),
    ]),
  ],
})
export class CreateAvatarComponent implements OnInit, AfterViewInit, OnDestroy {
  cameraAllowed: boolean = false;
  locationAllowed: boolean = false;
  cameraImage: string | null = null;
  showSnapshot: boolean = false;
  sanitizedSvg!: SafeHtml;
  avatarAndCompletedFormGroup!: FormGroup;
  isLoadingButton: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  @ViewChild('genderModal') genderModal!: ModalComponent;
  @ViewChild('interestsModal') interestsModal!: ModalComponent;
  @ViewChild('modalPhotoNotFound') modalPhotoNotFound!: ModalComponent;
  @ViewChild('modalErrorRequest') modalErrorRequest!: ModalComponent;

  typeGender: string = '';
  typeInterests: string = '';
  pageView: string = 'DatingMatch:CreateAvatar';

  constructor(
    private router: Router,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private loggerService: LoggerService,
    private createAvatarService: CreateAvatarService,
    private cacheAvatarService: CacheAvatarService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private userHashPublicService: UserHashPublicService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit() {
    this.loadSvgUrl();
    this.checkCameraPermission();
    this.avatarAndComlpetedDataFormBuilder();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  avatarAndComlpetedDataFormBuilder() {
    this.avatarAndCompletedFormGroup = this.formBuilder.group({
      dateOfBirth: [
        '',
        [Validators.required, Validators.minLength(8), dateOfBirthValidator()],
      ],
      gender: ['', [Validators.required]],
      interests: ['', [Validators.required]],
    });
  }

  openModalGender() {
    this.genderModal.openDialog();
  }

  openModalInterests() {
    this.interestsModal.openDialog();
  }

  selectGender(selectedTypeGender: string) {
    this.typeGender = selectedTypeGender;
    this.avatarAndCompletedFormGroup
      .get('gender')
      ?.setValue(selectedTypeGender);
    // Fecha o modal após a seleção
    this.genderModal.closeDialog();
  }

  selectInterests(selectedInterests: string) {
    this.typeInterests = selectedInterests;
    this.avatarAndCompletedFormGroup
      .get('interests')
      ?.setValue(selectedInterests);
    // Fecha o modal após a seleção
    this.interestsModal.closeDialog();
  }

  ngAfterViewInit(): void {
    this.hideLottieAfterDelay();
  }

  async loadSvgUrl() {
    const response = await fetch(
      'assets/icon-static/icon-completo-profile.svg'
    );
    const svgText = await response.text();
    const cleanSvg = DOMPurify.sanitize(svgText);

    this.sanitizedSvg = this.domSanitizer.bypassSecurityTrustHtml(cleanSvg);
  }

  hideLottieAfterDelay(): void {
    timer(100)
      .pipe(delay(100))
      .subscribe(() => {
        this.zone.run(() => {
          this.showSnapshot = true;
        });
      });
  }

  async checkCameraPermission() {
    const permission = await Camera.checkPermissions();

    if (permission.camera === 'granted') {
      this.cameraAllowed = true;
      return; // Não continua, pois a permissão já foi concedida
    }

    const permissionRequest = await Camera.requestPermissions({
      permissions: ['camera'],
    });

    if (permissionRequest.camera === 'granted') {
      const logger: TrackAction = {
        pageView: this.pageView,
        category: 'user_create_avatar',
        event: 'click',
        label: 'button:camera_alow',
        message: 'permissao concedida para camera',
        statusCode: 200,
        level: 'info',
      };

      this.loggerService
        .info(logger)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
      this.cameraAllowed = true;
    } else {
      this.cameraAllowed = false;

      const logger: TrackAction = {
        pageView: this.pageView,
        category: 'user_create_avatar',
        event: 'click',
        label: 'button:camera_denied',
        message: 'permissao nao concedida para camera',
        statusCode: 402,
        level: 'warn',
      };

      this.loggerService
        .info(logger)
        .pipe(takeUntil(this.destroy$))
        .subscribe();

      await this.showCameraPermissionModal();
    }
  }

  async showCameraPermissionModal() {
    const { value } = await Dialog.confirm({
      title: 'Permissão de Câmera',
      message:
        'Para compartilhar um post, é necessário que você permita o uso da câmera do seu dispositivo. Deseja permitir agora?',
      okButtonTitle: 'Permitir',
      cancelButtonTitle: 'Cancelar',
    });

    if (value) {
      const permissionRequest = await Camera.requestPermissions({
        permissions: ['camera'],
      });

      if (permissionRequest.camera === 'granted') {
        this.cameraAllowed = true;
      } else {
        this.cameraAllowed = false;
      }
    } else {
      console.log('Permissão negada pelo usuário.');
    }
  }

  async takePhoto() {
    if (this.cameraAllowed) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      this.cameraImage = image.webPath || null;
    }
  }

  async requestCameraPermissionAgain() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_create_avatar',
      event: 'click',
      label: 'button:Permitir uso de câmera',
      message: 'permitir uso da câmera',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();
    await this.checkCameraPermission();
  }

  goToPostList() {
    this.router.navigate(['/home']);
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(
      ChoosePhotoGalleryOrCameraComponent
    );

    bottomSheetRef.instance.imageSelected.subscribe(
      (imagePath: string | null) => {
        this.cameraImage = imagePath;
      }
    );
  }

  createAvatarAndCompletedData() {
    if (this.avatarAndCompletedFormGroup.valid) {
      if (this.cameraImage === null) {
        this.modalPhotoNotFound.openDialog();
        return;
      }

      if (!this.cameraAllowed) {
        this.showCameraPermissionModal();
        return;
      }
    }
  }

  completeDataFlow(cameraImage: any) {
    if (cameraImage && this.cameraAllowed) {
      this.isLoadingButton = true;
      fetch(cameraImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          const userCompletedDataForm =
            this.avatarAndCompletedFormGroup.getRawValue() as AboutMe;

          this.createAvatarService
            .avatar({
              file,
              dateOfBirth: userCompletedDataForm.dateOfBirth,
              gender: userCompletedDataForm.gender,
              interests: userCompletedDataForm.interests,
            })
            .subscribe({
              next: (response) => {
                this.cacheAvatarService.setAvatarCachePreferences(response);

                this.preferencesUserAuthenticateService.getToken().subscribe({
                  next: (response) => {
                    if (response) {
                      const updatedData = {
                        ...response,
                        userVerificationData: {
                          ...response.userVerificationData,
                          isUploadAvatar: true,
                        },
                      };

                      this.preferencesUserAuthenticateService
                        .savePreferences(updatedData)
                        .subscribe({
                          next: () => {
                            this.isLoadingButton = false;
                            const loggerGender: TrackAction = {
                              pageView: this.pageView,
                              category: 'user_create_avatar',
                              event: 'click',
                              label: 'modal:Como você se identifica',
                              message: userCompletedDataForm.gender,
                              statusCode: 200,
                              level: 'info',
                            };

                            this.loggerService
                              .info(loggerGender)
                              .pipe(takeUntil(this.destroy$))
                              .subscribe();

                            const loggerInterest: TrackAction = {
                              pageView: this.pageView,
                              category: 'user_create_avatar',
                              event: 'click',
                              label: 'modal:Interesses',
                              message: userCompletedDataForm.interests,
                              statusCode: 200,
                              level: 'info',
                            };

                            this.loggerService
                              .info(loggerInterest)
                              .pipe(takeUntil(this.destroy$))
                              .subscribe();
                            this.router.navigateByUrl('home/post-messages');
                          },
                        });
                    }
                  },
                });
              },
              error: (error) => {
                this.isLoadingButton = false;

                const loggerInterest: TrackAction = {
                  pageView: this.pageView,
                  category: 'user_create_avatar',
                  event: 'view',
                  message: error.message,
                  statusCode: 402,
                  level: 'error',
                };

                this.loggerService
                  .info(loggerInterest)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();

                this.modalErrorRequest.openDialog();
              },
              complete: () => {
                this.isLoadingButton = false;
              },
            });
        });
    }
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetAvatarCachePreferences();
    this.userHashPublicService.removeUserHashPublic();
    this.router.navigateByUrl('auth/sign');
  }
}
