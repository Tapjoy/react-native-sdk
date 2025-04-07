import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  Platform,
  Text,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';
import styles from './Styles';
import Button from './Button';
import Tapjoy, { TJVersion, TapjoyEvent } from 'tapjoy-react-native-sdk';
import { ConnectContext } from './ConnectContext';

const MainScreen: React.FC = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [curerncySpendAwardAmount, setCurrencySpendAwardAmount] = useState<string>('10');
  const [statusLabelText, setStatusLabelText] = useState('Status Message');
  const { isSdkConnected, setIsSdkConnected } = useContext(ConnectContext);

  useEffect(() => {
    retrieveSdkKey().then();
  }, []);

  const retrieveSdkKey = async () => {
    try {
      const value = await AsyncStorage.getItem('sdkKey');
      if (value !== null) {
        setSdkKey(value);
      } else {
        setSdkKey(
          Platform.OS === 'ios'
            ? 'E7CuaoUWRAWdz_5OUmSGsgEBXHdOwPa8de7p4aseeYP01mecluf-GfNgtXlF'
            : 'u6SfEbh_TA-WMiGqgQ3W8QECyiQIURFEeKm0zbOggubusy-o5ZfXp33sTXaD'
        );
      }
    } catch (error) {
      setStatusLabelText(`Failed to retrieve sdk key: ${error}`);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await AsyncStorage.setItem('sdkKey', sdkKey);

      Tapjoy.setDebugEnabled(true);
      // Use the following line to set the user id
      // let flags: object = { TJC_OPTION_USER_ID: userId };
      let flags: object = {};
      let trackingStatus = await getTrackingStatus();
      if (trackingStatus !== 'authorized' && trackingStatus !== 'unavailable') {
        await requestTrackingPermission();
      }

      await Tapjoy.connect(sdkKey, flags, (event: TapjoyEvent) => {
          setStatusLabelText(`Tapjoy SDK connected with Warning: ErrorCode: ${event.code} ${event.message} `);
        },
      );
      setIsConnecting(false);
      setStatusLabelText(
        'Tapjoy SDK Connected' +
          (Object.keys(flags).length > 0
            ? `\nFlags: ${JSON.stringify(flags)}`
            : '')
      );
      setIsSdkConnected(true);
    } catch (error: any) {
      setStatusLabelText(
        `Tapjoy SDK failed to connect. code: ${error.code}, message: ${error.message}`
      );
      setIsConnecting(false);
    }
  };

  const parseAmount = (amount: string): number => {
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount)) {
      throw new Error('Invalid amount');
    }
    return parsedAmount;
  };

  const getCurrencyBalance = async () => {
    try {
      let result = await Tapjoy.getCurrencyBalance();
      setStatusLabelText(
        'getCurrencyBalance returned ' +
          result.currencyName +
          ': ' +
          result.amount
      );
    } catch (error: any) {
      setStatusLabelText(error.toString());
    }
  };

  const spendCurrency = async () => {
    try {
      const amount = parseAmount(curerncySpendAwardAmount);
      let result = await Tapjoy.spendCurrency(amount);
      setStatusLabelText(
        'spendCurrency returned ' + result.currencyName + ': ' + result.amount
      );
    } catch (error: any) {
      setStatusLabelText('spendCurrency error: ' + error.toString());
    }
  };

  const awardCurrency = async () => {
    try {
      const amount = parseAmount(curerncySpendAwardAmount);
      let result = await Tapjoy.awardCurrency(amount);
      setStatusLabelText(
        'awardCurrency returned ' + result.currencyName + ': ' + result.amount
      );
    } catch (error: any) {
      setStatusLabelText('awardCurrency error: ' + error.toString());
    }
  };

  const handleAmountChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setCurrencySpendAwardAmount(numericText);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.lineGap}>
            <Text style={styles.statusText}>{statusLabelText}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={sdkKey}
              onChangeText={setSdkKey}
              placeholder="Enter SDK Key"
            />
            <Button
              title="Connect"
              style={[styles.zeroFlex, styles.leftSpacing]}
              onPress={handleConnect}
              disabled={isConnecting || Tapjoy.isConnected()}
            />
          </View>
          <View style={styles.currencyOuterContainer}>
            <Text style={styles.labelText}>{'Managed Currency:'}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.userPropertiesLabel}>Amount:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='numeric'
                value={curerncySpendAwardAmount}
                onChangeText={handleAmountChange}
                placeholder="Managed Currency value"
              />
            </View>
            <View style={styles.currencyInnerContainer}>
              <Button
                style={styles.buttonGap}
                title="Get"
                onPress={getCurrencyBalance}
              />
              <Button
                style={styles.buttonGap}
                title="Spend"
                onPress={spendCurrency}
              />
              <Button title="Award" onPress={awardCurrency} />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Text style={styles.versionText}>
        Version: {TJVersion.getPluginVersion()}
      </Text>
    </View>
  );
};

export default MainScreen;
