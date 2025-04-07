import { NativeModules, Platform } from 'react-native';
const Tapjoy = NativeModules.TapjoyReactNativeSdk;
class TJPrivacyPolicy {
    async getBelowConsentAge() {
        try {
            let isBelowConsentAge = await Tapjoy.getBelowConsentAge();
            return isBelowConsentAge;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getSubjectToGDPR() {
        try {
            let isSubjectToGDPR = await Tapjoy.getSubjectToGDPR();
            return isSubjectToGDPR;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    setUSPrivacy(usPrivacy) {
        Tapjoy.setUSPrivacy(usPrivacy);
    }
    async getUSPrivacy() {
        try {
            let usPrivacy = await Tapjoy.getUSPrivacy();
            return usPrivacy;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getUserConsent() {
        try {
            let userConsent = await Tapjoy.getUserConsent();
            return userConsent;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    setBelowConsentAgeStatus(isBelowConsentAgeStatus) {
        Tapjoy.setBelowConsentAgeStatus(isBelowConsentAgeStatus);
    }
    setSubjectToGDPRStatus(isSubjectToGDPRStatus) {
        Tapjoy.setSubjectToGDPRStatus(isSubjectToGDPRStatus);
    }
    setUserConsentStatus(userConsentStatus) {
        Tapjoy.setUserConsentStatus(userConsentStatus);
    }
    optOutAdvertisingID(optOut) {
        if (Platform.OS === 'android') {
            Tapjoy.optOutAdvertisingID(optOut);
        }
        else {
            console.warn('optOutAdvertisingID is only supported on Android.');
        }
    }
    getOptOutAdvertisingID() {
        if (Platform.OS === 'android') {
            return Tapjoy.getOptOutAdvertisingID();
        }
        else {
            console.warn('getOptOutAdvertisingID is only supported on Android.');
            return Promise.resolve(false);
        }
    }
}
export default TJPrivacyPolicy;
