import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    sleepHours: number;
    style?: ViewStyle;
}

const SleepCard: React.FC<Props> = ({ sleepHours, style }) => {
    return (
        <View style={[styles.card, style]}>
            <Text style={styles.title}>Sleep Duration</Text>
            <Text style={styles.hours}>{sleepHours.toFixed(1)} hrs</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#dcedc8',
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#33691e',
        marginBottom: 4,
    },
    hours: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1b5e20',
    },
});

export default SleepCard;
