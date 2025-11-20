import { NativeModules, Platform } from 'react-native';
import NativeTapjoyReactNativeSdk from './NativeTapjoyReactNativeSdk';
import { isTurboModuleEnabled } from './utils/ArchitectureDetection';
import TJStatus from './TJStatus';


const LINKING_ERROR =
`The package 'tapjoy-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
'- You rebuilt the app after installing the package\n' +
'- You are not using Expo Go\n';

const TapjoyAPI = isTurboModuleEnabled()
  ? NativeTapjoyReactNativeSdk
  : NativeModules.TapjoyReactNativeSdk
  ? NativeModules.TapjoyReactNativeSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class TJPrivacyPolicy {
  async getBelowConsentAge(): Promise<TJStatus> {
    try {
      let isBelowConsentAge: TJStatus = await TapjoyAPI.getBelowConsentAge();
      return isBelowConsentAge;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getSubjectToGDPR(): Promise<TJStatus> {
    try {
      let isSubjectToGDPR: TJStatus = await TapjoyAPI.getSubjectToGDPR();
      return isSubjectToGDPR;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setUSPrivacy(usPrivacy: string): void {
    TapjoyAPI.setUSPrivacy(usPrivacy);
  }

  async getUSPrivacy(): Promise<string> {
    try {
      let usPrivacy: string = await TapjoyAPI.getUSPrivacy();
      return usPrivacy;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUserConsent(): Promise<TJStatus> {
    try {
      let userConsent: TJStatus = await TapjoyAPI.getUserConsent();
      return userConsent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * WARNING: EXPERIMENTAL API - DO NOT USE IT
   *
   * Android only.
   *
   * This method is experimental and intended for internal purposes only.
   *
   * Returns the user's consent status for accessing Android's Usage Stats API.
   *
   * @return TJStatus.True if the user agrees, TJStatus.False otherwise
   */
  async getUsageStatsConsent(): Promise<TJStatus> {
    if (Platform.OS === 'android') {
      try {
        return await TapjoyAPI.getUsageStatsConsent();
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      console.warn('getUsageStatsConsent is only supported on Android.');
      return Promise.resolve(TJStatus.Unknown);
    }
  }

  setBelowConsentAgeStatus(isBelowConsentAgeStatus: TJStatus): void {
    TapjoyAPI.setBelowConsentAgeStatus(isBelowConsentAgeStatus);
  }

  setSubjectToGDPRStatus(isSubjectToGDPRStatus: TJStatus): void {
    TapjoyAPI.setSubjectToGDPRStatus(isSubjectToGDPRStatus);
  }

  setUserConsentStatus(userConsentStatus: TJStatus): void {
    TapjoyAPI.setUserConsentStatus(userConsentStatus);
  }

  /**
   * WARNING: EXPERIMENTAL API - DO NOT USE IT
   *
   * Android only.
   *
   * This method is experimental and intended for internal purposes only.
   *
   * Sets the user's consent status for accessing Android's Usage Stats API.
   * The Android Usage Stats API (UsageStatsManager) allows apps to access
   * data about app usage on the device.
   *
   * @param usageStatsConsent TJStatus.True if the user has granted permission
   * to access their usage statistics, TJStatus.False
   * if they have denied or not yet granted permission.
   */
  setUsageStatsConsent(usageStatsConsent: TJStatus): void {
    if (Platform.OS === 'android') {
      try {
        TapjoyAPI.setUsageStatsConsent(usageStatsConsent);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      console.warn('setUsageStatsConsent is only supported on Android.');
    }
  }

  optOutAdvertisingID(optOut: boolean): void {
    if (Platform.OS === 'android') {
      TapjoyAPI.optOutAdvertisingID(optOut);
    } else {
      console.warn('optOutAdvertisingID is only supported on Android.');
    }
  }

  getOptOutAdvertisingID(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return TapjoyAPI.getOptOutAdvertisingID();
    } else {
      console.warn('getOptOutAdvertisingID is only supported on Android.');
      return Promise.resolve(false);
    }
  }
}

export default TJPrivacyPolicy;
