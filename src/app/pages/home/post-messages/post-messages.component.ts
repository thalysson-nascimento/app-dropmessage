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
import { Subject } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { Post } from '../../../shared/interface/post';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { PostMessageService } from '../../../shared/service/post/post.service';

register();

const SharedComponent = [LogoDropmessageComponent, SystemUnavailableComponent];

@Component({
  selector: 'app-post-messages',
  standalone: true,
  imports: [NgFor, NgIf, ...SharedComponent],
  templateUrl: './post-messages.component.html',
  styleUrl: './post-messages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  posts!: Post[];
  mySwiper: any;
  showLikeButton: boolean = true;
  isLoaded: boolean = false;
  likePostMessageWhitHeart!: Post;
  showSystemUnavailable: boolean = false;
  textInformationSystemUnavailable: string = '';
  private likeButtonClicked: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private postMessageService: PostMessageService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private lottieAnimationIconService: LottieAnimationIconService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.textInformationSystemUnavailable =
      'No momento estamos com nossos serviço indisponíves, volte novamente mais tarde!';
    if (isPlatformBrowser(this.platformId)) {
      this.loadPostMessage();
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.lottieAnimationIconService.loadLottieAnimation({
        pathIconAnimation: 'camera.json',
        idElement: 'lottie-icon-camera',
        loop: false,
        autoplay: true,
      });

      this.lottieAnimationIconService.loadLottieAnimation({
        pathIconAnimation: 'loading.json',
        idElement: 'lottie-icon-is-loading',
        loop: true,
        autoplay: true,
      });
    });
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

  loadPostMessage() {
    this.postMessageService.listPost().subscribe({
      next: (response) => {
        console.log(response);
        this.posts = response.data;
        this.isLoaded = true;

        this.loadIconHeart(this.posts);

        setTimeout(() => {
          this.initializeSwiper();
          this.findObjetNoMacthOnResponse(response.data);
        }, 100);
      },
      error: (error) => {
        console.error(error);
        this.showSystemUnavailable = true;
        this.isLoaded = false;
      },
    });
  }
  findObjetNoMacthOnResponse(data: Post[]) {
    const noMatchPost = data.find((post) => post.id === 'no-matches');

    if (noMatchPost) {
      this.lottieAnimationIconService.loadLottieAnimation({
        pathIconAnimation: 'no-macth.json',
        idElement: 'lottie-icon-no-match',
        loop: true,
        autoplay: true,
      });
    }
  }

  loadIconHeart(post: Post[]) {
    if (post.length === 1) {
      return (this.showLikeButton = false);
    }
    setTimeout(() => {
      this.lottieAnimationIconService.loadLottieAnimation({
        pathIconAnimation: 'like-heart.json',
        idElement: 'lottie-container',
        loop: false,
        autoplay: false,
        onClick: true,
      });
    }, 100);

    return (this.showLikeButton = true);
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

  tryAgainLoadingPostMessage() {
    console.log('botão clicado');
    this.showSystemUnavailable = false;
    this.isLoaded = false;
    this.loadPostMessage();
  }
}
