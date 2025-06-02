import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseHistoryScreen from '../screens/athlete/ExerciseHistoryScreen';
import ExerciseDetailScreen from '../screens/athlete/ExerciseDetailScreen';
import HeartRateHistoryScreen from '../screens/athlete/HeartRateHistoryScreen';

// 💡 Tip tanımı eklendi
export type RootStackParamList = {
    ExerciseHistory: undefined;
    ExerciseDetails: { session: any };
    HeartRateHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AthleteStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ExerciseHistory" component={ExerciseHistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name="ExerciseDetails"
                component={ExerciseDetailScreen}
                options={{ headerShown: true, title: 'Exercise Details' }}
            />
            <Stack.Screen name="HeartRateHistory" component={HeartRateHistoryScreen} />
        </Stack.Navigator>
    );
};

export default AthleteStackNavigator;
