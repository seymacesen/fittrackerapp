// src/components/cards/Vo2MaxCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    vo2max: number;
    time: string;
    style?: ViewStyle;
}

const Vo2MaxCard: React.FC<Props> = ({ vo2max, time }) => {
    const displayTime = new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={styles.card}>
            <Text style={styles.label}>🧬 VO₂ Max</Text>
            <Text style={styles.value}>{vo2max.toFixed(1)} ml/kg</Text>
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
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '600',
    },
    value: {
        color: '#00c950',
        fontSize: 28,
        fontWeight: 'bold',
    },
    time: {
        color: '#888888',
        fontSize: 12,
        marginTop: 6,
    },
});

export default Vo2MaxCard;
