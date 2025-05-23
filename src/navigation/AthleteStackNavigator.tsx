import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseHistoryScreen from '../screens/athlete/ExerciseHistoryScreen';
import ExerciseDetailScreen from '../screens/athlete/ExerciseDetailScreen';

const Stack = createNativeStackNavigator();

const AthleteStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ExerciseHistory" component={ExerciseHistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ExerciseDetails" component={ExerciseDetailScreen} />
        </Stack.Navigator>
    );
};

export default AthleteStackNavigator;
