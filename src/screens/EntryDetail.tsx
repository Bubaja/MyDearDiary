import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { DiaryEntry } from '../types/diary';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type EntryDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EntryDetail'>;
type EntryDetailScreenRouteProp = RouteProp<RootStackParamList, 'EntryDetail'>;

type Props = {
  navigation: EntryDetailScreenNavigationProp;
  route: EntryDetailScreenRouteProp;
};

export default function EntryDetail({ route }: Props) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', route.params.id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Ensure images is an array
        data.images = Array.isArray(data.images) ? data.images : [];
        setEntry(data);
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }

  const formattedDate = format(new Date(entry.created_at), 'MMMM d, yyyy');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.entryText}>{entry.content}</Text>

        {entry.images.length > 0 && (
          <View style={styles.imageGrid}>
            {entry.images.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  entryText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    marginBottom: 24,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  imageContainer: {
    width: '50%',
    padding: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4B4B',
    textAlign: 'center',
    marginTop: 40,
  },
}); 