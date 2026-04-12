import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdmobService } from '../../../shared/service/ad-mob/ad-mob.service';
import { ConfirmRewardService } from '../../../shared/service/confirm-reward/confirm-reward.service';

@Component({
  selector: 'app-admob-video-reward',
  templateUrl: './admob-video-reward.component.html',
  styleUrls: ['./admob-video-reward.component.scss'],
})
export class AdmobVideoRewardComponent implements OnInit {
  isLoading: boolean = true;
  erroLoadVideoReward: boolean = false;
  constructor(
    private admobService: AdmobService,
    private router: Router,
    private confirmRewardService: ConfirmRewardService
  ) {}

  ngOnInit() {}

  async onShowRewardAd() {
    this.isLoading = true;

    try {
      const result = await this.admobService.showRewardAd();

      if (result.rewarded) {
        // 🔥 CHAMA BACKEND (SSV valida depois)
        await this.confirmRewardService.confirmReward();
      } else {
        // usuário fechou sem assistir
        console.log('Usuário não completou');
      }
    } catch (error) {
      this.erroLoadVideoReward = true;
    } finally {
      this.isLoading = false;
      this.router.navigateByUrl('home/main/post-message');
    }
  }
}
