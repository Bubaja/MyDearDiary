import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface BiometricContextType {
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  isAuthenticated: boolean;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  authenticate: () => Promise<boolean>;
}

const BiometricContext = createContext<BiometricContextType | undefined>(undefined);

export function BiometricProvider({ children }: { children: React.ReactNode }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkBiometricEnabled = async () => {
    const enabled = await AsyncStorage.getItem('biometricEnabled');
    setIsBiometricEnabled(enabled === 'true');
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access My Dear Diary',
        fallbackLabel: 'Use passcode',
      });

      setIsAuthenticated(result.success);
      return result.success;
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
      return false;
    }
  };

  const enableBiometric = async () => {
    try {
      const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (biometricTypes.length === 0) {
        Alert.alert(
          'Not Available',
          'Biometric authentication is not set up on this device. Please set up Face ID or Touch ID in your device settings first.'
        );
        return;
      }

      await AsyncStorage.setItem('biometricEnabled', 'true');
      setIsBiometricEnabled(true);
      Alert.alert('Success', 'Biometric authentication has been enabled.');
    } catch (error) {
      console.error('Enable biometric error:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication.');
    }
  };

  const disableBiometric = async () => {
    try {
      await AsyncStorage.setItem('biometricEnabled', 'false');
      setIsBiometricEnabled(false);
      Alert.alert('Success', 'Biometric authentication has been disabled.');
    } catch (error) {
      console.error('Disable biometric error:', error);
      Alert.alert('Error', 'Failed to disable biometric authentication.');
    }
  };

  return (
    <BiometricContext.Provider
      value={{
        isBiometricSupported,
        isBiometricEnabled,
        isAuthenticated,
        enableBiometric,
        disableBiometric,
        authenticate,
      }}
    >
      {children}
    </BiometricContext.Provider>
  );
}

export function useBiometric() {
  const context = useContext(BiometricContext);
  if (context === undefined) {
    throw new Error('useBiometric must be used within a BiometricProvider');
  }
  return context;
} 