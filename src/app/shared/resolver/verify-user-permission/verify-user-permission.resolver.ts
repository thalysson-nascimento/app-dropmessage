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
          this.router.navigateByUrl('home/code-confirmation');
          return false;
        }

        if (!userData?.userVerificationData.isUploadAvatar) {
          this.router.navigateByUrl('home/create-avatar');
          return false;
        }

        if (!userData?.userVerificationData.bio) {
          this.router.navigateByUrl('home/user-description');
          return false;
        }
        return true;
      })
    );
  }
}
