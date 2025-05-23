import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { BasicExerciseInfo } from '../../services/HealthConnect/ExerciseSessionService';

interface Props {
    exercise: BasicExerciseInfo;
    onPress: () => void;
}

const ExerciseCard: React.FC<Props> = ({ exercise, onPress }) => {
    const formattedStart = new Date(exercise.startTime).toLocaleString();
    const formattedEnd = new Date(exercise.endTime).toLocaleString();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.name}>{exercise.exerciseName}</Text>
            {exercise.title && <Text style={styles.title}>{exercise.title}</Text>}
            <Text style={styles.time}>{formattedStart} → {formattedEnd}</Text>
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
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#bb86fc',
    },
    title: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 4,
    },
    time: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
});

export default ExerciseCard;
