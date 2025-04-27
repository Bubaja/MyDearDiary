import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useBiometric } from '../contexts/BiometricContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { authenticate, isBiometricEnabled } = useBiometric();

  useEffect(() => {
    if (!isBiometricEnabled) {
      navigation.navigate('Home');
    }
  }, [isBiometricEnabled]);

  const handleAuthentication = async () => {
    const success = await authenticate();
    if (success) {
      navigation.navigate('Home');
    }
  };

  if (!isBiometricEnabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Please authenticate to access your diary
        </Text>
        <Button
          mode="contained"
          onPress={handleAuthentication}
          style={styles.button}
        >
          Authenticate
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
});

export default AuthScreen; 