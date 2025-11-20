import type { ViewProps, HostComponent } from 'react-native';
import type React from 'react';
import type { BubblingEventHandler, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
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
    requestContent: (viewRef: React.ElementRef<HostComponent<TJOfferwallDiscoverViewProps>>, placement: string) => void;
    clearContent: (viewRef: React.ElementRef<HostComponent<TJOfferwallDiscoverViewProps>>) => void;
}
export declare const Commands: NativeCommands;
declare const _default: HostComponent<TJOfferwallDiscoverViewProps>;
export default _default;
