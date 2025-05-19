import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

type ValidationErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const { signUp } = useAuth();

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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Confirm password is required';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const newErrors: ValidationErrors = { ...validationErrors };
    if (field === 'email') {
      newErrors.email = validateEmail(email);
    } else if (field === 'password') {
      newErrors.password = validatePassword(password);
    } else if (field === 'confirmPassword') {
      newErrors.confirmPassword = validateConfirmPassword(confirmPassword);
    }
    setValidationErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };
    setValidationErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await signUp(email, password);
      navigation.navigate('Login');
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 120 }]}>Sign Up</Text>
      <Text style={[styles.subtitle, { marginTop: 80 }]}>Create your account</Text>

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

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={() => handleBlur('confirmPassword')}
        error={touched.confirmPassword && !!validationErrors.confirmPassword}
        style={styles.input}
        secureTextEntry
        placeholder="Confirm Password"
      />
      {touched.confirmPassword && validationErrors.confirmPassword && (
        <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      >
        Sign Up
      </Button>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          Sign In
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
  loginText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
}); 