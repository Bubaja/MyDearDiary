import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import NewEntryScreen from '../screens/diary/NewEntryScreen';
import ViewEntryScreen from '../screens/diary/ViewEntryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'My Diary',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen 
        name="NewEntry" 
        component={NewEntryScreen}
        options={{ 
          title: 'New Entry',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="ViewEntry" 
        component={ViewEntryScreen}
        options={{ 
          title: 'Entry Details'
        }}
      />
    </Stack.Navigator>
  );
} 