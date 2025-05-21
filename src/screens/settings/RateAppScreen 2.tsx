import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';

const RateAppScreen = () => {
  const handleRateApp = async () => {
    // Replace with your actual App Store/Play Store links
    const appStoreLink = 'https://apps.apple.com/app/your-app-id';
    const playStoreLink = 'https://play.google.com/store/apps/details?id=your.app.id';
    
    // You can add platform-specific logic here
    try {
      await Linking.openURL(appStoreLink);
    } catch (error) {
      console.error('Error opening store:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate My Dear Diary</Text>
      <Text style={styles.description}>
        If you enjoy using My Dear Diary, please take a moment to rate it.
        Your feedback helps us improve the app for everyone!
      </Text>
      <Button
        mode="contained"
        onPress={handleRateApp}
        style={styles.button}
      >
        Rate Now
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 32,
  },
});

export default RateAppScreen; 