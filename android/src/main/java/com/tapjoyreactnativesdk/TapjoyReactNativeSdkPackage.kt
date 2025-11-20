package com.tapjoyreactnativesdk

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class TapjoyReactNativeSdkPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == TapjoyReactNativeSdkModule.NAME) {
      TapjoyReactNativeSdkModule(reactContext) as NativeModule
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      moduleInfos[TapjoyReactNativeSdkModule.NAME] = ReactModuleInfo(
        TapjoyReactNativeSdkModule.NAME,
        TapjoyReactNativeSdkModule.NAME,
        false,
        false,
        true,
        false,
        isTurboModule
      )
      moduleInfos
    }
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = 
    listOf(TJOfferwallDiscoverNativeViewManager(reactContext))
}
