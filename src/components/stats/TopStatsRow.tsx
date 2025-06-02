import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MiniStat from './MiniStat';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

interface Props {
    calories: number;
    steps: number;
    moveMinutes: number;
    navigation: NativeStackNavigationProp<MainStackParamList>;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 32) / 3; // Ekran genişliği - yan padding'ler

const TopStatsRow: React.FC<Props> = ({ calories, steps, moveMinutes, navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.cardSection, { width: cardWidth }]}
                onPress={() => navigation.navigate('CalorieHistory')}
            >
                <MiniStat label="🔥 Calories" value={Math.round(calories)} unit="kcal" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={[styles.cardSection, { width: cardWidth }]}>
                <MiniStat label="👣 Steps" value={steps} unit="" />
            </View>
            <View style={styles.divider} />
            <View style={[styles.cardSection, { width: cardWidth }]}>
                <MiniStat label="⏱ Move" value={moveMinutes} unit="min" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        marginBottom: 20,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    cardSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: '#333',
    },
});

export default TopStatsRow;
