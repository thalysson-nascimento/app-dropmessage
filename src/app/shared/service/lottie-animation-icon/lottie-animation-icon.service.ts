import { Injectable } from '@angular/core';
import lottie from 'lottie-web';
import { LottieAnimationOptions } from '../../interface/lottie-animation-options.interface';

@Injectable({
  providedIn: 'root',
})
export class LottieAnimationIconService {
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
}
