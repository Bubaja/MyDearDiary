import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback, Platform, SafeAreaView, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DiaryCard from '../../components/DiaryCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation, DrawerActions } from '@react-navigation/native';
import { DiaryEntry } from '../../types/diary';
import CalendarHeader from '../../components/CalendarHeader';
import { startOfDay, endOfDay } from 'date-fns';
import * as RNIap from 'react-native-iap';
import NetworkStatus from '../../components/NetworkStatus';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isIPad = Platform.OS === 'ios' && Platform.isPad;
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { session, signOut } = useAuth();
  const { isConnected, isInternetReachable } = useNetwork();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const SUBSCRIPTION_ID = Platform.select({
    ios: 'com.mydeardiary.monthly',
    android: 'com.mydeardiary.monthly',
  });

  const fetchEntries = async () => {
    if (!session?.user?.id) {
      setEntries([]);
      return;
    }

    if (!isConnected || !isInternetReachable) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.'
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfDay(selectedDate).toISOString())
        .lte('created_at', endOfDay(selectedDate).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      Alert.alert('Error', 'Failed to fetch entries. Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [session?.user?.id, selectedDate])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const handleAddEntry = async () => {
    if (!isConnected || !isInternetReachable) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.'
      );
      return;
    }

    if (!session?.user) {
      navigation.navigate('Register');
      return;
    }

    try {
      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      const endOfToday = endOfDay(today).toISOString();

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfToday)
        .lte('created_at', endOfToday)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        navigation.navigate('EditEntry', { entry: data });
      } else {
        navigation.navigate('CreateEntry', { entry: undefined });
      }
    } catch (error) {
      console.error('Error checking today\'s entry:', error);
      Alert.alert('Error', 'Failed to check today\'s entry');
    }
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    navigation.navigate('EditEntry', { entry });
  };

  const handleDeleteEntry = async (entry: DiaryEntry) => {
    if (!isConnected || !isInternetReachable) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.'
      );
      return;
    }

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('entries')
                .delete()
                .eq('id', entry.id);

              if (error) throw error;
              fetchEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatus />
      <View style={[styles.header, { paddingHorizontal: width * 0.04, paddingVertical: height * 0.01 }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Ionicons name="menu" size={width * 0.07} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: width * 0.055 }]}>My Dear Diary</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddEntry}
        >
          <View style={[styles.addButtonInner, { width: width * 0.09, height: width * 0.09, borderRadius: (width * 0.09) / 2 }]}>
            <Ionicons name="add" size={width * 0.07} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <CalendarHeader
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onEdit={() => handleEditEntry(item)}
            onDelete={() => handleDeleteEntry(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={[styles.emptyContainer, isIPad && { paddingVertical: 80 }]}>
            <Ionicons 
              name={session?.user ? "book-outline" : "log-in-outline"} 
              size={width * 0.12} 
              color="#6B4EFF" 
              style={styles.emptyIcon} 
            />
            <Text style={[
              styles.emptyText,
              { fontSize: isIPad ? 32 : width * 0.045, lineHeight: isIPad ? 40 : 24 },
            ]}>
              {session?.user 
                ? "No entries for this day yet.\nTap + to add one."
                : "Sign in to start writing your diary.\nTap + to get started."}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: width * 0.04 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  addButtonInner: {
    backgroundColor: '#6B4EFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B4EFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen; 