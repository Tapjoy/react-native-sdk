#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#if __has_include(<React/RCTViewComponentView.h>)
#import <React/RCTViewComponentView.h>
#endif
#if __has_include("TapjoyReactNativeSdkSpec.h")
#import "TapjoyReactNativeSdkSpec.h"
#endif
#endif

@interface RCT_EXTERN_MODULE(TJOfferwallDiscoverNativeViewManager, RCTViewManager)
RCT_EXTERN_METHOD(requestContent: (nonnull NSNumber *)tag placement:(NSString *)placement)
RCT_EXTERN_METHOD(clearContent: (nonnull NSNumber *)tag)
RCT_EXPORT_VIEW_PROPERTY(onRequestSuccess, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRequestFailure, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentError, RCTBubblingEventBlock)
@end
