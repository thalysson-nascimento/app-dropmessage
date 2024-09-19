import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import { default as lottie } from 'lottie-web';
import { register } from 'swiper/element/bundle';
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
  mySwiper: any;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPostService();
  }

  ngAfterViewInit() {
    this.loadAnimationIcon('like-heart.json', 'lottie-container');
    this.initializeSwiper();
  }

  loadPostService() {
    this.postService.listPost().subscribe((response) => {
      this.posts = response;
      console.log('response: ', this.posts);

      // Adiciona o último slide com a mensagem no final do array
      this.posts.push({
        id: 'no-matches',
        path: '',
        name: 'Você não tem mais matchs na sua localidade',
      });
    });
  }

  loadAnimationIcon(pathIconAnimation: string, idElement: string) {
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

  initializeSwiper() {
    const swiperContainer = document.querySelector('.mySwiper') as any;

    if (swiperContainer) {
      this.mySwiper = swiperContainer.swiper;

      this.mySwiper.on('slideChangeTransitionEnd', () => {
        const activeIndex = this.mySwiper.activeIndex;

        // Checa se o slide atual não é o último
        if (activeIndex > 0) {
          const postToRemove = this.posts[activeIndex - 1];

          console.log('Slide mudou para: ', activeIndex);
          console.log('Post ativo: ', postToRemove.id);

          // Remove o post ativo da lista de posts, mas não o último com a mensagem
          this.removePost(postToRemove.id);
        }
      });

      this.mySwiper.on('reachBeginning', () => {
        console.log('Chegou ao primeiro slide');
      });

      this.mySwiper.on('reachEnd', () => {
        console.log('Chegou ao último slide');
      });
    }
  }

  removePost(postId: string) {
    const postIndex = this.posts.findIndex((post) => post.id === postId);

    // Não remover o último post (com a mensagem)
    if (postIndex !== -1 && postId !== 'no-matches') {
      this.posts.splice(postIndex, 1);
      console.log('Post removido com ID: ', postId);

      setTimeout(() => {
        this.mySwiper.removeSlide(postIndex);
        this.mySwiper.update();
        console.log('Swiper atualizado e slide removido:', this.mySwiper);
      }, 0);
    }
  }
}
