import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Inject, PLATFORM_ID } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { default as lottie } from 'lottie-web';
import { register } from 'swiper/element/bundle';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { PostService } from '../../../shared/service/post/post.service';

register();

@Component({
  selector: 'app-post-messages',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './post-messages.component.html',
  styleUrl: './post-messages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  posts!: Array<{ id: string; path: string; name: string }>;
  animation: any;
  iconAnimationCamera: any;
  mySwiper: any;
  iconAnimationNoMatch: any;
  showLikeButton: boolean = true;

  constructor(
    private postService: PostService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPostService();
    console.log('PostMessagesComponent inicializado', this.posts);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.loadAnimationIconHeart('like-heart.json', 'lottie-container');
        this.loadAnimationIconCamera('camera.json', 'lottie-icon-camera');
        this.loadAnimationIconNoMacth('no-macth.json', 'lottie-icon-no-match');
        this.initializeSwiper();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mySwiper) {
      this.mySwiper.off('slideChangeTransitionEnd');
      this.mySwiper.off('reachEnd');
      this.mySwiper.destroy(true, true);
      this.mySwiper = null;
      console.log('Swiper destruído');
    }
  }

  initializeSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        const swiperContainer = document.querySelector('.mySwiper') as any;

        if (swiperContainer) {
          this.mySwiper = swiperContainer.swiper;

          // Reinicia o swiper no índice correto
          this.mySwiper.slideTo(0, 0, false); // Reseta para o slide inicial

          this.mySwiper.on('slideChangeTransitionEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;

            if (activeIndex > 0) {
              const postToRemove = this.posts[activeIndex - 1];

              setTimeout(() => {
                this.removePost(postToRemove.id);
              }, 300); // Adiciona um pequeno atraso para garantir que a transição seja concluída
            }
          });

          this.mySwiper.on('reachEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;
            console.log(this.posts.length);
            if (activeIndex === this.posts.length - 2) {
              this.zone.run(() => {
                this.showLikeButton = false;
              });
            }
          });
        }
      });
    }
  }

  loadPostService() {
    this.postService.listPost().subscribe((response) => {
      this.posts = response;

      // Adiciona o último slide com a mensagem no final do array
      this.posts.push({
        id: 'no-matches',
        path: '',
        name: 'Você não tem mais matchs na sua localidade',
      });

      // Atualize o swiper após os dados serem carregados
      setTimeout(() => {
        if (this.mySwiper) {
          this.mySwiper.update();
          this.mySwiper.slideTo(0, 0, false); // Certifique-se de que comece no primeiro slide
        }
      }, 0);
    });
  }

  loadAnimationIconHeart(pathIconAnimation: string, idElement: string) {
    const animationContainer = document.getElementById(idElement);
    if (animationContainer) {
      this.animation = lottie.loadAnimation({
        container: animationContainer,
        path: `assets/icon-animation/${pathIconAnimation}`,
        renderer: 'svg',
        loop: false,
        autoplay: false,
      });

      animationContainer.addEventListener('click', () => {
        this.animation.goToAndPlay(0, true);
      });
    }
  }

  loadAnimationIconCamera(pathIconAnimation: string, idElement: string) {
    const animationContainer = document.getElementById(idElement);
    if (animationContainer) {
      this.iconAnimationCamera = lottie.loadAnimation({
        container: animationContainer,
        path: `assets/icon-animation/${pathIconAnimation}`,
        renderer: 'svg',
        loop: false,
        autoplay: true,
      });
    }
  }

  loadAnimationIconNoMacth(pathIconAnimation: string, idElement: string) {
    const animationContainer = document.getElementById(idElement);
    if (animationContainer) {
      this.iconAnimationNoMatch = lottie.loadAnimation({
        container: animationContainer,
        path: `assets/icon-animation/${pathIconAnimation}`,
        renderer: 'svg',
        loop: true,
        autoplay: true,
      });
    }
  }

  removePost(postId: string) {
    const postIndex = this.posts.findIndex((post) => post.id === postId);

    if (postIndex !== -1 && postId !== 'no-matches') {
      this.posts.splice(postIndex, 1);

      // Desativa transição ao remover o slide
      this.mySwiper.setTransition(0);

      setTimeout(() => {
        this.mySwiper.removeSlide(postIndex);
        this.mySwiper.update();

        // Reativa transição
        this.mySwiper.setTransition(300); // Ou o valor de tempo de transição que você está usando
      }, 0);
    }
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
  }

  goToListSettings() {
    this.router.navigateByUrl('home/list-settings');
  }
}
