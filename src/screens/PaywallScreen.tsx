import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ActivityIndicator, Platform, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const SUBSCRIPTION_ID = Platform.select({
  ios: 'com.mydeardiary.monthly',
  android: 'com.mydeardiary.monthly',
});

export default function PaywallScreen() {
  const [product, setProduct] = useState<RNIap.Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigation = useNavigation();
  const { session } = useAuth();

  useEffect(() => {
    // Onemogući swipe gesture i otvaranje drawer-a dok je paywall aktivan
    navigation.getParent()?.setOptions?.({
      swipeEnabled: false,
      drawerLockMode: 'locked-closed',
    });
    return () => {
      navigation.getParent()?.setOptions?.({
        swipeEnabled: true,
        drawerLockMode: 'unlocked',
      });
    };
  }, [navigation]);

  useEffect(() => {
    console.log('Initializing IAP connection...');
    RNIap.initConnection().then(async () => {
      try {
        console.log('Getting subscriptions...');
        const subs = await RNIap.getSubscriptions({ skus: [SUBSCRIPTION_ID!] });
        console.log('Subscriptions received:', subs);
        setProduct(subs[0] || null);
      } catch (e) {
        console.error('Error loading subscription:', e);
        Alert.alert('Error', 'Failed to load subscription info.');
      }
      setLoading(false);
    });

    // Automatska provera pretplate
    const checkSubscription = async () => {
      try {
        const purchases = await RNIap.getAvailablePurchases();
        const hasActiveSub = purchases.some(
          (purchase) => purchase.productId === SUBSCRIPTION_ID
        );
        if (hasActiveSub) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
      }
    };
    checkSubscription();

    return () => { RNIap.endConnection(); };
  }, []);

  const handleSubscribe = async () => {
    console.log('Subscribe button clicked');
    console.log('Product:', product);
    
    if (product) {
      try {
        console.log('Attempting to request subscription...');
        await RNIap.requestSubscription({ sku: product.productId });
        console.log('Subscription request successful');
      } catch (err) {
        console.error('Subscription error:', err);
        Alert.alert('Purchase failed', err instanceof Error ? err.message : String(err));
      }
    } else {
      console.log('No product available');
      Alert.alert('Error', 'Subscription product not available');
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      console.log('Attempting to restore purchases...');
      
      // Prvo proveri da li je korisnik prijavljen
      if (!session?.user) {
        Alert.alert('Error', 'Please sign in to restore purchases.');
        return;
      }

      const purchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', purchases);
      
      const hasActiveSub = purchases.some(
        (purchase) => purchase.productId === SUBSCRIPTION_ID
      );

      if (hasActiveSub) {
        setIsSubscribed(true);
        await AsyncStorage.setItem('isSubscribed', 'true');
        Alert.alert(
          'Success', 
          'Your subscription has been restored. Your subscription will automatically renew each month until you cancel it.'
        );
      } else {
        Alert.alert(
          'No Active Subscription',
          'No active subscription was found. You can start a new subscription with a 7-day free trial.'
        );
      }
    } catch (err) {
      console.error('Restore error:', err);
      Alert.alert(
        'Error',
        'Failed to restore purchases. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (isSubscribed) {
    return null;
  }

  return (
    <View style={styles.background}>
      <Text style={styles.appName}>My Dear Diary</Text>
      <Image source={require('../../assets/paywall/woman.png')} style={styles.illustration} />
      <Text style={styles.title}>This is your space</Text>
      <Text style={styles.subtitle}>Unlock your dear diary today</Text>
      <View style={styles.benefits}>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>✔</Text>
          <Text style={styles.benefit}>Unlimited journaling</Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>✔</Text>
          <Text style={styles.benefit}>Remember your moments</Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>✔</Text>
          <Text style={styles.benefit}>No ads. Total privacy!</Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {(product as any)?.priceString || '$2.99'}
          <Text style={styles.pricePeriod}>/month</Text>
        </Text>
        <Text style={styles.trialText}>
          Try free for 7 days
        </Text>
        <Text style={styles.trialInfo}>
          After the 7-day free trial, you will be automatically charged {(product as any)?.priceString || '$2.99'}/month. 
          Your subscription will automatically renew each month until you cancel it. 
          You can cancel anytime through your App Store settings.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Start Free Trial</Text>
      </TouchableOpacity>
      <Text style={styles.info}>Cancel anytime. No hidden fees.</Text>
      <View style={styles.links}>
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.mydeardiary.com/terms.html')}>Terms of Service</Text>
        <Text style={styles.link}> | </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.mydeardiary.com/privacy.html')}>Privacy Policy</Text>
        <Text style={styles.link}> | </Text>
        <Text style={styles.link} onPress={handleRestore}>Restore Purchases</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    paddingHorizontal: 32,
    backgroundColor: '#eadce3',
    paddingBottom: 32,
  },
  appName: { 
    fontSize: 40,
    fontWeight: 'bold', 
    color: '#2D2B37', 
    textAlign: 'center', 
    marginTop: 64,
    marginBottom: 8
  },
  illustration: { 
    width: 220,
    height: 160, 
    resizeMode: 'contain', 
    marginTop: 0,
    marginBottom: 8
  },
  title: { 
    fontSize: 28,
    fontWeight: 'bold', 
    color: '#2D2B37', 
    textAlign: 'center', 
    marginBottom: 10
  },
  subtitle: { 
    fontSize: 20,
    color: '#2D2B37', 
    textAlign: 'center', 
    marginBottom: 28
  },
  benefits: { 
    marginBottom: 10,
    width: '100%',
    alignItems: 'center'
  },
  benefitRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    alignSelf: 'center' 
  },
  benefitIcon: { 
    color: '#7C4DFF', 
    fontSize: 24, 
    marginRight: 14
  },
  benefit: { 
    fontSize: 18, 
    color: '#2D2B37' 
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  price: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#2D2B37',
    textAlign: 'center',
    marginBottom: 8,
  },
  pricePeriod: {
    fontSize: 24,
    color: '#2D2B37',
    fontWeight: 'normal',
  },
  trialText: {
    fontSize: 18,
    color: '#7C4DFF',
    marginTop: 8,
    marginBottom: 8,
  },
  trialInfo: {
    fontSize: 14,
    color: '#6E6D7A',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF6B4E',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginBottom: 28,
    marginTop: 0,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  info: { 
    fontSize: 15,
    color: '#6E6D7A', 
    marginBottom: 18,
    textAlign: 'center' 
  },
  links: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 8,
    marginBottom: 18
  },
  link: { 
    color: '#7C4DFF', 
    textDecorationLine: 'underline', 
    fontSize: 16
  },
}); 