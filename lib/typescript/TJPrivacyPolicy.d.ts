import TJStatus from './TJStatus';
declare class TJPrivacyPolicy {
    getBelowConsentAge(): Promise<TJStatus>;
    getSubjectToGDPR(): Promise<TJStatus>;
    setUSPrivacy(usPrivacy: string): void;
    getUSPrivacy(): Promise<string>;
    getUserConsent(): Promise<TJStatus>;
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
    getUsageStatsConsent(): Promise<TJStatus>;
    setBelowConsentAgeStatus(isBelowConsentAgeStatus: TJStatus): void;
    setSubjectToGDPRStatus(isSubjectToGDPRStatus: TJStatus): void;
    setUserConsentStatus(userConsentStatus: TJStatus): void;
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
    setUsageStatsConsent(usageStatsConsent: TJStatus): void;
    optOutAdvertisingID(optOut: boolean): void;
    getOptOutAdvertisingID(): Promise<boolean>;
}
export default TJPrivacyPolicy;
