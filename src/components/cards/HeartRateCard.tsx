import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    bpm: number;
    time: string;
    style?: ViewStyle;
}

const HeartRateCard: React.FC<Props> = ({ bpm, time, style }) => {
    const displayTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[styles.card, style]}>
            <Text style={styles.label}>❤️ Heart Rate</Text>
            <Text style={styles.value}>{bpm} bpm</Text>
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
    },
    label: {
        color: '#bbbbbb',
        fontSize: 16,
        marginBottom: 6,
    },
    value: {
        color: '#ff5c8d',
        fontSize: 28,
        fontWeight: 'bold',
    },
    time: {
        color: '#888888',
        fontSize: 12,
        marginTop: 6,
    },
});

export default HeartRateCard;
