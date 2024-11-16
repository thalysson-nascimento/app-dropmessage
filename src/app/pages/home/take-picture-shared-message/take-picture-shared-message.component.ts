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
import { ExpirationTimerService } from '../../../shared/service/expiration-timer/expiration-timer.service';
import { SharedPostMessageService } from '../../../shared/service/shared-post-message/shared-post-message.service';

const SharedComponents = [ButtonStyleDirective];

// interface LottieAnimationOptions {
//   pathIconAnimation: string;
//   idElement: string;
//   loop?: boolean;
//   autoplay?: boolean;
//   onClick?: boolean;
// }

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
  // locationAllowed: boolean = false;
  // cameraImage: string | null = null;
  // showLottieIcon: boolean = true;
  // showSnapshot: boolean = false;
  disabledButton: boolean = false;
  expirationTimer: string = '';
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
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
    // console.log(currentEnvironment.baseURL);
    // this.checkCameraPermission();
    this.expirationTimerService
      .getExpirationTimer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((expirationTimer: string) => {
        this.expirationTimer = expirationTimer;
      });
  }

  ngAfterViewInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.zone.runOutsideAngular(() => {
    //     this.loadLottieAnimation({
    //       pathIconAnimation: 'camera-register.json',
    //       idElement: 'lottie-icon-camera-register',
    //       loop: false,
    //       autoplay: true,
    //     });
    //   });
    // }
    // this.hideLottieAfterDelay();
  }

  // hideLottieAfterDelay(): void {
  //   timer(3000).subscribe(() => {
  //     this.zone.run(() => {
  //       this.showLottieIcon = false;
  //     });
  //   });

  //   // Aguardar 1 segundo após o Lottie desaparecer antes de mostrar o snapshot
  //   timer(3000) // 2s para ocultar o Lottie + 1s de pausa
  //     .pipe(delay(1000)) // Adicionando o delay de 1 segundo
  //     .subscribe(() => {
  //       this.zone.run(() => {
  //         this.showSnapshot = true;
  //       });
  //     });
  // }

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

  // Tirar foto usando a câmera
  // async takePhoto() {
  //   if (this.cameraAllowed) {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Uri,
  //     });

  //     this.cameraImage = image.webPath || null;
  //   }
  // }

  // Pedir permissão novamente
  async requestCameraPermissionAgain() {
    await this.checkCameraPermission();
  }

  // loadLottieAnimation(options: LottieAnimationOptions): void {
  //   const {
  //     pathIconAnimation,
  //     idElement,
  //     loop = false,
  //     autoplay = false,
  //     onClick = false,
  //   } = options;

  //   const animationContainer = document.getElementById(idElement);
  //   if (animationContainer) {
  //     const animation = lottie.loadAnimation({
  //       container: animationContainer,
  //       path: `assets/icon-animation/${pathIconAnimation}`,
  //       renderer: 'svg',
  //       loop,
  //       autoplay,
  //     });

  //     if (onClick) {
  //       animationContainer.addEventListener('click', () => {
  //         animation.goToAndPlay(0, true);
  //       });
  //     }
  //   } else {
  //     console.error(`Elemento com ID ${idElement} não encontrado.`);
  //   }
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

  postMessage(cameraImage: any) {
    this.isLoadingButton = true;
    this.disabledButton = true;
    if (cameraImage && this.cameraAllowed) {
      fetch(cameraImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          const expirationTimer = this.expirationTimer;

          console.log('===>', file);
          console.log('------>', expirationTimer);

          this.sharedPostMessageService
            .postMessage({ file, expirationTimer })
            .subscribe({
              next: () => {
                this.disabledButton = false;
                this.router.navigate(['/home/send-message-success']);
              },
              error: (error) => {
                console.log('Erro ao enviar mensagem:', error);
                this.disabledButton = false;
              },
              complete: () => {
                this.disabledButton = false;
              },
            });
        });
    }
  }

  // openBottomSheet(): void {
  //   const bottomSheetRef = this.bottomSheet.open(
  //     ChoosePhotoGalleryOrCameraComponent
  //   );

  //   bottomSheetRef.instance.imageSelected.subscribe(
  //     (imagePath: string | null) => {
  //       this.cameraImage = imagePath;
  //     }
  //   );
  // }

  // postMessagePhoto(imageCamera: any) {
  //   if (imageCamera) {
  //     fetch(imageCamera)
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         const file = new File([blob], 'image.png', { type: 'image/png' });
  //         const expirationTimer = this.expirationTimer;

  //         console.log('===>', file, expirationTimer);

  //         this.sharedPostMessageService
  //           .postMessage({ file, expirationTimer })
  //           .subscribe({
  //             next: () => {
  //               this.disabledButton = true;
  //               this.router.navigate(['/home/send-message-success']);
  //             },
  //             error: (error) => {
  //               console.log('Erro ao enviar mensagem:', error);
  //               this.disabledButton = true;
  //             },
  //           });
  //       });
  //   }
  // }
}
