import NativeTapjoyReactNativeSdk from '../NativeTapjoyReactNativeSdk';
export const isTurboModuleEnabled = () => {
    return NativeTapjoyReactNativeSdk != null;
};
export const isFabricEnabled = () => {
    return global.nativeFabricUIManager != null;
};
