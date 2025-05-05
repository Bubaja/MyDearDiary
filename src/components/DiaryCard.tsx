import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { DiaryEntry } from '../types/diary';
import { Image } from 'expo-image';

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DiaryCard({ entry, onEdit, onDelete }: DiaryCardProps) {
  const { width } = useWindowDimensions();
  const formattedDate = format(new Date(entry.created_at), 'MMM d, yyyy');

  // Clean up HTML content
  const cleanContent = entry.content
    .replace(/<div>/g, '<p>')
    .replace(/<\/div>/g, '</p>')
    .replace(/<br>/g, '</p><p>')
    .replace(/<p><\/p>/g, '<p>&nbsp;</p>');

  const baseStyle = {
    color: '#333',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: '-apple-system, Helvetica'
  };

  const tagsStyles = {
    img: {
      width: '100%',
      height: 'auto',
      borderRadius: 8,
      marginVertical: 8,
    },
    p: {
      margin: 0,
      padding: 0,
      marginBottom: 8,
      lineHeight: 20
    }
  };

  // Extract image URLs from content
  const imageUrls = entry.content.match(/<img[^>]+src="([^">]+)"/g)?.map(img => {
    const match = img.match(/src="([^">]+)"/);
    return match ? match[1] : null;
  }).filter(Boolean) || [];

  const viewProps = { style: {} };
  const textProps = { selectable: true };
  const systemFonts = ['-apple-system', 'Helvetica'];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>{entry.title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <MaterialIcons name="delete" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
      <RenderHtml
        contentWidth={width - 48}
        source={{ html: cleanContent }}
        baseStyle={baseStyle}
        tagsStyles={tagsStyles}
        enableExperimentalMarginCollapsing
        defaultViewProps={viewProps}
        defaultTextProps={textProps}
        systemFonts={systemFonts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 