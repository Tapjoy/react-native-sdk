package com.tapjoyreactnativesdk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = TJOfferwallDiscoverNativeViewManager.REACT_CLASS)
class TJOfferwallDiscoverNativeViewManager(
        private val callerContext: ReactApplicationContext
) : SimpleViewManager<TJOfferwallDiscoverNativeView>() {

    override fun getName() = REACT_CLASS

    companion object {
        const val REACT_CLASS = "TJOfferwallDiscoverNativeView"
    }

    override fun createViewInstance(context: ThemedReactContext): TJOfferwallDiscoverNativeView {
        return TJOfferwallDiscoverNativeView(context)
    }

    override fun receiveCommand(view: TJOfferwallDiscoverNativeView, commandId: String, args: ReadableArray?) {
        super.receiveCommand(view, commandId, args)
        when (commandId) {
            "requestContent" -> {
                args?.getString(0)?.let { placement ->
                    view.requestContent(placement)
                }
            }
            "clearContent" -> {
                view.clearContent()
            }
        }
    }

    override fun getCommandsMap(): Map<String, Int>? {
        return MapBuilder.of(
            "requestContent", 1,
            "clearContent", 2
        )
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.of(
            "onRequestSuccess", MapBuilder.of("registrationName", "onRequestSuccess"),
            "onRequestFailure", MapBuilder.of("registrationName", "onRequestFailure"),
            "onContentReady", MapBuilder.of("registrationName", "onContentReady"),
            "onContentError", MapBuilder.of("registrationName", "onContentError")
        )
    }
}