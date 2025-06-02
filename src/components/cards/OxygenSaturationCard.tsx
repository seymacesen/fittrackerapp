// src/components/cards/OxygenSaturationCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    percentage: number;
    time: string;
    style?: ViewStyle;
}

const OxygenSaturationCard: React.FC<Props> = ({ percentage, time }) => {
    const displayTime = new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={styles.card}>
            <Text style={styles.label}>🫁 SpO₂</Text>
            <Text style={styles.value}>{percentage.toFixed(1)}%</Text>
            <Text style={styles.time}>Last at {displayTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '600',
    },
    value: {
        color: '#4fc3f7',
        fontSize: 28,
        fontWeight: 'bold',
    },
    time: {
        color: '#888888',
        fontSize: 12,
        marginTop: 6,
    },
});

export default OxygenSaturationCard;
