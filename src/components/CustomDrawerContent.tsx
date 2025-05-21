import React from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const CustomDrawerContent = (props: any) => {
  const { session, signOut, deleteAccount } = useAuth();

  const handleContactUs = () => {
    Linking.openURL('mailto:contact@mydeardiary.com');
  };

  const handleSignOut = async () => {
    await signOut();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteAccount();
            if (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again later.');
            } else {
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Izvlačimo samo ime iz session objekta
  const userName = session?.user?.user_metadata?.full_name || 
                  session?.user?.user_metadata?.name || 
                  'User';

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={32} color="#fff" />
            </View>
          </View>
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
          {session?.user && (
            <>
          <DrawerItem
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" color={color} size={size} />
            )}
            label="Sign Out"
                onPress={handleSignOut}
          />
              <DrawerItem
                icon={({ color, size }) => (
                  <Ionicons name="trash-outline" color="#FF3B30" size={size} />
                )}
                label="Delete Account"
                labelStyle={{ color: '#FF3B30' }}
                onPress={handleDeleteAccount}
              />
            </>
          )}
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
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