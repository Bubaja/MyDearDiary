import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SupportScreen = () => {
  const navigation = useNavigation();
  const contactEmail = 'contact@mydeardiary.com';

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };

  const handleViewFAQs = () => {
    navigation.navigate('Help');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Icon name="email-outline" size={40} style={styles.icon} />
            <Text variant="titleMedium" style={styles.cardTitle}>
              Have questions or need help?
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Send us an email and we'll get back to you as soon as possible.
            </Text>
            <Button
              mode="contained"
              onPress={handleEmailPress}
              style={styles.button}
            >
              Email Us
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Icon name="frequently-asked-questions" size={40} style={styles.icon} />
            <Text variant="titleMedium" style={styles.cardTitle}>
              FAQs
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Check our frequently asked questions for quick answers.
            </Text>
            <Button
              mode="contained"
              onPress={handleViewFAQs}
              style={styles.button}
            >
              View FAQs
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.hoursSection}>
          <Text variant="titleMedium" style={styles.hoursTitle}>
            Business Hours
          </Text>
          <Text variant="bodyMedium" style={styles.hoursText}>
            Monday - Friday: 9:00 AM - 5:00 PM EST
          </Text>
          <Text variant="bodyMedium" style={styles.hoursText}>
            Saturday - Sunday: Closed
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
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
    color: '#6200ee',
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
  hoursSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  hoursTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  hoursText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
});

export default SupportScreen; 