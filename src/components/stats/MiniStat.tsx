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
        flex: 1,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    label: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MiniStat;
