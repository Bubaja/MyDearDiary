import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

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
  
  const { signIn } = useAuth();
  const signInWithGoogle = async () => { alert('Google sign in not implemented yet.'); };
  const signInWithApple = async () => { alert('Apple sign in not implemented yet.'); };
  const signInWithFacebook = async () => { alert('Facebook sign in not implemented yet.'); };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
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
      setError('Incorrect email or password');
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
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 80 }]}>Sign In</Text>
      <Text style={[styles.subtitle, { marginTop: 24 }]}>Sign in to continue</Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => handleBlur('email')}
        error={touched.email && !!validationErrors.email}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
      />
      {touched.email && validationErrors.email && (
        <Text style={styles.errorText}>{validationErrors.email}</Text>
      )}
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={() => handleBlur('password')}
        error={touched.password && !!validationErrors.password}
        style={styles.input}
        secureTextEntry
        placeholder="Password"
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
        Sign In
      </Button>
      
      <Text style={styles.orText}>or</Text>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('google')}
        style={styles.socialButton}
        icon="google"
      >
        Sign in with Google
      </Button>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('apple')}
        style={styles.socialButton}
        icon="apple"
      >
        Sign in with Apple
      </Button>
      
      <Button
        mode="outlined"
        onPress={() => handleSocialLogin('facebook')}
        style={styles.socialButton}
        icon="facebook"
      >
        Sign in with Facebook
      </Button>
      
      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Sign Up
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