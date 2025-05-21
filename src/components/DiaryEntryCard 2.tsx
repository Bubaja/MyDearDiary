import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DiaryEntry } from '../types/diary';
import { format } from 'date-fns';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onPress: () => void;
}

const DiaryEntryCard = ({ entry, onPress }: DiaryEntryCardProps) => {
  const formattedDate = format(new Date(entry.created_at), 'dd.MM.yyyy.');
  
  // Uklanjamo HTML tagove za prikaz sadržaja
  const cleanContent = entry.content.replace(/<[^>]*>/g, '');
  const truncatedContent = cleanContent.length > 100 
    ? cleanContent.substring(0, 100) + '...'
    : cleanContent;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {truncatedContent}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DiaryEntryCard; 