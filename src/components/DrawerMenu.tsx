import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';

type NavigateFunction = (screen: keyof RootStackParamList, params?: any) => void;

interface DrawerMenuProps {
  onClose: () => void;
  onNavigate: NavigateFunction;
}

export default function DrawerMenu({ onClose, onNavigate }: DrawerMenuProps) {
  const { session } = useAuth();

  const handleMenuItemPress = (screen: keyof RootStackParamList, params?: any) => {
    if (screen === 'Home') {
      onNavigate(screen);
      onClose();
    } else if (screen === 'SignIn') {
      onNavigate(screen);
      // Ne zatvaramo drawer za SignIn jer će to biti handled kroz auth context
    } else {
      onNavigate(screen, params);
      onClose();
    }
  };

  const menuItems = [
    { label: 'Home', icon: 'home-outline', screen: 'Home' as const },
    { label: 'Help & FAQ', icon: 'help-circle-outline', screen: 'Help' as const },
    { label: 'Contact Support', icon: 'mail-outline', screen: 'Support' as const },
    { label: 'Rate App', icon: 'star-outline', screen: 'RateApp' as const },
    { 
      label: 'Privacy Policy', 
      icon: 'shield-outline', 
      screen: 'Legal' as const, 
      params: { documentType: 'privacy-policy' } 
    },
    { 
      label: 'Terms of Service', 
      icon: 'document-text-outline', 
      screen: 'Legal' as const, 
      params: { documentType: 'terms-of-service' } 
    },
    { label: 'Sign Out', icon: 'log-out-outline', screen: 'SignIn' as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="person" size={32} color="#444" />
            </View>
              </View>
          <View style={styles.userText}>
            <Text variant="titleMedium" style={styles.userName}>
              {session?.user?.user_metadata?.full_name || 'User'}
            </Text>
            <Text variant="bodySmall" style={styles.userEmail}>
              {session?.user?.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.drawer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>
        <View style={styles.content}>
          {menuItems.map((item, index) => (
          <TouchableOpacity 
              key={index}
            style={styles.menuItem} 
              onPress={() => handleMenuItemPress(item.screen, item.params)}
          >
              <Ionicons name={item.icon as any} size={24} color="#333" />
              <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '80%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: Platform.OS === 'ios' ? 47 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  drawer: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    flex: 1,
  },
  userName: {
    color: '#333',
  },
  userEmail: {
    color: '#666',
  },
}); 