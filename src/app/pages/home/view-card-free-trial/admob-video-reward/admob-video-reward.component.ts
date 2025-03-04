import { CommonModule } from '@angular/common';
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
import { UpdateAdmobVideoRewardService } from '../../../../shared/service/update-admob-video-reward/update-admob-video-reward.service';

const CoreModule = [CommonModule];

@Component({
  selector: 'app-admob-video-reward',
  templateUrl: './admob-video-reward.component.html',
  styleUrls: ['./admob-video-reward.component.scss'],
  standalone: true,
  imports: [...CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdmobVideoRewardCardFreeTrialComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  isLoading: boolean = true;
  erroLoadVideoReward: boolean = false;

  constructor(
    private admobService: AdmobService,
    private router: Router,
    private lottieAnimationIconService: LottieAnimationIconService,
    private updateAdmobVideoRewardService: UpdateAdmobVideoRewardService
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
    try {
      await this.admobService.rewardVideo();
    } catch (error) {
      this.erroLoadVideoReward = true;
      this.isLoading = false;
    } finally {
      this.isLoading = false;

      this.router.navigateByUrl('home/view-card-free-trial');
    }
  }

  goToCardFreeTrial() {
    this.router.navigateByUrl('home/view-card-free-trial');
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
