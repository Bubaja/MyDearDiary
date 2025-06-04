import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CreateEntry from '../screens/CreateEntry';
import EditEntry from '../screens/EditEntry';
import ProfileScreen from '../screens/ProfileEditScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { RootStackParamList } from './types';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth, SubscriptionEventEmitter } from '../contexts/AuthContext';
import FAQScreen from '../screens/FAQ';
import LegalScreen from '../screens/LegalScreen';
import PaywallScreen from '../screens/PaywallScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

type NavigationType = NavigationProp<RootStackParamList>;

// Wrapper komponenta koja proverava postojanje unosa pre renderovanja CreateEntry
const CreateEntryWrapper = () => {
  const navigation = useNavigation<NavigationType>();
  const { session } = useAuth();

  useEffect(() => {
    const checkTodayEntry = async () => {
      try {
        if (!session?.user) return;

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('created_at', startOfDay)
          .lt('created_at', endOfDay)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }

        if (data) {
          // Ako postoji današnji unos, preusmeravamo na njegovu izmenu
          navigation.navigate('EditEntry', { entry: data });
        }
      } catch (error) {
        console.error('Error checking today entry:', error);
      }
    };

    checkTodayEntry();
  }, [navigation, session]);

  // Renderujemo CreateEntry samo ako nema postojećeg unosa
  return <CreateEntry />;
};

const MainStack = () => {
  const navigation = useNavigation<NavigationType>();
  const { session, isSubscribed, subscriptionLoading } = useAuth();

  useEffect(() => {
    // Ako je korisnik prijavljen, ali nije pretplaćen, vodi ga na Paywall
    if (session?.user && isSubscribed === false && !subscriptionLoading) {
      navigation.navigate('MainStack', { screen: 'Paywall' });
    }
  }, [session, isSubscribed, subscriptionLoading, navigation]);

  useEffect(() => {
    // Slušaj globalni event za aktivnu pretplatu
    const handler = () => {
      navigation.navigate('Home');
    };
    SubscriptionEventEmitter.on('subscriptionActive', handler);
    return () => {
      SubscriptionEventEmitter.off('subscriptionActive', handler);
    };
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateEntry" component={CreateEntryWrapper} />
      <Stack.Screen name="EditEntry" component={EditEntry} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen 
        name="Paywall" 
        component={PaywallScreen} 
        options={{ gestureEnabled: false }} 
      />
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Register" component={SignUp} />
      <Stack.Screen name="ResetPassword" component={require('../screens/ResetPasswordScreen').default} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
