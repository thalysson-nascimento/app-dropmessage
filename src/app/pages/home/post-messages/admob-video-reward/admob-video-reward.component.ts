import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdmobService } from '../../../../shared/service/ad-mob/ad-mob.service';
import { LottieAnimationIconService } from '../../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';

const CoreModule = [NgIf];

@Component({
  selector: 'app-admob-video-reward',
  templateUrl: './admob-video-reward.component.html',
  styleUrls: ['./admob-video-reward.component.scss'],
  standalone: true,
  imports: [...CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdmobVideoRewardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  isLoading: boolean = true;

  constructor(
    private admobService: AdmobService,
    private router: Router,
    private lottieAnimationIconService: LottieAnimationIconService
  ) {}
  ngAfterViewInit(): void {
    this.initializeLottieAnimation();
  }

  ngOnInit() {
    this.onShowRewardAd();
  }

  ngOnDestroy(): void {
    this.admobService.removeAdMob();
  }

  async onShowRewardAd() {
    this.isLoading = true;
    try {
      await this.admobService.rewardVideo();
    } catch (error) {
      console.error('Erro ao carregar vídeo de recompensa:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
  }

  initializeLottieAnimation(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
  }
}
