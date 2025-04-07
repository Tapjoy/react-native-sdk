import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import TJSegment from './TJSegment';
import TJConnect from './TJConnect';

const LINKING_ERROR =
`The package 'tapjoy-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
'- You rebuilt the app after installing the package\n' +
'- You are not using Expo Go\n';

const TapjoyAPI = NativeModules.TapjoyReactNativeSdk
? NativeModules.TapjoyReactNativeSdk
: new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

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
  public static async connect(sdkKey: string, flags: object, onWarning?: (message: TapjoyEvent) => void) {
    const TJ = NativeModules.TapjoyReactNativeSdk;
    const TapjoyEmitter = new NativeEventEmitter(TJ);
    const TapjoyEventType = 'Tapjoy';
    const subscription = TapjoyEmitter.addListener(
      TapjoyEventType,
      (event: TapjoyEvent) => {
        if (event.name === TJConnect.TJC_CONNECT_WARNING) {
          onWarning?.(event);   
          subscription.remove();         
        }
    }
    );
    return await TapjoyAPI.connect(sdkKey, flags);
  };

	/**
	 * Helper function to check if SDK is initialized
	 *
	 * @return true if successful
	 */
  public static isConnected() {
    return TapjoyAPI.isConnected();
  };

	/**
	 * Gets the virtual currency data from the server for this device.
   * 
   * @returns a map with "currencyName" and "amount" or error message if failed.
	 */
  public static async getCurrencyBalance() {
    return await TapjoyAPI.getCurrencyBalance();
  }

  /**
   * Spends virtual currency. This can only be used for currency managed by
	 * Tapjoy.
   * 
   * @param amount the amount of currency
   * @return a map with "currencyName" and "amount" or error message if failed.
	 */
  public static async spendCurrency(amount: number) {
    return await TapjoyAPI.spendCurrency(amount);
  }

  /**
	 * Awards virtual currency. This can only be used for currency managed by
	 * Tapjoy.
	 *
	 * @param amount the amount of currency
   * @return a map with "currencyName" and "amount" or error message if failed.
	 */
  public static async awardCurrency(amount: number) {
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
  public static trackPurchase(currencyCode: string, price: number) {
    TapjoyAPI.trackPurchase(currencyCode, price);
  }

	/**
	 * Enables or disables Tapjoy logging
	 * 
	 * @param enable
	 *            set to true if logging should be enabled, false to disable
	 *            logging
	 */
  public static setDebugEnabled(enable: Boolean) {
    TapjoyAPI.setDebugEnabled(enable);
  };

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
  public static async setUserId(userID: string) { 
    return await TapjoyAPI.setUserId(userID);
  }

  /**
	 * Gets the ID of the user.
	 *
	 * @return the id of the user.
	 */
  public static async getUserId() {
    return await TapjoyAPI.getUserId();
  }
  
  /**
	 * Sets the level of the user.
	 * 
	 * @param userLevel
	 *            the level of the user
	 */
  public static setUserLevel(userLevel: number) {
    TapjoyAPI.setUserLevel(userLevel);
  }

  /**
	 * Gets the level of the user.
	 *
	 * @return the level of the user.
	 */
  public static async getUserLevel() {
    return await TapjoyAPI.getUserLevel();
  }

  /**
	 * Sets the maximum level of the user.
	 *
	 * @param maxUserLevel
	 *            the maximum level
	 */
  public static setMaxLevel(maxUserLevel: number) {
    TapjoyAPI.setMaxLevel(maxUserLevel);
  }

  /**
	 * Gets the maximum level of the user.
	 *
	 * @return the maximum level
	 */
  public static async getMaxLevel() {
    return await TapjoyAPI.getMaxLevel();
  }

	/**
	 * Sets the segment of the user
	 *
	 * @param segment NON_PAYER (0), PAYER (1), VIP (2)
	 *
	 */
  public static setUserSegment(segment: TJSegment) {
    TapjoyAPI.setUserSegment(segment);
  }

  /**
	 * Gets the segment of the user
	 *
	 * @return userSegment NON_PAYER (0), PAYER (1), VIP (2)
	 *
	 */
  public static async getUserSegment() {
    return await TapjoyAPI.getUserSegment();
  }

  /**
	 * Sets tags for the user.
	 *
	 * @param tags
	 *        the tags to be set
	 */
  public static setUserTags(tags: string[]) {
    TapjoyAPI.setUserTags(tags);
  }

  /**
	 * Returns a String set which contains tags on the user.
	 *
	 * @return list of user tags
	 */
  public static async getUserTags() {
    return TapjoyAPI.getUserTags();
  }

  /**
	 * Removes all tags from the user.
	 */
    public static clearUserTags() {
      TapjoyAPI.clearUserTags();
    }

  /**
	 * Adds the given tag to the user if it is not already present.
	 *
	 * @param tag
	 *        the tag to be added
	 */
  public static addUserTag(tag: string) {
    TapjoyAPI.addUserTag(tag);
  }

  /**
	 * Removes the given tag from the user if it is present.
	 *
	 * @param tag
	 *        the tag to be removed
	 */
  public static removeUserTag(tag: string) {
    TapjoyAPI.removeUserTag(tag);
  }
}
export default Tapjoy;