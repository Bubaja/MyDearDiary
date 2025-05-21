import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type ProfileEditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileEdit'>;

export default function ProfileEditScreen() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session?.user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: session?.user.id }]);

        if (insertError) throw insertError;
        
        setFullName('');
      } else if (checkError) {
        throw checkError;
      } else if (existingProfile) {
        setFullName(existingProfile.full_name || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      // Update user metadata in Auth
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (updateUserError) throw updateUserError;

      // Update profile in database
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: session?.user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (updateProfileError) throw updateProfileError;

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={updateProfile}
            loading={loading}
            style={styles.button}
          >
            Update Profile
          </Button>
        </View>
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
    flex: 1,
    paddingTop: 60,
  },
  section: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
}); 