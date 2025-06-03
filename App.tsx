import 'react-native-gesture-handler'; // (optional, but recommended at the top)
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';
import firebase from '@react-native-firebase/app';

const App = () => {
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        projectId: 'fittracker-app-f81c2',
        appId: '1:426816606565:android:cdf0d43f5c9221e997918c',
        apiKey: 'AIzaSyDHRG0E442Ebnr3kgu8kCNIe3JSILIFDrQ',
        storageBucket: 'fittracker-app-f81c2.firebasestorage.app'
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default App;
