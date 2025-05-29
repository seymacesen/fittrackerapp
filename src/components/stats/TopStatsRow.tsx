import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MiniStat from './MiniStat';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

interface Props {
    calories: number;
    steps: number;
    moveMinutes: number;
    navigation: NativeStackNavigationProp<MainStackParamList>;
}

const TopStatsRow: React.FC<Props> = ({ calories, steps, moveMinutes, navigation }) => {
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate('CalorieHistory')}>
                <MiniStat label="🔥 Calories" value={Math.round(calories)} unit="kcal" />
            </TouchableOpacity>
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
