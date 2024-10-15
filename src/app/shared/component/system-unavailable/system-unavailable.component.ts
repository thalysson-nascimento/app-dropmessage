import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { default as lottie } from 'lottie-web';
import { SecondaryButtonDirective } from '../../directives/secundary-button/secundary-button.directive';

interface LottieAnimationOptions {
  pathIconAnimation: string;
  idElement: string;
  loop?: boolean;
  autoplay?: boolean;
  onClick?: boolean;
}

const SharedComponents = [SecondaryButtonDirective];

@Component({
  selector: 'app-system-unavailable',
  templateUrl: './system-unavailable.component.html',
  styleUrls: ['./system-unavailable.component.scss'],
  imports: [...SharedComponents],
  standalone: true,
})
export class SystemUnavailableComponent implements OnInit, AfterViewInit {
  @Output() clickLoading = new EventEmitter<string | null>();
  @Input() infoMessage: string = '';

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.loadLottieAnimation({
          pathIconAnimation: 'system-failure.json',
          idElement: 'lottie-icon-system-unavailable',
          loop: true,
          autoplay: true,
        });
      });
    }
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

  tryAgainLoadingPostMessage() {
    this.clickLoading.emit(null);
  }
}
