import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchExerciseDetails } from '../../services/HealthConnect/ExerciseSessionService';
import type { BasicExerciseInfo } from '../../services/HealthConnect/ExerciseSessionService'; // ✅ SENDE VAR

type RouteParams = {
    ExerciseDetails: { session: BasicExerciseInfo }; // ✅ Navigation paramı BasicExerciseInfo olacak
};

const ExerciseDetailScreen = () => {
    const route = useRoute<RouteProp<RouteParams, 'ExerciseDetails'>>();
    const { session } = route.params;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchExerciseDetails(session);
                setDetails(data);
            } catch (error) {
                console.error('Detay verisi alınamadı:', error);
            } finally {
                setLoading(false); // her durumda loading kapansın
            }
        };
        load();
    }, []);


    if (loading) {
        return <ActivityIndicator size="large" color="#bb86fc" style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{details.session.title ?? details.session.exerciseType}</Text>
            <Text style={styles.item}>🕒 {new Date(details.session.startTime).toLocaleString()} - {new Date(details.session.endTime).toLocaleTimeString()}</Text>
            <Text style={styles.item}>🔥 Calories: {details.calories.toFixed(1)} kcal</Text>
            <Text style={styles.item}>👣 Steps: {details.steps}</Text>
            <Text style={styles.item}>📍 Distance: {details.distance.toFixed(2)} km</Text>
            <Text style={styles.item}>❤️ Avg Heart Rate: {details.averageHeartRate ?? '-'} bpm</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    item: {
        fontSize: 16,
        color: '#cccccc',
        marginBottom: 10,
    },
});

export default ExerciseDetailScreen;
