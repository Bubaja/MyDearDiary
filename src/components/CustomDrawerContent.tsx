import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = (props: any) => {
  const { session, signOut } = useAuth();

  const handleContactUs = () => {
    Linking.openURL('mailto:contact@mydeardiary.com');
  };

  // Izvlačimo samo ime iz session objekta
  const userName = session?.user?.user_metadata?.full_name || 
                  session?.user?.user_metadata?.name || 
                  'User';

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Icon 
            size={48} 
            icon="account"
            style={styles.avatar}
            color="#fff"
          />
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={styles.userName}>
              {userName}
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            )}
            label="Home"
            onPress={() => props.navigation.navigate('MainStack', { screen: 'Home' })}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="help-circle-outline" color={color} size={size} />
            )}
            label="FAQ"
            onPress={() => props.navigation.navigate('MainStack', { screen: 'FAQ' })}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="mail-outline" color={color} size={size} />
            )}
            label="Contact Us"
            onPress={handleContactUs}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="shield-outline" color={color} size={size} />
            )}
            label="Privacy Policy"
            onPress={() => props.navigation.navigate('MainStack', { 
              screen: 'Legal',
              params: { documentType: 'privacy-policy' }
            })}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="document-text-outline" color={color} size={size} />
            )}
            label="Terms of Service"
            onPress={() => props.navigation.navigate('MainStack', { 
              screen: 'Legal',
              params: { documentType: 'terms-of-service' }
            })}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" color={color} size={size} />
            )}
            label="Sign Out"
            onPress={signOut}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 12,
  },
  avatar: {
    backgroundColor: '#6B4EFF',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 18,
  },
  menuSection: {
    marginTop: 8,
  },
});

export default CustomDrawerContent; 