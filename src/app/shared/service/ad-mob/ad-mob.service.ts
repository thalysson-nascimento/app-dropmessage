import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdmobConsentStatus,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { lastValueFrom, map } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
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
      initializeForTesting: true, // Ativar modo de teste
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
        const adLoadListener = await AdMob.addListener(
          RewardAdPluginEvents.Loaded,
          () => {
            console.log('Anúncio carregado com sucesso.');
            resolve();
          }
        );

        const adRewardListener = await AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          (rewardItem: AdMobRewardItem) => {
            console.log('Usuário recompensado:', rewardItem);
          }
        );

        const userData = await lastValueFrom(
          this.preferencesUserAuthenticateService.getToken().pipe(
            map((response) => {
              if (response) {
                return {
                  userHashPublic: response.userVerificationData.userHashPublic,
                  userEmail: response.avatar.user.email,
                };
              }
              throw new Error('Token inválido ou não encontrado.');
            })
          )
        );

        // Configuração do anúncio
        const options: RewardAdOptions = {
          adId: 'ca-app-pub-8691674404508428/7187041674',
          // isTesting: true,
          ssv: {
            userId: userData.userHashPublic,
            customData: JSON.stringify({ email: userData.userEmail }),
          },
        };

        // Prepara e exibe o anúncio
        const isPrepared = await AdMob.prepareRewardVideoAd(options);

        if (isPrepared) {
          await AdMob.showRewardVideoAd();
        } else {
          console.error('Erro ao carregar o vídeo com recompensa.');
          reject('Erro ao carregar o vídeo com recompensa.');
        }

        await adLoadListener.remove();
        await adRewardListener.remove();
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
