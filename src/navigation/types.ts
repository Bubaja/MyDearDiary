import { DiaryEntry } from '../types/diary';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  CreateEntry: { entry?: DiaryEntry };
  EditEntry: { entry: DiaryEntry };
  Profile: undefined;
  MainStack: { screen?: keyof Omit<RootStackParamList, 'MainStack'> };
  FAQ: undefined;
  Legal: { documentType: 'privacy-policy' | 'terms-of-service' };
  Paywall: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Support: undefined;
  RateApp: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
