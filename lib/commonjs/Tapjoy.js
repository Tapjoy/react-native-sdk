import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import TJConnect from './TJConnect';
const LINKING_ERROR = `The package 'tapjoy-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';
const TapjoyAPI = NativeModules.TapjoyReactNativeSdk
    ? NativeModules.TapjoyReactNativeSdk
    : new Proxy({}, {
        get() {
            throw new Error(LINKING_ERROR);
        },
    });
class Tapjoy {
    /**
     * Connects to the Tapjoy Server.
     *
     * @param sdkKey Your Tapjoy SDK Key.
     * @param flags Special connect flags.
     * @param onWarning Callback for connection warning.
     *
     * @return true if successful or error message if failed.
     */
    static async connect(sdkKey, flags, onWarning) {
        const TJ = NativeModules.TapjoyReactNativeSdk;
        const TapjoyEmitter = new NativeEventEmitter(TJ);
        const TapjoyEventType = 'Tapjoy';
        const subscription = TapjoyEmitter.addListener(TapjoyEventType, (event) => {
            if (event.name === TJConnect.TJC_CONNECT_WARNING) {
                onWarning?.(event);
                subscription.remove();
            }
        });
        return await TapjoyAPI.connect(sdkKey, flags);
    }
    ;
    /**
     * Helper function to check if SDK is initialized
     *
     * @return true if successful
     */
    static isConnected() {
        return TapjoyAPI.isConnected();
    }
    ;
    /**
     * Gets the virtual currency data from the server for this device.
   *
   * @returns a map with "currencyName" and "amount" or error message if failed.
     */
    static async getCurrencyBalance() {
        return await TapjoyAPI.getCurrencyBalance();
    }
    /**
     * Spends virtual currency. This can only be used for currency managed by
       * Tapjoy.
     *
     * @param amount the amount of currency
     * @return a map with "currencyName" and "amount" or error message if failed.
       */
    static async spendCurrency(amount) {
        return await TapjoyAPI.spendCurrency(amount);
    }
    /**
       * Awards virtual currency. This can only be used for currency managed by
       * Tapjoy.
       *
       * @param amount the amount of currency
     * @return a map with "currencyName" and "amount" or error message if failed.
       */
    static async awardCurrency(amount) {
        return await TapjoyAPI.awardCurrency(amount);
    }
    /**
       * Tracks a purchase
       *
       * @param currencyCode
       *            the currency code of price as an alphabetic currency code
       *            specified in ISO 4217, i.e. "USD", "KRW"
       * @param price
       *            the price of product
       */
    static trackPurchase(currencyCode, price) {
        TapjoyAPI.trackPurchase(currencyCode, price);
    }
    /**
     * Enables or disables Tapjoy logging
     *
     * @param enable
     *            set to true if logging should be enabled, false to disable
     *            logging
     */
    static setDebugEnabled(enable) {
        TapjoyAPI.setDebugEnabled(enable);
    }
    ;
    /**
       * Assigns a user ID for this user/device. This is used to identify the user
       * in your application.
       *
       * This is REQUIRED for NON-MANAGED currency apps.
       *
       * @param userID
       *            user ID you wish to assign to this device
     * @return the user ID if successful or error message if failed.
       */
    static async setUserId(userID) {
        return await TapjoyAPI.setUserId(userID);
    }
    /**
       * Gets the ID of the user.
       *
       * @return the id of the user.
       */
    static async getUserId() {
        return await TapjoyAPI.getUserId();
    }
    /**
       * Sets the level of the user.
       *
       * @param userLevel
       *            the level of the user
       */
    static setUserLevel(userLevel) {
        TapjoyAPI.setUserLevel(userLevel);
    }
    /**
       * Gets the level of the user.
       *
       * @return the level of the user.
       */
    static async getUserLevel() {
        return await TapjoyAPI.getUserLevel();
    }
    /**
       * Sets the maximum level of the user.
       *
       * @param maxUserLevel
       *            the maximum level
       */
    static setMaxLevel(maxUserLevel) {
        TapjoyAPI.setMaxLevel(maxUserLevel);
    }
    /**
       * Gets the maximum level of the user.
       *
       * @return the maximum level
       */
    static async getMaxLevel() {
        return await TapjoyAPI.getMaxLevel();
    }
    /**
     * Sets the segment of the user
     *
     * @param segment NON_PAYER (0), PAYER (1), VIP (2)
     *
     */
    static setUserSegment(segment) {
        TapjoyAPI.setUserSegment(segment);
    }
    /**
       * Gets the segment of the user
       *
       * @return userSegment NON_PAYER (0), PAYER (1), VIP (2)
       *
       */
    static async getUserSegment() {
        return await TapjoyAPI.getUserSegment();
    }
    /**
       * Sets tags for the user.
       *
       * @param tags
       *        the tags to be set
       */
    static setUserTags(tags) {
        TapjoyAPI.setUserTags(tags);
    }
    /**
       * Returns a String set which contains tags on the user.
       *
       * @return list of user tags
       */
    static async getUserTags() {
        return TapjoyAPI.getUserTags();
    }
    /**
       * Removes all tags from the user.
       */
    static clearUserTags() {
        TapjoyAPI.clearUserTags();
    }
    /**
       * Adds the given tag to the user if it is not already present.
       *
       * @param tag
       *        the tag to be added
       */
    static addUserTag(tag) {
        TapjoyAPI.addUserTag(tag);
    }
    /**
       * Removes the given tag from the user if it is present.
       *
       * @param tag
       *        the tag to be removed
       */
    static removeUserTag(tag) {
        TapjoyAPI.removeUserTag(tag);
    }
}
export default Tapjoy;
