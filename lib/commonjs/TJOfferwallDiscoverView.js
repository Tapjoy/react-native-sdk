import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import React from 'react';
import { isFabricEnabled } from './utils/ArchitectureDetection';
let fabricModule = null;
let legacyComponent = null;
const getFabricModule = () => {
    if (fabricModule == null) {
        fabricModule = require('./TJOfferwallDiscoverViewNativeComponent');
    }
    return fabricModule;
};
const getLegacyComponent = () => {
    if (legacyComponent == null) {
        legacyComponent = requireNativeComponent('TJOfferwallDiscoverNativeView');
    }
    return legacyComponent;
};
const getNativeComponent = () => {
    if (isFabricEnabled()) {
        return getFabricModule().default;
    }
    return getLegacyComponent();
};
export default class TJOfferwallDiscoverView extends React.Component {
    viewRef = React.createRef();
    render() {
        const NativeComponent = getNativeComponent();
        return (<NativeComponent {...this.props} ref={this.viewRef}/>);
    }
    requestContent(placement) {
        if (isFabricEnabled() && this.viewRef.current) {
            getFabricModule().Commands.requestContent(this.viewRef.current, placement);
        }
        else {
            const nodeHandle = findNodeHandle(this.viewRef.current);
            if (nodeHandle != null) {
                UIManager.dispatchViewManagerCommand(nodeHandle, 'requestContent', [placement]);
            }
        }
    }
    clearContent() {
        if (isFabricEnabled() && this.viewRef.current) {
            getFabricModule().Commands.clearContent(this.viewRef.current);
        }
        else {
            const nodeHandle = findNodeHandle(this.viewRef.current);
            if (nodeHandle != null) {
                UIManager.dispatchViewManagerCommand(nodeHandle, 'clearContent', []);
            }
        }
    }
}
