declare module 'react-native-paper' {
  import * as React from 'react';
  import { TextInputProps as RNTextInputProps } from 'react-native';

  export interface TextInputProps extends RNTextInputProps {
    mode?: 'flat' | 'outlined';
    label?: string;
    error?: boolean;
    disabled?: boolean;
    placeholder?: string;
    value: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: any;
  }

  export const TextInput: React.ComponentType<TextInputProps>;
  export const Button: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Provider: React.ComponentType<any>;
} 