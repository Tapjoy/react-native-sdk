import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import React from 'react';
import type { HostComponent } from 'react-native';
import type { TJOfferwallDiscoverViewProps as FabricProps } from './TJOfferwallDiscoverViewNativeComponent';
import { isFabricEnabled } from './utils/ArchitectureDetection';

type FabricModule = typeof import('./TJOfferwallDiscoverViewNativeComponent');

let fabricModule: FabricModule | null = null;
let legacyComponent: HostComponent<FabricProps> | null = null;

const getFabricModule = (): FabricModule => {
  if (fabricModule == null) {
    fabricModule = require('./TJOfferwallDiscoverViewNativeComponent');
  }
  return fabricModule!;
};

const getLegacyComponent = (): HostComponent<FabricProps> => {
  if (legacyComponent == null) {
    legacyComponent = requireNativeComponent('TJOfferwallDiscoverNativeView');
  }
  return legacyComponent;
};

const getNativeComponent = (): HostComponent<FabricProps> => {
  if (isFabricEnabled()) {
    return getFabricModule().default as HostComponent<FabricProps>;
  }
  return getLegacyComponent();
};

export default class TJOfferwallDiscoverView extends React.Component<FabricProps> {
  private viewRef = React.createRef<React.ComponentRef<ReturnType<typeof getNativeComponent>>>();

  override render() {
    const NativeComponent = getNativeComponent();
    return (
      <NativeComponent
        {...this.props}
        ref={this.viewRef}
      />
    );
  }

  requestContent(placement: string) {
    if (isFabricEnabled() && this.viewRef.current) {
      getFabricModule().Commands.requestContent(this.viewRef.current, placement);
    } else {
      const nodeHandle = findNodeHandle(this.viewRef.current);
      if (nodeHandle != null) {
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          'requestContent',
          [placement]
        );
      }
    }
  }

  clearContent() {
    if (isFabricEnabled() && this.viewRef.current) {
      getFabricModule().Commands.clearContent(this.viewRef.current);
    } else {
      const nodeHandle = findNodeHandle(this.viewRef.current);
      if (nodeHandle != null) {
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          'clearContent',
          []
        );
      }
    }
  }
}
