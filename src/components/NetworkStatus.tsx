import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNetwork } from '../contexts/NetworkContext';
import { Ionicons } from '@expo/vector-icons';

export default function NetworkStatus() {
  const { isConnected, isInternetReachable } = useNetwork();

  if (isConnected && isInternetReachable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={20} color="#fff" />
      <Text style={styles.text}>
        {!isConnected 
          ? "No network connection" 
          : !isInternetReachable 
            ? "No internet access" 
            : "Network issues"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
}); 