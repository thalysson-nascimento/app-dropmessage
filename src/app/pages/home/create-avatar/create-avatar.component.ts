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
import { Subject, delay, timer } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { ChoosePhotoGalleryOrCameraComponent } from '../../../shared/component/choose-photo-gallery-or-camera/choose-photo-gallery-or-camera.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { ListStyleDirective } from '../../../shared/directives/list-style/list-style.directive';
import { CreateAvatarAndDataComplete } from '../../../shared/interface/create-avatar-and-data-complete.interface';
import { DataCompletedService } from '../../../shared/service/data-completed/data-completed.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
  ModalComponent,
  ListStyleDirective,
];

interface LottieAnimationOptions {
  pathIconAnimation: string;
  idElement: string;
  loop?: boolean;
  autoplay?: boolean;
  onClick?: boolean;
}

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
  typeGender: string = '';
  typeInterests: string = '';

  constructor(
    private router: Router,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private dataCompletedService: DataCompletedService
  ) {}

  ngOnInit() {
    console.log(currentEnvironment.baseURL);
    this.loadSvgUrl();
    this.checkCameraPermission();
    this.avatarAndComlpetedDataFormBuilder();
  }

  avatarAndComlpetedDataFormBuilder() {
    this.avatarAndCompletedFormGroup = this.formBuilder.group({
      dateOfBirth: ['', [Validators.required, Validators.minLength(10)]],
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
    console.log(selectedTypeGender);
    this.typeGender = selectedTypeGender;
    this.avatarAndCompletedFormGroup
      .get('gender')
      ?.setValue(selectedTypeGender);
    // Fecha o modal após a seleção
    this.genderModal.closeDialog();
  }

  selectInterests(selectedInterests: string) {
    console.log(selectedInterests);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.cameraAllowed = true;
    } else {
      this.cameraAllowed = false;
      await this.showCameraPermissionModal();
    }
  }

  async showCameraPermissionModal() {
    const { value } = await Dialog.confirm({
      title: 'Permissão de Câmera',
      message:
        'Para fazer um post, é necessário que você permita o uso da câmera do seu dispositivo. Deseja permitir agora?',
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

  teste() {
    console.log('oi');
  }

  createAvatarAndCompletedData() {
    if (this.avatarAndCompletedFormGroup.valid) {
      console.log(this.avatarAndCompletedFormGroup.getRawValue());
      const createAavatar =
        this.avatarAndCompletedFormGroup.getRawValue() as CreateAvatarAndDataComplete;

      console.log('--->', this.cameraImage);
      console.log('--->', createAavatar);
    }
  }

  completeDataFlow(cameraImage: any) {
    // this.router.navigateByUrl('home/post-messages');
    if (cameraImage) {
      fetch(cameraImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          const userCompletedDataForm =
            this.avatarAndCompletedFormGroup.getRawValue() as CreateAvatarAndDataComplete;
          console.log('====>', file);
          console.log('====>', userCompletedDataForm);

          this.dataCompletedService
            .dataCompleted({
              file,
              dateOfBirth: userCompletedDataForm.dateOfBirth,
              gender: userCompletedDataForm.gender,
              interests: userCompletedDataForm.interests,
            })
            .subscribe({
              next: (response) => {
                console.log(response);
                this.router.navigate(['home/post-messages']);
                this.isLoadingButton = true;
              },
              error: (error) => {
                console.log('Erro ao enviar mensagem:', error);
              },
            });
        });
    }
  }
}
