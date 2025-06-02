import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchExerciseDetails } from '../../services/HealthConnect/ExerciseSessionService';
import type { BasicExerciseInfo } from '../../services/HealthConnect/ExerciseSessionService';
import ExerciseHeartRateChart from '../../components/charts/ExerciseHeartRateChart';
import ExerciseHeartRateZonesBar from '../../components/charts/ExerciseHeartRateZonesBar';
import dayjs from 'dayjs';

// List of exercise types that typically involve steps and distance
const EXERCISE_TYPES_WITH_STEPS_DISTANCE = [
    8, // Biking
    9, // Stationary Biking - Biking might have distance but not steps, let's include for distance
    37, // Hiking
    56, // Running
    57, // Running (Treadmill)
    79, // Walking
];

type RouteParams = {
    ExerciseDetails: { session: BasicExerciseInfo };
};

const ExerciseDetailScreen = () => {
    const route = useRoute<RouteProp<RouteParams, 'ExerciseDetails'>>();
    const { session } = route.params;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [heartRateData, setHeartRateData] = useState<Array<{ time: string; bpm: number }>>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchExerciseDetails(session);
                setDetails(data);

                // Format heart rate data for the chart
                if (data.heartRateSamples && data.heartRateSamples.length > 0) {
                    const formattedData = data.heartRateSamples.map(sample => ({
                        time: sample.time,
                        bpm: sample.beatsPerMinute
                    }));
                    setHeartRateData(formattedData);
                }
            } catch (error) {
                console.error('Failed to fetch details:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#bb86fc" style={{ marginTop: 50 }} />;
    }

    // Format the date and time for display
    const exerciseDate = new Date(details.session.startTime).toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\./g, '/'); // Replace dots with slashes

    const exerciseTime = new Date(details.session.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    // Calculate duration
    const startTime = dayjs(details.session.startTime);
    const endTime = dayjs(details.session.endTime);
    const durationSeconds = endTime.diff(startTime, 'second');
    const durationFormatted = `${Math.floor(durationSeconds / 60 / 60).toString().padStart(2, '0')}:${Math.floor(durationSeconds / 60 % 60).toString().padStart(2, '0')}:${(durationSeconds % 60).toString().padStart(2, '0')}`;

    // Check if exercise type includes steps and distance
    const includesStepsDistance = EXERCISE_TYPES_WITH_STEPS_DISTANCE.includes(details.session.exerciseType);

    return (
        <ScrollView style={styles.container}>
            {/* Exercise Title and Date */}
            <View style={styles.headerContainer}>
                <Text style={styles.exerciseTitle}>
                    {details.session.title ?? details.session.exerciseName}
                </Text>
                <Text style={styles.exerciseType}>
                    {details.session.exerciseName.split(' ')
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                </Text>
                <Text style={styles.exerciseDate}>
                    {`${exerciseDate} ${exerciseTime}`}
                </Text>
            </View>

            {/* Middle Section (Summary) */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{durationFormatted}</Text>
                        <Text style={styles.summaryLabel}>Duration</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{details.calories.toFixed(1)}</Text>
                        <Text style={styles.summaryLabel}>kcal</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{details.averageHeartRate ?? '-'}</Text>
                        <Text style={styles.summaryLabel}>Avg. BPM</Text>
                    </View>
                </View>
                {includesStepsDistance && (
                    <View style={styles.summaryRow}>
                        {details.steps !== undefined && (
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>{details.steps}</Text>
                                <Text style={styles.summaryLabel}>Steps</Text>
                            </View>
                        )}
                        {details.distance !== undefined && (
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>{details.distance.toFixed(2)}</Text>
                                <Text style={styles.summaryLabel}>km</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Heart Rate Chart Section */}
            {heartRateData.length > 0 && (
                <View style={styles.chartSection}>
                    {/* Avg and Max HR */}
                    <View style={styles.heartRateStatsContainer}>
                        <View style={styles.heartRateStatItem}>
                            <Text style={styles.heartRateStatValue}>{details.averageHeartRate ?? '-'}</Text>
                            <Text style={styles.heartRateStatLabel}>Avg. BPM</Text>
                        </View>
                        {details.maxHeartRate !== undefined && (
                            <View style={styles.heartRateStatItem}>
                                <Text style={styles.heartRateStatValue}>{details.maxHeartRate}</Text>
                                <Text style={styles.heartRateStatLabel}>Max. BPM</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.sectionTitle}>Heart Rate (BPM)</Text>
                    <ExerciseHeartRateChart data={heartRateData} />
                    <ExerciseHeartRateZonesBar
                        age={23}
                        data={heartRateData.map(d => d.bpm)}
                        sampleTimes={heartRateData.map(d => d.time)}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    exerciseTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    exerciseType: {
        fontSize: 20,
        color: '#ffffff',
        marginTop: 4,
        marginBottom: 4,
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    exerciseDate: {
        fontSize: 14,
        color: '#cccccc',
        marginTop: 4,
    },
    summaryContainer: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10, // Add some space between rows
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#cccccc',
    },
    detailsContainer: { // Keep existing details styles for other info if needed later
        marginBottom: 20,
    },
    item: { // Keep existing item style for other info if needed later
        fontSize: 16,
        color: '#cccccc',
        marginBottom: 10,
    },
    chartSection: {
        marginTop: 20,
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    heartRateStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16, // Space between stats and chart title
    },
    heartRateStatItem: {
        alignItems: 'center',
    },
    heartRateStatValue: {
        fontSize: 24, // Increased font size back to 36
        fontWeight: 'bold',
        color: '#ffffff',
    },
    heartRateStatLabel: {
        fontSize: 12,
        color: '#cccccc',
    },
});

export default ExerciseDetailScreen;
