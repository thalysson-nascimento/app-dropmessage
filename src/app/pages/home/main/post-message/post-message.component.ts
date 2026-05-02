import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardLoadingShimmerComponent } from '../../../../shared/component/card-loading-shimmer/card-loading-shimmer.component';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';
import { AIProfileInterface } from '../../../../shared/interface/ai-profile.interface';
import { Post } from '../../../../shared/interface/post.interface';
import { PostMessageService } from '../../../../shared/service/post/post.service';
import { AdmobVideoRewardComponent } from '../../admob-video-reward/admob-video-reward.component';
import { LikeLimiteRewardComponent } from '../../like-limite-reward/like-limite-reward.component';
import { SwiperContainerComponent } from './swiper-container/swiper-container.component';

@Component({
  selector: 'app-post-message',
  templateUrl: './post-message.component.html',
  styleUrls: ['./post-message.component.scss'],
  imports: [
    LogoDropmessageComponent,
    ButtonDirective,
    ErrorRequestComponent,
    CardLoadingShimmerComponent,
    LoadShimmerComponent,
    TranslateModule,
    SwiperContainerComponent,
    CommonModule,
    LikeLimiteRewardComponent,
    AdmobVideoRewardComponent,
  ],
  standalone: true,
})
export class PostMessageComponent implements OnInit {
  public loading = false;
  public error = false;
  public profileAI: { name: string; typeProfle: string; avatar: string } = {
    name: '',
    typeProfle: '',
    avatar: '',
  };
  public postMessage!: Post;
  public aiProfiles!: AIProfileInterface[];
  public showCard = false;
  public showRewardCard = false;

  constructor(
    private router: Router,
    private postMessageService: PostMessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadPostMessage();
  }

  goToTakePicture(): void {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }

  goToIAProfile() {
    this.router.navigate(['home/main/ia-profile']);
  }

  loadPostMessage() {
    this.loading = true;

    this.postMessageService.listPost().subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        this.postMessage = response;

        if (response.interests === 'male') {
          this.profileAI = {
            name: 'David',
            typeProfle:
              this.translate.currentLang === 'pt' ? 'Misterioso' : 'Mysterious',
            avatar: 'assets/images/ai-david.png',
          };
        } else if (response.interests === 'female') {
          this.profileAI = {
            name: 'Sophia',
            typeProfle:
              this.translate.currentLang === 'pt'
                ? 'Provocante'
                : 'Provocative',
            avatar: 'assets/images/ai-sophia.png',
          };
        }

        if (response.items.length === 1) {
          if (response.items[0].type.includes('WATCH_VIDEO')) {
            setTimeout(() => {
              this.showCard = true;
            }, 500);
          }
        }

        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  closeAdmobModalReward() {
    console.log('carregar novamente os posts');
    this.loadPostMessage();
  }

  public closeCard() {
    console.log('fechado cards');
    this.loadPostMessage();
    this.showCard = false;
  }

  public openVideoReward() {
    this.showCard = false;
    this.showRewardCard = true;
  }

  public closeVideoReward() {
    console.log('fechado video reward');
    this.showRewardCard = false;
    this.loadPostMessage();
  }
}
