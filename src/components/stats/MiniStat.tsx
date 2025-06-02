import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    value: number | string;
    unit?: string;
}

const MiniStat: React.FC<Props> = ({ label, value, unit }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>
                {value} {unit}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#ffffff',
        fontSize: 15,
        marginBottom: 4,
    },
    value: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MiniStat;
