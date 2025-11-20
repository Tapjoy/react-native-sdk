import type { ViewProps, HostComponent } from 'react-native';
import type React from 'react';
import type { BubblingEventHandler, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export interface OfferwallDiscoverEventData {
  result?: string;
  errorCode?: Int32;
  errorMessage?: string;
}

export interface TJOfferwallDiscoverViewProps extends ViewProps {
  onRequestSuccess?: BubblingEventHandler<OfferwallDiscoverEventData>;
  onRequestFailure?: BubblingEventHandler<OfferwallDiscoverEventData>;
  onContentReady?: BubblingEventHandler<OfferwallDiscoverEventData>;
  onContentError?: BubblingEventHandler<OfferwallDiscoverEventData>;
}

export interface NativeCommands {
  requestContent: (
    viewRef: React.ElementRef<HostComponent<TJOfferwallDiscoverViewProps>>,
    placement: string
  ) => void;
  clearContent: (
    viewRef: React.ElementRef<HostComponent<TJOfferwallDiscoverViewProps>>
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['requestContent', 'clearContent'],
});

export default codegenNativeComponent<TJOfferwallDiscoverViewProps>(
  'TJOfferwallDiscoverNativeView'
) as HostComponent<TJOfferwallDiscoverViewProps>;

