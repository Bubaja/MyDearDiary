import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ActivityIndicator, Platform, Alert, useWindowDimensions } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const SUBSCRIPTION_ID = Platform.select({
  ios: 'com.mydeardiary.monthly',
  android: 'com.mydeardiary.monthly',
});

const PaywallScreen = () => {
  const { width, height } = useWindowDimensions();
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
        const result = await RNIap.requestSubscription({ sku: product.productId });
        console.log('Subscription request result:', result);
        console.log('Subscription request successful');
      } catch (err) {
        console.error('Subscription error:', err);
        if (err instanceof Error) {
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
          });
          Alert.alert('Purchase failed', err.message);
        } else {
          Alert.alert('Purchase failed', String(err));
        }
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

  return (
    <View style={[styles.background, { paddingHorizontal: width * 0.08, paddingBottom: height * 0.04 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: height * 0.06, left: width * 0.04, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={width * 0.08} color="#333" />
      </TouchableOpacity>
      <Text style={[styles.appName, { fontSize: width * 0.09, marginTop: height * 0.08 }]}>My Dear Diary</Text>
      <Image
        source={require('../../assets/paywall/woman.png')}
        style={{
          width: width * 0.55,
          height: height * 0.18,
          resizeMode: 'contain',
          marginBottom: height * 0.01
        }}
      />
      <Text style={[styles.title, { fontSize: width * 0.07 }]}>Unlock Premium</Text>
      <Text style={[styles.subtitle, { fontSize: width * 0.05 }]}>Get unlimited entries, cloud sync, and more!</Text>
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
        <Text style={[styles.price, { fontSize: width * 0.09 }]}>
          $2.99
          <Text style={[styles.pricePeriod, { fontSize: width * 0.06 }]}>/mo</Text>
        </Text>
        <Text style={[styles.trialText, { fontSize: width * 0.045 }]}>7-day free trial</Text>
        <Text style={[styles.trialInfo, { fontSize: width * 0.035, paddingHorizontal: width * 0.04 }]}>Cancel anytime. No hidden fees.</Text>
      </View>

      <TouchableOpacity style={[styles.button, { paddingVertical: height * 0.022, paddingHorizontal: width * 0.12, width: width * 0.9 }]} onPress={handleSubscribe}>
        <Text style={[styles.buttonText, { fontSize: width * 0.055 }]}>Start Free Trial</Text>
      </TouchableOpacity>
      <View style={[styles.links, { flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: width * 0.04 }]}> 
        <Text style={[styles.link, { fontSize: width * 0.035 }]} onPress={() => Linking.openURL('https://www.mydeardiary.com/terms.html')}>Terms of Service</Text>
        <Text style={[styles.link, { fontSize: width * 0.035 }]}> | </Text>
        <Text style={[styles.link, { fontSize: width * 0.035 }]} onPress={() => Linking.openURL('https://www.mydeardiary.com/privacy.html')}>Privacy Policy</Text>
        <Text style={[styles.link, { fontSize: width * 0.035 }]}> | </Text>
        <Text style={[styles.link, { fontSize: width * 0.035 }]} onPress={handleRestore}>Restore Purchases</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    backgroundColor: '#eadce3',
  },
  appName: { 
    fontWeight: 'bold', 
    color: '#2D2B37', 
    textAlign: 'center', 
    marginBottom: 8
  },
  title: { 
    fontWeight: 'bold', 
    color: '#2D2B37', 
    textAlign: 'center', 
    marginBottom: 10
  },
  subtitle: { 
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
    fontWeight: 'bold',
    color: '#2D2B37',
    textAlign: 'center',
    marginBottom: 8,
  },
  pricePeriod: {
    color: '#2D2B37',
    fontWeight: 'normal',
  },
  trialText: {
    color: '#7C4DFF',
    marginTop: 8,
    marginBottom: 8,
  },
  trialInfo: {
    color: '#6E6D7A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF6B4E',
    borderRadius: 32,
    marginBottom: 28,
    marginTop: 0,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default PaywallScreen; 