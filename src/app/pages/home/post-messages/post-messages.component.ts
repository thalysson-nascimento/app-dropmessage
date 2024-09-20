import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
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
export class PostMessagesComponent implements OnInit, AfterViewInit {
  posts!: Array<{ id: string; path: string; name: string }>;
  animation: any;
  iconAnimationCamera: any;
  mySwiper: any;
  iconAnimationNoMatch: any;
  showLikeButton: boolean = true;

  constructor(
    private postService: PostService,
    private zone: NgZone,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.loadPostService();
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.loadAnimationIconHeart('like-heart.json', 'lottie-container');
      this.loadAnimationIconCamera('camera.json', 'lottie-icon-camera');
      this.loadAnimationIconNoMacth('no-macth.json', 'lottie-icon-no-match');
    });
    this.initializeSwiper();
  }

  initializeSwiper() {
    this.zone.runOutsideAngular(() => {
      const swiperContainer = document.querySelector('.mySwiper') as any;

      if (swiperContainer) {
        this.mySwiper = swiperContainer.swiper;

        this.mySwiper.on('slideChangeTransitionEnd', () => {
          const activeIndex = this.mySwiper.activeIndex;

          if (activeIndex > 0) {
            const postToRemove = this.posts[activeIndex - 1];

            this.removePost(postToRemove.id);
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

  loadPostService() {
    this.postService.listPost().subscribe((response) => {
      this.posts = response;

      // Adiciona o último slide com a mensagem no final do array
      this.posts.push({
        id: 'no-matches',
        path: '',
        name: 'Você não tem mais matchs na sua localidade',
      });
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

      setTimeout(() => {
        this.mySwiper.removeSlide(postIndex);
        this.mySwiper.update();
      }, 0);
    }
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
  }
}
