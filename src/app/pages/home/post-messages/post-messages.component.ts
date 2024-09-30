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
import { Post } from '../../../shared/interface/post';
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
  isLoaded: boolean = false;

  constructor(
    private postService: PostService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPostService();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.loadAnimationIconCamera('camera.json', 'lottie-icon-camera');
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mySwiper) {
      /**
       * Destroi o Swiper para evitar memory leak.
       * Os eventos `'slideChangeTransitionEnd'` e `'reachEnd'` precisam ser removidos explicitamente,
       * senão o Swiper continuará a emitir eventos mesmo após o componente ter sido destruído.
       * Além disso, o Swiper precisa ser destruído manualmente com o método `destroy()`.
       * O Swiper é criado fora do contexto do Zone.js no método `ngAfterViewInit()`, portanto
       * precisamos acessá-lo e destruí-lo também fora do contexto do Zone.js.
       */
      this.mySwiper.off('slideChangeTransitionEnd');
      this.mySwiper.off('reachEnd');
      this.mySwiper.destroy(true, true);
      this.mySwiper = null;
      console.log('Swiper destruído');
    }
  }

  // initializeSwiper() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.zone.runOutsideAngular(() => {
  //       const swiperContainer = document.querySelector('.mySwiper') as any;

  //       if (swiperContainer) {
  //         this.mySwiper = swiperContainer.swiper;

  //         this.mySwiper.on('slideChangeTransitionEnd', () => {
  //           const activeIndex = this.mySwiper.activeIndex;

  //           if (activeIndex > 0) {
  //             const postToRemove = this.posts[activeIndex - 1];
  //             const currentIndex = this.mySwiper.activeIndex;

  //             this.removePost(postToRemove.id);
  //             this.mySwiper.slideTo(currentIndex - 1);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

  initializeSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        const swiperContainer = document.querySelector('.mySwiper') as any;

        if (swiperContainer) {
          this.mySwiper = swiperContainer.swiper;

          this.mySwiper.on('slideChangeTransitionEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;

            if (activeIndex > 0) {
              const postToRemove = this.posts[activeIndex - 1];

              this.removePost(postToRemove);
            }
          });

          this.mySwiper.on('reachEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;

            if (activeIndex === 0) {
              this.showLikeButton = false;
            }
          });
        }
      });
    }
  }

  loadPostService() {
    this.postService.listPost().subscribe((response) => {
      console.log(response);
      this.posts = response.data;

      this.posts.push({
        id: 'no-matches',
        path: '',
        name: 'Você não tem mais matchs na sua localidade',
      });

      console.log(this.posts);

      this.isLoaded = true;

      setTimeout(() => {
        const lottieContainerElement =
          document.querySelector<HTMLElement>('#lottie-container');

        if (lottieContainerElement) {
          console.log(
            'Elemento #lottie-container existe:',
            lottieContainerElement
          );
          this.zone.runOutsideAngular(() => {
            this.loadAnimationIconHeart('like-heart.json', 'lottie-container');
            this.loadAnimationIconNoMacth(
              'no-macth.json',
              'lottie-icon-no-match'
            );
            this.initializeSwiper();
          });
        } else {
          console.error('O elemento #lottie-container não existe');
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

  removePost(post: Post) {
    const postIndex = this.posts.findIndex((post) => post.id === post.id);

    console.log('realizar requizição em pilha para remover o post:', post);

    if (postIndex !== -1 && post.id !== 'no-matches') {
      this.mySwiper.removeSlide(postIndex);
      this.mySwiper.update();
    }
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
  }

  goToListSettings() {
    this.router.navigateByUrl('home/list-settings');
  }
}
