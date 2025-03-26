import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AdmobService } from '../../../../shared/service/ad-mob/ad-mob.service';
import { LottieAnimationIconService } from '../../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';

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
    await this.admobService
      .rewardVideo()
      .catch((error) => {
        console.log(error);
        this.erroLoadVideoReward = true;
        this.isLoading = false;
      })
      .finally(async () => {
        this.isLoading = false;

        await Preferences.set({
          key: 'preferencesWatchedVideoRewardAdmob',
          value: JSON.stringify(true),
        });

        // this.router.navigateByUrl('home/view-card-free-trial');
        this.router.navigateByUrl('home/post-messages');
      });
  }

  goToCardFreeTrial() {
    this.router.navigateByUrl('home/post-messages');
    // this.router.navigateByUrl('home/view-card-free-trial');
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
