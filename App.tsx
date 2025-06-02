import 'react-native-gesture-handler'; // (optional, but recommended at the top)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';

const App = () => {
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
