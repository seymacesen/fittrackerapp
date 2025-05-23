import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    value: number;
}

const StepCard: React.FC<Props> = ({ value }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>👣 Steps</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.goal}>/ 6000 goal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#e8f5e9',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2e7d32',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1b5e20',
    },
    goal: {
        fontSize: 14,
        color: '#78909c',
    },
});

export default StepCard;
