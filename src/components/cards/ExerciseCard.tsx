import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { BasicExerciseInfo } from '../../services/HealthConnect/ExerciseSessionService';

interface Props {
    exercise: BasicExerciseInfo;
    onPress: () => void;
}

const ExerciseCard: React.FC<Props> = ({ exercise, onPress }) => {
    const formattedDate = new Date(exercise.startTime).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit'
    }).replace(/\./g, '/');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.contentContainer}>
                <View style={styles.leftContent}>
                    <Text style={styles.name}>{exercise.exerciseName}</Text>
                    {exercise.title && <Text style={styles.title}>{exercise.title}</Text>}
                    {exercise.calories && (
                        <Text style={styles.calories}>{exercise.calories.toFixed(0)} kcal</Text>
                    )}
                </View>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    title: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 4,
    },
    calories: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 4,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
});

export default ExerciseCard;
