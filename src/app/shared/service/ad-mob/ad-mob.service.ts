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
    const isNative = Capacitor.isNativePlatform();

    if (!isNative) {
      console.log('[AdMob] Browser detected -> mock mode enabled');
      return;
    }

    try {
      await AdMob.initialize({
        initializeForTesting: false,
      });

      try {
        const [trackingInfo, consentInfo] = await Promise.all([
          AdMob.trackingAuthorizationStatus(),
          AdMob.requestConsentInfo(),
        ]);

        if (trackingInfo.status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }

        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdmobConsentStatus.REQUIRED
        ) {
          await AdMob.showConsentForm();
        }
      } catch (error) {
        console.error('[Consent Error]', error);
      }
    } catch (error) {
      console.error('[AdMob] Initialization error', error);
    }
  }
  async removeAdMob() {
    await AdMob.removeBanner();
  }

  async showRewardAd(): Promise<{
    rewarded: boolean;
    completed: boolean;
  }> {
    if (this.isShowingAd) {
      return Promise.reject('An ad is already being displayed');
    }

    this.isShowingAd = true;

    const isNative = Capacitor.isNativePlatform();

    // MOCK ONLY ON BROWSER
    if (!isNative) {
      console.log('[AdMob MOCK] Reward ad');

      return new Promise((resolve) => {
        setTimeout(() => {
          this.isShowingAd = false;

          resolve({
            rewarded: true,
            completed: true,
          });
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
            console.log('[Reward] User rewarded');

            rewarded = true;
          }
        );

        dismissListener = await AdMob.addListener(
          RewardAdPluginEvents.Dismissed,
          async () => {
            await rewardListener.remove();
            await dismissListener.remove();

            this.isShowingAd = false;

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

              throw new Error('Invalid token');
            })
          )
        );

        const options: RewardAdOptions = {
          adId: 'ca-app-pub-8691674404508428/7187041674',

          ssv: {
            userId: userData.userHashPublic,
          },
        };

        console.log('[Reward] Preparing ad');

        const prepared = await AdMob.prepareRewardVideoAd(options);

        if (!prepared) {
          this.isShowingAd = false;

          reject('Failed to prepare reward ad');

          return;
        }

        console.log('[Reward] Showing ad');

        await AdMob.showRewardVideoAd();
      } catch (err) {
        console.error('[Reward] Error', err);

        this.isShowingAd = false;

        if (rewardListener) {
          await rewardListener.remove();
        }

        if (dismissListener) {
          await dismissListener.remove();
        }

        reject(err);
      }
    });
  }

  async showInterstitial(): Promise<void> {
    if (this.isShowingAd) {
      return Promise.reject('An ad is already being displayed');
    }

    this.isShowingAd = true;

    const isNative = Capacitor.isNativePlatform();

    console.log('[Interstitial]', {
      platform: Capacitor.getPlatform(),
      isNative,
    });

    // MOCK ONLY ON REAL BROWSER
    if (!isNative) {
      console.log('[Interstitial MOCK] Starting');

      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('[Interstitial MOCK] Finished');

          this.isShowingAd = false;

          resolve();
        }, 3000);
      });
    }

    return new Promise(async (resolve, reject) => {
      let dismissListener: any;

      try {
        dismissListener = await AdMob.addListener(
          InterstitialAdPluginEvents.Dismissed,
          async () => {
            console.log('[Interstitial] Dismissed');

            await dismissListener.remove();

            this.isShowingAd = false;

            resolve();
          }
        );

        console.log('[Interstitial] Preparing');

        const prepared = await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-8691674404508428/6422423791',
          // adId: 'ca-app-pub-3940256099942544/1033173712', // TEST AD UNIT ID
        });

        console.log('[Interstitial] Prepared:', prepared);

        if (!prepared) {
          this.isShowingAd = false;

          reject('Failed to load interstitial');

          return;
        }

        console.log('[Interstitial] Showing');

        await AdMob.showInterstitial();
      } catch (error) {
        console.error('[Interstitial] Error', error);

        this.isShowingAd = false;

        if (dismissListener) {
          await dismissListener.remove();
        }

        reject(error);
      }
    });
  }
}
