import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { AdmobService } from '../../../shared/service/ad-mob/ad-mob.service';
import { ConfirmRewardService } from '../../../shared/service/confirm-reward/confirm-reward.service';
import { UserPostMessageService } from '../../../shared/service/user-post-message/user-post-message.service';

@Component({
  selector: 'app-admob-video-reward',
  templateUrl: './admob-video-reward.component.html',
  styleUrls: ['./admob-video-reward.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class AdmobVideoRewardComponent implements OnInit, OnDestroy {
  @Input() mode: 'likes' | 'comment' = 'likes';
  @Input() commentPostId?: string;
  @Input() customTitle?: string;
  @Input() customDescription?: string;

  @Output() close = new EventEmitter<void>();
  @Output() rewarded = new EventEmitter<boolean>();

  isLoading: boolean = true;
  erroLoadVideoReward: boolean = false;
  statusMessage: string = 'text.videoRewardLoading';
  isWeb: boolean = Capacitor.getPlatform() === 'web';
  rewardConfirmed: boolean = false;
  showButtonClose: boolean = false;

  constructor(
    private admobService: AdmobService,
    private confirmRewardService: ConfirmRewardService,
    private userPostMessageService: UserPostMessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onShowRewardAd();
  }

  ngOnDestroy() {
    this.admobService.removeAdMob();
  }

  async onShowRewardAd() {
    this.isLoading = true;
    this.erroLoadVideoReward = false;
    this.rewardConfirmed = false;
    this.statusMessage = 'text.videoRewardLoading';

    try {
      const result = await this.admobService.showRewardAd();

      if (result.rewarded) {
        console.log('Vídeo assistido com sucesso');
        this.statusMessage = 'text.videoRewardChecking';
        let confirmSuccess = false;

        if (this.mode === 'comment') {
          if (this.commentPostId) {
            try {
              const res = await lastValueFrom(
                this.userPostMessageService.unlockComment(this.commentPostId)
              );
              confirmSuccess = !!res;
            } catch (err) {
              console.error('Error unlocking comment in video component:', err);
            }
          }
        } else {
          try {
            const confirmResult = await lastValueFrom(
              this.confirmRewardService.confirmReward()
            );
            confirmSuccess = !!confirmResult?.success;
          } catch (err) {
            console.error('Error confirming likes reward:', err);
          }
        }

        if (confirmSuccess) {
          console.log('Recompensa confirmada, setando rewardConfirmed = true');
          this.rewardConfirmed = true;
          this.statusMessage = 'text.videoRewardReleased';
          this.rewarded.emit(true);
          this.showButtonClose = true;
          this.cd.detectChanges();
        } else {
          console.log('Falha na confirmação da recompensa');
          this.showButtonClose = true;
          this.statusMessage = 'text.videoRewardConfirmError';
          this.rewardConfirmed = false;
        }
      } else {
        console.log('Vídeo não assistido completamente');
        this.statusMessage = 'text.videoRewardIncomplete';
        this.rewarded.emit(false);
      }
    } catch (error) {
      console.error('[AdmobVideoReward] erro:', error);
      this.erroLoadVideoReward = true;
      this.showButtonClose = true;
      this.statusMessage = 'text.videoRewardErrorLoad';
    } finally {
      this.isLoading = false;
    }
  }

  retry() {
    this.onShowRewardAd();
  }

  closeOverlay() {
    this.close.emit();
  }
}
