import 'react-native-url-polyfill/auto';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme, navigationTheme } from './src/constants/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import { BiometricProvider } from './src/contexts/BiometricContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AuthProvider onSignOut={() => {}}>
          <BiometricProvider>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar barStyle="dark-content" backgroundColor="transparent" />
              <AppNavigator />
            </NavigationContainer>
          </BiometricProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
} 
