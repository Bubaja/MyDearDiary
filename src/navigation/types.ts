import { DiaryEntry } from '../types/diary';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  CreateEntry: { entry?: DiaryEntry };
  EditEntry: { entry: DiaryEntry };
  Profile: undefined;
  MainStack: undefined;
  FAQ: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
