import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PreferencesUserAuthenticateService } from '../../service/preferences-user-authenticate/preferences-user-authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class VerifyUserPermissionResolver implements Resolve<boolean> {
  constructor(
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private router: Router
  ) {}

  resolve(): Observable<boolean> {
    return this.preferencesUserAuthenticateService.getToken().pipe(
      map((userData) => {
        console.log('!!aaa!====>', userData);

        if (!userData?.userVerificationData.verificationTokenEmail) {
          console.log('Nao tem token de verificação de email');
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

        return true;
      })
    );
  }
}
