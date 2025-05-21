import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List } from 'react-native-paper';

const HelpScreen = () => {
  const faqs = [
    {
      question: 'How do I create a new diary entry?',
      answer: 'Tap the + button in the bottom right corner of the home screen to create a new entry. You can add text, format it, and include images in your entry.'
    },
    {
      question: 'Can I edit my entries?',
      answer: 'Yes! Simply tap on any entry to view it, then tap the edit button to make changes.'
    },
    {
      question: 'How are my entries saved?',
      answer: 'All entries are automatically saved to secure cloud storage. They are also available offline once loaded.'
    },
    {
      question: 'Can I add images to my entries?',
      answer: 'Yes, you can add multiple images to each entry. When editing an entry, use the image button to select photos from your device.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all your data is encrypted and stored securely. Only you can access your entries through your account.'
    },
    {
      question: 'How do I delete an entry?',
      answer: 'Open the entry you want to delete, then tap the delete button. You will be asked to confirm before the entry is permanently removed.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Frequently Asked Questions
        </Text>
        
        {faqs.map((faq, index) => (
          <List.Accordion
            key={index}
            title={faq.question}
            titleStyle={styles.question}
            style={styles.accordion}
          >
            <View style={styles.answerContainer}>
              <Text variant="bodyMedium" style={styles.answer}>
                {faq.answer}
              </Text>
            </View>
          </List.Accordion>
        ))}

        <View style={styles.contactSection}>
          <Text variant="titleMedium" style={styles.contactTitle}>
            Still need help?
          </Text>
          <Text variant="bodyMedium" style={styles.contactText}>
            Contact us at contact@mydeardiary.com
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
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  accordion: {
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    borderRadius: 8,
  },
  question: {
    fontSize: 16,
    color: '#333',
  },
  answerContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  answer: {
    color: '#666',
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  contactTitle: {
    marginBottom: 8,
  },
  contactText: {
    color: '#666',
  },
});

export default HelpScreen; 