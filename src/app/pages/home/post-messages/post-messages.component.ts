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
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { Subject, concatMap } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { Post } from '../../../shared/interface/post';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { LikePostMessageService } from '../../../shared/service/like-post-message/like-post-message.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { PostMessageService } from '../../../shared/service/post/post.service';

register();

const SharedComponent = [
  LogoDropmessageComponent,
  SystemUnavailableComponent,
  ButtonStyleDirective,
];

@Component({
  selector: 'app-post-messages',
  standalone: true,
  imports: [NgFor, NgIf, ...SharedComponent],
  templateUrl: './post-messages.component.html',
  styleUrl: './post-messages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  posts: Post[] = [];
  mySwiper: any;
  showLikeButton: boolean = true;
  isLoaded: boolean = false;
  likePostMessageWhitHeart!: Post;
  showSystemUnavailable: boolean = false;
  textInformationSystemUnavailable: string = '';
  currentPage: number = 1;
  isLoadingMorePosts: boolean = false;
  totalPosts: number = 0;
  private likeButtonClicked: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  likePostMessageQueue = new Subject<string>();
  dataAvatar!: AvatarSuccess;
  backButtonListener!: PluginListenerHandle;
  displayImageUrl: string | null = null;
  imageLoaded = false;
  pageView: string = 'DatingMatch:Login';

  constructor(
    private postMessageService: PostMessageService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private lottieAnimationIconService: LottieAnimationIconService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cacheAvatarService: CacheAvatarService,
    private likePostMessageService: LikePostMessageService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.handleLikePostMessageQueue();
    this.navigateBackUsingApp();

    this.textInformationSystemUnavailable =
      'No momento estamos com nossos serviço indisponíves, volte novamente mais tarde!';

    if (isPlatformBrowser(this.platformId)) {
      this.loadAvatarCache();
      this.loadPostMessage();
    }
  }

  async navigateBackUsingApp() {
    this.backButtonListener = await App.addListener('backButton', () => {
      App.exitApp();
    });
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

    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }

    if (this.mySwiper) {
      this.mySwiper.off('slideChangeTransitionEnd');
      this.mySwiper.off('reachEnd');
      this.mySwiper.destroy(true, true);
      this.mySwiper = null;
      console.log('Swiper destruído');
    }
  }

  preloadImage(url: string) {
    const img = new Image();
    img.src = url;

    // Evento 'load' para definir a imagem apenas após o carregamento completo
    img.onload = () => {
      this.displayImageUrl = url;
      this.imageLoaded = true;
    };
  }

  initializeSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        const swiperContainer = document.querySelector('.mySwiper') as any;

        if (swiperContainer) {
          this.mySwiper = swiperContainer.swiper;
          this.loadFistPostMessageForLikeHeartButton(this.mySwiper.activeIndex);

          // Configura o botão de curtida com base no slide atual
          const updateShowLikeButton = (activeIndex: number) => {
            const activePost = this.posts[activeIndex];

            if (
              activePost?.id === 'no-matches' ||
              activePost?.id === 'watch-video-reward'
            ) {
              this.showLikeButton = false;
              this.mySwiper.autoplay.stop();
            } else {
              this.showLikeButton = true;
            }
          };

          // Inicializa no primeiro slide
          updateShowLikeButton(this.mySwiper.activeIndex);

          // Evento: transição de slides concluída
          this.mySwiper.on('slideChangeTransitionEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;

            // Atualiza o botão de curtida
            updateShowLikeButton(activeIndex);

            // Lógica para remover posts, se necessário
            if (activeIndex > 0 && activeIndex <= this.posts.length) {
              if (!this.likeButtonClicked) {
                const postToRemove = this.posts[activeIndex - 1];

                if (
                  postToRemove?.id !== 'no-matches' &&
                  postToRemove?.id !== 'watch-video-reward'
                ) {
                  this.removePostFromSwiper(postToRemove);
                }
              }
              this.likeButtonClicked = false;
            }
          });

          // Evento: slide alterado
          this.mySwiper.on('slideChange', () => {
            const activeIndex = this.mySwiper.activeIndex;

            // Atualiza a mensagem do botão com o post atual
            const likePostSwiper = this.posts[activeIndex];
            if (
              likePostSwiper?.id !== 'no-matches' &&
              likePostSwiper?.id !== 'watch-video-reward'
            ) {
              this.likePostMessageWhitHeart = likePostSwiper;
            }
          });

          // Evento: chegou no último slide
          this.mySwiper.on('reachEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;
            console.log('Chegou no último slide:', activeIndex);
            if (activeIndex === 0) {
              this.showLikeButton = false;
            }

            // Garante que o botão esteja oculto se necessário
            // updateShowLikeButton(activeIndex);
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
        console.log('=====>', response);

        this.totalPosts += response.data.length;
        this.posts = [...this.posts, ...response.data];
        this.isLoaded = true;
        this.loadIconHeart(this.posts);

        if (this.currentPage === 1) {
          setTimeout(() => {
            this.initializeSwiper();
          }, 100);
        }
      },
      error: (error) => {
        console.error(error);
        this.showSystemUnavailable = true;
        this.isLoaded = false;
      },
    });
  }

  loadMorePosts() {
    if (this.isLoadingMorePosts) return;

    this.isLoadingMorePosts = true;
    this.currentPage++;

    this.postMessageService.listPost(this.currentPage).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          this.posts = [...this.posts, ...response.data];
          this.mySwiper.update();
        } else {
          console.log('Não há mais posts para carregar.');
        }
        this.isLoadingMorePosts = false;
      },
      error: (error) => {
        console.error('Erro ao carregar mais posts:', error);
        this.isLoadingMorePosts = false;
      },
    });
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
      this.posts.splice(postIndex, 1);
      this.mySwiper.removeSlide(postIndex);
      this.mySwiper.update();
    } else {
      console.log('Post não encontrado ou é o "no-matches"');
    }
  }

  likePostMessage() {
    console.log('Curtiu o post:', this.likePostMessageWhitHeart);
    // this.likePostMessageService
    //   .likePostMessage(this.likePostMessageWhitHeart.id)
    //   .subscribe({
    //     next: (response) => {
    //       console.log(response);
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     },
    //   });
    this.likePostMessageQueue.next(this.likePostMessageWhitHeart.id);

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

  handleLikePostMessageQueue() {
    this.likePostMessageQueue
      .pipe(
        concatMap((postId) =>
          this.likePostMessageService.likePostMessage(postId)
        )
      )
      .subscribe({
        next: (response) => {
          console.log('Post curtido:', response);
        },
        error: (error) => {
          console.error('Erro ao curtir o post:', error);
        },
      });
  }

  removePostFromSwiperWithLikeButton(post: Post) {
    const postIndex = this.posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1 && post.id !== 'no-matches') {
      this.posts.splice(postIndex, 1);
      this.mySwiper.removeSlide(postIndex);
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
    this.router.navigateByUrl('home/profile');
  }

  tryAgainLoadingPostMessage() {
    console.log('botão clicado');
    this.showSystemUnavailable = false;
    this.isLoaded = false;
    this.loadPostMessage();
  }

  loadAvatarCache() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        if (response) {
          this.dataAvatar = response;
          this.preloadImage(this.dataAvatar.image);
        } else {
          console.log('Avatar não encontrado no cache.');
        }
      },
      error: (error) => {
        console.log('Erro ao carregar avatar do cache:', error);
      },
    });
  }

  goToAdMobVideoReward() {
    this.router.navigateByUrl('home/admob-video-reward');
  }

  sendLogger() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_login',
      event: 'click',
      message: 'loggin_success',
      statusCode: 200,
      level: 'info',
    };
    this.loggerService.info(logger).subscribe({
      next: (response) => {
        console.log(response);
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
