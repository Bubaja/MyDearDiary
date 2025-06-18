import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { purchaseUpdatedListener, Purchase } from 'react-native-iap';
import { EventEmitter } from 'events';

type AuthContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  loading: boolean;
  navigateToSignIn?: () => void;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>;
  isSubscribed: boolean | null;
  subscriptionLoading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  deleteAccount: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  onSignOut?: () => void;
};

// Globalni event emitter za navigaciju
export const SubscriptionEventEmitter = new EventEmitter();

export function AuthProvider({ children, onSignOut }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user);
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user);
      setSession(session);
      
      // Call onSignOut callback when session changes to null
      if (!session && onSignOut) {
        onSignOut();
      }
    });

    // Globalni purchase listener
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
      try {
        // Opciono: validacija purchase.token ili receipt
        await checkSubscriptionStatus();
        // Ako je korisnik pretplaćen, emituje event za navigaciju
        if (isSubscribed !== true) {
          // Pozivamo proveru statusa, a navigaciju radimo nakon što se status ažurira
          setTimeout(async () => {
            const cached = await AsyncStorage.getItem('isSubscribed');
            if (cached === 'true') {
              SubscriptionEventEmitter.emit('subscriptionActive');
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Error in purchaseUpdatedListener:', err);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
    };
  }, [onSignOut]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      console.log('Sign in successful:', data.user);
      setSession(data.session);
      await checkSubscriptionStatus();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (currentSession) {
        console.log('Session refreshed:', currentSession.user);
        setSession(currentSession);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, []);

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'my-dear-diary://reset-password',
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      console.log('Sign up successful:', data.user);
      setSession(data.session);
      await checkSubscriptionStatus();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const checkSubscriptionStatus = async () => {
    setSubscriptionLoading(true);
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      if (!session?.user?.id) {
        setIsSubscribed(false);
        return;
      }

      // Prvo proveri status u Supabase
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', session.user.id)
        .single();

      if (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
      }

      // Proveri App Store/Play Store status
      const SUBSCRIPTION_ID = Platform.select({
        ios: 'com.mydeardiary.monthly',
        android: 'com.mydeardiary.monthly',
      });
      
      const timeoutPromise = new Promise((_, reject) =>
        timeoutId = setTimeout(() => reject(new Error('Timeout')), 7000)
      );
      
      const purchasesPromise = RNIap.getAvailablePurchases();
      const purchases = await Promise.race([purchasesPromise, timeoutPromise]);
      
      const hasActiveSub = (purchases as any[]).some(
        (purchase) => purchase.productId === SUBSCRIPTION_ID
      );

      // Ažuriraj status u Supabase ako je potrebno
      if (hasActiveSub && (!subscriptionData || subscriptionData.status !== 'active')) {
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.user.id,
            status: 'active',
            start_date: new Date().toISOString(),
          });
      } else if (!hasActiveSub && subscriptionData?.status === 'active') {
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.user.id,
            status: 'inactive',
            end_date: new Date().toISOString(),
          });
      }

      const isOnTrial = subscriptionData?.status === "trial";
      const isActiveSubscription = subscriptionData?.status === "active";
      
      // Korisnik je pretplaćen ako ima aktivnu pretplatu ILI je na trial periodu
      const isSubscribed = hasActiveSub || isOnTrial || isActiveSubscription;
      
      setIsSubscribed(isSubscribed);
      await AsyncStorage.setItem('isSubscribed', hasActiveSub ? 'true' : 'false');
    } catch (err) {
      console.error('Error in checkSubscriptionStatus:', err);
      // Ako dođe do greške, koristi keširani status
      const cached = await AsyncStorage.getItem('isSubscribed');
      setIsSubscribed(cached === 'true');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setSubscriptionLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      if (!session?.user) {
        throw new Error('No user logged in');
      }

      // Prvo obriši sve podatke korisnika iz tvojih tabela
      const { error: deleteError } = await supabase
        .from('diary_entries')
        .delete()
        .eq('user_id', session.user.id);

      if (deleteError) throw deleteError;

      // Pozovi Edge Function za brisanje naloga
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: session.user.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      console.log('Edge function response:', data, error);
      if (error || data?.error) {
        Alert.alert('Error', JSON.stringify(error || data?.error));
        throw error || data.error;
      }

      // Odjavi korisnika
      await signOut();
      return { error: null };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      signIn,
      signUp,
      signOut,
      refreshSession,
      loading,
      resetPassword,
      updatePassword,
      isSubscribed,
      subscriptionLoading,
      checkSubscriptionStatus,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 