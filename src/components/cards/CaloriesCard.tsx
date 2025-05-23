import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CaloriesCardProps {
    value: number; // gelen kcal verisi
}

const CaloriesCard: React.FC<CaloriesCardProps> = ({ value }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>🔥 Calories</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.sub}>/300 kcal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#bbb',
    },
    value: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 4,
    },
    sub: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});

export default CaloriesCard;
