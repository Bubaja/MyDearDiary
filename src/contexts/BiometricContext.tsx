import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

interface BiometricContextType {
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  authenticateWithBiometric: () => Promise<boolean>;
  enableBiometric: () => void;
  disableBiometric: () => void;
}

const BiometricContext = createContext<BiometricContextType | undefined>(undefined);

export const BiometricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      setIsBiometricSupported(compatible && types.length > 0 && isEnrolled);
      console.log('Biometric support:', { compatible, types, isEnrolled });
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsBiometricSupported(false);
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      if (!isBiometricSupported || !isBiometricEnabled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometric = () => {
    if (isBiometricSupported) {
      setIsBiometricEnabled(true);
    }
  };

  const disableBiometric = () => {
    setIsBiometricEnabled(false);
  };

  return (
    <BiometricContext.Provider
      value={{
        isBiometricSupported,
        isBiometricEnabled,
        authenticateWithBiometric,
        enableBiometric,
        disableBiometric,
      }}
    >
      {children}
    </BiometricContext.Provider>
  );
};

export const useBiometric = () => {
  const context = useContext(BiometricContext);
  if (context === undefined) {
    throw new Error('useBiometric must be used within a BiometricProvider');
  }
  return context;
}; 