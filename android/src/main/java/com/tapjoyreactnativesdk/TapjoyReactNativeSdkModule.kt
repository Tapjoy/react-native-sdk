package com.tapjoyreactnativesdk

import com.facebook.react.bridge.*
import com.tapjoy.TJConnectListener
import com.tapjoy.TJGetCurrencyBalanceListener
import com.tapjoy.TJSpendCurrencyListener
import com.tapjoy.TJAwardCurrencyListener
import com.tapjoy.TJSetUserIDListener
import com.tapjoy.Tapjoy
import com.tapjoy.TJError
import com.tapjoy.TJPlacement
import com.tapjoy.TJActionRequest
import com.tapjoy.TJPlacementListener
import com.tapjoy.TJSetCurrencyBalanceListener
import com.tapjoy.TJSetCurrencyAmountRequiredListener
import com.tapjoy.TJStatus
import com.tapjoy.TJPrivacyPolicy
import com.tapjoy.TJSegment
import com.tapjoy.TapjoyPluginAPI
import com.tapjoy.TJEntryPoint
import com.tapjoy.TJLogLevel
import java.util.Hashtable
import kotlin.collections.HashMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.Exception

class TapjoyReactNativeSdkModule(reactContext: ReactApplicationContext) :
  NativeTapjoyReactNativeSdkSpec(reactContext) {

  val messageConnectionFailed = "connection failed"
  var placements = HashMap<String, TJPlacement>()

  companion object {
    const val NAME = "TapjoyReactNativeSdk"
  }

  override fun getName(): String {
    return NAME
  }

  override fun getConstants(): MutableMap<String, Any> {
    return HashMap()
  }

  private var listenerCount = 0

  private fun sendEvent(eventName: String, params: WritableMap?) {
    if (listenerCount > 0) {
        reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }
  }

  @ReactMethod
  override fun addListener(eventName: String) {
    listenerCount += 1
  }

  @ReactMethod
  override fun removeListeners(count: Double) {
    listenerCount -= count.toInt()
  }

  /**
   * Connect to Tapjoy.This class has no useful logic; it's just a documentation example.
   *
   * @Param sdkKey:   SDK key the app.
   * @Param connectFlags: Dictionary for the connection flag values.@param T the type of a member in this group.
   * @return true to javascript if it is succeeded otherwise throws error
   */
  @ReactMethod
  override fun connect(sdkKey: String, connectFlags: ReadableMap, promise: Promise) {
    TapjoyPluginAPI.setPlugin("ReactNative");

    Tapjoy.connect(this.getCurrentActivity()?.applicationContext, sdkKey, connectFlags.toHashtable(), object : TJConnectListener() {
      override fun onConnectSuccess() {
        promise.resolve(true)
      }

      override fun onConnectFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
      
      override fun onConnectWarning(code: Int, message: String) {
        val parameters = Arguments.createMap().apply {
          putString("name", "onConnectWarning")
          putString("code", code.toString())
          putString("message", message)
        }
        sendEvent("Tapjoy", parameters)
      }
    })
  }

  @ReactMethod
  override fun getCurrencyBalance(promise: Promise) {
    Tapjoy.getCurrencyBalance(object : TJGetCurrencyBalanceListener {

      override fun onGetCurrencyBalanceResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onGetCurrencyBalanceResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  @ReactMethod
  override fun spendCurrency(amount: Double, promise: Promise) {
    Tapjoy.spendCurrency(amount.toInt(), object : TJSpendCurrencyListener {

      override fun onSpendCurrencyResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onSpendCurrencyResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  @ReactMethod
  override fun awardCurrency(amount: Double, promise: Promise) {
    Tapjoy.awardCurrency(amount.toInt(), object : TJAwardCurrencyListener {

      override fun onAwardCurrencyResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onAwardCurrencyResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  /**
   * Sets user ID
   *
   * @param userId: User ID
   */
  @ReactMethod
  override fun setUserId(userId: String?, promise: Promise) {
    Tapjoy.setUserID(userId, object: TJSetUserIDListener {
      override fun onSetUserIDSuccess() {
        promise.resolve(userId)
      }

      override fun onSetUserIDFailure(error: String?) {
        promise.reject("Set User ID Error", Exception(error))
      }
    })
  }

  /**
   * Gets user ID
   *
   * @return User ID
   */
  @ReactMethod
  override fun getUserId(promise: Promise) {
    promise.resolve(Tapjoy.getUserID())
  }

  /**
   * Sets the segment of the user
   *
   * @Param userSegment: NON_PAYER (0), PAYER (1), VIP (2)
   *
   */
  @ReactMethod
  override fun setUserSegment(userSegment: Double) {
    val segmentIndex = userSegment.toInt()
    if (segmentIndex == -1){
      Tapjoy.setUserSegment(TJSegment.UNKNOWN)
    } else {
      Tapjoy.setUserSegment(TJSegment.values()[segmentIndex])
    }
  }

  /**
   * Assign a custom parameter associated with any following placement requests that contains an ad type. We will return this value on the currency callback.
   * Only applicable for publishers who manage their own currency servers. This value does NOT get unset with each subsequent placement request.
   * @param customParameter
   * 		      The custom parameter to assign to this device
   */
  @ReactMethod
  override fun setCustomParameter(customParameter: String) {
    Tapjoy.setCustomParameter(customParameter)
  }

  /**
   * Returns the currently set custom parameter.
   * @return the value of the currently set custom parameter.
   */
  @ReactMethod
  override fun getCustomParameter(promise: Promise) {
    promise.resolve(Tapjoy.getCustomParameter())
  }
  /**
   * Sets the segment of the user
   *
   * @return userSegment NON_PAYER (0), PAYER (1), VIP (2)
   *
   */
  @ReactMethod
  override fun getUserSegment(promise: Promise) {
    val segment = Tapjoy.getUserSegment()
    promise.resolve(segment?.getValue() ?: TJSegment.UNKNOWN.getValue())
  }

  /** 
   * Sets the maximum level of the user.
   *
   * @Param maxLevel: the maximum level
   */
  @ReactMethod
  override fun setMaxLevel(maxLevel: Double) {
    Tapjoy.setMaxLevel(maxLevel.toInt());
  }

  /** 
   * Gets the maximum level of the user.
   *
   * @return the maximum level
   */
  @ReactMethod
  override fun getMaxLevel(promise: Promise) {
    promise.resolve(Tapjoy.getMaxLevel())
  }

  /**
   * Sets the level of the user.
   * 
   * @param userLevel
   *            the level of the user
   */
  @ReactMethod
  override fun setUserLevel(userLevel: Double) {
    Tapjoy.setUserLevel(userLevel.toInt())
  }

  /**
   * Gets the level of the user.
   *
   * @return the level of the user.
   */
  @ReactMethod
  override fun getUserLevel(promise: Promise) {
    promise.resolve(Tapjoy.getUserLevel())
  }

  /**
   * Returns a String set which contains tags on the user.
   *
   * @return list of user tags
   */
  @ReactMethod
  override fun getUserTags(promise: Promise) {
    val tags = Tapjoy.getUserTags()
    val tagsArray: WritableArray = Arguments.createArray()

      tags.forEach { tag ->
          tagsArray.pushString(tag.toString())
      }
    promise.resolve(tagsArray)
  }

  /**
   * Sets tags for the user.
   *
   * @param tags
   *        the tags to be set
   */
  @ReactMethod
  override fun setUserTags(tags: ReadableArray)  {
     val tagsSet: Set<String> = (0 until tags.size())
        .mapNotNull { tags.getString(it) }
        .toSet()
    Tapjoy.setUserTags(tagsSet)
  }

  /**
   * Removes all tags from the user.
   */
  @ReactMethod
  override fun clearUserTags() {
    Tapjoy.clearUserTags()
  }

  /**
   * Adds the given tag to the user if it is not already present.
   *
   * @param tag
   *        the tag to be added
   */
  @ReactMethod
  override fun addUserTag(tag: String) {
    Tapjoy.addUserTag(tag)
  }

  /**
   * Removes the given tag from the user if it is present.
   *
   * @param tag
   *        the tag to be removed
   */
  @ReactMethod
  override fun removeUserTag(tag: String) {
    Tapjoy.removeUserTag(tag)
  }

  @ReactMethod
  override fun setLoggingLevel(level: Double) {
    when (level.toInt()) {
      0 -> Tapjoy.setLoggingLevel(TJLogLevel.ERROR)
      1 -> Tapjoy.setLoggingLevel(TJLogLevel.WARNING)
      2 -> Tapjoy.setLoggingLevel(TJLogLevel.INFO)
      3 -> Tapjoy.setLoggingLevel(TJLogLevel.DEBUG)
    }
  }

  @ReactMethod
  override fun getLoggingLevel(promise: Promise) {
    when (Tapjoy.getLoggingLevel()) {
      TJLogLevel.ERROR -> promise.resolve(0)
      TJLogLevel.WARNING -> promise.resolve(1)
      TJLogLevel.INFO -> promise.resolve(2)
      TJLogLevel.DEBUG -> promise.resolve(3)
    }
  }

  @ReactMethod
  fun setDebugEnabled(enabled: Boolean) {
    Tapjoy.setDebugEnabled(enabled)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  override fun isConnected(): Boolean {
    return Tapjoy.isConnected()
  }

  /**
   * Creates a new placement with the specified name.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  override fun createPlacement(placementName: String) {
    val listener = object : TJPlacementListener {
      override fun onRequestSuccess(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "requestDidSucceed")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onRequestFailure(placement: TJPlacement, error: TJError) {
        val parameters = Arguments.createMap().apply {
          putString("name", "requestDidFail")
          putString("placement", placement.name)
          putString("error", error.message)
        }
        sendEvent("TapjoyPlacement", parameters)
        placements.remove(placement.name)
      }

      override fun onContentReady(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentIsReady")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onContentShow(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentDidAppear")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onContentDismiss(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentDidDisappear")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
        placements.remove(placement.name)
      }

      override fun onClick(placement: TJPlacement) {

      }
    }
    val placement = Tapjoy.getPlacement(placementName, listener)
    placements[placementName] = placement
  }

  /**
   * Request content for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  override fun requestPlacement(placementName: String) {
    val placement = placements[placementName]
    placement?.requestContent()
  }

  /**
   * Show content for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  override fun showPlacement(placementName: String) {
    placements[placementName]?.showContent()
  }

  /**
   * Check if content has been downloaded and ready to show for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   *
   * @return true if content has been cached and ready to show.
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  override fun isContentReady(placementName: String): Boolean {
    return placements[placementName]?.isContentReady ?: false
  }

  /**
   * Check if content is available to cache or stream for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   *
   * @return true if content is available to cache or stream.
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  override fun isContentAvailable(placementName: String): Boolean {
    return placements[placementName]?.isContentAvailable ?: false
  }

  /**
   * Sets the currency balance for a specific placement and currency.
   *
   * @param {Int} currencyAmount - The amount of the currency to set.
   * @param {String} currencyId - The identifier of the currency.
   * @param {String} placementName - The name of the placement.
   * @param {Promise} promise - The promise to fulfill after setting the balance.
   */
  @ReactMethod
  override fun setCurrencyBalance(currencyAmount: Double, currencyId: String, placementName: String, promise: Promise) {
    placements[placementName]?.setCurrencyBalance(currencyId, currencyAmount.toInt(), object : TJSetCurrencyBalanceListener {
      override fun onSetCurrencyBalanceSuccess() {
        promise.resolve(true)
      }

      override fun onSetCurrencyBalanceFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
    })
  }

  /**
   * Gets the currency balance for a specific placement and currency.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @param {String} placementName - The name of the placement.
   * @return {Promise} amount - The promise to fulfill after getting the balance.
   */
  @ReactMethod
  override fun getPlacementCurrencyBalance(currencyId: String, placementName: String, promise: Promise) {
    promise.resolve(placements[placementName]?.getCurrencyBalance(currencyId))
  }

  /**
   * Sets the currency amount required
   *
   * @param currencyAmount The amount of the currency the use needs. Must be greater than 0.
   * @param currencyId The identifier of the currency.
   * @param placementName The name of the placement.
   * @return The promise to fulfill after getting the balance.
   */
  @ReactMethod
  override fun setRequiredAmount(currencyAmount: Double, currencyId: String, placementName: String,  promise: Promise) {
    val placement = placements[placementName]
    if (placement == null) {
      promise.reject("Placement not found", "Placement does not exist.", Exception("Placement not found"))
      return
    }
    placement.setCurrencyAmountRequired(currencyId, currencyAmount.toInt(), object : TJSetCurrencyAmountRequiredListener {
      override fun onSetCurrencyAmountRequiredSuccess() {
        promise.resolve(true)
      }

      override fun onSetCurrencyAmountRequiredFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
    })
  }

  /**
   * Gets the currency amount required
   *
   * @param currencyId The identifier of the currency.
   * @return The amount of the required currency, -1 if not available.
   */
  @ReactMethod
  override fun getRequiredAmount(currencyId: String, placementName: String,  promise: Promise) {
    val placement = placements[placementName]
    if (placement == null) {
      promise.resolve(-1)
      return
    }
    promise.resolve(placements[placementName]?.getCurrencyAmountRequired(currencyId))
  }

  /**
   * Sets the entry point for given placement name.
   *
   * @param {Int} entryPoint The entry point ordinal to set.
   * @see TJEntryPoint
   */
  @ReactMethod
  override fun setEntryPoint(placementName: String, entryPoint: Double) {
    placements[placementName]?.setEntryPoint(TJEntryPoint.fromOrdinal(entryPoint.toInt()))
  }

  /**
   * Gets the entry point for given placement name.
   *
   * @return {Int} entryPoint The entry point ordinal to set.
   * @see TJEntryPoint
   */
  @ReactMethod
  override fun getEntryPoint(placementName: String, promise: Promise) {
    promise.resolve(placements[placementName]?.getEntryPoint()?.ordinal)
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
  @ReactMethod
  override fun trackPurchase(currencyCode: String, price: Double) {
    Tapjoy.trackPurchase(currencyCode, price)
  }

   /**
   * Indicate if the user falls in any of the GDPR applicable countries
   *
   * @param gdprApplicable true (1) if GDPR applies to this user, false (0) otherwise
   */
  @ReactMethod
  override fun setSubjectToGDPRStatus(gdprApplicableStatus: Double) {
    val status = TJStatus.values()[gdprApplicableStatus.toInt()]
    Tapjoy.getPrivacyPolicy().setSubjectToGDPR(status)
  }

  /**
   * Returns the consent age (COPPA) flag applied to the user.
   *
   * @return TJStatus.TRUE (1) if below consent age (COPPA) applies to this user, TJStatus.FALSE (0) otherwise
   */
  @ReactMethod
  override fun getBelowConsentAge(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get Below Consent Age Error", Exception("error"))
        return
    }
    val belowConsentAge = getPrivacyPolicy.getBelowConsentAge()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(belowConsentAge)
  }

  /**
   * Returns configured GDPR value.
   * The value should be returned to TRUE when User (Subject) is applicable to GDPR regulations
   * and FALSE when User is not applicable to GDPR regulations.
   *
   * @return TJStatus.TRUE (1) if GDPR applies to this user, TJStatus.FALSE (0) otherwise
   */
  @ReactMethod
  override fun getSubjectToGDPR(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get Subject To GDPR Error", Exception("error"))
        return
    }
    val isSubjectToGDPR = getPrivacyPolicy.getSubjectToGDPR()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(isSubjectToGDPR)
  }

  /**
   * Returns user's consent to behavioral advertising such as in the context of GDPR
   * The consent value can be TJStatus.FALSE (0) (User has not provided consent), TJStatus.TRUE(1) (User has provided consent).
   *
   * @return The user consent value
   */
  @ReactMethod
  override fun getUserConsent(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get User Consent Error", Exception("error"))
        return
    }
    val userConsent = getPrivacyPolicy.getUserConsent()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(userConsent)
  }

  /**
   * Returns US Privacy value to behavioral advertising such as in the context of CCPA
   *
   * @return The us privacy value string
   */
  @ReactMethod
  override fun getUSPrivacy(promise: Promise) {
    val privacyPolicy = Tapjoy.getPrivacyPolicy()
    if (privacyPolicy != null) {
      promise.resolve(privacyPolicy.getUSPrivacy() ?: "")
    } else {
      promise.reject("Get US Privacy Error", Exception("error"))
    }
  }

  /**
   * This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
   *
   * @param isBelowConsentAge true (1) if below consent age (COPPA) applies to this user, false (0) otherwise
   */
  @ReactMethod
  override fun setBelowConsentAgeStatus(isBelowConsentAgeStatus: Double) {
    val status = TJStatus.values()[isBelowConsentAgeStatus.toInt()]
    Tapjoy.getPrivacyPolicy().setBelowConsentAge(status)
  }
  /**
   * This is used for sending US Privacy value to behavioral advertising such as in the context of GDPR
   *
   * @param privacyValue The privacy value string eg. "1YNN" where 1 is char in string for the version, Y = YES, N = No, - = Not Applicable
   */
  @ReactMethod
  override fun setUSPrivacy(isUsPrivacy: String){
    Tapjoy.getPrivacyPolicy().setUSPrivacy(isUsPrivacy)
  }

   /**
   * This is used for sending User's consent to behavioral advertising such as in the context of GDPR
   *
   * @param userConsent The value can be "0" (User has not provided consent), "1" (User has provided consent) or a daisybit string as suggested in IAB's Transparency and Consent Framework
   */
  @ReactMethod
  override fun setUserConsentStatus(userConsentStatus: Double) {
    val status = TJStatus.values()[userConsentStatus.toInt()]
    Tapjoy.getPrivacyPolicy().setUserConsent(status)
  }
  /**
    * <strong>WARNING: EXPERIMENTAL API - DO NOT USE IT</strong>
    * <p>
    * This method is experimental and intended for internal purposes only.
    * <p>
    * Returns the user's consent status for accessing Android's Usage Stats API.
    *
    * @return TJStatus.TRUE if the user agrees, TJStatus.FALSE otherwise
    */
  @ReactMethod
  override fun getUsageStatsConsent(promise: Promise) {
    val privacyPolicy = Tapjoy.getPrivacyPolicy()
    if (privacyPolicy != null) {
      promise.resolve(privacyPolicy.getUsageStatsConsent()?.getValue() ?: TJStatus.UNKNOWN.getValue())
    } else {
      promise.reject("Get Usage Stats Consent Error", Exception("error"))
    }
  }

  /**
    * <strong>WARNING: EXPERIMENTAL API - DO NOT USE IT</strong>
    * <p>
    * This method is experimental and intended for internal purposes only.
    * <p>
    * Sets the user's consent status for accessing Android's Usage Stats API.
    * The Android Usage Stats API (UsageStatsManager) allows apps to access
    * data about app usage on the device.
    *
    * @param usageStatsConsent TJStatus.TRUE if the user has granted permission
    * to access their usage statistics, TJStatus.FALSE
    * if they have denied or not yet granted permission.
    */
  @ReactMethod
  override fun setUsageStatsConsent(usageStatsConsent: Double) {
    val status = TJStatus.values()[usageStatsConsent.toInt()]
    Tapjoy.getPrivacyPolicy().setUsageStatsConsent(status)
  }

  @ReactMethod
  override fun optOutAdvertisingID(optOut: Boolean) {
    Tapjoy.optOutAdvertisingID(this.getCurrentActivity()?.applicationContext, optOut)
  }

  @ReactMethod
  override fun getOptOutAdvertisingID(promise: Promise) {
    val optOutStatus = Tapjoy.getOptOutAdvertisingID(this.getCurrentActivity()?.applicationContext)
    if (optOutStatus != null) {
      promise.resolve(optOutStatus)
    } else {
      promise.reject("Get Opt Out ID Error", Exception("error"))
    }
  }

  private fun ReadableMap.toHashtable(): Hashtable<String, Any> {
    val hashtable = Hashtable<String, Any>()
    val iterator = this.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      when (this.getType(key)) {
        ReadableType.String -> {
          this.getString(key)?.let { hashtable[key] = it }
        }
        ReadableType.Number -> {
          val numberValue = this.getDouble(key)
          val asInt = numberValue.toInt()
          hashtable[key] = if (numberValue == asInt.toDouble()) asInt else numberValue
        }
        ReadableType.Boolean -> {
          hashtable[key] = this.getBoolean(key)
        }
        ReadableType.Null, ReadableType.Map, ReadableType.Array -> {
        }
      }
    }
    return hashtable
  }
}
