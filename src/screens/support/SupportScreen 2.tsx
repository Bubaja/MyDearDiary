import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function SupportScreen() {
  const contactEmail = 'contact@mydeardiary.com';

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Contact Support</Text>
      
      <Text variant="bodyLarge" style={styles.text}>
        Have questions or need help? We're here for you!
      </Text>
      
      <Text variant="bodyLarge" style={styles.text}>
        Send us an email and we'll get back to you as soon as possible.
      </Text>

      <Button 
        mode="contained"
        onPress={handleEmailPress}
        style={styles.button}
      >
        Email Us
      </Button>

      <Text variant="bodyMedium" style={styles.email}>
        {contactEmail}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
  },
  email: {
    color: '#666',
  },
}); 