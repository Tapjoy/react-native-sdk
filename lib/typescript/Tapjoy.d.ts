import TJSegment from './TJSegment';
declare class Tapjoy {
    /**
     * Connects to the Tapjoy Server.
     *
     * @param sdkKey Your Tapjoy SDK Key.
     * @param flags Special connect flags.
     * @param onWarning Callback for connection warning.
     *
     * @return true if successful or error message if failed.
     */
    static connect(sdkKey: string, flags: object, onWarning?: (message: TapjoyEvent) => void): Promise<any>;
    /**
     * Helper function to check if SDK is initialized
     *
     * @return true if successful
     */
    static isConnected(): any;
    /**
     * Gets the virtual currency data from the server for this device.
   *
   * @returns a map with "currencyName" and "amount" or error message if failed.
     */
    static getCurrencyBalance(): Promise<any>;
    /**
     * Spends virtual currency. This can only be used for currency managed by
       * Tapjoy.
     *
     * @param amount the amount of currency
     * @return a map with "currencyName" and "amount" or error message if failed.
       */
    static spendCurrency(amount: number): Promise<any>;
    /**
       * Awards virtual currency. This can only be used for currency managed by
       * Tapjoy.
       *
       * @param amount the amount of currency
     * @return a map with "currencyName" and "amount" or error message if failed.
       */
    static awardCurrency(amount: number): Promise<any>;
    /**
       * Tracks a purchase
       *
       * @param currencyCode
       *            the currency code of price as an alphabetic currency code
       *            specified in ISO 4217, i.e. "USD", "KRW"
       * @param price
       *            the price of product
       */
    static trackPurchase(currencyCode: string, price: number): void;
    /**
     * Enables or disables Tapjoy logging
     *
     * @param enable
     *            set to true if logging should be enabled, false to disable
     *            logging
     */
    static setDebugEnabled(enable: Boolean): void;
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
    static setUserId(userID: string): Promise<any>;
    /**
       * Gets the ID of the user.
       *
       * @return the id of the user.
       */
    static getUserId(): Promise<any>;
    /**
       * Sets the level of the user.
       *
       * @param userLevel
       *            the level of the user
       */
    static setUserLevel(userLevel: number): void;
    /**
       * Gets the level of the user.
       *
       * @return the level of the user.
       */
    static getUserLevel(): Promise<any>;
    /**
       * Sets the maximum level of the user.
       *
       * @param maxUserLevel
       *            the maximum level
       */
    static setMaxLevel(maxUserLevel: number): void;
    /**
       * Gets the maximum level of the user.
       *
       * @return the maximum level
       */
    static getMaxLevel(): Promise<any>;
    /**
     * Sets the segment of the user
     *
     * @param segment NON_PAYER (0), PAYER (1), VIP (2)
     *
     */
    static setUserSegment(segment: TJSegment): void;
    /**
       * Gets the segment of the user
       *
       * @return userSegment NON_PAYER (0), PAYER (1), VIP (2)
       *
       */
    static getUserSegment(): Promise<any>;
    /**
       * Sets tags for the user.
       *
       * @param tags
       *        the tags to be set
       */
    static setUserTags(tags: string[]): void;
    /**
       * Returns a String set which contains tags on the user.
       *
       * @return list of user tags
       */
    static getUserTags(): Promise<any>;
    /**
       * Removes all tags from the user.
       */
    static clearUserTags(): void;
    /**
       * Adds the given tag to the user if it is not already present.
       *
       * @param tag
       *        the tag to be added
       */
    static addUserTag(tag: string): void;
    /**
       * Removes the given tag from the user if it is present.
       *
       * @param tag
       *        the tag to be removed
       */
    static removeUserTag(tag: string): void;
}
export default Tapjoy;
