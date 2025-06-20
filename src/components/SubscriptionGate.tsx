import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export default function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { isSubscribed, subscriptionLoading, checkSubscriptionStatus } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    checkSubscriptionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (subscriptionLoading || isSubscribed === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
} 