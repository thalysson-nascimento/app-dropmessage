import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { default as lottie } from 'lottie-web';
import { delay, timer } from 'rxjs';

interface LottieAnimationOptions {
  pathIconAnimation: string;
  idElement: string;
  loop?: boolean;
  autoplay?: boolean;
  onClick?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-take-picture-shared-message',
  templateUrl: './take-picture-shared-message.component.html',
  styleUrls: ['./take-picture-shared-message.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, display: 'flex' })),
      state('out', style({ opacity: 0, display: 'none' })),
      transition('in => out', [animate('1s ease-out')]),
      transition('out => in', [animate('1s ease-in')]),
    ]),
  ],
})
export class TakePictureSharedMessageComponent
  implements OnInit, AfterViewInit
{
  cameraAllowed: boolean = false;
  locationAllowed: boolean = false;
  cameraImage: string | null = null;
  showLottieIcon: boolean = true;
  showSnapshot: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.checkCameraPermission();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.loadLottieAnimation({
          pathIconAnimation: 'camera-register.json',
          idElement: 'lottie-icon-camera-register',
          loop: false,
          autoplay: true,
        });
      });
    }

    this.hideLottieAfterDelay();
  }

  hideLottieAfterDelay(): void {
    timer(3000).subscribe(() => {
      this.zone.run(() => {
        this.showLottieIcon = false;
      });
    });

    // Aguardar 1 segundo após o Lottie desaparecer antes de mostrar o snapshot
    timer(3000) // 2s para ocultar o Lottie + 1s de pausa
      .pipe(delay(1000)) // Adicionando o delay de 1 segundo
      .subscribe(() => {
        this.zone.run(() => {
          this.showSnapshot = true;
        });
      });
  }

  async checkCameraPermission() {
    const permission = await Camera.requestPermissions({
      permissions: ['camera'],
    });

    if (permission.camera === 'granted') {
      this.cameraAllowed = true;
    } else {
      this.cameraAllowed = false;
    }
  }

  // Tirar foto usando a câmera
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

  // Pedir permissão novamente
  async requestCameraPermissionAgain() {
    await this.checkCameraPermission();
  }

  loadLottieAnimation(options: LottieAnimationOptions): void {
    const {
      pathIconAnimation,
      idElement,
      loop = false,
      autoplay = false,
      onClick = false,
    } = options;

    const animationContainer = document.getElementById(idElement);
    if (animationContainer) {
      const animation = lottie.loadAnimation({
        container: animationContainer,
        path: `assets/icon-animation/${pathIconAnimation}`,
        renderer: 'svg',
        loop,
        autoplay,
      });

      if (onClick) {
        animationContainer.addEventListener('click', () => {
          animation.goToAndPlay(0, true);
        });
      }
    } else {
      console.error(`Elemento com ID ${idElement} não encontrado.`);
    }
  }

  goToPostList() {
    this.router.navigate(['/home']);
  }
}
