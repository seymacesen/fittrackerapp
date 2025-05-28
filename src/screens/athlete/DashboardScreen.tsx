// src/screens/athlete/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/MainStackNavigator'; // ✅ güncel tip

import { initHealthConnect } from '../../services/HealthConnect/PermissionService';

import TopStatsRow from '../../components/stats/TopStatsRow';
import SleepCard from '../../components/cards/SleepCard';
import HeartRateCard from '../../components/cards/HeartRateCard';
import Vo2MaxCard from '../../components/cards/Vo2MaxCard';
import OxygenSaturationCard from '../../components/cards/OxygenSaturationCard';

import { fetchTodaySleepHours } from '../../services/HealthConnect/SleepService';
import { fetchTodayCalories } from '../../services/HealthConnect/CaloriesService';
import { getTodaySteps } from '../../services/HealthConnect/StepService';
import { fetchLatestHeartRate } from '../../services/HealthConnect/HeartRateService';
import { fetchLatestVo2Max } from '../../services/HealthConnect/Vo2MaxService';
import { fetchLatestOxygenSaturation } from '../../services/HealthConnect/OxygenSaturationService';

const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>(); // ✅ navigation tipi düzeltildi

    const [calories, setCalories] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const [moveMinutes, setMoveMinutes] = useState<number>(0);
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const [heartRateTime, setHeartRateTime] = useState<string>('');
    const [sleepHours, setSleepHours] = useState<number>(0);
    const [vo2Max, setVo2Max] = useState<number | null>(null);
    const [oxygenSaturation, setOxygenSaturation] = useState<number | null>(null);
    const [oxygenTime, setOxygenTime] = useState<string>('');
    const [vo2Time, setVo2Time] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            await initHealthConnect();

            const totalCalories = await fetchTodayCalories();
            setCalories(totalCalories);

            const totalSteps = await getTodaySteps();
            setSteps(totalSteps);

            const heart = await fetchLatestHeartRate();
            if (heart) {
                setHeartRate(heart.bpm);
                setHeartRateTime(heart.time);
            }

            const sleep = await fetchTodaySleepHours();
            setSleepHours(sleep);

            const oxygen = await fetchLatestOxygenSaturation();
            if (oxygen) {
                setOxygenSaturation(oxygen.percentage);
                setOxygenTime(oxygen.time);
            }

            const vo2 = await fetchLatestVo2Max();
            if (vo2) {
                setVo2Max(vo2.vo2);
                setVo2Time(vo2.time);
            }
        };

        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Health</Text>

            <TopStatsRow calories={calories} steps={steps} moveMinutes={moveMinutes} />

            <View style={styles.bottomCards}>
                <SleepCard sleepHours={sleepHours} style={styles.halfCard} />
                <TouchableOpacity
                    style={styles.halfCard}
                    onPress={() => navigation.navigate('HeartRateHistory')} // ✅ artık MainStack üzerinden yönlendirme yapılacak
                >
                    <HeartRateCard bpm={heartRate ?? 0} time={heartRateTime} />
                </TouchableOpacity>
                <OxygenSaturationCard percentage={oxygenSaturation ?? 0} time={oxygenTime} style={styles.halfCard} />
                <Vo2MaxCard vo2max={vo2Max ?? 0} time={vo2Time} style={styles.halfCard} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    bottomCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    halfCard: {
        width: '48%',
    },
});

export default DashboardScreen;
