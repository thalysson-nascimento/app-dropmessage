import { Injectable } from '@angular/core';
import {
  AdLoadInfo,
  AdMob,
  AdMobRewardItem,
  AdmobConsentStatus,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  constructor() {
    this.initializeAdmob();
  }

  async initializeAdmob(): Promise<void> {
    await AdMob.initialize({
      initializeForTesting: true,
      testingDevices: ['EMULATOR'],
    });

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    if (trackingInfo.status === 'notDetermined') {
      console.log('Waiting for TrackingAuthorization...');
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
    try {
      AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
        console.log('Vídeo com recompensa carregado:', info);
      });

      AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        (rewardItem: AdMobRewardItem) => {
          console.log(rewardItem);
        }
      );

      const options: RewardAdOptions = {
        adId: 'ca-app-pub-8691674404508428/6895932094', // Substitua pelo ID do bloco de anúncios do AdMob
        isTesting: true, // Ativar modo de teste
        ssv: {
          // userId: 'ca-app-pub-8691674404508428~8935039558', // ID do usuário para o servidor SSV
          userId: 'user_id_teste',
          customData: JSON.stringify({ email: 'user@example.com' }), // Dados personalizados
        },
      };
      const isPrepared = await AdMob.prepareRewardVideoAd(options);

      if (isPrepared) {
        console.log('O vídeo com recompensa foi carregado com sucesso.');
        await AdMob.showRewardVideoAd(); // Exibir o vídeo
      } else {
        console.error('Erro ao carregar o vídeo com recompensa.');
      }
    } catch (error) {
      console.error('Erro ao preparar/exibir o vídeo de recompensa:', error);
    }
  }

  async removeAdMob() {
    await AdMob.removeBanner();
  }
}
