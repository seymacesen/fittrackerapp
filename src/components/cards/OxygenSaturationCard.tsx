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
            <Text style={styles.label}>🫁 Oxygen Saturation</Text>
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
        flex: 1,
        marginHorizontal: 6,
    },
    label: {
        color: '#bbbbbb',
        fontSize: 16,
        marginBottom: 6,
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
