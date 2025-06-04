import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator, Text, Keyboard, InputAccessoryView, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DiaryEntry } from '../types/diary';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = NativeStackScreenProps<RootStackParamList, 'EditEntry'>;

const EditEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const richText = React.useRef<RichEditor>(null);
  const navigation = useNavigation<NavigationProp>();
  const { params: { entry } } = useRoute<RouteProps['route']>();
  const { session } = useAuth();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { height, width } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entry]);

  useEffect(() => {
    const onKeyboardShow = (e: any) => setKeyboardHeight(e.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardHeight(0);
    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleImagePick = async () => {
    Alert.alert(
      'Add Image',
      'Choose image source',
      [
        {
          text: 'Camera',
          onPress: handleCameraCapture,
        },
        {
          text: 'Gallery',
          onPress: handleGalleryPick,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permission to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0].uri) {
      await handleImageUpload(result.assets[0]);
    }
  };

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery permission to use this feature.');
      return;
    }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      quality: 0.7,
        base64: true,
      exif: false,
      });

    if (!result.canceled && result.assets[0].uri) {
      await handleImageUpload(result.assets[0]);
    }
  };

  const handleImageUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      const uri = asset.uri;
      const filename = uri.split('/').pop();
      const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${session?.user.id}/${Date.now()}.${ext}`;

      if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        Alert.alert('Error', 'Unsupported image format. Please use JPG, PNG or GIF.');
          return;
        }

      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: filename,
        type: `image/${ext}`
      } as any);

      const { data, error } = await supabase.storage
        .from('diary-images')
        .upload(filePath, formData, {
          contentType: `image/${ext}`,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('diary-images')
          .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      
      const imageHtml = `<img src="${publicUrl}" alt="diary image" style="width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`;
      richText.current?.insertHTML(imageHtml);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Image upload error:', errorMessage);
      Alert.alert(
        'Error',
        'Failed to upload image. Please check your internet connection and try again.'
      );
    }
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleSubmit = async () => {
    try {
      if (!session?.user) {
        Alert.alert('Error', 'You must be logged in to save entries.');
      return;
    }

      setLoading(true);
      const cleanContent = content
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
        .trim();

      console.log('Attempting to update entry:', {
        id: entry.id,
        title,
        contentLength: cleanContent.length
      });

      const { error } = await supabase
        .from('entries')
        .update({
          title,
          content: cleanContent,
        })
        .eq('id', entry.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Entry updated successfully');
      // Sačekaj malo da se promene propagiraju
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.goBack();
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error updating entry:', error.message || error);
      Alert.alert('Error', `Failed to save changes: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? height * 0.08 : 16 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      <TextInput
        value={title}
        onChangeText={setTitle}
          style={styles.titleInput}
          placeholder="Entry Title"
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          onPress={handleSubmit}
          style={[styles.headerButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="checkmark" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.editorContainer}>
            <RichEditor
              ref={richText}
              initialContentHTML={content}
              onChange={handleContentChange}
              placeholder="My Dear Diary..."
              style={styles.editor}
              initialHeight={height * 0.7}
              editorStyle={{
                contentCSSText: `
                  * {
                    font-family: -apple-system;
                    font-size: ${width * 0.04}px;
                    line-height: 1.5;
                  }
                  body {
                    margin: 0;
                    padding: 0 ${width * 0.04}px;
                    width: 100%;
                    max-width: 100%;
                  }
                  p {
                    margin: 0;
                    padding: 0;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: ${width * 0.02}px;
                    margin: ${width * 0.02}px 0;
                  }
                `
              }}
            />
          </View>
    </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAccessoryView 
        alwaysVisible={true} 
        androidAdjustResize 
        hideBorder={true}
        bumperHeight={0}
        style={styles.keyboardAccessory}
      >
        <RichToolbar
          editor={richText}
          actions={[
            actions.undo,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.insertImage,
          ]}
          style={{
            backgroundColor: '#ffffff',
            height: Math.max(44, height * 0.06),
            paddingHorizontal: width * 0.02,
          }}
          onPressAddImage={handleImagePick}
        />
      </KeyboardAccessoryView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    marginHorizontal: '4%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '4%',
    paddingBottom: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
  },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    color: '#333',
    minHeight: 44,
  },
  toolbar: {
    backgroundColor: '#ffffff',
  },
  editor: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: Platform.OS === 'ios' ? 44 : 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  keyboardAccessory: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  keyboardAccessoryInner: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: '#f8f8f8',
  },
});

export default EditEntry; 