import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
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
import { TranslateModule } from '@ngx-translate/core';
import { Subject, concatMap, takeUntil, tap } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { CardFirstPublicationComponent } from '../../../shared/component/card-first-publication/card-first-publication.component';
import { LastLoggedUsersComponent } from '../../../shared/component/last-logged-users/last-logged-users.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { LastLoggedUsers } from '../../../shared/interface/last-logged-users.interface';
import { FeedPostCard } from '../../../shared/interface/post.interface';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { LastLoggedUsersService } from '../../../shared/service/last-logged-users/last-logged-users.service';
import { LikePostMessageService } from '../../../shared/service/like-post-message/like-post-message.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { PostMessageService } from '../../../shared/service/post/post.service';
import { UnlikePostMessageService } from '../../../shared/service/unlike-post-message/unlike-post-message.service';

register();

const SharedComponent = [
  LogoDropmessageComponent,
  SystemUnavailableComponent,
  ButtonStyleDirective,
  CardFirstPublicationComponent,
  LastLoggedUsersComponent,
  LoadShimmerComponent,
];

@Component({
  selector: 'app-post-messages',
  standalone: true,
  imports: [NgFor, NgIf, ...SharedComponent, TranslateModule],
  templateUrl: './post-messages.component.html',
  styleUrl: './post-messages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  posts: any[] = [];
  mySwiper: any;
  showLikeButton: boolean = true;
  isLoaded: boolean = false;
  likePostMessageWhitHeart: any;
  showSystemUnavailable: boolean = false;
  textInformationSystemUnavailable: string = '';
  currentPage: number = 1;
  isLoadingMorePosts: boolean = false;
  hasMorePosts: boolean = true;
  totalPosts: number = 0;
  private likeButtonClicked: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  likePostMessageQueue = new Subject<string>();
  unlikePostMessageQueue = new Subject<string>();
  dataAvatar!: AvatarSuccess;
  backButtonListener!: PluginListenerHandle;
  displayImageUrl: string | null = null;
  imageLoaded = false;
  pageView: string = 'DatingMatch:PostMessage';
  lastUserLogged!: LastLoggedUsers;
  isLoadingLoggedUser: boolean = true;

  constructor(
    private postMessageService: PostMessageService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private lottieAnimationIconService: LottieAnimationIconService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cacheAvatarService: CacheAvatarService,
    private likePostMessageService: LikePostMessageService,
    private unlikePostMessageService: UnlikePostMessageService,
    private loggerService: LoggerService,
    private lastLoggedUsersService: LastLoggedUsersService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleLikePostMessageQueue();
    this.handleUnlikePostMessageQueue();
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

            if ((activePost as any)?.id === 'no-matches') {
              this.lastLoggedUsersService.lastLoggedUsers().subscribe({
                next: (response) => {
                  this.isLoadingLoggedUser = false;
                  this.lastUserLogged = response;
                  console.log(response);
                  this.cd.detectChanges();
                },
              });

              const logger: TrackAction = {
                pageView: this.pageView,
                category: 'user_post_message:no_match',
                event: 'view',
                message: 'sem novas amizades',
                statusCode: 200,
                level: 'info',
              };

              this.loggerService
                .info(logger)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  error: (error) => {
                    console.log(error);
                  },
                });
            }

            if (
              (activePost as any)?.id === 'no-matches' ||
              (activePost as any)?.id === 'watch-video-reward'
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
                  (postToRemove as any)?.id !== 'no-matches' &&
                  (postToRemove as any)?.id !== 'watch-video-reward'
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
              (likePostSwiper as any)?.id !== 'no-matches' &&
              (likePostSwiper as any)?.id !== 'watch-video-reward'
            ) {
              this.likePostMessageWhitHeart = likePostSwiper;
            }
          });

          // Evento: chegou no último slide
          this.mySwiper.on('reachEnd', () => {
            const activeIndex = this.mySwiper.activeIndex;
            if (activeIndex === 0) {
              this.showLikeButton = false;
            }
            this.loadMorePosts();
          });
        }
      });
    }
  }

  loadFistPostMessageForLikeHeartButton(activeIndex: any) {
    const activeIndexSwiper = activeIndex;
    this.likePostMessageWhitHeart = this.posts[activeIndexSwiper];
  }

  loadPostMessage() {
    this.isLoadingMorePosts = true;
    this.postMessageService.listPost(this.currentPage).subscribe({
      next: (response) => {
        const incomingPosts =
          (response as any).data ?? (response as any).items ?? [];
        this.totalPosts += (incomingPosts || []).length;

        if (incomingPosts.length > 0) {
          this.posts = [...this.posts, ...incomingPosts];

          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_post_message:load_posts',
            event: 'view',
            message: `loaded_page_${this.currentPage}_${incomingPosts.length}_posts`,
            statusCode: 200,
            level: 'info',
          };
          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          this.hasMorePosts = incomingPosts.length > 0;

          if (this.currentPage === 1) {
            setTimeout(() => {
              this.initializeSwiper();
            }, 100);
          } else {
            this.mySwiper?.update();
          }
        } else {
          this.hasMorePosts = false;
          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_post_message:no_posts',
            event: 'view',
            message: `no_posts_page_${this.currentPage}`,
            statusCode: 200,
            level: 'info',
          };
          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }

        this.isLoaded = true;
        this.loadIconHeart(this.posts);
        this.isLoadingMorePosts = false;
      },
      error: (error) => {
        this.isLoadingMorePosts = false;
        this.showSystemUnavailable = true;
        this.isLoaded = false;

        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'user_post_message:load_posts_error',
          event: 'error',
          message: error?.message || 'Unknown error',
          statusCode: error?.status || 500,
          level: 'error',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      },
    });
  }

  loadMorePosts() {
    if (this.isLoadingMorePosts || !this.hasMorePosts) {
      return;
    }

    this.isLoadingMorePosts = true;
    this.currentPage += 1;
    const loggerStart: TrackAction = {
      pageView: this.pageView,
      category: 'user_post_message:load_more_posts',
      event: 'start',
      message: `fetching_page_${this.currentPage}`,
      statusCode: 200,
      level: 'info',
    };
    this.loggerService
      .info(loggerStart)
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.postMessageService.listPost(this.currentPage).subscribe({
      next: (response) => {
        const incoming =
          (response as any).data ?? (response as any).items ?? [];
        if (!incoming || incoming.length === 0) {
          this.hasMorePosts = false;
          const loggerEnd: TrackAction = {
            pageView: this.pageView,
            category: 'user_post_message:load_more_posts',
            event: 'no_more_posts',
            message: `no_more_posts_page_${this.currentPage}`,
            statusCode: 200,
            level: 'info',
          };
          this.loggerService
            .info(loggerEnd)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        } else {
          this.posts = [...this.posts, ...incoming];
          this.totalPosts += incoming.length;
          this.mySwiper?.update();

          const loggerEnd: TrackAction = {
            pageView: this.pageView,
            category: 'user_post_message:load_more_posts',
            event: 'success',
            message: `loaded_${incoming.length}_posts_page_${this.currentPage}`,
            statusCode: 200,
            level: 'info',
          };
          this.loggerService
            .info(loggerEnd)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }
        this.isLoadingMorePosts = false;
      },
      error: (error) => {
        this.isLoadingMorePosts = false;
        this.currentPage -= 1;

        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'user_post_message:load_more_posts',
          event: 'error',
          message: error?.message || 'loadMorePosts failed',
          statusCode: error?.status || 500,
          level: 'error',
        };
        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      },
    });
  }

  loadIconHeart(post: any[]) {
    if (!post || post.length <= 1) {
      this.showLikeButton = false;
      return;
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
    this.showLikeButton = true;
  }

  removePostFromSwiper(post: any) {
    const postIndex = this.posts.findIndex(
      (p) => (p as any).id === (post as any).id
    );

    if (postIndex === -1) {
      this.loggerService
        .info({
          pageView: this.pageView,
          category: 'user_post_message:remove_swiper',
          event: 'error',
          message: `Post not found ${(post as any).id}`,
          statusCode: 404,
          level: 'warn',
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
      return;
    }

    if ((post as any).id !== 'no-matches') {
      this.dislikePostMessage(post);
    }

    this.posts.splice(postIndex, 1);
    this.mySwiper?.removeSlide(postIndex);
    this.mySwiper?.update();

    this.loggerService
      .info({
        pageView: this.pageView,
        category: 'user_post_message:remove_swiper',
        event: 'success',
        message: `removed_post_${(post as any).id}`,
        statusCode: 200,
        level: 'info',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  likePostMessage() {
    if (
      !this.likePostMessageWhitHeart ||
      !(this.likePostMessageWhitHeart as any).id
    ) {
      return;
    }

    const postId = (this.likePostMessageWhitHeart as any).id;
    this.likePostMessageQueue.next(postId);

    this.loggerService
      .info({
        pageView: this.pageView,
        category: 'user_post_message:like',
        event: 'click',
        message: `queue_like_post_${postId}`,
        statusCode: 200,
        level: 'info',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.likeButtonClicked = true;
    this.mySwiper?.slideNext();
  }

  handleLikePostMessageQueue() {
    this.likePostMessageQueue
      .pipe(
        tap((postId) => {
          this.loggerService
            .info({
              pageView: this.pageView,
              category: 'user_post_message:like_queue',
              event: 'queued',
              message: `queued_like_${postId}`,
              statusCode: 200,
              level: 'debug',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }),
        concatMap((postId) =>
          this.likePostMessageService.likePostMessage(postId).pipe(
            tap({
              next: (response) => {
                this.loggerService
                  .info({
                    pageView: this.pageView,
                    category: 'user_post_message:like_queue',
                    event: 'success',
                    message: `like_post_success_${postId}`,
                    statusCode: 200,
                    level: 'info',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();

                if (response.mustVideoWatch) {
                  this.goToAdMobVideoReward();
                }

                if (response.awaitLikePostMessage) {
                  this.router.navigate(['home/limit-like-post-message'], {
                    queryParams: { message: response.message },
                  });
                }

                const likedPost = this.posts.find(
                  (p) => (p as any).id === postId
                );
                if (likedPost) {
                  this.removePostFromSwiperWithLikeButton(likedPost);
                }
              },
              error: (error) => {
                this.loggerService
                  .info({
                    pageView: this.pageView,
                    category: 'user_post_message:like_queue',
                    event: 'error',
                    message: `like_post_error_${error?.message || 'unknown'}`,
                    statusCode: error?.status || 500,
                    level: 'error',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              },
            })
          )
        )
      )
      .subscribe();
  }

  handleUnlikePostMessageQueue() {
    this.unlikePostMessageQueue
      .pipe(
        tap((postId) => {
          this.loggerService
            .info({
              pageView: this.pageView,
              category: 'user_post_message:unlike_queue',
              event: 'queued',
              message: `queued_unlike_${postId}`,
              statusCode: 200,
              level: 'debug',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }),
        concatMap((postId) =>
          this.unlikePostMessageService.unlikePostMessage(postId).pipe(
            tap({
              next: (response) => {
                this.loggerService
                  .info({
                    pageView: this.pageView,
                    category: 'user_post_message:unlike_queue',
                    event: 'success',
                    message: `unlike_success_${postId}`,
                    statusCode: 200,
                    level: 'info',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              },
              error: (error) => {
                this.loggerService
                  .info({
                    pageView: this.pageView,
                    category: 'user_post_message:unlike_queue',
                    event: 'error',
                    message: `unlike_error_${error?.message || 'unknown'}`,
                    statusCode: error?.status || 500,
                    level: 'error',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              },
            })
          )
        )
      )
      .subscribe();
  }

  removePostFromSwiperWithLikeButton(post: any) {
    const postIndex = this.posts.findIndex(
      (p) => (p as any).id === (post as any).id
    );
    if (postIndex === -1) {
      return;
    }

    this.posts.splice(postIndex, 1);
    this.mySwiper?.removeSlide(postIndex);
    this.mySwiper?.update();

    this.loggerService
      .info({
        pageView: this.pageView,
        category: 'user_post_message:remove_with_like',
        event: 'success',
        message: `removed_with_like_${(post as any).id}`,
        statusCode: 200,
        level: 'info',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  dislikePostMessage(post: FeedPostCard) {
    this.unlikePostMessageQueue.next((post as any).id);
  }

  openBottomSheet(): void {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_post_message',
      event: 'click',
      label: 'button:icon_camera',
      message: 'Abrir modal camera',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.bottomSheet.open(BottomSheetComponent);
  }

  goToListSettings() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_post_message',
      event: 'click',
      label: 'button:icon_avatar',
      message: 'ir para configurações',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();
    this.router.navigateByUrl('home/main/profile');
  }

  tryAgainLoadingPostMessage() {
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
        }
      },
      error: (error) => {
        console.log('Erro ao carregar avatar do cache:', error);
      },
    });
  }

  goToAdMobVideoReward() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_post_message:video_reward',
      event: 'click',
      message: 'Assitir video recompensa',
      statusCode: 202,
      level: 'info',
    };

    this.loggerService
      .info(logger)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.log(error),
      });
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

  goToSubscription() {
    this.router.navigateByUrl('home/list-subscription');
  }
}
