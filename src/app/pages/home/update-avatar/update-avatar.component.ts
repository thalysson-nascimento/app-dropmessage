import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { ChoosePhotoGalleryOrCameraComponent } from '../../../shared/component/choose-photo-gallery-or-camera/choose-photo-gallery-or-camera.component';
import { FeedbackOverlayComponent } from '../../../shared/component/feedback-overlay/feedback-overlay.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { SpinnerComponent } from '../../../shared/component/spinner/spinner.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { AppPlatform } from '../../../shared/enums/app-platform.enum';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { UpdateAvatarService } from '../../../shared/service/update-avatar/update-avatar.service';

const SharedComponents = [
  ButtonDirective,
  SpinnerComponent,
  ModalComponent,
  FeedbackOverlayComponent,
  TranslateModule,
];

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss'],
  imports: [...SharedComponents],
  standalone: true,
})
export class UpdateAvatarComponent implements OnInit {
  cameraAllowed: boolean = false;
  cameraImage: string | null = null;
  isLoadingButton: boolean = false;
  disabledButton: boolean = false;
  expirationTimer: string = '';
  destroy$: Subject<void> = new Subject<void>();
  pageView: string = 'DatingMatch:TakePictureSharedMessage';
  selectedDuration = 'addThirtyMin';
  showTimerSelected = '30m';

  @ViewChild('modal') modal!: ModalComponent;

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private updateAvatarService: UpdateAvatarService,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.checkCameraPermission();
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
    if (!this.isLoadingButton) {
      const bottomSheetRef = this.bottomSheet.open(
        ChoosePhotoGalleryOrCameraComponent
      );

      bottomSheetRef.instance.imageSelected.subscribe(
        (imagePath: string | null) => {
          this.cameraImage = imagePath;
        }
      );
    }
  }

  goBack() {
    this.router.navigateByUrl('home/user-data');
  }

  async updateAvatar(imagePath: any) {
    this.isLoadingButton = true;
    this.disabledButton = true;
    const file = await this._webPathToFile(imagePath);

    this.updateAvatarService.update(file).subscribe({
      next: (response) => {
        this.isLoadingButton = false;
        this.disabledButton = false;

        this.cacheAvatarService
          .updateAvatarCachePreferences({
            image: response.avatarUrl,
            createdAt: new Date(),
          })
          .subscribe();

        this.router.navigateByUrl('home/user-data');
      },
      error: () => {
        this.isLoadingButton = false;
        this.disabledButton = false;
        this.modal.open();
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

  tryAgain() {
    this.modal.close();
    this.updateAvatar(this.cameraImage);
  }

  closeModal() {
    this.modal.close();
  }
}
