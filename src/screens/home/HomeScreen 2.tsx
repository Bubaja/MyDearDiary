import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DiaryCard from '../../components/DiaryCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { DiaryEntry } from '../../types/diary';
import CalendarHeader from '../../components/CalendarHeader';
import { startOfDay, endOfDay, isSameDay } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DrawerMenu from '../../components/DrawerMenu';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { session, signOut, refreshSession } = useAuth();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsDrawerOpen(true)}
          >
            <Ionicons name="menu-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Dear Diary</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      // Prvo proveri sve unose u bazi
      const { data: allEntries, error: allError } = await supabase
        .from('entries')
        .select('*');

      if (allError) {
        console.error('Error checking all entries:', allError);
      } else {
        console.log('All entries in database:', allEntries);
      }

      // Zatim dohvati filtrirane unose za trenutnog korisnika i datum
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('created_at', startOfDay(selectedDate).toISOString())
        .lte('created_at', endOfDay(selectedDate).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshSession();
      fetchEntries();
    }, [session?.user?.id, selectedDate])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const handleEntryPress = (entry: DiaryEntry) => {
    navigation.navigate('EntryDetail', { id: entry.id });
  };

  const checkExistingEntry = async (date: Date) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('created_at', startOfDay(date).toISOString())
        .lte('created_at', endOfDay(date).toISOString())
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking existing entry:', error);
      return null;
    }
  };

  const handleAddEntry = async () => {
    const existingEntry = await checkExistingEntry(new Date());
    
    if (existingEntry) {
      // Ako postoji unos za danas, otvori ga za editovanje
      navigation.navigate('CreateEntry', { entry: existingEntry });
      return;
    }

    // Ako ne postoji unos za danas, kreiraj novi
    navigation.navigate('CreateEntry', {});
  };

  const handleDatePickerConfirm = (date: Date) => {
    setDatePickerVisible(false);
    setSelectedDate(date);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    navigation.navigate('CreateEntry', { entry });
  };

  const handleDeleteEntry = async (entry: DiaryEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

              // Refresh the entries list
              fetchEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          },
        },
      ],
    );
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={toggleDrawer}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dear Diary</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <CalendarHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No entries for this date. Start writing your story!
            </Text>
          </View>
        ) : (
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
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddEntry}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay}>
            <DrawerMenu 
              onClose={closeDrawer} 
              onNavigate={(screen: any, params?: any) => {
                const navigateToScreen = () => {
                  switch (screen) {
                    case 'Home':
                    case 'ProfileEdit':
                      navigation.navigate(screen);
                      break;
                    case 'Legal':
                      navigation.navigate(screen, params);
                      break;
                    default:
                      console.warn('Unknown screen:', screen);
                  }
                };
                navigateToScreen();
                closeDrawer();
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
}); 