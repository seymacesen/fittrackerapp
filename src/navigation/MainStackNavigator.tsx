// src/navigation/MainStackNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/athlete/DashboardScreen';
import ExerciseHistoryScreen from '../screens/athlete/ExerciseHistoryScreen';
import ExerciseDetailScreen from '../screens/athlete/ExerciseDetailScreen';
import HeartRateHistoryScreen from '../screens/athlete/HeartRateHistoryScreen';
import CalorieHistoryScreen from '../screens/athlete/CalorieHistoryScreen';
import SleepHistoryScreen from '../screens/athlete/SleepHistoryScreen';
import StepHistoryScreen from '../screens/athlete/StepHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type MainStackParamList = {
    Tabs: undefined;
    HeartRateHistory: undefined;
    CalorieHistory: undefined;
    ExerciseHistory: undefined;
    ExerciseDetails: { session: any };
    SleepHistory: undefined;
    StepHistory: undefined;
};

const ExerciseStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ExerciseHistory" component={ExerciseHistoryScreen} />
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetailScreen} />
    </Stack.Navigator>
);

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#181818',
                borderTopWidth: 0,
                height: 64,
            },
            tabBarActiveTintColor: '#ff5252',
            tabBarInactiveTintColor: '#bbb',
            tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
            tabBarIcon: ({ color, size, focused }) => {
                let iconName = 'home';
                if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
                if (route.name === 'Exercises') iconName = focused ? 'barbell' : 'barbell-outline';
                return <Ionicons name={iconName as any} size={24} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
        <Tab.Screen name="Exercises" component={ExerciseStack} options={{ tabBarLabel: 'Exercises' }} />
    </Tab.Navigator>
);

const MainStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="HeartRateHistory" component={HeartRateHistoryScreen} />
        <Stack.Screen name="CalorieHistory" component={CalorieHistoryScreen} />
        <Stack.Screen name="SleepHistory" component={SleepHistoryScreen} />
        <Stack.Screen name="StepHistory" component={StepHistoryScreen} />
    </Stack.Navigator>
);

export default MainStackNavigator;
