import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { concatMap, Subject, takeUntil, tap } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { CardsComponent } from '../../../../../shared/component/cards/cards.component';
import { ButtonDirective } from '../../../../../shared/directives/button-ia/button-ia.directive';
import { AIProfileInterface } from '../../../../../shared/interface/ai-profile.interface';
import { FeedPost } from '../../../../../shared/interface/post.interface';
import { AiProfilesService } from '../../../../../shared/service/ai-profiles/ai-profiles.service';
import { LikePostMessageService } from '../../../../../shared/service/like-post-message/like-post-message.service';
import { LoggerService } from '../../../../../shared/service/logger/logger.service';
import { PostMessageService } from '../../../../../shared/service/post/post.service';
import { UnlikePostMessageService } from '../../../../../shared/service/unlike-post-message/unlike-post-message.service';
import { AdmobVideoRewardComponent } from '../../../admob-video-reward/admob-video-reward.component';
import { LikeLimiteRewardComponent } from '../../../like-limite-reward/like-limite-reward.component';
register();

@Component({
  selector: 'app-swiper-container',
  templateUrl: './swiper-container.component.html',
  styleUrls: ['./swiper-container.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    TranslateModule,
    CardsComponent,
    CardsComponent,
    ButtonDirective,
    LikeLimiteRewardComponent,
    AdmobVideoRewardComponent,
  ],
})
export class SwiperContainerComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() feedPostCard: FeedPost[] = [];
  @Input() profileAI?: { name: string; typeProfle: string; avatar: string } = {
    name: '',
    typeProfle: '',
    avatar: '',
  };

  @Output() closeAdmobModalReward = new EventEmitter<void>();

  @ViewChild('swiperRef', { read: ElementRef }) swiperRef!: ElementRef;

  public posts: FeedPost[] = [];
  public aiProfiles: AIProfileInterface[] = [];
  public currentPage = 1;
  public isLoading = false;
  public isLoadingMore = false;
  public hasMorePosts = true;
  public showLikeButton = true;
  public activePost?: FeedPost;
  public mySwiper: any;
  public likeButtonClicked = false;
  public isLoadingAi = false;
  public showErrorAi = false;
  public showCard = false;
  public showRewardCard = false;

  private pendingLikePostId?: FeedPost;
  private isRemovingSlide = false;
  private destroy$ = new Subject<void>();
  private likeQueue = new Subject<FeedPost>();
  private unlikeQueue = new Subject<FeedPost>();

  constructor(
    private postMessageService: PostMessageService,
    private likePostMessageService: LikePostMessageService,
    private unlikePostMessageService: UnlikePostMessageService,
    private aiProfilesService: AiProfilesService,
    private logger: LoggerService,
    private router: Router,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  get ai() {
    return this.aiProfiles?.[0] ?? null;
  }

  ngOnInit() {
    this.initializeQueues();
    this.loadAiProfile();
    if (this.feedPostCard && this.feedPostCard.length > 0) {
      this.posts = [...this.feedPostCard];
      this.hasMorePosts = true;
      this.isLoading = false;
    } else {
      this.loadPosts();
    }
  }

  ngAfterViewInit() {
    this.initializeSwiper();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['feedPostCard'] && !changes['feedPostCard'].firstChange) {
      const value = changes['feedPostCard'].currentValue as FeedPost[];
      if (Array.isArray(value)) {
        this.posts = [...value];
        setTimeout(() => this.initializeSwiper(), 50);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.mySwiper?.off('slideChange');
    this.mySwiper?.off('slideChangeTransitionEnd');
    this.mySwiper?.off('reachEnd');
  }

  loadAiProfile() {
    this.isLoadingAi = true;
    this.aiProfilesService.profiles().subscribe({
      next: (response) => {
        this.aiProfiles = response;
        this.isLoadingAi = false;
        this.showErrorAi = false;
      },
      error: () => {
        this.isLoadingAi = false;
        this.showErrorAi = true;
      },
    });
  }

  goToIAProfile() {
    this.router.navigate(['home/main/ia-profile']);
  }

  initializeQueues() {
    this.likeQueue
      .pipe(
        concatMap((post) => {
          console.log('Processing like for post:', post);

          // debugger;
          // if (post.type.includes('WATCH_VIDEO')) {
          //   this.loadPosts();
          // }

          return this.likePostMessageService.likePostMessage(post.id).pipe(
            tap({
              next: (response) => {
                console.log('like response', response);
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'like',
                    event: 'success',
                    message: `liked_${post.id}`,
                    statusCode: 200,
                    level: 'info',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();

                // this.removePostById(post.id);
              },
              error: (error) => {
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'like',
                    event: 'error',
                    message: `like_error_${post.id}:${
                      error?.message || 'unknown'
                    }`,
                    statusCode: error?.status || 500,
                    level: 'error',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              },
            })
          );
        })
      )
      .subscribe();

    this.unlikeQueue
      .pipe(
        concatMap((post) =>
          this.unlikePostMessageService.unlikePostMessage(post.id).pipe(
            tap({
              next: (response) => {
                console.log('unlike response', response);
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'unlike',
                    event: 'success',
                    message: `unliked_${post.id}`,
                    statusCode: 200,
                    level: 'info',
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              },
              error: (error) => {
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'unlike',
                    event: 'error',
                    message: `unlike_error_${post.id}:${
                      error?.message || 'unknown'
                    }`,
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

  loadPosts(page: number = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    if (page > this.currentPage && !this.hasMorePosts) {
      this.isLoading = false;
      return;
    }

    this.postMessageService.listPost(page).subscribe({
      next: (response) => {
        console.log('Posts API response:', response);
        let items = response.items ?? [];

        if (page === 1) {
          this.posts = items;
        } else {
          this.posts = [...this.posts, ...items];
          // ✅ Garante apenas um AI_SUGGESTION
          const aiIndexes = this.posts
            .map((p, i) =>
              Array.isArray(p.type) && p.type.includes('AI_SUGGESTION') ? i : -1
            )
            .filter((i) => i !== -1);

          if (aiIndexes.length > 1) {
            const first = aiIndexes[0];
            this.posts = this.posts.filter(
              (_, i) => i === first || !aiIndexes.includes(i)
            );
          }
        }

        console.log('Posts após atualização:', this.posts);

        this.hasMorePosts = page < response.totalPages;
        this.currentPage = page;
        this.isLoading = false;

        if (this.mySwiper) {
          this.mySwiper.update();
        }

        if (!this.activePost) {
          this.setActivePost(0);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.logger
          .info({
            pageView: 'PostMessage:Swiper',
            category: 'load_posts',
            event: 'error',
            message: `${error?.message || 'load_posts_error'}`,
            statusCode: error?.status || 500,
            level: 'error',
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      },
    });
  }

  loadMorePosts() {
    if (this.isLoadingMore || !this.hasMorePosts) return;
    this.isLoadingMore = true;
    this.loadPosts(this.currentPage + 1);
    setTimeout(() => {
      this.isLoadingMore = false;
    }, 300);
  }

  initializeSwiper() {
    this.zone.runOutsideAngular(() => {
      const el = this.swiperRef?.nativeElement as any;
      if (!el) return;
      this.mySwiper = el.swiper;
      this.setActivePost(0);
      this.updateLikeState(0);

      this.mySwiper.on('slideChange', () => {
        const idx = this.mySwiper.activeIndex;
        this.setActivePost(idx);
        this.zone.run(() => {
          this.updateLikeState(idx);
          this.cd.detectChanges();
        });
      });

      this.mySwiper.on('slideChangeTransitionEnd', () => {
        if (this.isRemovingSlide) {
          return;
        }

        const activeIndex = this.mySwiper.activeIndex;
        const currentPost = this.posts[activeIndex];
        // Exemplo de regra baseada no objeto do post atual
        console.log('Current post on slideChangeTransitionEnd:', currentPost);
        console.log('Current post type:', Array.isArray(currentPost.type));
        console.log(
          'Current post type includes WATCH_VIDEO:',
          currentPost?.type.includes('WATCH_VIDEO')
        );
        if (currentPost.type.includes('WATCH_VIDEO')) {
          setTimeout(() => {
            this.showCard = true;
          }, 500);
        }

        console.log('activeIndex on slideChangeTransitionEnd');

        if (this.likeButtonClicked && this.pendingLikePostId) {
          const likedPostId = this.pendingLikePostId;
          this.pendingLikePostId = undefined;
          this.isRemovingSlide = true;
          this.removePostById(likedPostId.id, true);
          setTimeout(() => {
            this.isRemovingSlide = false;
          });
          this.likeButtonClicked = false;
          return;
        }

        // 🚫 NÃO remover automaticamente se foi um LIKE
        if (!this.likeButtonClicked && activeIndex > 0) {
          const postToRemove = this.posts[activeIndex - 1] as any;

          if (postToRemove?.id) {
            this.isRemovingSlide = true;

            this.removePostFromSwiper(postToRemove);

            setTimeout(() => {
              this.isRemovingSlide = false;
            });
          }
        }
        this.likeButtonClicked = false;
      });

      this.mySwiper.on('reachEnd', () => {
        if (this.hasMorePosts) {
          this.loadMorePosts();
          return;
        }

        const activeIndex = this.mySwiper.activeIndex;
        const currentPost = this.posts[activeIndex];

        const isLast = activeIndex === this.posts.length - 1;
        const hasWatchVideo =
          Array.isArray(currentPost?.type) &&
          currentPost.type.includes('WATCH_VIDEO');

        if (isLast && hasWatchVideo) {
          setTimeout(() => {
            this.showCard = true;
          }, 500);
        }
      });
    });
  }

  setActivePost(index: number) {
    const post = this.posts[index];
    if (post?.type.includes('POST')) {
      this.activePost = post as FeedPost;
    } else {
      this.activePost = undefined;
    }
  }

  updateLikeState(index: number) {
    const post = this.posts[index];
    this.showLikeButton = post?.type.includes('POST');
  }

  likePostMessage() {
    if (!this.activePost?.id) return;

    this.likeButtonClicked = true;
    console.log('Liking post with ID ========>:', this.activePost);
    this.pendingLikePostId = this.activePost;
    this.likeQueue.next(this.pendingLikePostId);
    setTimeout(() => {
      this.mySwiper?.slideNext();
    }, 50); // Log posts após curtir
    setTimeout(() => {
      console.log('Posts após curtir:', this.posts);
    }, 500);
  }

  removePostById(postId: string, skipSlideTo = false) {
    const idx = this.posts.findIndex((p) => p.id === postId);
    if (idx === -1) return;

    const currentActiveIndex = this.mySwiper?.activeIndex ?? 0;
    this.posts.splice(idx, 1);

    // ULTIMA SUGESTÃO DA IA PARA EVITAR OS CARDES DUPLICADOS CONFORME O ULTIMO RESPONSE DO ENDPOINT QUANDO ACABA OS VIDEOS ADS
    // Após remover o post, garanta que só exista um AI_SUGGESTION
    // const aiIndexes = this.posts
    //   .map((p, i) =>
    //     Array.isArray(p.type) && p.type.includes('AI_SUGGESTION') ? i : -1
    //   )
    //   .filter((i) => i !== -1);
    // if (aiIndexes.length > 1) {
    //   const first = aiIndexes[0];
    //   this.posts = this.posts.filter(
    //     (_, i) => i === first || !aiIndexes.includes(i)
    //   );
    // }

    this.mySwiper?.removeSlide(idx);
    this.mySwiper?.update();

    if (!skipSlideTo) {
      const nextIndex = Math.min(currentActiveIndex, this.posts.length - 1);
      if (this.mySwiper && typeof this.mySwiper.slideTo === 'function') {
        this.mySwiper.slideTo(nextIndex, 0);
      }
    }

    const targetIndex = Math.min(
      this.mySwiper?.activeIndex ?? currentActiveIndex,
      this.posts.length - 1
    );
    this.setActivePost(targetIndex);
    this.updateLikeState(targetIndex);

    if (this.posts.length === 0) {
      this.showLikeButton = false;
    }
  }

  removePostFromSwiper(post: any) {
    const postId = post?.id;
    if (!postId) return;
    if (postId !== 'no-matches' && postId !== 'watch-video-reward') {
      this.dislikePostMessage(postId);
    }
    this.removePostById(postId, true);
  }

  dislikePostMessage(postId: any) {
    this.unlikeQueue.next(postId.id);
  }

  goToAdMobVideoReward() {
    this.router.navigateByUrl('home/admob-video-reward');
  }

  goToSubscription() {
    this.router.navigateByUrl('home/list-subscription');
  }

  public closeCard() {
    console.log('fechado cards');
    this.showCard = false;
  }

  public openVideoReward() {
    this.showCard = false;
    this.showRewardCard = true;
  }

  public closeVideoReward() {
    console.log('fechado video reward');
    this.showRewardCard = false;
  }
}
