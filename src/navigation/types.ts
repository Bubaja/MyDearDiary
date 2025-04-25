import { DiaryEntry } from '../types/diary';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  CreateEntry: { entry?: DiaryEntry };
  EditEntry: { entry: DiaryEntry };
  Profile: undefined;
  MainStack: undefined;
  FAQ: undefined;
  Legal: { documentType: 'privacy-policy' | 'terms-of-service' };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
