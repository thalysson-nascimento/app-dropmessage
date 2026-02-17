import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';
import { Subject, takeUntil } from 'rxjs';
import { ChoosePhotoGalleryOrCameraComponent } from '../../../shared/component/choose-photo-gallery-or-camera/choose-photo-gallery-or-camera.component';
import { DurationOptionComponent } from '../../../shared/component/duration-option/duration-option.component';
import { SpinnerComponent } from '../../../shared/component/spinner/spinner.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { AppPlatform } from '../../../shared/enums/app-platform.enum';
import { ExpirationTimerService } from '../../../shared/service/expiration-timer/expiration-timer.service';
import { SharedPostMessageService } from '../../../shared/service/shared-post-message/shared-post-message.service';

const SharedComponents = [
  DurationOptionComponent,
  ButtonDirective,
  SpinnerComponent,
];

interface DurationOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  standalone: true,
  imports: [...SharedComponents, CommonModule, TranslateModule],
  selector: 'app-take-picture-shared-message',
  templateUrl: './take-picture-shared-message.component.html',
  styleUrls: ['./take-picture-shared-message.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('out', style({ opacity: 0, display: 'none' })),
      transition('out => in', [animate('0.2s ease-in')]),
    ]),
  ],
})
export class TakePictureSharedMessageComponent implements OnInit, OnDestroy {
  cameraAllowed: boolean = false;
  cameraImage: string | null = null;
  isLoadingButton: boolean = false;
  disabledButton: boolean = false;
  expirationTimer: string = '';
  destroy$: Subject<void> = new Subject<void>();
  pageView: string = 'DatingMatch:TakePictureSharedMessage';
  selectedDuration = 'addThirtyMin';
  showTimerSelected = '30m';

  durations: DurationOption[] = [
    {
      value: 'addThirtyMin',
      label: '30m',
      description: 'Quick',
      icon: 'bolt',
      color: '#facc15',
    },
    {
      value: 'addOneHour',
      label: '1 Hour',
      description: 'Casual',
      icon: 'hourglass_top',
      color: '#3b82f6',
    },
    {
      value: 'addOneday',
      label: '1 Day',
      description: 'Story',
      icon: 'history_toggle_off',
      color: '#8b5cf6',
    },
    {
      value: 'addOneWeek',
      label: '1 week',
      description: 'Destaque',
      icon: 'auto_awesome',
      color: '#f59e0b',
    },
  ];

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private sharedPostMessageService: SharedPostMessageService,
    private expirationTimerService: ExpirationTimerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.checkCameraPermission();
    this.expirationTimerService
      .getExpirationTimer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((expirationTimer: string) => {
        this.expirationTimer = expirationTimer;
      });
  }

  async checkCameraPermission() {
    const permission = await Camera.checkPermissions();

    if (permission.camera !== 'granted') {
      const permissionRequest = await Camera.requestPermissions();

      if (permissionRequest.camera === 'granted') {
        this.cameraAllowed = true;
        return;
      } else {
        this.cameraAllowed = false;
        await this.showCameraPermissionModal();
      }
    } else {
      this.cameraAllowed = true;
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

  goBack() {
    this.router.navigateByUrl('home/main/post-message');
  }

  selectDuration(item: DurationOption) {
    this.showTimerSelected = item.label;
    this.selectedDuration = item.value;
  }

  async sharedPost(imagePath: any) {
    this.isLoadingButton = true;
    this.disabledButton = true;

    const file = await this._webPathToFile(imagePath);

    this.sharedPostMessageService
      .postMessage({ file, expirationTimer: this.selectedDuration })
      .subscribe({
        next: () => {
          this.isLoadingButton = false;
          this.disabledButton = false;
          this.router.navigate(['/home/send-message-success']);
        },
        error: (error) => {
          this.isLoadingButton = false;
          this.disabledButton = false;
          alert(error);
        },
      });
  }

  private async _webPathToFile(path: string): Promise<File> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error('Erro ao converter imagem');
    }

    const blob = await response.blob();

    const extension = blob.type.split('/')[1] || 'jpeg';

    return new File([blob], `image.${extension}`, {
      type: blob.type,
    });
  }

  async openAppSettings() {
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === AppPlatform.ANDROID) {
        await NativeSettings.openAndroid({
          option: AndroidSettings.ApplicationDetails,
        });
      } else if (Capacitor.getPlatform() === AppPlatform.IOS) {
        await NativeSettings.openIOS({
          option: IOSSettings.App,
        });
      }
    } else {
      alert('Open your browser settings to allow camera access.');
    }
  }
}
