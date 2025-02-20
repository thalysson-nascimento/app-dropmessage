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
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Dialog } from '@capacitor/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ChoosePhotoGalleryOrCameraComponent } from '../../../shared/component/choose-photo-gallery-or-camera/choose-photo-gallery-or-camera.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { ExpirationTimerService } from '../../../shared/service/expiration-timer/expiration-timer.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { SharedPostMessageService } from '../../../shared/service/shared-post-message/shared-post-message.service';

const SharedComponents = [ButtonStyleDirective];

@Component({
  standalone: true,
  imports: [...SharedComponents, CommonModule],
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
export class TakePictureSharedMessageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  cameraAllowed: boolean = false;
  cameraImage: string | null = null;
  isLoadingButton: boolean = false;
  disabledButton: boolean = false;
  expirationTimer: string = '';
  destroy$: Subject<void> = new Subject<void>();
  pageView: string = 'DatingMatch:TakePictureSharedMessage';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bottomSheet: MatBottomSheet,
    private sharedPostMessageService: SharedPostMessageService,
    private expirationTimerService: ExpirationTimerService,
    private loggerService: LoggerService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
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

  ngAfterViewInit(): void {}

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
  // async requestCameraPermissionAgain() {
  //   await this.checkCameraPermission();
  // }

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

  async postMessage(cameraImage: any) {
    this.isLoadingButton = true;
    this.disabledButton = true;

    const permission = await Camera.checkPermissions();
    if (permission.camera !== 'granted') {
      await this.checkCameraPermission();
      return;
    }

    if (cameraImage && this.cameraAllowed) {
      fetch(cameraImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          const expirationTimer = this.expirationTimer;
          this.sharedPostMessageService
            .postMessage({ file, expirationTimer })
            .subscribe({
              next: () => {
                const logger: TrackAction = {
                  pageView: this.pageView,
                  category: 'take_picture_shared_message:shared_post',
                  event: 'click',
                  label: 'button:compartilhar_post',
                  message: 'Compartilhar post',
                  statusCode: 200,
                  level: 'info',
                };
                this.loggerService
                  .info(logger)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
                this.disabledButton = false;
                this.preferencesUserAuthenticateService
                  .getToken()
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: (response) => {
                      console.log(response?.goldFreeTrialData);
                      const firstPublicationPostMessage =
                        response?.goldFreeTrialData.firstPublicationPostMessage;

                      if (firstPublicationPostMessage === false) {
                        return this.router.navigate([
                          '/home/user-first-publication-post',
                        ]);
                      }

                      return this.router.navigate([
                        '/home/send-message-success',
                      ]);
                    },
                  });
              },
              error: (error) => {
                const logger: TrackAction = {
                  pageView: this.pageView,
                  category: 'take_picture_shared_message:erro_shared_post',
                  event: 'view',
                  message: error.message,
                  statusCode: 500,
                  level: 'error',
                };
                this.loggerService
                  .info(logger)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
                this.disabledButton = false;
              },
              complete: () => {
                this.disabledButton = false;
              },
            });
        });
    }
  }
}
