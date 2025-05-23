import React from 'react';
import { View, StyleSheet } from 'react-native';
import MiniStat from './MiniStat';

interface Props {
    calories: number;
    steps: number;
    moveMinutes: number;
}

const TopStatsRow: React.FC<Props> = ({ calories, steps, moveMinutes }) => {
    return (
        <View style={styles.row}>
            <MiniStat label="🔥 Calories" value={Math.round(calories)} unit="kcal" />
            <MiniStat label="👣 Steps" value={steps} unit="" />
            <MiniStat label="⏱ Move" value={moveMinutes} unit="min" />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default TopStatsRow;
