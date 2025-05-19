import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FAQScreen = () => {
  const navigation = useNavigation();
  const faqs = [
    {
      question: "How secure is my diary?",
      answer: "Your diary entries are stored securely in the cloud using end-to-end encryption. Only you can access your entries through your account."
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes, you can create and edit entries offline. They will automatically sync when you're back online."
    },
    {
      question: "How do I add images to my entries?",
      answer: "When creating or editing an entry, tap the image icon in the toolbar. You can choose to take a new photo or select one from your gallery."
    },
    {
      question: "Can I export my diary entries?",
      answer: "Yes, you can export your diary entries as PDF or text files for backup or printing purposes."
    },
    {
      question: "Is there a limit to how many entries I can create?",
      answer: "No, there's no limit to the number of entries you can create. Write as much as you want!"
    },
    {
      question: "How do I delete an entry?",
      answer: "Open the entry you want to delete, then tap the delete icon in the top right corner. You'll be asked to confirm before the entry is permanently deleted."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          FAQ
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <View style={styles.questionContainer}>
              <Text variant="titleMedium" style={styles.question}>
                {faq.question}
              </Text>
            </View>
            <Text variant="bodyLarge" style={styles.answer}>
              {faq.answer}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#6B4EFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  questionContainer: {
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 78, 255, 0.1)',
  },
  question: {
    color: '#6B4EFF',
    fontWeight: '600',
  },
  answer: {
    color: '#666',
    lineHeight: 22,
    padding: 16,
  },
});

export default FAQScreen; 