import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text } from 'react-native-paper';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          My Dear Diary
        </Text>
        <Text variant="bodyLarge" style={styles.version}>
          Version 1.0.0
        </Text>
        
        <Text variant="bodyMedium" style={styles.description}>
          My Dear Diary is your personal digital journal that helps you capture life's precious moments. 
          With features like rich text editing, image attachments, and secure cloud storage, 
          you can create beautiful memories that last forever.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Created by
        </Text>
        <Text variant="bodyMedium" style={styles.text}>
          Milos Milicevic
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contact
        </Text>
        <Text 
          variant="bodyMedium" 
          style={[styles.text, styles.link]}
          onPress={() => Linking.openURL('mailto:bubaja99@gmail.com')}
        >
          bubaja99@gmail.com
        </Text>
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
    marginBottom: 8,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
  link: {
    color: '#6B4EFF',
    textDecorationLine: 'underline',
  },
});

export default AboutScreen; 