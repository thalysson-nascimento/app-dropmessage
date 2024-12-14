import { Injectable } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';
import { LottieAnimationOptions } from '../../interface/lottie-animation-options.interface';

@Injectable({
  providedIn: 'root',
})
export class LottieAnimationIconService {
  private animations: Map<string, AnimationItem> = new Map();

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

      // Armazena a animação no mapa
      this.animations.set(idElement, animation);

      if (onClick) {
        animationContainer.addEventListener('click', () => {
          animation.goToAndPlay(0, true);
        });
      }
    } else {
      console.error(`Elemento com ID ${idElement} não encontrado.`);
    }
  }

  destroyAnimation(idElement: string): void {
    const animation = this.animations.get(idElement);
    if (animation) {
      animation.destroy();
      this.animations.delete(idElement);
    } else {
      console.warn(
        `Animação com ID ${idElement} não encontrada para destruição.`
      );
    }
  }

  destroyAllAnimations(): void {
    this.animations.forEach((animation, idElement) => {
      animation.destroy();
      this.animations.delete(idElement);
    });
  }
}
