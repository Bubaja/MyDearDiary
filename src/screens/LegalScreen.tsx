import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type LegalScreenParams = {
  documentType: 'privacy-policy' | 'terms-of-service';
};

const LegalScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { documentType } = route.params as LegalScreenParams;

  const getTitle = () => {
    return documentType === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Service';
  };

  const privacyPolicyContent = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal information you provide (email address)',
        'Diary entries and content you create',
        'Usage data and analytics'
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To provide and maintain the diary service',
        'To improve our application',
        'To communicate with you'
      ]
    },
    {
      title: '3. Data Storage and Security',
      content: [
        'All data is encrypted and stored securely',
        'We use Supabase for data storage',
        'We never share your personal data with third parties'
      ]
    },
    {
      title: '4. Your Rights',
      content: [
        'Access your personal data',
        'Delete your account and data',
        'Export your diary entries'
      ]
    },
    {
      title: '5. Contact Us',
      content: [
        'For any questions about this Privacy Policy, please contact us at:',
        'contact@mydeardiary.com'
      ]
    }
  ];

  const termsOfServiceContent = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using My Dear Diary, you accept and agree to be bound by these Terms.'
      ]
    },
    {
      title: '2. User Responsibilities',
      content: [
        'Maintain the confidentiality of your account',
        'Create and maintain backup copies of your content',
        'Comply with all applicable laws and regulations'
      ]
    },
    {
      title: '3. Service Description',
      content: [
        'My Dear Diary provides a digital journaling platform for personal use.'
      ]
    },
    {
      title: '4. Intellectual Property',
      content: [
        'You retain rights to your diary content',
        'The app and its original content remain property of My Dear Diary'
      ]
    },
    {
      title: '5. Termination',
      content: [
        'We reserve the right to terminate or suspend access to our service.'
      ]
    },
    {
      title: '6. Limitation of Liability',
      content: [
        'The app is provided "as is" without warranties of any kind.'
      ]
    },
    {
      title: '7. Contact',
      content: [
        'For any questions about these Terms, contact us at:',
        'contact@mydeardiary.com'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <View style={styles.headerRight} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.card}>
            <Text style={styles.lastUpdated}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
            {(documentType === 'privacy-policy' ? privacyPolicyContent : termsOfServiceContent).map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.content.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.sectionItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B4EFF',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 200,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 12,
  },
  sectionItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 16,
  },
});

export default LegalScreen; 