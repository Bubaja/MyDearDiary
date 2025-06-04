import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function PrivacyPolicy() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="headlineMedium" style={styles.title}>Privacy Policy</Text>
      
      <Text variant="bodyLarge" style={styles.section}>
        Last updated: April 24, 2024
      </Text>

      <Text variant="bodyLarge" style={styles.section}>
        At My Dear Diary, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
      </Text>

      <Text variant="titleMedium" style={styles.heading}>Information We Collect</Text>
      <Text variant="bodyLarge" style={styles.section}>
        • Account Information: Email, name, and profile picture{'\n'}
        • Diary Entries: Text and images you choose to save{'\n'}
        • Usage Data: How you interact with the app
      </Text>

      <Text variant="titleMedium" style={styles.heading}>How We Use Your Information</Text>
      <Text variant="bodyLarge" style={styles.section}>
        • To provide and maintain our service{'\n'}
        • To notify you about changes to our service{'\n'}
        • To provide customer support{'\n'}
        • To detect, prevent and address technical issues
      </Text>

      <Text variant="titleMedium" style={styles.heading}>Data Security</Text>
      <Text variant="bodyLarge" style={styles.section}>
        Your data is encrypted and stored securely. We implement appropriate security measures to protect against unauthorized access.
      </Text>

      <Text variant="titleMedium" style={styles.heading}>Contact Us</Text>
      <Text variant="bodyLarge" style={styles.section}>
        If you have any questions about this Privacy Policy, please contact us at:{'\n'}
        contact@mydeardiary.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  heading: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
    lineHeight: 24,
  },
}); 