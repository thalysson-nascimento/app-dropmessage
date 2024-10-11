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
import { Subject, delay, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { Post } from '../../../shared/interface/post';
import { PostService } from '../../../shared/service/post/post.service';

register();

interface LottieAnimationOptions {
  pathIconAnimation: string;
  idElement: string;
  loop?: boolean;
  autoplay?: boolean;
  onClick?: boolean;
}

@Component({
  selector: 'app-post-messages',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './post-messages.component.html',
  styleUrl: './post-messages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  posts!: Post[];
  animation: any;
  iconAnimationCamera: any;
  mySwiper: any;
  iconAnimationNoMatch: any;
  showLikeButton: boolean = true;
  isLoaded: boolean = false;
  likePostMessageWhitHeart!: Post;
  private likeButtonClicked: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

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
        this.loadLottieAnimation({
          pathIconAnimation: 'camera.json',
          idElement: 'lottie-icon-camera',
          loop: false,
          autoplay: true,
        });

        this.loadLottieAnimation({
          pathIconAnimation: 'loading.json',
          idElement: 'lottie-icon-is-loading',
          loop: true,
          autoplay: true,
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

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

          this.loadFistPostMessageForLikeHeartButton(this.mySwiper.activeIndex);

          this.mySwiper.on('slideChangeTransitionEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;

            if (activeIndex > 0 && activeIndex <= this.posts.length) {
              // Apenas remove o post se o slide não foi trocado pelo clique no botão de like
              if (!this.likeButtonClicked) {
                const postToRemove = this.posts[activeIndex - 1];

                if (postToRemove && postToRemove.id !== 'no-matches') {
                  this.removePostFromSwiper(postToRemove);
                }
              }
              // Reseta a variável após o slide mudar
              this.likeButtonClicked = false;
            }
          });

          this.mySwiper.on('slideChange', () => {
            console.log('slideChange');
            const activeIndex = this.mySwiper.activeIndex;

            const likePostSwiper = this.posts[activeIndex];

            if (likePostSwiper && likePostSwiper.id !== 'no-matches') {
              this.likePostMessageWhitHeart = likePostSwiper;
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

  loadFistPostMessageForLikeHeartButton(activeIndex: any) {
    const activeIndexSwiper = activeIndex;
    const likeHeartPost = this.posts[activeIndexSwiper];
    this.likePostMessageWhitHeart = likeHeartPost;
  }

  loadPostService() {
    this.postService
      .listPost()
      .pipe(takeUntil(this.destroy$), delay(2000))
      .subscribe({
        next: (response) => {
          this.posts = response.data;

          console.log('===>', this.posts);

          this.posts.push({
            id: 'no-matches',
            image: 'Você não tem mais matchs na sua localidade',
            expirationTimer: '',
            typeExpirationTimer: '',
          });

          this.isLoaded = true;
          this.loadLottieAnimationIcon();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  loadLottieAnimationIcon() {
    setTimeout(() => {
      const lottieContainerElement =
        document.querySelector<HTMLElement>('#lottie-container');

      if (lottieContainerElement) {
        this.zone.runOutsideAngular(() => {
          this.loadLottieAnimation({
            pathIconAnimation: 'like-heart.json',
            idElement: 'lottie-container',
            loop: false,
            autoplay: false,
            onClick: true,
          });

          this.loadLottieAnimation({
            pathIconAnimation: 'no-macth.json',
            idElement: 'lottie-icon-no-match',
            loop: true,
            autoplay: true,
          });

          this.initializeSwiper();
        });
      } else {
        console.error('O elemento #lottie-container não existe');
      }
    }, 0);
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

  removePostFromSwiper(post: Post) {
    const postIndex = this.posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1 && post.id !== 'no-matches') {
      this.dislikePostMessage(post);
      this.posts.splice(postIndex, 1); // Remove o post do array
      this.mySwiper.removeSlide(postIndex); // Remove o slide correspondente
      this.mySwiper.update();
    } else {
      console.log('Post não encontrado ou é o "no-matches"');
    }
  }

  likePostMessage() {
    console.log('Curtiu o post:', this.likePostMessageWhitHeart);
    if (this.mySwiper) {
      this.likeButtonClicked = true;

      this.mySwiper.slideNext();

      setTimeout(() => {
        const activeIndex = this.mySwiper.activeIndex;
        const postToRemove = this.posts[activeIndex - 1];

        if (postToRemove && postToRemove.id !== 'no-matches') {
          this.removePostFromSwiperWithLikeButton(postToRemove);
        }
      }, 100);
    }
  }
  removePostFromSwiperWithLikeButton(post: Post) {
    const postIndex = this.posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1 && post.id !== 'no-matches') {
      this.posts.splice(postIndex, 1); // Remove o post do array
      this.mySwiper.removeSlide(postIndex); // Remove o slide correspondente
      this.mySwiper.update();
    } else {
      console.log('Post não encontrado ou é o "no-matches"');
    }
  }

  dislikePostMessage(post: Post) {
    console.log('Descurtiu o post:', post);
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
  }

  goToListSettings() {
    this.router.navigateByUrl('home/list-settings');
  }
}
