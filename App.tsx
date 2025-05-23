import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './src/screens/athlete/DashboardScreen';
import ExerciseHistoryScreen from './src/screens/athlete/ExerciseHistoryScreen';
import AthleteStackNavigator from './src/navigation/AthleteStackNavigator';
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Health"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let icon = '❤️';
            if (route.name === 'Health') icon = '❤️';
            else if (route.name === 'Exercises') icon = '🏃';
            return <Text style={{ fontSize: 22, color }}>{icon}</Text>;
          },
          tabBarActiveTintColor: '#bb86fc',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: {
            backgroundColor: '#1e1e1e',
            borderTopColor: '#2d2d2d',
            paddingBottom: 6,
            height: 58,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Health" component={DashboardScreen} />
        <Tab.Screen name="Exercises" component={AthleteStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
