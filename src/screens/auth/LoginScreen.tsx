import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

type ValidationErrors = {
  email?: string;
  password?: string;
};

export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const { signIn, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email je obavezan';
    }
    if (!emailRegex.test(email)) {
      return 'Unesite validnu email adresu';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Lozinka je obavezna';
    }
    if (password.length < 6) {
      return 'Lozinka mora imati najmanje 6 karaktera';
    }
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const newErrors: ValidationErrors = { ...validationErrors };
    if (field === 'email') {
      newErrors.email = validateEmail(email);
    } else if (field === 'password') {
      newErrors.password = validatePassword(password);
    }
    setValidationErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setValidationErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (error) {
      setError('Pogrešan email ili lozinka');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'apple':
          await signInWithApple();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
      }
    } catch (error) {
      setError('Došlo je do greške prilikom prijave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moj Dnevnik</Text>
      <Text style={styles.subtitle}>Prijavite se da biste nastavili</Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => handleBlur('email')}
        error={touched.email && !!validationErrors.email}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {touched.email && validationErrors.email && (
        <Text style={styles.errorText}>{validationErrors.email}</Text>
      )}
      
      <TextInput
        label="Lozinka"
        value={password}
        onChangeText={setPassword}
        onBlur={() => handleBlur('password')}
        error={touched.password && !!validationErrors.password}
        style={styles.input}
        secureTextEntry
      />
      {touched.password && validationErrors.password && (
        <Text style={styles.errorText}>{validationErrors.password}</Text>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Prijavi se
      </Button>
      
      <Text style={styles.orText}>ili</Text>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('google')}
        style={styles.socialButton}
        icon="google"
      >
        Prijavi se sa Google-om
      </Button>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('apple')}
        style={styles.socialButton}
        icon="apple"
      >
        Prijavi se sa Apple-om
      </Button>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('facebook')}
        style={styles.socialButton}
        icon="facebook"
      >
        Prijavi se sa Facebook-om
      </Button>
      
      <Divider style={styles.divider} />
      
      <Text style={styles.registerText}>
        Nemate nalog?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Registrujte se
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  socialButton: {
    marginTop: 8,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  divider: {
    marginVertical: 24,
  },
  registerText: {
    textAlign: 'center',
    color: '#666',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
}); 