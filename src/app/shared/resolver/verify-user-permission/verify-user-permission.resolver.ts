import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, map } from 'rxjs';
import { PreferencesUserAuthenticateService } from '../../service/preferences-user-authenticate/preferences-user-authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class VerifyUserPermissionResolver implements Resolve<boolean> {
  watchVideoRewardAdmob = false;
  constructor(
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private router: Router
  ) {}

  resolve(): Observable<boolean> {
    Preferences.get({ key: 'preferencesWatchedVideoRewardAdmob' }).then(
      (result) => {
        console.log('result.value ==>', result.value);
        if (result.value === 'true') {
          return (this.watchVideoRewardAdmob = true);
        }

        Preferences.set({
          key: 'preferencesWatchedVideoRewardAdmob',
          value: JSON.stringify(false),
        });

        return (this.watchVideoRewardAdmob = false);
      }
    );

    return this.preferencesUserAuthenticateService.getToken().pipe(
      map((userData) => {
        if (!userData?.userVerificationData.verificationTokenEmail) {
          this.router.navigateByUrl('home/verify-token-email');
          return false;
        }

        if (!userData?.userVerificationData.isUploadAvatar) {
          this.router.navigateByUrl('home/create-avatar');
          return false;
        }

        if (!userData?.userVerificationData.validatorLocation) {
          this.router.navigateByUrl('home/user-location');
          return false;
        }

        if (
          userData?.goldFreeTrialData !== null &&
          !userData?.goldFreeTrialData?.viewCardFreeTrial
        ) {
          // this.router.navigateByUrl('home/view-card-free-trial');
          this.router.navigateByUrl('home/admob-video-reward-free-trial');
          return false;
        }

        // Verificar se statusSignature false e watchVideoRewardAdmob false
        if (
          (userData.statusSignature === false &&
            this.watchVideoRewardAdmob === false) ||
          this.watchVideoRewardAdmob === null
        ) {
          this.router.navigateByUrl('home/admob-video-reward-free-trial');
          return false;
        }

        return true;
      })
    );
  }
}
