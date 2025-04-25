import React from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const RateAppScreen = () => {
  const handleRateApp = () => {
    const appStoreId = '123456789'; // Replace with your actual App Store ID
    const playStoreId = 'com.mydeardiaryapp'; // Replace with your actual Play Store ID
    
    if (Platform.OS === 'ios') {
      Linking.openURL(`itms-apps://apps.apple.com/app/id${appStoreId}?action=write-review`);
    } else {
      Linking.openURL(`market://details?id=${playStoreId}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={64} color="#FFD700" />
        </View>

        <Text variant="headlineSmall" style={styles.title}>
          Enjoying My Dear Diary?
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          Your feedback helps us improve and helps others discover this app. 
          If you're enjoying My Dear Diary, please take a moment to rate it.
        </Text>

        <Button
          mode="contained"
          onPress={handleRateApp}
          style={styles.button}
        >
          Rate on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
        </Button>

        <Text variant="bodyMedium" style={styles.feedback}>
          Have suggestions or found a bug? Please contact our support team.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    marginBottom: 24,
  },
  feedback: {
    textAlign: 'center',
    color: '#666',
  },
});

export default RateAppScreen; 