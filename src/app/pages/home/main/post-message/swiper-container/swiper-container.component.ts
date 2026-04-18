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
  private pendingLikePostId?: string;

  private destroy$ = new Subject<void>();
  private likeQueue = new Subject<string>();
  private unlikeQueue = new Subject<string>();

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
        concatMap((postId) =>
          this.likePostMessageService.likePostMessage(postId).pipe(
            tap({
              next: (response) => {
                console.log('like response', response);
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'like',
                    event: 'success',
                    message: `liked_${postId}`,
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

                this.removePostById(postId);
              },
              error: (error) => {
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'like',
                    event: 'error',
                    message: `like_error_${postId}:${
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

    this.unlikeQueue
      .pipe(
        concatMap((postId) =>
          this.unlikePostMessageService.unlikePostMessage(postId).pipe(
            tap({
              next: (response) => {
                console.log('unlike response', response);
                this.logger
                  .info({
                    pageView: 'PostMessage:Swiper',
                    category: 'unlike',
                    event: 'success',
                    message: `unliked_${postId}`,
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
                    message: `unlike_error_${postId}:${
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

    this.postMessageService.listPost(page).subscribe({
      next: (response) => {
        console.log('Posts API response:', response);
        const items = response.items ?? [];
        if (page === 1) {
          this.posts = items;
        } else {
          this.posts = [...this.posts, ...items];
        }

        this.hasMorePosts = page < response.totalPages;
        this.currentPage = page;
        this.isLoading = false;

        if (this.mySwiper) {
          this.mySwiper.update();
        }

        if (!this.activePost) {
          this.setActivePost(0);
        }

        if (response.type.includes('WATCH_VIDEO')) {
          setTimeout(() => {
            this.showCard = true;
          }, 500);
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
        const activeIndex = this.mySwiper.activeIndex;
        console.log('activeIndex on slideChangeTransitionEnd', activeIndex);

        if (this.likeButtonClicked && this.pendingLikePostId) {
          const likedPostId = this.pendingLikePostId;
          this.pendingLikePostId = undefined;
          this.removePostById(likedPostId);
        } else if (activeIndex > 0) {
          const postToRemove = this.posts[activeIndex - 1] as any;
          if (
            postToRemove?.id &&
            postToRemove.id !== 'no-matches' &&
            postToRemove.id !== 'watch-video-reward'
          ) {
            this.removePostFromSwiper(postToRemove);
          }
        }

        this.likeButtonClicked = false;
      });

      this.mySwiper.on('reachEnd', () => {
        this.loadMorePosts();
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
    this.pendingLikePostId = this.activePost.id;
    this.likeQueue.next(this.pendingLikePostId);
    this.mySwiper?.slideNext();
  }

  removePostById(postId: string) {
    const idx = this.posts.findIndex((p) => p.id === postId);
    if (idx === -1) return;

    const currentActiveIndex = this.mySwiper?.activeIndex ?? 0;
    this.posts.splice(idx, 1);
    this.mySwiper?.removeSlide(idx);
    this.mySwiper?.update();

    const nextIndex = Math.min(currentActiveIndex, this.posts.length - 1);
    if (this.mySwiper && typeof this.mySwiper.slideTo === 'function') {
      this.mySwiper.slideTo(nextIndex, 0);
    }

    this.setActivePost(this.mySwiper?.activeIndex ?? nextIndex);
    this.updateLikeState(this.mySwiper?.activeIndex ?? nextIndex);

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
    this.removePostById(postId);
  }

  dislikePostMessage(postId: string) {
    this.unlikeQueue.next(postId);
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
    this.closeAdmobModalReward.emit();
    this.showRewardCard = false;
  }
}
