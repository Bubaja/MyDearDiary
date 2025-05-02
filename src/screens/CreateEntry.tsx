import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TextInput, InputAccessoryView, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { debounce } from 'lodash';

type CreateEntryRouteProp = RouteProp<RootStackParamList, 'CreateEntry'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LINE_HEIGHT = 24; // Visina jedne linije
const MARGIN_HORIZONTAL = 20; // Margine sa strane

export default function CreateEntry() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const richText = React.useRef<RichEditor>(null);
  const navigation = useNavigation<NavigationProp>();
  const { session } = useAuth();
  const route = useRoute<CreateEntryRouteProp>();
  const entry = route.params?.entry;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  useEffect(() => {
    if (entry) {
      try {
        // Validate content length before setting
        if (entry.content && entry.content.length > 50000) {
          setContentError('Entry content is too long and might affect performance');
          // Still load the content but show warning
          setContent(entry.content);
        } else {
          setContentError(null);
          setContent(entry.content || '');
        }
        setTitle(entry.title || '');
      } catch (error) {
        console.error('Error loading entry:', error);
        Alert.alert('Error', 'Failed to load entry content');
        navigation.goBack();
      }
    } else {
      setTitle(format(new Date(), "EEEE, MMMM do, yyyy"));
      setContent('<p>My Dear Diary...</p>');
      setContentError(null);
    }

    // Ensure header is hidden
    navigation.setOptions({
      headerShown: false,
      header: () => null
    });
  }, [entry, navigation]);

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

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleContentChange = (text: string) => {
    setContent(text);
  };

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

      // Check if it's a supported image type
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        Alert.alert('Error', 'Unsupported image format. Please use JPG, PNG or GIF.');
        return;
      }

      console.log('Starting image upload process...');
      
      // Create form data with optimized image
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: filename,
        type: `image/${ext}`
      } as any);

      console.log('Uploading to Supabase...');
      const { data, error } = await supabase.storage
        .from('diary-images')
        .upload(filePath, formData, {
          contentType: `image/${ext}`,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful, getting public URL...');
      const { data: urlData } = supabase.storage
        .from('diary-images')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);
      
      // Insert image into editor with proper styling
      const imageHtml = `<img src="${publicUrl}" alt="diary image" style="width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`;
      
      // Insert image at current cursor position
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

  const handleSubmit = async () => {
    try {
    if (!session?.user) {
        Alert.alert('Error', 'You must be logged in to create entries.');
      return;
    }

      console.log('Submitting entry with content:', content);
      console.log('Title:', title);

      const cleanContent = content
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
        .trim();
      
      console.log('Cleaned content:', cleanContent);

      const { data, error } = await supabase
          .from('entries')
          .insert({
            title,
            content: cleanContent,
            user_id: session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Entry created successfully:', data);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating entry:', error);
      Alert.alert('Error', 'Failed to create entry');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
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
          style={styles.headerButton}
        >
          <Ionicons name="checkmark" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {contentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{contentError}</Text>
        </View>
      )}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
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
              initialHeight={Dimensions.get('window').height - 200}
              useContainer={false}
              editorStyle={{
                contentCSSText: `
                  * {
                    font-family: -apple-system;
                    font-size: 16px;
                    line-height: 1.5;
                  }
                  body {
                    margin: 0;
                    padding: 0 16px;
                    height: auto;
                    min-height: 100%;
                  }
                  p {
                    margin: 0;
                    padding: 0;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 8px 0;
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
          style={styles.toolbar}
          onPressAddImage={handleImagePick}
        />
      </KeyboardAccessoryView>
    </SafeAreaView>
  );
}

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
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
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
    height: 44,
  },
  toolbar: {
    backgroundColor: '#ffffff',
    height: 44,
  },
  editor: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: Platform.OS === 'ios' ? 44 : 0,
  },
  errorContainer: {
    backgroundColor: '#fff3cd',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  errorText: {
    color: '#856404',
    fontSize: 14,
  },
  keyboardAccessory: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
}); 