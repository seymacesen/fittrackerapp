import 'react-native-gesture-handler'; // (optional, but recommended at the top)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/navigation/MainStackNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
