import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    value: number | string;
    unit?: string;
    isFlexible?: boolean;
}

const MiniStat: React.FC<Props> = ({ label, value, unit, isFlexible }) => {
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
        backgroundColor: '#1e1e1e',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    label: {
        color: '#ffffff',
        fontSize: 15,
        marginBottom: 4,
    },
    value: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default MiniStat;
