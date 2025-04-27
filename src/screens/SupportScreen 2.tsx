import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const SupportScreen = () => {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:bubaja99@gmail.com?subject=My Dear Diary Support');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          How can we help?
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          We're here to help you with any questions or issues you might have with My Dear Diary.
        </Text>

        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={32} color="#6B4EFF" />
          </View>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Email Support
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Send us an email and we'll get back to you within 24 hours.
          </Text>
          <Button
            mode="contained"
            onPress={handleEmailSupport}
            style={styles.button}
          >
            Contact Support
          </Button>
        </View>

        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle-outline" size={32} color="#6B4EFF" />
          </View>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            FAQ
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Check our frequently asked questions for quick answers to common questions.
          </Text>
          <Button
            mode="outlined"
            onPress={() => Linking.openURL('https://mydeardiaryapp.com/faq')}
            style={styles.button}
          >
            View FAQ
          </Button>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Business Hours
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Monday - Friday: 9:00 AM - 5:00 PM (CET)
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            We typically respond within 24 hours during business hours.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
});

export default SupportScreen; 