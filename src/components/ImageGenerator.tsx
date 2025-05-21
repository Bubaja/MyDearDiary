import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const ImageGenerator = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.icon}
        contentFit="contain"
      />
      <Image
        source={require('../../assets/splash.png')}
        style={styles.splash}
        contentFit="contain"
      />
      <Image
        source={require('../../assets/adaptive-icon.png')}
        style={styles.adaptiveIcon}
        contentFit="contain"
      />
      <Image
        source={require('../../assets/favicon.png')}
        style={styles.favicon}
        contentFit="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 1024,
    height: 1024,
  },
  splash: {
    width: 1242,
    height: 2436,
  },
  adaptiveIcon: {
    width: 1024,
    height: 1024,
  },
  favicon: {
    width: 32,
    height: 32,
  },
});

export default ImageGenerator; 