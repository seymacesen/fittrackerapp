import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    sleepHours: number;
    style?: ViewStyle;
}

const SleepCard: React.FC<Props> = ({ sleepHours, style }) => {
    return (
        <View style={[styles.card, style]}>
            <View style={styles.titleContainer}>
                <Text style={styles.emoji}>🌙</Text>
                <Text style={styles.title}>Sleep Duration</Text>
            </View>
            <Text style={styles.hours}>{sleepHours.toFixed(1)} hrs</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    emoji: {
        fontSize: 16,
        marginRight: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    hours: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ad46ff',
    },
});

export default SleepCard;
