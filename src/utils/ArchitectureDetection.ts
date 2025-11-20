import NativeTapjoyReactNativeSdk from '../NativeTapjoyReactNativeSdk';

declare global {
  var nativeFabricUIManager: any | undefined;
}

export const isTurboModuleEnabled = (): boolean => {
  return NativeTapjoyReactNativeSdk != null;
};

export const isFabricEnabled = (): boolean => {
  return global.nativeFabricUIManager != null;
};

