import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function TermsOfService() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Terms of Service</Text>
      
      <Text variant="bodyLarge" style={styles.section}>
        Last updated: April 24, 2024
      </Text>

      <Text variant="bodyLarge" style={styles.section}>
        Please read these Terms of Service carefully before using My Dear Diary.
      </Text>

      <Text variant="titleMedium" style={styles.heading}>1. Acceptance of Terms</Text>
      <Text variant="bodyLarge" style={styles.section}>
        By accessing or using My Dear Diary, you agree to be bound by these Terms of Service and all applicable laws and regulations.
      </Text>

      <Text variant="titleMedium" style={styles.heading}>2. User Accounts</Text>
      <Text variant="bodyLarge" style={styles.section}>
        • You are responsible for maintaining the confidentiality of your account{'\n'}
        • You must provide accurate and complete information{'\n'}
        • You are responsible for all activities under your account
      </Text>

      <Text variant="titleMedium" style={styles.heading}>3. Content</Text>
      <Text variant="bodyLarge" style={styles.section}>
        • You retain all rights to your content{'\n'}
        • You are responsible for the content you create{'\n'}
        • We do not claim ownership of your content
      </Text>

      <Text variant="titleMedium" style={styles.heading}>4. Prohibited Activities</Text>
      <Text variant="bodyLarge" style={styles.section}>
        • Violating laws or regulations{'\n'}
        • Interfering with the app's security{'\n'}
        • Attempting to access other users' accounts
      </Text>

      <Text variant="titleMedium" style={styles.heading}>5. Changes to Terms</Text>
      <Text variant="bodyLarge" style={styles.section}>
        We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
      </Text>

      <Text variant="titleMedium" style={styles.heading}>Contact</Text>
      <Text variant="bodyLarge" style={styles.section}>
        For any questions about these Terms, please contact us at:{'\n'}
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