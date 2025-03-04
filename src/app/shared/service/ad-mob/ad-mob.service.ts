import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdLoadInfo,
  AdMob,
  AdMobRewardItem,
  AdmobConsentStatus,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { catchError, map, of, switchMap } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { AdmobAdID } from '../../interface/admob-ad-id.interface';
import { PreferencesUserAuthenticateService } from '../preferences-user-authenticate/preferences-user-authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private httpClient: HttpClient
  ) {
    this.initializeAdmob();
  }

  async initializeAdmob(): Promise<void> {
    await AdMob.initialize({
      initializeForTesting: false,
    });

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    if (trackingInfo.status === 'notDetermined') {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/

      await AdMob.requestTrackingAuthorization();
    }

    const authorizationStatus = await AdMob.trackingAuthorizationStatus();
    if (
      authorizationStatus.status === 'authorized' &&
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm();
    }
  }

  async rewardVideo(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
          resolve();
        });

        AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          (rewardItem: AdMobRewardItem) => {}
        );

        this.preferencesUserAuthenticateService
          .getToken()
          .pipe(
            map((response) => {
              if (response) {
                const userHashPublic =
                  response.userVerificationData.userHashPublic;
                const userEmail = response.avatar.user.email;
                return { userHashPublic, userEmail };
              }
              throw new Error('Token inválido ou não encontrado.');
            }),
            switchMap(({ userHashPublic, userEmail }) => {
              return this.httpClient
                .get<AdmobAdID>(`${this.baseURL}/admob/public-key/`)
                .pipe(
                  map((admobResponse) => ({
                    admobResponse,
                    userHashPublic,
                    userEmail,
                  })),
                  catchError((error) => {
                    console.error('Erro durante a execução:', error);
                    return of(null);
                  })
                );
            })
          )
          .subscribe({
            next: async (data) => {
              if (data) {
                const { admobResponse, userHashPublic, userEmail } = data;

                console.log(
                  'Ad ===>',
                  admobResponse,
                  userHashPublic,
                  userEmail
                );

                const options: RewardAdOptions = {
                  adId: admobResponse.admob.adId,
                  isTesting: admobResponse.admob.adIsTest,
                  ssv: {
                    userId: userHashPublic,
                    customData: JSON.stringify({ email: userEmail }),
                  },
                };

                const isPrepared = await AdMob.prepareRewardVideoAd(options);

                if (isPrepared) {
                  await AdMob.showRewardVideoAd();
                } else {
                  console.error('Erro ao carregar o vídeo com recompensa.');
                  reject('Erro ao carregar o vídeo com recompensa.');
                }
              }
            },
          });
      } catch (error) {
        console.error('Erro ao preparar/exibir o vídeo de recompensa:', error);
        reject(error);
      }
    });
  }

  async removeAdMob() {
    await AdMob.removeBanner();
  }
}
