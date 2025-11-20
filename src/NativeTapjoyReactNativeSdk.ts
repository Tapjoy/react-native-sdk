import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  connect(sdkKey: string, connectFlags: Object): Promise<boolean>;
  
  isConnected(): boolean;
  
  setLoggingLevel(loggingLevel: number): void;
  
  getLoggingLevel(): Promise<number>;
  
  setUserId(userId?: string): Promise<string>;
  
  getUserId(): Promise<string>;
  
  setUserLevel(userLevel: number): void;
  
  getUserLevel(): Promise<number>;
  
  setMaxLevel(maxLevel: number): void;
  
  getMaxLevel(): Promise<number>;
  
  setUserSegment(userSegment: number): void;
  
  getUserSegment(): Promise<number>;
  
  setUserTags(tags: Array<string>): void;
  
  getUserTags(): Promise<Array<string>>;
  
  clearUserTags(): void;
  
  addUserTag(tag: string): void;
  
  removeUserTag(tag: string): void;
  
  setCustomParameter(customParameter: string): void;
  
  getCustomParameter(): Promise<string>;
  
  getCurrencyBalance(): Promise<Object>;
  
  spendCurrency(amount: number): Promise<Object>;
  
  awardCurrency(amount: number): Promise<Object>;
  
  createPlacement(name: string): void;
  
  requestPlacement(name: string): void;
  
  showPlacement(name: string): void;
  
  isContentReady(name: string): boolean;
  
  isContentAvailable(name: string): boolean;
  
  setEntryPoint(name: string, entryPoint: number): void;
  
  getEntryPoint(name: string): Promise<number>;
  
  setCurrencyBalance(
    amount: number,
    currencyId: string,
    placementName: string
  ): Promise<Object>;
  
  getPlacementCurrencyBalance(
    currencyId: string,
    placementName: string
  ): Promise<number>;
  
  setRequiredAmount(
    requiredAmount: number,
    currencyId: string,
    placementName: string
  ): Promise<Object>;
  
  getRequiredAmount(
    currencyId: string,
    placementName: string
  ): Promise<number>;
  
  trackPurchase(currencyCode: string, price: number): void;
  
  setSubjectToGDPRStatus(gdprApplicableStatus: number): void;
  
  getBelowConsentAge(): Promise<number>;
  
  getSubjectToGDPR(): Promise<number>;
  
  getUserConsent(): Promise<number>;
  
  getUSPrivacy(): Promise<string>;
  
  setBelowConsentAgeStatus(isBelowConsentAgeStatus: number): void;
  
  setUSPrivacy(privacyValue: string): void;
  
  setUserConsentStatus(userConsentStatus: number): void;
  
  getUsageStatsConsent(): Promise<number>;
  
  setUsageStatsConsent(usageStatsConsent: number): void;
  
  optOutAdvertisingID(optOut: boolean): void;
  
  getOptOutAdvertisingID(): Promise<boolean>;
  
  addListener(eventName: string): void;
  
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.get<Spec>('TapjoyReactNativeSdk');

