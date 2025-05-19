import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BiometricProvider } from './src/contexts/BiometricContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import SubscriptionGate from './src/components/SubscriptionGate';

function Navigation() {
  const { session } = useAuth();
  
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NetworkProvider>
          <AuthProvider>
            <BiometricProvider>
              <Navigation />
            </BiometricProvider>
          </AuthProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
