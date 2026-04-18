import { Injectable } from '@angular/core';
import {
  AdMob,
  AdmobConsentStatus,
  InterstitialAdPluginEvents,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { lastValueFrom, map } from 'rxjs';
import { PreferencesUserAuthenticateService } from '../preferences-user-authenticate/preferences-user-authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  private isShowingAd = false;

  constructor(
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {
    this.initializeAdmob();
  }

  async initializeAdmob(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      console.log('[AdMob] Web detectado → mock ativo');
      return;
    }

    await AdMob.initialize({
      initializeForTesting: false, // Ativar modo de teste
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

  async removeAdMob() {
    await AdMob.removeBanner();
  }

  async showRewardAd(): Promise<{
    rewarded: boolean;
    completed: boolean;
  }> {
    // 🚫 BLOQUEIA múltiplos anúncios
    if (this.isShowingAd) {
      return Promise.reject('Já existe um anúncio sendo exibido');
    }

    this.isShowingAd = true;

    if (Capacitor.getPlatform() === 'web') {
      console.log('[AdMob][MOCK] Reward video mock web');
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isShowingAd = false;
          resolve({ rewarded: true, completed: true });
        }, 2800);
      });
    }

    return new Promise(async (resolve, reject) => {
      let rewarded = false;

      let rewardListener: any;
      let dismissListener: any;

      try {
        rewardListener = await AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          () => {
            rewarded = true;
          }
        );

        dismissListener = await AdMob.addListener(
          RewardAdPluginEvents.Dismissed,
          async () => {
            await rewardListener.remove();
            await dismissListener.remove();

            this.isShowingAd = false; // 👈 LIBERA novamente

            resolve({
              rewarded,
              completed: true,
            });
          }
        );

        const userData = await lastValueFrom(
          this.preferencesUserAuthenticateService.getToken().pipe(
            map((response) => {
              if (response) {
                return {
                  userHashPublic: response.userVerificationData.userHashPublic,
                };
              }
              throw new Error('Token inválido ou não encontrado.');
            })
          )
        );

        const options: RewardAdOptions = {
          adId: 'ca-app-pub-3940256099942544/5224354917', // teste correto
          // adId: 'ca-app-pub-8691674404508428/7187041674', //anuncio real
          ssv: {
            userId: userData.userHashPublic,
          },
        };

        const prepared = await AdMob.prepareRewardVideoAd(options);

        if (!prepared) {
          this.isShowingAd = false; // 👈 IMPORTANTE
          reject('Falha ao preparar anúncio');
          return;
        }

        await AdMob.showRewardVideoAd();
      } catch (err) {
        this.isShowingAd = false; // 👈 IMPORTANTE

        if (rewardListener) await rewardListener.remove();
        if (dismissListener) await dismissListener.remove();

        reject(err);
      }
    });
  }

  async showInterstitial(): Promise<void> {
    if (this.isShowingAd) {
      return Promise.reject('Já existe um anúncio sendo exibido');
    }

    this.isShowingAd = true;

    // 🔵 MOCK WEB
    if (Capacitor.getPlatform() === 'web') {
      console.log('[AdMob][MOCK] Iniciando interstitial...');

      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('[AdMob][MOCK] Anúncio exibido');
        }, 500);

        setTimeout(() => {
          console.log('[AdMob][MOCK] Usuário visualizando...');
        }, 1500);

        setTimeout(() => {
          console.log('[AdMob][MOCK] Usuário fechou anúncio');
          this.isShowingAd = false;
          resolve();
        }, 3000); // simula tempo real
      });
    }

    return new Promise(async (resolve, reject) => {
      let dismissListener: any;

      try {
        dismissListener = await AdMob.addListener(
          InterstitialAdPluginEvents.Dismissed,
          async () => {
            await dismissListener.remove();

            this.isShowingAd = false; // 👈 LIBERA

            resolve();
          }
        );

        const prepared = await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-3940256099942544/1033173712', // teste correto
        });

        if (!prepared) {
          this.isShowingAd = false; // 👈 IMPORTANTE
          reject('Erro ao carregar interstitial');
          return;
        }

        await AdMob.showInterstitial();
      } catch (error) {
        this.isShowingAd = false; // 👈 IMPORTANTE

        if (dismissListener) await dismissListener.remove();
        reject(error);
      }
    });
  }
}
