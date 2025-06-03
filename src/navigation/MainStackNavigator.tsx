// src/navigation/MainStackNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import DashboardScreen from '../screens/athlete/DashboardScreen';
import ExerciseHistoryScreen from '../screens/athlete/ExerciseHistoryScreen';
import ExerciseDetailScreen from '../screens/athlete/ExerciseDetailScreen';
import HeartRateHistoryScreen from '../screens/athlete/HeartRateHistoryScreen';
import CalorieHistoryScreen from '../screens/athlete/CalorieHistoryScreen';
import SleepHistoryScreen from '../screens/athlete/SleepHistoryScreen';
import StepHistoryScreen from '../screens/athlete/StepHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthStackNavigator from './AuthStackNavigator';
import { AuthService } from '../services/AuthService';
import { useTheme } from '../theme/ThemeContext';
import ProfileScreen from '../screens/athlete/ProfileScreen';

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

const TabNavigator = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 0,
                    height: 64,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text.secondary,
                tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName = 'home';
                    if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
                    if (route.name === 'Exercises') iconName = focused ? 'barbell' : 'barbell-outline';
                    if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName as any} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
            <Tab.Screen name="Exercises" component={ExerciseStack} options={{ tabBarLabel: 'Exercises' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
};

const MainStackNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const theme = useTheme();

    useEffect(() => {
        const unsubscribe = AuthService.onAuthStateChanged((user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });

        return unsubscribe;
    }, [initializing]);

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color="#ff5252" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="Tabs" component={TabNavigator} />
                    <Stack.Screen name="HeartRateHistory" component={HeartRateHistoryScreen} />
                    <Stack.Screen name="CalorieHistory" component={CalorieHistoryScreen} />
                    <Stack.Screen name="SleepHistory" component={SleepHistoryScreen} />
                    <Stack.Screen name="StepHistory" component={StepHistoryScreen} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthStackNavigator} />
            )}
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
